import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RfbUser } from './rfb-user.model';
import { RfbUserService } from './rfb-user.service';

@Injectable()
export class RfbUserPopupService {
    private isOpen = false;
    constructor(
        private modalService: NgbModal,
        private router: Router,
        private rfbUserService: RfbUserService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.rfbUserService.find(id).subscribe((rfbUser) => {
                this.rfbUserModalRef(component, rfbUser);
            });
        } else {
            return this.rfbUserModalRef(component, new RfbUser());
        }
    }

    rfbUserModalRef(component: Component, rfbUser: RfbUser): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.rfbUser = rfbUser;
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
