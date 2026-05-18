'use client';

import * as React from 'react';
import { Package, Plus, Search, Filter, Edit2, Trash2, ExternalLink, Upload, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import Link from 'next/link';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    // Optimistic UI update
    setProducts(products.filter(p => p.id !== id));
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      alert('Error deleting product: ' + error.message);
    }
  };

  React.useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          ),
          product_images (
            image_url,
            is_featured
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
        return;
      }

      if (data) {
        const transformed = data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.categories?.name || 'Uncategorized', 
          mrp: p.price ? `₹${p.price.toLocaleString()}` : '',
          salePrice: p.sale_price ? `₹${p.sale_price.toLocaleString()}` : `₹${p.price?.toLocaleString() || '0'}`,
          stock: p.stock_quantity || 0,
          status: p.stock_quantity > 10 ? 'In Stock' : p.stock_quantity > 0 ? 'Low Stock' : 'Out of Stock',
          image: p.product_images?.find((img: any) => img.is_featured)?.image_url || 'https://via.placeholder.com/200'
        }));
        setProducts(transformed);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Manage your kitchen product inventory.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-2 font-bold gap-2">
            <Upload className="h-4 w-4" /> Bulk Upload
          </Button>
          <Link href="/admin/products/add">
            <Button className="rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold gap-2 shadow-lg shadow-slate-200">
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all bg-white"
          />
        </div>
        <Button variant="outline" className="rounded-full gap-2 bg-white">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                    <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Loading Inventory...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-500 font-bold uppercase text-[10px] tracking-widest">
                    No products found in database
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-medium">ID: {product.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-xs">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800">{product.salePrice}</span>
                      {product.mrp && product.mrp !== product.salePrice && (
                        <span className="text-xs text-slate-400 line-through">{product.mrp}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{product.stock} units</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                      product.status === 'In Stock' ? 'bg-green-100 text-green-600' :
                      product.status === 'Low Stock' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'
                    )}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200">
                          <Edit2 className="h-4 w-4 text-slate-600" />
                        </Button>
                      </Link>
                      <Button onClick={() => handleDelete(product.id)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-red-50 hover:bg-red-100 border border-red-100">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
