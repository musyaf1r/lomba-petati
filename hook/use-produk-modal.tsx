import { create } from "zustand";

interface UseProdukModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProdukModal = create<UseProdukModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));