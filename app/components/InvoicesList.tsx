import React, { useState, useEffect } from "react";
import InvoiceUpdateComponent from "./InvoiceUpdateComponent";
import { useToast } from "~/context/ToastContext";

export default function InvoicesList() {
  const [customer, setCustomer] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [status, setStatus] = useState("");
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [results, setResults] = useState<any[] | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<any | null>(null);
  const [cardType, setCardType] = useState("Visa");
  const [paymentAmount, setPaymentAmount] = useState(0);

  useEffect(() => {
    loadAllInvoices();
  }, []);

  const loadAllInvoices = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5051/invoices");
    const data = await res.json();
    setInvoices(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (customer) params.append("customer", customer);
    if (invoiceId) params.append("invoiceId", invoiceId);
    if (status) params.append("status", status);

    const res = await fetch(
      `http://localhost:5051/invoices/search?${params.toString()}`
    );
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  const handleClear = () => {
    setCustomer("");
    setInvoiceId("");
    setStatus("");
    setResults(null);
  };

  const formatDate = (d?: string) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const list = results ?? invoices;

  const openPaymentWindow = (invoice: any) => {
    setPaymentInvoice(invoice);
    setPaymentAmount(invoice.amount);
    setCardType("Visa");
  };
  const triggerVoidInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5051/invoices/void-unpaid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to void invoices:", response.statusText);
        return;
      }

      const result = await response.json();
      console.log("Invoices voided:", result);
    } catch (error) {
      console.error("Error triggering void invoices:", error);
    }
  };
  const handlePaymentSubmit = async () => {
    const payload = {
      invoiceId: paymentInvoice.invoiceId,
      customer: paymentInvoice.customerName,
      amount: paymentAmount,
      method: cardType,
    };

    console.log("Payment submitted:", payload);

    try {
      const res = await fetch("http://localhost:5051/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.text();
        addToast("Payment failed!", "error");
        console.error("Payment failed:", error);
        return;
      }

      const data = await res.json();
      console.log("Payment success:", data);
      addToast("Payment successful", "success");
      setPaymentInvoice(null);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Invoice Update Modal */}
      {selectedInvoice && (
        <InvoiceUpdateComponent
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSave={() => {
            loadAllInvoices();
            setSelectedInvoice(null);
          }}
        />
      )}

      {/* Payment Modal */}
      {paymentInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 space-y-4">
            <h3 className="text-lg font-semibold">Pay Invoice</h3>
            <p>
              <b>Invoice ID:</b> {paymentInvoice.invoiceId}
            </p>
            <p>
              <b>Customer:</b> {paymentInvoice.customerName}
            </p>

            <div className="space-y-2">
              <label>
                Card Type:
                <select
                  value={cardType}
                  onChange={(e) => setCardType(e.target.value)}
                  className="border p-2 rounded w-full"
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="Amex">Amex</option>
                </select>
              </label>

              <label>
                Amount (€):
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setPaymentInvoice(null)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handlePaymentSubmit}
                className="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      {!selectedInvoice && !paymentInvoice && (
        <>
          <h2 className="text-xl font-semibold">Invoices</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Customer name"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Invoice ID"
              value={invoiceId}
              onChange={(e) => setInvoiceId(e.target.value)}
              className="border p-2 rounded"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Any Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">UnPaid</option>
              <option value="void">Void</option>
              <option value="partial">Partial</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-500 px-4 py-2 text-white rounded hover:bg-blue-600"
            >
              {loading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={handleClear}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Clear
            </button>
            <button
              onClick={triggerVoidInvoices}
              className="bg-gray-300 px-10 ml-50 py-2 rounded hover:bg-gray-400"
            >
              Void Expired Invoices
            </button>
          </div>

          <hr />

          <h3 className="text-lg font-semibold">Results</h3>
          {!list.length && <p>No invoices found.</p>}

          <ul className="space-y-2">
            {list.map((i) => (
              <li
                key={i.invoiceId}
                className="border p-3 rounded shadow-sm flex justify-between"
              >
                <div>
                  <p>
                    <b>ID:</b> {i.invoiceId}
                  </p>
                  <p>
                    <b>Customer:</b> {i.customerName}
                  </p>
                  <p>
                    <b>Total:</b> €{i.amount}
                  </p>
                  <p>
                    <b>IssueDate:</b> {formatDate(i.issueDate)}
                  </p>
                  <p>
                    <b>DueDate:</b> {formatDate(i.dueDate)}
                  </p>
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        i.status === "Paid"
                          ? "bg-green-600"
                          : i.status === "Void"
                            ? "bg-red-600"
                            : i.status === "Unknown"
                              ? "bg-gray-600"
                              : "bg-yellow-600"
                      }`}
                    >
                      {i.status}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={() => setSelectedInvoice(i)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => openPaymentWindow(i)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Pay
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
