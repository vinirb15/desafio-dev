'use client';
import { useEffect, useState } from 'react';
import InputModal from '@/components/InputModal';
import { formatCurrency, formatDate } from '@/utils/formatters';
import './home.css';

type Transaction = {
  type: string;
  date: string;
  value: number;
  cpf: string;
  card: string;
};

type Store = {
  storeName: string;
  storeOwner: string;
  balance: number;
  transactions: Transaction[];
};

export default function Home() {
  const [expandedStore, setExpandedStore] = useState<string | null>(null);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    fetchStores();
  }, []);

  function fetchStores() {
    fetch('http://localhost:5000/transactions')
      .then(res => res.json())
      .then(setStores);
  }

  function toggleExpand(storeName: string) {
    setExpandedStore(prev => (prev === storeName ? null : storeName));
  };

  return (
    <div className='container'>
      <main className='main'>
        <h1 className='title'>Store Transactions</h1>

        <InputModal onUploadSuccess={fetchStores} />

        <div className='grid'>
          {
            stores.length > 0 ? (
              stores.map((store: Store) => (
                <div key={store.storeName} className='card' data-cy="list-itens">
                  <div className='storeHeader' onClick={() => toggleExpand(store.storeName)}>
                    <h2>{store.storeName}</h2>
                    <div className='storeInfo'>
                      <p><strong>Owner:</strong> {store.storeOwner}</p>
                      <p><strong>Balance:</strong> {formatCurrency(store.balance)}</p>
                      <p className='expandToggle'>
                        {expandedStore === store.storeName ? '▼' : '►'}
                        {store.transactions.length} Transações
                      </p>
                    </div>
                  </div>
                  {expandedStore === store.storeName && (
                    <div className='transactionsContainer'>
                      <table className='transactionsTable'>
                        <thead>
                          <tr>
                            <th>Tipo</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>CPF</th>
                            <th>Cartão</th>
                          </tr>
                        </thead>
                        <tbody>
                          {store.transactions.map((t, idx) => (
                            <tr key={idx} className={t.value < 0 ? 'negative' : 'positive'}>
                              <td>{t.type}</td>
                              <td>{formatDate(t.date)}</td>
                              <td>{formatCurrency(t.value)}</td>
                              <td>{t.cpf}</td>
                              <td>{t.card}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))
            ) : <h1 style={{ color: '#666' }}>Sem resultados</h1>
          }
        </div>
      </main>
    </div>
  );
}
