
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, DollarSign, Home, MapPin } from "lucide-react";

type SearchBarProps = {
  activeTab: "buy" | "rent" | "sell";
};

const SearchBar = ({ activeTab }: SearchBarProps) => {
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  
  // For sell tab
  const [propertySize, setPropertySize] = useState("");
  const [propertyAge, setPropertyAge] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ activeTab, propertyType, location, priceRange, bedrooms, propertySize, propertyAge });
    // In a real app, this would trigger a search with these parameters
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Common fields for all tabs */}
        <div className="md:col-span-3">
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="condo">Condo</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-4">
          <Input 
            type="text" 
            placeholder="Location" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full"
          />
        </div>
        
        {/* Conditional fields based on active tab */}
        {activeTab !== "sell" && (
          <div className="md:col-span-3">
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={activeTab === "buy" ? "Price Range" : "Rent Range"} />
              </SelectTrigger>
              <SelectContent>
                {activeTab === "buy" ? (
                  <>
                    <SelectItem value="0-100000">$0 - $100,000</SelectItem>
                    <SelectItem value="100000-300000">$100,000 - $300,000</SelectItem>
                    <SelectItem value="300000-500000">$300,000 - $500,000</SelectItem>
                    <SelectItem value="500000-1000000">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1000000+">$1,000,000+</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="0-1000">$0 - $1,000/mo</SelectItem>
                    <SelectItem value="1000-2000">$1,000 - $2,000/mo</SelectItem>
                    <SelectItem value="2000-3000">$2,000 - $3,000/mo</SelectItem>
                    <SelectItem value="3000-5000">$3,000 - $5,000/mo</SelectItem>
                    <SelectItem value="5000+">$5,000+/mo</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {activeTab === "sell" && (
          <>
            <div className="md:col-span-3">
              <Select value={propertySize} onValueChange={setPropertySize}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Property Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1000">0 - 1,000 sq ft</SelectItem>
                  <SelectItem value="1000-2000">1,000 - 2,000 sq ft</SelectItem>
                  <SelectItem value="2000-3000">2,000 - 3,000 sq ft</SelectItem>
                  <SelectItem value="3000+">3,000+ sq ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        <div className="md:col-span-2">
          <Button 
            type="submit" 
            className="w-full bg-realestate-600 hover:bg-realestate-700"
          >
            <Search className="h-4 w-4 mr-2" />
            {activeTab === "sell" ? "List" : "Search"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
