"use strict";
// Seguridad por defecto: no activar hasta publicar aviso definitivo, probar backend y anti-bot.
const CONFIG = Object.freeze({ enabled: false, endpoint: "", turnstileSiteKey: "", privacyVersion: "PENDIENTE" });
const form=document.getElementById("lead-form");
const first=document.getElementById("step-1"),second=document.getElementById("step-2");
const feedback=document.getElementById("form-feedback"), submit=document.getElementById("submit-lead");
const startedAt=Date.now();let turnstileWidget=null;
function msg(message,isError=true){feedback.textContent=message;feedback.className=isError?"error":"ok"}
function step(n){first.hidden=n!==1;second.hidden=n!==2;document.getElementById("progress-fill").style.width=n===1?"50%":"100%";document.getElementById("step-title").textContent=n===1?"01. ¿Qué es importante para ti?":"02. ¿Cómo podemos hablar?";document.getElementById("step-desc").textContent=n===1?"Responde tres preguntas para orientar la conversación.":"Solo usaremos tus datos para atender tu solicitud, conforme al aviso de privacidad.";msg("");if(n===2)document.getElementById("full_name").focus()}
function validStep1(){for(const el of first.querySelectorAll("[required]")){if(!el.checkValidity()){el.reportValidity();return false}}return true}
document.getElementById("next").addEventListener("click",()=>{if(validStep1())step(2)});
document.getElementById("back").addEventListener("click",()=>step(1));
function resetToken(){if(turnstileWidget!==null&&window.turnstile)window.turnstile.reset(turnstileWidget)}
function recordUtm(){const query=new URLSearchParams(location.search),allowed=["utm_source","utm_medium","utm_campaign","utm_content","utm_term"];const out={};for(const field of allowed){out[field]=(query.get(field)||"").slice(0,100)}return out}
function cleanPhone(v){const digits=v.replace(/\D/g,"");return digits.startsWith("52")&&digits.length===12?digits.slice(2):digits}
function validContact(){
  const phone=document.getElementById("phone"),email=document.getElementById("email"),method=document.getElementById("contact_method");
  phone.setCustomValidity(cleanPhone(phone.value).length===10?"":"Escribe un teléfono mexicano de 10 dígitos.");
  email.setCustomValidity(method.value==="email"&&!email.value.trim()?"Introduce un correo para que podamos contactarte por ese medio.":"");
  for(const el of second.querySelectorAll("input:not(.trap),select")){if(!el.checkValidity()){el.reportValidity();return false}}
  return true;
}
document.getElementById("phone").addEventListener("input",e=>e.target.setCustomValidity(""));
document.getElementById("email").addEventListener("input",e=>e.target.setCustomValidity(""));
async function activateCaptcha(){
 if(!CONFIG.enabled||!CONFIG.endpoint||!CONFIG.turnstileSiteKey){document.getElementById("mode-notice").hidden=false;submit.disabled=true;return}
 document.getElementById("mode-notice").hidden=true;submit.disabled=false;
 const script=document.createElement("script");script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";script.async=true;script.defer=true;
 script.onload=()=>{turnstileWidget=window.turnstile.render("#captcha",{sitekey:CONFIG.turnstileSiteKey,theme:"light"})};
 script.onerror=()=>{submit.disabled=true;msg("No fue posible cargar la verificación de seguridad.",true)};document.head.appendChild(script);
}
form.addEventListener("submit",async e=>{
 e.preventDefault();if(!CONFIG.enabled){msg("Esta es una vista previa. Todavía no recibimos datos; no se ha enviado nada.");return}
 if(!validStep1()){step(1);return}if(!validContact())return;
 if(document.getElementById("website").value||Date.now()-startedAt<3000){msg("No pudimos verificar la solicitud. Intenta nuevamente.");return}
 const token=window.turnstile&&turnstileWidget!==null?window.turnstile.getResponse(turnstileWidget):"";
 if(!token){msg("Completa la verificación de seguridad.");return}
 const values=Object.fromEntries(new FormData(form).entries());
 const payload={
  objective:values.objective,budget:values.budget,timeframe:values.timeframe,age_range:values.age_range,
  full_name:values.full_name.trim(),phone:cleanPhone(values.phone),
  email:(values.email||"").trim(),contact_method:values.contact_method,gender:values.gender||null,city:(values.city||"").trim(),
  adult:document.getElementById("adult").checked,contact_consent:document.getElementById("contact_consent").checked,
  marketing_opt_in:document.getElementById("marketing_opt_in").checked,
  consent_version:CONFIG.privacyVersion,turnstile_token:token,utm:recordUtm()
 };
 submit.disabled=true;msg("Enviando tu solicitud...",false);
 try{
  const response=await fetch(CONFIG.endpoint,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  if(!response.ok)throw Error("Error al registrar solicitud");
  form.reset();second.hidden=true;first.hidden=true;
  document.getElementById("step-title").textContent="Solicitud recibida";
  document.getElementById("step-desc").textContent="Gracias por compartir tus prioridades. Nos pondremos en contacto contigo para revisar tus opciones.";
  document.getElementById("mode-notice").hidden=true;msg("Tu solicitud se registró correctamente.",false);
 }catch(_){msg("No se pudo enviar. No consideres registrada tu solicitud; intenta nuevamente.",true);submit.disabled=false;resetToken()}
});
activateCaptcha();