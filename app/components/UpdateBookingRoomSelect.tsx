import { useState, useEffect } from "react";
import type { Room } from "~/types/room";
import type { Booking } from "~/types/booking";
import { useToast } from "~/context/ToastContext";

interface UpdateBookingFormProps {
  booking: Booking;
  availableRooms: Room[];
  selectedRoom: Room | null;
  setAvailableRooms: (rooms: Room[]) => void;
  setSelectedRoom: (room: Room | null) => void;
  BASE_URL: string;
}

export default function UpdateBookingRoomSelect({
  booking,
  availableRooms,
  setAvailableRooms,
  selectedRoom,
  setSelectedRoom,
  BASE_URL,
}: UpdateBookingFormProps) {
    const { addToast } = useToast();
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
      if (!response.ok) {
        addToast("Failed to fetch rooms", "error")
        throw new Error("Failed to fetch rooms");
      }

      const rooms: Room[] = await response.json();
      setAvailableRooms(rooms);
      console.log(rooms);
    } catch (err: any) {
      addToast(err, "error")
      console.error(err);
    }
  };

  useEffect(() => {
    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.startDate, booking.endDate, booking.numPersons]);

  return (
    <div className={`${selectedRoom && "p-4 rounded-xl shadow-md bg-white"}`}>
      {selectedRoom && (
        <>
          <h2 className="text-xl font-semibold mb-2">Room</h2>

          <p className="mb-2">
            Current room: <strong>{booking.room?.roomNumber}</strong> ($
            {booking.room?.pricePerNight})
          </p>
        </>
      )}
      <p>Available Rooms: {availableRooms.length}</p>
      {/* Dropdown to change room */}
      {availableRooms.length > 0 ? (
        <select
          value={selectedRoom?.roomId ?? ""}
          onChange={(e) => {
            const room = availableRooms.find(
              (r) => r.roomId === Number(e.target.value)
            );
            setSelectedRoom(room ?? null);
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">
            {selectedRoom ? `Select a different room` : "Select a Room"}
          </option>
          {availableRooms.map((r) => (
            <option key={r.roomId} value={r.roomId}>
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
