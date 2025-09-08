import React, { useState } from 'react';

interface NewOrderModalProps {
  onClose: () => void;
  onSave: (orderData: any) => void;
  clients: any[];
  products: any[];
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ onClose, onSave, clients, products }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    productId: '',
    amount: '',
    type: 'one-time',
    description: '',
    status: 'pending'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const selectedProduct = products.find(p => p.id === formData.productId);
  const selectedClient = clients.find(c => c.id === formData.clientId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Order</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Client *</label>
            <select
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Service/Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select a service</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Payment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-input"
            >
              <option value="one-time">One-time Payment</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-input"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows={3}
              placeholder="Order description and notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrderModal;


