import { create } from "zustand";

export const BRANCH_COLORS = [
  { id: "olive", paint: "#889b6b", light: "#eef3e4" },
  { id: "blush", paint: "#c97b7b", light: "#f9eaea" },
  { id: "teal",  paint: "#5a8a85", light: "#e3f2f0" },
  { id: "ochre", paint: "#b8894a", light: "#f5edd8" },
  { id: "lilac", paint: "#9178b8", light: "#ede8f8" },
];

export const useTreeStore = create((set, get) => ({
  activeTrees: [],
  finishedTrees: [],
  currentTreeId: null,
  
  wizard: null, // { step, topic, intention, treeName, structure }

  startWizard: () => set({ 
    wizard: { step: 1, topic: "", intention: "", treeName: "", structure: [] },
    currentTreeId: null 
  }),
  
  updateWizard: (data) => set((s) => ({ wizard: { ...s.wizard, ...data } })),
  
  closeWizard: () => set({ wizard: null }),

  plantTree: () => set((s) => {
    if (!s.wizard || !s.wizard.structure) return s;
    const newTree = {
      id: crypto.randomUUID(),
      name: s.wizard.treeName || s.wizard.topic || "New Tree",
      topic: s.wizard.topic,
      intention: s.wizard.intention,
      branches: s.wizard.structure,
      dateStarted: new Date().toLocaleDateString(),
    };
    return {
      activeTrees: [...s.activeTrees, newTree],
      currentTreeId: newTree.id,
      wizard: null
    };
  }),

  setCurrentTree: (id) => set({ currentTreeId: id, wizard: null }),

  toggleItemDone: (treeId, itemId) => set((s) => {
    const updatedTrees = s.activeTrees.map(tree => {
      if (tree.id !== treeId) return tree;

      // Deep clone branches to toggle item
      const clonedBranches = JSON.parse(JSON.stringify(tree.branches));
      
      let found = false;
      const toggleInBranch = (branch) => {
        if (found) return;
        if (branch.items) {
          const item = branch.items.find(i => i.id === itemId);
          if (item) {
            item.done = !item.done;
            found = true;
          }
        }
        if (!found && branch.subs) {
          branch.subs.forEach(toggleInBranch);
        }
      };

      clonedBranches.forEach(toggleInBranch);
      return { ...tree, branches: clonedBranches };
    });

    return { activeTrees: updatedTrees };
  }),

  checkTreeCompletion: (treeId) => set((s) => {
    const tree = s.activeTrees.find(t => t.id === treeId);
    if (!tree) return s;

    let allDone = true;
    const checkBranch = (branch) => {
      if (branch.items) {
        branch.items.forEach(i => { if (!i.done) allDone = false; });
      }
      if (branch.subs) {
        branch.subs.forEach(checkBranch);
      }
    };
    
    tree.branches.forEach(checkBranch);

    if (allDone) {
      const finished = { ...tree, dateFinished: new Date().toLocaleDateString() };
      return {
        activeTrees: s.activeTrees.filter(t => t.id !== treeId),
        finishedTrees: [...s.finishedTrees, finished],
        currentTreeId: null
      };
    }
    return s;
  }),
}));