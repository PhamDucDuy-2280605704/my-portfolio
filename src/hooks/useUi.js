import { useContext } from "react";

import UiContext from "../context/UiContext";

function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi phải được dùng bên trong <UiProvider>");
  return ctx;
}

export default useUi;
