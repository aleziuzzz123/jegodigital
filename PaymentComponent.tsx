import React, { useState } from 'react';

interface PaymentComponentProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  className?: string;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  amount,
  description,
  onSuccess,
  onError,
  buttonText = "Pagar Ahora",
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating payment preference for:', { amount, description });
      
      // Create preference
      const response = await fetch('/.netlify/functions/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          description: description,
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error creating preference: ${response.status} - ${errorText}`);
      }

      const preference = await response.json();
      console.log('Preference created:', preference);

      // Redirect directly to Mercado Pago checkout
      if (preference.init_point) {
        console.log('Redirecting to:', preference.init_point);
        window.location.href = preference.init_point;
      } else {
        console.error('No init_point in preference:', preference);
        throw new Error('No payment URL received from Mercado Pago');
      }

    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al procesar el pago';
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className={`payment-component ${className}`}>
      {error && (
        <div className="payment-error">
          {error}
        </div>
      )}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="btn"
      >
        {isLoading ? 'Procesando...' : buttonText}
      </button>
    </div>
  );
};

export default PaymentComponent;
