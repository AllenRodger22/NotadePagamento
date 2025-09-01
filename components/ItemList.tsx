import React from 'react';
import { Item } from '../types';
import { TrashIcon, PlusIcon } from './Icons';

interface ItemListProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  extraValue: number;
  setExtraValue: React.Dispatch<React.SetStateAction<number>>;
}

const ItemList: React.FC<ItemListProps> = ({ items, setItems, extraValue, setExtraValue }) => {

  const handleAddItem = () => {
    const newItem: Item = {
      id: crypto.randomUUID(),
      ref: `ITEM-${String(items.length + 1).padStart(3, '0')}`,
      description: '',
      value: 0,
    };
    setItems([...items, newItem]);
  };

  const handleItemChange = (id: string, field: keyof Omit<Item, 'id'>, value: string | number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Itens</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="p-3 rounded-lg border border-slate-200 animate-fade-in">
            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-end">
              <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-slate-500 mb-1">Ref.</label>
                <input 
                  type="text" 
                  value={item.ref}
                  onChange={(e) => handleItemChange(item.id, 'ref', e.target.value)}
                  className="w-full px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-md"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
                <input 
                  type="text" 
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Descrição do serviço"
                  className="w-full px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-md"
                />
              </div>
              <div className="flex-grow w-full sm:w-auto">
                <label className="block text-xs font-medium text-slate-500 mb-1">Valor</label>
                <input 
                  type="number" 
                  value={item.value}
                  onChange={(e) => handleItemChange(item.id, 'value', parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-1 text-sm bg-slate-100 border border-slate-300 rounded-md"
                />
              </div>
              <div className="flex-shrink-0">
                <button 
                  onClick={() => handleDeleteItem(item.id)}
                  aria-label="Excluir item"
                  className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-5 h-5"/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddItem}
        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 text-slate-500 font-semibold rounded-lg hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        Adicionar Item
      </button>

      <div className="mt-6 pt-4 border-t border-slate-200">
         <h3 className="text-md font-bold text-slate-700 mb-2">Ajuste Final</h3>
         <div>
            <label htmlFor="extra-value" className="block text-sm font-medium text-slate-600 mb-1">
              Extra (Taxa/Desconto)
            </label>
            <input
              type="number"
              id="extra-value"
              value={extraValue}
              onChange={(e) => setExtraValue(parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
         </div>
         <p className="text-xs text-slate-500 mt-1">Use um valor negativo para descontos (ex: -50).</p>
      </div>
    </div>
  );
};

export default ItemList;