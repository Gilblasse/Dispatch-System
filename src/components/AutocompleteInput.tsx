import React, { useState } from 'react';

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  suggestions: string[];
  value: string;
  onChange: (val: string) => void;
}

export const AutocompleteInput: React.FC<Props> = ({
  suggestions,
  value,
  onChange,
  className = '',
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const filtered = suggestions.filter(s =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        {...rest}
        className={className}
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
      />
      {open && filtered.length > 0 && (
        <ul
          data-testid="autocomplete-options"
          className="absolute z-10 mt-1 w-full max-h-40 overflow-auto border bg-white dark:bg-gray-800 rounded shadow"
        >
          {filtered.map(opt => (
            <li key={opt}>
              <button
                type="button"
                className="block w-full text-left px-2 py-1 hover:bg-blue-600 hover:text-white"
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelect(opt)}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
