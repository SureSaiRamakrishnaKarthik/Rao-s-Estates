import React, { forwardRef } from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SwitchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
  error?: string;
}

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  ({ label, description, error, className, checked, ...props }, ref) => {
    return (
      <div className="flex items-start">
        <div className="flex h-6 items-center">
          <input
            type="checkbox"
            ref={ref}
            checked={checked}
            id={props.id || props.name}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600 transition-colors",
              className
            )}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor={props.id || props.name} className="font-medium text-gray-900 cursor-pointer">
            {label}
          </label>
          {description && (
            <p className="text-gray-500">{description}</p>
          )}
          {error && <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>}
        </div>
      </div>
    );
  }
);

SwitchField.displayName = "SwitchField";
