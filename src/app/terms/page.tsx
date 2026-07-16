'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';

export default function TermsPage() {
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
          Terms & Conditions
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: July 16, 2026</p>

          <p>
            Welcome to <span className="text-[#2874f0] font-bold">{settings.storeName}</span>!
          </p>

          <p>
            These terms and conditions outline the rules and regulations for the use of {settings.storeName}'s Website, located at our web address.
          </p>

          <p>
            By accessing this website, we assume you accept these terms and conditions. Do not continue to use {settings.storeName} if you do not agree to take all of the terms and conditions stated on this page.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">License</h3>
          <p>
            Unless otherwise stated, {settings.storeName} and/or its licensors own the intellectual property rights for all material on {settings.storeName}. All intellectual property rights are reserved. You may access this from {settings.storeName} for your own personal use subjected to restrictions set in these terms and conditions.
          </p>

          <p className="font-bold text-slate-800">You must not:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Copy or republish material from {settings.storeName}</li>
            <li>Sell, rent, or sub-license material from {settings.storeName}</li>
            <li>Reproduce, duplicate or copy material from {settings.storeName}</li>
            <li>Redistribute content from {settings.storeName}</li>
          </ul>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Hyperlinking to our Content</h3>
          <p>
            The following organizations may link to our Website without prior written approval: Government agencies, Search engines, News organizations, Online directory distributors, and System-wide Accredited Businesses.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Product Information & Orders</h3>
          <p>
            We attempt to display product details, descriptions, images, and prices as accurately as possible. However, we do not warrant that product descriptions or other content are error-free. We reserve the right to refuse or cancel any orders placed for products listed at incorrect prices or containing incorrect details.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Disclaimer of Liability</h3>
          <p>
            To the maximum extent permitted by applicable law, we exclude all representations, warranties, and conditions relating to our website and the use of this website. Nothing in this disclaimer will limit or exclude our or your liability for death or personal injury resulting from negligence, fraud, or misrepresentation.
          </p>

          <p className="pt-4 border-t border-slate-100 text-[10px] text-slate-500 font-bold text-center">
            For any queries or concerns regarding these Terms, please contact us at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
