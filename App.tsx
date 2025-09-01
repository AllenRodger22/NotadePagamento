import React, { useState, useEffect } from 'react';
import { Client, Item, CompanyInfo, SavedReceipt } from './types';
import ServiceSelector from './components/ServiceSelector';
import ClientInfo from './components/ClientInfo';
import ItemList from './components/ItemList';
import ReceiptPreview from './components/ReceiptPreview';
import { SparklesIcon } from './components/Icons';
import SearchNotes from './components/SearchNotes';

const App: React.FC = () => {
  // FIX: Explicitly type `receiptNumber` as string to avoid type inference issues with crypto.randomUUID().
  const [receiptNumber, setReceiptNumber] = useState<string>(crypto.randomUUID());
  const [serviceType, setServiceType] = useState('Serviços Gerais');
  const [client, setClient] = useState<Client>({ name: '' });
  const [items, setItems] = useState<Item[]>([
    { id: crypto.randomUUID(), ref: 'ITEM-001', description: 'Serviço Prestado', value: 150 },
  ]);
  const [extraValue, setExtraValue] = useState(0);
  const [total, setTotal] = useState(0);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Rosania Modelista',
  });
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [view, setView] = useState<'editor' | 'search'>('editor');

  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.value || 0), 0);
    setTotal(subtotal + Number(extraValue || 0));
  }, [items, extraValue]);

  const handleConfirmAndSave = () => {
    const today = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    
    const currentReceipt: SavedReceipt = {
      receiptNumber,
      serviceType,
      client,
      items,
      total,
      companyInfo,
      extraValue,
      date: today,
      createdAt: Date.now(), // Adiciona timestamp de criação
    };

    try {
      const savedReceiptsRaw = localStorage.getItem('receipts');
      const savedReceipts = savedReceiptsRaw ? JSON.parse(savedReceiptsRaw) : [];
      
      const existingReceiptIndex = savedReceipts.findIndex((r: any) => r.receiptNumber === receiptNumber);
      if (existingReceiptIndex > -1) {
          savedReceipts[existingReceiptIndex] = currentReceipt;
      } else {
          savedReceipts.push(currentReceipt);
      }

      localStorage.setItem('receipts', JSON.stringify(savedReceipts));
      setIsConfirmed(true);
    } catch (error) {
      console.error("Falha ao salvar a nota no armazenamento local:", error);
      alert("Ocorreu um erro ao salvar a nota.");
    }
  };

  const handleNewReceipt = () => {
    setClient({ name: '' });
    setItems([]);
    setExtraValue(0);
    setServiceType('Serviços Gerais');
    setReceiptNumber(crypto.randomUUID());
    setIsConfirmed(false);
    setView('editor');
  };

  const handleLoadNote = (note: SavedReceipt) => {
    setReceiptNumber(note.receiptNumber);
    setServiceType(note.serviceType);
    setClient(note.client);
    setItems(note.items);
    setExtraValue(note.extraValue);
    setCompanyInfo(note.companyInfo);
    setIsConfirmed(true); // As notas carregadas já estão confirmadas
    setView('editor');
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 text-indigo-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Gerador de Nota de Pagamento</h1>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={handleNewReceipt}
              className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Nova Nota
            </button>
            <button
              onClick={() => setView('search')}
              className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Minhas Notas
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {view === 'editor' ? (
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-12">
            <div className={`lg:col-span-2 space-y-8 ${isConfirmed ? 'opacity-50 pointer-events-none' : ''}`}>
              <ServiceSelector serviceType={serviceType} setServiceType={setServiceType} />
              <ClientInfo client={client} setClient={setClient} />
              <ItemList 
                items={items} 
                setItems={setItems} 
                extraValue={extraValue}
                setExtraValue={setExtraValue}
              />
            </div>

            <div className="lg:col-span-3">
              <ReceiptPreview 
                receiptNumber={receiptNumber}
                serviceType={serviceType}
                client={client}
                items={items}
                total={total}
                companyInfo={companyInfo}
                setCompanyInfo={setCompanyInfo}
                extraValue={extraValue}
                isConfirmed={isConfirmed}
                onConfirm={handleConfirmAndSave}
              />
            </div>
          </div>
        ) : (
          <SearchNotes onLoadNote={handleLoadNote} />
        )}
      </main>
    </div>
  );
};

export default App;