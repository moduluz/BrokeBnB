import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropertyCard, { Property } from "./PropertyCard";
import { Loader2 } from "lucide-react";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/rent?limit=6');
        
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }

        const data = await response.json();
        
        // Transform the API data to match Property interface
        const transformedProperties = data.map((property: any) => ({
          _id: property._id,
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          propertyType: property.propertyType,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          amenities: property.amenities,
          images: property.images,
          status: property.status
        }));

        setProperties(transformedProperties);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewAll = () => {
    navigate('/properties');
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-realestate-600" />
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our handpicked selection of featured properties across the country.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={handleViewAll}
            className="px-6 py-3 bg-white border border-realestate-600 text-realestate-600 rounded-lg hover:bg-realestate-50 font-medium transition-colors"
          >
            View All Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
