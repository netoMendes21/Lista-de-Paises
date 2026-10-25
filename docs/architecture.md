# Arquitetura e manutenção

O projeto usa o App Router do Next.js com TypeScript estrito. As páginas e o layout renderizam no servidor; os componentes de busca, galeria, tema e tratamento de falhas de imagem ficam no cliente porque precisam de interação.

## Organização

- `app/`: rotas, metadados, estados de carregamento e erro e composição das telas.
- `app/pais/_lib/page-data.ts`: resolução dos dados das rotas, cache por renderização e respostas de destino não encontrado. Os parâmetros do App Router já chegam decodificados.
- `components/`: unidades visuais reutilizáveis, com propriedades tipadas. Links de retorno, cards, fotos, créditos e mapa têm responsabilidades separadas.
- `lib/`: acesso e validação dos dados, funções de domínio, caminhos de navegação e normalização da pesquisa.
- `lib/data/`: catálogo e dados locais verificados. Não contém lógica de interface.
- `app/styles/`: estilos globais separados em base, explorador, país, atrações, elementos compartilhados e responsividade. A ordem de importação está em `app/globals.css`.
- `app/country-themes.css`: paletas geradas; modificar o gerador, em vez de ajustar manualmente esse arquivo.
- `scripts/`: geração de paletas e verificações reproduzíveis de dados e navegação.

## Padrões

Usar `countryPath` e `attractionPath` para criar URLs. Reutilizar `normalizeSearchText` nas buscas. Manter consultas e catálogos completos fora dos componentes interativos, enviando apenas os dados da tela. Extrair componentes quando houver reutilização ou uma responsabilidade independente; evitar camadas sem necessidade.

Os estilos usam variáveis de tema, grids que podem encolher, quebra de textos longos e ajustes específicos para telas estreitas. A seta flutuante respeita as áreas seguras do dispositivo e a rolagem respeita a preferência por movimento reduzido. Os campos em celulares usam fonte de 16 px para evitar zoom automático na digitação.

## Verificações

Requer Node.js 24. Após `npm ci`:

```sh
npm run lint
npm run typecheck
npm test
npm run verify:data
npm run format:check
npm run build
```

Executar `npm run format` para formatar os arquivos versionáveis com Prettier, usando dois espaços e finais de linha LF. Dependências, caches e saídas de compilação são ignorados. O gerador de paletas também formata o CSS que produz.

A validação visual deve cobrir início, país e atração, temas claro e escuro, busca por teclado, filtros, paginação da galeria e retorno ao topo. Testar larguras de 320, 375, 560, 768, 1024, 1440 e 1920 px e orientação horizontal. Esses testes representam faixas de tela; não substituem a execução em todos os navegadores e dispositivos físicos.
