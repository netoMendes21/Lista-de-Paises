# Validação da revisão

Data: 25/10/2026. Prévia local de produção com Next.js e Node.js 24.

## Verificações automáticas

- ESLint: aprovado.
- TypeScript estrito: aprovado com `npm run typecheck` e na compilação de produção.
- Produção: `npm run build` aprovado.
- Formatação: todos os arquivos suportados pelo Prettier conferidos; dois espaços e finais de linha LF.
- Testes: URLs com espaços, acentos e caracteres reservados; busca sem distinção de acentos ou caixa.
- Catálogo: 1.395 registros de atrações, 1.275 fotos e 1.367 atrações únicas com dados de apoio.
- Paletas: 250 destinos, com contraste mínimo de 4,5:1 para as combinações de texto verificadas nos temas claro e escuro.
- `git diff --check`: aprovado para os arquivos rastreados.

## Interface e fluxos

| Tela                             | Larguras verificadas                     | Resultado                                                             |
| -------------------------------- | ---------------------------------------- | --------------------------------------------------------------------- |
| Início                           | 320, 375, 560, 768, 1024, 1440 e 1920 px | Sem transbordamento horizontal; grids se ajustam à largura.           |
| País (Brasil)                    | 320, 375, 560, 768, 1024, 1440 e 1920 px | Painel e galeria adaptados, sem transbordamento horizontal.           |
| Atração (Cristo Redentor)        | 320, 375, 560, 768, 1024, 1440 e 1920 px | Imagem, informações e mapa adaptados, sem transbordamento horizontal. |
| Atração em orientação horizontal | 844 × 390 px                             | Conteúdo e seta flutuante dentro da área visível.                     |

Os temas claro e escuro foram inspecionados nas três telas. Também foram verificados:

- Pesquisa por "BRÁSIL", com um resultado e sugestão correta.
- Seleção da sugestão por seta do teclado e Enter.
- Filtro Europa: 53 países, todos com a etiqueta correspondente.
- Pesquisa sem resultados e recuperação pelo botão de limpar filtros.
- Pesquisa de atração por "CRÍSTO", encontrando Cristo Redentor.
- Galeria: de 12 para 24 atrações pelo botão Mostrar mais.
- Navegação entre início, país e atração.
- Retorno suave ao topo pela seta flutuante após rolagem.
- Botão Voltar com 28 px de altura, preservando o tamanho compacto solicitado.

## Alcance

Verificação em navegador com larguras de viewport simuladas. Não houve teste em todos os dispositivos físicos nem execução em todos os motores de navegador. As larguras cobrem celulares pequenos, celulares maiores, tablets, notebooks e monitores grandes. Imagens e mapas externos continuam sujeitos à disponibilidade dos respectivos serviços.
