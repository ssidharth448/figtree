import { useState } from "react";
import { useTreeStore } from "../store/useTreeStore";
import { generateStructureMock, generateContentMock } from "../utils/mockAi";

export default function Wizard({ setBareTreeRender, setFilledTreeRender }) {
  const { wizard, updateWizard, closeWizard, plantTree } = useTreeStore();
  const [loading, setLoading] = useState(false);
  const [localTopic, setLocalTopic] = useState(wizard?.topic || "");
  const [localIntention, setLocalIntention] = useState(wizard?.intention || "");
  const [localName, setLocalName] = useState(wizard?.treeName || "");

  if (!wizard) return null;

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!localTopic.trim()) return;
    
    setLoading(true);
    updateWizard({ topic: localTopic, intention: localIntention, treeName: localName });
    
    try {
      const structure = await generateStructureMock(localTopic, localIntention);
      updateWizard({ structure, step: 2 });
      setBareTreeRender(structure); // pass to parent/TreeCanvas
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async () => {
    setLoading(true);
    try {
      const filledStructure = await generateContentMock(wizard.structure);
      updateWizard({ structure: filledStructure, step: 3 });
      setFilledTreeRender(filledStructure);
    } finally {
      setLoading(false);
    }
  };

  const handleStep3 = () => {
    plantTree();
    setBareTreeRender(null);
    setFilledTreeRender(null);
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h2>AI Curriculum Generator</h2>
        <button className="x-btn" onClick={closeWizard}>✕</button>
      </div>
      
      <div className="wizard-body">
        {loading ? (
          <div className="wizard-loading">
            <span className="bdot loading-dot" style={{ background: "#f7c844" }} />
            <p>AI is thinking...</p>
          </div>
        ) : wizard.step === 1 ? (
          <form className="wizard-form" onSubmit={handleStep1}>
            <label>
              Topic (What to learn?)
              <input 
                className="cp-input"
                autoFocus
                value={localTopic} 
                onChange={e => setLocalTopic(e.target.value)} 
                placeholder="e.g. Stoicism, CSS Flexbox" 
                maxLength={40}
              />
            </label>
            <label>
              Intention (Why are you learning this?)
              <textarea 
                className="cp-input"
                style={{ height: '60px', resize: 'none' }}
                value={localIntention} 
                onChange={e => setLocalIntention(e.target.value)} 
                placeholder="I want to understand the basics and apply it to daily life" 
                maxLength={120}
              />
            </label>
            <label>
              Tree Name (Optional)
              <input 
                className="cp-input"
                value={localName} 
                onChange={e => setLocalName(e.target.value)} 
                placeholder="My Stoic Journey" 
                maxLength={30}
              />
            </label>
            <button type="submit" className="finish-btn" disabled={!localTopic.trim()}>
              Propose Structure
            </button>
          </form>
        ) : wizard.step === 2 ? (
          <div className="wizard-review">
            <h3>Structure Review</h3>
            <p className="wizard-desc">Review the AI-generated curriculum structure. When you are happy with the shape, click underneath to generate actual resources.</p>
            <div className="structure-list">
              {wizard.structure.map((branch, i) => (
                <div key={branch.id} className="structure-branch">
                  <div className="structure-branch-head">
                    <strong>{i + 1}. {branch.name}</strong>
                  </div>
                  <span className="structure-reason">{branch.reason}</span>
                  {branch.subs && branch.subs.length > 0 && (
                    <ul className="structure-subs">
                      {branch.subs.map(sub => (
                        <li key={sub.id}>- {sub.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <button className="finish-btn" onClick={handleStep2} style={{ marginTop: '10px' }}>
              Looks good, fill it in
            </button>
          </div>
        ) : wizard.step === 3 ? (
          <div className="wizard-review">
            <h3>Content Review</h3>
            <p className="wizard-desc">The AI has mapped resources to your tree. Review the items and plant the tree to start tracking your progress.</p>
            <div className="structure-list">
              {wizard.structure.map((branch, i) => (
                <div key={branch.id} className="structure-branch">
                  <strong>{branch.name}</strong>
                  <ul className="structure-subs">
                    {branch.items && branch.items.map(item => (
                      <li key={item.id}>
                        <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a> ({item.type})
                      </li>
                    ))}
                    {branch.subs && branch.subs.map(sub => (
                      <div key={sub.id} style={{ marginLeft: '10px', marginTop: '5px' }}>
                        <span>{sub.name}</span>
                        <ul>
                          {sub.items && sub.items.map(item => (
                            <li key={item.id}>
                              <a href={item.url} target="_blank" rel="noreferrer">{item.title}</a> ({item.type})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button className="finish-btn" onClick={handleStep3} style={{ marginTop: '10px' }}>
              Plant Tree
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
