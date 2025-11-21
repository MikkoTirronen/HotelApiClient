import { useEffect, useState } from "react";
import type { Room } from "~/types/room";

interface Props {
  mode: "create" | "edit";
  initialRoom?: Room | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel?: () => void;
}

export default function CreateRoomForm({
  mode,
  initialRoom,
  onSubmit,
  onCancel,
}: Props) {
  const [form, setForm] = useState({
    roomNumber: "",
    pricePerNight: 0,
    baseCapacity: 1,
    maxExtraBeds: 0,
  });

  useEffect(() => {
    if (initialRoom) {
      setForm({
        roomNumber: initialRoom.roomNumber.toString(),
        pricePerNight: initialRoom.pricePerNight,
        baseCapacity: initialRoom.baseCapacity,
        maxExtraBeds: initialRoom.maxExtraBeds,
      });
    }
  }, [initialRoom]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-6 border border-gray-200">
      <h2 className="text-2xl font-bold tracking-tight">
        {mode === "create" ? "Create Room" : "Update Room"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Room Number */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Room Number
          </label>
          <input
            name="roomNumber"
            type="number"
            value={form.roomNumber}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Price Per Night */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Price Per Night
          </label>
          <input
            name="pricePerNight"
            type="number"
            value={form.pricePerNight}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Base Capacity */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Base Capacity
          </label>
          <input
            name="baseCapacity"
            type="number"
            value={form.baseCapacity}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Max Extra Beds */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Max Extra Beds
          </label>
          <input
            name="maxExtraBeds"
            type="number"
            value={form.maxExtraBeds}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {mode === "create" ? "Create Room" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
