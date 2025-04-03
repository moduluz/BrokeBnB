
import PropertyCard, { PropertyCardProps } from "./PropertyCard";

// Sample property data
const properties: PropertyCardProps[] = [
  {
    id: "1",
    title: "Modern Apartment in Downtown",
    address: "123 Main St, New York, NY 10001",
    price: 850000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Apartment",
    listingType: "sale"
  },
  {
    id: "2",
    title: "Luxury Condo with Ocean View",
    address: "456 Ocean Ave, Miami, FL 33139",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 3.5,
    area: 2100,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Condo",
    listingType: "sale"
  },
  {
    id: "3",
    title: "Charming Suburban Home",
    address: "789 Oak St, Austin, TX 78701",
    price: 650000,
    bedrooms: 4,
    bathrooms: 2.5,
    area: 2400,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "House",
    listingType: "sale"
  },
  {
    id: "4",
    title: "Downtown Studio Apartment",
    address: "101 Park Ave, Seattle, WA 98101",
    price: 2500,
    pricePerMonth: 2500,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Studio",
    listingType: "rent"
  },
  {
    id: "5",
    title: "Spacious Family Home",
    address: "222 Maple Dr, Portland, OR 97201",
    price: 4200,
    pricePerMonth: 4200,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    imageUrl: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "House",
    listingType: "rent"
  },
  {
    id: "6",
    title: "Urban Loft in Arts District",
    address: "333 Arts Way, Chicago, IL 60607",
    price: 3100,
    pricePerMonth: 3100,
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80",
    propertyType: "Loft",
    listingType: "rent"
  }
];

const FeaturedProperties = () => {
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
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-white border border-realestate-600 text-realestate-600 rounded-lg hover:bg-realestate-50 font-medium transition-colors">
            View All Properties
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
