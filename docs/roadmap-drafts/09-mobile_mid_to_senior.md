# Roadmap Route: mobile_mid_to_senior

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "mobile_mid_to_senior",
  targetRole: "mobile",
  fromLevel: "mid",
  toLevel: "senior",
  displayName: "Mobile Engineer · Mid → Senior"
}
```

## Filosofía de la ruta

Un **mobile mid** construye apps funcionales con estado, navegación y APIs. Un **mobile senior** optimiza performance (60fps, startup time), implementa arquitecturas escalables (Clean Architecture, modularización), domina CI/CD mobile, seguridad avanzada, y features nativas complejas (biometría, ARKit/ARCore, WidgetKit).

### Prerequisitos

Se asume dominio de **todas las skills de mobile_junior_to_mid** (15 nuevas + 4 compartidas = 19 skills).

### Nuevas skills de nivel senior

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `mobile-architecture-advanced` | Arquitectura Avanzada (Clean, MVVM, MVI, TCA) | architecture | architecture | mobile-state-management, mobile-ui-basics |
| `mobile-performance-optimization` | Optimización de Performance (60fps, Startup Time) | tooling | maintainability | mobile-debugging, mobile-lifecycle |
| `mobile-security-advanced` | Seguridad Avanzada (Keychain, Biometría, Certificate Pinning) | security | security | mobile-permissions |
| `modularization-mobile` | Modularización & Multi-Module (SPM, CocoaPods, Gradle Modules) | architecture | maintainability | mobile-architecture-advanced |
| `ci-cd-mobile` | CI/CD Mobile (Fastlane, Bitrise, GitHub Actions) | tooling | maintainability | app-store-publishing |
| `native-features-advanced` | Features Nativas Avanzadas (ARKit, WidgetKit, Wear OS) | language | null | mobile-language-fundamentals |
| `offline-sync` | Offline-First & Sync (Conflict Resolution) | database | architecture | local-storage-mobile, networking-mobile |
| `mobile-animations-advanced` | Animaciones Avanzadas (Lottie, Rive, Physics-based) | language | null | mobile-ui-basics |
| `accessibility-mobile` | Accesibilidad Mobile (VoiceOver, TalkBack, Dynamic Type) | security | documentation | mobile-ui-basics |
| `crash-reporting-analytics` | Crash Reporting & Analytics (Firebase Crashlytics, Sentry) | observability | maintainability | mobile-debugging |
| `app-size-optimization` | App Size Optimization (ProGuard, Tree Shaking, Asset Compression) | tooling | maintainability | mobile-performance-optimization |
| `deep-linking-advanced` | Deep Linking & Universal Links (App Links, Associated Domains) | tooling | architecture | mobile-navigation |
| `e2e-testing-mobile` | E2E Testing (Detox, Maestro, Appium) | testing | testing | mobile-testing-ui |

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "mobile-architecture-advanced": 0.16,  // Clean Architecture, MVVM, MVI
  "mobile-performance-optimization": 0.14, // 60fps, startup time crítico
  "modularization-mobile": 0.11,         // Multi-module para escalabilidad
  "mobile-security-advanced": 0.10,      // Keychain, biometría, pinning
  "offline-sync": 0.08,                  // Offline-first con conflict resolution
  "ci-cd-mobile": 0.08,                  // Fastlane, Bitrise
  "e2e-testing-mobile": 0.07,            // Detox, Maestro
  "crash-reporting-analytics": 0.06,     // Crashlytics, Sentry
  "accessibility-mobile": 0.05,          // VoiceOver, TalkBack
  "native-features-advanced": 0.04,      // ARKit, WidgetKit
  "app-size-optimization": 0.03,         // ProGuard, tree shaking
  "deep-linking-advanced": 0.03,         // Universal Links
  "mobile-animations-advanced": 0.02,    // Lottie, physics-based
  "mobile-state-management": 0.02,       // Refuerzo de mid
  "networking-mobile": 0.01              // Refuerzo de mid
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`mobile-architecture-advanced` (0.16):** Clean Architecture (Uncle Bob), MVVM (Model-View-ViewModel), MVI (Model-View-Intent), TCA (The Composable Architecture en SwiftUI). Un senior **diseña** arquitecturas testables y escalables, no solo escribe features.

- **`mobile-performance-optimization` (0.14):** Mantener **60fps**, reducir startup time a <2s, optimizar consumo de batería, evitar memory leaks. Performance es **UX** — un senior usa Instruments/Profiler para identificar bottlenecks.

- **`modularization-mobile` (0.11):** Multi-module (SPM/CocoaPods en iOS, Gradle Modules en Android, Flutter packages). Equipos grandes requieren modularización para builds paralelos y ownership claro.

- **`mobile-security-advanced` (0.10):** Keychain (iOS), Keystore (Android), biometría (FaceID, TouchID, Fingerprint), SSL pinning, code obfuscation. Un senior **protege** datos sensibles (tokens, PII).

- **`offline-sync` (0.08):** Offline-first con sync automática al reconectar. Conflict resolution (last-write-wins, CRDTs). Apps enterprise requieren funcionar sin conexión.

- **`ci-cd-mobile` (0.08):** Fastlane para automatizar builds/uploads, Bitrise/GitHub Actions para CI. Un senior **elimina** trabajo manual (screenshots, versioning, signing).

- **`e2e-testing-mobile` (0.07):** Detox (RN), Maestro (cross-platform), Appium (nativo). Tests de flujos críticos (login, checkout) en CI.

- **`crash-reporting-analytics` (0.06):** Firebase Crashlytics, Sentry para stacktraces. Analytics (Firebase Analytics, Mixpanel) para medir adopción de features. Un senior **instrumenta** apps para observabilidad.

- **`accessibility-mobile` (0.05):** VoiceOver (iOS), TalkBack (Android), Dynamic Type, contraste de colores. Accesibilidad es **requisito legal** en muchos mercados. Un senior testea con screen readers.

- **`native-features-advanced` (0.04):** ARKit (iOS), ARCore (Android), WidgetKit (iOS 14+), Wear OS. Features diferenciadas — no todas las apps las usan, pero un senior debe conocerlas.

- **`app-size-optimization` (0.03):** ProGuard/R8 (Android), tree shaking (Flutter), asset compression. Apps grandes (>100MB) tienen menor adopción. Un senior optimiza size.

- **`deep-linking-advanced` (0.03):** Universal Links (iOS), App Links (Android), navegación desde notificaciones/emails. Un senior implementa deep linking robusto (fallback, parámetros).

- **`mobile-animations-advanced` (0.02):** Lottie (Adobe After Effects → código), Rive, physics-based animations (Spring). UX premium que diferencia productos.

- **Refuerzos de mid (0.03 total):** `mobile-state-management` (0.02) porque un senior usa patrones avanzados (Bloc, Redux Saga, Coordinators); `networking-mobile` (0.01) para retry logic, circuit breakers.

---

## Skills compartidas con otras rutas

### Con mobile_junior_to_mid

- **Todas las 19 skills** son prerequisitos implícitos.
- **Refuerzos:** `mobile-state-management`, `networking-mobile`.

### Con frontend_mid_to_senior

- Overlap conceptual (distinto id):
  - Frontend: `advanced-performance` (Core Web Vitals)
  - Mobile: `mobile-performance-optimization` (60fps, startup)
  - Frontend: `e2e-testing` (Playwright)
  - Mobile: `e2e-testing-mobile` (Detox)

### Con devops_mid_to_senior

- `ci-cd-mobile` comparte conceptos con `gitops` y `canary-blue-green` (CI/CD avanzado).

---

## Target score según seniority

- **toLevel = "senior"** → **targetScore = 80** para cada skill.

---

## Notas para revisión humana

1. **Arquitectura:** `mobile-architecture-advanced` cubre múltiples patrones (Clean, MVVM, MVI, TCA). ¿Separar en skills distintas o mantener como categoría única? (Recomendación: mantener única — los conceptos son transferibles.)

2. **Performance obligatoria:** `mobile-performance-optimization` (0.14) es segundo mayor peso. ¿Todos los senior deben dominar Instruments/Profiler o solo los de apps con alto tráfico? (Recomendación: obligatorio — performance es UX universal.)

3. **Seguridad:** `mobile-security-advanced` (0.10). ¿Incluir también "pentesting mobile" (OWASP Mobile Top 10)? (Recomendación: no — pentesting es rol de seguridad, no de dev mobile.)

4. **Modularización:** `modularization-mobile` (0.11). ¿Es skill de todos los senior o solo de equipos grandes? (Recomendación: conceptualmente obligatorio — un senior debe **diseñar** para escala, aunque no trabaje en equipo grande.)

5. **CI/CD móvil:** `ci-cd-mobile` (0.08). ¿Fastlane es específico de iOS/RN o también Android? (Respuesta: Fastlane soporta ambos, pero en Android también se usa Gradle + GitHub Actions directo.)

6. **Offline-sync:** `offline-sync` (0.08). Conflict resolution es **complejo** (CRDTs, operational transformation). ¿Es realista esperar que un senior domine esto o es skill de especialista? (Recomendación: conceptualmente obligatorio, implementación puede usar librerías — ej: Realm Sync, WatermelonDB.)

7. **Native features:** `native-features-advanced` (0.04) incluye AR (ARKit/ARCore). ¿Todos los senior mobile deben dominar AR o es nicho? (Recomendación: consciente de que existe, capaz de implementar con docs, no necesariamente experto.)

8. **githubDimension:** La mayoría usan `architecture`, `maintainability`, `security`, `testing`. `native-features-advanced` y `mobile-animations-advanced` son `null`. ¿Correcto?

9. **Testing:** `e2e-testing-mobile` (0.07) + refuerzo `mobile-testing-ui` (prerequisito implícito). ¿Suficiente o agregar "performance testing" (ej: benchmarking con XCTest Performance)?

---

## Checksum de integridad

- **Skills nuevas senior mobile:** 13
- **Skills prerequisito (no ponderadas):** 19 (de mobile_junior_to_mid)
- **Total skills en catálogo después de esta ruta:** 99 + 13 = **112**
- **Suma de pesos:** 1.00 ✅

