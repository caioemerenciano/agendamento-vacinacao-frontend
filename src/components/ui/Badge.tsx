import React from 'react';

type BadgeStatus = 'Confirmed' | 'Pending' | 'Canceled';

interface BadgeProps {
  status: BadgeStatus;
}

const statusStyles: Record<BadgeStatus, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Pending: 'bg-amber-100 text-amber-700',
  Canceled: 'bg-red-100 text-red-700',
};

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};
