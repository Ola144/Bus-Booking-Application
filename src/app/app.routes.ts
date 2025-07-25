import { Routes } from '@angular/router';
import { AccountsComponent } from './pages/accounts/accounts.component';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultComponent } from './pages/search-result/search-result.component';
import { BookTicketComponent } from './pages/book-ticket/book-ticket.component';
import {
  busBookingCanActivateGuard,
  resolveBookedBus,
  resolveBus,
  resolveLocation,
  resolveScheduleBus,
  resolveSearchBus,
  resolveUsers,
} from './guards/bus-booking.guard';
import { AdminComponent } from './pages/admin/admin.component';
import { HomeComponent } from './pages/home/home.component';
import { LoggedUserComponent } from './pages/logged-user/logged-user.component';
import { LayoutComponent } from './pages/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

  {
    path: 'search',
    component: SearchComponent,
    resolve: { location: resolveLocation },
  },
  {
    path: 'account',
    component: AccountsComponent,
  },
  {
    path: 'search-result/:fromId/:toId/:date',
    component: SearchResultComponent,
    resolve: { resolveSearchBus },
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [busBookingCanActivateGuard],
    children: [
      {
        path: 'book-ticket/:scheduleId',
        component: BookTicketComponent,
        resolve: { scheduleBus: resolveScheduleBus },
      },
      {
        path: 'admin',
        component: AdminComponent,
        resolve: {
          bus: resolveBus,
          location: resolveLocation,
          users: resolveUsers,
          vendor: resolveLocation,
          bookedBus: resolveBookedBus,
        },
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'user',
        component: LoggedUserComponent,
        resolve: { users: resolveUsers },
      },
    ],
  },
];
