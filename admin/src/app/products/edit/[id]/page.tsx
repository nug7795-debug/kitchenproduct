'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Package, Upload, IndianRupee, Tag, Layers, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
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
    const fetchData = async () => {
      try {
        // 1. Fetch categories
        const { data: catData } = await supabase.from('categories').select('*').eq('is_active', true);
        if (catData) setCategories(catData);

        // 2. Fetch product data
        const { data: product, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (image_url)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (product) {
          setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price?.toString() || '',
            sale_price: product.sale_price?.toString() || '',
            stock_quantity: product.stock_quantity?.toString() || '',
            sku: product.sku || '',
            category_id: product.category_id || '',
            brand: product.brand || '',
            is_featured: product.is_featured || false,
            is_new_arrival: product.is_new_arrival || false
          });

          if (product.product_images) {
            setPreviews(product.product_images.map((img: any) => img.image_url));
          }
        }
      } catch (err: any) {
        alert('Error loading product: ' + err.message);
        router.push('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

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
    // If it's a new file, remove from images too
    // For now, simplified - just clear previews and handle as new set
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update product
      const { error: productError } = await supabase
        .from('products')
        .update({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
          stock_quantity: parseInt(formData.stock_quantity),
          sku: formData.sku || null,
          category_id: formData.category_id || null,
          brand: formData.brand || null,
          is_featured: formData.is_featured,
          is_new_arrival: formData.is_new_arrival
        })
        .eq('id', id);

      if (productError) throw productError;

      // In a real app, you'd handle image updates here (delete old, upload new)
      // For this demo, we'll just keep existing or adding a mock if images changed
      if (images.length > 0) {
        await supabase.from('product_images').insert(
          images.map((_, i) => ({
            product_id: id,
            image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
            is_featured: false,
            order_index: 10 + i
          }))
        );
      }

      alert('Product updated successfully!');
      router.push('/products');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">Modify the details of your existing product listing.</p>
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
              />
            </div>
          </div>

          {/* Organization */}
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
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={saving} 
              className="bg-orange-500 hover:bg-orange-600 px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              {saving ? 'Updating...' : 'Update Product'}
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
              <p className="text-xs font-medium">Add more images</p>
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
        </div>
      </form>
    </div>
  );
}
