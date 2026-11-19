# Plan de Despliegue de StockLink

Proyecto intermodular de 2º de DAW · Módulos 0615, 0492 y 0614 · Equipo StockLink

Plan de arquitectura y despliegue de StockLink, la aplicación web de gestión de stock multiempresa. Está pensado para un entorno desacoplado (frontend mobile-first + API REST) y para un equipo de 3 personas. Es un **plan**: describe cómo vamos a desplegar, no algo que ya esté montado.

**Stack del proyecto:** Angular (frontend), Node.js + Express (API REST) y MySQL (datos). El hosting, el pipeline y la monitorización se adaptan a ese stack.

## Reparto de responsabilidades

| Fase | Responsable | Issue |
|---|---|---|
| Fase 1: Control de versiones y flujo de trabajo | Daniel Jiménez Ramírez | #110 |
| Fase 2: Arquitectura subyacente | Daniel Ortiz Jiménez | #111 |
| Fase 3: Pipeline CI/CD | Daniel Ortiz Jiménez | #112 |
| Fase 4: Calidad, monitorización y seguridad | Pepe Gil Cué | #113 |

Pepe Gil Cué es el Scrum Master del Sprint 3 y aprueba los Pull Requests.

## Resumen del flujo

```text
feature/* → Pull Request → CI (build + tests + Lighthouse)
                         → Preview en móvil real
                         → Revisión y aprobación
                         → Merge a main → Producción
                         → Sentry + uptime + alertas (200 ms)
```

---

## Fase 1: Control de versiones y flujo de trabajo colaborativo

**Responsable:** Daniel Jiménez Ramírez · **Issue:** #110

Para un equipo de 3 personas, el despliegue empieza en el repositorio. El objetivo es evitar colisiones en el código y asegurar la calidad antes de que un cambio llegue al servidor.

### Sistema y alojamiento
- Git sobre GitHub. La organización **StockLink-EUSA** ya existe y el repositorio está en ella.

### Estrategia de ramas: GitHub Flow
| Rama | Función |
|---|---|
| `main` | Refleja producción y siempre es desplegable. |
| `feature/nombre-funcionalidad` | Rama efímera, una por tarea. Ejemplos: `feature/login-api`, `feature/alertas-stock-bajo`, `feature/movil-selector-empresa`. |

### Políticas de integración
- Ningún commit va directo a `main`. Todo entra mediante Pull Request (PR) con al menos una aprobación.
- Se configura con *branch protection rules* en `main`: PR obligatoria, 1 revisión mínima, checks de CI en verde y rama actualizada antes de fusionar.
- Nota: en repositorios privados de una organización, las branch protection rules pueden requerir un plan de pago de GitHub. Hay que comprobar la visibilidad del repositorio antes de configurarlas.

### Revisión
- La aprobación corresponde al **Scrum Master (Pepe Gil Cué en el Sprint 3)**.
- Cuando el PR lo abre el propio Scrum Master, lo revisa otro miembro del equipo, para que nadie apruebe su propio código.

### Tablero Kanban
El tablero de GitHub Projects tiene las columnas **Backlog → Pendiente → En desarrollo → Atasco → TERMINADO**. Los PR se enlazan con las tareas (`Closes #N`), de modo que al fusionar se cierra la tarea y pasa a TERMINADO.

### Commits
Mensajes descriptivos con prefijo: `feat:`, `fix:`, `docs:`, para facilitar el historial.

### Entregable de esta fase
- [ ] Rama `main` protegida (o documentada la limitación del plan de GitHub).
- [ ] Convención de ramas y commits documentada.
- [ ] Tablero enlazado con los PR.

---

## Fase 2: Diseño de la arquitectura subyacente

**Responsable:** Daniel Ortiz Jiménez · **Issue:** #111

La prioridad es el rendimiento en móvil y la comunicación por API REST, así que **frontend y backend se despliegan por separado**.

**Por qué mobile-first:** el personal operativo de un local consulta y actualiza existencias de pie, entre estanterías y desde el móvil. Una carga lenta o una API con latencia alta se traducen en errores de inventario.

**Stack del proyecto:** Angular (frontend), Node.js + Express (API REST) y MySQL (datos).

### Componentes
| Componente | Tecnología | Propósito y justificación |
|---|---|---|
| Frontend (mobile-first) | Angular en **Firebase Hosting** (plan gratuito) | `ng build` genera archivos estáticos (HTML/CSS/JS) que se sirven desde una CDN. Carga rápida en móvil desde cualquier ubicación. Hay que configurar una reescritura a `index.html` (`rewrites` en `firebase.json`) para que funcionen las rutas de Angular. Dominio gratuito `.web.app`. |
| Backend (API REST) | Express (Node.js) en **Render o Railway** (PaaS) | Construyen y ejecutan el servicio sin gestionar servidores. La API corre igual en los equipos del equipo y en producción. Expone empresas, locales, productos, categorías, stock y movimientos. |
| Base de datos | **MySQL gestionada** (proveedor a validar, por ejemplo Railway) | StockLink es muy relacional (empresa → local → producto → movimiento) y necesita integridad y trazabilidad, por lo que SQL encaja mejor que una base documental. Hay que comprobar que el proveedor incluye copias de seguridad. |
| Autenticación | JWT propio en la API Express (contraseñas con bcrypt) | Sesión única para varias empresas y locales, y permisos por perfil (gestor, responsable de local, personal operativo). |

### Entornos y secretos
- Tres entornos: **local** (cada desarrollador), **preview** (uno por PR) y **producción** (rama `main`).
- Las variables sensibles (URL de la base de datos, claves JWT, DSN de Sentry) no se suben al repositorio: se guardan en los secretos de GitHub y de Render.
- Se incluye un `.env.example` sin valores reales.

### Nota sobre costes y latencia
Los planes gratuitos de algunos PaaS suspenden el servicio tras un tiempo sin tráfico y la primera petición tarda más. Hay que comprobarlo, porque afecta al objetivo de 200 ms de la Fase 4.

### Decisiones pendientes de validar
- [ ] Plataforma de la API: Render o Railway.
- [ ] Proveedor de MySQL gestionada.

### Entregable de esta fase
- [ ] Diagrama de la arquitectura (móvil → CDN → API → MySQL).
- [ ] Tabla de tecnologías aprobada.
- [ ] `.env.example` en el repositorio.

---

## Fase 3: Pipeline de integración y despliegue continuos (CI/CD)

**Responsable:** Daniel Ortiz Jiménez · **Issue:** #112

El código pasa del repositorio a producción sin intervención manual, usando **GitHub Actions**.

### 1. Build
Al abrir un PR, el pipeline instala dependencias (`npm ci`) y compila frontend y backend.

### 2. Testing automatizado
- **Backend:** pruebas unitarias y de endpoints con Jest y Supertest. Por ejemplo, que un movimiento de salida reduzca el stock y que no permita cantidades negativas.
- **Frontend:** pruebas unitarias de Angular (`ng test`) y auditoría de Lighthouse en móvil.
- Si falla cualquier prueba, o la puntuación de rendimiento de Lighthouse baja del umbral acordado (**propuesta: 90**), el PR queda bloqueado.

### 3. Delivery y deploy
- Cada PR genera una **URL de preview** para probar la app en móviles reales sin descargar el código. En el frontend se usan los canales de preview de Firebase Hosting; en la API, los previews de Render si el plan lo permite.
- Al fusionar en `main`, se despliegan automáticamente frontend y backend a producción.

### Ejemplo de workflow mínimo (`.github/workflows/ci.yml`)
Supone carpetas `frontend/` y `backend/`.

```yaml
name: CI
on:
  pull_request:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: backend/package-lock.json
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test

  frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
      - run: npm run build
      - run: npm test -- --watch=false
      - run: npx @lhci/cli autorun
```

Notas:
- `ng test` se queda en modo *watch* por defecto, por eso el pipeline pasa `--watch=false`. Si el proyecto usa Karma, el entorno de CI también necesita un navegador headless.
- `npx @lhci/cli autorun` necesita un archivo de configuración `lighthouserc.json` (con la URL o la carpeta compilada que se audita y el umbral). Sin él, el paso falla. Es parte del trabajo de esta fase.
- Este ejemplo solo cubre los PR. El despliegue a producción al fusionar en `main` lo hacen las integraciones de Firebase y Render, o un segundo workflow.

### Entregable de esta fase
- [ ] `ci.yml` funcionando en un PR de prueba.
- [ ] `lighthouserc.json` con el umbral acordado.
- [ ] URL de preview generada en un PR.

---

## Fase 4: Aseguramiento, monitorización y calidad (QA)

**Responsable:** Pepe Gil Cué (Scrum Master del Sprint 3) · **Issue:** #113

El despliegue no termina cuando la aplicación está en línea: hay que asegurar que funciona bien a lo largo del tiempo.

### Monitorización
- **Errores en tiempo real:** Sentry en el frontend (`@sentry/angular`) y en la API (`@sentry/node`) para capturar excepciones, con aviso por correo al equipo.
- **Rendimiento:** paneles de métricas de la plataforma (Render o Railway, y Firebase) para vigilar CPU, memoria y tiempos de respuesta.
- **Disponibilidad:** un endpoint `/health` en la API vigilado con un servicio de uptime (por ejemplo UptimeRobot), con alerta si deja de responder.
- **Latencia:** aviso si el tiempo de respuesta de la API supera los **200 ms**, porque la latencia perjudica directamente la experiencia móvil.

### Calidad continua
- Lighthouse en cada PR (umbral propuesto: 90, ver Fase 3).
- Revisión periódica de accesibilidad, relevante para usuarios con nivel tecnológico medio-bajo.

### Seguridad
- Dependabot y *secret scanning* de GitHub activados (según el plan de GitHub del repositorio).
- Gestión de secretos y permisos de usuario, y revisión de seguridad de los PR.
- Copias de seguridad automáticas de la base de datos, con una **restauración de prueba** antes de la entrega.

### Métricas objetivo
| Métrica | Objetivo | Cómo se avisa |
|---|---|---|
| Respuesta de la API | menos de 200 ms | Alerta de latencia |
| Lighthouse en móvil | 90 o más (propuesta) | El PR se bloquea |
| Disponibilidad de `/health` | siempre responde | Alerta de uptime |
| Errores | ninguno sin atender | Sentry avisa por correo |

### Entregable de esta fase
- [ ] Sentry integrado en frontend y API.
- [ ] `/health` y alerta de uptime.
- [ ] Alerta de latencia configurada.
- [ ] Dependabot y secret scanning activados.
- [ ] Restauración de copia de seguridad probada.

---

