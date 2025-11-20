import { useEffect, useState, type ReactNode } from "react";
import BookingUpdateComponent from "./BookingUpdateComponent";

export default function BookingSearch() {
  const [customer, setCustomer] = useState("");
  const [room, setRoom] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [guests, setGuests] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const handleSearch = async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (customer) params.append("customer", customer);
    if (room) params.append("room", room);
    if (bookingId) params.append("bookingId", bookingId);
    if (guests) params.append("guests", guests);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await fetch(
      `http://localhost:5051/bookings/search/existing?${params.toString()}`
    );
    const data = await res.json();

    setResults(data);
    setLoading(false);
  };

  const handleClear = () => {
    setCustomer("");
    setRoom("");
    setBookingId("");
    setGuests("");
    setStartDate("");
    setEndDate("");
    setResults([]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    const res = await fetch(`/bookings/${id}`, { method: "DELETE" });

    if (res.ok) {
      setResults((prev) => prev.filter((b) => b.bookingId !== id));
    } else {
    }
  };

  return (
    <div className="p-4 space-y-4">
      

      {selectedBooking ? (
        <BookingUpdateComponent
          onUpdate={() => {
            handleSearch();
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          onCancel={() => setSelectedBooking(null)}
        />
      ) : (
        <>
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
              <li
                key={b.bookingId}
                className="border p-3 rounded shadow-sm flex justify-between"
              >
                <div>
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
                </div>

                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDelete(b.bookingId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
      
    </div>
  );
}
