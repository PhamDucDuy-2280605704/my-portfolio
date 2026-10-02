import { useEffect } from "react";

import useSpring from "./useSpring";

// Spring bật/tắt theo cờ `open`: open -> animate tới `to` (sau `delayIn` ms),
// đóng -> về `from` ngay. Trả ref để gắn vào phần tử. Dùng cho backdrop,
// panel của modal/menu và các link trong menu.
function useToggleSpring(open, from, to, config, delayIn = 0) {
  const { ref, start } = useSpring(from, { config });

  useEffect(() => {
    if (open) start(to, config, delayIn);
    else start(from, config, 0);
    // from/to/config là literal mới mỗi render -> chỉ chạy lại khi open đổi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return ref;
}

export default useToggleSpring;
