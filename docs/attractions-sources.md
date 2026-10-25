# Catálogo de pontos turísticos

Snapshot consultado em 25/10/2026, com 1.395 registros em 129 destinos e 1.275 imagens com metadados de reutilização. Os totais verificáveis ficam em `lib/data/attractions-meta.json`.

## Conteúdo e limites

O catálogo amplia a seleção editorial original da UNESCO com registros públicos do Wikidata. Os registros importados têm nome e descrição em português, associação com um país existente na API do projeto e uma página de informações na Wikipédia em português ou na UNESCO. Textos estruturados do Wikidata são CC0. O catálogo não é uma lista completa de todas as atrações do mundo, nem representa um ranking oficial de popularidade.

A coleta considera atrações turísticas e suas subclasses, museus, castelos, sítios arqueológicos, monumentos, parques nacionais, quedas-d’água, praias, jardins botânicos, estátuas e arranha-céus com pelo menos dez versões linguísticas no Wikidata. Inclui também registros com identificador principal do Patrimônio Mundial (`P757`, somente número) e complementos verificados para marcos conhecidos com outras classificações. Rótulos administrativos e itens demolidos encontrados na consulta são excluídos. Identificadores diferentes com o mesmo nome são tratados separadamente; os bairros homônimos do Maracanã não são exibidos como estádio.

Os identificadores `id`, `dataUrl` e as URLs de fontes preservam a rastreabilidade por registro. A seleção original mantém os resumos editoriais em português. A maioria das demais descrições usa o texto curto do Wikidata, sem geração automática de alegações turísticas. Os registros não são consultados em tempo real durante a navegação: indisponibilidade de uma API externa não impede a exibição da lista salva.

## Imagens

As fotos são vinculadas pela propriedade `P18` do registro, sem busca por nomes soltos. A API `imageinfo` do Wikimedia Commons fornece miniatura, página do arquivo, autor, licença e URL da licença. Só são usadas imagens com esses metadados disponíveis e com uma licença identificada. Os dados completos de crédito ficam no objeto `image` e aparecem abaixo de cada card. O usuário pode abrir a página do arquivo e a licença. As fotos são exibidas inteiras, sem recorte, e carregadas sob demanda. Arquivos removidos ou indisponíveis mostram uma mensagem neutra, sem substituir a atração por uma imagem inventada.

## Atualização e validação

Para adicionar ou revisar uma entrada, confirme a identidade do local e o país na fonte, confira imagem e licença no Commons e atualize o JSON e seus totais. Evite identificar atrações apenas por nomes iguais. Execute `node scripts/verify-attractions.mjs`, `npm run typecheck`, `npm run lint` e `npm run build` após mudanças relevantes.

Referências:

- https://www.wikidata.org/wiki/Wikidata:SPARQL_query_service
- https://www.wikidata.org/wiki/Wikidata:Licensing
- https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- https://www.mediawiki.org/wiki/API:Imageinfo
- https://whc.unesco.org/en/list/

## Páginas internas das atrações

Os cards agora abrem rotas internas em /pais/[name]/atracao/[id]. O local precisa pertencer ao catálogo do país indicado; combinações inválidas exibem a página 404. Os detalhes de apoio ficam em lib/data/attraction-details.json e usam os registros P31, P131, P571, P1619, P84, P170, P149, P186, P1435 e P625 do Wikidata. Datas são apresentadas somente como anos, sem supor dia ou mês. Informações não disponíveis são omitidas ou recebem uma mensagem discreta. As coordenadas alimentam um mapa incorporado do OpenStreetMap e representam um ponto de referência, não os limites completos de parques ou conjuntos históricos.

Os textos editoriais em lib/data/attraction-stories.json são resumos próprios das fichas UNESCO 303/355, 1115, 600, 80, 314, 320 e 1303. As fontes e os créditos são identificados de forma discreta; não há botões comerciais nem redirecionamento dos cards para a Wikipédia.
