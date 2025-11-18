import { useState, useEffect } from "react";
import type { Room } from "~/types/room";
import type { Booking } from "~/types/booking";

interface UpdateBookingFormProps {
  booking: Booking;
  availableRooms: Room[];
  setAvailableRooms: (rooms: Room[]) => void;
  BASE_URL: string;
}

export default function UpdateBookingRoomSelect({
  booking,
  availableRooms,
  setAvailableRooms,
  BASE_URL,
}: UpdateBookingFormProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(booking.room);

  // Fetch available rooms when dates or guests change
  const checkAvailability = async () => {
    if (!booking.startDate || !booking.endDate || booking.numPersons <= 0)
      return;

    try {
      const startUtc = new Date(booking.startDate).toISOString();
      const endUtc = new Date(booking.endDate).toISOString();

      const response = await fetch(
        `${BASE_URL}/rooms/available?start=${encodeURIComponent(
          startUtc
        )}&end=${encodeURIComponent(endUtc)}&guests=${booking.numPersons}`
      );
      if (!response.ok) throw new Error("Failed to fetch rooms");

      const rooms: Room[] = await response.json();
      setAvailableRooms(rooms);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.startDate, booking.endDate, booking.numPersons]);

  return (
    <div className="p-4 rounded-xl shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2">Room</h2>

      {/* Show current room */}
      <p className="mb-2">
        Current room: <strong>{booking.room.roomNumber}</strong> ($
        {booking.room.pricePerNight})
      </p>

      {/* Dropdown to change room */}
      {availableRooms.length > 0 ? (
        <select
          value={selectedRoom?.id ?? ""}
          onChange={(e) => {
            const room = availableRooms.find(
              (r) => r.id === Number(e.target.value)
            );
            setSelectedRoom(room ?? null);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a different room</option>
          {availableRooms.map((r) => (
            <option key={r.id} value={r.id}>
              Room {r.roomNumber} - ${r.pricePerNight} | Capacity:{" "}
              {r.baseCapacity + r.maxExtraBeds} | ExtraBeds: {r.maxExtraBeds}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-500">
          No other rooms available for selected dates/guests.
        </p>
      )}
    </div>
  );
}
