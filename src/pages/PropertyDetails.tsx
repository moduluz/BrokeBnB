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
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

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
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images?: Array<{
    url: string;
    public_id: string;
  }>;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/rent/${id}`);
        if (!response.ok) {
          throw new Error("Property not found");
        }
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        toast({
          variant: "destructive",
          description: "Failed to load property details",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

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
      const response = await fetch(`http://localhost:5000/api/rent/${id}`, {
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
                <DollarSign className="h-5 w-5 mr-2 text-gray-600" />
                <span className="text-lg font-semibold">
                  ${property.price?.toLocaleString() || 0}/mo
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

            <div className="pt-4">
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

              {token && user && property.owner?._id === user._id && (
                <div className="mt-4 space-y-2">
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
      </div>
    </div>
  );
};

export default PropertyDetails;
