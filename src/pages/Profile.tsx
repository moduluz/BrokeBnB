
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Home, Settings, LogOut } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, isAuthenticated, updateUser, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate("/signin");
      return;
    }

    // Update form data when user changes
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    
    setIsLoading(false);
  }, [isAuthenticated, navigate, user]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    toast.success("Profile updated successfully");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-realestate-100 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-realestate-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{formData.name || formData.email}</h2>
                    <p className="text-gray-500">{formData.email}</p>
                    
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="mt-6 w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="properties">My Properties</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your personal details here.
                      </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUpdateProfile}>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                          />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" className="bg-realestate-600 hover:bg-realestate-700">
                          Save Changes
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
                
                <TabsContent value="properties">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Properties</CardTitle>
                      <CardDescription>
                        View and manage properties you've listed or saved.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-10">
                        <Home className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Properties Yet</h3>
                        <p className="text-gray-500 mb-6">
                          You haven't listed or saved any properties yet.
                        </p>
                        <Button className="bg-realestate-600 hover:bg-realestate-700" onClick={() => navigate("/sell")}>
                          List a Property
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Change Password</Label>
                        <Input id="password" type="password" placeholder="New password" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                      </div>
                      
                      <Button 
                        className="bg-realestate-600 hover:bg-realestate-700"
                        onClick={() => toast.success("Password updated successfully")}
                      >
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
