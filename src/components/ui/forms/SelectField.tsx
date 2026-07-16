import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, helperText, required, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium leading-6 text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-2">
          <select
            ref={ref}
            id={props.id || props.name}
            className={cn(
              "block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white cursor-pointer transition-all duration-200",
              error ? "ring-red-300 focus:ring-red-500" : "",
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>
              Select {label.toLowerCase()}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
