# Fontes do site

Edite aqui e gere o site:

    cd fonte && python3 build.py

- `index.src.html` e `como.src.html`: páginas (o `<style>` da home vira `style.css`).
- `legal.py`: Política de Privacidade e Termos.
- `build.py`: troca os tokens (WhatsApp, URL do site) e escreve os HTML na raiz do repositório.
- `decor.js` (ilustrações), imagens e `vercel.json` ficam na raiz e são editados direto.

A pasta `fonte/` não vai para o ar (ver `.vercelignore`).
