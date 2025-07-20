import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BusBookingModel,
  BusBookingPassengerModel,
  IBookedSeatNo,
  IBookedSeats,
  IBookingTicket,
  IBus,
  IUser,
} from '../../../model/BusBooking';
import { MasterService } from '../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css',
})
export class BookTicketComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  scheduleId: any;
  scheduleBusList: IBus[] = [];
  seatNoList: number[] = [];

  bookedSchId: string = '';
  bookedSeatNo: number = 0;

  totalSeats: number = 0;

  searchBusResult: any;
  localUser!: IUser;

  selectedSeatArray: BusBookingPassengerModel[] = [];
  selectSeat = {
    passengerName: '',
    age: 0,
    gender: '',
  };
  selectedSeatNo: number = 0;

  bookingTicketObj: BusBookingModel = new BusBookingModel();

  isBookingTicektLoading: boolean = false;

  bookingList: IBookingTicket[] = [];
  passengerList: BusBookingPassengerModel[] = [];
  passengerSeatNo: number[] = [];
  bookedTicketScheduleId: any = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.scheduleId = res.scheduleId;
      this.bookingTicketObj.scheduleId = res.scheduleId;

      this.getScheduleBus();
    });

    this.getAllBookedTicket();

    for (let index = 0; index < this.selectedSeatArray.length; index++) {
      this.selectSeat = this.selectedSeatArray[index];
    }

    const localSearchBus = localStorage.getItem('SearchBusResult');
    if (localSearchBus != null)
      this.searchBusResult = JSON.parse(localSearchBus);

    const localUserData = localStorage.getItem('BusBookingUser');
    if (localUserData != null) {
      this.localUser = JSON.parse(localUserData);
      this.bookingTicketObj.custId = this.localUser.uid;
    }

    // this.masterService.currentJourneyDate$.subscribe((data) => {
    //   this.journeyDate = data;
    // });
  }

  getAllBookedTicket() {
    try {
      this.masterService.getAllBookedBus().then((res: any) => {
        this.bookingList = res;

        this.bookingList.find((item) => {
          this.bookedTicketScheduleId = item.scheduleId;
        });

        for (let index = 0; index < this.bookingList.length; index++) {
          this.passengerList = this.bookingList[index].busBookingPassengers;

          for (let index = 0; index < this.passengerList.length; index++) {
            const seat = this.passengerList[index].seatNo;
            this.passengerSeatNo.push(seat);
          }
        }
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  getScheduleBus() {
    this.masterService
      .getScheduleBus(this.scheduleId)
      .then((res: any) => {
        this.scheduleBusList = res;

        for (let index = 0; index < this.scheduleBusList.length; index++) {
          const seats = this.scheduleBusList[index].totalSeats;

          for (let index = 1; index <= seats; index++) {
            this.seatNoList.push(index);
          }
        }
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }

  checkIfSeatSelected(seatNo: number) {
    const check = this.selectedSeatArray.find((item) => item.seatNo === seatNo);
    if (check == undefined) {
      return false;
    } else {
      return true;
    }
  }

  checkIfSeatBooked(seatNo: number) {
    let checkSeatNo = this.passengerList.find((item) => item.seatNo === seatNo);

    if (checkSeatNo === undefined) {
      return false;
    } else {
      return true;
    }
  }

  onSelectSeatNo(seatNo: number) {
    const isSeatSelected = this.selectedSeatArray.findIndex(
      (item) => item.seatNo === seatNo
    );

    if (isSeatSelected != -1) {
      this.selectedSeatArray.splice(isSeatSelected, 1);
    } else {
      const newPassengerData: any = {
        passengerId: Math.pow(Math.random(), 0).toString(),
        seatNo: seatNo,
      };
      this.selectedSeatArray.push(newPassengerData);
    }
    this.selectedSeatNo = seatNo;
  }

  async bookTicket() {
    this.isBookingTicektLoading = true;
    this.bookingTicketObj.busBookingPassengers = this.selectedSeatArray;
    await this.masterService
      .bookTicket(
        this.bookingTicketObj,
        this.searchBusResult,
        this.selectSeat,
        this.localUser.emailId,
        this.localUser.fullName
      )
      .then(() => {
        this.toastr.success('Ticket Booked Successfully!');
        this.getAllBookedTicket();
        this.isBookingTicektLoading = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isBookingTicektLoading = false;
      });
  }
}
