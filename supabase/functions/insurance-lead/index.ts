// Supabase Edge Function: public inbound leads, designed to be deployed only after
// legal/privacy approval, DB migration, Turnstile configuration, and integration tests.
// Required secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
// CLOUDFLARE_TURNSTILE_SECRET, PROTECCION_PRIVACY_VERSION.
// Never place the service-role key in public HTML/JS.
const allowedOrigins = new Set(["https://socioestrategico.pro", "https://www.socioestrategico.pro"]);
const allowedHosts = new Set(["socioestrategico.pro", "www.socioestrategico.pro"]);
const objectives = new Set(["familia","ingresos","retiro","educacion","patrimonio","empresa","explorar"]);
const budgets = new Set(["menos_500","500_999","1000_1999","2000_3999","4000_mas","por_definir"]);
const timeframes = new Set(["esta_semana","este_mes","tres_meses","explorando"]);
const ages = new Set(["18_24","25_34","35_44","45_54","55_64","65_mas"]);
const genders = new Set(["mujer","hombre","otra"]);
const channels = new Set(["whatsapp","llamada","email"]);
const clean = (value:unknown,max:number) => typeof value === "string" ? value.trim().slice(0,max) : "";
const json = (payload:unknown,status:number,origin:string) => new Response(JSON.stringify(payload),{
 status,headers:{"Content-Type":"application/json","Cache-Control":"no-store","Access-Control-Allow-Origin":origin,"Vary":"Origin"}
});
const fail = (message:string,status:number,origin:string) => json({error:message},status,origin);
Deno.serve(async (request)=>{
 const origin=request.headers.get("origin")||"";
 if(!allowedOrigins.has(origin))return new Response(null,{status:403});
 const cors={"Access-Control-Allow-Origin":origin,"Access-Control-Allow-Headers":"content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Vary":"Origin"};
 if(request.method==="OPTIONS")return new Response(null,{status:204,headers:cors});
 if(request.method!=="POST")return fail("Método no permitido",405,origin);
 const url=Deno.env.get("SUPABASE_URL");
 const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
 const secret=Deno.env.get("CLOUDFLARE_TURNSTILE_SECRET");
 const privacy=Deno.env.get("PROTECCION_PRIVACY_VERSION");
 if(!url||!key||!secret||!privacy||privacy==="PENDIENTE")return fail("Servicio no disponible",503,origin);
 let data:Record<string,unknown>;
 try{const body=await request.text();if(body.length>12000) return fail("Solicitud demasiado grande",413,origin);const parsed=JSON.parse(body);if(!parsed||Array.isArray(parsed)||typeof parsed!=="object")return fail("Solicitud inválida",400,origin);data=parsed}
 catch{return fail("Solicitud inválida",400,origin)}
 const full_name=clean(data.full_name,100),rawphone=clean(data.phone,25);
 const phone=rawphone.replace(/\D/g,"").replace(/^52(?=\d{10}$)/,"");
 const email=clean(data.email,150).toLowerCase(),city=clean(data.city,80);
 const objective=clean(data.objective,30),budget=clean(data.budget,30),timeframe=clean(data.timeframe,30);
 const age_range=clean(data.age_range,30),contact_method=clean(data.contact_method,30),gender=clean(data.gender,30);
 if(full_name.length<3||!/^[0-9]{10}$/.test(phone)||!objectives.has(objective)||!budgets.has(budget)||!timeframes.has(timeframe)||!ages.has(age_range)||!channels.has(contact_method)||!!gender&&!genders.has(gender)||!!email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||contact_method==="email"&&!email||data.adult!==true||data.contact_consent!==true||data.consent_version!==privacy)return fail("Verifica los datos y el consentimiento",400,origin);
 const token=clean(data.turnstile_token,3000);
 if(token.length<10)return fail("Falta validación antispam",400,origin);
 const ip=request.headers.get("cf-connecting-ip")||"";
 const captcha=new FormData();captcha.append("secret",secret);captcha.append("response",token);
 if(ip)captcha.append("remoteip",ip);
 let captchaOK=false;
 try{
  const verification=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",body:captcha,signal:AbortSignal.timeout(9000)});
  const v=await verification.json() as {success?:boolean;hostname?:string};
  captchaOK=verification.ok&&v.success===true&&allowedHosts.has(v.hostname||"");
 }catch{captchaOK=false}
 if(!captchaOK)return fail("No fue posible verificar la solicitud",400,origin);
 const budgetScore:Record<string,number>={menos_500:0,500_999:10,1000_1999:23,2000_3999:30,4000_mas:35,por_definir:3};
 const timeScore:Record<string,number>={esta_semana:25,este_mes:20,tres_meses:10,explorando:3};
 const score=Math.min(100,budgetScore[budget]+timeScore[timeframe]+(objective==="explorar"?2:15)+10+(email?5:0)+10);
 const qualified=score>=70&&["1000_1999","2000_3999","4000_mas"].includes(budget)&&timeframe!=="explorando"&&objective!=="explorar";
 const utm=(data.utm && typeof data.utm==="object" && !Array.isArray(data.utm)?data.utm:{}) as Record<string,unknown>;
 const source=clean(utm.utm_source,100)||"directo";
 const row={
  full_name,phone,email:email||null,city:city||null,objective,budget,timeframe,age_range,gender:gender||null,
  contact_method,contact_consent:true,marketing_opt_in:data.marketing_opt_in===true,
  consent_version:privacy,source,
  utm_source:clean(utm.utm_source,100)||null,utm_medium:clean(utm.utm_medium,100)||null,
  utm_campaign:clean(utm.utm_campaign,100)||null,utm_content:clean(utm.utm_content,100)||null,
  utm_term:clean(utm.utm_term,100)||null,lead_score:score,is_qualified:qualified,
  stage:qualified?"calificado":"nuevo"
 };
 try{
  const saved=await fetch(url+"/rest/v1/insurance_leads",{
    method:"POST",headers:{"apikey":key,"Authorization":"Bearer "+key,"Content-Type":"application/json","Prefer":"return=minimal"},
    body:JSON.stringify(row),signal:AbortSignal.timeout(9000)
  });
  if(!saved.ok)return fail("No se pudo registrar la solicitud",503,origin);
 }catch{return fail("No se pudo registrar la solicitud",503,origin)}
 return json({ok:true},201,origin);
});