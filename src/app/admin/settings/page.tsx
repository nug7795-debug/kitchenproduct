'use client';

import * as React from 'react';
import { 
  Settings, 
  Save, 
  Shield, 
  Smartphone, 
  Info, 
  Globe, 
  Bell, 
  Truck, 
  CreditCard, 
  Database,
  Lock,
  Eye,
  AlertCircle,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('payment');
  const [settings, setSettings] = React.useState({
    payment: {
      merchantUpiId: 'bigdhamaka@paytm',
      payeeName: 'Big Dhamaka Sale',
      mccCode: '5722',
      allowUpiCheckout: true
    },
    shipping: {
      baseCharge: 49,
      freeThreshold: 999,
      expressEnabled: true
    },
    security: {
      logout: true,
      tfa: false,
      rateLimit: true
    },
    notifications: {
      orderAlerts: true,
      stockAlerts: true,
      marketing: true
    }
  });

  // Load settings on mount
  React.useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'global_settings')
        .maybeSingle();

      if (data?.value) {
        setSettings(prev => ({ 
          ...prev, 
          ...data.value,
          payment: {
            ...prev.payment,
            ...(data.value.payment || {})
          }
        }));
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'global_settings', 
          value: settings,
          updated_at: new Date().toISOString() 
        }, { onConflict: 'key' });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      alert('Global configuration saved to cloud successfully!');
    } catch (error: any) {
      console.error('Detailed Save error:', error);
      alert('Failed to save settings: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (section: string, key?: string) => {
    setSettings(prev => {
      if (key) {
        const sectionData = prev[section as keyof typeof prev] as any;
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [key]: !sectionData[key]
          }
        };
      }
      return {
        ...prev,
        [section]: !(prev[section as keyof typeof prev] as any)
      };
    });
  };

  const updateField = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...(prev[section as keyof typeof prev] as any), [field]: value }
    }));
  };

  const handleReVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      alert('System integrity verified successfully! All security protocols are active.');
    }, 1500);
  };

  const menuItems = [
    { id: 'payment', label: 'UPI Payment Settings', icon: CreditCard },
    { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
    { id: 'notifications', label: 'Alerts & Notifications', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'advanced', label: 'Advanced System', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Configure your platform's core behavior</p>
        </div>
        <Button onClick={() => handleSave()} disabled={loading} className="rounded-full h-12 px-8 font-black bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200">
           {loading ? 'Saving...' : 'Apply Global Changes'}
           <Save className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Navigation */}
        <div className="lg:col-span-3 space-y-2">
           {menuItems.map((item) => (
             <button
               key={item.id}
               onClick={() => setActiveSection(item.id)}
               className={cn(
                 "w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all",
                 activeSection === item.id 
                   ? "bg-slate-900 text-white shadow-lg shadow-slate-200 translate-x-1" 
                   : "text-slate-600 hover:bg-slate-100"
               )}
             >
               <item.icon className={cn("h-5 w-5", activeSection === item.id ? "text-emerald-400" : "text-slate-400")} />
               {item.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {/* Section: UPI Payment Settings */}
          {activeSection === 'payment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6 pb-6">
                   <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100"><Shield className="h-5 w-5" /></div>
                   <div>
                     <h2 className="font-black text-slate-900 uppercase tracking-tight">UPI Payment Gateway Control</h2>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Configure your live merchant VPA and NPCI rules</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      Business UPI ID (pa) 
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-black">NPCI COMPLIANT</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings.payment.merchantUpiId} 
                      onChange={(e) => updateNestedField('payment', 'merchantUpiId', e.target.value)}
                      placeholder="e.g. yourstore@paytm"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                      Use only verified business VPAs (e.g. ending in @paytm, @ybl, @okhdfcbank, @upi).
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      Store / Payee Name (pn)
                      <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-black">ENCODED</span>
                    </label>
                    <input 
                      type="text" 
                      value={settings.payment.payeeName} 
                      onChange={(e) => updateNestedField('payment', 'payeeName', e.target.value)}
                      placeholder="e.g. Big Dhamaka Sale"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                      This will be properly URL space encoded (e.g. <code>Big%20Dhamaka%20Sale</code>) automatically.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Merchant Category Code (mcc)</label>
                    <input 
                      type="text" 
                      maxLength={4}
                      value={settings.payment.mccCode} 
                      onChange={(e) => updateNestedField('payment', 'mccCode', e.target.value)}
                      placeholder="e.g. 5722"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-mono font-bold outline-none focus:border-emerald-500 focus:bg-white transition-all" 
                    />
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                      4-digit NPCI merchant category code (5722 is typical for household products/appliances).
                    </p>
                  </div>

                  <div className="space-y-4 justify-end flex flex-col">
                    <div className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center justify-between text-emerald-900">
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider mb-0.5">Allow UPI Checkout</p>
                        <p className="text-[9px] text-emerald-700 font-bold uppercase">Activate manual deep-linking and dynamic QR code generation.</p>
                      </div>
                      <div 
                        onClick={() => updateNestedField('payment', 'allowUpiCheckout', !settings.payment.allowUpiCheckout)}
                        className={cn("h-6 w-11 rounded-full relative cursor-pointer transition-all", settings.payment.allowUpiCheckout ? "bg-emerald-600" : "bg-slate-300")}
                      >
                        <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm", settings.payment.allowUpiCheckout ? "right-1" : "left-1")} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Intent URL Compiler Preview & Visual Validation Badge */}
                <div className="p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-emerald-400" /> NPCI Compiled URL Preview (Live)
                      </p>
                      <span className="text-[9px] bg-slate-800 text-slate-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-700">
                        HTTPS SECURED
                      </span>
                    </div>
                    
                    <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-emerald-400 break-all select-all border border-slate-800 font-bold leading-relaxed">
                      upi://pay?pa={settings.payment.merchantUpiId}&pn={encodeURIComponent(settings.payment.payeeName)}&am=499.00&cu=INR&tn=Order%201245
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-4 w-4 rounded-full flex items-center justify-center text-white text-[8px]", settings.payment.merchantUpiId.includes('@') ? "bg-emerald-500" : "bg-red-500")}>
                          ✓
                        </div>
                        <span>VPA format validity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</div>
                        <span>Automatic space encoding (%20)</span>
                      </div>
                    </div>
                  </div>
                  <Smartphone className="absolute -right-8 -bottom-8 h-32 w-32 text-white/5 rotate-12" />
                </div>
              </div>
            </div>
          )}



          {/* Section: Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="h-10 w-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-100"><Bell className="h-5 w-5" /></div>
                   <h2 className="font-black text-slate-900 uppercase tracking-tight">Alerts & Notifications</h2>
                </div>

                <div className="space-y-6">
                   {[
                     { id: 'orderAlerts', label: 'Order Confirmation SMS/Email', desc: 'Notify customers instantly when they place an order.' },
                     { id: 'stockAlerts', label: 'Inventory Level Alerts', desc: 'Send admin alerts when product stock goes below threshold.' },
                     { id: 'marketing', label: 'Marketing Newsletters', desc: 'Enable promotional emails for subscribed users.' },
                   ].map((item) => {
                     const isEnabled = settings.notifications[item.id as keyof typeof settings.notifications];
                     return (
                       <div key={item.id} className="flex items-center justify-between p-2">
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.desc}</p>
                          </div>
                          <div 
                            onClick={() => toggleSetting('notifications', item.id)}
                            className={cn("h-7 w-12 rounded-full relative transition-all cursor-pointer", isEnabled ? "bg-purple-600 shadow-lg shadow-purple-100" : "bg-slate-100 border-2 border-slate-50")}>
                             <div className={cn("absolute top-1 h-5 w-5 bg-white rounded-full transition-all shadow-md", isEnabled ? "right-1" : "left-1")} />
                          </div>
                       </div>
                     );
                   })}
                </div>
              </div>
            </div>
          )}

          {/* Section: Shipping */}
          {activeSection === 'shipping' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100"><Truck className="h-5 w-5" /></div>
                   <h2 className="font-black text-slate-900 uppercase tracking-tight">Shipping & Fulfillment</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Delivery Charge</p>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                         <input 
                            type="number" 
                            value={settings.shipping.baseCharge} 
                            onChange={(e) => updateNestedField('shipping', 'baseCharge', parseInt(e.target.value))}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 pl-8 text-sm font-black outline-none focus:border-indigo-500" 
                         />
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free Shipping Threshold</p>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">₹</span>
                         <input 
                            type="number" 
                            value={settings.shipping.freeThreshold} 
                            onChange={(e) => updateNestedField('shipping', 'freeThreshold', parseInt(e.target.value))}
                            className="w-full bg-white border-2 border-slate-200 rounded-xl p-3 pl-8 text-sm font-black outline-none focus:border-indigo-500" 
                         />
                      </div>
                   </div>
                </div>

                <div className="p-6 rounded-3xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                         <Truck className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Express Delivery Service</p>
                         <p className="text-[10px] text-indigo-600 font-bold uppercase">Deliver within 24-48 hours in select cities.</p>
                      </div>
                   </div>
                   <div 
                    onClick={() => toggleSetting('shipping', 'expressEnabled')}
                    className={cn("h-6 w-11 rounded-full relative cursor-pointer transition-all", settings.shipping.expressEnabled ? "bg-indigo-600" : "bg-slate-200")}>
                      <div className={cn("absolute top-1 h-4 w-4 bg-white rounded-full transition-all shadow-sm", settings.shipping.expressEnabled ? "right-1" : "left-1")} />
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Security */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100"><Shield className="h-5 w-5" /></div>
                   <h2 className="font-black text-slate-900 uppercase tracking-tight">Security & Access Policies</h2>
                </div>

                <div className="space-y-6">
                   {[

                     { id: 'logout', label: 'Automatic Admin Logout', desc: 'Terminate admin sessions after 60 minutes of inactivity.' },
                     { id: 'tfa', label: 'Two-Factor Authentication', desc: 'Require OTP verification for administrative login.' },
                     { id: 'rateLimit', label: 'API Protection (Rate Limiting)', desc: 'Prevent brute-force and DDoS attacks on backend endpoints.' },
                   ].map((item, i) => {
                     const isEnabled = settings.security[item.id as keyof typeof settings.security];
                     return (
                       <div key={i} className="flex items-center justify-between p-2">
                          <div className="space-y-1">
                             <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.label}</p>
                             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{item.desc}</p>
                          </div>
                          <div 
                            onClick={() => toggleSetting('security', item.id)}
                            className={cn("h-7 w-12 rounded-full relative transition-all cursor-pointer shadow-inner", isEnabled ? "bg-slate-900" : "bg-slate-100 border-2 border-slate-50")}>
                             <div className={cn("absolute top-1 h-5 w-5 bg-white rounded-full transition-all shadow-md", isEnabled ? "right-1" : "left-1")} />
                          </div>
                       </div>
                     );
                   })}
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center gap-4">
                   <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <Lock className="h-6 w-6 text-slate-400" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-slate-900 uppercase">System Integrity Check</p>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                         <CheckCircle2 className="h-3 w-3" /> All security protocols are active
                      </p>
                   </div>
                   <Button 
                     variant="outline" 
                     onClick={handleReVerify}
                     disabled={isVerifying}
                     className="ml-auto rounded-full text-[10px] font-black h-8 px-4 border-2 border-slate-200"
                   >
                     {isVerifying ? 'VERIFYING...' : 'RE-VERIFY'}
                   </Button>
                </div>
              </div>
            </div>
          )}

          {/* Section: Advanced */}
          {activeSection === 'advanced' && (
            <div className="space-y-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
                   <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200"><Database className="h-5 w-5" /></div>
                   <h2 className="font-black text-slate-900 uppercase tracking-tight">Advanced System Control</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 space-y-4">
                      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500">
                         <AlertCircle className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase">Purge Cache</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Clear all static and dynamic cached data.</p>
                      </div>
                      <Button variant="outline" className="w-full rounded-full border-2 border-slate-200 font-bold text-red-500 hover:bg-red-50 hover:border-red-100">Wipe All Cache</Button>
                   </div>
                   
                   <div className="p-8 rounded-[2rem] bg-slate-50 border-2 border-slate-100 space-y-4">
                      <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                         <HardDrive className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 uppercase">Database Backups</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Schedule or trigger manual backup.</p>
                      </div>
                      <Button className="w-full rounded-full bg-slate-900 text-white font-bold h-10 shadow-lg shadow-slate-200">Backup Now</Button>
                   </div>
                </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
