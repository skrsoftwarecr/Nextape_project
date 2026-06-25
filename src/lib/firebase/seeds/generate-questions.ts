import { generateQuestions } from '@/ai/flows/generate-assessment-flow';
import { db } from '@/lib/firebase/client';
import { collection, addDoc } from 'firebase/firestore';

const SKILLS_TO_GENERATE = [
    { skillId: 'solid', skillName: 'S.O.L.I.D. Architecture', difficulty: 'mid' as const, count: 10 },
    { skillId: 'testing', skillName: 'Advanced Testing', difficulty: 'mid' as const, count: 10 },
    { skillId: 'api-design', skillName: 'API Design', difficulty: 'mid' as const, count: 10 },
];

async function seed() {
    console.log('Generando preguntas...\n');

    for (const skill of SKILLS_TO_GENERATE) {
        console.log(`Generando ${skill.count} preguntas para ${skill.skillName}...`);

        const result = await generateQuestions({
            skillId: skill.skillId,
            skillName: skill.skillName,
            difficulty: skill.difficulty,
            count: skill.count,
        });

        for (const question of result.questions) {
            await addDoc(collection(db, 'questions'), {
                ...question,
                approved: false,
                createdAt: new Date(),
            });
        }

        console.log(` ${result.questions.length} preguntas guardadas para ${skill.skillName}`);
    }

    console.log('\n Listo. Ahora ve a Firestore y aprueba las preguntas que quieras (approved: true)');
}

seed().catch(console.error);