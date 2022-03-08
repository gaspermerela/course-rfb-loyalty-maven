import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RfbLocation } from './rfb-location.model';
import { RfbLocationPopupService } from './rfb-location-popup.service';
import { RfbLocationService } from './rfb-location.service';

@Component({
    selector: 'jhi-rfb-location-dialog',
    templateUrl: './rfb-location-dialog.component.html'
})
export class RfbLocationDialogComponent implements OnInit {

    rfbLocation: RfbLocation;
    authorities: any[];
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private rfbLocationService: RfbLocationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.rfbLocation.id !== undefined) {
            this.subscribeToSaveResponse(
                this.rfbLocationService.update(this.rfbLocation), false);
        } else {
            this.subscribeToSaveResponse(
                this.rfbLocationService.create(this.rfbLocation), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<RfbLocation>, isCreated: boolean) {
        result.subscribe((res: RfbLocation) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: RfbLocation, isCreated: boolean) {
        this.alertService.success(
            isCreated ? `A new Rfb Location is created with identifier ${result.id}`
            : `A Rfb Location is updated with identifier ${result.id}`,
            null, null);

        this.eventManager.broadcast({ name: 'rfbLocationListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-rfb-location-popup',
    template: ''
})
export class RfbLocationPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rfbLocationPopupService: RfbLocationPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.rfbLocationPopupService
                    .open(RfbLocationDialogComponent, params['id']);
            } else {
                this.modalRef = this.rfbLocationPopupService
                    .open(RfbLocationDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
