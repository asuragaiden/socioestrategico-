# Antes de activar el registro de asesores
El guardado de diagnósticos y el expediente se han programado, pero **la captura de perfiles nuevos está deshabilitada intencionalmente** hasta publicar un aviso de privacidad verificable.

Validar con responsable del proyecto:
- Identidad y domicilio del responsable del tratamiento.
- Finalidades primarias: crear cuenta, autenticar por correo, almacenar respuestas y resultados, mostrar evolución.
- Finalidades secundarias: coaching, promociones y comunicaciones comerciales; consentimiento separado y opcional.
- Datos: nombre, correo, teléfono opcional, ciudad opcional, experiencia, respuestas y resultados.
- Transferencias y encargados: Supabase (infraestructura) y proveedor SMTP; evaluar ubicación y transferencias internacionales.
- Medio para ejercer derechos ARCO, revocar consentimiento y consultar cambios.
- Plazo de conservación y procedimiento de eliminación.
- Política de privacidad pública con versión y fecha.

Tras aprobar el texto, habilitar el formulario que inserte adn_participants con privacy_accepted_at y privacy_version; confirmar RLS y pruebas de aislamiento con dos cuentas.

La página de diagnóstico conserva un modo de prueba sin guardado para quienes no tengan perfil.
