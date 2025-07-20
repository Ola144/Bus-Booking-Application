import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MasterService } from '../../../service/master.service';
import { ToastrService } from 'ngx-toastr';
import { IBus, ILocation, IVendor } from '../../../../model/BusBooking';

@Component({
  selector: 'app-bus',
  imports: [ReactiveFormsModule],
  templateUrl: './bus.component.html',
  styleUrl: './bus.component.css',
})
export class BusComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  locationList: ILocation[] = [];
  vendorList: IVendor[] = [];

  busForm: FormGroup = new FormGroup({});
  busId: string = '';

  isBusFormVisible: boolean = false;
  isConfirmDeletBusVisible: boolean = false;
  isDeleteBusLoading: boolean = false;
  isCreateBusLoading: boolean = false;
  isUpdateBusLoading: boolean = false;

  busList: IBus[] = [];

  ngOnInit(): void {
    this.getAllLocation();
    this.getAllVendor();
    this.getAllBus();

    this.initializeBusForm();
  }

  initializeBusForm(busData?: IBus) {
    this.busForm = new FormGroup({
      totalSeats: new FormControl(busData ? busData.totalSeats : null),
      price: new FormControl(busData ? busData.price : null),
      arrivalTime: new FormControl(busData ? busData.arrivalTime : 0),
      departureTime: new FormControl(busData ? busData.departureTime : 0),
      busName: new FormControl(busData ? busData.busName : ''),
      busVehicleNo: new FormControl(busData ? busData.busVehicleNo : '3396XY'),
      fromLocationName: new FormControl(
        busData ? busData.fromLocationName : ''
      ),
      toLocationName: new FormControl(busData ? busData.toLocationName : ''),
      vendorName: new FormControl(busData ? busData.vendorName : ''),
    });
  }

  async getAllLocation() {
    try {
      this.locationList = await this.masterService.getAllLocation();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async getAllVendor() {
    try {
      this.vendorList = await this.masterService.getAllVendors();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async createBus() {
    this.isCreateBusLoading = true;
    const formValue = this.busForm.value;

    await this.masterService
      .createBus(formValue)
      .then(() => {
        this.getAllBus();
        this.toastr.success('Bus Created Successfully!');
        this.isBusFormVisible = false;
        this.isBusFormVisible = false;
        this.isCreateBusLoading = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isCreateBusLoading = false;
      });
  }

  getAllBus() {
    this.masterService
      .getAllBus()
      .then((res) => {
        this.busList = res;
        console.log(res);
      })
      .catch((error) => {
        this.toastr.error(error.message);
      });
  }

  onEditBus(obj: IBus) {
    this.initializeBusForm(obj);
    this.busId = obj.busId;
    this.isBusFormVisible = true;
    window.scrollTo(0, 0);
  }

  async updateBus() {
    this.isUpdateBusLoading = true;
    const formValue = this.busForm.value;
    await this.masterService
      .updateBus(formValue, this.busId)
      .then(() => {
        this.getAllBus();
        this.toastr.success('Bus Updated Successfully!');
        this.isUpdateBusLoading = false;
        this.isBusFormVisible = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isUpdateBusLoading = false;
      });
  }

  onDeleteBus(busId: string) {
    this.busId = busId;
    this.isConfirmDeletBusVisible = true;
    window.scrollTo(0, 0);
  }

  async deleteBus() {
    this.isDeleteBusLoading = true;
    await this.masterService
      .deleteBusById(this.busId)
      .then(() => {
        this.getAllBus();
        this.toastr.success('Bus Deleted Successfully!');
        this.isDeleteBusLoading = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isDeleteBusLoading = false;
      });
  }

  openBusForm() {
    this.isBusFormVisible = true;
    this.busId = '';
    this.busForm.reset();
  }

  closeBusForm() {
    this.isBusFormVisible = false;
    this.busForm.reset();
    this.busId = '';
  }
}
