import React, { useId } from 'react'

// Labelled dropdown that matches FormField.
const SelectField = ({
  label,
  value,
  onChange,
  placeholder = 'Select',
  options = [],
  error,
  className = '',
  ...rest
}) => {
  const id = useId()

  return (
    <div className={`flex min-w-0 flex-col gap-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-bold text-[#14112E]">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          aria-invalid={!!error}
          className={`h-14 w-full appearance-none rounded-2xl border bg-[#F4F5FA] pl-4 pr-10 text-[15px] font-medium outline-none transition focus:bg-white focus:ring-4 focus:ring-[#2B2F77]/15 ${
            value ? 'text-[#14112E]' : 'text-[#9AA0BA]'
          } ${error ? 'border-red-500' : 'border-transparent focus:border-[#2B2F77]'}`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value} className="text-[#14112E]">
              {o.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4B5069"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {error && (
        <p role="alert" className="text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default SelectField