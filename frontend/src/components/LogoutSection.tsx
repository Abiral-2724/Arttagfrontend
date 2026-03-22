import React from 'react';
import { LogOut, X } from 'lucide-react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LogoutSection({ onCancel }: any) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      localStorage.removeItem('arttagUserId');
      localStorage.removeItem('arttagtoken');
      await signOut(auth);
      router.push('/login');
    } catch {
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <div className="p-6 sm:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mb-7">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Account</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">Sign Out</h2>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      <div className="bg-[#faf9f7] border border-[#e8e4de] rounded-sm p-5 mb-7">
        <p className="text-sm font-medium text-[#1a1a1a] mb-1">Are you sure you want to sign out?</p>
        <p className="text-xs text-[#888] leading-relaxed">You'll need to sign in again to access your account, saved addresses, and order history.</p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 bg-[#c0392b] text-white px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#a93226] transition-colors"
        >
          <LogOut size={13} /> Sign Out
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 border border-[#e8e4de] text-[#888] px-5 py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}