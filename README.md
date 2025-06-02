# UDB Events 📆

**UDB Events** es una aplicación móvil multiplataforma construida con **React Native** + **Expo Router**, diseñada para facilitar la gestión de eventos comunitarios dentro de una institución educativa o comunidad local. Los usuarios pueden explorar eventos, confirmar asistencia, dejar comentarios y más. Los organizadores, por su parte, pueden gestionar y analizar sus eventos de forma sencilla.

> Este frontend consume el backend disponible en: [`proyecto_udb`](https://github.com/r4ams/proyecto_udb)

> Creador: Ramón Humberto Ramos Ramirez - RR121769

> Manual de usuario: [Manual](https://udbedu-my.sharepoint.com/:b:/g/personal/rr121769_alumno_udb_edu_sv/ET__bq1w2SdBgTo8_9id284BWlCGOjnep2vPZy-wMkkfEQ?e=kLMGzq)


---

## 📱 Características principales

- 🔐 **Autenticación** con email y contraseña  
- 👤 Roles: `organizador` y `usuario`  
- 📅 Creación, edición y visualización de eventos  
- 🔔 Confirmación de asistencia y notificaciones  
- 💬 Comentarios y calificación de eventos  
- 📊 Registro de eventos pasados y estadísticas  
- 🖼️ Imágenes de eventos con placeholder dinámico  
- ☁️ Integración con backend Laravel vía API REST  

---

## 🛠️ Tecnologías usadas

- **Expo** (React Native)  
- **React Navigation** con `expo-router`  
- **Axios** para llamadas HTTP  
- **react-native-toast-message** para notificaciones  
- **@react-native-community/datetimepicker** para fechas  
- **SecureStore / localStorage** para persistencia del token  
- **TypeScript** para tipado estático  

---

## ⚙️ Instalación

1. Clona el proyecto:

   ```bash
   git clone https://github.com/r4ams/udb_events
   cd udb_events
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Instala las dependencias nativas necesarias:

   ```bash
   npx expo install @react-native-community/datetimepicker
   npx expo install react-native-toast-message
   ```

4. Levanta el proyecto:

   ```bash
   npx expo start
   ```

---

## 🧪 Login de prueba

| Rol         | Usuario                  | Contraseña |
|-------------|---------------------------|------------|
| Organizador | admin@udb.edu       | admin$123   |
| Usuario     | demo@demo.com@udb.edu           | admin$123   |

> ⚠️ Estos usuarios deben existir en el backend Laravel (ver repositorio `udb_events_backend`).

---

## 🖼️ Diseño Propuesto

> Enlace del diseño propuesto, trabajado en figma:
https://www.figma.com/design/WTx8DPNZgubTnDt1woZMJ6/APP-Reserva-udb?m=auto&t=GSujUgdO3II6gGJm-6

---

## Actividades en Trello

>Se comparte el link del tablero de trello donde se desarrollaron las actividades trabajadas:

https://trello.com/invite/b/683b94e198a3d652e8ced5d1/ATTI17450f8d604874c8193e4f7985161dd81FAABA11/hus-app-eventos

---

## 📂 Estructura de carpetas

```bash
📁 app
 ┣ 📁 context          # Contexto de autenticación
 ┣ 📁 eventos          # Pantallas de detalle, creación y edición
 ┗ 📜 login.tsx        # Pantalla de inicio de sesión
📁 assets              # Imágenes y recursos locales
📁 constants           # URL base del API
```

---

## 🔒 Manejo de autenticación

- El contexto `AuthContext` guarda el token, rol y nombre del usuario autenticado.  
- Se utiliza `expo-secure-store` en móviles y `localStorage` en web.  
- Los headers de autenticación se agregan automáticamente a las peticiones protegidas.

---

## ✍️ Autor

Desarrollado por **R4ams**  
[GitHub @r4ams](https://github.com/r4ams)

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la **Licencia Pública General GNU v3.0 (GPL-3.0)**.  
Para más información, consultá el archivo `LICENSE` o visitá:  
[https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)
