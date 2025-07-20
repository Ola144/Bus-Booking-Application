import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of } from 'rxjs';
import {
  BusBookingModel,
  BusModel,
  IAPIResponse,
  IBookedSeatNo,
  IBookedSeats,
  IBookingTicket,
  IBus,
  ILocation,
  IUser,
  IVendor,
  LocationModel,
  LoginModel,
  UserModel,
  VendorModel,
} from '../../model/BusBooking';

import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from '@angular/fire/auth';
import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  apiUrl: string = '/api/BusBooking/';

  private journeyDate = new BehaviorSubject<any>(null);
  currentJourneyDate$ = this.journeyDate.asObservable();

  http: HttpClient = inject(HttpClient);

  onLogin$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  onBookedSeatNoDeleted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  userData!: UserModel;

  constructor(private firestore: Firestore, private auth: Auth) {
    const localData = localStorage.getItem('BusBookingUser');
    if (localData != null) {
      this.userData = JSON.parse(localData);
    }
  }

  updateJourneyDate(data: any) {
    this.journeyDate.next(data);
  }

  isLoggedIn() {
    return !!localStorage.getItem('BusBookingUser');
  }

  // User API Crud Operations
  async signUpUser(obj: UserModel): Promise<void> {
    let { emailId, password, fullName, role } = obj;

    const credential = await createUserWithEmailAndPassword(
      this.auth,
      emailId,
      password
    );
    const userId = credential.user.uid;
    await setDoc(doc(this.firestore, 'users', userId), {
      uid: userId,
      emailId,
      password,
      fullName,
      role,
      time: Timestamp.now(),
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
    });
  }

  async logInUser(obj: UserModel) {
    let { emailId, password, fullName, role } = obj;

    const credential = await signInWithEmailAndPassword(
      this.auth,
      emailId,
      password
    );
    const userId = credential.user.uid;

    const userDocRef = doc(this.firestore, 'users', userId);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      const user = userSnap.data();
      localStorage.setItem('BusBookingUser', JSON.stringify(user));
      return user;
    } else {
      throw new Error('User data not found in Firestore!');
    }
  }

  async updateUserProfile(userDetails: {
    emailId: string;
    fullName: string;
    role: string;
    password: string;
    projectName: string;
  }): Promise<void> {
    const user: User | null = this.auth.currentUser!;
    const toastr = inject(ToastrService);

    if (!user) toastr.error('No user is currently logged in');

    // Update Firebase Auth Profile
    await updateProfile(user, {
      displayName: userDetails.emailId,
    });

    // Update Firestore user document
    const userRef = doc(this.firestore, `users/${user?.uid}`);
    await updateDoc(userRef, {
      fullName: userDetails.fullName,
      emailId: userDetails.emailId,
      password: userDetails.password,
    });
  }

  async getAllUser() {
    const userRef = collection(this.firestore, 'users');
    const snapshot = await getDocs(userRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as IUser) }));
  }

  async updateUser(obj: any, uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    await updateDoc(userDocRef, obj);
  }

  async deleteUserById(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    await deleteDoc(userDocRef);
  }

  async getUserById(uid: string) {
    const userRef = collection(this.firestore, 'users');

    const q = query(userRef, where('uid', '==', uid));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IUser),
    }));
  }

  // Bus API Crud Operation
  async createBus(obj: any) {
    const busRef = collection(this.firestore, 'buses');
    const newDocRef: DocumentReference = doc(busRef);
    const scheduleDocRef: DocumentReference = doc(busRef);
    const busWithId = {
      busId: newDocRef.id,
      scheduleId: scheduleDocRef.id,
      ...obj,
    };
    await setDoc(newDocRef, busWithId);
  }

  async getSearchBus(fromLocationId: any, toLocationId: any) {
    const busRef = collection(this.firestore, 'buses');

    // Example: Filter by status = 'active' and category = 'electronics'
    const q = query(
      busRef,
      where('fromLocationName', '==', fromLocationId),
      where('toLocationName', '==', toLocationId)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IBus),
    }));
  }

  async getScheduleBus(scheduleId: string) {
    const busRef = collection(this.firestore, 'buses');

    const q = query(busRef, where('scheduleId', '==', scheduleId));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IBus),
    }));
  }

  async getAllBus() {
    const busRef = collection(this.firestore, 'buses');

    const q = query(busRef);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as IBus),
    }));
  }

  async updateBus(obj: any, busId: string) {
    const busDocRef = doc(this.firestore, 'buses', busId);
    await updateDoc(busDocRef, obj);
  }

  async deleteBusById(busId: string) {
    const busDocRef = doc(this.firestore, 'buses', busId);
    await deleteDoc(busDocRef);
  }

  // LOCATION API CRUD OPERATIONS
  async createLocation(obj: LocationModel) {
    const locationRef = collection(this.firestore, 'locations');
    const newDocRef: DocumentReference = doc(locationRef);
    const locationWithId = {
      locationId: newDocRef.id,
      ...obj,
    };
    await setDoc(newDocRef, locationWithId);
  }

  async getAllLocation(): Promise<ILocation[]> {
    const locationRef = collection(this.firestore, 'locations');
    const snapshot = await getDocs(locationRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as ILocation) }));
  }

  async deleteLocationById(locationId: string) {
    const locationRef = doc(this.firestore, 'locations', locationId);
    return deleteDoc(locationRef);
  }

  async updateLocation(obj: any, locationId: string) {
    const locationRef = doc(this.firestore, 'locations', locationId);
    return updateDoc(locationRef, obj);
  }

  // Vendor API Crud Operations
  async getAllVendors() {
    const vendorRef = collection(this.firestore, 'vendors');
    const snapshot = await getDocs(vendorRef);
    return snapshot.docs.map((doc) => ({ ...(doc.data() as IVendor) }));
  }

  async creteatVendor(obj: VendorModel) {
    const vendorRef = collection(this.firestore, 'vendors');
    const newDocRef: DocumentReference = doc(vendorRef);
    const busWithId = {
      vendorId: newDocRef.id,
      ...obj,
    };
    await setDoc(newDocRef, busWithId);
  }

  async updateBusVendor(obj: any, vendorId: string) {
    const vendorDocRef = doc(this.firestore, 'vendors', vendorId);
    await updateDoc(vendorDocRef, obj);
  }

  deleteBusVendorById(vendorId: string) {
    const vendorDocRef = doc(this.firestore, 'vendors', vendorId);
    return deleteDoc(vendorDocRef);
  }

  // Booking Ticket Crud Operation
  async bookTicket(
    obj: any,
    locationObj: any,
    passengerObj: any,
    emailId: string,
    customerName: string
  ) {
    const ticketRef = collection(this.firestore, 'tickets');

    const bookingIdRef: DocumentReference = doc(ticketRef);
    // const passengerIdRef: DocumentReference = doc(ticketRef);
    const busWithId = {
      bookingId: bookingIdRef.id,
      // passengerId: passengerIdRef.id,
      emailId,
      customerName,
      bookingDate: new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }),
      ...obj,
      ...locationObj,
      ...passengerObj,
    };
    await setDoc(bookingIdRef, busWithId);
  }

  async getAllBookedBus() {
    const ticketRef = collection(this.firestore, 'tickets');

    const q = query(ticketRef);

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as BusBookingModel),
    }));
  }

  async getAllBookedBusByUserId(custId: string) {
    const ticketRef = collection(this.firestore, 'tickets');

    const q = query(ticketRef, where('custId', '==', custId));

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as IBookingTicket),
    }));
  }

  async updateBookedTicket(obj: any, locationObj: any, bookingId: string) {
    const ticketDocRef = doc(this.firestore, 'tickets', bookingId);
    await updateDoc(ticketDocRef, obj, locationObj);
  }

  deleteBookedTicketById(bookingId: string) {
    const ticketDocRef = doc(this.firestore, 'tickets', bookingId);
    return deleteDoc(ticketDocRef);
  }
}
