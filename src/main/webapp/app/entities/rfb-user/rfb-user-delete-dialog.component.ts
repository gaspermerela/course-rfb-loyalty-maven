import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RfbUser } from './rfb-user.model';
import { RfbUserPopupService } from './rfb-user-popup.service';
import { RfbUserService } from './rfb-user.service';

@Component({
    selector: 'jhi-rfb-user-delete-dialog',
    templateUrl: './rfb-user-delete-dialog.component.html'
})
export class RfbUserDeleteDialogComponent {

    rfbUser: RfbUser;

    constructor(
        private rfbUserService: RfbUserService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.rfbUserService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'rfbUserListModification',
                content: 'Deleted an rfbUser'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success(`A Rfb User is deleted with identifier ${id}`, null, null);
    }
}

@Component({
    selector: 'jhi-rfb-user-delete-popup',
    template: ''
})
export class RfbUserDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rfbUserPopupService: RfbUserPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.rfbUserPopupService
                .open(RfbUserDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
