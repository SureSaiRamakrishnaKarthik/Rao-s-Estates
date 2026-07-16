import React from 'react';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
}

export default function StatusBadge({ status, type }: StatusBadgeProps) {
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  
  // Auto-detect type based on common statuses if type isn't provided
  let effectiveType = type;
  if (!effectiveType) {
    const s = status.toLowerCase();
    if (['published', 'active', 'completed', 'success', 'approved'].includes(s)) effectiveType = 'success';
    else if (['draft', 'pending', 'upcoming', 'review'].includes(s)) effectiveType = 'warning';
    else if (['archived', 'failed', 'rejected', 'error', 'inactive'].includes(s)) effectiveType = 'error';
    else if (['new', 'info'].includes(s)) effectiveType = 'info';
    else effectiveType = 'default';
  }

  switch (effectiveType) {
    case 'success':
      colorClass = 'bg-green-50 text-green-700 border-green-200';
      break;
    case 'warning':
      colorClass = 'bg-yellow-50 text-yellow-800 border-yellow-200';
      break;
    case 'error':
      colorClass = 'bg-red-50 text-red-700 border-red-200';
      break;
    case 'info':
      colorClass = 'bg-blue-50 text-blue-700 border-blue-200';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClass} capitalize`}>
      {status}
    </span>
  );
}
