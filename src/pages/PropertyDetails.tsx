
import { useParams } from "react-router-dom";
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
  Share2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { PropertyCardProps } from "@/components/PropertyCard";

// Mock property data - in a real app, you would fetch this from an API
const propertyData: Record<string, PropertyCardProps & { 
  description: string;
  features: string[];
  images: string[];
}> = {
  "1": {
    id: "1",
    title: "Modern Apartment in Downtown",
    address: "123 Main St, New York, NY 10001",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Apartment",
    listingType: "sale",
    description: "This beautiful modern apartment is located in the heart of downtown. The property features an open concept design with high-end finishes throughout. The kitchen is equipped with stainless steel appliances and quartz countertops. Large windows offer abundant natural light and stunning city views. The building offers amenities including a gym, rooftop terrace, and 24-hour concierge.",
    features: [
      "Hardwood flooring",
      "Central air conditioning",
      "In-unit washer and dryer",
      "Stainless steel appliances",
      "Walk-in closets",
      "Balcony",
      "Pet-friendly building",
      "Fitness center access",
      "Rooftop terrace"
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
    ]
  },
  "2": {
    id: "2",
    title: "Luxury Condo with Ocean View",
    address: "456 Ocean Ave, Miami, FL 33139",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2100,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Condo",
    listingType: "sale",
    description: "Stunning luxury condo with breathtaking ocean views. This property features an open floor plan with floor-to-ceiling windows showcasing panoramic ocean vistas. The gourmet kitchen includes top-of-the-line appliances and marble countertops. The primary suite offers a spa-like bathroom and walk-in closet. The unit comes with two assigned parking spaces and access to building amenities including a pool, fitness center, and concierge service.",
    features: [
      "Ocean views",
      "Marble flooring",
      "Smart home technology",
      "Wine refrigerator",
      "Custom cabinetry",
      "Private balcony",
      "Pool and spa access",
      "Private beach access",
      "24/7 security"
    ],
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    ]
  },
  // More properties would be defined here...
};

const PropertyDetails = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Get property data based on ID
  const property = id && propertyData[id] ? propertyData[id] : null;
  
  // If property not found, show error message
  if (!property) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h1>
          <p className="text-gray-600 mb-8">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  // Format price with commas and dollar sign
  const formattedPrice = property.price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  
  // Handle image navigation
  const nextImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setActiveImageIndex((prevIndex) => 
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      <Navbar />
      
      <main className="pb-16">
        {/* Property Image Gallery */}
        <div className="relative h-[60vh] bg-gray-200">
          <img 
            src={property.images[activeImageIndex]} 
            alt={property.title}
            className="w-full h-full object-cover"
          />
          
          {/* Image Navigation Buttons */}
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          
          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`h-2 w-2 rounded-full ${
                  index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="container mx-auto px-4 mt-8">
          {/* Property Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-5 w-5 mr-1 flex-shrink-0" />
                <span>{property.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-3">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center">
                  <Maximize2 className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{property.area} sq ft</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="font-medium">{property.propertyType}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:text-right">
              <div className="text-3xl font-bold text-realestate-600 mb-2">
                {formattedPrice}
              </div>
              <div className="text-gray-600">
                {property.listingType === "sale" ? "For Sale" : "For Rent"}
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Button className="bg-realestate-600 hover:bg-realestate-700">
                  Contact Agent
                </Button>
                <Button variant="outline" className="border-realestate-600 text-realestate-600 hover:bg-realestate-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Tour
                </Button>
              </div>
            </div>
          </div>
          
          {/* Property Details Tabs */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Property Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-realestate-600 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="location" className="mt-0">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Location</h3>
                {/* In a real app, you would embed a map here */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Map view would be displayed here</p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Nearby Amenities</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    <li>Public Transportation - 0.2 miles</li>
                    <li>Grocery Store - 0.4 miles</li>
                    <li>Schools - 0.7 miles</li>
                    <li>Parks - 0.5 miles</li>
                    <li>Restaurants - 0.3 miles</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Contact Section */}
          <div className="mt-10 bg-gray-50 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Contact our agent to learn more about this property or to schedule a viewing.
                </p>
                <Button className="bg-realestate-600 hover:bg-realestate-700 w-full md:w-auto">
                  Contact Agent
                </Button>
              </div>
              
              <div className="flex items-center bg-white p-4 rounded-lg">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
                    {/* Agent photo would go here */}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">John Smith</h4>
                  <p className="text-gray-600 text-sm">Real Estate Agent</p>
                  <p className="text-gray-600 text-sm">License #: 12345678</p>
                  <p className="text-realestate-600 text-sm">(123) 456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer would be here (same as in Index.tsx) */}
    </div>
  );
};

export default PropertyDetails;
