'use client';

import * as React from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [settings, setSettings] = React.useState({
    storeName: 'Kitchen Product',
    supportEmail: 'hello@kitchenproduct.com'
  });

  const [form, setForm] = React.useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubmitted(true);
    setLoading(false);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-4">
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200/60 max-w-lg mx-auto">
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight border-b border-slate-100 pb-4 mb-6">
          Contact Us
        </h1>

        <div className="space-y-6">
          {/* Quick Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="h-9 w-9 bg-[#2874f0]/10 rounded-lg flex items-center justify-center text-[#2874f0] shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Support</p>
                <a href={`mailto:${settings.supportEmail}`} className="text-sm font-bold hover:underline">
                  {settings.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="h-9 w-9 bg-[#388e3c]/10 rounded-lg flex items-center justify-center text-[#388e3c] shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registered Office</p>
                <p className="text-sm font-bold leading-tight">
                  {settings.storeName} India Private Limited, Mumbai, Maharashtra, India
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide mb-4">Send us a message</h3>
            
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex gap-3 items-start animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-black">Message Sent Successfully!</p>
                  <p className="text-xs font-bold text-green-700 mt-1">Thank you for reaching out. Our support experts will contact you shortly.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#2874f0] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#2874f0] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="How can we help you today?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:bg-white focus:border-[#2874f0] outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff9f00] hover:bg-[#ff9f00]/90 text-white font-black text-sm uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xs disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
