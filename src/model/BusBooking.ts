export interface IAPIResponse {
  message: string;
  result: boolean;
  data: any;
}

export interface IUser {
  uid: string;
  emailId: string;
  fullName: string;
  role: string;
  password: string;
  projectName: string;
  date: any;
}

export interface ILocation {
  locationId: string;
  locationName: string;
}

export interface IVendor {
  vendorId: string;
  vendorName: string;
  contactNo: string;
  emailId: string;
}

export interface IBus {
  busId: string;
  availableSeats: number;
  totalSeats: number;
  price: number;
  arrivalTime: string; // Use Date if needed
  departureTime: string; // Use Date if needed
  scheduleId: string;
  busName: string;
  busVehicleNo: string;
  fromLocationName: string;
  toLocationName: string;
  vendorName: string;
  scheduleDate: string; // or Date
  vendorId: string;
}

export class BookedSeatModel {
  seatNo: BusBookingPassengerModel[];

  constructor() {
    this.seatNo = [];
  }
}

export interface IBookedSeats {
  bookedSeatId: string;
  seatNo: number;
  custId: string;
  seats: [
    {
      age: number;
      gender: string;
      passengerId: string;
      passengerName: string;
      seatNo: number;
    }
  ];
}

export interface IBookedSeatNo {
  scheduleId: string;
  seatNo: number;
}

export class LocationModel {
  locationName: string;

  constructor() {
    this.locationName = '';
  }
}

export class UserModel {
  emailId: string;
  fullName: string;
  role: string;
  password: string;
  projectName: string;

  constructor() {
    this.emailId = '';
    this.fullName = '';
    this.role = 'Customer';
    this.password = '';
    this.projectName = 'Bus Booking';
  }
}

export class LoginModel {
  userName: string;
  password: string;

  constructor() {
    this.userName = '';
    this.password = '';
  }
}

export class VendorModel {
  vendorName: string;
  contactNo: string;
  emailId: string;

  constructor() {
    this.vendorName = '';
    this.contactNo = '';
    this.emailId = '';
  }
}

export class SearchModel {
  fromLocationId: string;
  toLocationId: string;
  date: string;

  constructor() {
    this.fromLocationId = '';
    this.toLocationId = '';
    this.date = '';
  }
}

export class BusModel {
  availableSeats: number;
  totalSeats: number;
  price: number;
  arrivalTime: string; // Use Date if needed
  departureTime: string; // Use Date if needed
  scheduleId: string;
  busName: string;
  busVehicleNo: string;
  fromLocationName: string;
  toLocationName: string;
  vendorName: string;
  scheduleDate: string; // or Date
  vendorId: string;

  constructor() {
    this.availableSeats = 0;
    this.totalSeats = 0;
    this.price = 0;
    this.arrivalTime = '';
    this.departureTime = '';
    this.scheduleId = '';
    this.busName = '';
    this.busVehicleNo = '';
    this.fromLocationName = '';
    this.toLocationName = '';
    this.vendorName = '';
    this.scheduleDate = '';
    this.vendorId = '';
  }
}

export class BusBookingModel {
  custId: string;
  scheduleId: string;
  busBookingPassengers: BusBookingPassengerModel[];

  constructor() {
    this.custId = '';
    this.scheduleId = '';
    this.busBookingPassengers = [];
  }
}

export class BusBookingPassengerModel {
  passengerId: string;
  passengerName: string;
  age: number;
  gender: string;
  seatNo: number;

  constructor() {
    this.passengerId = '';
    this.passengerName = '';
    this.age = 0;
    this.gender = '';
    this.seatNo = 0;
  }
}

export interface IBookingTicket {
  age: number;
  passengerName: string;
  gender: string;
  fromLocation: string;
  toLocation: string;
  dateOfJourney: string;
  bookingId: string;
  custId: string;
  customerName: string;
  emailId: string;
  bookingDate: string;
  scheduleId: string;
  busBookingPassengers: BusBookingPassengerModel[];
}
