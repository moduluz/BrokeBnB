
import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Bath, Bed, Home, MapPin, Maximize2 } from "lucide-react";

export interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  price: number;
  pricePerMonth?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  imageUrl: string;
  propertyType: string;
  listingType: "sale" | "rent";
}

const PropertyCard = ({ 
  id,
  title, 
  address, 
  price, 
  pricePerMonth,
  bedrooms, 
  bathrooms, 
  area, 
  imageUrl, 
  propertyType,
  listingType 
}: PropertyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Format price with commas and dollar sign
  const formattedPrice = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  // Format price per month if it exists
  const formattedPricePerMonth = pricePerMonth?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

  return (
    <Link to={`/property/${id}`}>
      <Card 
        className="property-card overflow-hidden h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Property Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <Badge 
            className={`absolute top-3 left-3 ${
              listingType === 'sale' ? 'bg-realestate-600' : 'bg-amber-500'
            }`}
          >
            {listingType === 'sale' ? 'For Sale' : 'For Rent'}
          </Badge>
          <Badge className="absolute top-3 right-3 bg-gray-800/80">{propertyType}</Badge>
        </div>
        
        <CardContent className="pt-4">
          <div className="mb-2">
            {listingType === 'sale' ? (
              <h3 className="text-xl font-bold text-gray-800">{formattedPrice}</h3>
            ) : (
              <h3 className="text-xl font-bold text-gray-800">{formattedPricePerMonth}/mo</h3>
            )}
          </div>
          
          <h2 className="text-lg font-semibold line-clamp-1">{title}</h2>
          
          <div className="flex items-center mt-1 text-gray-500">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <p className="text-sm line-clamp-1">{address}</p>
          </div>
          
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-700">{bedrooms} Beds</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-700">{bathrooms} Baths</span>
            </div>
            <div className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-1 text-gray-500" />
              <span className="text-sm text-gray-700">{area} sq ft</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
