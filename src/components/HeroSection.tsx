
import SearchBar from "./SearchBar";

const HeroSection = () => {
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
            <button className="px-6 py-3 rounded-md bg-white text-realestate-700 font-medium">
              Buy
            </button>
            <button className="px-6 py-3 rounded-md text-white font-medium">
              Rent
            </button>
            <button className="px-6 py-3 rounded-md text-white font-medium">
              Sell
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mt-8">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
