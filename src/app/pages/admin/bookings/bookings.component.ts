import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { IBookingTicket, IUser } from '../../../../model/BusBooking';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bookings',
  imports: [CommonModule],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
})
export class BookingsComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  bookingList: IBookingTicket[] = [];
  bookingId: string = '';
  isConfirmBookedTicketDelete: boolean = false;
  isDeleteBookedTicketLoading: boolean = false;

  localUserData!: IUser;

  ngOnInit(): void {
    this.getAllBookedTicket();

    const localUser = localStorage.getItem('BusBookingUser');
    if (localUser != null) {
      this.localUserData = JSON.parse(localUser);
    }
  }

  getAllBookedTicket() {
    try {
      this.masterService.getAllBookedBus().then((res: any) => {
        this.bookingList = res;
        console.log(res);
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  onDeleteTicket(bookingId: string) {
    this.bookingId = bookingId;
    this.isConfirmBookedTicketDelete = true;
    window.scrollTo(0, 0);
  }

  deleteBookedTicket() {
    this.isDeleteBookedTicketLoading = true;
    this.masterService
      .deleteBookedTicketById(this.bookingId)
      .then(() => {
        this.toastr.success('Booked Ticket Deleted Successfully!');
        this.getAllBookedTicket();
        this.isConfirmBookedTicketDelete = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isDeleteBookedTicketLoading = true;
      });
  }
}
