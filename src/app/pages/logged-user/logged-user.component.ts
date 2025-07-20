import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MasterService } from '../../service/master.service';
import {
  BusBookingModel,
  IBookingTicket,
  IUser,
  UserModel,
} from '../../../model/BusBooking';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-logged-user',
  imports: [CommonModule, FormsModule],
  templateUrl: './logged-user.component.html',
  styleUrl: './logged-user.component.css',
})
export class LoggedUserComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  @ViewChild('signupPassword') signupPassword: ElementRef | any;

  signupObj: UserModel = new UserModel();
  userId: string = '';

  localUser!: IUser;
  localBookedSeat: any;

  userList: IUser[] = [];
  bookingList: IBookingTicket[] = [];
  bookingId: string = '';

  isDeleteTicketLoading: boolean = false;
  isConfirmDeletTicketVisible: boolean = false;

  isShowSignUpPasswordIconVisible: boolean = false;
  isSignupLoading: boolean = false;

  isUpdateUserFormVisible: boolean = false;

  ngOnInit(): void {
    const localUserData = localStorage.getItem('BusBookingUser');
    if (localUserData != null) {
      this.localUser = JSON.parse(localUserData);
    }

    const localBookedSeatData = localStorage.getItem('BookedSeatNo');
    if (localBookedSeatData != null) {
      this.localBookedSeat = JSON.parse(localBookedSeatData);
    }

    this.getUserById(this.localUser.uid);
    this.getBookedBusByUserId(this.localUser.uid);
  }

  async getUserById(userId: string) {
    await this.masterService
      .getUserById(userId)
      .then((res) => {
        this.userList = res;
        // console.log(res);
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }

  async getBookedBusByUserId(userId: string) {
    await this.masterService
      .getAllBookedBusByUserId(userId)
      .then((res) => {
        this.bookingList = res;
        // console.log(res);
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }

  onDeleteTicket(bookingId: string) {
    window.scrollTo(0, 0);
    this.bookingId = bookingId;
    this.isConfirmDeletTicketVisible = true;
  }

  async deleteTicket() {
    await this.masterService
      .deleteBookedTicketById(this.bookingId)
      .then(() => {
        this.toastr.success('Booked Ticket Deleted Successfully!');
        this.getBookedBusByUserId(this.localUser.uid);
        this.isConfirmDeletTicketVisible = false;
        this.masterService.onBookedSeatNoDeleted$.next(true);
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }

  onEditUser(userObj: IUser) {
    this.signupObj = userObj;
    this.userId = userObj.uid;
    this.isUpdateUserFormVisible = true;
    window.scrollTo(0, 0);
  }

  updateUser() {
    this.isSignupLoading = true;
    this.masterService
      .updateUser(this.signupObj, this.userId)
      .then(() => {
        this.toastr.success('Your Dtails Updated Succesfully!');
        this.getBookedBusByUserId(this.localUser.uid);
        this.isSignupLoading = false;
        this.isUpdateUserFormVisible = false;
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isSignupLoading = false;
      });
  }

  showSignupPassword() {
    if (this.signupPassword?.nativeElement.type == 'password') {
      this.signupPassword.nativeElement.type = 'text';
      this.isShowSignUpPasswordIconVisible = true;
    } else {
      this.signupPassword.nativeElement.type = 'password';
      this.isShowSignUpPasswordIconVisible = false;
    }
  }
}
