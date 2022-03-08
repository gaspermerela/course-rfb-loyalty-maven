import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RfbEventAttendance } from './rfb-event-attendance.model';
import { RfbEventAttendanceService } from './rfb-event-attendance.service';

@Injectable()
export class RfbEventAttendancePopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private rfbEventAttendanceService: RfbEventAttendanceService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.rfbEventAttendanceService.find(id).subscribe((rfbEventAttendance) => {
                if (rfbEventAttendance.attendanceDate) {
                    rfbEventAttendance.attendanceDate = {
                        year: rfbEventAttendance.attendanceDate.getFullYear(),
                        month: rfbEventAttendance.attendanceDate.getMonth() + 1,
                        day: rfbEventAttendance.attendanceDate.getDate()
                    };
                }
                this.rfbEventAttendanceModalRef(component, rfbEventAttendance);
            });
        } else {
            return this.rfbEventAttendanceModalRef(component, new RfbEventAttendance());
        }
    }

    rfbEventAttendanceModalRef(component: Component, rfbEventAttendance: RfbEventAttendance): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.rfbEventAttendance = rfbEventAttendance;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
