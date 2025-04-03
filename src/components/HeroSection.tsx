
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SearchBar from "./SearchBar";

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "rent" | "sell">("buy");
  const navigate = useNavigate();
  const location = useLocation();

  // Set the active tab based on the URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    
    if (tabParam === "buy" || tabParam === "rent" || tabParam === "sell") {
      setActiveTab(tabParam);
      
      // Auto-navigate to sell page if tab is sell
      if (tabParam === "sell" && location.pathname !== "/sell") {
        navigate("/sell");
      }
    }
  }, [location, navigate]);

  const handleTabChange = (tab: "buy" | "rent" | "sell") => {
    setActiveTab(tab);
    
    // Update URL with the active tab
    const params = new URLSearchParams(location.search);
    params.set("tab", tab);
    
    if (tab === "sell") {
      navigate("/sell");
    } else {
      // Stay on current page but update query param
      navigate({
        pathname: location.pathname,
        search: params.toString()
      });
    }
  };

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
              onClick={() => handleTabChange("buy")}
            >
              Buy
            </button>
            <button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "rent" 
                  ? "bg-white text-realestate-700" 
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => handleTabChange("rent")}
            >
              Rent
            </button>
            <button 
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "sell" 
                  ? "bg-white text-realestate-700" 
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => handleTabChange("sell")}
            >
              Sell
            </button>
          </div>
        </div>
        
        {/* Search Bar with Active Tab */}
        {activeTab !== "sell" && (
          <div className="mt-8">
            <SearchBar activeTab={activeTab} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
