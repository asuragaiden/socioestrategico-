/* Socio Estratégico — Meta Pixel. Verify consent requirements before activation. */
(function(w,d){
 if(w.fbq)return;
 var n=w.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
 if(!w._fbq)w._fbq=n;n.push=n;n.loaded=true;n.version='2.0';n.queue=[];
 var s=d.createElement('script');s.async=true;s.src='https://connect.facebook.net/en_US/fbevents.js';
 var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);
 fbq('init','232215027683633');fbq('track','PageView');
 w.dataLayer=w.dataLayer||[];
 var oldPush=w.dataLayer.push;
 w.dataLayer.push=function(){for(var i=0;i<arguments.length;i++){var e=arguments[i];if(e&&e.event==='mapa_diagnostico_completado'){fbq('track','Lead',{content_name:'MAPA',content_category:'proteccion_financiera'});}}return oldPush.apply(this,arguments);};
})(window,document);
