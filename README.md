# Atom Task Manager - Backend

API REST para gestión de tareas, construida con Node.js, Express y Firebase Cloud Functions (2nd Gen).

## Descripción

Backend que expone una API RESTful para la aplicación de gestión de tareas. Utiliza Clean Architecture para organizar el código y Firebase Firestore como base de datos. Las funciones se despliegan en Firebase Cloud Functions (2nd Gen) para scalability y mejor rendimiento.

## Tecnologías

- **Runtime:** Node.js 22
- **Framework:** Express.js
- **Base de Datos:** Firebase Firestore
- **Funciones:** Firebase Cloud Functions (2nd Gen)
- **Validación:** Zod
- **Seguridad:** Helmet, CORS
- **Lenguaje:** TypeScript

## Requisitos Previos

- Node.js 22 o superior
- Firebase CLI (`npm install -g firebase-tools`)
- Cuenta de Firebase con el proyecto `atom-task-manager-77028`

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/atom-test-backend.git

# Entrar al directorio
cd atom-test-backend

# Instalar dependencias
npm install
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run build` | Compila el código TypeScript a JavaScript |
| `npm run watch` | Compila en modo watch (recompila al detectar cambios) |
| `npm run deploy` | Despliega las funciones a Firebase Cloud Functions |


## Variables de Entorno / Secrets

### Secrets Requeridos (CI/CD)

| Secret | Descripción |
|--------|-------------|
| `FIREBASE_TOKEN` | Token de autenticación de Firebase para deploys |
| `PROJECT_ID` | ID del proyecto Firebase (`atom-task-manager-77028`) |

### Generar Firebase Token

```bash
npm install -g firebase-tools
firebase login:ci
```

El token generado debe agregarse en GitHub: **Settings → Secrets → New repository secret**

### Variables de Entorno (Local)

No se requieren variables de entorno para desarrollo local. Firebase CLI usa la configuración de `.firebaserc`.

## Estructura del Proyecto

```
atom-test-backend/
├── src/
│   ├── domain/                 # Entidades y lógica de negocio
│   │   ├── entities/          # Definiciones de Task, User
│   │   └── interfaces/        # Contratos de repositorios
│   ├── application/           # Casos de uso
│   │   └── usecases/          # Lógica de negocio
│   ├── infrastructure/        # Implementaciones externas
│   │   └── repositories/      # Repositorios de Firestore
│   ├── presentation/           # Controllers y middleware
│   │   ├── controllers/       # Controladores de endpoints
│   │   ├── middleware/        # Auth, validation, error handling
│   │   └── routes/           # Definición de rutas
│   ├── shared/                 # Utilidades compartidas
│   │   ├── response.ts       # Helper de respuestas API
│   │   └── firebase.config.ts # Configuración de Firebase
│   ├── index.ts               # Entry point de Express
│   └── firebase-functions.ts   # Export para Cloud Functions
├── lib/                        # Código compilado (no editar manualmente)
├── package.json
├── tsconfig.json
├── firebase.json
└── firestore.rules
```

### Clean Architecture

- **Domain:** Define qué datos existen y qué operaciones son válidas
- **Application:** Contiene la lógica de negocio independiente de frameworks
- **Infrastructure:** Implementa los repositorios que interactúan con Firestore
- **Presentation:** Maneja las requests HTTP y la validación

## API Endpoints

Todos los endpoints están bajo la ruta base: `https://us-central1-atom-task-manager-77028.cloudfunctions.net/api`

### Health Check

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Verifica que la API está funcionando |
| GET | `/api/health` | Health check dentro del grupo api |

### Tasks (requiere autenticación)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/tasks` | Lista todas las tareas del usuario |
| GET | `/api/tasks/:id` | Obtiene una tarea específica |
| POST | `/api/tasks` | Crea una nueva tarea |
| PATCH | `/api/tasks/:id` | Actualiza una tarea |
| DELETE | `/api/tasks/:id` | Elimina una tarea |

### Users

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users/lookup?email=...` | Verifica si un usuario existe |
| POST | `/api/users` | Crea un nuevo usuario |

### Formato de Respuesta

Todas las respuestas siguen el mismo formato:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": { ... }
}
```

En caso de error:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error"
  }
}
```

## Despliegue

### Despliegue Manual

```bash
# Compilar
npm run build

# Desplegar
npm run deploy
```

### Despliegue Automático (CI/CD)

El proyecto está configurado con GitHub Actions. Cada push a la rama `main` ejecuta:

1. Checkout del código
2. Instalación de dependencias (`npm ci`)
3. Compilación (`npm run build`)
4. Despliegue a Firebase Cloud Functions

Para que funcione, necesitas configurar el secret `FIREBASE_TOKEN` en el repositorio de GitHub.

## URLs Desplegadas

| Recurso | URL |
|--------|-----|
| API | https://us-central1-atom-task-manager-77028.cloudfunctions.net/api |
| Health | https://us-central1-atom-task-manager-77028.cloudfunctions.net/health |

