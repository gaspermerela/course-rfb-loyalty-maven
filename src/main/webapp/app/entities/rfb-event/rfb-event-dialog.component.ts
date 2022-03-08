import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RfbEvent } from './rfb-event.model';
import { RfbEventPopupService } from './rfb-event-popup.service';
import { RfbEventService } from './rfb-event.service';
import { RfbLocation, RfbLocationService } from '../rfb-location';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-rfb-event-dialog',
    templateUrl: './rfb-event-dialog.component.html'
})
export class RfbEventDialogComponent implements OnInit {

    rfbEvent: RfbEvent;
    authorities: any[];
    isSaving: boolean;

    rfblocations: RfbLocation[];
    eventDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private rfbEventService: RfbEventService,
        private rfbLocationService: RfbLocationService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.rfbLocationService.query()
            .subscribe((res: ResponseWrapper) => { this.rfblocations = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.rfbEvent.id !== undefined) {
            this.subscribeToSaveResponse(
                this.rfbEventService.update(this.rfbEvent), false);
        } else {
            this.subscribeToSaveResponse(
                this.rfbEventService.create(this.rfbEvent), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<RfbEvent>, isCreated: boolean) {
        result.subscribe((res: RfbEvent) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: RfbEvent, isCreated: boolean) {
        this.alertService.success(
            isCreated ? `A new Rfb Event is created with identifier ${result.id}`
            : `A Rfb Event is updated with identifier ${result.id}`,
            null, null);

        this.eventManager.broadcast({ name: 'rfbEventListModification', content: 'OK'});
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

    trackRfbLocationById(index: number, item: RfbLocation) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-rfb-event-popup',
    template: ''
})
export class RfbEventPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rfbEventPopupService: RfbEventPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.rfbEventPopupService
                    .open(RfbEventDialogComponent, params['id']);
            } else {
                this.modalRef = this.rfbEventPopupService
                    .open(RfbEventDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
