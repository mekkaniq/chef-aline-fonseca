import urllib.parse,re,os
SITE='https://chef-aline-fonseca.vercel.app'   # trocar para https://chefalinefonseca.com.br quando o domínio estiver ativo
NUM="5569996000030"; VIS="(69) 99600-0030"
msg=urllib.parse.quote("Olá, Aline! Vim pelo seu site e gostaria de saber mais.")
def tok(s):
    return (s.replace('{{WA_NUM}}',NUM).replace('{{WA_GERAL}}',f'https://wa.me/{NUM}?text={msg}')
             .replace('{{WA_VISIVEL}}',VIS).replace('{{SITE_URL}}',SITE))
def ext(html,nome):
    """tira <style> e <script> inline para arquivos (CSP sem 'unsafe-inline' em scripts e estilos)"""
    os.makedirs('../css',exist_ok=True); os.makedirs('../js',exist_ok=True)
    css=re.findall(r'<style>(.*?)</style>',html,re.S)
    if css:
        open(f'../css/{nome}.css','w').write('\n'.join(x.strip() for x in css)+'\n')
        first=True
        def rc(m):
            nonlocal first
            if first: first=False; return f'<link rel="stylesheet" href="css/{nome}.css">'
            return ''
        html=re.sub(r'<style>.*?</style>',rc,html,flags=re.S)
    pat=re.compile(r'<script>(.*?)</script>',re.S)
    js=pat.findall(html)
    if js:
        open(f'../js/{nome}.js','w').write('\n;\n'.join(x.strip() for x in js)+'\n')
        n=len(js); i=[0]
        def rj(m):
            i[0]+=1
            return f'<script src="js/{nome}.js"></script>' if i[0]==n else ''
        html=pat.sub(rj,html)
    return html
s=tok(open('index.src.html').read())
m=re.search(r'<style>(.*?)</style>',s,re.S)
open('../style.css','w').write(m.group(1).strip()+'\n')
s=s.replace(m.group(0),'<link rel="stylesheet" href="style.css">')
open('../index.html','w').write(ext(s,'home'))
open('../como-funciona.html','w').write(ext(tok(open('como.src.html').read()),'como'))
import legal
for f,n in (('privacidade','privacidade'),('termos','termos')):
    p=f'../{f}.html'; t=open(p).read(); open(p,'w').write(ext(t,'legal'))
# SEO
open('../robots.txt','w').write(f'User-agent: *\nAllow: /\nSitemap: {SITE}/sitemap.xml\n')
urls=['/','/como-funciona','/privacidade','/termos']
open('../sitemap.xml','w').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join(f'<url><loc>{SITE}{u}</loc></url>\n' for u in urls)+'</urlset>\n')
