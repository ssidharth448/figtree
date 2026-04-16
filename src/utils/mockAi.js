export const generateStructureMock = async (topic, intention) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: crypto.randomUUID(),
          name: `Introduction to ${topic}`,
          reason: "Foundation is key before diving deep.",
          subs: [],
          items: []
        },
        {
          id: crypto.randomUUID(),
          name: "Core Principles",
          reason: "Understanding the underlying machinery.",
          subs: [
            {
              id: crypto.randomUUID(),
              name: "Rule Framework",
              subs: [],
              items: []
            }
          ],
          items: []
        },
        {
          id: crypto.randomUUID(),
          name: "Practical Application",
          reason: "Putting it into practice.",
          subs: [],
          items: []
        }
      ]);
    }, 1500);
  });
};

export const generateContentMock = async (structure) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Create a deep copy to not mutate passed structure by reference directly if we don't want to,
      // but here we just mutate and return for simplicity.
      const newStructure = JSON.parse(JSON.stringify(structure));
      
      let itemCounter = 1;
      
      const populate = (branch) => {
        if (branch.subs && branch.subs.length > 0) {
          branch.subs.forEach(populate);
        } else {
          // Add 2-3 items randomly
          const count = Math.floor(Math.random() * 2) + 2;
          for (let i = 0; i < count; i++) {
            branch.items.push({
              id: crypto.randomUUID(),
              title: `Essential Resource ${itemCounter++}`,
              url: "https://example.com/learn",
              type: ["Article", "Video", "Book"][Math.floor(Math.random() * 3)],
              reason: "Highly rated introductory material.",
              done: false
            });
          }
        }
      };

      newStructure.forEach(populate);
      resolve(newStructure);
    }, 2000);
  });
};
