import { create } from "zustand";

export const BRANCH_COLORS = [
  { id: "olive", paint: "#889b6b", light: "#eef3e4" },
  { id: "blush", paint: "#c97b7b", light: "#f9eaea" },
  { id: "teal",  paint: "#5a8a85", light: "#e3f2f0" },
  { id: "ochre", paint: "#b8894a", light: "#f5edd8" },
  { id: "lilac", paint: "#9178b8", light: "#ede8f8" },
];

let _nid = 1;

export const useTreeStore = create((set, get) => ({
  branches: [],

  addBranch: () =>
    set((s) => {
      if (s.branches.length >= 5) return s;
      const col = BRANCH_COLORS[s.branches.length];
      return {
        branches: [
          ...s.branches,
          { id: _nid++, name: "", colorId: col.id, checkpoints: [] },
        ],
      };
    }),

  deleteBranch: (id) =>
    set((s) => ({ branches: s.branches.filter((b) => b.id !== id) })),

  updateBranchName: (id, name) =>
    set((s) => ({
      branches: s.branches.map((b) => (b.id === id ? { ...b, name } : b)),
    })),

  addCheckpoint: (branchId, text) =>
    set((s) => ({
      branches: s.branches.map((b) =>
        b.id !== branchId
          ? b
          : { ...b, checkpoints: [...b.checkpoints, { text, done: false }] }
      ),
    })),

  toggleCheckpoint: (branchId, idx) =>
    set((s) => ({
      branches: s.branches.map((b) => {
        if (b.id !== branchId) return b;
        return {
          ...b,
          checkpoints: b.checkpoints.map((cp, i) =>
            i === idx ? { ...cp, done: !cp.done } : cp
          ),
        };
      }),
    })),

  deleteCheckpoint: (branchId, idx) =>
    set((s) => ({
      branches: s.branches.map((b) => {
        if (b.id !== branchId) return b;
        return {
          ...b,
          checkpoints: b.checkpoints.filter((_, i) => i !== idx),
        };
      }),
    })),
}));