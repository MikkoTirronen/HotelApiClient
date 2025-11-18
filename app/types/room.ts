export interface Room {
  id: number;
  roomNumber: string;
  pricePerNight: number;
  baseCapacity: number;
  maxExtraBeds: number;
  amenities?: string[] | null;
  active: boolean;
}