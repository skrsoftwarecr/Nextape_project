# NEXTAPE - Developer Hiring Reimagined

NEXTAPE es una plataforma de evaluación técnica de élite que utiliza IA para validar el "Technical DNA" de los desarrolladores.

## 🚀 Migración al Repositorio Oficial (Rama: migration)

Si tienes problemas de permisos (Error 403) al subir el código, sigue estos pasos:

### 1. Ejecutar el script automatizado
```bash
chmod +x migration.sh
./migration.sh
```

### 2. Uso de Personal Access Token (PAT)
GitHub ya no acepta contraseñas normales por terminal para operaciones de Git. 
1. Ve a **GitHub Settings** > **Developer Settings** > **Personal Access Tokens**.
2. Genera un nuevo token con el permiso `repo` activado.
3. Copia el token y úsalo como **contraseña** cuando la terminal te lo pida.

### 3. Comandos Manuales de Limpieza
Si sigues viendo que Git intenta usar una cuenta antigua:
```bash
git config --global --unset credential.helper
git credential-cache exit
```

## 🏗️ Arquitectura
- **Capa Frontend**: `src/app/` (Next.js 15 App Router)
- **Dashboard Dual**: Rutas protegidas con lógica específica para `developer` y `recruiter`.
- **The LINE**: Motor de simulación técnica basado en Genkit + Gemini 1.5 Flash.
- **CORE Identity**: Identidad técnica persistida en Firestore que promedia los últimos 3 intentos.

## 🛠️ Configuración
Configura tu `.env` con las credenciales de Firebase y la API Key de Google AI (Gemini).
