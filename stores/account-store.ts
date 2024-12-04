import { z } from 'zod';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const AccountSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  profilePicture: z.string().optional(),
});

type AccountInfo = z.infer<typeof AccountSchema>;

interface AccountStore {
  accountInfo: AccountInfo | null;
  setAccountInfo: (info: AccountInfo) => void;
  clearAccountInfo: () => void;
  isValidAccountInfo: () => boolean;
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      accountInfo: null,

      setAccountInfo: (info: AccountInfo) => set({ accountInfo: info }),

      clearAccountInfo: () => set({ accountInfo: null }),

      isValidAccountInfo: () => {
        const { accountInfo } = get();
        if (!accountInfo) return false;
        try {
          AccountSchema.parse(accountInfo);
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'account-storage',
      version: 1,
      partialize: (state) => ({
        accountInfo: state.accountInfo,
      }),
    }
  )
);
