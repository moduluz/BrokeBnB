import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Home, Settings, LogOut, Edit, UserX } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { transactionsApi, propertiesApi, userApi } from "@/services/api";
import { User as UserType } from '../types/user';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { RemoveTenantModal } from "@/components/RemoveTenantModal";

interface Transaction {
  _id: string;
  property: Property;
  paidBy: UserType;
  paidTo: UserType;
  startDate: string;
  endDate: string;
  status: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: string[];
  owner: UserType;
  status: string;
  createdAt: string;
  updatedAt: string;
  currentTenant?: {
    _id: string;
    name: string;
    email: string;
  };
}

const Profile = () => {
  const { user, isAuthenticated, updateUser, logout, isLoading: isAuthLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [ownedProperties, setOwnedProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showRemoveTenantModal, setShowRemoveTenantModal] = useState(false);
  const [rentedProperties, setRentedProperties] = useState<Property[]>([]);
  const [purchasedProperties, setPurchasedProperties] = useState<Property[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/signin");
      return;
    }

    // Update form data when user changes
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    
    setIsLoading(false);
  }, [isAuthenticated, navigate, user, isAuthLoading]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingTransactions(true);
        const response = await transactionsApi.getAll();
        if (!response.data) {
          throw new Error("No data received from server");
        }
        
        // Process transactions to ensure valid properties
        const processedTransactions = (response.data as any[]).map(transaction => {
          // Ensure each transaction has a valid property object
          if (!transaction.property) {
            transaction.property = {
              title: 'Property not found',
              location: {
                address: 'N/A',
                city: 'N/A',
                state: 'N/A',
                zipCode: 'N/A'
              }
            };
          }
          return transaction;
        });
        
        setTransactions(processedTransactions as Transaction[]);
      } catch (error: any) {
        console.error("Error fetching transactions:", error);
        toast.error("Failed to load transaction history");
        setTransactions([]);
      } finally {
        setLoadingTransactions(false);
      }
    };

    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchOwnedProperties = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingProperties(true);
        const response = await propertiesApi.getOwned();
        if (!response.data) {
          toast.error("Failed to fetch properties");
          return;
        }
        if (response.data) {
          setOwnedProperties(response.data as Property[]);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load your properties");
      } finally {
        setLoadingProperties(false);
      }
    };

    // Fetch properties rented by the user
    const fetchRentedProperties = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingProperties(true);
        // Use the new rent transactions endpoint to check rental status
        const response = await transactionsApi.checkRentedStatus();
        if (!response.data) {
          setRentedProperties([]);
          return;
        }
        
        console.log("Rented status:", response.data);
        if (response.data.properties && response.data.properties.length > 0) {
          setRentedProperties(response.data.properties);
        } else {
          setRentedProperties([]);
        }
      } catch (error) {
        console.error("Error fetching rented properties:", error);
        setRentedProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };
    
    // Fetch properties purchased by the user
    const fetchPurchasedProperties = async () => {
      if (!isAuthenticated) return;

      try {
        setLoadingProperties(true);
        const response = await propertiesApi.getPurchased();
        if (!response.data) {
          setPurchasedProperties([]);
          return;
        }
        
        setPurchasedProperties(response.data);
        console.log("Purchased properties:", response.data);
      } catch (error) {
        console.error("Error fetching purchased properties:", error);
        setPurchasedProperties([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    if (isAuthenticated) {
      fetchOwnedProperties();
      fetchRentedProperties();
      fetchPurchasedProperties();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const validateProfileData = () => {
    const errors: string[] = [];
    
    if (!formData.name?.trim()) {
      errors.push("Name is required");
    }
    
    if (!formData.email?.trim()) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }
    
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.push("Please enter a valid phone number");
    }
    
    return errors;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateProfileData();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => toast.error(error));
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await userApi.updateProfile(formData);
      if (response.data) {
        updateUser(formData);
        toast.success("Profile updated successfully");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleDeleteProperty = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      return;
    }

    setPropertyToDelete(propertyId);
    setIsDeletingProperty(true);
    try {
      await propertiesApi.delete(propertyId);
      setOwnedProperties(prevProperties => 
        prevProperties.filter(property => property._id !== propertyId) as Property[]
      );
      toast.success("Property deleted successfully");
    } catch (error) {
      toast.error("Failed to delete property");
    } finally {
      setPropertyToDelete(null);
      setIsDeletingProperty(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await userApi.updatePassword(passwordData.newPassword);
      if (response.data) {
        toast.success("Password updated successfully");
        setPasswordData({ newPassword: "", confirmPassword: "" });
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("An error occurred while updating your password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleRemoveTenant = (property: Property) => {
    if (property.currentTenant) {
      setSelectedProperty(property);
      setShowRemoveTenantModal(true);
    }
  };

  const handleTenantRemovalSuccess = () => {
    // Refresh the properties list after tenant removal
    setOwnedProperties(prevProperties => 
      prevProperties.map(property => {
        if (property._id === selectedProperty?._id) {
          return { ...property, currentTenant: null };
        }
        return property;
      }) as Property[]
    );
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-realestate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My BrokeBNB Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-realestate-100 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-realestate-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{formData.name || formData.email}</h2>
                    <p className="text-gray-500">{formData.email}</p>
                    
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="mt-6 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="properties">My Properties</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details here.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdateProfile}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          type="submit" 
                          className="bg-realestate-600 hover:bg-realestate-700"
                          disabled={isUpdatingProfile}
                        >
                          {isUpdatingProfile ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="properties">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Properties & Transactions</CardTitle>
                      <CardDescription>
                        Manage your decentralized property listings and transaction history.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">My Listed Properties</h3>
                        {loadingProperties ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : ownedProperties.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {ownedProperties.map((property) => (
                              <Card key={property._id} className="w-full overflow-hidden">
                                <div className="h-32 bg-gray-200 relative">
                                  {property.images && property.images.length > 0 ? (
                                    <img 
                                      src={typeof property.images[0] === 'string' ? 
                                        property.images[0] : 
                                        (property.images[0] as any)?.url} 
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/300x150?text=Property";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      property.status === 'available' 
                                        ? 'bg-green-100 text-green-800' 
                                        : property.status === 'rented'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <CardHeader>
                                  <CardTitle className="truncate">{property.title}</CardTitle>
                                  <CardDescription className="truncate">
                                    {property.location.address}, {property.location.city}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">₹{property.price.toLocaleString()}/month</p>
                                    
                                    {property.currentTenant ? (
                                      <div className="flex flex-col space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <div className="flex-1">Current tenant: <span className="font-medium">{property.currentTenant.name}</span></div>
                                          <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => handleRemoveTenant(property)}
                                            className="ml-2"
                                          >
                                            <UserX className="h-4 w-4 mr-1" />
                                            Remove Tenant
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">No current tenant</p>
                                    )}
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <Button variant="outline" onClick={() => navigate(`/property/${property._id}`)}>
                                    View Details
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteProperty(property._id)}
                                    disabled={isDeletingProperty && propertyToDelete === property._id}
                                  >
                                    {isDeletingProperty && propertyToDelete === property._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      "Delete"
                                    )}
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Properties Listed</h3>
                            <p className="text-gray-500 mb-6">
                              You haven't listed any properties yet.
                            </p>
                            <Button 
                              className="bg-realestate-600 hover:bg-realestate-700" 
                              onClick={() => navigate("/sell")}
                            >
                              List a Property
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Properties I'm Renting (via Smart Contract)</h3>
                        {loadingProperties ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : rentedProperties.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {rentedProperties.map((property) => (
                              <Card key={property._id} className="w-full overflow-hidden">
                                <div className="h-32 bg-gray-200 relative">
                                  {property.images && property.images.length > 0 ? (
                                    <img 
                                      src={typeof property.images[0] === 'string' ? 
                                        property.images[0] : 
                                        (property.images[0] as any)?.url} 
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/300x150?text=Property";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                      Renting
                                    </span>
                                  </div>
                                </div>
                                <CardHeader>
                                  <CardTitle className="truncate">{property.title}</CardTitle>
                                  <CardDescription className="truncate">
                                    {property.location.address}, {property.location.city}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">₹{property.price.toLocaleString()}/month</p>
                                    
                                    {property.owner && (
                                      <div className="flex flex-col space-y-1">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <div className="flex-1">Owner: <span className="font-medium">{property.owner.name}</span></div>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                          <div className="flex-1">Contact: <span className="font-medium">{property.owner.email}</span></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <Button variant="outline" onClick={() => navigate(`/property/${property._id}`)}>
                                    View Details
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Rented Properties</h3>
                            <p className="text-gray-500 mb-6">
                              You are not currently renting any properties.
                            </p>
                            <Button 
                              className="bg-realestate-600 hover:bg-realestate-700" 
                              onClick={() => navigate("/")}
                            >
                              Browse Properties
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Properties I've Purchased</h3>
                        {loadingProperties ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : purchasedProperties.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {purchasedProperties.map((property) => (
                              <Card key={property._id} className="w-full overflow-hidden">
                                <div className="h-32 bg-gray-200 relative">
                                  {property.images && property.images.length > 0 ? (
                                    <img 
                                      src={typeof property.images[0] === 'string' ? 
                                        property.images[0] : 
                                        (property.images[0] as any)?.url} 
                                      alt={property.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "https://via.placeholder.com/300x150?text=Property";
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Home className="h-10 w-10 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="absolute top-2 right-2">
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                      Purchased
                                    </span>
                                  </div>
                                </div>
                                <CardHeader>
                                  <CardTitle className="truncate">{property.title}</CardTitle>
                                  <CardDescription className="truncate">
                                    {property.location.address}, {property.location.city}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-2">
                                    <p className="text-sm font-medium">₹{property.price.toLocaleString()}</p>
                                    
                                    {property.owner && (
                                      <div className="flex flex-col space-y-1">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <div className="flex-1">Previous Owner: <span className="font-medium">{property.owner.name}</span></div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                  <Button variant="outline" onClick={() => navigate(`/property/${property._id}`)}>
                                    View Details
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Purchased Properties</h3>
                            <p className="text-gray-500 mb-6">
                              You haven't purchased any properties yet.
                            </p>
                            <Button 
                              className="bg-realestate-600 hover:bg-realestate-700" 
                              onClick={() => navigate("/")}
                            >
                              Browse Properties to Buy
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Blockchain Transaction History</h3>
                        {loadingTransactions ? (
                          <div className="text-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : transactions.length > 0 ? (
                          <div className="space-y-4">
                            {transactions.filter(t => t).map((transaction) => (
                              <Card key={transaction._id}>
                                <CardContent className="p-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold">{transaction.property?.title || 'Property not found'}</h4>
                                      <p className="text-sm text-gray-500">
                                        {transaction.property?.location ? 
                                          `${transaction.property.location.address}, ${transaction.property.location.city}, ${transaction.property.location.state}, ${transaction.property.location.zipCode}` 
                                          : 'Location not available'}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                                      <p className="text-sm text-gray-500">
                                        {new Date(transaction.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="mt-2">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      transaction.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium mb-2">No Transactions Yet</h3>
                            <p className="text-gray-500 mb-6">
                              You haven't made any property purchases yet.
                            </p>
                            <Button 
                              className="bg-realestate-600 hover:bg-realestate-700" 
                              onClick={() => navigate("/properties")}
                            >
                              Browse Properties
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings and preferences.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handlePasswordUpdate}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <Button 
                          type="submit"
                          className="bg-realestate-600 hover:bg-realestate-700"
                          disabled={isUpdatingPassword}
                        >
                          {isUpdatingPassword ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating Password...
                            </>
                          ) : (
                            'Update Password'
                          )}
                        </Button>
                      </CardContent>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Tenant Modal */}
      {selectedProperty && selectedProperty.currentTenant && (
        <RemoveTenantModal
          isOpen={showRemoveTenantModal}
          onClose={() => setShowRemoveTenantModal(false)}
          propertyId={selectedProperty._id}
          propertyTitle={selectedProperty.title}
          tenantName={selectedProperty.currentTenant.name}
          onSuccess={handleTenantRemovalSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
