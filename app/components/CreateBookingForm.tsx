import { useState } from "react";
import type { Customer } from "~/types/customer";
import type { Room } from "~/types/room";
import type{BookingDto} from "~/types/bookingDto"
interface CreateBookingWizardProps {
  reloadBookings: () => Promise<void>;
}

const BASE_URL = "http://localhost:5051";

export default function CreateBookingForm({
  reloadBookings,
}: CreateBookingWizardProps) {
  // Wizard State
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const [enabledSteps, setEnabledSteps] = useState({
    dates: true,
    room: false,
    customer: false,
    review: false,
  });

  // Fetch available rooms
  const checkAvailability = async () => {
    setErrorMessage("");

    if (!checkIn || !checkOut || guests <= 0) {
      setErrorMessage("Please enter valid dates and number of guests.");
      return;
    }

    try {
      const startUtc = new Date(checkIn).toISOString();
      const endUtc = new Date(checkOut).toISOString();

      const response = await fetch(
        `${BASE_URL}/rooms/available?start=${encodeURIComponent(startUtc)}&end=${encodeURIComponent(endUtc)}&guests=${guests}`
      );

      if (!response.ok) throw new Error("Failed to fetch rooms");

      const rooms = await response.json();
      const activeRooms = rooms.filter((r: Room) => r.active);

      setAvailableRooms(activeRooms);
      setEnabledSteps({
        dates: true,
        room: true,
        customer: true,
        review: true,
      });

      if (activeRooms.length === 0) {
        setErrorMessage(
          "No rooms available for the selected dates and guests."
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load available rooms");
    }
  };

  const confirmBooking = async () => {
    if (!selectedRoom || !customer.name || !customer.email || !customer.phone) {
      setErrorMessage("Please fill in all required fields before confirming.");
      return;
    }

    const bookingDto: BookingDto = {
      roomId: selectedRoom.id,
      checkIn,
      checkOut,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    };

    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDto),
      });

      if (!response.ok) throw new Error("Failed to create booking");

      // Reload list in parent component
      await reloadBookings();

      // Reset form
      setSelectedRoom(null);
      setCustomer({ name: "", email: "", phone: "" });
      setCheckIn("");
      setCheckOut("");
      setGuests(1);
      setAvailableRooms([]);
      setEnabledSteps({
        dates: true,
        room: false,
        customer: false,
        review: false,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create booking");
    }
  };

  const isConfirmEnabled =
    selectedRoom &&
    customer.name &&
    customer.email &&
    customer.phone &&
    checkIn &&
    checkOut;

  return (
    <div className="space-y-6">
      {/* Date Picker Section */}
      <div
        className={`p-4 rounded-xl shadow-md ${enabledSteps.dates ? "bg-white" : "bg-gray-100"}`}
      >
        <h2 className="text-xl font-semibold mb-2">Select Dates</h2>

        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block text-sm mb-1">Number of Guests</label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full p-2 border rounded mb-2"
        />

        <button
          onClick={checkAvailability}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Availability
        </button>

        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>

      {/* Room Section */}
      <div
        className={`p-4 rounded-xl shadow-md ${enabledSteps.room ? "bg-white" : "bg-gray-100"}`}
      >
        <h2 className="text-xl font-semibold mb-2">Select Room</h2>

        {enabledSteps.room && (
          <p className="mb-2">{availableRooms.length} room(s) available</p>
        )}

        <select
          value={selectedRoom?.id ?? ""}
          onChange={(e) =>
            setSelectedRoom(
              availableRooms.find((r) => r.id === Number(e.target.value)) ||
                null
            )
          }
          className="w-full p-2 border rounded"
        >
          <option value="">Select a room</option>
          {availableRooms.map((r) => (
            <option key={r.id} value={r.id}>
              Room {r.roomNumber} - ${r.pricePerNight} | Capacity:{" "}
              {r.baseCapacity}
            </option>
          ))}
        </select>
      </div>

      {/* Customer Section */}
      <div
        className={`p-4 rounded-xl shadow-md ${enabledSteps.customer ? "bg-white" : "bg-gray-100"}`}
      >
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>

        <input
          type="text"
          placeholder="Name"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="email"
          placeholder="Email"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />

        <input
          type="tel"
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
          className="w-full p-2 border rounded mb-2"
        />
      </div>

      {/* Review Section */}
      <div
        className={`p-4 rounded-xl shadow-md ${enabledSteps.review ? "bg-white" : "bg-gray-100"}`}
      >
        <h2 className="text-xl font-semibold mb-2">Review</h2>

        <p>
          <strong>Customer:</strong> {customer.name} ({customer.email},{" "}
          {customer.phone})
        </p>

        <p>
          <strong>Room:</strong> {selectedRoom?.roomNumber}
        </p>

        <p>
          <strong>Dates:</strong> {checkIn} → {checkOut}
        </p>

        <button
          onClick={confirmBooking}
          disabled={!isConfirmEnabled}
          className={`px-4 py-2 rounded text-white ${
            isConfirmEnabled
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirm Booking
        </button>

        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
}
