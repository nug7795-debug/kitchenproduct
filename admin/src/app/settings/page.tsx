'use client';

import * as React from 'react';
import { Settings, Save, Shield, Smartphone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [merchantData, setMerchantData] = React.useState({
    upi_id: '',
    merchant_name: '',
    merchant_code: '',
    mode: 'manual'
  });

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', 'merchant_config')
        .single();

      if (data) {
        setMerchantData(data.value);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setFetching(false);
    }
  };

  React.useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ 
          key: 'merchant_config', 
          value: merchantData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Settings saved successfully!');
    } catch (err: any) {
      alert('Error saving settings: ' + err.message);
    } finally {
      setLoading(true); // Keep loading state until success alert is cleared
      setTimeout(() => setLoading(false), 500);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store's identity and payment preferences.</p>
      </div>

      {fetching ? (
        <div className="bg-white p-12 rounded-xl border shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading store settings...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
        {/* Payment Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
          <h3 className="font-bold flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-orange-500" /> UPI Merchant Details
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Merchant UPI ID (VPA)</label>
              <input 
                type="text" 
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                value={merchantData.upi_id}
                onChange={(e) => setMerchantData({...merchantData, upi_id: e.target.value})}
                placeholder="e.g. yourname@okaxis"
              />
              <p className="text-[10px] text-muted-foreground">This is where your money will be received.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name (Merchant Name)</label>
              <input 
                type="text" 
                className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                value={merchantData.merchant_name}
                onChange={(e) => setMerchantData({...merchantData, merchant_name: e.target.value})}
                placeholder="e.g. KitchenProduct Official"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Merchant Category Code (MCC)</label>
                <input 
                  type="text" 
                  className="w-full rounded-md border p-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                  value={merchantData.merchant_code}
                  onChange={(e) => setMerchantData({...merchantData, merchant_code: e.target.value})}
                  placeholder="e.g. 0000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Mode</label>
                <select className="w-full rounded-md border p-2 text-sm bg-white outline-none">
                  <option value="manual">Manual UTR Verification</option>
                  <option value="automated">Automated (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              These details are used to generate the UPI Deep Link. Ensure they match your registered UPI business profile to avoid transaction failures.
            </p>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" /> Security
          </h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Force HTTPS</label>
              <p className="text-xs text-muted-foreground">Require secure connections for all API calls.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Auto-Logout Admin</label>
              <p className="text-xs text-muted-foreground">Session expires after 2 hours of inactivity.</p>
            </div>
            <input type="checkbox" defaultChecked className="rounded border-slate-300 text-orange-500" />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading || fetching} 
          className="w-full py-6 text-lg bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
        >
          {loading ? 'Saving Changes...' : 'Save All Settings'}
          <Save className="ml-2 h-5 w-5" />
        </Button>
      </form>
      )}
    </div>
  );
}
