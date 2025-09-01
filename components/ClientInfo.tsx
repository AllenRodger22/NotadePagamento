import React from 'react';
import { Client } from '../types';

interface ClientInfoProps {
  client: Client;
  setClient: (client: Client) => void;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client, setClient }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Informações do Cliente</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Nome</label>
          <input type="text" id="name" name="name" value={client.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;