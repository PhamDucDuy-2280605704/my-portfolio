import useMedia from "./useMedia";
import useSpring from "./useSpring";

// Hook hover-spring: pointer-enter -> spring tới `to`, pointer-leave -> về
// `from`. TẮT hoàn toàn trên mobile (viewport <= 768px). Trả { ref, bind }:
// gắn `ref` vào phần tử được animate, `bind` vào phần tử nhận sự kiện hover
// (có thể là cha — VD hover cả hàng thì mũi tên bên trong mới dịch chuyển).
function useHoverSpring(from, to, config, units) {
  const { ref, start } = useSpring(from, { config, units });
  const isMobile = useMedia("(max-width: 768px)");

  const bind = isMobile
    ? {}
    : {
        onPointerEnter: () => start(to, config),
        onPointerLeave: () => start(from, config),
        onFocus: () => start(to, config),
        onBlur: () => start(from, config),
      };

  return { ref, bind };
}

export default useHoverSpring;
