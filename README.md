# Proyecto Final FE App

Este es un proyecto desarrollado con Angular e Ionic Framework, utilizando Capacitor para la integración con funcionalidades nativas. El proyecto incluye funcionalidades como gestión de clientes, notas generales y soporte para múltiples idiomas.

## Tecnologías utilizadas

- **Angular**: Framework para desarrollo de aplicaciones web.
- **Ionic Framework**: Herramienta para crear aplicaciones híbridas.
- **Capacitor**: Plataforma para acceder a funcionalidades nativas.
- **TypeScript**: Lenguaje principal del proyecto.
- **RxJS**: Programación reactiva.
- **@ngx-translate/core**: Soporte para traducción de idiomas.

## Requisitos previos

- Node.js (versión 16 o superior)
- Angular CLI
- Capacitor CLI
- Java JDK (para compilar APK)
- Android Studio (para emulación y despliegue en dispositivos Android)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd proyecto-final-fe-app
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```

## Scripts disponibles

- `npm start`: Inicia el servidor de desarrollo.
- `npm run build`: Genera una versión de producción.
- `npm test`: Ejecuta las pruebas unitarias.
- `npm run lint`: Ejecuta el linter para verificar el código.

## Generar APK con Capacitor

Sigue estos pasos para construir y desplegar un APK para Android:

1. **Construir la aplicación web**:
   ```bash
   npm run build
   ```

2. **Sincronizar con Capacitor**:
   ```bash
   npx cap sync
   ```

3. **Abrir el proyecto en Android Studio**:
   ```bash
   npx cap open android
   ```

4. **Construir el APK**:
  - En Android Studio, selecciona `Build > Build Bundle(s)/APK(s) > Build APK(s)`.
  - Una vez completado, encontrarás el APK en el directorio `app/build/outputs/apk`.

5. **Desplegar en un dispositivo físico**:
  - Conecta tu dispositivo Android mediante USB.
  - Asegúrate de habilitar la depuración USB en el dispositivo.
  - Ejecuta:
    ```bash
    npx cap run android --target=<id-del-dispositivo>
    ```

## Notas adicionales

- Asegúrate de configurar correctamente el entorno de desarrollo para Android (variables de entorno como `ANDROID_HOME`).
- Para más información sobre Capacitor, visita la [documentación oficial](https://capacitorjs.com/docs).

## Licencia

Este proyecto está bajo la licencia MIT.
