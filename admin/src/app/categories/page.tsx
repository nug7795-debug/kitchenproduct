'use client';

import * as React from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      if (data) setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(categories.filter(c => c.id !== id));
      alert('Category deleted successfully');
    } catch (err: any) {
      alert('Error deleting category: ' + err.message);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleAddCategory = async () => {
    const name = window.prompt('Enter category name:');
    if (!name) return;

    try {
      const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, slug, is_active: true }])
        .select()
        .single();

      if (error) throw error;
      if (data) setCategories([...categories, data]);
      alert('Category added successfully!');
    } catch (err: any) {
      alert('Error adding category: ' + err.message);
    }
  };

  const handleEditCategory = async (id: string, currentName: string) => {
    const newName = window.prompt('Edit category name:', currentName);
    if (!newName || newName === currentName) return;

    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;
      setCategories(categories.map(c => c.id === id ? { ...c, name: newName } : c));
      alert('Category updated successfully!');
    } catch (err: any) {
      alert('Error updating category: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-full text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <Button 
            className="rounded-full bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-100"
            onClick={handleAddCategory}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Products</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4"><div className="h-10 w-40 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-10 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-20 bg-slate-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      {searchTerm ? `No categories matching "${searchTerm}"` : 'No categories found.'}
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                          <Layers className="h-5 w-5" />
                        </div>
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">/{cat.slug}</td>
                      <td className="px-6 py-4">{cat.products_count || 0}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                          cat.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {cat.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:text-orange-600"
                            onClick={() => handleEditCategory(cat.id, cat.name)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600"
                            onClick={() => handleDelete(cat.id, cat.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Categories</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Top Category</span>
                <span className="font-bold text-orange-500">Appliances</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Empty Categories</span>
                <span className="font-bold">2</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 space-y-2">
            <h4 className="font-bold text-orange-900 text-sm">Pro Tip</h4>
            <p className="text-xs text-orange-800 leading-relaxed">
              Use descriptive slugs and high-quality images for categories to improve SEO and user navigation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
