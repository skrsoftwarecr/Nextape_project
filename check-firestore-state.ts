import './scripts/load-env.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

async function main() {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!)) });
  }
  const db = getFirestore();

  const skillsSnap = await db.collection('skill_catalog').get();
  const routesSnap = await db.collection('roadmap_routes').get();

  console.log('ESTADO ACTUAL DE FIRESTORE:');
  console.log('----------------------------');
  console.log('skill_catalog:   ', skillsSnap.size, 'skills');
  console.log('roadmap_routes:  ', routesSnap.size, 'rutas');
  console.log('');
  console.log('Rutas existentes:');
  routesSnap.forEach(doc => {
    const data = doc.data();
    console.log(`  - ${doc.id}: ${data.displayName}`);
  });

  console.log('');
  console.log('Skills existentes (primeras 10):');
  skillsSnap.docs.slice(0, 10).forEach(doc => {
    const data = doc.data();
    console.log(`  - ${doc.id}: ${data.name}`);
  });
}

main().then(() => process.exit(0)).catch(console.error);
