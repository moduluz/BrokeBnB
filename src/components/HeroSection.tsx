
import { useState } from "react";
import SearchBar from "./SearchBar";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "sell">("buy");

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-realestate-800 to-realestate-600 h-[500px]" />
      
      {/* Content Container */}
      <div className="relative container mx-auto px-4 pt-20 pb-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Discover thousands of properties for sale and rent across the country. Your dream home is just a search away.
          </p>
          
          {/* Property Type Tabs */}
          <div className="inline-flex rounded-lg bg-white/10 p-1 mb-10">
            <button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "buy" 
                  ? "bg-white text-realestate-700" 
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("buy")}
            >
              Buy
            </button>
            <button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "rent" 
                  ? "bg-white text-realestate-700" 
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("rent")}
            >
              Rent
            </button>
            <button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "sell" 
                  ? "bg-white text-realestate-700" 
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("sell")}
            >
              Sell
            </button>
          </div>
        </div>
        
        {/* Search Bar with Active Tab */}
        <div className="mt-8">
          <SearchBar activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
