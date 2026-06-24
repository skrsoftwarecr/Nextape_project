import React from "react";

interface SkillScoreDisplayProps {
  skillName: string;
  score: number;
}

export default function SkillScoreDisplay({ skillName, score }: SkillScoreDisplayProps) {
  // Determine color based on score
  let colorClass = "text-gray-400";
  if (score >= 80) colorClass = "text-brand-blue";
  else if (score >= 50) colorClass = "text-yellow-500";
  else if (score > 0) colorClass = "text-brand-red";

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <span className="text-sm font-bold text-slate-700">{skillName}</span>
      <div className="flex items-center gap-2">
        <span className={`text-lg font-black ${colorClass}`}>
          {score}%
        </span>
      </div>
    </div>
  );
}
