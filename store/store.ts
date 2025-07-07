import { create } from "zustand";

interface HoverState {
  sectorsActive: boolean;
  setSectorsActive: (active: boolean) => void;
  hoverSector: boolean;
  setHoverSector: (hover: boolean) => void;
  introStoreDone: boolean;
  setIntroStoreDone: (done: boolean) => void;
}

export const useStore = create<HoverState>((set) => ({
  sectorsActive: false,
  setSectorsActive: (active: boolean) => set({ sectorsActive: active }),
  hoverSector: false,
  setHoverSector: (hover: boolean) => set({ hoverSector: hover }),
  introStoreDone: false,
  setIntroStoreDone: (done: boolean) => set({ introStoreDone: done }),
}));
