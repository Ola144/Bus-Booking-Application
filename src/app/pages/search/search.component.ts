import { Component, inject, OnInit } from '@angular/core';
import {
  ILocation,
  LocationModel,
  SearchModel,
  VendorModel,
} from '../../../model/BusBooking';
import { MasterService } from '../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);
  router: Router = inject(Router);

  locationList: ILocation[] = [];
  vendorObj: VendorModel = new VendorModel();

  searchObj: SearchModel = new SearchModel();

  ngOnInit(): void {
    this.getAllLocation();
  }

  async getAllLocation() {
    try {
      this.locationList = await this.masterService.getAllLocation();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  searchBus() {
    this.router.navigateByUrl(
      `/search-result/${this.searchObj.fromLocationId}/${this.searchObj.toLocationId}/${this.searchObj.date}`
    );
  }
}
