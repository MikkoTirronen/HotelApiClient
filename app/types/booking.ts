
export interface Booking {
  id: number;
  customer: {
    id?: number,
    name: string;
    email: string;
    phone: string;
  };
  room: {
    id: number;
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