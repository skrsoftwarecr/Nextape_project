# Roadmap Route: backend_mid_to_senior

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "backend_mid_to_senior",
  targetRole: "backend",
  fromLevel: "mid",
  toLevel: "senior",
  displayName: "Backend Engineer · Mid → Senior"
}
```

## Filosofía de la ruta

La transición de **Mid a Senior** en Backend marca el salto de ejecutor técnico a **arquitecto de sistemas distribuidos**. Un mid domina la construcción de APIs robustas, bases de datos y testing; un senior diseña sistemas que escalan, se recuperan de fallos, y se observan en producción.

### Diferencias clave con Junior→Mid

- **Junior→Mid** enfatiza fundamentos: REST, SQL, testing unitario, autenticación básica.
- **Mid→Senior** enfatiza diseño de sistemas: caching distribuido, colas de mensajes, observabilidad, tolerancia a fallos, y arquitectura event-driven.

### Nuevas skills de nivel senior

Las siguientes skills **se agregan** al catálogo compartido (no existían en backend_junior_to_mid):

1. **`distributed-systems`** — CAP theorem, consistencia eventual, replicación
2. **`system-design`** — Diseño de arquitecturas escalables, trade-offs, diagramas C4
3. **`caching-strategies`** — Redis, TTL, cache invalidation patterns
4. **`message-queues`** — RabbitMQ/SQS, pub/sub, dead-letter queues
5. **`observability`** — Métricas (Prometheus), logs estructurados, tracing (OpenTelemetry)
6. **`database-performance`** — Query optimization, índices compuestos, EXPLAIN ANALYZE
7. **`api-versioning`** — Estrategias de versionado, breaking changes, deprecation
8. **`event-driven-architecture`** — Event sourcing, CQRS, event streams
9. **`load-balancing`** — Estrategias (round-robin, least-conn), health checks
10. **`ci-cd-advanced`** — Pipelines complejos, feature flags, canary deployments

---

## Skills incluidas en la ruta

### Skills reutilizadas de backend_junior_to_mid

Todas las 18 skills del catálogo junior→mid son prerequisitos implícitos para esta ruta. Se asume que un mid ya domina:

- `git-fundamentals`, `node-runtime`, `typescript-basics`
- `sql-fundamentals`, `postgresql`, `orm-basics`
- `http-protocol`, `api-design-rest`, `api-validation`
- `unit-testing`, `integration-testing`
- `auth-jwt`, `basic-security`
- `error-handling`, `environment-config`, `docker-basics`
- `async-patterns`, `code-documentation`

Estas skills **NO se duplican** en skillWeights de esta ruta, pero se referencian como prerequisitos de las nuevas skills senior.

### Skills nuevas nivel senior

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `distributed-systems` | Sistemas Distribuidos & CAP | architecture | architecture | postgresql, async-patterns |
| `system-design` | Diseño de Sistemas Escalables | architecture | architecture | api-design-rest, distributed-systems |
| `caching-strategies` | Estrategias de Caching (Redis) | infrastructure | architecture | postgresql, docker-basics |
| `message-queues` | Message Queues & Pub/Sub | infrastructure | architecture | async-patterns, docker-basics |
| `observability` | Observabilidad & Tracing | observability | maintainability | error-handling, docker-basics |
| `database-performance` | Optimización de Queries & Índices | database | architecture | postgresql, orm-basics |
| `api-versioning` | Versionado de APIs | api-design | architecture | api-design-rest, code-documentation |
| `event-driven-architecture` | Arquitectura Event-Driven & CQRS | architecture | architecture | message-queues, distributed-systems |
| `load-balancing` | Load Balancing & Health Checks | infrastructure | architecture | docker-basics, http-protocol |
| `ci-cd-advanced` | CI/CD Avanzado & Feature Flags | tooling | null | docker-basics, integration-testing |

---

## Pesos de skillWeights (suma = 1.00)

Los pesos reflejan la **criticidad relativa** de cada skill para demostrar nivel senior en backend. Se priorizan arquitectura de sistemas, observabilidad y rendimiento sobre repetición de fundamentos.

```typescript
skillWeights: {
  "system-design": 0.18,               // Crítico: arquitectura escalable
  "distributed-systems": 0.14,         // Fundamento de sistemas complejos
  "observability": 0.12,               // Debugging en prod, SLOs
  "event-driven-architecture": 0.10,   // Patrón moderno de arquitectura
  "message-queues": 0.09,              // Desacoplamiento asíncrono
  "caching-strategies": 0.08,          // Performance crítica
  "database-performance": 0.08,        // Queries a escala
  "api-versioning": 0.06,              // Backward compatibility
  "load-balancing": 0.06,              // Alta disponibilidad
  "ci-cd-advanced": 0.05,              // Deployments seguros
  "api-design-rest": 0.02,             // Refuerzo de fundamento mid
  "integration-testing": 0.02          // Refuerzo de testing mid
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`system-design` (0.18):** La habilidad **definitoria** de un senior. Diseñar trade-offs (latencia vs consistencia, SQL vs NoSQL, síncrono vs asíncrono) es lo que diferencia un mid de un senior.
  
- **`distributed-systems` (0.14):** CAP theorem, consistencia eventual, particionamiento. Fundamento teórico para entender las decisiones de `system-design`.

- **`observability` (0.12):** En producción, **no puedes debuggear con breakpoints**. Métricas, logs estructurados y tracing son la clave para operar sistemas complejos. Un senior debe dominar Prometheus, Grafana, y OpenTelemetry.

- **`event-driven-architecture` (0.10):** Patrón arquitectónico moderno (event sourcing, CQRS) que escala mejor que REST para workflows complejos. Dominio esperado en roles senior.

- **`message-queues` (0.09):** RabbitMQ, SQS, Kafka. Desacoplar productores de consumidores, garantías de entrega, dead-letter queues. Habilidad core para arquitecturas resilientes.

- **`caching-strategies` (0.08):** Redis, TTL, cache-aside vs write-through, invalidación. El caching mal diseñado genera bugs sutiles; bien diseñado reduce latencia 10x.

- **`database-performance` (0.08):** Saber SQL no basta en senior; debes entender EXPLAIN ANALYZE, índices compuestos, query planners, locks, y cómo evitar full table scans a escala.

- **`api-versioning` (0.06):** Breaking changes son inevitables; un senior diseña estrategias de versionado (headers, URIs, feature flags) para mantener clientes legacy funcionando.

- **`load-balancing` (0.06):** Alta disponibilidad requiere distribuir carga (nginx, HAProxy, ALB). Health checks, sticky sessions, y estrategias de failover.

- **`ci-cd-advanced` (0.05):** Feature flags, canary deployments, rollbacks automáticos. Un senior no solo escribe código, supervisa su deploy a producción de forma segura.

- **Refuerzos de mid (0.04 total):** `api-design-rest` e `integration-testing` con pesos mínimos, porque un senior debe **perfeccionarlos** (ej: diseño de APIs idempotentes, integration tests con retries y circuit breakers).

---

## Skills compartidas con otras rutas

### Con backend_junior_to_mid

- **Todas las 18 skills** de junior→mid son prerequisitos implícitos (no ponderados en esta ruta).
- **Refuerzos explícitos:** `api-design-rest` (0.02) e `integration-testing` (0.02) aparecen en ambas rutas con pesos distintos.

### Con fullstack_mid_to_senior (futuro)

- `system-design`, `distributed-systems`, `observability`, `caching-strategies`, `message-queues`, `ci-cd-advanced` serán compartidas (el fullstack senior debe dominar backend senior).

### Con devops_junior_to_mid y devops_mid_to_senior (futuro)

- `docker-basics`, `ci-cd-advanced`, `observability`, `load-balancing` son overlap natural entre backend senior y devops.

---

## Target score según seniority

De acuerdo con `SENIORITY_THRESHOLDS` del engine (ver `src/services/github-engine/role-mapping/role-weights.ts`):

- **Junior:** 30–59
- **Mid:** 60–79
- **Senior:** 80–100

Para `backend_mid_to_senior`, `toLevel = "senior"` → **targetScore = 80** para cada skill en el roadmap.

---

## Notas para revisión humana

1. **Validar prerequisitos:** Las nuevas skills senior tienen prerequisitos de nivel mid (ej: `distributed-systems` requiere `postgresql` y `async-patterns`). Revisar si el grafo es coherente.

2. **githubDimension:** Todas las skills arquitectónicas (`system-design`, `distributed-systems`, etc.) usan `githubDimension: "architecture"` como proxy. `ci-cd-advanced` es `null` (no hay señal del GitHub Engine para esto). ¿Es correcto?

3. **Overlap con devops:** Skills como `observability`, `load-balancing`, `ci-cd-advanced` tienen fuerte overlap con devops. ¿Deben compartir el mismo `id` o tener variantes rol-específicas? (Recomendación: **compartir el id**, ajustar pesos por ruta.)

4. **Event-driven vs REST:** `event-driven-architecture` es un patrón senior, pero no todos los backends lo usan. ¿Debería tener menor peso o ser opcional (V2: rutas condicionales)?

5. **Testing senior:** No se agregó skill "e2e-testing" o "chaos-engineering". ¿Incluir en futuras iteraciones?

---

## Checksum de integridad

- **Skills únicas nuevas:** 10
- **Skills reutilizadas como prerequisitos:** 18
- **Total skills en catálogo compartido después de esta ruta:** 28
- **Suma de pesos:** 1.00 ✅
- **Todas las referencias en prerequisitos existen:** ✅ (validar con seed script)

