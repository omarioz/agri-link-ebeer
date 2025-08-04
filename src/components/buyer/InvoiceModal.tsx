import React from 'react';
import { X, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import html2pdf from 'html2pdf.js';

interface Order {
  id: string;
  produceName: string;
  quantity: number;
  pricePerKg: number;
  total: number;
  farmer: string;
  region: string;
}

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  order
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const deliveryFee = 2.00;
  const subtotal = order.total;
  const finalTotal = subtotal + deliveryFee;

  const handleDownloadPDF = () => {
    const element = document.getElementById('invoice-content');
    if (element) {
      const opt = {
        margin: 1,
        filename: `invoice-${order.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {t('orders.invoice')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-primary">e-Beer</h1>
            <p className="text-sm text-muted-foreground">Fresh Produce Marketplace</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">{t('orders.invoiceDetails')}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.orderId')}:</span>
                <span className="font-medium">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.date')}:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.farmer')}:</span>
                <span className="font-medium">{order.farmer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.region')}:</span>
                <span className="font-medium">{order.region}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-2">{t('orders.itemDetails')}</h3>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">{t('orders.item')}</th>
                    <th className="text-right p-3 font-medium">{t('orders.qty')}</th>
                    <th className="text-right p-3 font-medium">{t('orders.price')}</th>
                    <th className="text-right p-3 font-medium">{t('orders.total')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">{order.produceName}</td>
                    <td className="text-right p-3">{order.quantity}kg</td>
                    <td className="text-right p-3">${order.pricePerKg.toFixed(2)}</td>
                    <td className="text-right p-3">${subtotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.subtotal')}:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('orders.deliveryFee')}:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
                <span>{t('orders.total')}:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            <p>{t('orders.thankYou')}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('orders.downloadPDF')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};