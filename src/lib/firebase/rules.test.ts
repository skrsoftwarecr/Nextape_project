/**
 * Tests de las reglas de seguridad de Firestore.
 *
 * Requieren el emulador de Firestore. Se SALTAN automáticamente si no está disponible
 * (`FIRESTORE_EMULATOR_HOST` no definido), para no romper CI sin emulador.
 *
 * Para ejecutarlos localmente:
 *   firebase emulators:exec --only firestore "npm test"
 * (o arranca el emulador y exporta FIRESTORE_EMULATOR_HOST=127.0.0.1:8080)
 */
import { describe, it, beforeAll, afterAll } from "vitest";
import { readFileSync } from "node:fs";
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc } from "firebase/firestore";

const hasEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;

describe.skipIf(!hasEmulator)("firestore.rules — integridad del DNA y ownership", () => {
  let testEnv: RulesTestEnvironment;

  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "demo-nextape",
      firestore: { rules: readFileSync("firestore.rules", "utf8") },
    });
  });

  afterAll(async () => {
    await testEnv?.cleanup();
  });

  it("un usuario NO puede escribir su propio DNA (write:false, solo servidor)", async () => {
    const alice = testEnv.authenticatedContext("alice").firestore();
    await assertFails(
      setDoc(doc(alice, "user_skill_scores/alice"), { uid: "alice", scores: { react: 100 } })
    );
  });

  it("un usuario puede leer su propio DNA pero no el de otro", async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), "user_skill_scores/alice"), {
        uid: "alice",
        scores: { react: 80 },
      });
    });
    const alice = testEnv.authenticatedContext("alice").firestore();
    const bob = testEnv.authenticatedContext("bob").firestore();
    await assertSucceeds(getDoc(doc(alice, "user_skill_scores/alice")));
    await assertFails(getDoc(doc(bob, "user_skill_scores/alice")));
  });

  it("nadie puede leer sesiones ni claves de respuestas (server-only)", async () => {
    const alice = testEnv.authenticatedContext("alice").firestore();
    await assertFails(getDoc(doc(alice, "line_sessions/s1")));
    await assertFails(getDoc(doc(alice, "job_answer_keys/j1")));
  });

  it("nadie puede crear intentos desde cliente (create:false, solo servidor)", async () => {
    const alice = testEnv.authenticatedContext("alice").firestore();
    await assertFails(
      setDoc(doc(alice, "assessment_attempts/a1"), { userId: "alice", score: 100 })
    );
  });

  it("solo el reclutador dueño puede crear su vacante", async () => {
    const alice = testEnv.authenticatedContext("alice").firestore();
    const bob = testEnv.authenticatedContext("bob").firestore();
    await assertSucceeds(
      setDoc(doc(alice, "jobs/j1"), { createdBy: "alice", title: "React Architect" })
    );
    // bob no puede crear una vacante a nombre de alice
    await assertFails(
      setDoc(doc(bob, "jobs/j2"), { createdBy: "alice", title: "Fake" })
    );
  });
});
