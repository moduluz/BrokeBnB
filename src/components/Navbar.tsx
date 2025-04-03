
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, DollarSign, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-realestate-600" />
            <span className="text-xl font-bold text-realestate-600">RentHomeHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-realestate-600 font-medium">
              Home
            </Link>
            <Link to="/" className="text-gray-700 hover:text-realestate-600 font-medium">
              Buy
            </Link>
            <Link to="/" className="text-gray-700 hover:text-realestate-600 font-medium">
              Rent
            </Link>
            <Link to="/" className="text-gray-700 hover:text-realestate-600 font-medium">
              Sell
            </Link>
            <Link to="/rent-settlement" className="text-gray-700 hover:text-realestate-600 font-medium">
              Rent Settlement
            </Link>
            <Button variant="outline" className="flex items-center gap-2">
              <User size={18} />
              <span>Sign In</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              onClick={toggleMenu} 
              variant="ghost" 
              size="icon"
              className="text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Buy
            </Link>
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Rent
            </Link>
            <Link 
              to="/" 
              className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Sell
            </Link>
            <Link 
              to="/rent-settlement" 
              className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
              onClick={toggleMenu}
            >
              Rent Settlement
            </Link>
            <Button variant="outline" className="w-full justify-start">
              <User size={18} className="mr-2" />
              <span>Sign In</span>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
