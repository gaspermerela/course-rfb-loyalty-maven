import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { RfbEventAttendance } from './rfb-event-attendance.model';
import { RfbEventAttendancePopupService } from './rfb-event-attendance-popup.service';
import { RfbEventAttendanceService } from './rfb-event-attendance.service';
import { RfbEvent, RfbEventService } from '../rfb-event';
import { RfbUser, RfbUserService } from '../rfb-user';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-rfb-event-attendance-dialog',
    templateUrl: './rfb-event-attendance-dialog.component.html'
})
export class RfbEventAttendanceDialogComponent implements OnInit {

    rfbEventAttendance: RfbEventAttendance;
    authorities: any[];
    isSaving: boolean;

    rfbevents: RfbEvent[];

    rfbusers: RfbUser[];
    attendanceDateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: JhiAlertService,
        private rfbEventAttendanceService: RfbEventAttendanceService,
        private rfbEventService: RfbEventService,
        private rfbUserService: RfbUserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.rfbEventService.query()
            .subscribe((res: ResponseWrapper) => { this.rfbevents = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
        this.rfbUserService.query()
            .subscribe((res: ResponseWrapper) => { this.rfbusers = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.rfbEventAttendance.id !== undefined) {
            this.subscribeToSaveResponse(
                this.rfbEventAttendanceService.update(this.rfbEventAttendance), false);
        } else {
            this.subscribeToSaveResponse(
                this.rfbEventAttendanceService.create(this.rfbEventAttendance), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<RfbEventAttendance>, isCreated: boolean) {
        result.subscribe((res: RfbEventAttendance) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: RfbEventAttendance, isCreated: boolean) {
        this.alertService.success(
            isCreated ? `A new Rfb Event Attendance is created with identifier ${result.id}`
            : `A Rfb Event Attendance is updated with identifier ${result.id}`,
            null, null);

        this.eventManager.broadcast({ name: 'rfbEventAttendanceListModification', content: 'OK'});
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

    trackRfbEventById(index: number, item: RfbEvent) {
        return item.id;
    }

    trackRfbUserById(index: number, item: RfbUser) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-rfb-event-attendance-popup',
    template: ''
})
export class RfbEventAttendancePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private rfbEventAttendancePopupService: RfbEventAttendancePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.rfbEventAttendancePopupService
                    .open(RfbEventAttendanceDialogComponent, params['id']);
            } else {
                this.modalRef = this.rfbEventAttendancePopupService
                    .open(RfbEventAttendanceDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
