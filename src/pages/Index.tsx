
import HeroSection from "@/components/HeroSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import Navbar from "@/components/Navbar";
import { Building, CheckCircle, Handshake, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <FeaturedProperties />
        
        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Why Choose BrokeBNB</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We provide a seamless experience for buying, selling, and renting properties with trusted service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="text-center p-6 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-realestate-100 mb-4">
                  <Building className="h-8 w-8 text-realestate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Extensive Listings</h3>
                <p className="text-gray-600">
                  Thousands of properties across the country for you to explore and find your perfect match.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="text-center p-6 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-realestate-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-realestate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Verified Properties</h3>
                <p className="text-gray-600">
                  All our listings are verified by our team to ensure you get accurate information.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="text-center p-6 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-realestate-100 mb-4">
                  <Shield className="h-8 w-8 text-realestate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
                <p className="text-gray-600">
                  Our platform ensures secure transactions and protects your personal information.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="text-center p-6 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-realestate-100 mb-4">
                  <Handshake className="h-8 w-8 text-realestate-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600">
                  Our team of real estate experts is always ready to assist you with any questions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-realestate-600">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Home?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of satisfied customers who found their perfect property with BrokeBNB.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-white text-realestate-600 font-medium rounded-lg hover:bg-gray-100 transition-colors">
                  Search Properties
                </button>
                <button className="px-8 py-3 bg-transparent text-white border border-white font-medium rounded-lg hover:bg-white/10 transition-colors">
                  List Your Property
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BrokeBNB</h3>
              <p className="text-gray-400">
                Your trusted partner in finding the perfect property for your needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Rent</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Sell</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <address className="text-gray-400 not-italic">
                1234 Real Estate Blvd<br />
                San Francisco, CA 94105<br />
                <a href="tel:+11234567890" className="hover:text-white">+1 (123) 456-7890</a><br />
                <a href="mailto:info@BrokeBNB.com" className="hover:text-white">info@BrokeBNB.com</a>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BrokeBNB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
