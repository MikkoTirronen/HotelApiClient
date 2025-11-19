export interface Room {
  roomId: number;
  roomNumber: string;
  pricePerNight: number;
  baseCapacity: number;
  maxExtraBeds: number;
  amenities?: string[] | null;
  active: boolean;
}