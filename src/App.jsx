import TreeCanvas from "./components/TreeCanvas";
import { useTreeStore } from "./store/useTreeStore";
import "./index.css";

function App() {
  const addTask = useTreeStore((s) => s.addTask);

  return (
    <div className="app">
      <h1>Figtree</h1>

      <div className="tree-container">
        <TreeCanvas />
      </div>

      <div className="actions">
        <button className="btn green" onClick={() => addTask('knowledge')}>
          + Knowledge
        </button>
        <button className="btn pink" onClick={() => addTask('journal')}>
          + Journal
        </button>
        <button className="btn blue" onClick={() => addTask('goal')}>
          + Goal
        </button>
      </div>
    </div>
  );
}

export default App;