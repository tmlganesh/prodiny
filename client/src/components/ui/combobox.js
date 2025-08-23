import React, { useState, useRef, useEffect } from "react";
import Button from "./button";

export function Combobox({ options, value, onChange, placeholder = "Select...", id, name, required }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = options.filter(
    (opt) => opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        id={id}
      >
        {value ? options.find((o) => o.value === value)?.label : placeholder}
        <span className="ml-2">▾</span>
      </Button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-black rounded-lg shadow-lg">
          <input
            className="w-full px-3 py-2 bg-white text-black border-b border-black focus:outline-none placeholder-black rounded-t-lg"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-48 overflow-auto" role="listbox">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-black">No options</li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt.value}
                className={`px-3 py-2 cursor-pointer hover:bg-white text-black ${value === opt.value ? "bg-white" : ""}`}
                role="option"
                aria-selected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      <input type="hidden" name={name} value={value || ""} required={required} />
    </div>
  );
}

export default Combobox;
