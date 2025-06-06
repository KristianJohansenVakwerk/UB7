import { create } from "zustand";

interface HoverState {
  hoverSector: boolean;
  setHoverSector: (hover: boolean) => void;
}

export const useStore = create<HoverState>((set) => ({
  hoverSector: false,
  setHoverSector: (hover: boolean) => set({ hoverSector: hover }),
}));
