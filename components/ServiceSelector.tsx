import React from 'react';

interface ServiceSelectorProps {
  serviceType: string;
  setServiceType: (type: string) => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ serviceType, setServiceType }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Tipo de Serviço</h2>
      <div>
        <label htmlFor="service-type" className="block text-sm font-medium text-slate-600 mb-1">
          Descrição do Serviço
        </label>
        <input
          type="text"
          id="service-type"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value)}
          placeholder="ex: Consultoria de Marketing"
          className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default ServiceSelector;