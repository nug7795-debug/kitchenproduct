'use client';

import * as React from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Image as ImageIcon, ExternalLink, MoreVertical, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (data) setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    alert('Category Creation Wizard launched!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Architecture</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Manage categories, hierarchies and visibility</p>
        </div>
        <Button onClick={handleAddCategory} className="rounded-full bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 font-black shadow-xl shadow-slate-200 group">
          <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" /> Add New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" placeholder="Filter categories..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold outline-none focus:border-orange-500 transition-all" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="rounded-full text-[10px] font-black tracking-widest uppercase">Export CSV</Button>
                    <Button variant="ghost" className="rounded-full text-[10px] font-black tracking-widest uppercase">Bulk Actions</Button>
                </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-5">Label & Content</th>
                    <th className="px-8 py-5">System Slug</th>
                    <th className="px-8 py-5">Inventory</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Collections...</p>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-20 text-center">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">No collections found</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Start by adding your first category</p>
                      </td>
                    </tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100 flex-shrink-0 group-hover:border-orange-200 transition-all">
                                <img src={cat.image_url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 tracking-tight leading-tight">{cat.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Collection</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">/{cat.slug}</span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                            <Layers className="h-3 w-3 text-slate-300" />
                            <span className="font-black text-slate-700">{cat.product_count || 0}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">Items</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          cat.is_active !== false ? "bg-green-100 text-green-700 shadow-sm shadow-green-50" : "bg-slate-100 text-slate-500"
                        )}>
                          <div className={cn("h-1.5 w-1.5 rounded-full", cat.is_active !== false ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
                          {cat.is_active !== false ? 'Active' : 'Inactive'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-200 hover:shadow-sm transition-all"><Edit2 className="h-4 w-4" /></button>
                          <button className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-sm transition-all"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showing 4 of 12 collections</p>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4 font-black text-[10px] border-2">Previous</Button>
                    <Button variant="outline" size="sm" className="rounded-full h-8 px-4 font-black text-[10px] border-2 bg-slate-900 text-white">Next</Button>
                </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                <div className="relative z-10 space-y-6">
                    <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <ImageIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight leading-tight">Visual Merchandising</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Manage store banners and hero sections.</p>
                    </div>
                    <Button className="w-full rounded-2xl bg-white text-slate-900 h-12 font-black group">
                        Enter Banner Lab <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
                <ImageIcon className="absolute -right-8 -bottom-8 h-40 w-40 text-white/5 -rotate-12" />
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-6">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-[0.2em]">Live Insights</h3>
              <div className="space-y-4">
                  {[
                    { label: 'Conversion Rate', val: '+12.4%', color: 'text-green-500' },
                    { label: 'Popular Category', val: 'Appliances', color: 'text-orange-500' },
                    { label: 'Sync Status', val: 'Perfect', color: 'text-blue-500' },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-50">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        <span className={cn("text-xs font-black", stat.color)}>{stat.val}</span>
                    </div>
                  ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
