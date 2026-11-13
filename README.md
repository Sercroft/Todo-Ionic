# ToDo Ionic — Aplicación de gestión de tareas

Aplicación móvil de gestión de tareas desarrollada con **Ionic, Angular y Cordova**, como parte de una prueba técnica. Implementa una arquitectura basada en MVVM, persistencia local y configuración remota de funcionalidades mediante Firebase Remote Config.

## Características principales

- **Gestión de tareas:** creación, consulta, edición y eliminación de tareas.
- **Gestión de categorías:** creación, edición y eliminación de categorías personalizadas, con identificación visual mediante colores.
- **Organización:** asignación de categorías y filtrado de tareas.
- **Seguimiento:** visualización de estadísticas y estados de las tareas.
- **Persistencia local:** almacenamiento de información en el dispositivo para permitir el funcionamiento sin conexión.
- **Feature Flags:** habilitación o deshabilitación de funcionalidades mediante Firebase Remote Config, sin necesidad de publicar una nueva versión de la aplicación.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Angular | Framework principal |
| Ionic | Componentes e interfaz móvil |
| TypeScript | Lenguaje de desarrollo |
| Cordova | Integración y ejecución en Android |
| Firebase Remote Config | Configuración remota de funcionalidades |
| Git | Control de versiones |

## Arquitectura

El proyecto utiliza una organización por funcionalidades (*Feature-Based Architecture*) y una implementación práctica del patrón **Model-View-ViewModel (MVVM)**.

La estructura principal del código es:

```text
src/
└── app/
    ├── core/
    │   ├── feature-flags/
    │   │   ├── feature-flags.service.ts
    │   │   ├── remote-config.service.ts
    │   │   └── firebasex-config.d.ts
    │   └── storage/
    │       └── local-storage.service.ts
    │
    └── features/
        ├── tasks/
        │   ├── domain/
        │   ├── data/
        │   └── presentation/
        │       ├── pages/
        │       └── view-models/
        │
        └── categories/
            ├── domain/
            ├── data/
            └── presentation/
                ├── pages/
                └── view-models/
```

### Responsabilidades de las capas

- **Domain:** contiene los modelos y contratos de los repositorios.
- **Data:** implementa el acceso y la persistencia de la información.
- **Presentation:** contiene las páginas y los ViewModels que gestionan el estado y la lógica de presentación.
- **Core:** agrupa servicios compartidos, almacenamiento y configuración de funcionalidades.

Esta organización busca mantener separadas las responsabilidades y facilitar el mantenimiento y la evolución de la aplicación.

## Requisitos previos

Para ejecutar y compilar el proyecto se requiere:

- Node.js 22.x.
- npm.
- Java JDK 17.
- Android SDK.
- Android SDK Platform Tools.
- Ionic CLI 7.x.
- Apache Cordova CLI 13.x.

También se requiere un dispositivo Android o un emulador para ejecutar la aplicación móvil.

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd ToDo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

La aplicación utiliza Firebase Remote Config mediante el plugin `cordova-plugin-firebasex-config`.

Para configurar la integración:

1. Crear o utilizar un proyecto en Firebase Console.
2. Registrar una aplicación Android con el identificador de paquete configurado en `config.xml`.
3. Descargar el archivo `google-services.json`.
4. Ubicarlo en la raíz del proyecto, junto a `config.xml`.

El archivo debe corresponder al proyecto Firebase utilizado. No debe reemplazarse por un archivo de configuración de otra aplicación.

### 4. Configurar Remote Config

En Firebase Console, acceder a Remote Config y crear el siguiente parámetro:

| Parámetro | Tipo | Valor inicial |
|---|---|---|
| `categories_enabled` | Boolean | `true` |

Este parámetro controla la disponibilidad de la funcionalidad de categorías.

Al establecerlo en `false`, la interfaz relacionada con las categorías se oculta. Al establecerlo nuevamente en `true`, la funcionalidad vuelve a estar disponible.

Después de modificar el parámetro, se deben publicar los cambios desde Firebase Console.

## Ejecución del proyecto

### Ejecución en navegador

Para iniciar el servidor de desarrollo:

```bash
ionic serve
```

Esta modalidad permite probar la interfaz y las funcionalidades compatibles con el navegador. La integración nativa de Firebase Remote Config requiere ejecutar la aplicación mediante Cordova en Android.

### Ejecución en Android

Para preparar y compilar la plataforma Android:

```bash
npx ng build
cordova prepare android
cordova build android
```

El APK de depuración se genera en:

```text
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### Instalación en un dispositivo físico

Conectar el dispositivo Android mediante USB y habilitar la depuración USB.

Verificar la conexión:

```bash
adb devices
```

Instalar la aplicación:

```bash
adb install -r platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

Abrir la aplicación:

```bash
adb shell monkey -p io.ionic.starter 1
```

El identificador del paquete puede consultarse en `config.xml`.

## Firebase Remote Config y Feature Flags

La implementación utiliza Firebase Remote Config para controlar funcionalidades de la aplicación mediante parámetros remotos.

El flujo de ejecución es el siguiente:

1. La aplicación espera a que Cordova esté disponible.
2. Se establecen los valores predeterminados locales.
3. Se configuran los parámetros de consulta.
4. Se obtiene y activa la configuración remota.
5. Se consulta el valor de `categories_enabled`.
6. El servicio de Feature Flags actualiza el estado de la funcionalidad.
7. La interfaz reacciona al estado del flag y muestra u oculta los elementos correspondientes.

En caso de que Firebase Remote Config no esté disponible, la aplicación conserva el comportamiento predeterminado y mantiene habilitadas las categorías.

## Versionamiento

El proyecto utiliza Git para el control de versiones y GitFlow como estrategia de organización del desarrollo.

La primera entrega funcional se identifica mediante la versión:

**v1.0.0 — ToDo Demo**

Las versiones se identifican mediante etiquetas (*Git Tags*) y publicaciones (*GitHub Releases*).

## Cambios incluidos en la versión 1.0.0

- Implementación de la aplicación base con Ionic y Angular.
- Organización del código mediante arquitectura basada en funcionalidades y patrón MVVM.
- Implementación del módulo de tareas con operaciones CRUD.
- Implementación del módulo de categorías personalizadas.
- Integración entre tareas y categorías.
- Implementación de filtros y estadísticas de tareas.
- Persistencia local para el funcionamiento sin conexión.
- Integración de Firebase Remote Config mediante Cordova.
- Implementación de Feature Flags para controlar remotamente la disponibilidad de categorías.
- Configuración de la compilación y ejecución en Android.

---

**Versión:** 1.0.0  
**Proyecto:** ToDo Demo  
**Plataforma principal:** Android  
**Framework:** Ionic + Angular + Cordova
