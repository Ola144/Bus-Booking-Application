import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { ILocation, LocationModel } from '../../../../model/BusBooking';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-location',
  imports: [FormsModule],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css',
})
export class LocationComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  locationList: ILocation[] = [];
  locationObj: LocationModel = new LocationModel();
  locationId: string = '';
  locationName: string = '';

  isCreateLocationLoading: boolean = false;
  isLocationFormVisible: boolean = false;
  isUpdateUpdateLoading: boolean = false;
  isConfirmDeletLocationVisible: boolean = false;
  isDeleteLocationLoading: boolean = false;

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

  createLocation() {
    this.isCreateLocationLoading = true;
    this.masterService
      .createLocation(this.locationObj)
      .then(() => {
        this.toastr.success('Location Created Successfully!');
        this.getAllLocation();
        this.isCreateLocationLoading = false;
        this.isLocationFormVisible = false;
        this.locationObj = new LocationModel();
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isCreateLocationLoading = false;
      });
  }

  onDeleteLocation(locationObj: ILocation) {
    this.locationId = locationObj.locationId;
    this.locationName = locationObj.locationName;
    this.isConfirmDeletLocationVisible = true;
    window.scrollTo(0, 0);
  }

  deleteLocation() {
    this.isDeleteLocationLoading = true;
    this.masterService
      .deleteLocationById(this.locationId)
      .then(() => {
        this.toastr.success('Location Deleted Successfully!');
        this.getAllLocation();
        this.isDeleteLocationLoading = false;
        this.isConfirmDeletLocationVisible = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isDeleteLocationLoading = false;
      });
  }

  onEditLocation(locationObj: ILocation) {
    this.locationObj = locationObj;
    this.locationId = locationObj.locationId;
    this.isLocationFormVisible = true;
    window.scrollTo(0, 0);
  }

  updateUpdate() {
    this.isUpdateUpdateLoading = true;
    this.masterService
      .updateLocation(this.locationObj, this.locationId)
      .then(() => {
        this.toastr.success('Location Updated Successfully!');
        this.getAllLocation();
        this.isUpdateUpdateLoading = false;
        this.isLocationFormVisible = false;
        this.locationObj = new LocationModel();
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isUpdateUpdateLoading = false;
      });
  }

  openLocationForm() {
    this.isLocationFormVisible = true;
    window.scrollTo(0, 0);
    this.locationId = '';
  }

  closeLocationForm() {
    this.isLocationFormVisible = false;
    this.locationId = '';
    this.locationObj = new LocationModel();
  }
}
