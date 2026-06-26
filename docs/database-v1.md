# NEXTAPE — Base de Datos v1

> Fuente de verdad del esquema de datos. Leer antes de crear cualquier servicio o query.

---

## Motor: Firebase Firestore

---

## Colecciones

### users/{uid}
**Propósito:** Identidad y perfil público del developer.

```typescript
{
  uid: string                        // Firebase Auth UID
  displayName: string
  email: string
  photoURL: string
  role: 'developer' | 'recruiter' | 'admin'
  githubUsername?: string            // Opcional
  bio?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```
**Índices:** uid (PK automático)
**Restricción:** GitHub es opcional. role define acceso.

---

### user_skill_scores/{uid}
**Propósito:** FUENTE DE VERDAD del sistema. Score de cada skill por nivel.

```typescript
{
  uid: string
  scores: {
    [skillKey: string]: {           // ej: "solid", "testing", "api-design"
      junior: number                // 0-100
      mid: number                   // 0-100
      senior: number                // 0-100
    }
  }
  lastUpdated: Timestamp
  totalAssessments: number
}
```
**Regla crítica:** Solo `features/assessments/` puede escribir aquí.
**Índices:** uid (PK)

---

### assessments/{assessmentId}
**Propósito:** Evaluación completada por un developer.

```typescript
{
  id: string
  userId: string
  skill: string                     // ej: "solid"
  difficulty: 'junior' | 'mid' | 'senior'
  status: 'in_progress' | 'completed' | 'expired'
  score: number                     // 0-100, calculado al completar
  totalQuestions: number
  answers: {
    [questionId: string]: 'bad' | 'acceptable' | 'excellent'
  }
  startedAt: Timestamp
  completedAt?: Timestamp
  attemptNumber: number             // cuál intento es (1, 2, 3...)
}
```
**Índices:** userId, skill+difficulty, status

---

### assessment_attempts/{attemptId}
**Propósito:** Historial de intentos por skill. El score final es promedio de últimos 3.

```typescript
{
  id: string
  userId: string
  assessmentId: string             // ref al assessment completado
  skill: string
  difficulty: 'junior' | 'mid' | 'senior'
  score: number                    // 0-100
  completedAt: Timestamp
  usedForScore: boolean            // true si está en el promedio activo
}
```
**Índices:** userId+skill+difficulty, completedAt DESC
**Restricción:** Máximo 3 intentos cuentan para el score activo.

---

### questions/{questionId}
**Propósito:** Banco de preguntas curado con revisión humana.

```typescript
{
  id: string
  topic: string                    // ej: "backend"
  subtopic: string                 // ej: "solid"
  subtopicDetail: string           // ej: "dependency-inversion"
  difficulty: 'junior' | 'mid' | 'senior'
  template: 'A' | 'B' | 'C' | 'D'
  question: string
  answers: {
    label: 'A' | 'B' | 'C'
    quality: 'bad' | 'acceptable' | 'excellent'
    text: string
  }[]
  weight: number                   // peso en el score final (0-1)
  approved: boolean
  approvedBy: string               // uid del revisor
  approvedAt: Timestamp
  createdAt: Timestamp
}
```
**Índices:** subtopic+difficulty+approved, approved
**Restricción:** Solo preguntas con `approved: true` se muestran en evaluaciones.

---

### companies/{companyId}
**Propósito:** Empresas que publican vacantes.

```typescript
{
  id: string
  name: string
  logoURL?: string
  website?: string
  industry: string
  size: 'startup' | 'small' | 'medium' | 'enterprise'
  ownerId: string                  // uid del recruiter administrador
  createdAt: Timestamp
}
```
**Índices:** ownerId

---

### jobs/{jobId}
**Propósito:** Vacantes publicadas por empresas.

```typescript
{
  id: string
  companyId: string
  title: string
  description: string
  seniority: 'junior' | 'mid' | 'senior'
  type: 'full-time' | 'part-time' | 'contract' | 'freelance'
  remote: boolean
  status: 'draft' | 'active' | 'closed'
  postedBy: string                 // uid del recruiter
  postedAt: Timestamp
  closesAt?: Timestamp
}
```
**Índices:** companyId, status, seniority+status

---

### job_skills/{jobId_skillKey}
**Propósito:** Skills requeridas por cada vacante con peso y nivel mínimo.

```typescript
{
  id: string                       // formato: "{jobId}_{skillKey}"
  jobId: string
  skillKey: string                 // ej: "solid", "testing"
  minScore: number                 // score mínimo requerido (0-100)
  requiredLevel: 'junior' | 'mid' | 'senior'
  weight: number                   // peso en el Compatibility Engine (suma = 1)
}
```
**Índices:** jobId
**Restricción:** La suma de weights por jobId debe ser 1.0

---

### candidate_matches/{uid_jobId}
**Propósito:** Resultado del Compatibility Engine. Cache del score de match.

```typescript
{
  id: string                       // formato: "{uid}_{jobId}"
  userId: string
  jobId: string
  totalScore: number               // 0-100, score final
  skillMatch: number               // 0-100, representa el 70%
  evidenceMatch: number            // 0-100, representa el 20%
  experienceMatch: number          // 0-100, representa el 10%
  breakdown: {
    [skillKey: string]: number     // score por skill individual
  }
  missingSkills: string[]          // skills requeridas sin score suficiente
  calculatedAt: Timestamp
}
```
**Índices:** userId, jobId, totalScore DESC
**Nota:** Se recalcula cuando cambia user_skill_scores o job_skills.

---

### github_profiles/{uid}
**Propósito:** Datos del perfil GitHub del developer. Solo evidencia.

```typescript
{
  uid: string
  githubUsername: string
  avatarUrl: string
  publicRepos: number
  followers: number
  totalCommitsLastYear: number
  topLanguages: string[]
  lastSynced: Timestamp
}
```
**Restricción:** NUNCA modifica user_skill_scores.

---

### github_evidence/{uid}
**Propósito:** Evidencia procesada de GitHub para el Evidence Match (20%).

```typescript
{
  uid: string
  evidenceScore: number            // 0-100, solo afecta evidenceMatch
  consistencyScore: number         // frecuencia de commits
  diversityScore: number           // variedad de lenguajes/tecnologías
  qualitySignals: {
    hasTests: boolean
    hasDocumentation: boolean
    hasOpenSource: boolean
    hasCollaboration: boolean
  }
  lastUpdated: Timestamp
}
```
**Restricción:** evidenceScore alimenta candidate_matches.evidenceMatch únicamente.

---

## ERD Textual

```
users (1) ──────────────── (1) user_skill_scores
users (1) ──────────────── (N) assessments
users (1) ──────────────── (N) assessment_attempts
users (1) ──────────────── (1) github_profiles
users (1) ──────────────── (1) github_evidence
users (1) ──────────────── (N) candidate_matches

companies (1) ───────────── (N) jobs
jobs (1) ────────────────── (N) job_skills
jobs (1) ────────────────── (N) candidate_matches

questions (1) ───────────── (N) assessments.answers

user_skill_scores ──────────────→ candidate_matches (input 70%)
github_evidence ────────────────→ candidate_matches (input 20%)
users.experience ───────────────→ candidate_matches (input 10%)
job_skills ─────────────────────→ candidate_matches (comparación)
```

---

## Compatibility Engine — Fórmula

```
totalScore = (skillMatch × 0.70) + (evidenceMatch × 0.20) + (experienceMatch × 0.10)

skillMatch = Σ( min(userScore_i / minScore_i, 1) × weight_i ) × 100
             para cada skill en job_skills

evidenceMatch = github_evidence.evidenceScore  (o 0 si no tiene GitHub)

experienceMatch = calculado por seniority del developer vs seniority del job
```

**Determinístico:** mismos inputs siempre producen el mismo output. Sin IA.

---

## Riesgos de diseño

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Reads costosos en Firestore al listar candidatos por score | Alto | candidate_matches actúa como índice desnormalizado |
| job_skills weights no suman 1.0 | Medio | Validar en el servicio antes de escribir |
| Preguntas sin `approved:true` llegan al usuario | Alto | Query siempre filtra `approved == true` |
| GitHub rate limit en sync masivo | Medio | Cache con TTL 24h en github_profiles |
| Score inflado por reintentos ilimitados | Medio | assessment_attempts limita a 3 intentos activos |

---

## Escalabilidad para 100k usuarios

1. **candidate_matches** es la clave — evita recalcular en cada request
2. Recalcular matches en background (Firestore trigger) cuando cambia `user_skill_scores`
3. Índice compuesto en `candidate_matches`: `jobId + totalScore DESC` para ranking
4. Paginar listas de candidatos con `startAfter()` cursors
5. `questions` es una colección de solo lectura — cacheable en memoria del cliente
6. Separar reads de writes: `user_skill_scores` se escribe poco, se lee mucho

---

*Versión: 1.0 — Junio 2025*
