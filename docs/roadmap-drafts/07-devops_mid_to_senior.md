# Roadmap Route: devops_mid_to_senior

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "devops_mid_to_senior",
  targetRole: "devops",
  fromLevel: "mid",
  toLevel: "senior",
  displayName: "DevOps Engineer · Mid → Senior"
}
```

## Filosofía de la ruta

Un **DevOps mid** automatiza infra y configura pipelines. Un **DevOps senior** diseña **plataformas internas** (platform engineering), define SLOs/SLAs, implementa chaos engineering, multi-cloud, y arquitecturas zero-trust. Es el nivel de **Site Reliability Engineer (SRE)**.

### Prerequisitos

Se asume dominio de **todas las skills de devops_junior_to_mid** (15 nuevas + 3 compartidas = 18 skills).

### Nuevas skills de nivel senior

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `kubernetes-advanced` | Kubernetes Avanzado (Operators, CRDs, Service Mesh) | infrastructure | architecture | kubernetes-basics |
| `multi-cloud-architecture` | Arquitectura Multi-Cloud & Híbrida | architecture | architecture | cloud-fundamentals, terraform |
| `gitops` | GitOps (ArgoCD, Flux) | tooling | maintainability | ci-cd-pipelines, kubernetes-basics |
| `service-mesh` | Service Mesh (Istio, Linkerd) | infrastructure | architecture | kubernetes-advanced |
| `observability-advanced` | Observability Avanzada (OpenTelemetry, distributed tracing) | observability | maintainability | monitoring-infrastructure, logging-centralized |
| `chaos-engineering` | Chaos Engineering (Gremlin, Chaos Mesh) | testing | testing | kubernetes-advanced, monitoring-infrastructure |
| `incident-response` | Incident Response & Post-Mortems | tooling | maintainability | observability-advanced |
| `slo-sla-management` | SLOs, SLAs & Error Budgets | observability | maintainability | monitoring-infrastructure |
| `zero-trust-security` | Zero Trust Security & mTLS | security | security | basic-security-infra, service-mesh |
| `cost-optimization` | Cost Optimization (FinOps, Reserved Instances) | tooling | null | cloud-fundamentals, terraform |
| `platform-engineering` | Platform Engineering (Internal Developer Platforms) | architecture | architecture | kubernetes-advanced, terraform, ci-cd-pipelines |
| `canary-blue-green` | Canary & Blue-Green Deployments | tooling | maintainability | ci-cd-pipelines, kubernetes-basics |
| `disaster-recovery-advanced` | Disaster Recovery & Multi-Region | infrastructure | maintainability | backup-recovery, multi-cloud-architecture |

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "platform-engineering": 0.12,        // Crítico: diseño de plataformas internas (ajustado de 0.16)
  "kubernetes-advanced": 0.15,         // Operators, CRDs, Service Mesh (+0.01)
  "observability-advanced": 0.12,      // OpenTelemetry, tracing distribuido (+0.01)
  "slo-sla-management": 0.10,          // Error budgets, SLOs (+0.01)
  "gitops": 0.09,                      // ArgoCD/Flux para CD declarativo (+0.01)
  "multi-cloud-architecture": 0.07,    // Estrategia multi-cloud
  "chaos-engineering": 0.06,           // Resilencia en producción
  "incident-response": 0.06,           // On-call, post-mortems
  "zero-trust-security": 0.05,         // mTLS, seguridad de red avanzada
  "service-mesh": 0.05,                // Istio/Linkerd
  "canary-blue-green": 0.04,           // Deploys seguros
  "disaster-recovery-advanced": 0.03,  // Multi-region failover
  "cost-optimization": 0.03,           // FinOps
  "terraform": 0.02,                   // Refuerzo de mid (IaC avanzado)
  "ci-cd-pipelines": 0.01              // Refuerzo de mid
}
```

**Total:** 1.00 ✅

**Ajuste aplicado:** `platform-engineering` reducido de 0.16 a 0.12 (-0.04). Los 0.04 sobrantes redistribuidos en las 4 skills más críticas: kubernetes-advanced, observability-advanced, slo-sla-management, gitops (+0.01 cada una).

### Justificación de pesos

- **`platform-engineering` (0.12):** La skill definitoria de DevOps senior. Diseñar **Internal Developer Platforms** (IDPs) que abstraen complejidad de infra para equipos de producto. Ejemplo: self-service de ambientes, paved roads para despliegues. **Peso ajustado** para equilibrar con otras skills senior críticas.

- **`kubernetes-advanced` (0.15):** Operators (ej: Prometheus Operator), CRDs (Custom Resource Definitions), autoscaling avanzado (HPA, VPA, Karpenter). Un senior **extiende** Kubernetes, no solo lo usa. **Incrementado** por su criticidad técnica.

- **`observability-advanced` (0.12):** OpenTelemetry para tracing distribuido (span, trace ID), correlación logs-métricas-traces. Debugging de sistemas complejos a escala. **Incrementado** por importancia en producción.

- **`slo-sla-management` (0.10):** Definir SLOs (Service Level Objectives) y error budgets. Un senior toma **decisiones de negocio** (¿deployamos hoy o estamos fuera de budget?). **Incrementado** por impacto organizacional.

- **`gitops` (0.09):** ArgoCD/Flux — declarar estado deseado en Git, reconciliación automática. GitOps > scripts manuales para CD. **Incrementado** por ser best practice moderna.

- **`multi-cloud-architecture` (0.07):** Diseñar para AWS + GCP, failover entre clouds, evitar vendor lock-in. Requiere abstracción (Terraform modules multi-cloud).

- **`chaos-engineering` (0.06):** Gremlin, Chaos Mesh, Litmus. Inyectar fallos en producción (pod crashes, latency) para validar resiliencia. Netflix Simian Army.

- **`incident-response` (0.06):** On-call rotations, runbooks, post-mortems sin culpa. Un senior **lidera** incidents, no solo los resuelve.

- **`zero-trust-security` (0.05):** mTLS (mutual TLS), identity-based access (no confiar en red interna). Service mesh + Vault para secrets injection.

- **`service-mesh` (0.05):** Istio/Linkerd para traffic management, observability, security (mTLS automático). Abstrae lógica de red de la app.

- **`canary-blue-green` (0.04):** Progressive delivery — deploys graduales con rollback automático. Reduce blast radius de bugs.

- **`disaster-recovery-advanced` (0.03):** Multi-region (active-active, active-passive), RTO/RPO < 1h. Un senior **diseña** DR, no solo documenta.

- **`cost-optimization` (0.03):** FinOps — optimizar costos cloud (Reserved Instances, Spot, right-sizing). Un senior justifica presupuesto de infra.

- **Refuerzos de mid (0.03 total):** `terraform` (0.02) para IaC avanzado (remote state, workspaces, modules); `ci-cd-pipelines` (0.01) para pipelines complejos (matrix builds, artifacts).

---

## Skills compartidas con otras rutas

### Con devops_junior_to_mid

- **Todas las 18 skills** son prerequisitos implícitos.
- **Refuerzos:** `terraform` (0.02), `ci-cd-pipelines` (0.01).

### Con backend_mid_to_senior

- Overlap conceptual (distinto id pero relacionado):
  - Backend: `observability` (logs de app)
  - DevOps: `observability-advanced` (tracing distribuido)
  - Backend: `message-queues` (app usa queues)
  - DevOps: `service-mesh` (routing de mensajes en infra)

### Con SRE (futuro)

- `slo-sla-management`, `incident-response`, `chaos-engineering`, `observability-advanced` son **core** de SRE. Si se crea ruta SRE separada, estas skills se compartirán.

---

## Target score según seniority

- **toLevel = "senior"** → **targetScore = 80** para cada skill.

---

## Notas para revisión humana

1. **Platform Engineering vs DevOps:** `platform-engineering` (0.16) es el mayor peso. ¿Es skill de todos los DevOps senior o solo de roles "Platform Engineer" específicos? (Recomendación: es la **evolución natural** de DevOps senior — Team Topologies: platform team.)

2. **Kubernetes vs serverless:** La ruta asume infra basada en K8s. ¿Debería existir ruta alternativa "DevOps Serverless" (Lambda, Cloud Functions, Fargate)? (Recomendación: V2 — por ahora K8s es dominante.)

3. **Chaos Engineering obligatorio:** `chaos-engineering` (0.06). ¿Todos los senior deben hacer chaos en prod o es solo para empresas grandes? (Recomendación: conceptualmente obligatorio, práctica depende del contexto.)

4. **Multi-cloud vs single-cloud experto:** `multi-cloud-architecture` (0.07). ¿Es mejor ser experto en un cloud (AWS/GCP) o tener conocimiento superficial de varios? (Recomendación: multi-cloud es senior, pero profundidad en uno + estrategia multi-cloud.)

5. **Service Mesh obligatorio:** `service-mesh` (0.05). Istio/Linkerd tienen curva de aprendizaje alta y no todos los equipos los usan. ¿Peso correcto o reducir a 0.03?

6. **FinOps:** `cost-optimization` (0.03). ¿Es skill técnica o de negocio? Un senior DevOps debe entender costos pero ¿debería ser su responsabilidad primaria? (Recomendación: sí — justificar gasto de infra es parte del rol senior.)

7. **Testing de infra:** `chaos-engineering` es el único testing explícito. ¿Agregar "infrastructure-testing" (Terratest, InSpec, Kitchen) como skill separada?

8. **GitOps vs CI/CD tradicional:** `gitops` (0.08) + refuerzo `ci-cd-pipelines` (0.01). ¿GitOps reemplaza CI/CD o coexisten? (Recomendación: coexisten — GitOps es CD declarativo, CI/CD es el build.)

---

## Checksum de integridad

- **Skills nuevas senior DevOps:** 13
- **Skills prerequisito (no ponderadas):** 18 (de devops_junior_to_mid)
- **Total skills en catálogo después de esta ruta:** 71 + 13 = **84**
- **Suma de pesos:** 1.00 ✅

