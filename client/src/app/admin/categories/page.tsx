'use client';

import * as React from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Image as ImageIcon, ExternalLink, MoreVertical, Loader2, Save } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (data) setCategories(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    const name = prompt('Enter Category Name:');
    if (!name) return;
    
    const slug = name.toLowerCase().replace(/ /g, '-');
    const newCat = {
      name,
      slug,
      is_active: true
    };

    const { data, error } = await supabase
      .from('categories')
      .insert([newCat])
      .select();

    if (data) {
      setCategories([...categories, data[0]]);
    }
  };

  const handleUpdateCategory = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This may affect products in this category.')) return;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (!error) {
      setCategories(categories.filter(c => c.id !== id));
    }
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
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-5">Label & Content</th>
                    <th className="px-8 py-5">System Slug</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Collections...</p>
                      </td>
                    </tr>
                  ) : categories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">No collections found</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Start by adding your first category</p>
                      </td>
                    </tr>
                  ) : categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100 flex-shrink-0 group-hover:border-orange-200 transition-all relative">
                                <img src={cat.image_url || 'https://via.placeholder.com/100'} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                                   <input 
                                     type="text" 
                                     placeholder="URL"
                                     className="w-full bg-white rounded px-1 py-0.5 text-[8px]"
                                     onBlur={(e) => handleUpdateCategory(cat.id, { image_url: e.target.value })}
                                     defaultValue={cat.image_url}
                                   />
                                </div>
                            </div>
                            <div>
                                <input 
                                  className="font-black text-slate-900 tracking-tight leading-tight bg-transparent outline-none border-b border-transparent focus:border-slate-200"
                                  defaultValue={cat.name}
                                  onBlur={(e) => handleUpdateCategory(cat.id, { name: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Collection</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black tracking-wider uppercase">/{cat.slug}</span>
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => handleUpdateCategory(cat.id, { is_active: !cat.is_active })}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors",
                            cat.is_active !== false ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          <div className={cn("h-1.5 w-1.5 rounded-full", cat.is_active !== false ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
                          {cat.is_active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-sm transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <Button asChild className="w-full rounded-2xl bg-white text-slate-900 h-12 font-black group">
                        <a href="/admin/banners">Enter Banner Lab <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
                    </Button>
                </div>
                <ImageIcon className="absolute -right-8 -bottom-8 h-40 w-40 text-white/5 -rotate-12" />
           </div>
        </div>
      </div>
    </div>
  );
}
