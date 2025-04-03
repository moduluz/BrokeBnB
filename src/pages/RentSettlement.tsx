
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, FileText, Home, Key, Receipt, Shield, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const RentSettlement = () => {
  const [userType, setUserType] = useState<"tenant" | "owner">("tenant");
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would process the payment
    toast({
      title: "Payment Initiated",
      description: `Your payment of $${amount} has been initiated successfully.`,
      variant: "default",
    });
    
    // Reset form
    setAmount("");
  };

  return (
    <div>
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Settlement Center</h1>
          <p className="text-gray-600 mb-8">
            Easily manage rent payments and transactions between owners and tenants.
          </p>
          
          {/* User Type Selection */}
          <div className="mb-8">
            <RadioGroup 
              defaultValue="tenant" 
              className="flex gap-4"
              onValueChange={(value) => setUserType(value as "tenant" | "owner")}
            >
              <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${userType === "tenant" ? "border-realestate-500 bg-realestate-50" : "border-gray-200"}`}>
                <RadioGroupItem value="tenant" id="tenant" />
                <Label htmlFor="tenant" className="cursor-pointer">I am a Tenant</Label>
              </div>
              <div className={`flex items-center space-x-2 border rounded-lg p-4 cursor-pointer ${userType === "owner" ? "border-realestate-500 bg-realestate-50" : "border-gray-200"}`}>
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner" className="cursor-pointer">I am a Property Owner</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Payment Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {userType === "tenant" ? "Pay Your Rent" : "Request Rent Payment"}
                  </CardTitle>
                  <CardDescription>
                    {userType === "tenant" 
                      ? "Make a secure payment to your property owner." 
                      : "Send a payment request to your tenant."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      {/* Property Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="property">Property</Label>
                        <Select defaultValue="property1">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a property" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="property1">
                              {userType === "tenant" 
                                ? "123 Main St Apt 4B, New York, NY" 
                                : "123 Main St Apt 4B (John Doe)"}
                            </SelectItem>
                            <SelectItem value="property2">
                              {userType === "tenant" 
                                ? "456 Park Ave #203, Chicago, IL" 
                                : "456 Park Ave #203 (Jane Smith)"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Payment Details */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input 
                          id="amount" 
                          type="number" 
                          placeholder="0.00" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      
                      {/* Payment Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Payment Category</Label>
                        <Select defaultValue="monthly">
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly Rent</SelectItem>
                            <SelectItem value="deposit">Security Deposit</SelectItem>
                            <SelectItem value="maintenance">Maintenance Fee</SelectItem>
                            <SelectItem value="utility">Utility Payment</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Payment Method (only for Tenant) */}
                      {userType === "tenant" && (
                        <div className="space-y-2">
                          <Label>Payment Method</Label>
                          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 mb-2">
                              <RadioGroupItem value="creditCard" id="creditCard" />
                              <Label htmlFor="creditCard" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 mb-2">
                              <RadioGroupItem value="bankTransfer" id="bankTransfer" />
                              <Label htmlFor="bankTransfer" className="flex-1 cursor-pointer">Bank Transfer (ACH)</Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                      
                      {/* Notes */}
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <textarea 
                          id="notes" 
                          rows={3} 
                          className="w-full border rounded-md p-2 text-sm"
                          placeholder="Add any additional information..."
                        ></textarea>
                      </div>
                    </div>
                  
                    <div className="mt-6">
                      <Button type="submit" className="w-full bg-realestate-600 hover:bg-realestate-700">
                        {userType === "tenant" ? "Make Payment" : "Send Request"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Payment Info Card */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Next Payment Due</span>
                      <span className="font-medium">June 1, 2025</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Rent</span>
                      <span className="font-medium">$1,850.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Security Deposit</span>
                      <span className="font-medium">$2,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Late Payment Fee</span>
                      <span className="font-medium">$50.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Features Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Features & Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Secure, encrypted payments</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Automatic payment receipts</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Payment history tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Set up recurring payments</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Multiple payment methods</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Transaction History */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
            
            <Tabs defaultValue="all">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Transactions</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium text-gray-500">Date</th>
                            <th className="text-left p-4 font-medium text-gray-500">Property</th>
                            <th className="text-left p-4 font-medium text-gray-500">Description</th>
                            <th className="text-left p-4 font-medium text-gray-500">Amount</th>
                            <th className="text-left p-4 font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-4">May 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4">April 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4">March 15, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Maintenance Fee</td>
                            <td className="p-4 font-medium">$150.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4">March 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <Card className="h-[200px] flex items-center justify-center text-center p-6">
                  <div>
                    <p className="text-gray-500">You have no pending transactions</p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                {/* Same content as "all" tab but only showing completed transactions */}
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4 font-medium text-gray-500">Date</th>
                            <th className="text-left p-4 font-medium text-gray-500">Property</th>
                            <th className="text-left p-4 font-medium text-gray-500">Description</th>
                            <th className="text-left p-4 font-medium text-gray-500">Amount</th>
                            <th className="text-left p-4 font-medium text-gray-500">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-4">May 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4">April 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-4">March 15, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Maintenance Fee</td>
                            <td className="p-4 font-medium">$150.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-4">March 1, 2025</td>
                            <td className="p-4">123 Main St Apt 4B</td>
                            <td className="p-4">Monthly Rent</td>
                            <td className="p-4 font-medium">$1,850.00</td>
                            <td className="p-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                Completed
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">When is my rent due?</h3>
                <p className="text-gray-600">
                  Rent is typically due on the 1st of each month, but check your lease agreement for specific terms.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">How long does it take to process payments?</h3>
                <p className="text-gray-600">
                  Credit card payments process immediately. Bank transfers usually take 1-3 business days.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Can I set up automatic payments?</h3>
                <p className="text-gray-600">
                  Yes, you can set up recurring payments in your account settings to ensure you never miss a payment.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">How do I report a maintenance issue?</h3>
                <p className="text-gray-600">
                  You can submit maintenance requests through your tenant dashboard or contact your property manager directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RentSettlement;
