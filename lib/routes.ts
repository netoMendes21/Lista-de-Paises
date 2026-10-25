/** Centraliza os caminhos e a codificação dos parâmetros de navegação. */
export function countryPath(countryName: string): string {
  return `/pais/${encodeURIComponent(countryName)}`;
}

export function attractionPath(countryName: string, attractionId: string): string {
  return `${countryPath(countryName)}/atracao/${encodeURIComponent(attractionId)}`;
}
