import { CandidateMatch } from "../types/compatibility.types";

interface Props {
    match: CandidateMatch;
}

function getTier(score: number): string {
    if (score >= 90) return "S";
    if (score >= 75) return "A";
    if (score >= 55) return "B";
    return "C";
}

function getTierColor(tier: string): string {
    if (tier === "S") return "text-green-600 bg-green-50";
    if (tier === "A") return "text-blue-600 bg-blue-50";
    if (tier === "B") return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
}

export default function CompatibilityBreakdown({ match }: Props) {
    const tier = getTier(match.totalScore);
    const tierColor = getTierColor(tier);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Compatibilidad</h3>
                <div className={`px-4 py-1 rounded-full font-black text-xl ${tierColor}`}>
                    {tier}
                </div>
            </div>

            <div className="text-5xl font-black text-center py-4">
                {Math.round(match.totalScore)}%
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">Skill Match</span>
                    <span className="font-bold">{Math.round(match.skillMatch)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-brand-blue h-2 rounded-full" style={{ width: `${match.skillMatch}%` }} />
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500 font-medium">Evidencia GitHub</span>
                    <span className="font-bold">{Math.round(match.evidenceMatch)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${match.evidenceMatch}%` }} />
                </div>

                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500 font-medium">Experiencia</span>
                    <span className="font-bold">{Math.round(match.experienceMatch)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${match.experienceMatch}%` }} />
                </div>
            </div>

            {match.missingSkills.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Skills faltantes</p>
                    <div className="flex flex-wrap gap-2">
                        {match.missingSkills.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}