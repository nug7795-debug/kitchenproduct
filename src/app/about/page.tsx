'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';
import { ChefHat, Compass, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  const [settings, setSettings] = React.useState({
    storeName: 'Kitchen Product',
    supportEmail: 'kitchenproduct@gmail.com'
  });

  React.useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'global_settings')
          .maybeSingle();
        if (data?.value) {
          setSettings({
            storeName: data.value.storeName || 'Kitchen Product',
            supportEmail: data.value.supportEmail || 'kitchenproduct@gmail.com'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="bg-white min-h-screen py-6 px-4">
      <div className="bg-white max-w-lg mx-auto">
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
          About Us
        </h1>

        <div className="text-slate-700 text-sm leading-relaxed space-y-5 font-semibold">
          <p>
            Welcome to <span className="text-[#2874f0] font-bold">{settings.storeName}</span>, your premier online destination for premium, high-quality kitchen tools, cookware, and professional appliances in India.
          </p>

          <p>
            Our mission is simple: to make cooking an effortless, enjoyable, and professional experience for home chefs and culinary enthusiasts alike. We carefully curate our catalog, ensuring that every product meets rigorous standards of durability, performance, and aesthetic elegance.
          </p>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex gap-3 items-start bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <ChefHat className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">Expert Curation</h4>
                <p className="text-xs text-slate-500 font-bold mt-1">Every item in our collection is handpicked by kitchen experts to deliver the best culinary results.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <ShieldCheck className="h-5 w-5 text-[#388e3c] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">Quality Assured</h4>
                <p className="text-xs text-slate-500 font-bold mt-1">We stand behind the quality of our products with robust warranties and hassle-free returns.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <Compass className="h-5 w-5 text-[#2874f0] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">Customer First</h4>
                <p className="text-xs text-slate-500 font-bold mt-1">Our dedicated support team is always ready to assist you on your culinary journey.</p>
              </div>
            </div>
          </div>

          <p className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-bold text-center">
            For questions or feedback, reach out to us at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
