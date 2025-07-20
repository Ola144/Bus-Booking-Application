import { Component, inject, OnInit } from '@angular/core';
import { IVendor } from '../../../../model/BusBooking';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MasterService } from '../../../service/master.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendors',
  imports: [ReactiveFormsModule],
  templateUrl: './vendors.component.html',
  styleUrl: './vendors.component.css',
})
export class VendorsComponent implements OnInit {
  masterService: MasterService = inject(MasterService);
  toastr: ToastrService = inject(ToastrService);

  isCreateVendorLoading: boolean = false;
  isUpdateVendorLoading: boolean = false;
  isDeleteVendorLoading: boolean = false;

  isVendorFormVisible: boolean = false;

  isConfirmDeletVendorVisible: boolean = false;

  vendorList: IVendor[] = [];
  vendorForm: FormGroup = new FormGroup({});
  vendorId: string = '';
  vendorName: string = '';

  ngOnInit(): void {
    this.initializeForm();
    this.getAllVendor();
  }

  initializeForm(vendorData?: IVendor) {
    this.vendorForm = new FormGroup({
      // vendorId: new FormControl(''),
      vendorName: new FormControl(vendorData ? vendorData.vendorName : '', [
        Validators.required,
      ]),
      contactNo: new FormControl(vendorData ? vendorData.contactNo : '', [
        Validators.required,
      ]),
      emailId: new FormControl(vendorData ? vendorData.emailId : '', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  // VENDOR
  async getAllVendor() {
    try {
      this.vendorList = await this.masterService.getAllVendors();
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  async createVendor() {
    this.isCreateVendorLoading = true;
    const formValue = this.vendorForm.value;

    await this.masterService
      .creteatVendor(formValue)
      .then(() => {
        this.toastr.success('Vendor Created Succesfully!');
        this.isCreateVendorLoading = false;
        this.getAllVendor();
        this.isVendorFormVisible = false;
      })
      .catch((error) => {
        this.isCreateVendorLoading = false;
        this.toastr.error(error.message);
      });
  }

  onEditVendor(obj: IVendor) {
    this.initializeForm(obj);
    this.vendorId = obj.vendorId;
    console.log(obj.vendorId);
    this.isVendorFormVisible = true;
    window.scrollTo(0, 0);
  }

  async updateVendor() {
    this.isUpdateVendorLoading = true;
    const formValue = this.vendorForm.value;

    await this.masterService
      .updateBusVendor(formValue, this.vendorId)
      .then(() => {
        this.toastr.success('Vendor Updated Succesfully!');
        this.getAllVendor();
        this.isVendorFormVisible = false;
        this.isCreateVendorLoading = false;
      })
      .catch((error) => {
        this.isCreateVendorLoading = false;
        this.toastr.error(error.message);
      });
  }

  onDeleteVendor(vendorObj: IVendor) {
    this.isConfirmDeletVendorVisible = true;
    this.vendorId = vendorObj.vendorId;
    this.vendorName = vendorObj.vendorName;
    window.scrollTo(0, 0);
  }

  async deleteVendor() {
    this.isDeleteVendorLoading = true;
    await this.masterService
      .deleteBusVendorById(this.vendorId)
      .then(() => {
        this.toastr.success('Vendor Deleted Successfully!');
        this.getAllVendor();
        this.isDeleteVendorLoading = false;
        this.isConfirmDeletVendorVisible = false;
      })
      .catch((error) => {
        this.toastr.error(error.message);
        this.isDeleteVendorLoading = false;
      });
  }

  openVendorForm() {
    this.isVendorFormVisible = true;
    this.vendorId = '';
    window.scrollTo(0, 0);
  }

  closeVendorForm() {
    this.isVendorFormVisible = false;
    this.vendorForm.reset();
    this.vendorId = '';
  }
}
