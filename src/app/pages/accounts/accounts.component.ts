import {
  Component,
  ViewChild,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { MasterService } from '../../service/master.service';
import { IAPIResponse, LoginModel, UserModel } from '../../../model/BusBooking';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);
  router: Router = inject(Router);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  localUser: any;

  isShowSignUpPasswordIconVisible: boolean = false;
  isShowLogInPasswordIconVisible: boolean = false;

  isLoginLoading: boolean = false;
  isSignupLoading: boolean = false;

  signupObj: UserModel = new UserModel();
  loginObj: UserModel = new UserModel();

  @ViewChild('login') login: ElementRef | undefined;
  @ViewChild('signup') signup: ElementRef | undefined;

  @ViewChild('loginBtn') loginBtn: ElementRef | undefined;
  @ViewChild('signupBtn') signupBtn: ElementRef | undefined;

  @ViewChild('loginPassword') loginPassword: ElementRef | any;
  @ViewChild('signupPassword') signupPassword: ElementRef | any;

  ngOnInit() {}

  signUpUser() {
    this.isSignupLoading = true;
    this.masterService
      .signUpUser(this.signupObj)
      .then(() => {
        this.toastr.success('Signup Successfully!');
        this.isSignupLoading = false;
        this.logIn();
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isSignupLoading = false;
      });
  }

  loginUser() {
    this.isLoginLoading = true;
    this.masterService
      .logInUser(this.loginObj)
      .then(() => {
        this.isLoginLoading = false;
        this.router.navigateByUrl('/search');
        this.masterService.onLogin$.next(true);
      })
      .catch((err) => {
        this.toastr.error(err.message);
        this.isLoginLoading = false;
      });
  }

  logIn() {
    this.login?.nativeElement.classList.add('login');
    this.signup?.nativeElement.classList.add('signup');
    this.login?.nativeElement.classList.remove('removeLogin');
    this.signup?.nativeElement.classList.remove('addSignup');

    this.signupBtn?.nativeElement.classList.remove('activeBtn');
    this.loginBtn?.nativeElement.classList.add('activeBtn');
  }

  signUp() {
    this.login?.nativeElement.classList.add('removeLogin');
    this.signup?.nativeElement.classList.add('addSignup');
    this.login?.nativeElement.classList.remove('login');
    this.signup?.nativeElement.classList.remove('signup');

    this.signupBtn?.nativeElement.classList.add('activeBtn');
    this.loginBtn?.nativeElement.classList.remove('activeBtn');
  }

  showLoginPassword() {
    if (this.loginPassword?.nativeElement.type == 'password') {
      this.loginPassword.nativeElement.type = 'text';
      this.isShowLogInPasswordIconVisible = true;
    } else {
      this.loginPassword.nativeElement.type = 'password';
      this.isShowLogInPasswordIconVisible = false;
    }
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
