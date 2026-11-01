"""Gera /beta/: a mesma página com a paleta oficial (vinho #963030 + creme #EAD8B6).
Rode depois do build.py:  cd fonte && python3 beta.py
Não mexe no site verde. Beta fica noindex e fora do sitemap."""
import re,os,shutil
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..'))
SW=[('#2F4A3A','#963030'),('#1F3328','#6E2020'),('#101c15','#2A0F0F'),('#3a5a47','#B04A4A'),
    ('#1b2a21','#2B1616'),('#56665b','#7B5A55'),('#e6f0d8','#F6E3CC'),
    ('rgba(47,74,58','rgba(150,48,48'),('rgba(31,51,40','rgba(110,32,32'),
    ('rgba(16,28,21','rgba(42,15,15'),('rgba(142,155,120,.30)','rgba(234,216,182,.22)')]
def sw(t):
    for a,b in SW: t=t.replace(a,b)
    return t
def paths(t):
    t=re.sub(r'(src|href)="(img/|js/)',r'\1="/\2',t)
    t=t.replace('src="decor.js"','src="/decor.js"')
    t=t.replace('href="privacidade.html"','href="/privacidade"').replace('href="termos.html"','href="/termos"')
    # tudo do beta com endereço completo: /beta e /beta/ precisam carregar os mesmos arquivos
    t=t.replace('href="style.css"','href="/beta/style.css"').replace('href="css/','href="/beta/css/')
    t=t.replace('href="como-funciona.html"','href="/beta/como-funciona"').replace('href="./#','href="/beta/#').replace('href="./"','href="/beta/"')
    t=t.replace('<a href="/">Voltar ao início</a>','<a href="/beta/">Voltar ao início</a>')
    return t
shutil.rmtree('beta',ignore_errors=True); os.makedirs('beta/css')
for f in ['index.html','como-funciona.html','obrigado.html']:
    t=sw(paths(open(f).read()))
    t=re.sub(r'<link rel="canonical"[^>]*>','',t)
    if 'name="robots"' not in t: t=t.replace('<meta charset="utf-8">','<meta charset="utf-8"><meta name="robots" content="noindex,nofollow">',1)
    open('beta/'+f,'w').write(t)
open('beta/style.css','w').write(sw(open('style.css').read()))
for f in ['como.css','nf.css']: open('beta/css/'+f,'w').write(sw(open('css/'+f).read()))
r=open('robots.txt').read()
if 'Disallow: /beta/' not in r: open('robots.txt','w').write(r.replace('Allow: /','Allow: /\nDisallow: /beta/'))
print('beta ok')
# foto do hero vem em duotone verde: refaz em vinho/creme (tons de cinza -> #2A0F0F..#EAD8B6)
from PIL import Image,ImageOps
im=ImageOps.grayscale(Image.open('img/hero.webp').convert('RGB'))
im=ImageOps.autocontrast(im,cutoff=1)
ImageOps.colorize(im,black='#2A0F0F',mid='#8A3A36',white='#F1E2C4',midpoint=110).save('beta/hero.webp',quality=82)
t=open('beta/index.html').read().replace('src="/img/hero.webp"','src="/beta/hero.webp"')
open('beta/index.html','w').write(t); print('hero ok')
# fundo animado do hero (WebGL em js/home.js) tem as cores fixas no shader
js=open('js/home.js').read()
for a,b in [('vec3(.557,.608,.471)','vec3(.690,.290,.290)'),('vec3(.184,.290,.227)','vec3(.588,.188,.188)')]:
    assert a in js, a; js=js.replace(a,b)
js=js.replace("location.href='obrigado'","location.href='/beta/obrigado'")
os.makedirs('beta/js',exist_ok=True); open('beta/js/home.js','w').write(js)
t=open('beta/index.html').read().replace('src="/js/home.js"','src="/beta/js/home.js"'); open('beta/index.html','w').write(t)
print('shader ok')

# efeitos de rolagem (fouet caindo, creme escorrendo)
shutil.copy('fonte/beta-rolagem.css','beta/css/rolagem.css'); shutil.copy('fonte/beta-rolagem.js','beta/js/rolagem.js')
t=open('beta/index.html').read()
t=t.replace('</head>','<link rel="stylesheet" href="/beta/css/rolagem.css">\n</head>',1).replace('</body>','<script src="/beta/js/rolagem.js"></script>\n</body>',1)
open('beta/index.html','w').write(t); print('rolagem ok')
