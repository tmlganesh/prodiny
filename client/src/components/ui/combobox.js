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
        <div className="absolute z-10 mt-1 w-full bg-black border border-gray-700 rounded-md shadow-lg">
          <input
            className="w-full px-3 py-2 bg-black text-white border-b border-gray-700 focus:outline-none"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
          <ul className="max-h-48 overflow-auto" role="listbox">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-gray-400">No options</li>
            )}
            {filtered.map((opt) => (
              <li
                key={opt.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-800 ${value === opt.value ? "bg-gray-900" : ""}`}
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
