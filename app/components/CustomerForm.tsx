import { useEffect, useState } from "react";
import type { Customer } from "~/types/customer";

interface Props {
  mode: "create" | "edit";
  initialCustomer?: Customer | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export default function CustomerForm({
  mode,
  initialCustomer,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Load initial values when editing
  useEffect(() => {
    if (initialCustomer) {
      setForm({
        name: initialCustomer.name,
        email: initialCustomer.email,
        phone: initialCustomer.phone,
      });
    }
  }, [initialCustomer]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        {mode === "create" ? "Create Customer" : "Update Customer"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Full Name
          </label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Phone
          </label>
          <input
            name="phoneNumber"
            type="text"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
