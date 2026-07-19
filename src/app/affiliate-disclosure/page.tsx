'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';

export default function AffiliateDisclosurePage() {
  const [settings, setSettings] = React.useState({
    storeName: 'Kitchen Product',
    supportEmail: 'hello@kitchenproduct.com'
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
            supportEmail: data.value.supportEmail || 'hello@kitchenproduct.com'
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSettings();
  }, []);

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/60 max-w-lg mx-auto">
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
          Affiliate Disclosure
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: July 19, 2026</p>

          <p>
            Welcome to <span className="text-[#2874f0] font-bold">{settings.storeName}</span>. In order to keep our website running and providing high-quality reviews, comparisons, and product listings, we participate in various affiliate marketing programs.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">What is an Affiliate Link?</h3>
          <p>
            An affiliate link is a special URL that contains a tracking code. When you click on one of our recommended products and purchase that item through our link, we receive a small commission from the seller/retailer. 
          </p>
          <p className="text-orange-600 font-bold">
            Important Note: This commission comes at absolutely NO extra cost to you. The price of the product remains exactly the same whether you buy it through our link or directly from the merchant.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Our Standards & Honesty</h3>
          <p>
            Even though we receive compensation through affiliate programs, we are committed to providing honest, unbiased, and helpful product information. We only recommend products that we believe are of high quality, useful, and relevant to kitchen and home improvement needs.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Contact Us</h3>
          <p>
            If you have any questions regarding this disclosure or our affiliate partnerships, please feel free to reach out to us by email at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
