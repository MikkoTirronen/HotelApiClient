
export interface Booking {
  id: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  room: {
    id: number;
    roomNumber: string;
    pricePerNight: number;
  };
  startDate: string;    // OR checkIn
  endDate: string;      // OR checkOut
}