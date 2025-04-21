import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, DollarSign, Loader2 } from "lucide-react";

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

const Properties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/rent");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin w-12 h-12 text-realestate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Properties for Sale</h1>
        {properties.length === 0 ? (
          <p className="text-center text-gray-600">No properties found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {properties.map((property) => (
              <Card
                key={property._id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/property/${property._id}`)}
              >
                {property.images && property.images.length > 0 && (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                )}
                <CardHeader>
                  <CardTitle className="truncate">{property.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {property.location.city}, {property.location.state}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Bed className="w-4 h-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Bath className="w-4 h-4" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="w-4 h-4" /> {property.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
