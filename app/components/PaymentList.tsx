import React, { useEffect, useState } from "react";
import type { PaymentDto } from "~/types/payment";

const PaymentsList: React.FC = () => {
  const [payments, setPayments] = useState<PaymentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      const res = await fetch("http://localhost:5051/payments");

      if (!res.ok) {
        throw new Error("Failed to fetch payments");
      }

      const data: PaymentDto[] = await res.json();
      setPayments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Payments</h2>

      {payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <ul className="space-y-3">
          {payments.map((p) => (
            <li
              key={p.paymentId}
              className="border rounded p-3 shadow-sm bg-white flex flex-col"
            >
              <p>
                <b>Payment ID:</b> {p.paymentId}
              </p>
              <p>
                <b>Invoice ID:</b> {p.invoiceId}
              </p>
              <p>
                <b>Customer:</b> {p.customerName}
              </p>
              <p>
                <b>Amount:</b> €{p.amountPaid.toFixed(2)}
              </p>
              <p>
                <b>Date:</b> {formatDate(p.paymentDate)}
              </p>
              <p>
                <b>Method:</b> {p.paymentMethod ?? "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PaymentsList;
