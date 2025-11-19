import { useState, useEffect } from "react";
import BookingListComponent from "~/components/BookingListComponent";
import BookingSearch from "~/components/BookingSearch";
import BookingUpdateForm from "~/components/BookingUpdateComponent";
import CreateBookingForm from "~/components/CreateBookingForm";
import Header from "~/components/HeaderComponent";
import MainNavVertical from "~/components/MainNavVertical";
import NavTabs from "~/components/NavTabsComponent";
import type { Booking } from "~/types/booking";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const BASE_URL = "http://localhost:5051"
  const loadBookings = async () => {
    const response = await fetch(`${BASE_URL}/bookings`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    const data = await response.json();
    setBookings(data);
  };

  const tabs = ["All", "Create", "Search"];

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-48 bg-gray-100 p-6 space-y-4  shrink-0 pt-40">
        <MainNavVertical />
      </aside>

      <main className="flex-1 flex justify-center p-6">
        <div className="w-full max-w-3xl space-y-4">
          <Header />
          <NavTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />

          {activeTab === "All" && (
            <>
              <BookingListComponent
                bookings={bookings}
                onBookingClick={(booking) => setSelectedBooking(booking)}
              />

              {selectedBooking && (
                <div className="mt-6">
                  <BookingUpdateForm
                    booking={selectedBooking}
                    onUpdate={() => {
                      loadBookings();
                      setSelectedBooking(null);
                    }}
                    onCancel={() => setSelectedBooking(null)}
                  />
                </div>
              )}
            </>
          )}

          {activeTab === "Create" && (
            <CreateBookingForm reloadBookings={loadBookings} />
          )}

          {activeTab === "Search" && <BookingSearch />}
        </div>
      </main>
    </div>
  );
}
