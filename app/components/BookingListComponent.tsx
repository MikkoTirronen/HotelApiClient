import type { Booking } from "~/types/booking";

interface BookingListProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
}

export default function BookingListComponent({
  bookings,
  onBookingClick,
}: BookingListProps) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">All Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 italic">No bookings available.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((b) => {
            // Map numeric status to text
            let statusText = "";
            let statusClasses = "";

            switch (b.status) {
              case 0:
                statusText = "Pending";
                statusClasses = "bg-yellow-100 text-yellow-800";
                break;
              case 1:
                statusText = "Confirmed";
                statusClasses = "bg-green-100 text-green-800";
                break;
              case 2:
                statusText = "Canceled";
                statusClasses = "bg-red-100 text-red-800";
                break;
              default:
                statusText = "Unknown";
                statusClasses = "bg-gray-100 text-gray-800";
            }

            return (
              <li
                key={b.bookingId}
                onClick={() => onBookingClick(b)}
                className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-4 border rounded-xl shadow-sm cursor-pointer transition hover:shadow-md hover:bg-gray-50"
              >
                <div className="flex flex-col md:flex-row md:gap-4 items-start md:items-center">
                  <span className="text-gray-900 font-semibold">
                    {b.customer?.name}
                  </span>
                  <span className="text-gray-700">booked room</span>
                  <span className="text-blue-600 font-medium">
                    {b.room?.roomNumber}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-2 md:mt-0">
                  <div className="text-gray-600">
                    {new Date(b.startDate).toLocaleDateString()} -{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </div>

                  <span
                    className={`mt-1 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${statusClasses}`}
                  >
                    {statusText}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
