import urllib.parse,re
NUM="5569996000030"; VIS="(69) 99600-0030"
msg=urllib.parse.quote("Olá, Aline! Vim pelo seu site e gostaria de saber mais.")
def tok(s):
    return (s.replace('{{WA_NUM}}',NUM).replace('{{WA_GERAL}}',f'https://wa.me/{NUM}?text={msg}')
             .replace('{{WA_VISIVEL}}',VIS).replace('{{SITE_URL}}','https://chef-aline-fonseca.vercel.app'))
s=tok(open('index.src.html').read())
m=re.search(r'<style>(.*?)</style>',s,re.S)
open('../style.css','w').write(m.group(1).strip()+'\n')
s=s.replace(m.group(0),'<link rel="stylesheet" href="style.css">')
open('../index.html','w').write(s)
open('../como-funciona.html','w').write(tok(open('como.src.html').read()))
import legal
