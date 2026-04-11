import { create } from "zustand";

export const useTreeStore = create((set) => ({
  strokes: [],
  addTask: (type) =>
    set((state) => ({
      strokes: [...state.strokes, type],
    })),
}));