"""Smoke test of the public website after deployment (not a Google index status check)."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin
import json
import re
import time
import sys
import xml.etree.ElementTree as ET

BASE='https://socioestrategico.pro/'
ROOT=Path(__file__).resolve().parents[1]
POSTS=sorted(json.loads((ROOT/'content/posts.json').read_text()),key=lambda p:p['date'],reverse=True)
LATEST=['blog/'+p['slug']+'.html' for p in POSTS[:3]]
NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}

def fetch(path):
    url=urljoin(BASE,path)
    request=Request(url,headers={'User-Agent':'SocioEstrategico-SEOMonitor/1.0 (site deployment check)','Accept':'text/html,application/xml,text/xml,*/*'})
    with urlopen(request,timeout=20) as response:
        final_url=response.geturl()
        status=response.status
        body=response.read(3_000_000).decode('utf-8',errors='replace')
    assert status==200,(url,status)
    assert final_url.rstrip('/')==url.rstrip('/'),(url,'unexpected redirect to',final_url)
    return body

def validate():
    robots=fetch('robots.txt')
    assert 'Sitemap: '+BASE+'sitemap.xml' in robots,'Missing sitemap directive in robots.txt'
    sitemap=ET.fromstring(fetch('sitemap.xml'))
    urls={n.text for n in sitemap.findall('s:url/s:loc',NS)}
    expected={BASE+path for path in LATEST}
    assert expected.issubset(urls),('Live sitemap missing newest articles',sorted(expected-urls))
    assert BASE+'blog/' in urls and BASE+'mapa.html' in urls,'Missing public URLs in sitemap'
    rss=ET.fromstring(fetch('blog/feed.xml'))
    rss_urls={n.text for n in rss.findall('./channel/item/link')}
    assert expected.issubset(rss_urls),('Live RSS missing newest articles',sorted(expected-rss_urls))
    homepage=fetch('')
    assert all('/'+path in homepage for path in LATEST),'Homepage has not propagated latest articles'
    for path in ['blog/','mapa.html']+LATEST:
        page=fetch(path)
        canonical=urljoin(BASE,path)
        assert re.search(r'<link\b[^>]*rel=["\']canonical["\'][^>]*>',page,re.I) and canonical in page,(path,'missing canonical')
        assert re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*>',page,re.I),(path,'missing robots meta')
        assert not re.search(r'<meta\b[^>]*name=["\']robots["\'][^>]*noindex',page,re.I),(path,'noindex')
    print('PASS live SEO: status 200, no unexpected redirects, sitemap, RSS and recent internal links')

for attempt in range(1,5):
    try:
        validate()
        break
    except Exception as exc:
        print(f'Attempt {attempt}/4: {exc}',file=sys.stderr)
        if attempt==4:
            print('WARNING: verify CDN, hosting, URL accessibility and the latest deployment.',file=sys.stderr)
            sys.exit(1)
        time.sleep(20)
