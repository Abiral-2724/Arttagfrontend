import React, { useState } from 'react';
import { Loader2, User, Mail, Phone, Edit2, X, Check } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Field = ({ label, children }: any) => (
  <div className="space-y-1.5">
    <label className="block text-[10px] tracking-[0.14em] uppercase font-semibold text-[#888]">{label}</label>
    {children}
  </div>
);

const PInput = ({ ...p }: any) => (
  <input
    className="w-full px-3 py-2.5 text-sm border border-[#e8e4de] rounded-sm bg-white text-[#1a1a1a] outline-none transition-colors focus:border-[#1a1a1a] placeholder:text-[#ccc]"
    style={{ fontFamily: "'DM Sans', sans-serif" }}
    {...p}
  />
);

export default function PersonalInfoSection({ userData, userId, onUpdate, showAlert }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [form, setForm]           = useState({ name: userData?.name || '', email: userData?.email || '' });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/user/${userId}/edit/profile`, form);
      if (data.success) { showAlert('Profile updated successfully'); setIsEditing(false); onUpdate(); }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to update', 'error'); }
    setLoading(false);
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Your</p>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Personal Information</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.12em] uppercase font-semibold text-[#555] border border-[#e8e4de] px-3 py-1.5 rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
          >
            <Edit2 size={11} /> Edit
          </button>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      {isEditing ? (
        <div className="space-y-5">
          <Field label="Full Name">
            <PInput value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
          </Field>
          <Field label="Email Address">
            <PInput type="email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
          </Field>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-2 border border-[#e8e4de] text-[#888] px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
            >
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {[
            { icon: User,  label: 'Full Name',     value: userData?.name        || 'Not set' },
            { icon: Phone, label: 'Phone Number',  value: userData?.phoneNumber || 'Not set' },
            { icon: Mail,  label: 'Email Address', value: userData?.email       || 'Not set' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 py-3 border-b border-[#f0ece6] last:border-0">
              <div className="w-8 h-8 bg-[#f5f3ef] border border-[#e8e4de] rounded-sm flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[#888]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] tracking-[0.1em] uppercase text-[#aaa] font-semibold mb-0.5">{label}</p>
                <p className="text-sm text-[#1a1a1a] font-medium truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}