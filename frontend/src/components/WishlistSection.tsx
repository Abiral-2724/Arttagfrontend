import React from 'react';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function WishlistSection({ wishlist, userId, onUpdate, showAlert }: any) {

  const removeFromWishlist = async (productId: any) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/wishlist/delete/item/user/wishlist`, {
        data: { userId, productId },
      });
      if (data.success) { showAlert('Removed from wishlist'); onUpdate(); }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to remove', 'error'); }
  };

  const moveToCart = async (productId: any) => {
    try {
      const { data } = await axios.patch(`${API_BASE_URL}/wishlist/move/wishlist/to/cart`, { userId, productId });
      if (data.success) { showAlert(data.message); onUpdate(); }
    } catch (e: any) { showAlert(e.response?.data?.message || 'Failed to move to cart', 'error'); }
  };

  return (
    <div className="p-6 sm:p-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div className="mb-7">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888] mb-0.5">Saved</p>
        <h2 className="text-xl font-semibold text-[#1a1a1a]">My Wishlist</h2>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#e8e4de] to-transparent mb-7" />

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Heart size={36} className="text-[#d4cfc8]" />
          <p className="text-sm font-light text-[#888]">Your wishlist is empty</p>
          <p className="text-xs text-[#bbb]">Save items you love to buy them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item: any) => {
            const savePct = item.product?.discountPrice && item.product?.originalPrice
              ? Math.round((1 - item.product.discountPrice / item.product.originalPrice) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="group bg-white border border-[#e8e4de] rounded-sm overflow-hidden hover:border-[#d4cfc8] hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="aspect-square bg-[#f5f3ef] overflow-hidden relative">
                  {item.product?.primaryImage1 ? (
                    <img
                      src={item.product.primaryImage1}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={32} className="text-[#d4cfc8]" />
                    </div>
                  )}

                  {/* Discount badge */}
                  {savePct > 0 && (
                    <span className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.08em] uppercase font-bold px-2 py-0.5 rounded-sm"
                      style={{ background: '#eafaf1', color: '#1e8449', border: '1px solid #a9dfbf' }}>
                      {savePct}% off
                    </span>
                  )}

                  {/* Remove button — appears on hover */}
                  <button
                    onClick={() => removeFromWishlist(item.productId)}
                    title="Remove from wishlist"
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-sm bg-white border border-[#e8e4de] flex items-center justify-center text-[#aaa] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#fdecea] hover:border-[#f5b7b1] hover:text-[#c0392b]"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-medium text-[#1a1a1a] line-clamp-2 leading-snug mb-3">
                    {item.product?.name || 'Product'}
                  </h3>

                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-base font-semibold text-[#1a1a1a]">
                      ₹{Number(item.product?.discountPrice).toLocaleString('en-IN')}
                    </span>
                    {item.product?.originalPrice && item.product.originalPrice !== item.product.discountPrice && (
                      <span className="text-xs text-[#aaa] line-through">
                        ₹{Number(item.product.originalPrice).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => moveToCart(item.productId)}
                    className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] text-white py-2.5 text-[10px] tracking-[0.14em] uppercase font-semibold rounded-sm hover:bg-[#333] transition-colors"
                  >
                    <ShoppingCart size={13} />
                    Add to Bag
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}