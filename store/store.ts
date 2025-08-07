import { create } from "zustand";

interface HoverState {
  sectorsActive: boolean;
  setSectorsActive: (active: boolean) => void;
  hoverSector: boolean;
  setHoverSector: (hover: boolean) => void;
  introStoreDone: boolean;
  setIntroStoreDone: (done: boolean) => void;
  aboutSectionProgress: number;
  setAboutSectionProgress: (p: number) => void;
  currentStoreIndex: number;
  setCurrentStoreIndex: (index: number) => void;
  disableScroll: boolean;
  setDisableScroll: (disable: boolean) => void;
  aboutVideoExpanded: boolean;
  setAboutVideoExpanded: (expanded: boolean) => void;
  language: "en" | "pt";
  setLanguage: (language: "en" | "pt") => void;
}

export const useStore = create<HoverState>((set) => ({
  sectorsActive: false,
  setSectorsActive: (active: boolean) => set({ sectorsActive: active }),
  hoverSector: false,
  setHoverSector: (hover: boolean) => set({ hoverSector: hover }),
  introStoreDone: false,
  setIntroStoreDone: (done: boolean) => set({ introStoreDone: done }),
  aboutSectionProgress: 0,
  setAboutSectionProgress: (p: number) => set({ aboutSectionProgress: p }),
  currentStoreIndex: -1,
  setCurrentStoreIndex: (index: number) => set({ currentStoreIndex: index }),
  disableScroll: false,
  setDisableScroll: (disable: boolean) => set({ disableScroll: disable }),
  aboutVideoExpanded: false,
  setAboutVideoExpanded: (expanded: boolean) =>
    set({ aboutVideoExpanded: expanded }),
  language: "en",
  setLanguage: (language: "en" | "pt") => set({ language }),
}));
