import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  prefixNode?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, helperText, required, prefixNode, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label htmlFor={props.id || props.name} className="block text-sm font-medium leading-6 text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="mt-2 flex rounded-md shadow-sm">
          {prefixNode && (
            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-4 text-gray-500 sm:text-sm bg-gray-50">
              {prefixNode}
            </span>
          )}
          <input
            ref={ref}
            id={props.id || props.name}
            className={cn(
              "block w-full min-w-0 flex-1 border-0 py-2.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white transition-all duration-200",
              prefixNode ? "rounded-none rounded-r-md" : "rounded-md",
              error ? "ring-red-300 focus:ring-red-500" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-2 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
