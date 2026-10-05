import { create } from "zustand";

interface UseLahanModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useLahanModal = create<UseLahanModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));