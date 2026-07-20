# NEXTAPE SYSTEM BLUEPRINT

## 1. Vision
Nextape es un motor de evaluación neural que transforma el hiring técnico en un proceso basado en datos probados, no en declaraciones.

## 2. Architecture: Modular Monolith
- **Frontend**: Next.js 15 (App Router) + ShadCN UI.
- **Backend**: Firebase (Auth, Firestore, Storage).
- **AI Engine**: Genkit + Gemini 2.5 Flash.
- **Styles**: Tailwind CSS con paleta de marca oficial (SF Pro Display).

## 3. Data Schema (Firestore)

### Collection: `users`
- `uid`: string (PK)
- `email`: string
- `displayName`: string
- `role`: 'developer' | 'recruiter'
- `createdAt`: timestamp

### Collection: `user_skill_scores` (The CORE)
- `uid`: string (PK)
- `scores`: Map<skill_id, number>
- `updatedAt`: timestamp

### Collection: `jobs`
- `id`: string (PK)
- `title`: string
- `description`: string
- `requiredSkills`: string[]
- `level`: 'junior' | 'mid' | 'senior' | 'master'
- `assessmentQuestions`: Array<{id, text, options[], correctIndex, tag}>
- `createdBy`: string (uid)
- `postedAt`: timestamp

### Collection: `assessment_attempts`
- `id`: string
- `userId`: string
- `jobId`: string (optional)
- `skill`: string
- `score`: number
- `timestamp`: timestamp

## 4. User Journeys

### Candidate Journey
1. Auth -> Role: Developer.
2. Dashboard -> Overview of DNA.
3. The LINE -> Specific or General Simulation.
4. Core -> View Technical DNA (calculated as avg of last 3 attempts).
5. Roadmap -> AI generated path for weak skills.
6. Jobs -> Match % calculated by comparing Job.requiredSkills vs User.scores.

### Recruiter Journey
1. Auth -> Role: Recruiter.
2. Recruiter Dashboard -> Overview of vacancies.
3. Post Job -> Trigger AI to generate a "The LINE" assessment for that job.
4. Candidates -> View ranked applicants based on their verified DNA.

## 5. Security Model (Firestore Rules)
- `users`: Owner-only write. Public read (for recruiters).
- `user_skill_scores`: Owner read/write.
- `jobs`: Public read. Recruiter-only write.
- `assessment_attempts`: Owner read/write.
