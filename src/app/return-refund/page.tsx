'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';
import { RotateCcw, ShieldCheck, Mail } from 'lucide-react';

export default function ReturnRefundPage() {
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
          Return & Refund Policy
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: 12 Jul 2016</p>

          <p>
            At <span className="text-[#2874f0] font-bold">{settings.storeName}</span>, customer satisfaction is our top priority. We offer a transparent and easy return and refund policy to ensure you have a seamless shopping experience.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">7-Day Return & Replacement Policy</h3>
          <p>
            We offer a **7-Day Return and Replacement Policy** for all purchases. If you receive a product that is damaged, defective, or different from what you ordered, you can request a replacement or refund within 7 days of receiving the delivery.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Eligibility Criteria for Returns</h3>
          <p>
            To be eligible for a return or replacement, please ensure:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The request is raised within 7 days of delivery.</li>
            <li>The product is unused, unwashed, and in its original condition.</li>
            <li>All original packaging, tags, user manuals, and warranty cards are intact.</li>
            <li>The product must include all accessories or freebies that came with it.</li>
          </ul>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Non-Returnable Items</h3>
          <p>
            Certain types of items cannot be returned due to hygiene and safety guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Personal care products or items that come in direct contact with food once opened (unless defective).</li>
            <li>Products that show signs of physical damage or misuse by the customer.</li>
            <li>Any item that is missing its serial number or barcode.</li>
          </ul>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">How to Request a Return</h3>
          <p>
            You can initiate a return or replacement by contacting our support team:
          </p>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
            <p className="flex items-center gap-2 font-bold text-slate-800">
              <Mail className="h-4 w-4 text-[#2874f0]" /> Email:{' '}
              <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
                {settings.supportEmail}
              </a>
            </p>
            <p className="text-[11px] text-slate-500 font-bold">
              Please include your **Order ID**, clear photos or a short video showing the defect/damage, and a brief description of the issue.
            </p>
          </div>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Refund Process</h3>
          <p>
            Once your return request is approved and the product is picked up and inspected by our warehouse team, we will process your refund:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>**Prepaid Orders**: Refunds will be credited back to your original payment method (UPI, Debit/Credit Card, Net Banking) within 3-5 business days.</li>
            <li>**Cash on Delivery (COD) / Manual UPI**: You will be asked to provide your UPI ID or bank account details, and the refund will be transferred within 48 hours of product approval.</li>
          </ul>

          <p className="pt-4 border-t border-slate-100 text-[10px] text-slate-500 font-bold text-center">
            If you have any further questions regarding returns or refunds, please reach out to us at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
