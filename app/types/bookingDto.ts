export interface BookingDto {
  roomId: number;
  startDate: string;
  EndDate: string;
  notes?: string;
  name: string;
  email: string;
  phone?: string;
  extraBedsCount?: number;
}