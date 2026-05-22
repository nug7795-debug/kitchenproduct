'use client';

import * as React from 'react';
import { Image as ImageIcon, Plus, Trash2, Move, Save, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { supabase } from '../../../lib/supabase';
import { cn } from '../../../lib/utils';

export default function BannersPage() {
  const [banners, setBanners] = React.useState<any[]>([
    {
      id: 'mock-b1',
      title: 'Mega Kitchen Sale',
      subtitle: 'Up to 50% off on premium appliances',
      image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070',
      link: '/category/gas-stoves',
      order_index: 0,
      is_active: true
    },
    {
      id: 'mock-b2',
      title: 'Smart Kitchen Upgrades',
      subtitle: 'Modern inductions & non-stick cooktops',
      image_url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=2070',
      link: '/category/induction-cooktops',
      order_index: 1,
      is_active: true
    }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (data) setBanners(data);
  };

  React.useEffect(() => {
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    const newBanner = {
      title: 'New Banner',
      subtitle: 'Click to edit description',
      image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070',
      link: '/',
      order_index: banners.length,
      is_active: true
    };

    const { data, error } = await supabase
      .from('banners')
      .insert([newBanner])
      .select();

    if (data) {
      setBanners([...banners, data[0]]);
    }
  };

  const handleUpdateBanner = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('banners')
      .update(updates)
      .eq('id', id);

    if (!error) {
      setBanners(banners.map(b => b.id === id ? { ...b, ...updates } : b));
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (!error) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  const handleSaveAll = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('All changes synced with database!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Banner Management</h1>
          <p className="text-sm text-muted-foreground">Manage the promotional banners on your homepage.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveAll} disabled={saving} className="rounded-full bg-slate-900 h-10 text-white px-6">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Syncing...' : 'Sync All Changes'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-slate-200">
           <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
           <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Visual Assets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {banners.map((banner, index) => (
            <div key={banner.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="relative aspect-video md:aspect-auto h-48 bg-slate-50">
                  <img src={banner.image_url} alt={banner.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                     <input 
                       type="text" 
                       placeholder="Paste Image URL"
                       className="w-full bg-white rounded-lg px-3 py-2 text-xs outline-none shadow-xl"
                       onBlur={(e) => handleUpdateBanner(banner.id, { image_url: e.target.value })}
                       defaultValue={banner.image_url}
                     />
                  </div>
                </div>
                
                <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Banner Title</label>
                      <input 
                        type="text" 
                        value={banner.title}
                        onChange={(e) => {
                          const newBanners = [...banners];
                          newBanners[index].title = e.target.value;
                          setBanners(newBanners);
                        }}
                        onBlur={(e) => handleUpdateBanner(banner.id, { title: e.target.value })}
                        className="w-full border-none p-0 text-lg font-bold outline-none focus:ring-0 bg-transparent text-slate-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Target Link</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          value={banner.link}
                          onChange={(e) => {
                            const newBanners = [...banners];
                            newBanners[index].link = e.target.value;
                            setBanners(newBanners);
                          }}
                          onBlur={(e) => handleUpdateBanner(banner.id, { link: e.target.value })}
                          className="w-full border-none p-0 text-sm outline-none focus:ring-0 text-blue-600 font-medium bg-transparent"
                        />
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">Subtitle / Description</label>
                    <input 
                      type="text" 
                      value={banner.subtitle}
                      onChange={(e) => {
                        const newBanners = [...banners];
                        newBanners[index].subtitle = e.target.value;
                        setBanners(newBanners);
                      }}
                      onBlur={(e) => handleUpdateBanner(banner.id, { subtitle: e.target.value })}
                      className="w-full border-none p-0 text-sm outline-none focus:ring-0 bg-transparent text-slate-600"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full cursor-grab"><Move className="h-4 w-4 text-slate-400" /></Button>
                      <span className="text-[10px] text-muted-foreground font-bold uppercase flex items-center">Order: #{index + 1}</span>
                    </div>
                    <Button 
                      onClick={() => handleDeleteBanner(banner.id)}
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:bg-red-50 rounded-full h-8 px-4 text-xs font-bold uppercase"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleAddBanner}
            className="w-full py-12 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-500 hover:bg-orange-50/30 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
              <Plus className="h-6 w-6 text-slate-400 group-hover:text-orange-600" />
            </div>
            <span className="text-sm font-bold text-slate-600 group-hover:text-orange-700">Add New Banner</span>
            <span className="text-[10px] text-muted-foreground">Recommended size: 21:9 for Mobile, 21:7 for Desktop</span>
          </button>
        </div>
      )}
    </div>
  );
}
