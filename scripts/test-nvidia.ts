/**
 * Prueba rápida de conectividad con NVIDIA NIM (Llama 3.3 70B).
 *
 * Uso: npx tsx scripts/test-nvidia.ts
 */
import { config } from 'dotenv';

// Cargar `.env.local` primero (convención de Next), luego `.env` como respaldo.
config({ path: '.env.local' });
config();

async function main() {
  const { aiBackup, NVIDIA_MODEL } = await import('../src/ai/genkit-nvidia');

  console.log('NVIDIA_API_KEY presente:', !!process.env.NVIDIA_API_KEY);
  console.log('Modelo:', NVIDIA_MODEL);

  const response = await aiBackup().generate({
    model: `nvidia/${NVIDIA_MODEL}`,
    prompt: 'Responde únicamente con la palabra: OK',
  });

  console.log('✅ Respuesta de NVIDIA NIM:', response.text);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
