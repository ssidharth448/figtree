import { useState, useRef } from "react";
import TreeCanvas from "./components/TreeCanvas";
import { useTreeStore, BRANCH_COLORS } from "./store/useTreeStore";
import "./index.css";

export default function App() {
  const {
    branches, addBranch, deleteBranch,
    updateBranchName, addCheckpoint,
    toggleCheckpoint, deleteCheckpoint,
  } = useTreeStore();

  const cpRefs = useRef({});
  const totalCp = branches.reduce((a, b) => a + b.checkpoints.length, 0);
  const doneCp  = branches.reduce((a, b) => a + b.checkpoints.filter(c => c.done).length, 0);

  const handleAddCp = (id) => {
    const val = cpRefs.current[id]?.value?.trim();
    if (!val) return;
    addCheckpoint(id, val);
    cpRefs.current[id].value = "";
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="window-dots">
          <span className="wdot red" /><span className="wdot yellow" /><span className="wdot green" />
        </div>
        <h1 className="app-title">Figtree</h1>
        <div className="stars">
          {["y","p","b","y","p"].map((c, i) => <span key={i} className={`star star-${c}`} />)}
        </div>
      </header>

      <main className="main-grid">
        <section className="tree-panel">
          <TreeCanvas />
          {branches.length === 0 && (
            <div className="tree-hint">
              <div className="hint-box">Add branches<br />to grow your tree</div>
            </div>
          )}
        </section>

        <aside className="side-panel">
          {branches.length === 0 ? (
            <div className="empty-side">no branches yet</div>
          ) : (
            branches.map((b) => {
              const col = BRANCH_COLORS.find((c) => c.id === b.colorId);
              const done = b.checkpoints.filter((c) => c.done).length;
              const total = b.checkpoints.length;
              const pct = total ? Math.round(done / total * 100) : 0;
              return (
                <div
                  key={b.id}
                  className="branch-card"
                  style={{ borderLeft: `4px solid ${col.paint}` }}
                >
                  <div className="branch-header">
                    <span className="bdot" style={{ background: col.paint }} />
                    <input
                      className="bname"
                      defaultValue={b.name}
                      placeholder="Branch name..."
                      maxLength={24}
                      onChange={(e) => updateBranchName(b.id, e.target.value)}
                    />
                    <button className="x-btn" onClick={() => deleteBranch(b.id)}>✕</button>
                  </div>

                  {total > 0 && (
                    <>
                      <div className="prog-track">
                        <div className="prog-fill" style={{ width: `${pct}%`, background: col.paint }} />
                      </div>
                      <div className="prog-label">{done}/{total} · {pct}%</div>
                    </>
                  )}

                  <div className="checkpoints">
                    {b.checkpoints.map((cp, i) => (
                      <label key={i} className={`cp-row ${cp.done ? "done" : ""}`}>
                        <input
                          type="checkbox"
                          checked={cp.done}
                          onChange={() => toggleCheckpoint(b.id, i)}
                          style={{ accentColor: col.paint }}
                        />
                        <span>{cp.text}</span>
                        <button className="x-btn sm" onClick={() => deleteCheckpoint(b.id, i)}>✕</button>
                      </label>
                    ))}
                  </div>

                  <div className="add-cp">
                    <input
                      ref={(el) => (cpRefs.current[b.id] = el)}
                      className="cp-input"
                      placeholder="Add checkpoint..."
                      maxLength={32}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCp(b.id)}
                    />
                    <button
                      className="cp-add-btn"
                      style={{ background: col.paint, borderColor: col.paint }}
                      onClick={() => handleAddCp(b.id)}
                    >+</button>
                  </div>
                </div>
              );
            })
          )}
        </aside>
      </main>

      <footer className="bottombar">
        <button
          className="add-btn"
          onClick={addBranch}
          disabled={branches.length >= 5}
        >
          {branches.length >= 5 ? "max 5 branches" : "+ branch"}
        </button>
        <div className="pills">
          {branches.map((b, i) => {
            const col = BRANCH_COLORS.find((c) => c.id === b.colorId);
            return (
              <span key={b.id} className="pill" style={{ background: col.light, borderColor: col.paint, color: col.paint }}>
                {b.name || `branch ${i + 1}`}
              </span>
            );
          })}
        </div>
        {totalCp > 0 && (
          <span className="global-count">{doneCp}/{totalCp} done</span>
        )}
      </footer>
    </div>
  );
}