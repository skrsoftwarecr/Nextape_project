/**
 * Cálculo del match candidato ↔ vacante. Función PURA (sin dependencias de Firebase),
 * por eso vive aquí y es testeable de forma aislada. La usa `JobService.calculateMatch`.
 *
 * Suma los scores del usuario para las skills requeridas presentes y divide entre el total
 * de skills requeridas (penaliza las faltantes). Normaliza a minúsculas. Devuelve 0–100.
 */
export function calculateMatch(
  jobSkills: string[],
  userScores: { [key: string]: number }
): number {
  if (!jobSkills || !jobSkills.length) return 0;
  if (!userScores || Object.keys(userScores).length === 0) return 0;

  let totalScore = 0;
  let foundSkills = 0;

  const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase());
  normalizedJobSkills.forEach((skill) => {
    if (userScores[skill] !== undefined) {
      totalScore += userScores[skill];
      foundSkills++;
    }
  });

  if (foundSkills === 0) return 0;
  return Math.round(totalScore / jobSkills.length);
}
