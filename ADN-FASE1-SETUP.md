# ADN Estratégico — Fase 1
## Implementado
- Pantalla `adn-acceso.html` con correo y verificación OTP.
- Cliente Supabase Auth, inicialmente deshabilitado hasta configurar el proyecto.
- Esquema `adn-database.sql` con tablas de participantes y diagnósticos y políticas Row Level Security.
- `adn-auth-config.js` sin credenciales.

## Activación pendiente
1. Crear proyecto Supabase administrado por Socio Estratégico.
2. Ejecutar `adn-database.sql` en SQL Editor.
3. Activar Email OTP y personalizar la plantilla para que incluya `{{ .Token }}`; configurar límites y caducidad.
4. Introducir URL y publishable key en `adn-auth-config.js` (nunca service_role ni claves SMTP).
5. Preparar aviso de privacidad, consentimiento separado de marketing y formularios de perfil.
6. Integrar guardado de respuestas y lectura del historial con sesión verificada.
7. Verificar RLS, protección contra abuso y envío real antes de lanzar.
8. Implementar dashboard privado mediante backend con roles, y después sincronización controlada con Sheets.

**No hay envíos de correo ni almacenamiento de datos reales activos aún.** El remitente UNAM requiere autorización y configuración SMTP independiente.