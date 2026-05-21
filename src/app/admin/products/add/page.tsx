'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Upload, 
  IndianRupee, 
  Tag, 
  Layers, 
  CheckCircle, 
  X, 
  ChevronLeft, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Info,
  Settings,
  Truck,
  Globe,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  Star
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import Link from 'next/link';
import { cn } from '../../../../lib/utils';
import { supabase } from '../../../../lib/supabase';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'pricing' | 'inventory' | 'images' | 'variants' | 'seo' | 'shipping' | 'reviews'>('general');

  // Form State
  const [formData, setFormData] = React.useState({
    name: '',
    slug: '',
    brand: '',
    category: '',
    categories: [] as string[],
    type: 'physical',
    status: 'published', // Draft, Published, Hidden
    shortDescription: '',
    description: '',
    tags: '',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    mrp: '',
    salePrice: '',
    discountPercent: '',
    costPrice: '',
    taxIncluded: true,
    gst: '18% GST (Default)',
    currency: 'INR',
    stock: '',
    unlimitedStock: false,
    lowStockLevel: '5',
    outOfStockVisible: true,
    minOrderQty: '1',
    maxOrderQty: '10',
    sku: '',
    barcode: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    shippingClass: 'Free Delivery',
    freeShipping: true,
    codAvailable: true,
    seoTitle: '',
    metaDescription: '',
    keywords: '',
    canonicalUrl: '',
    ogImage: '',
    searchVisibility: true,
    visibility: 'public',
    regionVisibility: 'all',
    averageRating: '4.5',
    totalRatings: '1428',
    totalReviews: '234',
    star5: '980',
    star4: '320',
    star3: '98',
    star2: '20',
    star1: '10',
  });

  // State for multiple images (URLs)
  const [images, setImages] = React.useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // State for variants
  const [variants, setVariants] = React.useState<any[]>([]);

  // State for categories
  const [categories, setCategories] = React.useState<any[]>([]);

  // Load data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (catData) setCategories(catData);
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // Auto-generate slug and SKU if name changes
      if (name === 'name') {
        updated.slug = value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        if (!updated.sku) {
          updated.sku = `KP-${value.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        }
      }
      
      // Auto-calculate discount percentage or sale price
      if (name === 'mrp' || name === 'salePrice') {
        const mrpVal = parseFloat(name === 'mrp' ? value : prev.mrp || '0');
        const saleVal = parseFloat(name === 'salePrice' ? value : prev.salePrice || '0');
        if (mrpVal > 0 && saleVal > 0) {
          updated.discountPercent = Math.round(((mrpVal - saleVal) / mrpVal) * 100).toString();
        } else {
          updated.discountPercent = '';
        }
      }
      
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('kitchenproduct')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('kitchenproduct')
          .getPublicUrl(filePath);

        newImageUrls.push(publicUrl);
      }
      setImages([...images, ...newImageUrls]);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (!formData.name) {
      alert('Product name is required to save a draft');
      return;
    }
    setLoading(true);
    try {
      // 1. Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          description: formData.description,
          short_description: formData.shortDescription,
          sku: formData.sku,
          brand: formData.brand,
          price: parseFloat(formData.mrp || '0'),
          sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
          stock_quantity: formData.unlimitedStock ? 9999 : (formData.stock ? parseInt(formData.stock) : 0),
          category_id: formData.category || null,
          is_active: false, // Save as inactive draft
          is_featured: formData.isFeatured,
          is_new_arrival: formData.isNewArrival,
          is_best_seller: formData.isBestSeller,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dimensions: { length: parseFloat(formData.length || '0'), width: parseFloat(formData.width || '0'), height: parseFloat(formData.height || '0') },
          average_rating: parseFloat(formData.averageRating || '4.5'),
          total_ratings: parseInt(formData.totalRatings || '1428'),
          total_reviews: parseInt(formData.totalReviews || '234'),
          star_distribution: {
            "5": parseInt(formData.star5 || '980'),
            "4": parseInt(formData.star4 || '320'),
            "3": parseInt(formData.star3 || '98'),
            "2": parseInt(formData.star2 || '20'),
            "1": parseInt(formData.star1 || '10')
          }
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert images
      if (images.length > 0) {
        const imageInserts = images.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          is_featured: index === 0,
          order_index: index
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      // 3. Insert variants
      if (variants.length > 0) {
        const variantInserts = variants.map(v => ({
          product_id: product.id,
          name: v.name || 'Option',
          value: v.value || '',
          price: v.price ? parseFloat(v.price) : null,
          sku: v.sku || `${formData.sku}-${v.value.substring(0, 3).toUpperCase()}`,
          stock_quantity: v.stock ? parseInt(v.stock) : 0
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantInserts);

        if (variantError) throw variantError;
      }

      alert('Product saved as Draft successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      alert('Error saving draft: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Product name is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: formData.name,
          slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          description: formData.description,
          short_description: formData.shortDescription,
          sku: formData.sku,
          brand: formData.brand,
          price: parseFloat(formData.mrp || '0'),
          sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
          stock_quantity: formData.unlimitedStock ? 9999 : (formData.stock ? parseInt(formData.stock) : 0),
          category_id: formData.category || null,
          is_active: formData.status !== 'hidden', // active if not hidden
          is_featured: formData.isFeatured,
          is_new_arrival: formData.isNewArrival,
          is_best_seller: formData.isBestSeller,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          dimensions: { length: parseFloat(formData.length || '0'), width: parseFloat(formData.width || '0'), height: parseFloat(formData.height || '0') },
          average_rating: parseFloat(formData.averageRating || '4.5'),
          total_ratings: parseInt(formData.totalRatings || '1428'),
          total_reviews: parseInt(formData.totalReviews || '234'),
          star_distribution: {
            "5": parseInt(formData.star5 || '980'),
            "4": parseInt(formData.star4 || '320'),
            "3": parseInt(formData.star3 || '98'),
            "2": parseInt(formData.star2 || '20'),
            "1": parseInt(formData.star1 || '10')
          }
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert images
      if (images.length > 0) {
        const imageInserts = images.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          is_featured: index === 0,
          order_index: index
        }));

        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageInserts);

        if (imagesError) throw imagesError;
      }

      // 3. Insert variants
      if (variants.length > 0) {
        const variantInserts = variants.map(v => ({
          product_id: product.id,
          name: v.name || 'Option',
          value: v.value || '',
          price: v.price ? parseFloat(v.price) : null,
          sku: v.sku || `${formData.sku}-${v.value.substring(0, 3).toUpperCase()}`,
          stock_quantity: v.stock ? parseInt(v.stock) : 0
        }));

        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantInserts);

        if (variantError) throw variantError;
      }

      alert('Product published successfully!');
      router.push('/admin/products');
    } catch (error: any) {
      console.error('Error publishing product:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    setVariants([...variants, { id: Date.now(), name: '', value: '', price: '', stock: '' }]);
  };

  const removeVariant = (id: number) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        accept="image/*" 
        onChange={handleImageUpload} 
      />

      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md pt-4 pb-6 border-b border-slate-200 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="ghost" size="icon" className="rounded-full bg-white shadow-sm border">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Product</h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Kitchen & Dining / Appliances</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleSaveDraft}
              disabled={loading || uploading}
              variant="outline" 
              className="rounded-full h-11 px-6 font-bold border-2"
            >
              {loading ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button onClick={handleSubmit} disabled={loading || uploading} className="rounded-full h-11 px-8 font-black bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200">
              {loading ? 'Publishing...' : 'Publish Product'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'general', label: 'General Info', icon: Info },
            { id: 'images', label: 'Media Gallery', icon: ImageIcon },
            { id: 'pricing', label: 'Pricing & Tax', icon: IndianRupee },
            { id: 'inventory', label: 'Inventory', icon: Package },
            { id: 'variants', label: 'Product Variants', icon: PlusCircle },
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'seo', label: 'Search Engine (SEO)', icon: Globe },
            { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-orange-400" : "text-slate-400")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Sections */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Section: General Info */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Info className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Basic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Premium High-Speed Blender 2000W" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Slug (Auto-Generated)</label>
                    <input 
                      type="text" 
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="auto-generated-slug" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product SKU</label>
                    <input 
                      type="text" 
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="e.g. KP-BLND-102" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Name</label>
                    <input 
                      type="text" 
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="e.g. MasterChef" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Choose Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Tags (Comma Separated)</label>
                    <input 
                      type="text" 
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g. blender, kitchen, masterchef" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Status</label>
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Type</label>
                    <div className="flex p-1 bg-slate-100 rounded-xl">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'physical'})}
                        className={cn("flex-1 py-2 px-4 rounded-lg text-xs font-black shadow-sm tracking-tight uppercase", formData.type === 'physical' ? "bg-white" : "text-slate-500")}
                      >
                        Physical (e.g. Blender, Cookware)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'digital'})}
                        className={cn("flex-1 py-2 px-4 rounded-lg text-xs font-black shadow-sm tracking-tight uppercase", formData.type === 'digital' ? "bg-white" : "text-slate-500")}
                      >
                        Digital (e.g. E-Books, Video Guides)
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Short Description (Summary)</label>
                    <textarea 
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      rows={2} 
                      placeholder="Brief summary for product cards..." 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all resize-none" 
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detailed Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={6} 
                      placeholder="Describe product features, box contents, and specifications..." 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Display & Visibility</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded-md text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Featured</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Front Page</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isNewArrival"
                      checked={formData.isNewArrival}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded-md text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">New Arrival</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Latest Stock</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isBestSeller"
                      checked={formData.isBestSeller}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded-md text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Best Seller</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">Top Performing</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section: Images */}
          {activeTab === 'images' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                   <div className="flex items-center gap-2">
                     <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><ImageIcon className="h-4 w-4" /></div>
                     <h2 className="font-black text-slate-800 uppercase tracking-tight">Product Gallery</h2>
                   </div>
                   <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-widest">Max 10 Images</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <button 
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "aspect-square rounded-[1.5rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-2 transition-all group",
                      uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 hover:border-orange-200"
                    )}>
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center transition-all",
                        uploading ? "bg-slate-100 text-slate-300 animate-pulse" : "bg-slate-50 text-slate-400 group-hover:bg-orange-100 group-hover:text-orange-500"
                      )}>
                        <Plus className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase group-hover:text-orange-600">
                        {uploading ? 'Uploading...' : 'Add Media'}
                      </span>
                   </button>
                   
                   {images.map((url, index) => (
                     <div key={index} className="aspect-square rounded-[1.5rem] bg-slate-100 relative group overflow-hidden border-2 border-slate-100">
                        <img src={url} className="w-full h-full object-cover" />
                        {index === 0 && <div className="absolute top-2 left-2 bg-orange-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Featured</div>}
                        <button 
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 h-6 w-6 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                     </div>
                   ))}
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex gap-4 items-center">
                   <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <ImageIcon className="h-6 w-6 text-slate-300" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Main Product Image (Thumbnail)</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">This will be shown on the home page and category listings.</p>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Pricing */}
          {activeTab === 'pricing' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><IndianRupee className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Pricing & Tax Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price (MRP)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                      <input 
                        type="number" 
                        name="mrp"
                        value={formData.mrp}
                        onChange={handleInputChange}
                        placeholder="0.00" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 pl-8 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Price (Offer)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-orange-400">₹</span>
                      <input 
                        type="number" 
                        name="salePrice"
                        value={formData.salePrice}
                        onChange={handleInputChange}
                        placeholder="0.00" 
                        className="w-full bg-orange-50/30 border-2 border-orange-100 rounded-xl p-4 pl-8 text-sm font-black text-orange-600 focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost Price (Secret)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                      <input 
                        type="number" 
                        name="costPrice"
                        value={formData.costPrice}
                        onChange={handleInputChange}
                        placeholder="0.00" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 pl-8 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Discount (%)</label>
                    <input 
                      type="text" 
                      name="discountPercent"
                      value={formData.discountPercent ? `${formData.discountPercent}% Off` : '0% Off'}
                      readOnly
                      disabled
                      className="w-full bg-slate-100 border-2 border-slate-200 rounded-xl p-4 text-sm font-black text-slate-500 outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Percentage (%)</label>
                    <select 
                      name="gst"
                      value={formData.gst}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-bold focus:border-orange-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="0% GST">0% GST</option>
                      <option value="5% GST">5% GST</option>
                      <option value="12% GST">12% GST</option>
                      <option value="18% GST (Default)">18% GST (Default)</option>
                      <option value="28% GST">28% GST</option>
                    </select>
                  </div>
                  <div className="space-y-2 flex items-center pt-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        name="taxIncluded"
                        checked={formData.taxIncluded}
                        onChange={handleInputChange}
                        className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                      />
                      <div>
                        <p className="text-xs font-black text-slate-900">Tax Included in Price</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">All prices include GST</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Inventory */}
          {activeTab === 'inventory' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Package className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Inventory Management</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {!formData.unlimitedStock && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Stock Quantity</label>
                      <input 
                        type="number" 
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock Alert Level</label>
                    <input 
                      type="number" 
                      name="lowStockLevel"
                      value={formData.lowStockLevel}
                      onChange={handleInputChange}
                      placeholder="5" 
                      className="w-full bg-red-50/30 border-2 border-red-100 rounded-xl p-4 text-sm font-black text-red-600 focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barcode / EAN Support</label>
                    <input 
                      type="text" 
                      name="barcode"
                      value={formData.barcode}
                      onChange={handleInputChange}
                      placeholder="e.g. 8901234567890" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Minimum Order Quantity</label>
                    <input 
                      type="number" 
                      name="minOrderQty"
                      value={formData.minOrderQty}
                      onChange={handleInputChange}
                      placeholder="1" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maximum Order Quantity</label>
                    <input 
                      type="number" 
                      name="maxOrderQty"
                      value={formData.maxOrderQty}
                      onChange={handleInputChange}
                      placeholder="10" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="unlimitedStock"
                      checked={formData.unlimitedStock}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Unlimited Stock Toggle</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Always available for order</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="outOfStockVisible"
                      checked={formData.outOfStockVisible}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Out of Stock Visibility</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Show product even if sold out</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section: Variants */}
          {activeTab === 'variants' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                   <div className="flex items-center gap-2">
                     <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><PlusCircle className="h-4 w-4" /></div>
                     <h2 className="font-black text-slate-800 uppercase tracking-tight">Product Variants</h2>
                   </div>
                   <Button onClick={addVariant} variant="outline" size="sm" className="rounded-full border-2 border-slate-100 font-bold h-9">
                      <Plus className="h-4 w-4 mr-1" /> Add Variant
                   </Button>
                </div>

                {variants.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-slate-100 rounded-3xl">
                     <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <PlusCircle className="h-8 w-8" />
                     </div>
                     <div className="text-center">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">No Variants Added</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Add options like Color, Size, or Weight.</p>
                     </div>
                     <Button onClick={addVariant} className="rounded-full bg-slate-900 text-white h-10 px-6 font-bold shadow-lg shadow-slate-200">
                        Initialize Variants
                     </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {variants.map((v, i) => (
                      <div key={v.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6 bg-slate-50/50 border-2 border-slate-100 rounded-2xl relative group">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Variant Option (Type)</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Size" 
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[i].name = e.target.value;
                              setVariants(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:border-orange-500 outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Value</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 5 Litre" 
                            value={v.value}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[i].value = e.target.value;
                              setVariants(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:border-orange-500 outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Variant SKU</label>
                          <input 
                            type="text" 
                            placeholder="e.g. KP-V1" 
                            value={v.sku || ''}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[i].sku = e.target.value;
                              setVariants(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:border-orange-500 outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Variant Price (₹)</label>
                          <input 
                            type="number" 
                            placeholder="0.00" 
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[i].price = e.target.value;
                              setVariants(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:border-orange-500 outline-none" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Stock</label>
                          <input 
                            type="number" 
                            placeholder="10" 
                            value={v.stock}
                            onChange={(e) => {
                              const updated = [...variants];
                              updated[i].stock = e.target.value;
                              setVariants(updated);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:border-orange-500 outline-none" 
                          />
                        </div>
                        <div className="md:col-span-5 flex justify-end">
                          <Button onClick={() => removeVariant(v.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-50 rounded-lg px-4 h-8 text-[10px] font-black uppercase tracking-wider">
                             <Trash2 className="h-3 w-3 mr-2" /> Remove Variant
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Shipping */}
          {activeTab === 'shipping' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Truck className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Shipping & Dimensions</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Weight (kg)</label>
                    <input 
                      type="number" 
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="0.0" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Class</label>
                    <select 
                      name="shippingClass"
                      value={formData.shippingClass}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all"
                    >
                       <option value="Free Delivery">Free Delivery</option>
                       <option value="Standard Shipping">Standard Shipping</option>
                       <option value="Heavy Items (Cooktops)">Heavy Items (Cooktops)</option>
                       <option value="Fragile (Glassware)">Fragile (Glassware)</option>
                       <option value="Next Day Delivery">Next Day Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Packaging Dimensions (cm)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Length (cm)</label>
                      <input 
                        type="number" 
                        name="length"
                        value={formData.length}
                        onChange={handleInputChange}
                        placeholder="0" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Width (cm)</label>
                      <input 
                        type="number" 
                        name="width"
                        value={formData.width}
                        onChange={handleInputChange}
                        placeholder="0" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label>
                      <input 
                        type="number" 
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        placeholder="0" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="freeShipping"
                      checked={formData.freeShipping}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Free Shipping Option</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Enable free shipping for this item</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="codAvailable"
                      checked={formData.codAvailable}
                      onChange={handleInputChange}
                      className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                    />
                    <div>
                      <p className="text-xs font-black text-slate-900">Cash on Delivery (COD) Available</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">Allow COD payments for this item</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Globe className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Search Engine Optimization</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SEO Title Tag</label>
                      <input 
                        type="text" 
                        name="seoTitle"
                        value={formData.seoTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Best High-Speed Mixer Grinder in India" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Meta Description</label>
                      <textarea 
                        name="metaDescription"
                        value={formData.metaDescription}
                        onChange={handleInputChange}
                        rows={3} 
                        placeholder="Write a compelling description for search results..." 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all resize-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Canonical URL</label>
                      <input 
                        type="text" 
                        name="canonicalUrl"
                        value={formData.canonicalUrl}
                        onChange={handleInputChange}
                        placeholder="https://kitchenproduct.in/products/..." 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OG Image URL</label>
                      <input 
                        type="text" 
                        name="ogImage"
                        value={formData.ogImage}
                        onChange={handleInputChange}
                        placeholder="https://kitchenproduct.in/images/og-..." 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-50 hover:bg-slate-50 transition-all cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="searchVisibility"
                          checked={formData.searchVisibility}
                          onChange={handleInputChange}
                          className="h-5 w-5 rounded text-orange-500 border-slate-200" 
                        />
                        <div>
                          <p className="text-xs font-black text-slate-900">Search Engine Indexing Visibility</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">Allow Google, Bing, and DuckDuckGo to index this product page</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Reviews & Ratings */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                   <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-white"><Star className="h-4 w-4" /></div>
                   <h2 className="font-black text-slate-800 uppercase tracking-tight">Reviews & Ratings Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average Rating</label>
                    <input 
                      type="number" 
                      step="0.1"
                      min="1"
                      max="5"
                      name="averageRating"
                      value={formData.averageRating}
                      onChange={handleInputChange}
                      placeholder="e.g. 4.5" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Ratings Count</label>
                    <input 
                      type="number" 
                      name="totalRatings"
                      value={formData.totalRatings}
                      onChange={handleInputChange}
                      placeholder="e.g. 1428" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reviews Count</label>
                    <input 
                      type="number" 
                      name="totalReviews"
                      value={formData.totalReviews}
                      onChange={handleInputChange}
                      placeholder="e.g. 234" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Star Distribution Breakdown</h3>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5 Star Count</label>
                      <input 
                        type="number" 
                        name="star5"
                        value={formData.star5}
                        onChange={handleInputChange}
                        placeholder="e.g. 980" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4 Star Count</label>
                      <input 
                        type="number" 
                        name="star4"
                        value={formData.star4}
                        onChange={handleInputChange}
                        placeholder="e.g. 320" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 Star Count</label>
                      <input 
                        type="number" 
                        name="star3"
                        value={formData.star3}
                        onChange={handleInputChange}
                        placeholder="e.g. 98" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2 Star Count</label>
                      <input 
                        type="number" 
                        name="star2"
                        value={formData.star2}
                        onChange={handleInputChange}
                        placeholder="e.g. 20" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1 Star Count</label>
                      <input 
                        type="number" 
                        name="star1"
                        value={formData.star1}
                        onChange={handleInputChange}
                        placeholder="e.g. 10" 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-black focus:border-orange-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
