import { config } from 'dotenv';
config({ path: '.env.local' });

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
import { FieldValue } from 'firebase-admin/firestore';
const require = createRequire(import.meta.url);
const serviceAccount = require('../../../../firebase-admin-key.json');

initializeApp({
    credential: cert(serviceAccount),
});

const db = getFirestore();
import { generateQuestions } from '../../../ai/flows/generate-assessment-flow';




const SKILLS = [
    { skillId: 'solid', skillName: 'S.O.L.I.D. Architecture', difficulty: 'mid' as const, count: 10 },
    { skillId: 'testing', skillName: 'Advanced Testing', difficulty: 'mid' as const, count: 10 },
    { skillId: 'api-design', skillName: 'API Design', difficulty: 'mid' as const, count: 10 },
];

const COMPANIES = [
    { id: 'vercel', name: 'Vercel', website: 'https://vercel.com', size: 'mid' },
    { id: 'prisma', name: 'Prisma', website: 'https://prisma.io', size: 'startup' },
];

const JOBS = [
    {
        id: 'job_1',
        companyId: 'vercel',
        title: 'Senior Frontend Engineer',
        description: 'Construye el futuro de la web con Next.js y React.',
        location: 'Remote',
        remote: 'full',
        salaryMin: 120000,
        salaryMax: 160000,
        currency: 'USD',
        active: true,
        seniority: 'senior',
        postedAt: FieldValue.serverTimestamp(),
    },
    {
        id: 'job_2',
        companyId: 'prisma',
        title: 'Backend Architect',
        description: 'Diseña sistemas de datos escalables para miles de developers.',
        location: 'Remote',
        remote: 'full',
        salaryMin: 130000,
        salaryMax: 170000,
        currency: 'USD',
        active: true,
        seniority: 'senior',
        postedAt: FieldValue.serverTimestamp(),
    },
];

const JOB_SKILLS = [
    { jobId: 'job_1', skillKey: 'solid', requiredLevel: 'mid', minScore: 70, weight: 0.6, required: true },
    { jobId: 'job_1', skillKey: 'testing', requiredLevel: 'mid', minScore: 60, weight: 0.4, required: true },
    { jobId: 'job_2', skillKey: 'solid', requiredLevel: 'senior', minScore: 80, weight: 0.5, required: true },
    { jobId: 'job_2', skillKey: 'api-design', requiredLevel: 'mid', minScore: 70, weight: 0.5, required: true },
];

async function seedStaticData() {
    console.log('📦 Creando companies...');
    for (const company of COMPANIES) {
        await db.collection('companies').doc(company.id).set(company);
    }

    console.log('💼 Creando jobs...');
    for (const job of JOBS) {
        await db.collection('jobs').doc(job.id).set(job);
    }

    console.log('🎯 Creando job_skills...');
    for (const js of JOB_SKILLS) {
        const id = `${js.jobId}_${js.skillKey}`;
        await db.collection('job_skills').doc(id).set(js);
    }
}

async function seedQuestions() {
    console.log('\n🤖 Generando preguntas con IA...\n');

    for (const skill of SKILLS) {
        console.log(`⏳ Generando para ${skill.skillName}...`);

        const result = await generateQuestions(skill);

        const batch = db.batch();
        for (const question of result.questions) {
            const ref = db.collection('questions').doc();
            batch.set(ref, {
                ...question,
                createdAt: FieldValue.serverTimestamp()
            });
        }
        await batch.commit();

        console.log(`✅ ${result.approved} aprobadas, ${result.rejected} rechazadas para ${skill.skillName}`);
    }
}

async function main() {
    console.log('🚀 Iniciando seed...\n');
    await seedStaticData();
    await seedQuestions();
    console.log('\n🎉 Seed completo.');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});