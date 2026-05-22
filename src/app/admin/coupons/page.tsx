'use client';

import * as React from 'react';
import { Ticket, Plus, Trash2, Search, Percent, CircleDollarSign, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import { supabase } from '../../../lib/supabase';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = React.useState<any[]>([
    { id: 'mock-c1', code: 'WELCOME10', discount_type: 'percent', discount_value: 10, min_order_amount: 499, is_active: true },
    { id: 'mock-c2', code: 'FLAT200', discount_type: 'flat', discount_value: 200, min_order_amount: 1999, is_active: true },
    { id: 'mock-c3', code: 'FESTIVE15', discount_type: 'percent', discount_value: 15, min_order_amount: 999, is_active: false }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // New coupon form state
  const [code, setCode] = React.useState('');
  const [discountType, setDiscountType] = React.useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = React.useState('');
  const [minOrderAmount, setMinOrderAmount] = React.useState('');

  const fetchCoupons = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setCoupons(data);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCoupons(false);
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError(null);

    const formattedCode = code.toUpperCase().replace(/\s+/g, '');
    const value = parseFloat(discountValue);
    const minAmount = minOrderAmount ? parseFloat(minOrderAmount) : 0;

    if (isNaN(value) || value <= 0) {
      setError('Discount value must be a positive number.');
      setSaving(false);
      return;
    }

    if (discountType === 'percent' && value > 100) {
      setError('Percentage discount cannot exceed 100%.');
      setSaving(false);
      return;
    }

    const newCoupon = {
      code: formattedCode,
      discount_type: discountType,
      discount_value: value,
      min_order_amount: minAmount,
      is_active: true
    };

    const { data, error: apiError } = await supabase
      .from('coupons')
      .insert([newCoupon])
      .select();

    if (apiError) {
      setError(apiError.message || 'Error creating coupon.');
    } else if (data) {
      setCoupons([data[0], ...coupons]);
      setCode('');
      setDiscountValue('');
      setMinOrderAmount('');
    }
    setSaving(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('coupons')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon code? This action cannot be undone.')) return;
    
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);

    if (!error) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Coupon Control Room</h1>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Create, manage and synchronize customer promo codes</p>
        </div>
        <button
          onClick={() => fetchCoupons(true)}
          className="self-start md:self-auto h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors shadow-xs"
        >
          <RefreshCw className={cn("h-5 w-5", loading && "animate-spin")} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Coupons List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase text-slate-400 font-black tracking-[0.15em]">
                  <tr>
                    <th className="px-8 py-5">Promo Code</th>
                    <th className="px-8 py-5">Benefit Type</th>
                    <th className="px-8 py-5">Discount Value</th>
                    <th className="px-8 py-5">Min Order Criteria</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <Loader2 className="h-10 w-10 animate-spin mx-auto text-orange-500" />
                        <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Promo Vault...</p>
                      </td>
                    </tr>
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <p className="text-sm font-black text-slate-800 uppercase tracking-tight">No active coupons found</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Start by forging your first promo code</p>
                      </td>
                    </tr>
                  ) : coupons.map((coupon) => (
                    <tr key={coupon.id} className="group hover:bg-slate-50/50 transition-all">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                            <Ticket className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <span className="font-black text-slate-900 tracking-wider text-xs uppercase bg-slate-100 border border-slate-200 px-2 py-1 rounded-md">{coupon.code}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                          coupon.discount_type === 'percent' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        )}>
                          {coupon.discount_type === 'percent' ? <Percent className="h-3 w-3" /> : <CircleDollarSign className="h-3 w-3" />}
                          {coupon.discount_type}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-800 text-xs">
                        {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-bold text-xs">
                        ₹{coupon.min_order_amount || 0}
                      </td>
                      <td className="px-8 py-6">
                        <button 
                          onClick={() => handleToggleActive(coupon.id, coupon.is_active)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest transition-colors",
                            coupon.is_active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          <div className={cn("h-1.5 w-1.5 rounded-full", coupon.is_active ? "bg-green-500 animate-pulse" : "bg-slate-400")} />
                          {coupon.is_active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end">
                          <button 
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="h-9 w-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-sm transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Create Coupon Form */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
            <div className="relative z-10 space-y-6">
              
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Ticket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight leading-tight">Forge Promo</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Create a new discount code</p>
                </div>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                
                {/* Code */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Coupon Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. KITCHEN20"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider placeholder-slate-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Discount Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Discount Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscountType('percent')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold transition-all border",
                        discountType === 'percent'
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-slate-800/50 text-slate-350 border-slate-700/60 hover:bg-slate-800"
                      )}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType('flat')}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold transition-all border",
                        discountType === 'flat'
                          ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                          : "bg-slate-800/50 text-slate-350 border-slate-700/60 hover:bg-slate-800"
                      )}
                    >
                      Flat Amount (₹)
                    </button>
                  </div>
                </div>

                {/* Discount Value */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {discountType === 'percent' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={discountType === 'percent' ? 'e.g. 15' : 'e.g. 200'}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-xs font-black placeholder-slate-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                {/* Min Order criteria */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Min Order Requirement (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 499 (0 for no limit)"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl px-4 py-3 text-xs font-black placeholder-slate-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                {error && (
                  <div className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl font-bold flex items-center gap-1.5 animate-pulse">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white h-12 font-black shadow-lg shadow-orange-500/20 active:scale-98 transition-all"
                >
                  {saving ? 'Forging Code...' : 'Activate Promo Code'}
                </Button>

              </form>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
