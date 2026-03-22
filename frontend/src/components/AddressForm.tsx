import React, { useState, useEffect } from 'react';
import { Loader2, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const initialForm = {
  fullname: '', email: '', mobile: '', pincode: '', city: '',
  state: '', country: '', streetAddress: '', locality: '', landmark: '', GSTIN: '',
};

const Field = ({ label, required = false, children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">
      {label}{required && <span className="text-[#c0392b] ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const AI = ({ ...p }: any) => (
  <input
    className="w-full px-3 py-2.5 text-sm border border-[#e8e4de] rounded-sm bg-white text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a] placeholder:text-[#ccc]"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
    {...p}
  />
);

const SectionLabel = ({ children }: any) => (
  <div className="flex items-center gap-3 mb-4">
    <span className="text-[9px] tracking-[0.2em] uppercase font-semibold text-[#aaa]">{children}</span>
    <div className="flex-1 h-px bg-[#f0ece6]" />
  </div>
);

export default function AddressForm({ userId, address, onSuccess, showAlert }: any) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setForm({
        fullname: address.fullname || '', email: address.email || '',
        mobile: address.mobile ? address.mobile.replace(/^\+91/, '') : '',
        pincode: address.pincode || '', city: address.city || '',
        state: address.state || '', country: address.country || '',
        streetAddress: address.streetAddress || '', locality: address.locality || '',
        landmark: address.landmark || '', GSTIN: address.GSTIN || '',
      });
    }
  }, [address]);

  const set = (field: string) => (e: any) => setForm(p => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const url = address ? `${API_BASE_URL}/user/${userId}/modify/address` : `${API_BASE_URL}/user/${userId}/add/address`;
      const payload = address
        ? { addressId: address.id, ...form, mobile: `+91${form.mobile}` }
        : { ...form, mobile: `+91${form.mobile}` };
      const method = address ? 'patch' : 'post';
      const { data } = await axios[method](url, payload);
      if (data.success) { showAlert(address ? 'Address updated' : 'Address added'); onSuccess(); }
      else showAlert(data.message, 'error');
    } catch (e: any) { showAlert(e.response?.data?.message || 'Operation failed', 'error'); }
    setLoading(false);
  };

  return (
    <div className="space-y-7" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Contact */}
      <div>
        <SectionLabel>Contact Information</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full Name" required><AI placeholder="Enter full name" value={form.fullname} onChange={set('fullname')} /></Field>
          <Field label="Email Address" required><AI type="email" placeholder="your.email@example.com" value={form.email} onChange={set('email')} /></Field>
          <Field label="Mobile Number" required>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-[#e8e4de] bg-[#f5f3ef] text-[#888] text-xs font-semibold rounded-l-[2px] select-none tracking-wider">
                +91
              </span>
              <input
                className="flex-1 px-3 py-2.5 text-sm border border-[#e8e4de] rounded-r-[2px] bg-white text-[#1a1a1a] outline-none focus:border-[#1a1a1a] transition-colors placeholder:text-[#ccc]"
                placeholder="XXXXXXXXXX" maxLength={10}
                value={form.mobile}
                onChange={e => setForm(p => ({ ...p, mobile: e.target.value.replace(/\D/g, '') }))}
              />
            </div>
          </Field>
        </div>
      </div>

      {/* Address */}
      <div>
        <SectionLabel>Address Details</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Field label="Street Address" required><AI placeholder="House / Flat No., Building, Street" value={form.streetAddress} onChange={set('streetAddress')} /></Field>
          </div>
          <Field label="Locality" required><AI placeholder="Area, Sector" value={form.locality} onChange={set('locality')} /></Field>
          <Field label="Landmark"><AI placeholder="Near metro, mall, etc." value={form.landmark} onChange={set('landmark')} /></Field>
          <Field label="City" required><AI placeholder="City" value={form.city} onChange={set('city')} /></Field>
          <Field label="State" required><AI placeholder="State" value={form.state} onChange={set('state')} /></Field>
          <Field label="Pincode" required><AI placeholder="6-digit pincode" value={form.pincode} onChange={set('pincode')} /></Field>
          <Field label="Country" required><AI placeholder="Country" value={form.country} onChange={set('country')} /></Field>
        </div>
      </div>

      {/* Business */}
      <div>
        <SectionLabel>Business (Optional)</SectionLabel>
        <Field label="GSTIN"><AI placeholder="GST Identification Number" value={form.GSTIN} onChange={set('GSTIN')} /></Field>
      </div>

      {/* Submit */}
      <div className="pt-4 border-t border-[#f0ece6]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-3 text-[10px] tracking-[0.18em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {address ? 'Update Address' : 'Save Address'}
        </button>
      </div>
    </div>
  );
}