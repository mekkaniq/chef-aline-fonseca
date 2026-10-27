# Fontes do site

Edite aqui e gere o site:

    cd fonte && python3 build.py

- `index.src.html` e `como.src.html`: páginas (o `<style>` da home vira `style.css`).
- `legal.py`: Política de Privacidade e Termos.
- `build.py`: troca os tokens (WhatsApp, URL do site) e escreve os HTML na raiz do repositório.
- `decor.js` (ilustrações), imagens e `vercel.json` ficam na raiz e são editados direto.

A pasta `fonte/` não vai para o ar (ver `.vercelignore`).

Gerados pelo build (não edite à mão): `index.html`, `como-funciona.html`, `privacidade.html`, `termos.html`, `style.css`, `css/`, `js/`, `robots.txt`, `sitemap.xml`.
Domínio: ao ativar `chefalinefonseca.com.br`, trocar `SITE` no topo de `build.py` e rodar o build.
