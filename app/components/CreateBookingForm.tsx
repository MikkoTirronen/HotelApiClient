import { useState } from "react";
import type { Customer } from "~/types/customer";
import type { Room } from "~/types/room";
import type { BookingDto } from "~/types/bookingDto";
import { useToast } from "~/context/ToastContext";
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
  const [customerResults, setCustomerResults] = useState<Customer[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
  });
  const { addToast } = useToast();
  const [errorMessage, setErrorMessage] = useState("");

  const [enabledSteps, setEnabledSteps] = useState({
    dates: true,
    room: false,
    customer: false,
    review: false,
  });
  let searchTimeout: NodeJS.Timeout;

  const searchCustomers = (name: string) => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(async () => {
      if (name.length < 2) {
        setCustomerResults([]);
        return;
      }

      const res = await fetch(`${BASE_URL}/customers/search?query=${name}`);
      if (!res.ok) return;

      const data = await res.json();
      setCustomerResults(data);
      setShowDropdown(true);
    }, 300);
  };

  const selectCustomer = (c: Customer) => {
    setCustomer({
      name: c.name,
      email: c.email,
      phone: c.phone,
      customerId: c.customerId, // optional if backend needs it
    });

    setCustomerResults([]);
    setShowDropdown(false);
  };

  // Fetch available rooms
  const checkAvailability = async () => {
    setErrorMessage("");

    if (!checkIn || !checkOut || guests <= 0) {
      setErrorMessage("Please enter valid dates and number of guests.");
      addToast(errorMessage, "error");
      return;
    }

    try {
      const startUtc = new Date(checkIn).toISOString();
      const endUtc = new Date(checkOut).toISOString();

      const response = await fetch(
        `${BASE_URL}/rooms/available?start=${encodeURIComponent(startUtc)}&end=${encodeURIComponent(endUtc)}&guests=${guests}`
      );

      if (!response.ok) {
        addToast("Failed to fetch rooms", "error");
        throw new Error("Failed to fetch rooms");
      }

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
        addToast(errorMessage, "error");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load available rooms");
      addToast(errorMessage, "error");
    }
  };

  const confirmBooking = async () => {
    if (!selectedRoom || !customer.name || !customer.email || !customer.phone) {
      setErrorMessage("Please fill in all required fields before confirming.");
      addToast(errorMessage, "error");
      return;
    }

    const bookingDto: BookingDto = {
      roomId: selectedRoom.roomId,
      startDate: new Date(checkIn).toISOString(),
      EndDate: new Date(checkOut).toISOString(),
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

      if (!response.ok) {
        addToast("Failed to create booking", "error");
        throw new Error("Failed to create booking");
      }

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
      addToast("Booking created!", "success");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create booking");
      addToast(errorMessage, "error");
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
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Date Picker Section */}
      <div
        className={`p-6 rounded-xl shadow-md ${
          enabledSteps.dates ? "bg-white" : "bg-gray-100"
        }`}
      >
        <h2 className="text-xl font-semibold mb-4">Select Dates</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Number of Guests</label>
          <input
            type="number"
            min={1}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={checkAvailability}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Check Availability
        </button>

        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>

      {/* Room Section */}
      {enabledSteps.room && (
        <div className="p-6 rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Select Room</h2>

          <p className="mb-2">{availableRooms.length} room(s) available</p>
          <select
            value={selectedRoom?.roomId ?? ""}
            onChange={(e) =>
              setSelectedRoom(
                availableRooms.find(
                  (r) => r.roomId === Number(e.target.value)
                ) || null
              )
            }
            className="w-full p-2 border rounded"
          >
            <option value="">Select a room</option>
            {availableRooms.map((r) => (
              <option key={r.roomId} value={r.roomId}>
                Room {r.roomNumber} - ${r.pricePerNight} | Capacity:{" "}
                {r.baseCapacity}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Customer Section */}
      {enabledSteps.customer && (
        <div className="p-6 rounded-xl shadow-md bg-white relative">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

          {/* Name Search */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Name"
              value={customer.name}
              onChange={(e) => {
                const name = e.target.value;
                setCustomer({ ...customer, name });
                searchCustomers(name);
              }}
              className="w-full p-2 border rounded"
            />

            {showDropdown && customerResults.length > 0 && (
              <div className="absolute z-20 bg-white border rounded-lg shadow-md w-full max-h-56 overflow-y-auto mt-1">
                {customerResults.map((c) => (
                  <div
                    key={c.customerId}
                    onClick={() => selectCustomer(c)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <p className="font-semibold text-gray-800">{c.name}</p>
                    <p className="text-sm text-gray-600">{c.email}</p>
                    <p className="text-sm text-gray-600">{c.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {/* Review Section */}
      {enabledSteps.review && (
        <div className="p-6 rounded-xl shadow-md bg-white space-y-4">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
            Review Booking
          </h2>

          {/* Customer Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-1">Customer</h3>
            <p>
              <strong>Name:</strong> {customer.name}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
          </div>

          {/* Room Info */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-1">Room</h3>
            <p>{selectedRoom?.roomNumber}</p>
          </div>

          {/* Dates */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-1">Dates</h3>
            <p>
              {checkIn} → {checkOut}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 items-start sm:items-center">
            <button
              onClick={confirmBooking}
              disabled={!isConfirmEnabled}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition ${
                isConfirmEnabled
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Booking
            </button>

            <button
              type="button"
              onClick={() => {
                // Reset all form state
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
                setErrorMessage("");
              }}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Clear / Cancel
            </button>

            {errorMessage && (
              <p className="text-red-600 mt-2 sm:mt-0">{errorMessage}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
