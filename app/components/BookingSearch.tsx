import { useState } from "react";
import type { Booking } from "~/types/booking";

export default function BookingSearch() {
  const [customer, setCustomer] = useState("");
  const [room, setRoom] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState("");
  const [bookingId, setBookingId] = useState("");

  const [results, setResults] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  function handleClear() {
    setCustomer("");
    setRoom("");
    setStartDate("");
    setEndDate("");
    setGuests("");
    setBookingId("");
    setResults([]);
  }
  async function handleSearch() {
    setLoading(true);

    const params = new URLSearchParams();

    if (customer) params.append("customer", customer);
    if (room) params.append("room", room);
    if (bookingId) params.append("bookingId", bookingId);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (guests) params.append("guests", guests);

    try {
      const response = await fetch(
        `http://localhost:5051/bookings/search/existing?${params.toString()}`
      );

      const data = await response.json();
      setResults(data);
    } catch {
      alert("Search failed");
    }

    setLoading(false);
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Search Bookings</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Customer name or email"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Room number"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Booking ID"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        <button
          onClick={handleClear}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          type="button"
        >
          Clear
        </button>
      </div>
      <hr />

      <h3 className="text-lg font-semibold">Results</h3>

      {results.length === 0 && <p>No results found.</p>}

      <ul className="space-y-2">
        {results.map((b) => (
          <li key={b.bookingId} className="border p-3 rounded shadow-sm">
            <p>
              <b>ID:</b> {b.bookingId}
            </p>
            <p>
              <b>Customer:</b> {b.customer?.name}
            </p>
            <p>
              <b>Room:</b> {b.room?.roomNumber}
            </p>
            <p>
              <b>Dates:</b> {b.startDate} → {b.endDate}
            </p>
            <p>
              <b>Guests:</b> {b.numPersons}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
