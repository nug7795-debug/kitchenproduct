'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Package, Upload, IndianRupee, Tag, Layers, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of product creation and image upload
    setTimeout(() => {
      setLoading(false);
      router.push('/products');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">Fill in the details to list a new product in the store.</p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-500" /> Basic Information
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name</label>
              <input 
                type="text" 
                required 
                className="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Pro-Mixer Master 500W"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                rows={5} 
                className="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Detailed description of the product..."
              />
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white p-6 rounded-xl shadow-sm border grid grid-cols-2 gap-4">
            <h3 className="font-bold flex items-center gap-2 col-span-2">
              <IndianRupee className="h-4 w-4 text-orange-500" /> Pricing & Inventory
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Regular Price (₹)</label>
              <input type="number" required className="w-full rounded-md border p-2 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sale Price (₹)</label>
              <input type="number" className="w-full rounded-md border p-2 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <input type="number" required className="w-full rounded-md border p-2 text-sm outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <input type="text" className="w-full rounded-md border p-2 text-sm outline-none" placeholder="KP-MIX-001" />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Layers className="h-4 w-4 text-orange-500" /> Organization
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select className="w-full rounded-md border p-2 text-sm outline-none bg-white">
                  <option>Select Category</option>
                  <option>Appliances</option>
                  <option>Cookware</option>
                  <option>Accessories</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <input type="text" className="w-full rounded-md border p-2 text-sm outline-none" placeholder="e.g. Prestige" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Media Upload */}
          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Upload className="h-4 w-4 text-orange-500" /> Product Images
            </h3>
            <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-2 border-slate-200 hover:border-orange-500 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-xs font-medium">Click or drag images to upload</p>
              <p className="text-[10px] text-muted-foreground">PNG, JPG or WEBP (Max 5MB)</p>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border">
                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Tag className="h-4 w-4 text-orange-500" /> Visibility
            </h3>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <label htmlFor="featured" className="text-sm">Featured Product</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="new" className="rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
              <label htmlFor="new" className="text-sm">New Arrival</label>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full py-6 text-lg bg-slate-900 hover:bg-slate-800">
            {loading ? 'Processing...' : 'Publish Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
