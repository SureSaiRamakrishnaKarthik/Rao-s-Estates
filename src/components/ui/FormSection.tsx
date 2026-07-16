import React from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] border border-gray-100/80 mb-8 overflow-hidden transition-all duration-200 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
      <div className="border-b border-gray-100 bg-white px-8 py-6">
        <h3 className="text-xl font-semibold leading-7 text-gray-900 tracking-tight">{title}</h3>
        {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
      </div>
      <div className="px-8 py-8 space-y-8 bg-gray-50/30">
        {children}
      </div>
    </div>
  );
}
