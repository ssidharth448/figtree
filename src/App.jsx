import { useState } from "react";
import TreeCanvas from "./components/TreeCanvas";
import Wizard from "./components/Wizard";
import { useTreeStore, BRANCH_COLORS } from "./store/useTreeStore";
import "./index.css";

export default function App() {
  const {
    activeTrees, finishedTrees, currentTreeId, wizard, startWizard, setCurrentTree, toggleItemDone, checkTreeCompletion 
  } = useTreeStore();

  const [bareTreePreview, setBareTreePreview] = useState(null);
  const [filledTreePreview, setFilledTreePreview] = useState(null);

  const activeTree = activeTrees.find(t => t.id === currentTreeId);

  // Determine what to show on canvas
  let canvasBranches = null;
  if (wizard) {
    if (filledTreePreview) canvasBranches = filledTreePreview;
    else if (bareTreePreview) canvasBranches = bareTreePreview;
    else canvasBranches = []; // Empty when starting
  } else if (activeTree) {
    canvasBranches = activeTree.branches;
  }

  // Count active tree stats
  let doneCount = 0;
  let totalCount = 0;
  if (activeTree) {
    const countItems = (branch) => {
      if (branch.items) {
        branch.items.forEach(i => {
          totalCount++;
          if (i.done) doneCount++;
        });
      }
      if (branch.subs) branch.subs.forEach(countItems);
    };
    activeTree.branches.forEach(countItems);
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="window-dots">
          <span className="wdot red" /><span className="wdot yellow" /><span className="wdot green" />
        </div>
        <h1 className="app-title">Figtree ❧ AI Curriculum</h1>
        <div className="stars">
          <button className="add-btn" onClick={startWizard} style={{ marginLeft: "auto" }}>+ Generate Tree</button>
        </div>
      </header>

      <main className="main-grid">
        <aside className="gallery-panel">
          
          <h2 className="gallery-title">Active Trees</h2>
          <div className="gallery-list">
            {activeTrees.map(t => (
              <div 
                key={t.id} 
                className={`gallery-item ${t.id === currentTreeId && !wizard ? "selected" : ""}`}
                onClick={() => setCurrentTree(t.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="gallery-canvas-wrap">
                  <TreeCanvas overrideBranches={t.branches} />
                </div>
                <div className="gallery-date">{t.name}</div>
              </div>
            ))}
          </div>

          <h2 className="gallery-title" style={{ marginTop: '20px' }}>Garden</h2>
          <div className="gallery-list">
            {finishedTrees.length === 0 ? (
              <div className="empty-side">no trees yet</div>
            ) : (
              finishedTrees.map((tree) => (
                <div key={tree.id} className="gallery-item">
                  <div className="gallery-canvas-wrap">
                    <TreeCanvas overrideBranches={tree.branches} />
                  </div>
                  <div className="gallery-date">{tree.name} <br/> {tree.dateFinished}</div>
                </div>
              ))
            )}
          </div>
        </aside>

        <section className="tree-panel">
          <div className="canvas-frame">
            <TreeCanvas overrideBranches={canvasBranches} />
          </div>
          <div className="tree-hint" style={{ position: 'relative', marginTop: '-15px' }}>
            <div className="hint-box">"All wonderful branches may beckon and wink"</div>
          </div>
        </section>

        <aside className="side-panel">
          {wizard ? (
             <Wizard 
               setBareTreeRender={setBareTreePreview} 
               setFilledTreeRender={setFilledTreePreview} 
             />
          ) : activeTree ? (
            <div className="active-tracker">
               <div className="branch-card" style={{ background: '#fff' }}>
                 <h2>{activeTree.name}</h2>
                 <p className="wizard-desc">Topic: {activeTree.topic}</p>
                 <p className="wizard-desc">Intention: {activeTree.intention}</p>
                 
                 <div className="prog-track" style={{ marginTop: '10px' }}>
                    <div className="prog-fill" style={{ width: `${totalCount ? (doneCount/totalCount)*100 : 0}%`, background: '#90c472' }} />
                  </div>
                  <div className="prog-label">{doneCount}/{totalCount} completed</div>
               </div>

               {activeTree.branches.map((b, i) => {
                 const col = BRANCH_COLORS[i % BRANCH_COLORS.length];
                 return (
                   <div key={b.id} className="branch-card" style={{ borderLeft: `4px solid ${col.paint}` }}>
                     <div className="branch-header">
                       <span className="bdot" style={{ background: col.paint }} />
                       <span className="bname" style={{ flex: 1, fontWeight: 'bold' }}>{b.name}</span>
                     </div>
                     <p style={{ fontSize: '10px', color: '#666', marginBottom: '8px' }}>{b.reason}</p>
                     
                     <div className="checkpoints">
                       {b.items && b.items.map(item => (
                         <label key={item.id} className={`cp-row ${item.done ? "done" : ""}`}>
                           <input
                             type="checkbox"
                             checked={item.done}
                             onChange={() => {
                               toggleItemDone(activeTree.id, item.id);
                               checkTreeCompletion(activeTree.id);
                             }}
                             style={{ accentColor: col.paint }}
                           />
                           <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: item.done ? 'line-through' : 'none' }}>
                             {item.title} ({item.type})
                           </a>
                         </label>
                       ))}
                     </div>

                     {b.subs && b.subs.map(sub => (
                       <div key={sub.id} style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid #eee' }}>
                         <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase' }}>{sub.name}</div>
                         <div className="checkpoints">
                           {sub.items && sub.items.map(item => (
                             <label key={item.id} className={`cp-row ${item.done ? "done" : ""}`}>
                               <input
                                 type="checkbox"
                                 checked={item.done}
                                 onChange={() => {
                                   toggleItemDone(activeTree.id, item.id);
                                   checkTreeCompletion(activeTree.id);
                                 }}
                                 style={{ accentColor: col.paint }}
                               />
                               <a href={item.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: item.done ? 'line-through' : 'none' }}>
                                 {item.title} ({item.type})
                               </a>
                             </label>
                           ))}
                         </div>
                       </div>
                     ))}
                   </div>
                 );
               })}
            </div>
          ) : (
            <div className="empty-side">
              Generate a curriculum tree or select an active tree to continue.
            </div>
          )}
        </aside>
      </main>

      <footer className="bottombar">
        {activeTree && (
           <span className="global-count">{doneCount}/{totalCount} total items completed</span>
        )}
      </footer>
    </div>
  );
}