
export interface Booking {
  bookingId?: number;
  customerId?: number;
  roomId?: number;
  customer?: {
    customerId?: number,
    name: string;
    email: string;
    phone: string;
  };
  room?: {
    roomId: number;
    roomNumber: string;
    pricePerNight: number;
    baseCapacity: number;
    maxExtraBeds: number;
    active: boolean;
  };
  startDate: string;    // OR checkIn
  endDate: string;      // OR checkOut
  numPersons: number;
}