"""Idempotent shared metadata and crawlability pass for marketing/blog pages."""
from pathlib import Path
from html import escape
import json,re
ROOT=Path(__file__).resolve().parents[1];BASE='https://socioestrategico.pro/'
root_pages=['index.html','consultoria-de-negocios.html','inteligencia-en-marketing.html','estrategia-comercial.html','platicas-y-workshops.html']
paths=[ROOT/f for f in root_pages]+list((ROOT/'blog').glob('*.html'))
for path in paths:
 s=path.read_text();rel=path.relative_to(ROOT).as_posix();url=BASE+('' if rel=='index.html' else 'blog/' if rel=='blog/index.html' else rel)
 title=re.search(r'<title>(.*?)</title>',s).group(1)
 desc=re.search(r'<meta name="description" content="([^"]*)"',s).group(1)
 s=s.replace('styles.css?v=4','styles.css?v=5').replace('servicios.css?v=2','servicios.css?v=3')
 def tag(name,content):
  global s
  s=re.sub(r'<meta name="'+re.escape(name)+r'"[^>]*>','',s)
  s=s.replace('</head>',f'<meta name="{name}" content="{content}"></head>')
 if 'property="og:site_name"' not in s:s=s.replace('</head>','<meta property="og:site_name" content="Socio Estratégico"></head>')
 tag('robots','index,follow,max-image-preview:large')
 tag('twitter:card','summary');tag('twitter:title',title);tag('twitter:description',desc)
 def schema(m):
  d=json.loads(m.group(1));graph=d['@graph']
  for n in graph:
   if n.get('@type')=='Organization':
    n['founder']={'@id':BASE+'#miguel-angel-meza'}
    n['description']='Consultoría de negocios e inteligencia en marketing desde Ciudad de México, con enfoque en el mercado mexicano.'
   if n.get('@type')=='Service':
    n['description']=re.sub('<[^>]+>','',re.search(r'<p class="lead">(.*?)</p>',s).group(1))
   if n.get('@type')=='Person':n['url']=BASE+'#sobre-mi'
  if not any(n.get('@type')=='Person' for n in graph):graph.append({'@type':'Person','@id':BASE+'#miguel-angel-meza','name':'Miguel Ángel Meza','url':BASE+'#sobre-mi','sameAs':['https://www.linkedin.com/in/miguel-angel-meza/']})
  if not any(n.get('@type')=='WebSite' for n in graph):graph.append({'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':'Socio Estratégico','inLanguage':'es-MX','publisher':{'@id':BASE+'#organizacion'}})
  if rel in root_pages[1:]:
   if not any(n.get('@type')=='BreadcrumbList' for n in graph):graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio','item':BASE},{'@type':'ListItem','position':2,'name':title.split(' | ')[0],'item':url}]})
  return '<script type="application/ld+json">'+json.dumps(d,ensure_ascii=False).replace('<','\\u003c')+'</script>'
 s=re.sub(r'<script type="application/ld\+json">(.*?)</script>',schema,s)
 # Reserve layout for the existing square brand marks.
 s=re.sub(r'<img\b[^>]*>',lambda m:m.group(0) if 'width=' in m.group(0) or 'socio-estrategico-logo.svg' not in m.group(0) else m.group(0)[:-1]+' width="64" height="64" decoding="async">',s)
 if rel in root_pages[1:] and 'service-breadcrumb' not in s:
  s=s.replace('<main class="shell">','<main class="shell"><nav class="service-breadcrumb" aria-label="Ruta"><a href="/">Inicio</a> / '+title.split(' | ')[0]+'</nav>',1)
 if rel=='index.html':
  if 'id="contenido"' not in s:s=s.replace('<main>','<main id="contenido">',1)
  if 'class="skip-link"' not in s:s=s.replace('<body class="service-home">','<body class="service-home"><a class="skip-link" href="#contenido">Ir al contenido</a>',1)
  if 'class="mobile-menu"' not in s:
   menu='<details class="mobile-menu"><summary>Menú</summary><div class="mobile-links"><a href="/#servicios">Servicios</a><a href="/consultoria-de-negocios.html">Consultoría de negocios</a><a href="/inteligencia-en-marketing.html">Inteligencia en marketing</a><a href="/estrategia-comercial.html">Estrategia comercial</a><a href="/platicas-y-workshops.html">Pláticas y workshops</a><a href="/blog/">Ideas para decidir · Blog</a><a href="/#sobre-mi">Miguel Ángel Meza</a><a href="/#contacto">Contacto</a></div></details>'
   s=s.replace('    </nav>\n  </header>','    </nav>'+menu+'\n  </header>',1)
 path.write_text(s)
print('Optimized',len(paths),'public pages')
