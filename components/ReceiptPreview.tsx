import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Client, Item, CompanyInfo } from '../types';
import { PrintIcon, DownloadIcon, CheckIcon } from './Icons';

interface ReceiptPreviewProps {
  receiptNumber: string;
  serviceType: string;
  client: Client;
  items: Item[];
  total: number;
  companyInfo: CompanyInfo;
  setCompanyInfo: (info: CompanyInfo) => void;
  extraValue: number;
  isConfirmed: boolean;
  onConfirm: () => void;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({
  receiptNumber,
  serviceType,
  client,
  items,
  total,
  companyInfo,
  setCompanyInfo,
  extraValue,
  isConfirmed,
  onConfirm,
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current, {
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff',
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `nota-de-pagamento-${receiptNumber}.jpeg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      });
    }
  };
  
  const subtotal = items.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow-lg border border-slate-200 sticky top-10 print:shadow-none print:border-none print:p-0 print:sticky-auto print:top-auto">
      <div id="receipt-content" ref={receiptRef} className="bg-white p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-slate-200">
          <div className="mb-4 sm:mb-0 w-full sm:w-1/2">
             <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => !isConfirmed && setCompanyInfo({ name: e.target.value })}
              readOnly={isConfirmed}
              aria-label="Nome da Empresa (editável)"
              className="text-2xl sm:text-3xl font-bold text-slate-800 bg-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md -ml-2 px-2 py-1 w-full"
            />
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <h3 className="text-xl sm:text-2xl font-semibold text-green-600 uppercase">Nota de Pagamento</h3>
            <p className="text-slate-500 text-sm mt-1 break-all">Ref: {receiptNumber}</p>
            <p className="text-slate-500 text-sm">{today}</p>
          </div>
        </div>

        {/* Client Info */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Cobrança Para</h4>
            <p className="font-bold text-slate-700">{client.name || 'Nome do Cliente'}</p>
          </div>
          <div className="flex-1 text-left sm:text-right">
            <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Tipo de Serviço</h4>
            <p className="font-semibold text-slate-700">{serviceType}</p>
          </div>
        </div>
        
        {/* Items Table */}
        <div className="mt-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[400px]">
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm uppercase">
                  <th className="p-3 font-semibold rounded-l-lg">Ref.</th>
                  <th className="p-3 font-semibold">Descrição</th>
                  <th className="p-3 font-semibold text-right rounded-r-lg">Valor</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="p-3 text-slate-500">{item.ref}</td>
                    <td className="p-3 text-slate-700 font-medium">{item.description}</td>
                    <td className="p-3 text-right text-slate-700 font-medium">
                      R$ {Number(item.value).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-3 text-center text-slate-400">Nenhum item adicionado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-end mt-6">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Extra</span>
              <span>R$ {extraValue.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between font-bold text-slate-800 text-lg">
                <span>Total a Pagar</span>
                <span className="text-indigo-600">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-slate-500 text-xs">
          <p>Aguardando o pagamento e o envio do comprovante</p>
        </div>
      </div>

      <div className="mt-8 text-center print:hidden">
         <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!isConfirmed ? (
              <button
                onClick={onConfirm}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                <CheckIcon className="w-5 h-5"/>
                Confirmar Nota
              </button>
            ) : (
              <>
                <button
                  onClick={handlePrint}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <PrintIcon className="w-5 h-5"/>
                  Imprimir / Salvar PDF
                </button>
                <button
                  onClick={handleDownloadImage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Salvar como JPEG
                </button>
              </>
            )}
         </div>
      </div>

    </div>
  );
};

export default ReceiptPreview;