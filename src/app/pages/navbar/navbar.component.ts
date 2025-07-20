import {
  Component,
  ViewChild,
  ElementRef,
  inject,
  OnInit,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  router: Router = inject(Router);

  @ViewChild('links') links: ElementRef | undefined;

  isLoggedIn: boolean = false;
  localUser: any;

  ngOnInit(): void {
    this.masterService.onLogin$.subscribe({
      next: (res: any) => {
        this.isLoggedIn = this.masterService.isLoggedIn();

        const localData = localStorage.getItem('BusBookingUser');
        if (localData != null) {
          this.localUser = JSON.parse(localData);
        }
      },
    });
  }

  toggleMenu() {
    this.links?.nativeElement.classList.toggle('collapsed');
  }

  logOut() {
    localStorage.removeItem('BusBookingUser');
    // this.localUser = undefined;
    this.router.navigateByUrl('/account');
    this.masterService.onLogin$.next(false);
  }
}
