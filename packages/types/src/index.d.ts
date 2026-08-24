export type BookingStatus = "unconfirmed" | "checked-in" | "checked-out";

export interface Cabin {
  id: number;
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  image: string;
}

export interface Booking {
  id: number;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  status: BookingStatus;
  totalPrice: number;
  cabinId: number;
  guestId: number;
}
