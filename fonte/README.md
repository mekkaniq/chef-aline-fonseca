# Fontes do site

Edite aqui e gere o site:

    cd fonte && python3 build.py

- `index.src.html` e `como.src.html`: páginas (o `<style>` da home vira `style.css`).
- `legal.py`: Política de Privacidade e Termos.
- `build.py`: troca os tokens (WhatsApp, URL do site) e escreve os HTML na raiz do repositório.
- `decor.js` (ilustrações), imagens e `vercel.json` ficam na raiz e são editados direto.

A pasta `fonte/` não vai para o ar (ver `.vercelignore`).

Gerados pelo build (não edite à mão): `index.html`, `como-funciona.html`, `privacidade.html`, `termos.html`, `style.css`, `css/`, `js/`, `robots.txt`, `sitemap.xml`.
Domínio: `SITE` em `build.py` já aponta para `chefalinefonseca.com.br`.
`obrigado.html` fica na raiz e é editado direto (não é gerado pelo build, não entra no sitemap e tem noindex).

## Beta vinho (/beta/)
Versão de teste com a paleta oficial da identidade (vinho #963030 + creme #EAD8B6), em `chefalinefonseca.com.br/beta/`.
É gerada a partir do site verde: depois do `build.py`, rode `python3 beta.py` (aqui em `fonte/`). Não edite `beta/` à mão.
Troca as cores do CSS, refaz a foto do topo em duotone vinho (`beta/hero.webp`) e as cores do fundo animado (`beta/js/home.js`).
Fica com noindex e `Disallow: /beta/` no robots.txt. Se aprovarem, é só trocar as cores em `style.css`/`css/` e no shader do `index.src.html` e apagar `beta/`.
