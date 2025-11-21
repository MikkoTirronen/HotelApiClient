import { useEffect, useState } from "react";
import type { Room } from "~/types/room";
import type { Customer } from "~/types/customer";
import type { Booking } from "~/types/booking";
import UpdateBookingRoomSelect from "./UpdateBookingRoomSelect";
import { useToast } from "~/context/ToastContext";

interface BookingUpdateFormProps {
  booking: Booking;
  onUpdate: () => void; // reload bookings in parent
  onCancel: () => void; // cancel editing
}

const BASE_URL = "http://localhost:5051";

interface UpdateBookingDto {
  customerId?: number;
  roomId?: number;
  startDate?: string;
  endDate?: string;
  numPersons?: number;
  extraBedsCount?: number;
}

export default function BookingUpdateForm({
  booking,
  onUpdate,
  onCancel,
}: BookingUpdateFormProps) {
  const [checkIn, setCheckIn] = useState(booking.startDate.slice(0, 10));
  const [checkOut, setCheckOut] = useState(booking.endDate.slice(0, 10));
  const [guests, setGuests] = useState(booking.numPersons || 1);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(
    booking.room || null
  );
  const [extraBeds, setExtraBeds] = useState<number>(
    booking.extraBedsCount || 0
  );
  const { addToast } = useToast();
  const [customer, setCustomer] = useState<Customer>({
    name: booking.customer?.name || "",
    email: booking.customer?.email || "",
    phone: booking.customer?.phone || "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  // Check room availability whenever dates or guests change
  useEffect(() => {
    setErrorMessage("");
    const checkAvailability = async () => {
      if (!checkIn || !checkOut || guests <= 0) return;

      try {
        const startUtc = new Date(checkIn).toISOString();
        const endUtc = new Date(checkOut).toISOString();

        const res = await fetch(
          `${BASE_URL}/rooms/available?start=${encodeURIComponent(
            startUtc
          )}&end=${encodeURIComponent(endUtc)}&guests=${guests}`
        );
        if (!res.ok) throw new Error("Failed to fetch available rooms");
        const rooms: Room[] = await res.json();
        setAvailableRooms(rooms.filter((r) => r.active));
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to load rooms");
        addToast(errorMessage, "error");
      }
    };

    checkAvailability();
  }, [checkIn, checkOut, guests]);

  const updateBooking = async () => {
    if (
      !selectedRoom ||
      !booking.customerId ||
      !checkIn ||
      !checkOut ||
      guests <= 0
    ) {
      setErrorMessage("Please fill in all required fields before updating.");
      addToast(errorMessage, "error");
      return;
    }

    const updateDto: UpdateBookingDto = {
      customerId: booking.customer?.customerId,
      roomId: selectedRoom.roomId,
      startDate: new Date(checkIn).toISOString(),
      endDate: new Date(checkOut).toISOString(),
      numPersons: guests,
      extraBedsCount: extraBeds,
    };

    try {
      const response = await fetch(
        `${BASE_URL}/bookings/${booking.bookingId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateDto),
        }
      );

      if (!response.ok) {
        addToast("Failed to update booking!", "error");
        throw new Error("Failed to update booking");
      }

      addToast("Booking updated!", "success");
      onUpdate();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update booking");
      addToast(errorMessage, "error");
    }
  };

  const isSubmitEnabled =
    selectedRoom !== null &&
    customer.name.trim() !== "" &&
    customer.email.trim() !== "" &&
    customer.phone.trim() !== "" &&
    checkIn &&
    checkOut;

  const deleteBooking = async () => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(
        `${BASE_URL}/bookings/${booking.bookingId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        addToast("Failed to delete booking", "error");
        throw new Error("Failed to delete booking");
      }

      addToast("Booking deleted!", "info");
      onUpdate(); // reload parent bookings
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to delete booking");
      addToast(errorMessage, "error");
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-3 relative">
      {/* Delete button in top-right corner */}
      <button
        onClick={deleteBooking}
        className="absolute top-2 right-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Delete
      </button>
      <h2 className="text-xl font-semibold">Update Booking</h2>

      <div>
        <label>Check-in</label>
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Check-out</label>
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full p-2 border rounded"
        />
      </div>

      <UpdateBookingRoomSelect
        booking={booking}
        availableRooms={availableRooms}
        setAvailableRooms={setAvailableRooms}
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        BASE_URL={BASE_URL}
        extraBeds={extraBeds}
        setExtraBeds={setExtraBeds}
      />

      <div>
        <label>Name</label>
        <input
          type="text"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Email</label>
        <input
          type="email"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          type="tel"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <div className="flex justify-between">
        <button
          onClick={updateBooking}
          disabled={!isSubmitEnabled}
          className={`px-4 py-2 rounded text-white ${
            isSubmitEnabled
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Update Booking
        </button>

        <button
          onClick={onCancel}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
        >
          Cancel Update
        </button>
      </div>
    </div>
  );
}
