import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Only need isAuthenticated for redirect

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!agreedToTerms) {
      toast.error("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    setIsLoading(true);

    try {
      // --- Replace Mock Registration with API Call ---
      const response = await fetch('http://localhost:5000/api/auth/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send necessary fields to your backend
        body: JSON.stringify({ name, email, password }), 
      });

      if (!response.ok) {
        // Handle API errors (e.g., 409 Conflict, 400 Bad Request)
        const errorData = await response.json().catch(() => ({ message: 'Registration failed. Please try again.' }));
        toast.error(errorData.message || 'Failed to create account.');
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Registration successful
      toast.success("Account created successfully! Please sign in.");
      navigate("/signin"); // Redirect to sign-in page after successful registration

      // NOTE: We don't automatically log in the user after registration here.
      // If you want auto-login, the backend /register endpoint would need to return
      // the user data and token, and you'd call the `login()` function from context here.

    } catch (error) {
      console.error("Registration error:", error);
      // Toast message is already shown in the response handling block for API errors
       if (!(error instanceof Error && error.message.startsWith('HTTP error!'))) {
         // Show generic error only if it wasn't an API error shown before
         toast.error("An unexpected error occurred during registration.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- JSX Updates ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••••••• (min. 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              {/* Confirm Password Input */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
              </div>
              {/* Terms Checkbox */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  disabled={isLoading}
                  // Removed 'required' attribute as we handle validation in handleSubmit
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link to="/terms" className="text-realestate-600 hover:underline" target="_blank"> {/* Added target blank */}
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-realestate-600 hover:underline" target="_blank"> {/* Added target blank */}
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-realestate-600 hover:bg-realestate-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/signin" className="text-realestate-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
