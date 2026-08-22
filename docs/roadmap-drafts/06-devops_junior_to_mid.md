# Roadmap Route: devops_junior_to_mid

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "devops_junior_to_mid",
  targetRole: "devops",
  fromLevel: "junior",
  toLevel: "mid",
  displayName: "DevOps Engineer · Junior → Mid"
}
```

## Filosofía de la ruta

Un **DevOps junior** sabe Linux básico, Git, y Docker. Un **DevOps mid** automatiza infraestructura (IaC), configura CI/CD, monitorea producción, y gestiona clouds (AWS/GCP/Azure). Es el puente entre desarrollo y operaciones.

### Overlap con backend

Skills compartidas (mismo id):
- `git-fundamentals` — Universal
- `docker-basics` — Contenedores
- `environment-config` — Variables de entorno

Skills con overlap conceptual (distinto id, contexto diferente):
- Backend: `observability` (logs de app)
- DevOps: `monitoring-infrastructure` (métricas de infra)

**Total skills compartidas directo:** 3

---

## Skills incluidas en la ruta

### Skills compartidas con backend

| Skill ID | Nombre | Categoría | Peso Backend | Peso DevOps |
|----------|--------|-----------|--------------|-------------|
| `git-fundamentals` | Git & Control de Versiones | tooling | 0.01 | 0.02 |
| `docker-basics` | Docker & Contenedores | infrastructure | 0.05 | 0.10 |
| `environment-config` | Variables de Entorno & Config | tooling | 0.02 | 0.03 |

### Skills nuevas específicas de DevOps

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `linux-fundamentals` | Linux & Shell Scripting (bash) | infrastructure | null | [] |
| `networking-basics` | Redes (TCP/IP, DNS, HTTP) | infrastructure | null | [] |
| `cloud-fundamentals` | Cloud Fundamentals (AWS/GCP/Azure) | infrastructure | null | linux-fundamentals |
| `terraform` | Terraform & IaC | infrastructure | maintainability | cloud-fundamentals, environment-config |
| `kubernetes-basics` | Kubernetes & Orquestación | infrastructure | architecture | docker-basics, cloud-fundamentals |
| `ci-cd-pipelines` | CI/CD Pipelines (GitHub Actions, Jenkins) | tooling | maintainability | git-fundamentals, docker-basics |
| `monitoring-infrastructure` | Monitoring (Prometheus, Grafana) | observability | maintainability | linux-fundamentals |
| `nginx-reverse-proxy` | Nginx & Reverse Proxy | infrastructure | null | networking-basics |
| `cloud-storage` | Cloud Storage (S3, GCS, Blob) | infrastructure | null | cloud-fundamentals |
| `secrets-management` | Secrets Management (Vault, AWS Secrets) | security | security | environment-config, cloud-fundamentals |
| `scripting-automation` | Scripting & Automation (Python/bash) | tooling | maintainability | linux-fundamentals |
| `backup-recovery` | Backup & Disaster Recovery | infrastructure | null | cloud-fundamentals |
| `logging-centralized` | Logging Centralizado (ELK, CloudWatch) | observability | maintainability | monitoring-infrastructure |
| `ssh-security` | SSH & Gestión de Claves | security | security | linux-fundamentals |
| `basic-security-infra` | Security Basics (firewalls, IAM) | security | security | cloud-fundamentals |

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "kubernetes-basics": 0.13,           // Core de orquestación moderna
  "terraform": 0.12,                   // IaC crítico
  "ci-cd-pipelines": 0.11,             // Automatización de deploys
  "docker-basics": 0.10,               // Compartida, peso mayor que en backend
  "cloud-fundamentals": 0.09,          // AWS/GCP/Azure
  "monitoring-infrastructure": 0.08,   // Prometheus, Grafana
  "scripting-automation": 0.07,        // Python/bash para automatización
  "secrets-management": 0.06,          // Vault, AWS Secrets
  "logging-centralized": 0.05,         // ELK, CloudWatch
  "nginx-reverse-proxy": 0.04,         // Reverse proxy
  "basic-security-infra": 0.04,        // IAM, firewalls
  "cloud-storage": 0.03,               // S3, GCS
  "linux-fundamentals": 0.03,          // Shell scripting
  "environment-config": 0.03,          // Compartida
  "ssh-security": 0.02,                // Claves SSH
  "git-fundamentals": 0.02,            // Compartida
  "networking-basics": 0.02,           // TCP/IP, DNS
  "backup-recovery": 0.02              // Disaster recovery
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`kubernetes-basics` (0.13):** Orquestación de contenedores es **core** en DevOps moderno (vs Docker Compose). Un mid debe dominar pods, deployments, services, y ConfigMaps.

- **`terraform` (0.12):** IaC (Infrastructure as Code) es **obligatorio** en DevOps mid. Terraform > CloudFormation/ARM por ser multi-cloud.

- **`ci-cd-pipelines` (0.11):** GitHub Actions, Jenkins, GitLab CI. Automatizar build → test → deploy. Un mid **diseña** pipelines, no solo los ejecuta.

- **`docker-basics` (0.10):** Mayor peso que en backend (0.05) porque DevOps **orquesta** contenedores, no solo los usa.

- **`cloud-fundamentals` (0.09):** AWS/GCP/Azure — al menos uno dominado (EC2, VPC, IAM, Load Balancers). Multi-cloud es senior, pero un cloud es mid.

- **`monitoring-infrastructure` (0.08):** Prometheus para métricas, Grafana para dashboards. Un mid **configura** alertas (SLOs, SLAs).

- **`scripting-automation` (0.07):** Python/bash para automatizar tareas repetitivas (cleanup, provisioning, reportes). Distingue un mid de un junior que hace todo manual.

- **`secrets-management` (0.06):** Vault, AWS Secrets Manager. **Nunca** hardcodear secrets en código. Un mid gestiona rotación de credenciales.

- **`logging-centralized` (0.05):** ELK Stack (Elasticsearch, Logstash, Kibana) o CloudWatch. Logs distribuidos requieren agregación.

- **`nginx-reverse-proxy` (0.04):** Nginx/HAProxy para routing, SSL termination. Fundamento de load balancing.

- **`basic-security-infra` (0.04):** IAM policies, security groups, firewalls. Un mid cierra puertos innecesarios y aplica least privilege.

- **`cloud-storage` (0.03):** S3/GCS/Blob para backups, assets estáticos, logs. Configurar lifecycle policies.

- **`linux-fundamentals` (0.03):** Shell scripting, permisos, cron jobs. Prerequisito de todo DevOps, pero ya dominado al llegar a mid.

- **`environment-config` (0.03):** Gestión de .env por entorno (dev/staging/prod). Mayor peso que backend (0.02) porque DevOps **provee** la config.

- **`ssh-security` (0.02):** Claves SSH, bastion hosts, agent forwarding. Seguridad de acceso a servidores.

- **`git-fundamentals` (0.02):** Mayor que backend (0.01) — DevOps gestiona repos de IaC y pipelines.

- **`networking-basics` (0.02):** TCP/IP, DNS, routing. Fundamento para debugging de conectividad.

- **`backup-recovery` (0.02):** RTO/RPO, snapshots, disaster recovery plans. Un mid documenta y testea backups.

---

## Skills compartidas con otras rutas

### Con backend_junior_to_mid

- `git-fundamentals`, `docker-basics`, `environment-config` (3 skills)

### Con backend_mid_to_senior

- Overlap conceptual (distinto id):
  - Backend: `observability` (logs de app, APM)
  - DevOps: `monitoring-infrastructure` (métricas de infra), `logging-centralized`

### Con fullstack

- Mismo overlap que backend (3 skills compartidas).

---

## Target score según seniority

- **toLevel = "mid"** → **targetScore = 60** para cada skill.

---

## Notas para revisión humana

1. **Multi-cloud:** `cloud-fundamentals` asume **un** cloud dominado (AWS/GCP/Azure). ¿Separar en skills distintas (`aws-fundamentals`, `gcp-fundamentals`) o mantener genérico?

2. **Kubernetes obligatorio:** `kubernetes-basics` (0.13) es el mayor peso. ¿Todos los DevOps mid deben dominar K8s o existe nicho de Docker Compose + serverless? (Recomendación: K8s es estándar.)

3. **Terraform vs alternativas:** `terraform` (0.12). ¿Incluir Pulumi/CDK en la skill o mantener Terraform como referencia?

4. **Observability split:** `monitoring-infrastructure` (0.08) + `logging-centralized` (0.05) = 0.13 total en observabilidad. ¿Es correcto o unificar en una skill "observability-devops"?

5. **githubDimension:** La mayoría de skills son `null` (no hay señal del GitHub Engine para IaC o cloud). Solo `terraform`, `scripting-automation`, `monitoring-infrastructure` usan `maintainability`; `secrets-management` y `basic-security-infra` usan `security`. ¿Correcto?

6. **Testing de infra:** No se incluyó skill "infrastructure-testing" (Terratest, InSpec). ¿Agregar para mid o dejar para senior?

7. **Overlap con SRE:** Esta ruta es DevOps clásico (CI/CD, IaC). SRE (Site Reliability Engineering) enfatiza más SLOs, incident response, chaos engineering. ¿Crear ruta SRE separada en V2?

---

## Checksum de integridad

- **Skills nuevas DevOps:** 15
- **Skills compartidas con backend:** 3
- **Total skills en catálogo después de esta ruta:** 56 + 15 = **71**
- **Suma de pesos:** 1.00 ✅

