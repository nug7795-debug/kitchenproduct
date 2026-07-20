'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';

export default function DisclaimerPage() {
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
          Disclaimer
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: 12 Jul 2016</p>

          <p>
            If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Disclaimers for {settings.storeName}</h3>
          <p>
            All the information on this website is published in good faith and for general information purpose only. {settings.storeName} does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website ({settings.storeName}), is strictly at your own risk. {settings.storeName} will not be liable for any losses and/or damages in connection with the use of our website.
          </p>

          <p>
            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
          </p>

          <p>
            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Product Usage Disclaimer</h3>
          <p>
            The products sold on {settings.storeName} (including but not limited to electronic kitchen appliances, knives, sharp utensils, and gas stoves) should be operated only in accordance with the manufacturer's instruction manual. We are not liable for any injuries, accidents, fire hazards, or damages resulting from incorrect operation or negligent use of these products. Keep out of reach of children where appropriate.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Consent</h3>
          <p>
            By using our website, you hereby consent to our disclaimer and agree to its terms.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Update</h3>
          <p>
            Should we update, amend or make any changes to this document, those changes will be prominently posted here.
          </p>
        </div>
      </div>
    </div>
  );
}
