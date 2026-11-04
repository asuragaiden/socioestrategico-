# Plan de captación de clientes potenciales de seguros
**Socio Estratégico · versión 0.1 · 3 de noviembre de 2026**

## 1. Propuesta de valor y CTA
- **Título:** Protege lo importante. Empieza por entender tus opciones.
- **Promesa:** Diagnóstico inicial sin costo, con orientación personal y sin obligación de contratar.
- **Ruta de conversión:** anuncio orgánico/pagado → `/proteccion.html?utm_source=meta|google|tiktok...` → cuestionario → endpoint seguro → CRM → contacto → sesión diagnóstica → propuesta → póliza o descarte.
- **No** prometer aceptación, rendimientos, beneficios universales, coberturas concretas ni ahorros garantizados.

## 2. Formulario de dos pasos (landing)
**Paso 1, intención y perfil no sensible:** 1) objetivo de protección, 2) presupuesto mensual por rangos, 3) ventana temporal de decisión, 4) rango de edad.  
**Paso 2, contacto:** 5) nombre, 6) celular/WhatsApp obligatorio, 7) email opcional, 8) preferencia de contacto, 9) género opcional (no usar para lead scoring), 10) ciudad opcional, 11) confirmación 18+, 12) consentimiento para atender solicitud obligatorio, 13) consentimiento comercial adicional opcional y sin premarcar.
- **Excluir** datos bancarios, ingresos exactos, estado de salud, enfermedades, beneficiarios, domicilio particular y CURP/RFC en captación inicial.
- **UTM:** source, medium, campaign, content y term. No pasar teléfono, correo, nombre ni presupuesto a parámetros de anuncio/URL ni a eventos analíticos.
- Recomendación: teléfono obligatorio y email opcional para mejorar tasa de terminación; email obligatorio solo si selecciona contacto por correo.

## 3. Lead calificado y priorización
**Objetivo comercial, no compromiso publicitario:** CPL calificado de **$80–$120 MXN**, a comprobar con datos.  
Un lead calificado: mayor de edad; consentimiento y móvil válidos; interés concreto; rango de presupuesto **≥ $1,000 MXN/mes**; ventana de decisión en **≤ 3 meses**; puntuación **≥ 70/100**, sin señales de duplicación o bot. El score es operativo, no decisión de elegibilidad aseguradora.
- **Caliente:** ≥ 80 y ventana esta semana / este mes. Intentar contacto en horario comercial el mismo día hábil; seguimiento 24–48 h si no responde.
- **Templado:** 70–79; intentar contacto en el siguiente día hábil.
- **Exploratorio / nutrición:** < 70 o presupuesto sin definir; ofrecer contenido útil solo con consentimiento promocional, y seguimiento exclusivamente ligado a la solicitud mientras siga vigente.
- **Canal sugerido:** WhatsApp Business con mensaje contextual, sin envíos masivos no solicitados.
- **CPLQ** = gasto atribuible / leads realmente calificados. Mostrar también tasa de contacto, citas, asistencia, propuestas, cierres y CAC por póliza. Lead enviado ≠ lead calificado.

## 4. CRM y pipeline
Reutilizar proyecto Supabase **Socio estrategico** y su política de acceso administrativo. **No mezclar** asesores participantes del programa ADN con prospectos de aseguramiento: crear tablas `insurance_leads` y `insurance_lead_activities` con permisos de admin.  
Etapas: nuevo → contactado → calificado → cita → propuesta → cerrado / no viable.  
Campos comerciales: canal + campaña, fecha de recepción, clasificación, prioridad, score, estatus, responsable, notas mínimas, fecha de siguiente actividad, historial; consentimiento y versión auditables. Añadir exportación sólo para admin, anonimización, bajas y retención definida antes del go-live.

## 5. Estrategia multicanal
**Piloto sugerido: 14 días con $450 MXN diarios, $6,300 MXN en total**, si ese presupuesto es viable.
- **Meta: 60% ($3,780 en 14 días)**. Dos hipótesis creativas: familia/ingresos y retiro/ahorro. Meta exige revisar la categoría de anuncio especial relacionada con productos/servicios financieros, sus restricciones por país y los límites de segmentación antes de activar. Conversiones deben configurarse únicamente sobre datos permitidos.
- **Google Ads Search: 40% ($2,520)**. Captar demanda activa con grupos semánticos «asesoría seguro de vida», «protección familiar», etc.; negativos para empleo, siniestros, reclutamiento y atención al cliente cuando aplique. Revisar verificaciones y disclosures exigidos a anunciantes financieros.
- **TikTok: contenido orgánico en piloto**, probar anuncios pagados al disponer de suficiente presupuesto por conjunto de anuncios y tras verificar autorización. La política 2026 de TikTok permite servicios de seguros en México bajo condiciones de licencias, descargos y audiencia 18+.
- Rebalancear a partir de **CPLQ, citas celebradas y costo por póliza**, no por clic barato. TikTok no debe absorber presupuesto solo para «estar en todas partes».

**Escenarios de planeación, no pronósticos:** 6,300 / 120 = 52.5; 6,300 / 80 = 78.75. Es decir, alcanzar el CPLQ objetivo en todo el gasto implicaría aproximadamente **52–79 leads calificados**, sin garantía de viabilidad.

## 6. Copys A/B (sin atribuir características personales al espectador)
- **Creativo A:** «Hay muchas formas de proteger el futuro de una familia. Empecemos por las preguntas correctas. Solicita un diagnóstico inicial sin costo».
- **Creativo B:** «Un plan de protección comienza con prioridades claras y un presupuesto realista. Conoce alternativas en una asesoría personal».
- **Google RSA:** «Asesoría de protección personal», «Explora alternativas de seguro de vida», «Diagnóstico inicial sin costo». No afirmar precios o coberturas sin soporte.

## 7. Checklist antes de recibir datos o invertir en medios
1. Definir y publicar aviso de privacidad **definitivo** y responsable/domicilio adecuado; confirmar contratos y transferencias; proceso ARCO, revocación y conservación.
2. Reactivar Supabase existente con autorización y revisar estado de proyecto, tablas/roles, alertas de seguridad y RLS. **No desplegar** SQL sin inspección en instancia activa.
3. Migrar `PROTECCION-CRM-SETUP.sql`, verificar RLS con dos roles: anon sin acceso, admin con acceso.
4. Configurar Cloudflare Turnstile, Edge Function `insurance-lead` con claves **solo servidor**, validación de consentimiento y rate-limiting WAF, pruebas end-to-end, alta, duplicados y error handling.
5. Sustituir `PENDIENTE` por versión legal vigente, completar URL del endpoint y public site key en `proteccion.js`, dejar `enabled:true` **sólo tras pruebas**.
6. Autenticación del CRM privado con sesión y rol `adn_is_admin()`; conectar listado, ficha, notas y siguiente tarea. El HTML actual es **demo con registros inventados**.
7. Medir evento de inicio y `lead_submit_success` solamente tras respuesta positiva del servidor, **sin PII**. Confirmar consentimiento para etiquetas publicitarias según corresponda.
8. Validar creativos, segmentación y acreditaciones para cada plataforma y requisitos de publicidad de la aseguradora o promotoría.

## 8. Estado técnico al 3 nov 2026
- Landing responsive y flujo 2 pasos: **prototipo en rama de revisión**.
- Formulario **sin captación de datos**, `enabled:false` (deliberado).
- CRM: **prototipo con registros ficticios**.
- SQL y Edge Function: **código preparado, no ejecutado ni desplegado**.
- Supabase: proyecto identificado **INACTIVE**.
- Aviso específico de captación: **borrador pendiente**.

## 9. Referencias de cumplimiento verificadas
- México, LFPDPPP vigente, DOF 20/03/2025, reforma 14/11/2025: https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf
- TikTok Financial Services, actualización septiembre 2026: https://ads.tiktok.com/resources/help/article/tiktok-ads-policy-financial-services?lang=es-419
- Google Ads, Financial products and services disclosures: https://support.google.com/adspolicy/answer/15187149
- Google Ads, advertiser verification: https://support.google.com/adspolicy/answer/9703665
- Cloudflare Turnstile en Supabase Edge Functions: https://supabase.com/docs/guides/functions/examples/cloudflare-turnstile
