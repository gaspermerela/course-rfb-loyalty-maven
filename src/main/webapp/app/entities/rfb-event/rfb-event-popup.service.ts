import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RfbEvent } from './rfb-event.model';
import { RfbEventService } from './rfb-event.service';

@Injectable()
export class RfbEventPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private rfbEventService: RfbEventService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.rfbEventService.find(id).subscribe((rfbEvent) => {
                if (rfbEvent.eventDate) {
                    rfbEvent.eventDate = {
                        year: rfbEvent.eventDate.getFullYear(),
                        month: rfbEvent.eventDate.getMonth() + 1,
                        day: rfbEvent.eventDate.getDate()
                    };
                }
                this.rfbEventModalRef(component, rfbEvent);
            });
        } else {
            return this.rfbEventModalRef(component, new RfbEvent());
        }
    }

    rfbEventModalRef(component: Component, rfbEvent: RfbEvent): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.rfbEvent = rfbEvent;
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
