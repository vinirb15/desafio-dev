export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(dateString));
}
