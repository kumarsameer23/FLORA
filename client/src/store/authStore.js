import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem('flora_token', token);
        localStorage.setItem('flora_user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      updateUser: (userData) => {
        const updated = { ...get().user, ...userData };
        localStorage.setItem('flora_user', JSON.stringify(updated));
        set({ user: updated });
      },

      logout: () => {
        localStorage.removeItem('flora_token');
        localStorage.removeItem('flora_user');
        set({ user: null, token: null, isAuthenticated: false });
      },

      toggleWishlistLocal: (productId) => {
        const user = get().user;
        if (!user) return;
        const wishlist = user.wishlist || [];
        const idx = wishlist.findIndex(id => id === productId || id?._id === productId);
        const newWishlist = idx > -1
          ? wishlist.filter((_, i) => i !== idx)
          : [...wishlist, productId];
        set({ user: { ...user, wishlist: newWishlist } });
      },

      isWishlisted: (productId) => {
        const user = get().user;
        if (!user?.wishlist) return false;
        return user.wishlist.some(id => id === productId || id?._id === productId);
      },
    }),
    {
      name: 'flora-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
