# Roadmap Route: mobile_junior_to_mid

**Borrador generado para revisión — NO publicado a Firestore**

## Metadata

```typescript
{
  id: "mobile_junior_to_mid",
  targetRole: "mobile",
  fromLevel: "junior",
  toLevel: "mid",
  displayName: "Mobile Engineer · Junior → Mid"
}
```

## Filosofía de la ruta

Un **mobile junior** construye UIs básicas siguiendo tutoriales (Flutter/React Native). Un **mobile mid** domina navegación compleja, estado global, APIs nativas, optimización de performance, y publicación en stores (App Store/Play Store). Puede trabajar con **plataformas nativas (iOS/Android) O cross-platform (Flutter/RN)**.

### Estrategia multi-plataforma

Esta ruta cubre **skills compartidas** entre iOS, Android, Flutter y React Native:
- Fundamentos agnósticos (Git, HTTP, testing)
- Conceptos universales (navegación, estado, networking, persistencia local)
- Habilidades específicas se marcan con notas (ej: "Swift/Kotlin" o "Dart/JS")

Para especialización profunda (ej: SwiftUI avanzado, Jetpack Compose), ver rutas de nivel senior.

---

## Skills incluidas en la ruta

### Skills compartidas con otras rutas

| Skill ID | Nombre | Categoría | Notas |
|----------|--------|-----------|-------|
| `git-fundamentals` | Git & Control de Versiones | tooling | Universal |
| `unit-testing` | Unit Testing | testing | XCTest/JUnit/Jest según plataforma |
| `http-protocol` | HTTP/HTTPS & REST | api-design | Mismo que backend |
| `api-integration` | Integración con APIs REST | api-design | Compartida con frontend |

### Skills nuevas específicas de Mobile

| Skill ID | Nombre | Categoría | githubDimension | Prerequisitos |
|----------|--------|-----------|-----------------|---------------|
| `mobile-language-fundamentals` | Lenguaje Mobile (Swift/Kotlin/Dart/JS) | language | architecture | [] |
| `mobile-ui-basics` | UI Básico (UIKit/SwiftUI / Jetpack Compose / Flutter Widgets) | language | null | mobile-language-fundamentals |
| `mobile-navigation` | Navegación (Navigation/Router) | tooling | architecture | mobile-ui-basics |
| `mobile-state-management` | State Management (Provider/Riverpod / Bloc / Redux) | architecture | architecture | mobile-ui-basics |
| `local-storage-mobile` | Persistencia Local (SQLite, SharedPreferences, UserDefaults) | database | null | mobile-language-fundamentals |
| `networking-mobile` | Networking (URLSession/Retrofit/Dio/Axios) | api-design | architecture | http-protocol, mobile-language-fundamentals |
| `async-programming-mobile` | Async/Await (async/await, Futures, Promises) | language | architecture | mobile-language-fundamentals |
| `mobile-forms-validation` | Forms & Validación | tooling | security | mobile-ui-basics |
| `mobile-permissions` | Permisos (Cámara, Ubicación, Notificaciones) | security | security | mobile-language-fundamentals |
| `mobile-lifecycle` | Lifecycle de Apps (States, Background) | language | maintainability | mobile-ui-basics |
| `responsive-mobile-design` | Responsive Design (tablets, orientación) | language | null | mobile-ui-basics |
| `app-store-publishing` | Publicación en Stores (App Store, Play Store) | tooling | null | mobile-ui-basics |
| `mobile-debugging` | Debugging & Profiling (Instruments, Android Profiler) | tooling | maintainability | mobile-language-fundamentals |
| `push-notifications` | Push Notifications (FCM, APNs) | infrastructure | null | mobile-permissions |
| `mobile-testing-ui` | UI Testing (XCUITest, Espresso, integration_test) | testing | testing | unit-testing, mobile-ui-basics |

---

## Pesos de skillWeights (suma = 1.00)

```typescript
skillWeights: {
  "mobile-state-management": 0.13,     // Estado complejo (Provider, Bloc, Redux)
  "mobile-navigation": 0.11,           // Navigation crítico en apps complejas
  "networking-mobile": 0.10,           // APIs REST desde mobile
  "mobile-ui-basics": 0.09,            // Widgets/Views foundation
  "mobile-testing-ui": 0.08,           // UI testing
  "unit-testing": 0.08,                // Compartida
  "async-programming-mobile": 0.07,    // Futures, async/await
  "local-storage-mobile": 0.06,        // SQLite, UserDefaults
  "mobile-lifecycle": 0.06,            // Background, foreground, states
  "mobile-language-fundamentals": 0.05,// Swift/Kotlin/Dart/JS
  "api-integration": 0.04,             // Compartida con frontend
  "mobile-debugging": 0.03,            // Instruments, Profiler
  "push-notifications": 0.03,          // FCM, APNs
  "mobile-permissions": 0.02,          // Permisos runtime
  "app-store-publishing": 0.02,        // Stores
  "mobile-forms-validation": 0.02,     // Validación input
  "responsive-mobile-design": 0.01,    // Tablets, landscape
  "git-fundamentals": 0.01,            // Universal
  "http-protocol": 0.01                // Fundamento de networking
}
```

**Total:** 1.00 ✅

### Justificación de pesos

- **`mobile-state-management` (0.13):** Estado global (Provider/Riverpod en Flutter, Redux en RN, MVVM en iOS/Android) es el **salto** de junior a mid. Un mid gestiona estado compartido entre pantallas.

- **`mobile-navigation` (0.11):** Navegación compleja (tabs, modals, deep linking). Un mid diseña flujos de navegación sin spaghetti code.

- **`networking-mobile` (0.10):** URLSession (iOS), Retrofit (Android), Dio (Flutter), Axios (RN). Manejar loading, errores, retry, cache. Un mid abstrae networking en servicios.

- **`mobile-ui-basics` (0.09):** SwiftUI/UIKit (iOS), Jetpack Compose/XML (Android), Flutter Widgets, React Native Components. Fundamento de construcción de UIs.

- **`mobile-testing-ui` (0.08) + `unit-testing` (0.08) = 0.16 total:** Testing crítico en mobile — UI tests (XCUITest, Espresso, integration_test) + tests unitarios. Prevenir regresiones.

- **`async-programming-mobile` (0.07):** async/await (Swift, Kotlin), Futures/Streams (Dart), Promises (JS). Fundamento de networking y operaciones asíncronas.

- **`local-storage-mobile` (0.06):** SQLite (Room en Android, CoreData/SQLite en iOS), SharedPreferences/UserDefaults. Persistencia offline.

- **`mobile-lifecycle` (0.06):** Estados de app (foreground, background, suspended), manejo de `onPause`, `onResume`, `willEnterForeground`. Un mid evita memory leaks y crashes.

- **`mobile-language-fundamentals` (0.05):** Swift/Kotlin/Dart/JS según plataforma. Fundamento ya dominado al llegar a mid, pero crítico.

- **`api-integration` (0.04):** Compartida con frontend — conectar con backend REST, manejar tokens, refresh tokens.

- **`mobile-debugging` (0.03):** Instruments (iOS), Android Profiler. Debugging de memory leaks, CPU spikes, network issues.

- **`push-notifications` (0.03):** FCM (Firebase Cloud Messaging), APNs (Apple Push Notification Service). Feature estándar en apps modernas.

- **`mobile-permissions` (0.02):** Runtime permissions (Android 6+, iOS 14+). Cámara, ubicación, notificaciones. Un mid maneja UX de permisos denegados.

- **`app-store-publishing` (0.02):** Subir a App Store (TestFlight, App Store Connect) y Play Store (Internal/Alpha/Beta/Production). Conocer proceso de review.

- **`mobile-forms-validation` (0.02):** Validación de input antes de enviar al backend. React Hook Form (RN), Flutter Form, validators nativos.

- **`responsive-mobile-design` (0.01):** Tablets, landscape, diferentes screen sizes. Menor peso que en web porque mobile es inherentemente responsivo.

- **Fundamentos (0.02 total):** `git-fundamentals` (0.01), `http-protocol` (0.01) — universales pero ya dominados.

---

## Skills compartidas con otras rutas

### Con frontend_junior_to_mid

- `api-integration` (0.04 en mobile, 0.06 en frontend)
- Overlap conceptual (distinto id):
  - Frontend: `react-fundamentals`, `component-architecture`, `state-management`
  - Mobile: `mobile-ui-basics`, `mobile-state-management`, `mobile-navigation`

### Con backend_junior_to_mid

- `git-fundamentals`, `http-protocol`, `unit-testing`

**Total skills compartidas directo:** 4

---

## Target score según seniority

- **toLevel = "mid"** → **targetScore = 60** para cada skill.

---

## Notas para revisión humana

1. **Plataforma-agnóstico:** La ruta usa nombres genéricos (`mobile-language-fundamentals` en lugar de `swift-fundamentals`). ¿Es correcto o separar en rutas iOS/Android/Flutter/ReactNative distintas? (Recomendación: mantener agnóstico para MVP, especializar en V2.)

2. **Cross-platform vs nativo:** Skills como `mobile-ui-basics` cubren tanto Flutter/RN (cross-platform) como SwiftUI/Compose (nativo). ¿Separar? (Recomendación: no — los conceptos son transferibles.)

3. **Testing E2E mobile:** No se incluyó Detox (RN), Maestro, Appium. ¿`mobile-testing-ui` cubre E2E o solo integration tests? (Recomendación: `mobile-testing-ui` = integration tests, E2E es senior.)

4. **Deep linking:** No tiene skill separada — está implícito en `mobile-navigation`. ¿Correcto o crear `deep-linking` aparte?

5. **Offline-first:** `local-storage-mobile` cubre persistencia pero no sync offline→online (ej: queue de requests). ¿Agregar skill "offline-sync" para mid o senior?

6. **CI/CD mobile:** No se incluyó (Fastlane, Bitrise, Codemagic). ¿Agregar o asumir que es responsabilidad DevOps?

7. **githubDimension:** La mayoría son `architecture`, `testing`, `security`. `mobile-ui-basics` es `null` (no hay proxy del GitHub Engine para UIs móviles). ¿Correcto?

8. **React Native específico:** Si el proyecto usa RN, ¿`mobile-language-fundamentals` debería ser `javascript-es6` (ya existente) o mantener id separado para mobile? (Recomendación: mantener separado para claridad de contexto.)

---

## Checksum de integridad

- **Skills nuevas mobile:** 15
- **Skills compartidas:** 4 (git, unit-testing, http-protocol, api-integration)
- **Total skills en catálogo después de esta ruta:** 84 + 15 = **99**
- **Suma de pesos:** 1.00 ✅

