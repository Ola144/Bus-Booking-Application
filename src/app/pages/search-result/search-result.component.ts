import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IBus, SearchModel } from '../../../model/BusBooking';
import { MasterService } from '../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-search-result',
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultComponent implements OnInit {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  searchObj: SearchModel = new SearchModel();
  busList: IBus[] = [];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((res: any) => {
      this.searchObj.fromLocationId = res.fromId;
      this.searchObj.toLocationId = res.toId;
      this.searchObj.date = res.date;
      this.getBus();

      // this.masterService.updateJourneyDate(res.date);
      const searchBusResult = {
        fromLocation: res.fromId,
        toLocation: res.toId,
        dateOfJourney: res.date,
      };
      localStorage.setItem('SearchBusResult', JSON.stringify(searchBusResult));
    });
  }

  getBus() {
    this.masterService
      .getSearchBus(this.searchObj.fromLocationId, this.searchObj.toLocationId)
      .then((res) => {
        this.busList = res;
      })
      .catch((err) => {
        this.toastr.error(err.message);
      });
  }
}
