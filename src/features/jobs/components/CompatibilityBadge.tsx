import React from "react";

interface CompatibilityBadgeProps {
  matchScore?: number;
}

export default function CompatibilityBadge({ matchScore }: CompatibilityBadgeProps) {
  if (matchScore === undefined) {
    return (
      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Sin calcular
      </div>
    );
  }

  let colorClass = "bg-gray-100 text-gray-800";
  if (matchScore >= 80) colorClass = "bg-green-100 text-green-800";
  else if (matchScore >= 50) colorClass = "bg-yellow-100 text-yellow-800";
  else colorClass = "bg-brand-red/10 text-brand-red";

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colorClass}`}>
      {matchScore}% Match
    </div>
  );
}
