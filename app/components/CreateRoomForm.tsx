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
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        {mode === "create" ? "Create Room" : "Update Room"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Room Number */}
        <div>
          <label className="block text-sm font-medium mb-1">Room Number</label>
          <input
            name="roomNumber"
            type="number"
            value={form.roomNumber}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Price Per Night */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price Per Night
          </label>
          <input
            name="pricePerNight"
            type="number"
            value={form.pricePerNight}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Base Capacity */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Base Capacity
          </label>
          <input
            name="baseCapacity"
            type="number"
            value={form.baseCapacity}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Max Extra Beds */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Max Extra Beds
          </label>
          <input
            name="maxExtraBeds"
            type="number"
            value={form.maxExtraBeds}
            onChange={handleChange}
            required
            className="w-full border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="flex justify-between gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-black py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {mode === "create" ? "Create" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
