
const EMAILJS_CONFIG = Object.freeze({
  publicKey: "RUDxylloglyAFjYsA",
  serviceId: "service_wgfjylq",
  templateId: "template_u2v0m4o",
  ownerEmail: "aureaapartments03@gmail.com"
});
if (typeof emailjs !== "undefined") emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });


(() => {
const steps=[...document.querySelectorAll(".step")], dots=[...document.querySelectorAll(".dot")], form=document.getElementById("form");let current=1;
let pendingDelivery=null;
let lastEmailAttemptAt=0;
const $=id=>document.getElementById(id);
function show(n){
  current=n;
  steps.forEach(s=>s.classList.toggle("active",+s.dataset.step===n));
  dots.forEach((d,i)=>{
    d.classList.toggle("active",i<n);
    const item=d.closest(".progress-item");
    item.classList.toggle("active",i<n);
    if(i===n-1)item.setAttribute("aria-current","step");else item.removeAttribute("aria-current");
    d.textContent=i<n-1?"✓":String(i+1);
  });
  $("stepCounter").innerHTML=String(n).padStart(2,"0")+' <span>/ 04</span>';
  if(n===3)summary();
  if(n===2)renderVisitPreview();
  const heading=document.querySelector('.step.active h2');
  heading?.focus({preventScroll:true});
  const target=$("solicitud");
  if(target.getBoundingClientRect().top<0 || window.innerWidth<=700)target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
function valid(n){
 const step=steps.find(x=>+x.dataset.step===n);
 for(const field of step.querySelectorAll("input[required],select[required]")){
   if(field.type!=="checkbox" && field.type!=="radio" && !field.value.trim())field.setCustomValidity("Completa este campo para continuar.");else field.setCustomValidity("");
   if(!field.checkValidity()){
     if(current!==n)show(n);
     field.setAttribute("aria-invalid","true");field.reportValidity();return false;
   }
   field.removeAttribute("aria-invalid");
 }
 return true;
}
form.addEventListener('input',event=>{event.target.setCustomValidity?.('');event.target.removeAttribute('aria-invalid');});
form.addEventListener('change',event=>{event.target.setCustomValidity?.('');event.target.removeAttribute('aria-invalid');});
$("editVisit").addEventListener('click',()=>show(1));
document.querySelector('.progress-item.active').setAttribute('aria-current','step');

function formatVisitDate(value){
 if(!value)return '';
 return new Date(value+'T12:00:00').toLocaleDateString('es',{day:'numeric',month:'long',year:'numeric'});
}
function renderVisitPreview(){
 $('visitPreview').innerHTML='<div><span>TU VISITA, EN RESUMEN</span><strong>'+esc($('property').value)+'</strong><small>'+esc(formatVisitDate($('date').value))+' · '+esc($('time').value)+'</small></div><button type="button" id="changeVisit" aria-label="Cambiar los datos de la visita">↗</button>';
 $('changeVisit').onclick=()=>show(1);
}
document.querySelectorAll('[data-date-offset]').forEach(button=>{
 button.onclick=()=>{
  const date=new Date();date.setDate(date.getDate()+Number(button.dataset.dateOffset));
  const value=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
  $('date').value=value;$('date').setCustomValidity('');$('date').removeAttribute('aria-invalid');
  $('date').dispatchEvent(new Event('change',{bubbles:true}));
 };
});
function updateDateShortcuts(){document.querySelectorAll('[data-date-offset]').forEach(button=>{
 const date=new Date();date.setDate(date.getDate()+Number(button.dataset.dateOffset));
 const expected=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
 button.setAttribute('aria-pressed',String($('date').value===expected));
});}
$('date').addEventListener('change',updateDateShortcuts);
updateDateShortcuts();

function esc(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function summary(){$("summary").innerHTML=`<div class="row"><span>Cliente</span><b>${esc($("name").value)}</b></div><div class="row"><span>Propiedad</span><b>${esc($("property").value)}</b></div><div class="row"><span>Fecha</span><b>${esc($("date").value)}</b></div><div class="row"><span>Hora</span><b>${esc($("time").value)}</b></div>`}
function finalSummary(ref){$("finalSummary").innerHTML=`<div class="row"><span>Cliente</span><b>${esc($("name").value)}</b></div><div class="row"><span>Propiedad</span><b>${esc($("property").value)}</b></div><div class="row"><span>Fecha</span><b>${esc($("date").value)}</b></div><div class="row"><span>Hora</span><b>${esc($("time").value)}</b></div><div class="row"><span>Referencia</span><b>${esc(ref)}</b></div>`}
document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>{if(valid(current))show(+b.dataset.next)}));
document.querySelectorAll(".back").forEach(b=>b.addEventListener("click",()=>show(Math.max(1,current-1))));
form.addEventListener("submit",async e=>{
e.preventDefault();
if(!valid(1)||!valid(2)||!valid(3))return;
const selected=document.querySelector('input[name="payment"]:checked');
if(!selected){document.getElementById("p_zelle").reportValidity();return;}
const submitBtn=$("submitBtn");
const emailStatus=$("emailStatus");
if(submitBtn.disabled)return;
emailStatus.style.display="none";
submitBtn.disabled=true;form.classList.add("is-sending");
submitBtn.textContent="Enviando solicitud...";
const id="VIS-"+Date.now().toString().slice(-8);$("ref").textContent="Referencia "+id;
const issued=new Date();
const fingerprint=JSON.stringify(["property","date","time","name","phone","email","pets"].map(key=>$(key).value.trim()).concat(selected.value));
if(!pendingDelivery || pendingDelivery.fingerprint!==fingerprint){
  pendingDelivery={fingerprint,invoiceNo:"AUR-"+Date.now().toString().slice(-8),ownerSent:false,customerSent:false};
}
const invoiceNo=pendingDelivery.invoiceNo;
const issuedDate=issued.toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});
const visitDate=new Date($("date").value+"T12:00:00");
const visitDateText=visitDate.toLocaleDateString("es-DO",{year:"numeric",month:"long",day:"numeric"});
$("ref").textContent="Referencia · "+invoiceNo;
$("receipt").innerHTML=`
<div class="invoice">
  <div class="invoice-head">
    <div class="invoice-brand"><img src="${document.querySelector(".logo-img").src}" alt="Aurea Apartments"><div><strong>Aurea Apartments</strong><span>Solicitud de visita y depósito pendiente</span></div></div>
    <div class="invoice-title"><div class="label">Documento</div><h3>SOLICITUD</h3><span class="status">PAGO PENDIENTE · CITA NO CONFIRMADA</span></div>
  </div>
  <div class="invoice-meta">
    <div class="meta-box"><small>Referencia de la solicitud</small><strong>${invoiceNo}</strong></div>
    <div class="meta-box"><small>Fecha de emisión</small><strong>${issuedDate}</strong></div>
    <div class="meta-box"><small>Cliente</small><strong>${esc($("name").value)}<br>${esc($("phone").value)}</strong></div>
    <div class="meta-box"><small>Propiedad</small><strong>${esc($("property").value)}</strong></div>
  </div>
  <div class="invoice-table">
    <div class="thead"><div>Descripción</div><div class="num">Cantidad</div><div class="num">Importe</div></div>
    <div class="item"><div class="desc"><strong>Depósito de confirmación de visita</strong><span>Visita programada: ${visitDateText} · ${esc($("time").value)}</span><span>Método indicado: ${esc(selected.value)} · Reembolsable</span></div><div class="num">1</div><div class="num"><strong>$170.00</strong></div></div>
  </div>
  <div class="invoice-totals">
    <div class="total-row"><span>Subtotal</span><strong>$170.00</strong></div>
    <div class="total-row"><span>Impuestos</span><strong>$0.00</strong></div>
    <div class="total-row grand"><span>Total indicado</span><strong>$170.00</strong></div>
  </div>
  <div class="invoice-foot">
    <div><small>Condición</small><p>Depósito de confirmación de $170. Si decides no continuar con el proceso de alquiler, los $170 serán reembolsados. Si decides continuar, los $170 se agregarán al depósito del primer mes de renta. La cita se confirma después de recibir y verificar el pago.</p></div>
    <div><small>Estado del documento</small><p>Documento de solicitud. No constituye comprobante de pago. El pago de $170 queda pendiente y debe completarse directamente con nosotros.</p></div>
  </div>
  <div class="invoice-note"><strong>Importante:</strong> el monto de $170.00 es el depósito de confirmación indicado en la solicitud. Si decides no continuar con el proceso de alquiler, los $170.00 serán reembolsados. Si decides continuar, los $170.00 se agregarán al depósito del primer mes de renta. El sistema no procesa ningún cobro en esta etapa. Contacta con nosotros para completar el pago y confirmar la cita.</div>
</div>`;
const msg=`Hola, mi nombre es ${$("name").value}. Ya completé mi solicitud de visita para ${$("property").value} el ${visitDateText} a las ${$("time").value}. Mi referencia es ${invoiceNo}. Seleccioné ${selected.value} como método de pago y quiero completar el pago de $170 para confirmar la cita.`;
$("contactMessage").textContent=msg;
$("waBtn").href="https://wa.me/?text="+encodeURIComponent(msg);
$("copyBtn").onclick=async()=>{try{await navigator.clipboard.writeText(msg);$("copyBtn").textContent="Mensaje copiado ✓";setTimeout(()=>$("copyBtn").textContent="Copiar mensaje",1800)}catch(e){alert(msg)}};

const clientEmail=$("email").value.trim();
const customerMessage=`Hola ${$("name").value},

Hemos recibido correctamente tu solicitud de visita en Aurea Apartments.

DATOS DE TU SOLICITUD
Propiedad: ${$("property").value}
Fecha solicitada: ${visitDateText}
Hora solicitada: ${$("time").value}
Referencia: ${invoiceNo}

DEPÓSITO
Monto: $170.00
Estado: PENDIENTE DE CONFIRMACIÓN

Tu solicitud está siendo revisada. La visita quedará confirmada una vez que el depósito sea recibido y verificado.

Si necesitas ayuda o deseas consultar el estado de tu solicitud, puedes responder a este correo.

Saludos,
Aurea Apartments`;

const templateParams={
  to_email:EMAILJS_CONFIG.ownerEmail,
  name:$("name").value,
  email:clientEmail,
  reply_to:EMAILJS_CONFIG.ownerEmail,
  phone:$("phone").value,
  pets:$("pets").value,
  property:$("property").value,
  visit_date:visitDateText,
  visit_time:$("time").value,
  payment:selected.value,
  reference:invoiceNo,
  deposit:"$170.00",
  status:"PENDIENTE DE CONFIRMACIÓN",
  subject:"Aurea Apartments | Solicitud "+invoiceNo,
  email_heading:"Tu solicitud de visita",
  email_intro:"Recibimos tu solicitud. Aquí encontrarás los datos que compartiste y las condiciones para coordinar la visita.",
  email_preheader:"Solicitud "+invoiceNo+" recibida. Visita y depósito pendientes de confirmación.",
  recipient_name:$("name").value.trim(),
  next_step_title:"El siguiente paso",
  next_step_text:"Retoma la conversación con el asesor que te atendió y comparte tu referencia para coordinar las instrucciones de pago. La visita se confirma después de recibir y verificar el depósito.",
  message:customerMessage
};
try{
  // Enviar el mismo registro a Aurea Apartments y, por separado, al correo del cliente.
  // El template de EmailJS debe tener el campo "To" configurado como {{to_email}}.
  const ownerParams={
    ...templateParams,
    to_email:EMAILJS_CONFIG.ownerEmail,
    reply_to:clientEmail,
    subject:"Aurea Apartments | Nueva solicitud "+invoiceNo,
    email_heading:"Nueva solicitud de visita",
    email_intro:"Una persona completó el formulario de visitas. Revisa sus datos y coordina el seguimiento de la solicitud.",
    email_preheader:"Nueva solicitud "+invoiceNo+" · "+$("property").value.trim(),
    recipient_name:"Equipo de Aurea Apartments",
    next_step_title:"Seguimiento de la solicitud",
    next_step_text:"Contacta al solicitante para coordinar las instrucciones del depósito. La visita continúa pendiente hasta recibir y verificar el pago.",
    message:`NUEVA SOLICITUD DE VISITA

Cliente: ${$("name").value}
Correo: ${clientEmail}
Teléfono: ${$("phone").value}
Mascotas: ${$("pets").value}
Propiedad: ${$("property").value}
Fecha: ${visitDateText}
Hora: ${$("time").value}
Método de pago indicado: ${selected.value}
Referencia: ${invoiceNo}
Depósito indicado: $170.00
Estado: PENDIENTE DE CONFIRMACIÓN`
  };

  const customerParams={
    ...templateParams,
    to_email:clientEmail,
    reply_to:EMAILJS_CONFIG.ownerEmail,
    subject:"Aurea Apartments | Solicitud "+invoiceNo,
  email_heading:"Tu solicitud de visita",
  email_intro:"Recibimos tu solicitud. Aquí encontrarás los datos que compartiste y las condiciones para coordinar la visita.",
  email_preheader:"Solicitud "+invoiceNo+" recibida. Visita y depósito pendientes de confirmación.",
  recipient_name:$("name").value.trim(),
  next_step_title:"El siguiente paso",
  next_step_text:"Retoma la conversación con el asesor que te atendió y comparte tu referencia para coordinar las instrucciones de pago. La visita se confirma después de recibir y verificar el depósito.",
    message:customerMessage
  };

  if(typeof emailjs === "undefined") throw new Error("No se pudo cargar EmailJS. Revisa tu conexión o el bloqueo del CDN.");
  async function sendRecipient(params){
    // EmailJS allows one request per second. Keep retries on the same schedule.
    const delay=Math.max(0,1200-(Date.now()-lastEmailAttemptAt));
    if(delay) await new Promise(resolve=>setTimeout(resolve,delay));
    lastEmailAttemptAt=Date.now();
    const result=await emailjs.send(EMAILJS_CONFIG.serviceId,EMAILJS_CONFIG.templateId,params,{publicKey:EMAILJS_CONFIG.publicKey});
    if(result?.status!==200) throw {status:result?.status,text:result?.text||"Respuesta inesperada de EmailJS."};
    return result;
  }
  if(!pendingDelivery.ownerSent){
    await sendRecipient(ownerParams);
    pendingDelivery.ownerSent=true;
  }
  if(!pendingDelivery.customerSent){
    await sendRecipient(customerParams);
    pendingDelivery.customerSent=true;
  }

  submitBtn.disabled=false;form.classList.remove("is-sending"); submitBtn.textContent="Enviar solicitud de visita";
  finalSummary(invoiceNo);
  show(4);
}catch(error){
  console.error("EmailJS error:",error);
  submitBtn.disabled=false;form.classList.remove("is-sending"); submitBtn.textContent="Enviar solicitud de visita";
  const code=Number(error?.status)||0;
  const detail=String(error?.text||error?.message||"No se recibió una respuesta del servicio.").split(EMAILJS_CONFIG.ownerEmail).join("la administración").slice(0,350);
  const progress=pendingDelivery.ownerSent
    ? "La solicitud ya se envió a Aurea Apartments; falta enviar la copia al cliente. Al reintentar aquí se enviará únicamente la copia pendiente. "
    : "No se pudo enviar la solicitud a Aurea Apartments. ";
  const hint=code===429?"Espera unos segundos antes de reintentar. ":"";
  emailStatus.textContent=progress+hint+"Detalle"+(code?" ("+code+")":"")+": "+detail;
  emailStatus.style.display="block";
}
});
$("printBtn").addEventListener("click",()=>window.print());$("newBtn").addEventListener("click",()=>{form.reset();updateDateShortcuts();pendingDelivery=null;$("receipt").replaceChildren();$("finalSummary").replaceChildren();show(1)});
const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());$("date").min=d.toISOString().slice(0,10);
})();
