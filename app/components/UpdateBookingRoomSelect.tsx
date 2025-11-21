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
  extraBeds: number;
  // ⭐ You should pass these up to parent form
  setExtraBeds: (n: number) => void;
}

export default function UpdateBookingRoomSelect({
  booking,
  availableRooms,
  selectedRoom,
  setAvailableRooms,
  setSelectedRoom,
  BASE_URL,
  extraBeds,
  setExtraBeds,
}: UpdateBookingFormProps) {
  const { addToast } = useToast();

  const [extraBedsEnabled, setExtraBedsEnabled] = useState(false);

  // Load initial state from booking (if you store booking.extraBeds in backend)
  useEffect(() => {
    if (booking.extraBedsCount && booking.extraBedsCount > 0) {
      setExtraBedsEnabled(true);
      setExtraBeds(booking.extraBedsCount);
    }
  }, [booking.extraBedsCount, setExtraBeds]);

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
        addToast("Failed to fetch rooms", "error");
        throw new Error("Failed to fetch rooms");
      }

      const rooms: Room[] = await response.json();
      setAvailableRooms(rooms);
    } catch (err: any) {
      addToast(err.message ?? err, "error");
      console.error(err);
    }
  };

  useEffect(() => {
    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.startDate, booking.endDate, booking.numPersons]);

  return (
    <div
      className={`${selectedRoom && "p-4 rounded-xl shadow-md bg-white space-y-4"}`}
    >
      {selectedRoom && (
        <>
          <h2 className="text-xl font-semibold">Room</h2>

          <p>
            Current room: <strong>{booking.room?.roomNumber}</strong> ($
            {booking.room?.pricePerNight})
          </p>
        </>
      )}

      {/* ⭐ Extra Bed Selector FIRST */}
      {selectedRoom && selectedRoom.maxExtraBeds > 0 && (
        <div className="border-b pb-4 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={extraBedsEnabled}
              onChange={(e) => {
                setExtraBedsEnabled(e.target.checked);
                if (!e.target.checked) setExtraBeds(0);
              }}
            />
            <span className="font-medium">Add Extra Bed(s)</span>
          </label>

          {extraBedsEnabled && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Extra Beds (max {selectedRoom.maxExtraBeds})
              </label>

              <select
                value={extraBeds}
                onChange={(e) => setExtraBeds(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              >
                {Array.from(
                  { length: selectedRoom.maxExtraBeds + 1 },
                  (_, i) => (
                    <option key={i} value={i}>
                      {i} {i === 1 ? "bed" : "beds"}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <p className="text-gray-600">Available Rooms: {availableRooms.length}</p>

      {/* Room dropdown */}
      {availableRooms.length > 0 ? (
        <select
          value={selectedRoom?.roomId ?? ""}
          onChange={(e) => {
            const room = availableRooms.find(
              (r) => r.roomId === Number(e.target.value)
            );
            setSelectedRoom(room ?? null);

            // Reset extra beds on room change
            setExtraBedsEnabled(false);
            setExtraBeds(0);
          }}
          className="w-full p-2 border rounded-md"
        >
          <option value="">
            {selectedRoom ? "Select a different room" : "Select a Room"}
          </option>

          {availableRooms.map((r) => (
            <option key={r.roomId} value={r.roomId}>
              Room {r.roomNumber} — ${r.pricePerNight} | Capacity:{" "}
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
