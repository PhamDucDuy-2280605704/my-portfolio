import useHoverSpring from "../../hooks/useHoverSpring";

// Bọc 1 phần tử với hiệu ứng hover-spring (xem hooks/useHoverSpring.js).
function Hover({ from, to, config, units, as: Tag = "div", className, children, ...rest }) {
  const { ref, bind } = useHoverSpring(from, to, config, units);

  return (
    <Tag
      ref={ref}
      className={className}
      {...bind}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Hover;
