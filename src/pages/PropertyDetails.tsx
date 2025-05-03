import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { 
  Bath, 
  Bed, 
  Calendar, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Home, 
  MapPin, 
  Maximize2, 
  Share2,
  Loader2,
  Square,
  DollarSign,
  Building,
  UserX,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PurchaseConfirmationModal } from "@/components/PurchaseConfirmationModal";
import { RemoveTenantModal } from "@/components/RemoveTenantModal";
import { useWeb3 } from '../contexts/Web3Context';
import { usePropertyContract } from '../hooks/usePropertyContract';
import { ethers } from 'ethers';
import { TransactionHistory } from '@/components/TransactionHistory';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { transactionsApi, propertiesApi } from '@/services/api';

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  rentalPrice: number;
  purchasePrice: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  status: 'available' | 'sold' | 'rented' | 'pending';
  listingType: 'rent' | 'sale' | 'both';
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  currentTenant?: {
    _id: string;
    name: string;
    email: string;
  };
  images: Array<{
    url: string;
    public_id: string;
  }>;
  amenities: string[];
  specifications: {
    yearBuilt: number;
    parking: string;
    heating: string;
    cooling: string;
  };
  reviews: {
    rating: number;
    comment: string;
    user: {
      _id: string;
      name: string;
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const { isConnected, connect, address } = useWeb3();
  const { buyProperty, listProperty, isPropertyOwnedByUser, getContract } = usePropertyContract();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showRemoveTenantModal, setShowRemoveTenantModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'traditional' | 'blockchain'>('traditional');
  const [transactions, setTransactions] = useState<any[]>([]);

  const isOwner = user && property?.owner && user.id === property.owner._id;
  const hasTenant = property?.currentTenant && property.currentTenant._id;

  const fetchData = async () => {
    if (!id) {
      setLoading(false);
      navigate('/404');
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching property data for:", id);
      const propertyResponse = await propertiesApi.getById(id);
      if (!propertyResponse.data) {
        throw new Error('Property not found');
      }
      setProperty(propertyResponse.data);
      console.log("Property data fetched:", propertyResponse.data);

      try {
        console.log("Fetching transaction data for:", id);
        const transactionResponse = await transactionsApi.getByPropertyId(id);
        console.log("Transaction data fetched:", transactionResponse.data);
        setTransactions(transactionResponse.data || []);
      } catch (transactionError) {
        console.error('Error fetching property transactions:', transactionError);
        setTransactions([]);
      }

    } catch (error: any) {
      console.error('Error fetching property details:', error);
      toast({
        title: "Error",
        description: "Failed to load property details",
        variant: "destructive",
      });
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, navigate]);

  const refreshData = () => {
    fetchData();
  };

  const handleDelete = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please sign in to delete this property.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      toast({
        title: "Success",
        description: "Property deleted successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    }
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images!.length);
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images!.length) % property.images!.length);
    }
  };

  const handleRent = async (paymentDetails: any) => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to rent this property.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    if (!property) return;

    setIsActionLoading(true);
    try {
      let useTraditionalPayment = selectedPaymentMethod === 'traditional';

      if (selectedPaymentMethod === 'blockchain') {
        if (!isConnected) {
          try {
            await connect();
          } catch (error) {
            toast({
              title: "Connection Failed",
              description: "Failed to connect to your wallet. Please try again.",
              variant: "destructive",
            });
            return;
          }
        }

        const monthlyRent = property.rentalPrice || property.price;
        if (!monthlyRent || isNaN(monthlyRent) || monthlyRent <= 0) {
          toast({
            title: "Invalid Price",
            description: "The rental price is not properly set for this property. Please contact the owner.",
            variant: "destructive",
          });
          return;
        }

        const totalAmount = monthlyRent * 3;

        const ETH_PRICE_IN_USD = 2000;
        const priceInEth = (totalAmount / ETH_PRICE_IN_USD).toFixed(8);

        let blockchainSuccessful = false;
        try {
          const propertyId = parseInt(property._id);
          
          const isUserOwner = await isPropertyOwnedByUser(propertyId);
          if (isUserOwner) {
            console.log("You already own this property on the blockchain. Can't purchase your own property.");
            
            toast({
              title: "Blockchain Error",
              description: "You cannot purchase your own property on the blockchain. Please use traditional payment instead.",
              variant: "destructive",
            });
            
            console.log("Automatically switching to traditional payment");
            useTraditionalPayment = true;
            paymentDetails = {
              paymentId: `BLOCKCHAIN_OWNERSHIP_CONFLICT_${Date.now()}`,
              paymentDate: new Date(),
              bankDetails: {
                accountNumber: 'OWNERSHIP_CONFLICT',
                routingNumber: 'TRADITIONAL',
                bankName: 'Traditional Payment (Blockchain Ownership Conflict)'
              }
            };
          } else {
            try {
              const listResult = await listProperty(propertyId, priceInEth);
              console.log("Property listed or already available:", listResult);
              
              if (listResult.alreadyOwned) {
                toast({
                  title: "Blockchain Error",
                  description: "You already own this property on the blockchain. Using traditional payment instead.",
                  variant: "destructive",
                });
                
                useTraditionalPayment = true;
                paymentDetails = {
                  paymentId: `BLOCKCHAIN_OWNERSHIP_CONFLICT_${Date.now()}`,
                  paymentDate: new Date(),
                  bankDetails: {
                    accountNumber: 'OWNERSHIP_CONFLICT',
                    routingNumber: 'TRADITIONAL',
                    bankName: 'Traditional Payment (Blockchain Ownership Conflict)'
                  }
                };
              } else {
                try {
                  const tx = await buyProperty(propertyId, priceInEth);
                  
                  paymentDetails = {
                    transactionHash: tx.hash,
                    network: 'Ethereum',
                    tokenAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0',
                    tokenSymbol: 'ETH'
                  };
                  
                  console.log("Blockchain transaction successful:", tx.hash);
                  blockchainSuccessful = true;
                } catch (buyError: any) {
                  console.error('Blockchain transaction error:', buyError);
                  
                  if (buyError.message && buyError.message.includes("cannot purchase your own property")) {
                    toast({
                      title: "Blockchain Error",
                      description: "You cannot purchase your own property on the blockchain. Using traditional payment instead.",
                      variant: "destructive",
                    });
                  } else {
                    toast({
                      title: "Blockchain Transaction Failed",
                      description: buyError.message || "Transaction failed. We've automatically switched to traditional payment to complete your transaction.",
                      variant: "default",
                    });
                  }
                  
                  console.log("Automatically falling back to traditional payment method");
                  useTraditionalPayment = true;
                  paymentDetails = {
                    paymentId: `FALLBACK_${Date.now()}`,
                    paymentDate: new Date(),
                    bankDetails: {
                      accountNumber: 'FALLBACK_METHOD',
                      routingNumber: 'FALLBACK',
                      bankName: 'Traditional Payment (Auto-Fallback)'
                    }
                  };
                }
              }
            } catch (listError: any) {
              console.error('Error listing property:', listError);
              
              toast({
                title: "Blockchain Error",
                description: listError.message || "Failed to list property on blockchain. Using traditional payment instead.",
                variant: "default",
              });
              
              useTraditionalPayment = true;
              paymentDetails = {
                paymentId: `LIST_ERROR_${Date.now()}`,
                paymentDate: new Date(),
                bankDetails: {
                  accountNumber: 'LIST_ERROR',
                  routingNumber: 'FALLBACK',
                  bankName: 'Traditional Payment (Listing Error)'
                }
              };
            }
          }
        } catch (error: any) {
          console.error('Blockchain error:', error);
          toast({
            title: "Blockchain Error",
            description: error.message || "Error accessing blockchain. Switching to traditional payment.",
            variant: "destructive",
          });
          
          useTraditionalPayment = true;
          paymentDetails = {
            paymentId: `FALLBACK_ERROR_${Date.now()}`,
            paymentDate: new Date(),
            bankDetails: {
              accountNumber: 'FALLBACK_METHOD',
              routingNumber: 'FALLBACK',
              bankName: 'Traditional Payment (Blockchain Error)'
            }
          };
        }
      }
      
      const response = await transactionsApi.create({
        propertyId: property._id,
        type: 'rent',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        rentAmount: property.rentalPrice || property.price,
        depositAmount: (property.rentalPrice || property.price) * 2,
        paymentMethod: useTraditionalPayment ? 'bank_transfer' : 'blockchain',
        leaseTerms: {
          minDuration: 12,
          noticePeriod: 30,
          utilities: ['water', 'electricity'],
          furnished: property.amenities?.includes('furnished') || false
        },
        paymentDetails
      });

      toast({
        title: "Rental Successful!",
        description: `You have successfully rented ${property.title}`,
      });

      const propertyResponse = await propertiesApi.getById(property._id);
      setProperty(propertyResponse.data);
      
      setShowRentModal(false);
    } catch (error: any) {
      console.error('Rental error:', error);
      toast({
        title: "Rental Failed",
        description: error.message || "Failed to rent property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTraditionalPurchase = async () => {
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase this property.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();
      
      if (isExpired) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        localStorage.removeItem('token');
        navigate("/signin");
        return;
      }
    } catch (error) {
      console.error('Error parsing token:', error);
      toast({
        title: "Authentication Error",
        description: "Please sign in again.",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    if (!property) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/properties/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'purchase',
          paymentMethod: 'traditional',
          amount: property.purchasePrice || property.price || 1000000,
          status: 'completed',
          traditionalDetails: {
            paymentId: `CASH_${Date.now()}`,
            paymentDate: new Date(),
            receiptUrl: 'cash-payment',
            bankDetails: {
              accountNumber: 'CASH_PAYMENT',
              routingNumber: 'NA',
              bankName: 'Cash Transaction'
            }
          }
        }),
      });

      if (response.status === 401) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please sign in again.",
          variant: "destructive",
        });
        navigate("/signin");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to purchase property');
      }

      const { property: updatedProperty } = await response.json();

      toast({
        title: "Purchase Successful!",
        description: `You have successfully purchased ${property.title}`,
      });

      setProperty(updatedProperty);
    } catch (error) {
      console.error('Purchase error:', error);
      if (error instanceof Error) {
        if (error.message.includes('own property')) {
          toast({
            title: "Purchase Not Allowed",
            description: "You cannot purchase your own property",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Purchase Failed",
            description: error.message || "Failed to complete purchase",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Purchase Failed",
          description: "Failed to complete purchase",
          variant: "destructive",
        });
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleBlockchainPurchase = async () => {
    if (!isConnected) {
      try {
        await connect();
        // Add delay to ensure wallet is properly connected
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to your wallet. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!property || !id || !token) return;

    // Verify contract initialization before proceeding
    try {
      const contract = getContract();
      if (!contract) {
        toast({
          title: "Contract Error",
          description: "Smart contract is not initialized. Please check your connection to Ethereum network.",
          variant: "destructive",
        });
        return;
      }
    } catch (contractError) {
      toast({
        title: "Contract Error",
        description: "Failed to initialize smart contract. Please check your network connection.",
        variant: "destructive",
      });
      console.error("Contract initialization error:", contractError);
      return;
    }

    setIsActionLoading(true);
    try {
      if (!property.purchasePrice || isNaN(property.purchasePrice) || property.purchasePrice <= 0) {
        const finalPrice = property.purchasePrice || property.price || 0;
        if (finalPrice <= 0) {
          toast({
            title: "Invalid Price",
            description: "The property's purchase price is not properly set. Please contact the owner.",
            variant: "destructive",
          });
          return;
        }
        property.purchasePrice = finalPrice;
      }

      const priceInUSD = property.purchasePrice;
      const ETH_PRICE_IN_USD = 2000;
      const priceInEth = (priceInUSD / ETH_PRICE_IN_USD).toFixed(8);
      
      const propertyId = parseInt(id);
      const isUserOwner = await isPropertyOwnedByUser(propertyId);
      
      if (isUserOwner) {
        toast({
          title: "Purchase Not Allowed",
          description: "You already own this property on the blockchain. Please use traditional payment.",
          variant: "destructive",
        });
        
        handleTraditionalPurchase();
        return;
      }
      
      try {
        const listResult = await listProperty(propertyId, priceInEth);
        console.log("Property listing result:", listResult);
        
        if (listResult.alreadyOwned) {
          toast({
            title: "Purchase Not Allowed",
            description: "You already own this property on the blockchain. Please use traditional payment.",
            variant: "destructive",
          });
          
          handleTraditionalPurchase();
          return;
        }
        
        const purchaseTx = await buyProperty(propertyId, priceInEth);
        console.log("Purchase transaction successful:", purchaseTx.hash);
        
        const response = await fetch(`http://localhost:5000/api/properties/${id}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            type: 'purchase',
            paymentMethod: 'blockchain',
            amount: property.purchasePrice,
            status: 'completed',
            blockchainDetails: {
              transactionHash: purchaseTx.hash,
              network: 'Ethereum',
              tokenAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0',
              tokenSymbol: 'ETH'
            }
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update property status');
        }

        const { property: updatedProperty } = await response.json();

        toast({
          title: "Purchase Successful!",
          description: `You have successfully purchased ${property.title} for ${priceInEth} ETH`,
        });

        setProperty(updatedProperty);
      } catch (error: any) {
        console.error('Blockchain purchase error:', error);
        
        // Provide a helpful error message
        let errorMessage = "Failed to purchase property via blockchain.";
        
        if (error.message) {
          if (error.message.includes("cannot purchase your own property")) {
            errorMessage = "You cannot purchase your own property on the blockchain. Automatically switching to traditional payment.";
            
            // Automatically switch to traditional payment
            toast({
              title: "Switching to Cash Payment",
              description: "Blockchain transaction couldn't complete. Automatically switching to cash payment.",
            });
            handleTraditionalPurchase();
            return;
          } else if (error.message.includes("not for sale")) {
            errorMessage = "This property is not currently marked for sale on the blockchain. Trying cash payment instead.";
            toast({
              title: "Switching to Cash Payment",
              description: "Property not available on blockchain. Automatically switching to cash payment.",
            });
            handleTraditionalPurchase();
            return;
          } else if (error.message.includes("Insufficient")) {
            errorMessage = "You don't have enough ETH to complete this purchase. Switching to cash payment instead.";
            toast({
              title: "Switching to Cash Payment",
              description: "Insufficient ETH in wallet. Automatically switching to cash payment.",
            });
            handleTraditionalPurchase();
            return;
          } else {
            // Use the error message from the exception but also try cash payment
            errorMessage = error.message;
            toast({
              title: "Blockchain Transaction Failed",
              description: "Transaction couldn't complete. Automatically switching to cash payment.",
              variant: "default",
            });
            handleTraditionalPurchase();
            return;
          }
        } else {
          // Generic error - still try cash payment
          toast({
            title: "Blockchain Error",
            description: "Unknown blockchain error occurred. Automatically switching to cash payment.",
            variant: "default",
          });
          handleTraditionalPurchase();
          return;
        }
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Process Failed",
        description: error.message || "Failed to purchase property. Please try again or use cash payment.",
        variant: "destructive",
      });
      
      // Final fallback for any other errors in the overall purchase flow
      try {
        toast({
          title: "Attempting Cash Payment",
          description: "Trying to complete your purchase with cash payment as a last resort.",
        });
        handleTraditionalPurchase();
      } catch (fallbackError) {
        console.error('Final fallback error:', fallbackError);
        setIsActionLoading(false);
      }
    } finally {
      setIsActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-realestate-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-center text-gray-600">Property not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative">
            {property.images && property.images.length > 0 ? (
              <>
                <img
                  src={property.images[currentImageIndex].url}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                  }}
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {property.images.map((image, index) => (
                    <button
                      key={image.public_id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                        currentImageIndex === index ? "ring-2 ring-realestate-600" : ""
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${property.title} - ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{property.title}</h1>
              <p className="text-gray-600 mt-2">{property.description}</p>
              {property.owner && (
                <p className="text-sm text-gray-500 mt-2">
                  Listed by: {property.owner.name}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>
                  {property.location?.address}, {property.location?.city},{" "}
                  {property.location?.state} {property.location?.zipCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <span className="text-xl font-bold">
                  ₹{property.price?.toLocaleString() || 0}/mo
                </span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-gray-600" />
                <span>{property.bedrooms || 0} beds</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-gray-600" />
                <span>{property.bathrooms || 0} baths</span>
              </div>
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2 text-gray-600" />
                <span>{property.propertyType || 'N/A'}</span>
              </div>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              {property?.status === 'available' && (
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                  {property.listingType !== 'rent' && (
                    <Button
                      onClick={handleBlockchainPurchase}
                      disabled={isActionLoading}
                      className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition flex-grow"
                      variant="default"
                    >
                      {isActionLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Zap className="h-4 w-4 mr-2" /> 
                          Purchase with ETH (₹{property.purchasePrice || property.price || 'Price not set'})
                        </div>
                      )}
                    </Button>
                  )}
                  
                  {property.listingType !== 'sale' && (
                    <Button
                      onClick={() => setShowRentModal(true)}
                      disabled={isActionLoading}
                      variant="outline"
                      className="w-full md:w-auto flex-grow"
                    >
                      {isActionLoading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Rent for ₹${property.rentalPrice}/month`
                      )}
                    </Button>
                  )}

                  {property.listingType !== 'rent' && (
                      <Button
                        onClick={handleTraditionalPurchase}
                        disabled={isActionLoading}
                        variant="outline"
                        className="w-full md:w-auto flex-grow"
                      >
                        {isActionLoading ? (
                          <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </div>
                        ) : (
                          `Purchase with INR (Legacy)`
                        )}
                      </Button>
                  )}
                </div>
              )}

              {property?.status !== 'available' && (
                <p className="text-sm text-gray-500 mt-2">
                  This property is currently {property?.status}
                </p>
              )}

              <Button
                className="w-full bg-realestate-600 hover:bg-realestate-700"
                onClick={() => {
                  if (!token) {
                    toast({
                      variant: "destructive",
                      description: "Please sign in to contact the owner.",
                    });
                    navigate("/signin");
                    return;
                  }
                  // TODO: Implement contact owner functionality
                  toast({
                    description: "This feature will be implemented soon.",
                  });
                }}
              >
                Contact Owner
              </Button>

              {token && user && property?.owner?._id === user._id && (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/edit-property/${property._id}`)}
                  >
                    Edit Property
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDelete}
                  >
                    Delete Property
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          {isActionLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-realestate-600" />
              <span className="ml-2">Loading transaction history...</span>
            </div>
          ) : (
            <TransactionHistory propertyId={id} />
          )}
        </div>
      </div>

      <PurchaseConfirmationModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        propertyId={property._id}
        propertyTitle={property.title}
        price={property.price}
        type="purchase"
      />

      {/* Rent Modal */}
      <Dialog open={showRentModal} onOpenChange={setShowRentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rent Property via Smart Contract</DialogTitle>
            <DialogDescription>
              Choose your payment method. Blockchain payments are preferred for transparency.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-md text-sm">
                <h4 className="font-semibold mb-1">Blockchain Payment Limitations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>You <strong>cannot purchase properties you own</strong> on the blockchain</li>
                  <li>The smart contract prevents owners from buying their own properties</li>
                  <li>If blockchain fails, traditional payment is the reliable alternative</li>
                </ul>
                <p className="mt-2 font-medium">Consider blockchain for enhanced security and transparency.</p>
              </div>
              <Button
                variant={selectedPaymentMethod === 'blockchain' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('blockchain')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Zap className="h-4 w-4 mr-2" /> 
                Blockchain Payment (ETH)
              </Button>
              <Button
                variant={selectedPaymentMethod === 'traditional' ? 'default' : 'outline'}
                onClick={() => setSelectedPaymentMethod('traditional')}
                className="w-full"
              >
                Legacy Payment (INR)
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              {property && (
                <>
                  <p>Monthly Rent: ₹{(property.rentalPrice || property.price || 0).toLocaleString()}</p>
                  <p>Security Deposit: ₹{((property.rentalPrice || property.price || 0) * 2).toLocaleString()}</p>
                  <p>Total Due Now (Rent + Deposit): ₹{((property.rentalPrice || property.price || 0) * 3).toLocaleString()}</p>
                </>
              )}
            </div>

            <Button
              onClick={() => handleRent({
                paymentId: `RENT_${Date.now()}`,
                bankDetails: selectedPaymentMethod === 'traditional' ? {
                  accountNumber: 'DEMO_ACC',
                  routingNumber: 'DEMO_ROUTE',
                  bankName: 'Demo Bank'
                } : undefined,
                transactionHash: selectedPaymentMethod === 'blockchain' ? '0x' + Date.now().toString(16) : undefined,
                network: 'Ethereum',
                tokenAddress: import.meta.env.VITE_CONTRACT_ADDRESS || '0x0',
                tokenSymbol: 'ETH'
              })}
              disabled={isActionLoading || !(property?.rentalPrice || property?.price)}
            >
              {isActionLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Confirm Rent"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal for removing tenant */}
      {property.currentTenant && (
        <RemoveTenantModal
          isOpen={showRemoveTenantModal}
          onClose={() => setShowRemoveTenantModal(false)}
          propertyId={property._id}
          propertyTitle={property.title}
          tenantName={property.currentTenant.name}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default PropertyDetails;
