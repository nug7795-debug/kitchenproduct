'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="text-slate-700 text-xs leading-relaxed space-y-4 font-semibold">
          <p className="text-slate-500 font-bold">Last Updated: 12 Jul 2016</p>
          
          <p>
            At <span className="text-[#2874f0] font-bold">{settings.storeName}</span>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by {settings.storeName} and how we use it.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Log Files</h3>
          <p>
            {settings.storeName} follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Cookies and Web Beacons</h3>
          <p>
            Like any other website, {settings.storeName} uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Google DoubleClick DART Cookie</h3>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-[#2874f0] hover:underline">https://policies.google.com/technologies/ads</a>.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Our Advertising Partners</h3>
          <p>
            Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google. Each of our advertising partners has their own Privacy Policy for their policies on user data.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Privacy Policies</h3>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of {settings.storeName}. Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on {settings.storeName}, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that {settings.storeName} has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Third Party Privacy Policies</h3>
          <p>
            {settings.storeName}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
          </p>

          <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide pt-2">Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>

          <p className="pt-4 border-t border-slate-100 text-[10px] text-slate-500 font-bold text-center">
            If you require any more information or have any questions about our privacy policy, please feel free to contact us by email at{' '}
            <a href={`mailto:${settings.supportEmail}`} className="text-[#2874f0] hover:underline">
              {settings.supportEmail}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
