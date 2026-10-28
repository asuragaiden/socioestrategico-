# Ideas para decidir · Socio Estratégico

## Objetivo
Atraer conversaciones pertinentes con líderes y equipos de negocios en México. El blog complementa las páginas de consultoría, inteligencia en marketing, estrategia comercial y pláticas y workshops.

## Cadencia inicial
Un borrador semanal, con revisión editorial antes de publicar. La tarea programada entrega borradores al usuario; no publica automáticamente. No es necesario cumplir una cuota si no existe una pregunta útil o evidencia suficiente.

## Próximas seis entregas propuestas
1. Cómo preparar un brief de consultoría con información que ya tiene tu negocio.
2. Competencia en México: cómo distinguir datos, señales e hipótesis.
3. Tu propuesta de valor: preguntas para que el equipo la explique igual.
4. Cómo diseñar un workshop de estrategia que cierre con acuerdos.
5. Qué revisar cuando las consultas no avanzan a una propuesta.
6. Del análisis a la acción: cómo priorizar iniciativas de marketing.

## Criterios editoriales
- Español de México, sin páginas duplicadas por ciudad ni repetición artificial de palabras clave.
- Una pregunta de negocio por pieza, respuesta directa, método útil y enlace a un servicio relevante.
- Ejemplos hipotéticos identificados. Casos reales solo con hechos verificados y autorización pertinente.
- Fuentes primarias para datos y hechos actuales; indicar periodo, alcance y fecha de consulta.
- Autoría inicial: Equipo editorial de Socio Estratégico (Organization). No atribuir a Miguel experiencias o revisión que no haya aportado. La ficha enlaza a su perfil real.
- Usar «pláticas y workshops». No usar «conferencias» ni «conferencista».
- No prometer rankings, ventas ni recomendaciones de motores de IA.

## Publicación
1. Incorporar la pieza aprobada en `content/posts.json`, con slug único, título, descripción, categoría, fecha real, servicio relacionado, llamada a la acción, cuerpo HTML y fuentes.
2. Mantener `date` como fecha original; añadir `updated` solo tras una actualización sustancial. No poner fechas futuras para simular publicación.
3. Ejecutar `python scripts/build-blog.py`. Genera HTML estático, índice del blog, RSS y actualiza el sitemap conservando las URLs existentes.
4. Revisar el texto, enlaces, metadatos, móvil y escritorio. Comprobar que cualquier nueva URL existe y que JSON-LD coincide con el contenido visible.
5. Publicar los archivos generados junto con la fuente. El workflow existente de GitHub Pages despliega la raíz del repositorio.

## Medición
Separar audiencia por país y canal, lectura de páginas de servicio, clic a WhatsApp (`contact_intent`), consultas efectivamente recibidas y oportunidades pertinentes. Un clic no es una consulta enviada. El registro en dataLayer requiere etiquetas y eventos configurados en GTM/GA4 para aparecer en informes; no se ha verificado esa configuración. Search Console requiere acceso a la propiedad para comprobar indexación, consultas y país. No se han añadido datos de las capturas del usuario a los artículos públicos.
