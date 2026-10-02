import { useCallback, useMemo, useState } from "react";

import UiContext from "./UiContext";

function UiProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // Tăng mỗi lần mở modal để các reveal bên trong phát lại từ đầu
  const [contactOpenCount, setContactOpenCount] = useState(0);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openContact = useCallback(() => {
    setContactOpenCount((n) => n + 1);
    setContactOpen(true);
  }, []);
  const closeContact = useCallback(() => setContactOpen(false), []);

  const value = useMemo(
    () => ({ ready, setReady, menuOpen, openMenu, closeMenu, contactOpen, contactOpenCount, openContact, closeContact }),
    [ready, menuOpen, contactOpen, contactOpenCount, openMenu, closeMenu, openContact, closeContact]
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export default UiProvider;
