(() => {
 const root=document.documentElement;
 const button=document.getElementById('theme-toggle');
 const key='socioestrategico-theme';
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 let stored=null;
 try{stored=localStorage.getItem(key)}catch(e){}
 const apply=(mode)=>{root.dataset.theme=mode; if(button){button.setAttribute('aria-label',mode==='dark'?'Cambiar a modo claro':'Cambiar a modo oscuro');button.setAttribute('aria-pressed',String(mode==='dark'));button.querySelector('.theme-toggle-icon').textContent=mode==='dark'?'☀':'☾';button.querySelector('.theme-toggle-label').textContent=mode==='dark'?'Claro':'Oscuro';}const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=mode==='dark'?'#101b2b':'#172C49';};
 apply(stored==='light'||stored==='dark'?stored:(system.matches?'dark':'light'));
 button?.addEventListener('click',()=>{root.classList.add('theme-animate');const mode=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,mode)}catch(e){}apply(mode)});
 system.addEventListener?.('change',e=>{let choice=null;try{choice=localStorage.getItem(key)}catch(err){}if(choice!=='light'&&choice!=='dark')apply(e.matches?'dark':'light')});
})();
