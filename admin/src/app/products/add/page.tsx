'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Package, Upload, IndianRupee, Tag, Layers, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [images, setImages] = React.useState<File[]>([]);
  const [previews, setPreviews] = React.useState<string[]>([]);
  
  // Form state
  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    price: '',
    sale_price: '',
    stock_quantity: '',
    sku: '',
    category_id: '',
    brand: '',
    is_featured: false,
    is_new_arrival: false
  });

  React.useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').eq('is_active', true);
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

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

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = generateSlug(formData.name);
      
      // 1. Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          slug: `${slug}-${Date.now()}`,
          description: formData.description,
          price: parseFloat(formData.price),
          sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          sku: formData.sku || null,
          category_id: formData.category_id || null,
          brand: formData.brand || null,
          is_featured: formData.is_featured,
          is_new_arrival: formData.is_new_arrival
        }])
        .select()
        .single();

      if (productError) throw productError;

      // 2. Handle images
      if (images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('products')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('products')
              .getPublicUrl(filePath);

            return publicUrl;
          })
        );

        await supabase.from('product_images').insert(
          imageUrls.map((url, i) => ({
            product_id: product.id,
            image_url: url,
            is_featured: i === 0,
            order_index: i
          }))
        );
      }

      alert('Product published successfully!');
      router.push('/products');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required 
                className="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="e.g. Pro-Mixer Master 500W"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
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
              <input 
                type="number" 
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required 
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sale Price (₹)</label>
              <input 
                type="number" 
                name="sale_price"
                value={formData.sale_price}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Quantity</label>
              <input 
                type="number" 
                name="stock_quantity"
                value={formData.stock_quantity}
                onChange={handleInputChange}
                required 
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <input 
                type="text" 
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" 
                placeholder="KP-MIX-001" 
              />
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
                <select 
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 text-sm outline-none bg-white focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" 
                  placeholder="e.g. Prestige" 
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={loading} 
              className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => router.back()}
              className="px-8 py-6 text-lg rounded-xl"
            >
              Discard
            </Button>
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
              <input 
                type="checkbox" 
                id="featured" 
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4" 
              />
              <label htmlFor="featured" className="text-sm">Featured Product</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="new" 
                name="is_new_arrival"
                checked={formData.is_new_arrival}
                onChange={handleInputChange}
                className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 h-4 w-4" 
              />
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
