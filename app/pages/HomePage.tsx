import { useEffect, useState } from "react";
import BookingListComponent from "~/components/BookingListComponent";
import CreateBookingForm from "~/components/CreateBookingForm";
import Header from "~/components/HeaderComponent";

import NavTabs from "~/components/NavTabsComponent";
import type { Booking } from "~/types/booking";

const BASE_URL = "http://localhost:5051";

export default function HomePage() {
  // const [activeTab, setActiveTab] = useState("Bookings");
  // const [bookings, setBookings] = useState<Booking[]>([]);

  // const loadBookings = async () => {
  //   const response = await fetch(`${BASE_URL}/bookings`);
  //   if (!response.ok) throw new Error("Failed to fetch bookings");
  //   const data = await response.json();
  //   setBookings(data);
  // };

  // useEffect(() => {
  //   loadBookings();
  // }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* <Header />
       <NavTabs activeTab={activeTab} onChange={setActiveTab} /> 

      {activeTab === "Create Booking" && (
        <CreateBookingForm reloadBookings={loadBookings} />
      )}

      {activeTab === "Bookings" && <BookingListComponent bookings={bookings} />} */}
    </div>
  );
}
