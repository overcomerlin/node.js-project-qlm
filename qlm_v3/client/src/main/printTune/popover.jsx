// Popover.jsx

import { useState } from "react";
import { usePopper } from "react-popper";
import "../../css/popover.css"; // 我們將在這裡定義樣式

export function Popover({ referenceElement, placement, position, children }) {
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: placement, //'top', 'bottom', 'left', 'right'
    modifiers: [
      {
        name: "arrow",
        options: {
          element: arrowElement,
        },
      },
      {
        name: "offset",
        options: {
          offset: position, // bios for the floating window
        },
      },
    ],
  });

  if (!referenceElement) {
    return null;
  }

  return (
    <div
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className="popover-container"
    >
      {children}
      <div
        ref={setArrowElement}
        style={styles.arrow}
        className="popover-arrow"
      />
    </div>
  );
}
