import React from "react";
import { JobWithDetails } from "../types/job.types";
import CompatibilityBadge from "./CompatibilityBadge";

interface JobCardProps {
  job: JobWithDetails;
  isSelected: boolean;
  onSelect: (jobId: string) => void;
}

export default function JobCard({ job, isSelected, onSelect }: JobCardProps) {
  return (
    <div 
      onClick={() => onSelect(job.id)}
      className={`p-6 rounded-2xl border cursor-pointer transition-all ${
        isSelected 
          ? "border-brand-blue bg-brand-blue/5 shadow-md" 
          : "border-gray-100 hover:border-gray-200 bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900">{job.title}</h3>
          <p className="text-sm font-medium text-gray-500">{job.company.name}</p>
        </div>
        {job.company.logoUrl && (
          <img 
            src={job.company.logoUrl} 
            alt={`${job.company.name} logo`} 
            className="w-10 h-10 rounded-lg object-cover"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-semibold">
          {job.location}
        </span>
        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-semibold uppercase">
          {job.remote}
        </span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
        <CompatibilityBadge matchScore={job.matchScore} />
        {job.salaryMin && job.salaryMax && (
          <span className="text-sm font-bold text-slate-700">
            {job.salaryMin / 1000}k - {job.salaryMax / 1000}k {job.currency}
          </span>
        )}
      </div>
    </div>
  );
}
