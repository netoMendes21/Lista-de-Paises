# Temas dos países

Cada página de país e de atração identifica seu destino pelo código ISO alpha-3. O CSS seleciona a paleta no elemento raiz, incluindo o cabeçalho, sem alterar a preferência clara/escura salva pelo usuário. A página inicial e as rotas sem destino usam as cores originais.

Os 250 destinos atuais possuem paletas extraídas das bandeiras usadas pela API. scripts/generate-country-themes.mjs lê os SVGs do Flagcdn com o Sharp já instalado no projeto, agrupa cores predominantes e gera app/country-themes.css e lib/data/country-themes.json. O cache fica em .cache/country-theme-flags, ignorado pelo Git. Não são necessárias consultas de bandeiras para escolher cores durante a navegação.

A paleta aprovada da Espanha é preservada como exceção editorial. Para os demais países, os fundos recebem as cores predominantes e os textos/botões são ajustados para contraste mínimo de 4,5:1. Cores neutras da bandeira podem aparecer nos detalhes; fundos e textos recebem variações apropriadas para cada modo.

Para atualizar: node scripts/generate-country-themes.mjs. Para validar as paletas: node scripts/verify-country-themes.mjs. O gerador usa acesso à rede somente durante a atualização.
