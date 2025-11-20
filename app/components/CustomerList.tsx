import type { Customer } from "~/types/customer";

interface Props {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
}

export default function CustomersListComponent({
  customers,
  onEdit,
  onDelete,
}: Props) {
  if (!customers.length)
    return <p className="text-gray-500">No customers found.</p>;

  return (
    <div className="space-y-4">
      {customers.map((c) => (
        <div
          key={c.customerId}
          className="p-5 bg-white border rounded-xl shadow-sm flex items-center justify-between hover:shadow-md transition"
        >
          {/* Customer Info */}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.email}</p>
            <p className="text-sm text-gray-600">{c.phone}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(c)}
              className="px-3 py-1.5 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 transition"
            >
              Edit
            </button>

            <button
              onClick={() => c.customerId && onDelete(c.customerId)}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
