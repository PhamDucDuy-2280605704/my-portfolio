import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import Background from "./components/common/Background/Background";

function App() {
  return (
    <>
      <Background />

      <div className="app-content">
        <AppRoutes />
      </div>
    </>
  );
}

export default App;