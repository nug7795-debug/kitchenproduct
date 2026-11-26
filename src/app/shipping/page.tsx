'use client';

import * as React from 'react';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-[#f1f3f6] min-h-screen py-4 px-2.5 sm:px-4">
      <div className="bg-white max-w-[520px] mx-auto rounded-xl shadow-sm p-5 space-y-6">
        {/* Header */}
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-[#2874f0] font-black text-xs uppercase tracking-wider mb-1">
            <Truck className="h-4 w-4" />
            <span>Delivery & Logistics</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">
            Last Updated: January 2026 | Compliant with Consumer Protection (E-Commerce) Rules
          </p>
        </div>

        {/* Highlights Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
            <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <p className="text-[11px] font-black text-slate-800">24–48 Hours</p>
            <p className="text-[10px] text-slate-500 font-medium">Fast Dispatch Time</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg text-center">
            <Truck className="h-5 w-5 text-[#388e3c] mx-auto mb-1" />
            <p className="text-[11px] font-black text-slate-800">3–5 Business Days</p>
            <p className="text-[10px] text-slate-500 font-medium">All-India Delivery</p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="text-slate-700 text-xs leading-relaxed space-y-5">
          <section className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              1. Shipping Coverage & Partner Couriers
            </h2>
            <p className="font-medium text-slate-600">
              We deliver to over 28,000+ pin codes across India. All orders are processed and shipped through premium national logistics partners including BlueDart, Delhivery, Xpressbees, Shadowfax, and India Post to guarantee safe and timely delivery.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              2. Order Processing & Dispatch Timelines
            </h2>
            <p className="font-medium text-slate-600">
              • All confirmed orders are verified and dispatched within <strong>24 to 48 hours</strong> (excluding public holidays and Sundays).<br />
              • Metro & Tier-1 Cities: Estimated delivery within <strong>2 to 4 business days</strong>.<br />
              • Rest of India: Estimated delivery within <strong>3 to 6 business days</strong>.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              3. Shipping Charges
            </h2>
            <p className="font-medium text-slate-600">
              • <strong>Standard Shipping:</strong> Free shipping is provided on all promotional prepaid and verified orders nationwide.<br />
              • <strong>Express Delivery:</strong> Applicable shipping fees (if any) are displayed transparently at checkout prior to final payment confirmation with no hidden surcharges.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              4. Real-Time Tracking & Notifications
            </h2>
            <p className="font-medium text-slate-600">
              Once your shipment is dispatched, you will receive an SMS and email notification containing the AWB Tracking Number and a live courier tracking link. You can track your package every step of the way until it is safely delivered to your doorstep.
            </p>
          </section>

          <section className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              5. Damaged or Tampered Packages
            </h2>
            <p className="font-medium text-slate-600">
              If the outer packaging appears physically damaged, torn, or tampered with at the time of delivery, please do not accept the package or report it immediately to our customer support within 24 hours. We offer a 100% replacement guarantee under our 7-Day Return Policy.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-[#2874f0]/5 border border-[#2874f0]/20 rounded-xl p-4 space-y-2 mt-4">
            <p className="text-xs font-black text-[#2874f0] uppercase tracking-wide flex items-center gap-1.5">
              <Mail className="h-4 w-4" /> Need Shipping Assistance?
            </p>
            <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
              For any queries regarding order delivery, delays, or address modifications, reach out to our dedicated support team:
            </p>
            <div className="text-[11px] font-bold text-slate-800 space-y-0.5 pt-1">
              <p>Email: <a href="mailto:support@flpkart.com" className="text-[#2874f0] underline">support@flpkart.com</a></p>
              <p>Helpline: <a href="tel:+918946084219" className="text-[#2874f0] underline">+91 8946084219</a> (Mon–Sat, 9:00 AM – 7:00 PM IST)</p>
              <p>Address: Flpkart Internet Pvt Ltd, Embassy Tech Village, Outer Ring Road, Bengaluru 560103, Karnataka, India</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="border-t border-slate-100 pt-4 text-center">
          <Link href="/" className="text-xs font-black text-[#2874f0] hover:underline">
            ← Back to Flpkart Home
          </Link>
        </div>
      </div>
    </div>
  );
}
