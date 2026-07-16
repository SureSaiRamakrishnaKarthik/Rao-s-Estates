import React from 'react';
import { Check } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CheckboxOption {
  id: string;
  label: string;
  icon?: string;
}

interface CheckboxGridProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export function CheckboxGrid({ options, value = [], onChange, error }: CheckboxGridProps) {
  
  const toggleOption = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => {
          const isSelected = value.includes(option.id);
          
          return (
            <div
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className={cn(
                "relative flex items-center p-4 cursor-pointer rounded-xl border transition-all duration-200",
                isSelected 
                  ? "border-blue-600 bg-blue-50/50 shadow-[0_0_0_1px_rgba(37,99,235,1)]" 
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              )}
            >
              <div className="flex h-5 items-center">
                <div className={cn(
                  "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                  isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                )}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                </div>
              </div>
              <div className="ml-3 text-sm leading-6 flex-1">
                <span className={cn(
                  "font-medium select-none",
                  isSelected ? "text-blue-900" : "text-gray-900"
                )}>
                  {option.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
