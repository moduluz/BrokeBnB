import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Building, DollarSign, Home, MapPin, Bed, Bath, Square, ImagePlus, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload";

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  propertyType: z.string().min(1, "Please select a property type"),
  price: z.string().min(1, "Price is required"),
  bedrooms: z.string().min(1, "Number of bedrooms is required"),
  bathrooms: z.string().min(1, "Number of bathrooms is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters"),
  amenities: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SellProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [images, setImages] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      propertyType: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      amenities: "",
    },
  });

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      toast({
        variant: "destructive",
        description: "Please sign in to list a property.",
      });
      navigate("/signin");
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        description: "Please add at least one image of the property.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Append images
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      // Format the data according to the server's expectations
      const propertyData = {
        title: data.title,
        description: data.description,
        propertyType: data.propertyType,
        price: parseFloat(data.price),
        bedrooms: parseInt(data.bedrooms),
        bathrooms: parseInt(data.bathrooms),
        location: {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        },
        amenities: data.amenities ? data.amenities.split(',').map(item => item.trim()) : []
      };

      // Append the formatted data
      Object.entries(propertyData).forEach(([key, value]) => {
        if (key === 'location') {
          Object.entries(value).forEach(([locationKey, locationValue]) => {
            formData.append(`location[${locationKey}]`, locationValue as string);
          });
        } else if (key === 'amenities') {
          (value as string[]).forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
          });
        } else {
          formData.append(key, value.toString());
        }
      });

      const response = await fetch('http://localhost:5000/api/rent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create listing');
      }

      const result = await response.json();
      
      toast({
        description: "Your property has been listed for rent.",
      });
      
      navigate("/");
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Failed to create listing",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-8">List Your Property for Rent</h1>
        
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
            <CardDescription>
              Fill in the details below to list your property on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Modern Apartment with City View" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select property type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="loft">Loft</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your property, including special features, recent renovations, etc."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Property Details */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Rent ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="number" className="pl-10" placeholder="e.g. 1500" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bedrooms</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Bed className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="number" className="pl-10" placeholder="e.g. 2" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bathrooms</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Bath className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input type="number" className="pl-10" placeholder="e.g. 1" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Location Information */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 123 Main Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="AL">Alabama</SelectItem>
                            <SelectItem value="AK">Alaska</SelectItem>
                            <SelectItem value="AZ">Arizona</SelectItem>
                            <SelectItem value="CA">California</SelectItem>
                            <SelectItem value="CO">Colorado</SelectItem>
                            <SelectItem value="CT">Connecticut</SelectItem>
                            <SelectItem value="DE">Delaware</SelectItem>
                            <SelectItem value="FL">Florida</SelectItem>
                            <SelectItem value="GA">Georgia</SelectItem>
                            <SelectItem value="HI">Hawaii</SelectItem>
                            <SelectItem value="ID">Idaho</SelectItem>
                            <SelectItem value="IL">Illinois</SelectItem>
                            <SelectItem value="IN">Indiana</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 94105" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Amenities */}
                  <FormField
                    control={form.control}
                    name="amenities"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Amenities (separate with commas)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Pool, Garden, Fireplace, Air Conditioning"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List all amenities and special features of your property.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image Upload Section */}
                  <div className="md:col-span-2">
                    <ImageUpload 
                      onImagesChange={handleImagesChange}
                      maxImages={10}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-realestate-600 hover:bg-realestate-700"
                    disabled={isUploading}
                  >
                    {isUploading ? "Creating Listing..." : "List Property"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SellProperty;
