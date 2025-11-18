import type { Booking } from "~/types/booking";

interface BookingListProps {
  bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
  console.log(bookings);
  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-3">All Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings available.</p>
      ) : (
        <ul className="space-y-2">
          {bookings.map((b) => (
            <li key={b.id} className="p-3 border rounded shadow-sm">
              <strong>{b.customer?.name}</strong> booked room{" "}
              <strong>{b.room?.roomNumber}</strong> from{" "}
              {new Date(b.startDate).toLocaleDateString()} to{" "}
              {new Date(b.endDate).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
