import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IUser, UserModel } from '../../../../model/BusBooking';
import { MasterService } from '../../../service/master.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  @ViewChild('signupPassword') signupPassword: ElementRef | any;

  userObj: UserModel = new UserModel();

  userId: string = '';

  userList: IUser[] = [];
  filteredList: IUser[] = [];

  roles: string[] = ['Vendor', 'Customer'];

  isShowSignUpPasswordIconVisible: boolean = false;

  isUpdateUserLoading: boolean = false;
  isUpdateFormVisible: boolean = false;

  isConfirmDeleteUserVisible: boolean = false;
  isDeleteUserLoading: boolean = false;

  localUserData!: IUser;

  ngOnInit(): void {
    this.getAllUsers();

    const localUser = localStorage.getItem('BusBookingUser');
    if (localUser != null) {
      this.localUserData = JSON.parse(localUser);
    }
  }

  // USER
  async getAllUsers() {
    try {
      this.userList = await this.masterService.getAllUser();
      this.searchUser('all');
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  closeUpdateForm() {
    this.isUpdateFormVisible = false;
    this.userObj = new UserModel();
  }

  onEdit(obj: UserModel) {
    window.scrollTo(0, 0);
    this.isUpdateFormVisible = true;
    this.userObj = obj;
  }

  onDelete(id: string) {
    this.userId = id;
    this.isConfirmDeleteUserVisible = true;
    window.scrollTo(0, 0);
  }

  async deleteUserById() {
    this.isDeleteUserLoading = true;
    await this.masterService
      .deleteUserById(this.userId)
      .then(() => {
        this.toastr.success('User Deleted Successfully!');
        this.isDeleteUserLoading = false;
        this.getAllUsers();
        this.isConfirmDeleteUserVisible = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isDeleteUserLoading = false;
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

  searchUser(filterValue: string) {
    if (filterValue == '' || filterValue == 'all') {
      this.filteredList = this.userList;
    } else {
      this.filteredList = this.userList.filter((user) =>
        user.fullName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
  }
}
