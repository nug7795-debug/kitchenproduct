'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';

export default function DmcaPage() {
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
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/60 max-w-lg mx-auto">
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
          DMCA Policy
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: July 16, 2026</p>

          <p>
            This Digital Millennium Copyright Act policy ("Policy") applies to the website and any of its related products and services (collectively, "Services") and outlines how this website operator ("Operator", "we", "us" or "our") addresses copyright infringement notifications and how you ("you" or "your") may submit a copyright infringement complaint.
          </p>

          <p>
            Protection of intellectual property is of utmost importance to us. We respond to clear notices of alleged copyright infringement that comply with the Digital Millennium Copyright Act ("DMCA") of 1998.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">What to consider before submitting a copyright complaint</h3>
          <p>
            Please note that under 17 U.S.C. § 512(f), you may be liable for any damages, including costs and attorneys' fees incurred by us or our users, if you knowingly misrepresent that the material or activity is infringing. If you are unsure whether the material you are reporting is in fact infringing, you may wish to contact an attorney before filing a notification with us.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Notifications of infringement</h3>
          <p>
            If you are a copyright owner or an agent thereof, and you believe that any content on our Services infringes your copyrights, then you may submit a written copyright infringement notification ("Notification") using the contact details below. All such Notifications must comply with the DMCA requirements.
          </p>
          <p>
            Filing a DMCA complaint is the start of a pre-defined legal process. Your complaint will be reviewed for accuracy, validity, and completeness. If your complaint has satisfied these requirements, our response may include the removal or restriction of access to allegedly infringing material.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Reporting copyright infringement</h3>
          <p>
            If you would like to notify us of the infringing material or activity, we encourage you to contact us by email at:
          </p>
          <p className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center font-bold text-[#2874f0]">
            <a href={`mailto:${settings.supportEmail}`} className="hover:underline">
              {settings.supportEmail}
            </a>
          </p>

          <p className="text-[10px] text-slate-500 mt-4">
            Please allow 2-5 business days for an email response. Note that email notifications must include precise URL links to the allegedly infringing material, proof of authority to act on behalf of the copyright owner, and direct contact details.
          </p>
        </div>
      </div>
    </div>
  );
}
