export type ParsedTransaction = {
  type: number;
  date: string;
  hour: string;
  value: number;
  cpf: string;
  card: string;
  storeOwner: string;
  storeName: string;
  kind: 'entrada' | 'saida';
  description: string;
};
