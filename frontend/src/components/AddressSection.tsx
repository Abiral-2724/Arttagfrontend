import React, { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import AddressForm from './AddressForm';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Modal = ({ open, onClose, title, eyebrow, children }: any) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white border border-[#e8e4de] rounded-sm w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#e8e4de] sticky top-0 bg-white z-10">
          <div>
            {eyebrow && <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">{eyebrow}</p>}
            <h2 className="text-xl font-semibold text-[#1a1a1a]">{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all mt-0.5">
            <X size={13} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
};

export default function AddressSection({ addresses, userId, onUpdate, showAlert }: any) {
  const [addOpen, setAddOpen]         = useState(false);
  const [editingAddr, setEditingAddr] = useState<any>(null);

  const handleDelete = async (addressId: any) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/user/${userId}/delete/address`, { data: { addressId } });
      if (data.success) { showAlert('Address deleted'); onUpdate(); }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to delete', 'error'); }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-7">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Your</p>
          <h2 className="text-xl font-semibold text-[#1a1a1a]">Address Book</h2>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white px-4 py-2 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors"
        >
          <Plus size={12} /> Add Address
        </button>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <MapPin size={36} className="text-[#d4cfc8]" />
          <p className="text-base font-light text-[#888]">No addresses saved yet</p>
          <p className="text-xs text-[#bbb]">Add a delivery address to get started</p>
          <button onClick={() => setAddOpen(true)}
            className="mt-2 inline-flex items-center gap-1.5 bg-[#1a1a1a] text-white px-4 py-2 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors">
            <Plus size={12} /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr: any) => (
            <div key={addr.id}
              className="bg-white border border-[#e8e4de] rounded-sm p-4 hover:shadow-md hover:border-[#d4cfc8] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#f5f3ef] border border-[#e8e4de] rounded-sm flex items-center justify-center">
                    <MapPin size={13} className="text-[#888]" />
                  </div>
                  <p className="text-sm font-semibold text-[#1a1a1a]">{addr.fullname}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditingAddr(addr)}
                    className="w-7 h-7 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(addr.id)}
                    className="w-7 h-7 border border-[#e8e4de] rounded-sm flex items-center justify-center text-[#888] hover:bg-[#fdecea] hover:border-[#f5b7b1] hover:text-[#c0392b] transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <div className="space-y-0.5 text-xs text-[#666] leading-relaxed pl-9">
                <p>{addr.streetAddress}{addr.locality ? `, ${addr.locality}` : ''}</p>
                <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Address" eyebrow="New">
        <AddressForm userId={userId} address={null}
          onSuccess={() => { setAddOpen(false); onUpdate(); }}
          showAlert={showAlert} />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingAddr} onClose={() => setEditingAddr(null)} title="Edit Address" eyebrow="Update">
        <AddressForm userId={userId} address={editingAddr}
          onSuccess={() => { setEditingAddr(null); onUpdate(); }}
          showAlert={showAlert} />
      </Modal>
    </div>
  );
}