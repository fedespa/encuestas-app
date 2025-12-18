# Encuesta Pro API 🚀

Backend de alto rendimiento para gestión de encuestas, construido con **Node.js**, **TypeScript** y **MongoDB**. Esta aplicación implementa una arquitectura limpia y está preparada para despliegues en producción mediante contenedores Docker con soporte de alta disponibilidad.

## 🛠️ Tecnologías

- **Runtime**: Node.js 20+ 
- **Lenguaje**: TypeScript
- **Base de Datos**: MongoDB 7.0 con **Replica Set**
- **Infraestructura**: Docker & Docker Compose
- **Seguridad**: Autenticación JWT (Access & Refresh Tokens), Rate Limiting y validación de esquemas.

---

## 🧠 Descripción de la Aplicación

Esta aplicación permite **crear, responder y analizar encuestas** de forma flexible y segura.

### ✨ Funcionalidades Principales

- 📋 **Creación y respuesta de encuestas**
  - Soporte para encuestas públicas y privadas.
  - Las encuestas privadas solo pueden ser visualizadas y gestionadas por su creador.

- 🔀 **Reglas lógicas avanzadas**
  - Definición de reglas como:
    - `jump_to`: redirección dinámica entre preguntas.
    - `show` / `hide`: mostrar u ocultar preguntas según respuestas previas.
  - Todas las reglas y flujos son **validados estrictamente** para evitar inconsistencias.

- 🔐 **Gestión de usuarios**
  - Posibilidad de usar la aplicación **con autenticación (JWT)** o **sin usuario**.
  - Creación de usuarios segura y desacoplada del dominio.

- 📊 **Estadísticas de encuestas**
  - Visualización de métricas y resultados agregados.
  - Acceso controlado según el tipo de encuesta (pública o privada).

### 🏗️ Arquitectura y Calidad

- 🧱 **Arquitectura Limpia (Clean Architecture)**
  - Separación clara de responsabilidades (dominio, aplicación, infraestructura).
  - Alta mantenibilidad y facilidad para escalar.

- ✅ **Validación de datos**
  - Uso de **Zod** para validar todas las entradas de la aplicación.

- 🧪 **Testing**
  - Implementación de **tests unitarios** para asegurar la estabilidad y correcto funcionamiento.

- 🧾 **Logging**
  - Integración de **Winston Logger** para trazabilidad y monitoreo de eventos.### 2. Configuración de Seguridad (Keyfile)
  MongoDB requiere una clave compartida para la comunicación interna del clúster. Ejecuta este comando en la raíz del proyecto:
  

- 🔄 **Persistencia y Transacciones**
  - Implementación del patrón **Unit of Work** para manejar transacciones en **MongoDB**, garantizando consistencia de datos.

---


Esta aplicación está diseñada para ser **robusta, extensible y segura**, manteniendo altos estándares de calidad tanto en su arquitectura como en su implementación.


## 🏗️ Características de Producción

- **Backend (VPS)**: Ejecutado en un contenedor Docker optimizado mediante *multi-stage builds*. 
- **Base de Datos (Cloud)**: MongoDB Atlas proporciona un clúster gestionado con tres nodos en réplica, lo que asegura que la base de datos nunca se detenga y soporte transacciones complejas de forma nativa.
---

## 🚀 Despliegue en Producción

### 1. Requisitos Previos
- Docker y Docker Compose instalados.
- Tener una cuenta en **MongoDB Atlas** y obtener la URI de conexión (`mongodb+srv://...`).

## 2. Variables de Entorno
Crea tu archivo de producción basado en el archivo de ejemplo:

```bash
cp .env.example .env.production
```

## 3. Lanzamiento con Docker Compose
Construye las imágenes e inicia los contenedores en segundo plano:

```bash
docker compose -f docker-compose.prod.yml up --build -d
```
---

## 💻 Desarrollo Local

## 1. Instalar dependencias
## 2. Levantar base de datos local:

```bash
docker compose up mongo -d
```
## 3. Ejecutar aplicación: 
```bash
npm run dev
```

## 📁 Estructura de Archivos de Infraestructura

- **Dockerfile.prod**: Instrucciones de build optimizadas para producción en dos etapas (builder y runner).
- **docker-compose.prod.yml**: Configuración simplificada que levanta exclusivamente el servicio de backend en producción.
- **.gitignore**: Configuración para excluir `node_modules`, archivos compilados, secretos `.env` y claves de seguridad.


