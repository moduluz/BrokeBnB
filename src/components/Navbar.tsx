
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, DollarSign, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check auth status on component mount
  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsLoggedIn(authStatus);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
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
            <Link to="/sell" className="text-gray-700 hover:text-realestate-600 font-medium">
              Sell
            </Link>
            <Link to="/rent-settlement" className="text-gray-700 hover:text-realestate-600 font-medium">
              Rent Settlement
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile">
                  <Button variant="outline" className="flex items-center gap-2">
                    <User size={18} />
                    <span>My Profile</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-realestate-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/signin">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={18} />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
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
              to="/sell" 
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
            
            {isLoggedIn ? (
              <>
                <Link 
                  to="/profile" 
                  className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
                  onClick={toggleMenu}
                >
                  My Profile
                </Link>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full justify-start text-gray-700 hover:text-realestate-600"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link 
                to="/signin" 
                className="block text-gray-700 hover:text-realestate-600 font-medium py-2"
                onClick={toggleMenu}
              >
                <Button variant="outline" className="w-full justify-start">
                  <User size={18} className="mr-2" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
