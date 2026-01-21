import { useState } from "react";
import Dropdown from "./Dropdown";

/**
 * Dropdown that opens when a text is clicked
 * @param {string} label text to click
 * @param {ReactNode} children items to show in dropdown
 */
const TextDropdown = ({ label, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <div style={{ cursor: "pointer", fontWeight: 500 }} onClick={() => setOpen(prev => !prev)}>
        {label}
      </div>
      {open && <Dropdown>{children}</Dropdown>}
    </div>
  );
};

export default TextDropdown;
