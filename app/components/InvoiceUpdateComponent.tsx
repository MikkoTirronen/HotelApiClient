import { useState } from "react";
import { useToast } from "~/context/ToastContext";
import type { Invoice } from "~/pages/InvoicesPage";

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onSave: (updated: Invoice) => void;
}

export default function InvoiceUpdateForm({ invoice, onClose, onSave }: Props) {
  const [form, setForm] = useState(invoice);
  const { addToast } = useToast();
  const updateField = (key: keyof Invoice, value: any) => {
    setForm({ ...form, [key]: value });
  };
  function toDateInputString(dateString: string) {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  }

  const handleUpdate = async () => {
    const body = {
      invoiceId: form.invoiceId,
      amount: form.amount,
      issueDate: new Date(form.issueDate).toISOString(),
      dueDate: new Date(form.dueDate).toISOString(),
      status: form.status,
    };

    const res = await fetch(`http://localhost:5051/invoices/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      addToast("Failed to update invoice", "error");
      return;
    }

    const updatedInvoice = await res.json();
    onSave(updatedInvoice);
    addToast("Updated Invoice!", "success");
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-xl font-semibold">Update Invoice</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              value={form.customerName}
              onChange={(e) => updateField("customerName", e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => updateField("amount", Number(e.target.value))}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Void">Void</option>
              <option value="Partial">Partial</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={toDateInputString(form.issueDate)}
              onChange={(e) => updateField("issueDate", e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              value={toDateInputString(form.dueDate)}
              onChange={(e) => updateField("dueDate", e.target.value)}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
