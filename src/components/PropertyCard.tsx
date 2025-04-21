import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Building, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export interface Property {
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
  status: string;
}

export interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  if (!property) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        {property.status === "rented" && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            Rented
          </div>
        )}
      </div>
      <CardHeader>
        <h3 className="text-lg font-semibold truncate">{property.title}</h3>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm truncate">
            {property.location?.city}, {property.location?.state}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-gray-600" />
            <span className="font-semibold">
              ${property.price?.toLocaleString() || 0}/mo
            </span>
          </div>
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1 text-gray-600" />
            <span>{property.bedrooms || 0} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1 text-gray-600" />
            <span>{property.bathrooms || 0} baths</span>
          </div>
          <div className="flex items-center">
            <Building className="h-4 w-4 mr-1 text-gray-600" />
            <span>{property.propertyType || 'N/A'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/property/${property._id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;
