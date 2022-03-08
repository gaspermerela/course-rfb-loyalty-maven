import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RfbLocation } from './rfb-location.model';
import { RfbLocationService } from './rfb-location.service';

@Injectable()
export class RfbLocationPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private rfbLocationService: RfbLocationService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.rfbLocationService.find(id).subscribe((rfbLocation) => {
                this.rfbLocationModalRef(component, rfbLocation);
            });
        } else {
            return this.rfbLocationModalRef(component, new RfbLocation());
        }
    }

    rfbLocationModalRef(component: Component, rfbLocation: RfbLocation): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.rfbLocation = rfbLocation;
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
