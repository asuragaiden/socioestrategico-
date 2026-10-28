"""Build the static blog, RSS and public sitemap. Run from any working directory."""
from pathlib import Path
import json, re, html
from urllib.parse import quote
from datetime import date
from email.utils import format_datetime
from datetime import datetime, timezone
from xml.sax.saxutils import escape
ROOT=Path(__file__).resolve().parents[1]
BASE='https://socioestrategico.pro/'
posts=json.loads((ROOT/'content/posts.json').read_text())
assert len({p['slug'] for p in posts}) == len(posts), 'Duplicate slug'
for p in posts:
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',p['slug']), 'Invalid slug'
    date.fromisoformat(p['date'])
posts=sorted(posts,key=lambda p:p['date'],reverse=True)
org={'@type':'Organization','@id':BASE+'#organizacion','name':'Socio Estratégico','url':BASE,'logo':BASE+'socio-estrategico-logo.svg'}
def e(value): return html.escape(value,quote=True)
def head(title,description,url,extra):
    graph={'@context':'https://schema.org','@graph':[org]+extra}
    return f'''<!doctype html><html lang="es-MX"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{e(title)}</title><meta name="description" content="{e(description)}"><link rel="canonical" href="{url}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:url" content="{url}"><meta property="og:locale" content="es_MX"><meta property="og:type" content="{'article' if extra and extra[0]['@type']=='BlogPosting' else 'website'}"><link rel="icon" href="/socio-estrategico-logo.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&amp;display=swap"><link rel="stylesheet" href="/styles.css?v=5"><link rel="stylesheet" href="/claridad-digital.css?v=1"><link rel="stylesheet" href="/theme.css?v=1"><link rel="stylesheet" href="/servicios.css?v=3"><link rel="stylesheet" href="/blog/blog.css?v=1"><link rel="alternate" type="application/rss+xml" title="Ideas para decidir · Socio Estratégico" href="/blog/feed.xml"><script src="/contacto-analytics.js?v=1" defer></script><script type="application/ld+json">{json.dumps(graph,ensure_ascii=False).replace('<',chr(92)+'u003c')}</script>
<script>(function(w,d,s,l,i){{w[l]=w[l]||[];w[l].push({{'gtm.start':new Date().getTime(),event:'gtm.js'}});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);}})(window,document,'script','dataLayer','GTM-TNBPLRFQ');</script></head><body class="service-main editorial"><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TNBPLRFQ" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><a class="skip-link" href="#contenido">Ir al contenido</a><header class="nav"><a class="brand" href="/"><span class="brand-logo-wrap"><img class="brand-logo" src="/socio-estrategico-logo.svg" alt=""></span><span>SOCIO <b>ESTRATÉGICO</b></span></a><nav aria-label="Principal"><a href="/#servicios">Servicios</a><a href="/blog/">Ideas para decidir</a><a href="/platicas-y-workshops.html">Pláticas y workshops</a></nav></header>'''
def foot():return '<footer class="shell"><span>© 2026 Socio Estratégico · México</span><a href="/blog/">Todos los artículos</a><a href="/#contacto">Contacto</a></footer></body></html>'
def card(p):return f'<article class="editorial-card"><p class="micro">{e(p["category"])}</p><h2><a href="/blog/{p["slug"]}.html">{e(p["title"])}</a></h2><p>{e(p["description"])}</p><p class="article-meta"><time datetime="{p["date"]}">{date.fromisoformat(p["date"]).strftime("%d/%m/%Y")}</time> · Equipo editorial de Socio Estratégico</p><a class="read-link" href="/blog/{p["slug"]}.html">Leer la guía →</a></article>'
(ROOT/'blog').mkdir(exist_ok=True)
for p in posts:
    url=BASE+'blog/'+p['slug']+'.html'
    node={'@type':'BlogPosting','headline':p['title'],'description':p['description'],'datePublished':p['date'],'dateModified':p.get('updated',p['date']),'inLanguage':'es-MX','author':{'@id':org['@id']},'publisher':{'@id':org['@id']},'mainEntityOfPage':url,'url':url,'articleSection':p['category']}
    crumbs={'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Inicio','item':BASE},{'@type':'ListItem','position':2,'name':'Ideas para decidir','item':BASE+'blog/'},{'@type':'ListItem','position':3,'name':p['title'],'item':url}]}
    body=head(p['title']+' | Socio Estratégico',p['description'],url,[node,crumbs])
    body+=f'<main id="contenido" class="shell"><nav class="breadcrumb" aria-label="Ruta"><a href="/">Inicio</a> / <a href="/blog/">Ideas para decidir</a></nav><article class="article"><header class="article-header"><p class="micro">{e(p["category"])} · MÉXICO</p><h1>{e(p["title"])}</h1><p class="article-meta">Equipo editorial de Socio Estratégico · <time datetime="{p["date"]}">{date.fromisoformat(p["date"]).strftime("%d/%m/%Y")}</time></p></header><div class="article-body">{p["body"]}</div>'
    if p['sources']:
        body+='<section class="article-sources"><h2>Fuentes y alcance</h2><ul>'+''.join(f'<li><a href="{e(s["url"])}">{e(s["label"])}</a></li>' for s in p['sources'])+'</ul><p>Consulta de fuentes: '+p['date']+'. La guía propone un método de trabajo; las interpretaciones y los ejemplos no son conclusiones del INEGI.</p></section>'
    else:body+='<p class="editorial-note">Guía práctica del equipo editorial de Socio Estratégico. Los ejemplos son hipotéticos y no representan resultados de clientes.</p>'
    body+='<aside class="article-author"><h2>Sobre Socio Estratégico</h2><p>Proyecto de Miguel Ángel Meza, profesional de Comunicación y Marketing Estratégico con más de 14 años de experiencia. Consultoría de negocios e inteligencia en marketing desde Ciudad de México, con enfoque en el mercado mexicano.</p><a href="/#sobre-mi">Conoce la trayectoria de Miguel →</a></aside>'
    wa='https://wa.me/525512330537?text='+quote('Hola Miguel, leí «'+p['title']+'» en Socio Estratégico. Me gustaría conversar sobre mi negocio en México.')
    body+=f'<section class="article-cta"><p class="micro">DEL ANÁLISIS A TU NEGOCIO</p><h2>{e(p["cta"])}</h2><p>Cuéntanos el contexto de tu empresa y qué decisión necesitas tomar.</p><div class="actions"><a class="button cta-blue" href="{wa}" data-service="blog-{p["slug"]}" target="_blank" rel="noopener">Conversar por WhatsApp ↗</a><a class="button ghost" href="/{p["service"]}">Explorar el servicio →</a></div></section></article><section class="related"><h2>Sigue explorando</h2><div class="editorial-grid">'+''.join(card(q) for q in posts if q['slug']!=p['slug'])+'</div></section></main>'+foot()
    (ROOT/('blog/'+p['slug']+'.html')).write_text(body)
blog={'@type':'Blog','@id':BASE+'blog/#blog','name':'Ideas para decidir','url':BASE+'blog/','inLanguage':'es-MX','publisher':{'@id':org['@id']}}
index=head('Ideas para decidir: negocios y marketing en México | Socio Estratégico','Guías y análisis para empresas en México: consultoría de negocios, inteligencia en marketing y decisiones comerciales con contexto.',BASE+'blog/',[blog])
index+='<main id="contenido" class="shell"><section class="editorial-hero"><p class="micro">EL BLOG DE SOCIO ESTRATÉGICO · MÉXICO</p><h1>Ideas para <span class="serif">decidir.</span></h1><p class="lead">Negocios, marketing y estrategia con contexto mexicano. Guías para entender mejor un reto y convertir el análisis en un siguiente paso.</p><p class="editorial-note">Contenido del equipo editorial de Socio Estratégico. Fuentes identificadas cuando corresponde y ejemplos prácticos claramente señalados.</p></section><section aria-label="Artículos"><div class="editorial-grid">'+''.join(card(p) for p in posts)+'</div></section><section class="editorial-promise"><h2>Una pregunta útil por artículo.</h2><p>Exploramos decisiones de negocio, herramientas de inteligencia en marketing y formas de medir oportunidades comerciales en México. La prioridad es aportar criterio que puedas aplicar a tu contexto.</p><a class="button ghost" href="/platicas-y-workshops.html">Lleva estas ideas a una plática o workshop →</a></section></main>'+foot()
(ROOT/'blog/index.html').write_text(index)
items=''
for p in posts:
    url=BASE+'blog/'+p['slug']+'.html';dt=datetime.combine(date.fromisoformat(p['date']),datetime.min.time(),tzinfo=timezone.utc)
    items+=f'<item><title>{escape(p["title"])}</title><link>{url}</link><guid isPermaLink="true">{url}</guid><description>{escape(p["description"])}</description><pubDate>{format_datetime(dt)}</pubDate></item>'
(ROOT/'blog/feed.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Ideas para decidir · Socio Estratégico</title><link>'+BASE+'blog/</link><description>Negocios y marketing con enfoque en México.</description><language>es-MX</language>'+items+'</channel></rss>')
# Preserve existing sitemap URLs; add blog URLs and update only article modification dates.
import xml.etree.ElementTree as ET
ns='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',ns)
tree=ET.parse(ROOT/'sitemap.xml');root=tree.getroot();known={x.find('{'+ns+'}loc').text:x for x in root}
for url,modified in [(BASE+'blog/',None)]+[(BASE+'blog/'+p['slug']+'.html',p.get('updated',p['date'])) for p in posts]:
    node=known.get(url)
    if node is None:node=ET.SubElement(root,'{'+ns+'}url');ET.SubElement(node,'{'+ns+'}loc').text=url
    if modified:
        last=node.find('{'+ns+'}lastmod')
        if last is None:last=ET.SubElement(node,'{'+ns+'}lastmod')
        last.text=modified
ET.indent(tree,space='  ');tree.write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
print('Built',len(posts),'articles, blog index, RSS and sitemap')
