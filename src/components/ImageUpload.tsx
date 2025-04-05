import { useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  onImagesChange: (files: File[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const ImageUpload = ({ onImagesChange, maxImages = 10, disabled = false }: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Check if adding these files would exceed the maximum
      if (selectedImages.length + files.length > maxImages) {
        alert(`You can only upload up to ${maxImages} images`);
        return;
      }

      setSelectedImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...previews]);

      // Call the parent component's handler with all selected images
      onImagesChange([...selectedImages, ...files]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    onImagesChange(selectedImages.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Property Images</Label>
        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={disabled}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {selectedImages.length < maxImages && (
            <label
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-realestate-600 transition-colors ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Add Images</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={disabled}
              />
            </label>
          )}
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Upload up to {maxImages} images of your property. First image will be used as the cover.
        </p>
      </div>
    </div>
  );
};

export default ImageUpload; 