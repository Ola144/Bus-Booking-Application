import { Component, inject, OnInit } from '@angular/core';
import { IUser } from '../../../model/BusBooking';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { VendorsComponent } from './vendors/vendors.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BusComponent } from './bus/bus.component';
import { LocationComponent } from './location/location.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    UsersComponent,
    VendorsComponent,
    BookingsComponent,
    BusComponent,
    LocationComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  status: string = 'users';

  localUserData!: IUser;

  ngOnInit(): void {
    const localUser = localStorage.getItem('BusBookingUser');
    if (localUser != null) {
      this.localUserData = JSON.parse(localUser);
    }
  }

  setStatus(newStatus: string) {
    this.status = newStatus;
  }
}
