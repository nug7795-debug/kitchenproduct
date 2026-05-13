'use client';

import * as React from 'react';
import { Layers, Plus, Edit2, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { id: 1, name: 'Appliances', slug: 'appliances', products: 45, status: 'active' },
  { id: 2, name: 'Cookware', slug: 'cookware', products: 32, status: 'active' },
  { id: 3, name: 'Accessories', slug: 'accessories', products: 18, status: 'active' },
  { id: 4, name: 'Smart Kitchen', slug: 'smart-kitchen', products: 12, status: 'inactive' },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories.</p>
        </div>
        <Button className="rounded-full bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
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
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                        <Layers className="h-5 w-5" />
                      </div>
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">/{cat.slug}</td>
                    <td className="px-6 py-4">{cat.products}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        cat.status === 'active' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      )}>
                        {cat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
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

import { cn } from '@/lib/utils';
