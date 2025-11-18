export interface BookingDto {
  roomId: number;
  checkIn: string;
  checkOut: string;
  notes?: string;
  name: string;
  email: string;
  phone?: string;
}