import { useEffect, useState } from "react";

// Theo dõi 1 media query (VD "(max-width: 768px)") — trả về true/false và
// tự cập nhật khi viewport đổi.
function useMedia(query) {
  const get = () => typeof window !== "undefined" && !!window.matchMedia?.(query).matches;
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia?.(query);
    if (!mql) return undefined;
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default useMedia;
