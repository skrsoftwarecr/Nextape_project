# NEXTAPE - Developer Hiring Reimagined

Este es el repositorio oficial de Nextape, un monorepo diseñado para evaluar desarrolladores mediante simulaciones dinámicas por IA.

## Arquitectura (Monolito Modular)
- **Capa Frontend**: `src/app/` (Next.js App Router - Rutas únicamente)
- **Features**: `src/features/` (Lógica de negocio modular por dominio)
- **Servicios**: `src/services/` (Clientes de datos Firebase)
- **Backend API**: Estructura preparada en `src/api/`

## Cómo subir este código a GitHub
Copia y pega esto en tu terminal:
```bash
git init
git remote add origin https://github.com/skrsoftwarecr/nextape.git
git add .
git commit -m "Initial structure: Architecture CORE MVP"
git push -u origin main
```

## MVP Agosto
- Landing & Auth
- The LINE (Evaluación Neural)
- CORE (Identidad Técnica / Skill DNA)
- Compatibility Engine
- Personal Roadmap
