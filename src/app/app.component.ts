import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, map, merge, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  toastr: ToastrService = inject(ToastrService);

  isOnline = navigator.onLine;

  ngOnInit(): void {
    // window.addEventListener('online', this.onlineHandler);
    // window.addEventListener('offline', this.offlineHandler);
  }

  ngAfterViewInit(): void {
    const status$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));

    status$.subscribe((status) => {
      this.isOnline = status;
    });

    if (this.isOnline) {
      this.toastr.success('You are now online!');
    } else {
      this.toastr.error('You are offline. Please check your connection!');
    }
  }

  // updateOnlineStatus(online: boolean) {
  //   this.isOnline = online;

  //   if (this.isOnline) {
  //     this.toastr.success('You are now online!');
  //   } else {
  //     this.toastr.error('You are offline. Please check your connection!');
  //   }
  // }

  // onlineHandler = () => {
  //   this.updateOnlineStatus(true);
  // };
  // offlineHandler = () => {
  //   this.updateOnlineStatus(false);
  // };
}
