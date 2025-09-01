import React, { useState, useEffect } from 'react';
import { SavedReceipt } from '../types';
import { SearchIcon, TrashIcon } from './Icons';

interface SearchNotesProps {
  onLoadNote: (note: SavedReceipt) => void;
}

const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;

const SearchNotes: React.FC<SearchNotesProps> = ({ onLoadNote }) => {
  const [allNotes, setAllNotes] = useState<SavedReceipt[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<SavedReceipt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const savedReceiptsRaw = localStorage.getItem('receipts');
      const savedReceipts = savedReceiptsRaw ? JSON.parse(savedReceiptsRaw) : [];
      // Ordena as notas da mais recente para a mais antiga
      savedReceipts.sort((a: SavedReceipt, b: SavedReceipt) => b.createdAt - a.createdAt);
      setAllNotes(savedReceipts);
      setFilteredNotes(savedReceipts);
    } catch (error) {
      console.error("Falha ao carregar notas do armazenamento local:", error);
      setAllNotes([]);
      setFilteredNotes([]);
    }
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const results = allNotes.filter(note => 
      note.client.name.toLowerCase().includes(lowercasedQuery) ||
      note.receiptNumber.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredNotes(results);
  }, [searchQuery, allNotes]);

  const handleDelete = (receiptNumberToDelete: string) => {
    if (window.confirm("Tem certeza que deseja deletar esta nota? Esta ação não pode ser desfeita.")) {
      const updatedNotes = allNotes.filter(note => note.receiptNumber !== receiptNumberToDelete);
      localStorage.setItem('receipts', JSON.stringify(updatedNotes));
      setAllNotes(updatedNotes); // Atualiza o estado para refletir a remoção
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-slate-800 mb-4">Minhas Notas Salvas</h2>
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nome do cliente ou n° de referência..."
          className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => {
            const isDeletable = (Date.now() - note.createdAt) < FIVE_MINUTES_IN_MS;
            return (
              <div key={note.receiptNumber} className="group flex items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <div className="flex-grow cursor-pointer" onClick={() => onLoadNote(note)}>
                  <p className="font-semibold text-indigo-600">{note.client.name}</p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium">Ref:</span> {note.receiptNumber.substring(0, 18)}...
                  </p>
                  <p className="text-xs text-slate-400">{note.date}</p>
                </div>
                {isDeletable && (
                   <button 
                     onClick={() => handleDelete(note.receiptNumber)}
                     aria-label="Deletar nota"
                     className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                   >
                     <TrashIcon className="w-5 h-5"/>
                   </button>
                )}
              </div>
            )
          })
        ) : (
          <p className="text-center text-slate-500 py-8">Nenhuma nota encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default SearchNotes;
