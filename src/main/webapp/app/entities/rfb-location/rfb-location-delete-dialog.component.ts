import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';

import { RfbLocation } from './rfb-location.model';
import { RfbLocationPopupService } from './rfb-location-popup.service';
import { RfbLocationService } from './rfb-location.service';

@Component({
    selector: 'jhi-rfb-location-delete-dialog',
    templateUrl: './rfb-location-delete-dialog.component.html'
})
export class RfbLocationDeleteDialogComponent {

    rfbLocation: RfbLocation;

    constructor(
        private rfbLocationService: RfbLocationService,
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.rfbLocationService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'rfbLocationListModification',
                content: 'Deleted an rfbLocation'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success(`A Rfb Location is deleted with identifier ${id}`, null, null);
    }
}

@Component({
    selector: 'jhi-rfb-location-delete-popup',
    template: ''
})
export class RfbLocationDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rfbLocationPopupService: RfbLocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.rfbLocationPopupService
                .open(RfbLocationDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
