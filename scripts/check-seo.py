"""Check SEO invariants before deploying. Standard library only."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,re,sys,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1];BASE='https://socioestrategico.pro/'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.tags=[];self.ids=[];self.refs=[];self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);self.tags.append((tag,a))
  if 'id' in a:self.ids.append(a['id'])
  if tag in ['a','link'] and 'href' in a:self.refs.append(a['href'])
  if tag in ['img','script'] and 'src' in a:self.refs.append(a['src'])
 def attrs(self,tag,**match):return [a for t,a in self.tags if t==tag and all(a.get(k)==v for k,v in match.items())]
# Optional repository path manifest is for sparse local validation only.
known=set(json.loads(Path(sys.argv[1]).read_text())) if len(sys.argv)>1 else {x.relative_to(ROOT).as_posix() for x in ROOT.rglob('*') if x.is_file()}
known|={x.relative_to(ROOT).as_posix() for x in ROOT.rglob('*') if x.is_file()}
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[n.text for n in ET.parse(ROOT/'sitemap.xml').findall('s:url/s:loc',ns)]
assert len(urls)==len(set(urls)),'Duplicate sitemap URLs'
titles=[];descriptions=[]
for url in urls:
 assert url.startswith(BASE) and not urlsplit(url).query,url
 rel=url[len(BASE):] or 'index.html'
 if rel.endswith('/'):rel+='index.html'
 text=(ROOT/rel).read_text();p=Page(text)
 assert len(p.attrs('h1'))==1,(rel,'H1 count')
 assert len(p.ids)==len(set(p.ids)),(rel,'duplicate IDs')
 assert p.attrs('html')[0]['lang']=='es-MX',(rel,'language')
 canonical=p.attrs('link',rel='canonical');assert len(canonical)==1 and canonical[0]['href']==url,(rel,'canonical')
 robots=p.attrs('meta',name='robots');assert len(robots)==1 and 'noindex' not in robots[0]['content'],(rel,'robots')
 desc=p.attrs('meta',name='description');assert len(desc)==1 and desc[0]['content'].strip(),(rel,'description');descriptions.append(desc[0]['content'])
 title=re.findall(r'<title>(.*?)</title>',text);assert len(title)==1 and title[0].strip(),(rel,'title');titles.append(title[0])
 for block in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text):
  graph=json.loads(block)['@graph'];assert any(n.get('@type')=='WebSite' for n in graph),(rel,'WebSite schema')
 for ref in p.refs:
  u=urlsplit(ref)
  if u.scheme and not ref.startswith(BASE):continue
  if u.netloc and u.netloc!='socioestrategico.pro':continue
  if not u.path:
   if u.fragment:assert unquote(u.fragment) in p.ids,(rel,ref,'missing anchor')
   continue
  path=unquote(u.path)
  if path.startswith('/'):target=path.lstrip('/')
  else:target=(Path(rel).parent/path).as_posix()
  if not target or target.endswith('/'):target+='index.html'
  assert target in known,(rel,ref,'missing file')
  if u.fragment and (ROOT/target).exists():
   target_page=Page((ROOT/target).read_text());assert unquote(u.fragment) in target_page.ids,(rel,ref,'missing target anchor')
 print('PASS',rel)
assert len(titles)==len(set(titles)),'Duplicate titles'
assert len(descriptions)==len(set(descriptions)),'Duplicate descriptions'
for rel in ['adn-acceso.html','adn-crm-admin.html','diagnostico-financiero.html','404.html']:
 page=Page((ROOT/rel).read_text());assert any('noindex' in a['content'] for a in page.attrs('meta',name='robots')),rel
 assert BASE+rel not in urls,rel
home=Page((ROOT/'index.html').read_text());assert 'docencia' in home.ids,'Teaching content must be static'
assert len(home.attrs('details',**{'class':'mobile-menu'}))==1,'Mobile menu missing'
assert 'Sitemap: '+BASE+'sitemap.xml' in (ROOT/'robots.txt').read_text()
ET.parse(ROOT/'blog/feed.xml')
print('PASS sitemap, RSS, canonical URLs, metadata, schema, local links and noindex boundaries')
