import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { adminDb } from '../src/lib/firebase/admin';
import { GithubSignalsService } from '../src/services/github-signals.service';
import { analyzeRepositorySources } from '../src/services/github-engine';
import { generateGithubFeedback } from '../src/ai/flows/generate-github-feedback-flow';
import type { GithubEvidence } from '../src/types/github.types';
import { FieldValue } from 'firebase-admin/firestore';

async function main() {
  const TEST_UID = 'test_user_real_execution';
  const GITHUB_USERNAME = 'facebook';

  console.log(`=== PASO 1: getUserRepos("${GITHUB_USERNAME}") ===`);
  try {
    const repos = await GithubSignalsService.getUserRepos(GITHUB_USERNAME);
    console.log(`Encontrados ${repos.length} repositorios. Mostrando los 3 primeros:`);
    repos.slice(0, 3).forEach((r) => console.log(` - ${r.fullName} (pushedAt: ${r.pushedAt}, lang: ${r.language})`));

    console.log(`\n=== PASO 2: getRepoSignals() para 3 repositorios ===`);
    const targetRepos = repos.slice(0, 3);
    for (const repoInfo of targetRepos) {
      console.log(`\nObteniendo señales para ${repoInfo.fullName}...`);
      const signals = await GithubSignalsService.getRepoSignals(repoInfo.owner, repoInfo.name);
      console.log(`Señales obtenidas: SHA=${signals.lastCommitSHA}, commits90d=${signals.commitFrequency90d}, hasTests=${signals.hasTests}, hasCI=${signals.hasCI}`);

      console.log(`Descargando archivos fuente centrales para ${repoInfo.fullName}...`);
      const centralFiles = await GithubSignalsService.fetchCentralSourceFiles(repoInfo.owner, repoInfo.name, signals.lastCommitSHA);
      console.log(`Archivos descargados: ${centralFiles.length}`);

      console.log(`Ejecutando motor determinístico Capa 2...`);
      const { metrics, skillScores } = analyzeRepositorySources(centralFiles, signals);
      console.log(`Scores calculados: overall=${skillScores.overall}, architecture=${skillScores.architecture}`);

      console.log(`Ejecutando IA Capa 3 (Mistral)...`);
      const aiFeedback = await generateGithubFeedback({
        architecture: skillScores.architecture,
        testing: skillScores.testing,
        security: skillScores.security,
        maintainability: skillScores.maintainability,
        documentation: skillScores.documentation,
        overall: skillScores.overall,
        topWeaknesses: skillScores.topWeaknesses,
      });
      console.log(`AI Feedback obtenido: ${aiFeedback.feedback.slice(0, 80)}...`);

      console.log(`\n=== PASO 3: Guardando en Firestore github_evidence/${TEST_UID} ===`);
      const evidenceData: GithubEvidence = {
        uid: TEST_UID,
        githubUsername: GITHUB_USERNAME,
        analyzedRepo: repoInfo.fullName,
        lastCommitSHA: signals.lastCommitSHA,
        repoSignals: signals,
        metrics,
        skillScores,
        aiFeedback,
        analyzedAt: FieldValue.serverTimestamp() as unknown as FirebaseFirestore.Timestamp,
        engineVersion: '1.0.0',
      };

      await adminDb().collection('github_evidence').doc(`${TEST_UID}_${repoInfo.name}`).set(evidenceData);
      console.log(`✅ Documento escrito en Firestore: github_evidence/${TEST_UID}_${repoInfo.name}`);
    }

    console.log(`\n=== VERIFICACIÓN DE FIRESTORE ===`);
    const docSnap = await adminDb().collection('github_evidence').get();
    console.log(`Documentos totales en github_evidence: ${docSnap.size}`);
    docSnap.docs.forEach((d) => {
      console.log(`\n--- Doc ID: ${d.id} ---`);
      console.log(JSON.stringify(d.data(), null, 2));
    });
  } catch (err: any) {
    console.error(`\n❌ ERROR OCURRIDO:`);
    console.error(err);
  }
}

main();
