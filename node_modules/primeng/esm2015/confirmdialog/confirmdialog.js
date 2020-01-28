var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, OnDestroy, Input, EventEmitter, Renderer2, ContentChild, NgZone, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { Footer, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService } from 'primeng/api';
let ConfirmDialog = class ConfirmDialog {
    constructor(el, renderer, confirmationService, zone) {
        this.el = el;
        this.renderer = renderer;
        this.confirmationService = confirmationService;
        this.zone = zone;
        this.acceptIcon = 'pi pi-check';
        this.acceptLabel = 'Yes';
        this.acceptVisible = true;
        this.rejectIcon = 'pi pi-times';
        this.rejectLabel = 'No';
        this.rejectVisible = true;
        this.closeOnEscape = true;
        this.blockScroll = true;
        this.closable = true;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.transitionOptions = '150ms cubic-bezier(0, 0, 0.2, 1)';
        this.focusTrap = true;
        this.subscription = this.confirmationService.requireConfirmation$.subscribe(confirmation => {
            if (confirmation.key === this.key) {
                this.confirmation = confirmation;
                this.message = this.confirmation.message || this.message;
                this.icon = this.confirmation.icon || this.icon;
                this.header = this.confirmation.header || this.header;
                this.rejectVisible = this.confirmation.rejectVisible == null ? this.rejectVisible : this.confirmation.rejectVisible;
                this.acceptVisible = this.confirmation.acceptVisible == null ? this.acceptVisible : this.confirmation.acceptVisible;
                this.acceptLabel = this.confirmation.acceptLabel || this.acceptLabel;
                this.rejectLabel = this.confirmation.rejectLabel || this.rejectLabel;
                if (this.confirmation.accept) {
                    this.confirmation.acceptEvent = new EventEmitter();
                    this.confirmation.acceptEvent.subscribe(this.confirmation.accept);
                }
                if (this.confirmation.reject) {
                    this.confirmation.rejectEvent = new EventEmitter();
                    this.confirmation.rejectEvent.subscribe(this.confirmation.reject);
                }
                if (this.confirmation.blockScroll === false || this.confirmation.blockScroll === true) {
                    this.blockScroll = this.confirmation.blockScroll;
                }
                this.visible = true;
            }
        });
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.maskVisible) {
            this.maskVisible = true;
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.container = event.element;
                this.wrapper = this.container.parentElement;
                this.contentContainer = DomHandler.findSingle(this.container, '.ui-dialog-content');
                if (this.acceptVisible || this.rejectVisible) {
                    DomHandler.findSingle(this.container, 'button').focus();
                }
                this.appendContainer();
                this.moveOnTop();
                this.bindGlobalListeners();
                this.enableModality();
                break;
        }
    }
    onAnimationEnd(event) {
        switch (event.toState) {
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    appendContainer() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                DomHandler.appendChild(this.container, this.appendTo);
        }
    }
    restoreAppend() {
        if (this.container && this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }
    enableModality() {
        if (this.blockScroll) {
            DomHandler.addClass(document.body, 'ui-overflow-hidden');
        }
    }
    disableModality() {
        this.maskVisible = false;
        if (this.blockScroll) {
            DomHandler.removeClass(document.body, 'ui-overflow-hidden');
        }
    }
    close(event) {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }
        this.hide();
        event.preventDefault();
    }
    hide() {
        this.visible = false;
    }
    moveOnTop() {
        if (this.autoZIndex) {
            this.container.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
            this.wrapper.style.zIndex = String(this.baseZIndex + (DomHandler.zindex - 1));
        }
    }
    bindGlobalListeners() {
        if ((this.closeOnEscape && this.closable) || this.focusTrap && !this.documentEscapeListener) {
            this.documentEscapeListener = this.renderer.listen('document', 'keydown', (event) => {
                if (event.which == 27 && (this.closeOnEscape && this.closable)) {
                    if (parseInt(this.container.style.zIndex) === (DomHandler.zindex + this.baseZIndex) && this.visible) {
                        this.close(event);
                    }
                }
                if (event.which === 9 && this.focusTrap) {
                    event.preventDefault();
                    let focusableElements = DomHandler.getFocusableElements(this.container);
                    if (focusableElements && focusableElements.length > 0) {
                        if (!document.activeElement) {
                            focusableElements[0].focus();
                        }
                        else {
                            let focusedIndex = focusableElements.indexOf(document.activeElement);
                            if (event.shiftKey) {
                                if (focusedIndex == -1 || focusedIndex === 0)
                                    focusableElements[focusableElements.length - 1].focus();
                                else
                                    focusableElements[focusedIndex - 1].focus();
                            }
                            else {
                                if (focusedIndex == -1 || focusedIndex === (focusableElements.length - 1))
                                    focusableElements[0].focus();
                                else
                                    focusableElements[focusedIndex + 1].focus();
                            }
                        }
                    }
                }
            });
        }
    }
    unbindGlobalListeners() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }
    onOverlayHide() {
        this.disableModality();
        this.unbindGlobalListeners();
        this.container = null;
    }
    ngOnDestroy() {
        this.restoreAppend();
        this.onOverlayHide();
        this.subscription.unsubscribe();
    }
    accept() {
        if (this.confirmation.acceptEvent) {
            this.confirmation.acceptEvent.emit();
        }
        this.hide();
        this.confirmation = null;
    }
    reject() {
        if (this.confirmation.rejectEvent) {
            this.confirmation.rejectEvent.emit();
        }
        this.hide();
        this.confirmation = null;
    }
};
ConfirmDialog.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ConfirmationService },
    { type: NgZone }
];
__decorate([
    Input()
], ConfirmDialog.prototype, "header", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "icon", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "message", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "style", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "styleClass", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "acceptIcon", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "acceptLabel", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "acceptVisible", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "rejectIcon", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "rejectLabel", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "rejectVisible", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "acceptButtonStyleClass", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "rejectButtonStyleClass", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "closeOnEscape", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "blockScroll", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "rtl", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "closable", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "appendTo", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "key", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "autoZIndex", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "baseZIndex", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "transitionOptions", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "focusTrap", void 0);
__decorate([
    Input()
], ConfirmDialog.prototype, "visible", null);
__decorate([
    ContentChild(Footer, { static: true })
], ConfirmDialog.prototype, "footer", void 0);
__decorate([
    ViewChild('content', { static: true })
], ConfirmDialog.prototype, "contentViewChild", void 0);
ConfirmDialog = __decorate([
    Component({
        selector: 'p-confirmDialog',
        template: `
        <div class="ui-dialog-wrapper" [ngClass]="{'ui-widget-overlay ui-dialog-mask': true, 'ui-dialog-mask-scrollblocker':blockScroll}" *ngIf="maskVisible">
            <div [ngClass]="{'ui-dialog ui-confirmdialog ui-widget ui-widget-content ui-corner-all ui-shadow':true,'ui-dialog-rtl':rtl}" [ngStyle]="style" [class]="styleClass" (mousedown)="moveOnTop()"
                [@animation]="{value: 'visible', params: {transitionParams: transitionOptions}}" (@animation.start)="onAnimationStart($event)" (@animation.done)="onAnimationEnd($event)" *ngIf="visible">
                <div class="ui-dialog-titlebar ui-widget-header ui-helper-clearfix ui-corner-top">
                    <span class="ui-dialog-title" *ngIf="header">{{header}}</span>
                    <div class="ui-dialog-titlebar-icons">
                        <a *ngIf="closable" [ngClass]="{'ui-dialog-titlebar-icon ui-dialog-titlebar-close ui-corner-all':true}" tabindex="0" role="button" (click)="close($event)" (keydown.enter)="close($event)">
                            <span class="pi pi-times"></span>
                        </a>
                    </div>
                </div>
                <div #content class="ui-dialog-content ui-widget-content">
                    <i [ngClass]="'ui-confirmdialog-icon'" [class]="icon" *ngIf="icon"></i>
                    <span class="ui-confirmdialog-message" [innerHTML]="message"></span>
                </div>
                <div class="ui-dialog-footer ui-widget-content" *ngIf="footer">
                    <ng-content select="p-footer"></ng-content>
                </div>
                <div class="ui-dialog-footer ui-widget-content" *ngIf="!footer">
                    <button type="button" pButton [icon]="acceptIcon" [label]="acceptLabel" (click)="accept()" [class]="acceptButtonStyleClass" *ngIf="acceptVisible"></button>
                    <button type="button" pButton [icon]="rejectIcon" [label]="rejectLabel" (click)="reject()" [class]="rejectButtonStyleClass" *ngIf="rejectVisible"></button>
                </div>
            </div>
        </div>
    `,
        animations: [
            trigger('animation', [
                state('void', style({
                    transform: 'scale(0.7)',
                    opacity: 0
                })),
                state('visible', style({
                    transform: 'none',
                    opacity: 1
                })),
                transition('* => *', animate('{{transitionParams}}'))
            ])
        ]
    })
], ConfirmDialog);
export { ConfirmDialog };
let ConfirmDialogModule = class ConfirmDialogModule {
};
ConfirmDialogModule = __decorate([
    NgModule({
        imports: [CommonModule, ButtonModule],
        exports: [ConfirmDialog, ButtonModule, SharedModule],
        declarations: [ConfirmDialog]
    })
], ConfirmDialogModule);
export { ConfirmDialogModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlybWRpYWxvZy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvY29uZmlybWRpYWxvZy8iLCJzb3VyY2VzIjpbImNvbmZpcm1kaWFsb2cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsWUFBWSxFQUFDLFNBQVMsRUFBQyxZQUFZLEVBQUMsTUFBTSxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNqSSxPQUFPLEVBQUMsT0FBTyxFQUFDLEtBQUssRUFBQyxLQUFLLEVBQUMsVUFBVSxFQUFDLE9BQU8sRUFBZ0IsTUFBTSxxQkFBcUIsQ0FBQztBQUMxRixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUNoRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFFNUMsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sYUFBYSxDQUFDO0FBNkNoRCxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0lBaUZ0QixZQUFtQixFQUFjLEVBQVMsUUFBbUIsRUFBVSxtQkFBd0MsRUFBUyxJQUFZO1FBQWpILE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFxQjtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFyRTNILGVBQVUsR0FBVyxhQUFhLENBQUM7UUFFbkMsZ0JBQVcsR0FBVyxLQUFLLENBQUM7UUFFNUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFFOUIsZUFBVSxHQUFXLGFBQWEsQ0FBQztRQUVuQyxnQkFBVyxHQUFXLElBQUksQ0FB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QjtJQUwvQixRQUFRLENBQUM7UUFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO1FBQ3BDLE9BQU8sRUFBRSxDQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO1FBQ2xELFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQztLQUNoQyxDQUFDO0dBQ1csbUJBQW1CLENBQUk7U0FBdkIsbUJBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsRWxlbWVudFJlZixPbkRlc3Ryb3ksSW5wdXQsRXZlbnRFbWl0dGVyLFJlbmRlcmVyMixDb250ZW50Q2hpbGQsTmdab25lLFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3RyaWdnZXIsc3RhdGUsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlLEFuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge0Zvb3RlcixTaGFyZWRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7QnV0dG9uTW9kdWxlfSBmcm9tICdwcmltZW5nL2J1dHRvbic7XG5pbXBvcnQge0NvbmZpcm1hdGlvbn0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtDb25maXJtYXRpb25TZXJ2aWNlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge1N1YnNjcmlwdGlvbn0gICBmcm9tICdyeGpzJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWNvbmZpcm1EaWFsb2cnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1kaWFsb2ctd3JhcHBlclwiIFtuZ0NsYXNzXT1cInsndWktd2lkZ2V0LW92ZXJsYXkgdWktZGlhbG9nLW1hc2snOiB0cnVlLCAndWktZGlhbG9nLW1hc2stc2Nyb2xsYmxvY2tlcic6YmxvY2tTY3JvbGx9XCIgKm5nSWY9XCJtYXNrVmlzaWJsZVwiPlxuICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3VpLWRpYWxvZyB1aS1jb25maXJtZGlhbG9nIHVpLXdpZGdldCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsIHVpLXNoYWRvdyc6dHJ1ZSwndWktZGlhbG9nLXJ0bCc6cnRsfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiAobW91c2Vkb3duKT1cIm1vdmVPblRvcCgpXCJcbiAgICAgICAgICAgICAgICBbQGFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7dHJhbnNpdGlvblBhcmFtczogdHJhbnNpdGlvbk9wdGlvbnN9fVwiIChAYW5pbWF0aW9uLnN0YXJ0KT1cIm9uQW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiIChAYW5pbWF0aW9uLmRvbmUpPVwib25BbmltYXRpb25FbmQoJGV2ZW50KVwiICpuZ0lmPVwidmlzaWJsZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1kaWFsb2ctdGl0bGViYXIgdWktd2lkZ2V0LWhlYWRlciB1aS1oZWxwZXItY2xlYXJmaXggdWktY29ybmVyLXRvcFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLWRpYWxvZy10aXRsZVwiICpuZ0lmPVwiaGVhZGVyXCI+e3toZWFkZXJ9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWRpYWxvZy10aXRsZWJhci1pY29uc1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGEgKm5nSWY9XCJjbG9zYWJsZVwiIFtuZ0NsYXNzXT1cInsndWktZGlhbG9nLXRpdGxlYmFyLWljb24gdWktZGlhbG9nLXRpdGxlYmFyLWNsb3NlIHVpLWNvcm5lci1hbGwnOnRydWV9XCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJjbG9zZSgkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2xvc2UoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicGkgcGktdGltZXNcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgI2NvbnRlbnQgY2xhc3M9XCJ1aS1kaWFsb2ctY29udGVudCB1aS13aWRnZXQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBbbmdDbGFzc109XCIndWktY29uZmlybWRpYWxvZy1pY29uJ1wiIFtjbGFzc109XCJpY29uXCIgKm5nSWY9XCJpY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLWNvbmZpcm1kaWFsb2ctbWVzc2FnZVwiIFtpbm5lckhUTUxdPVwibWVzc2FnZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktZGlhbG9nLWZvb3RlciB1aS13aWRnZXQtY29udGVudFwiICpuZ0lmPVwiZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInAtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1kaWFsb2ctZm9vdGVyIHVpLXdpZGdldC1jb250ZW50XCIgKm5nSWY9XCIhZm9vdGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gW2ljb25dPVwiYWNjZXB0SWNvblwiIFtsYWJlbF09XCJhY2NlcHRMYWJlbFwiIChjbGljayk9XCJhY2NlcHQoKVwiIFtjbGFzc109XCJhY2NlcHRCdXR0b25TdHlsZUNsYXNzXCIgKm5nSWY9XCJhY2NlcHRWaXNpYmxlXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gW2ljb25dPVwicmVqZWN0SWNvblwiIFtsYWJlbF09XCJyZWplY3RMYWJlbFwiIChjbGljayk9XCJyZWplY3QoKVwiIFtjbGFzc109XCJyZWplY3RCdXR0b25TdHlsZUNsYXNzXCIgKm5nSWY9XCJyZWplY3RWaXNpYmxlXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ2FuaW1hdGlvbicsIFtcbiAgICAgICAgICAgIHN0YXRlKCd2b2lkJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDAuNyknLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ25vbmUnLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJyogPT4gKicsIGFuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JykpXG4gICAgICAgIF0pXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBDb25maXJtRGlhbG9nIGltcGxlbWVudHMgT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGhlYWRlcjogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIGljb246IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSBtZXNzYWdlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSBhY2NlcHRJY29uOiBzdHJpbmcgPSAncGkgcGktY2hlY2snO1xuICAgIFxuICAgIEBJbnB1dCgpIGFjY2VwdExhYmVsOiBzdHJpbmcgPSAnWWVzJztcbiAgICBcbiAgICBASW5wdXQoKSBhY2NlcHRWaXNpYmxlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHJlamVjdEljb246IHN0cmluZyA9ICdwaSBwaS10aW1lcyc7XG4gICAgXG4gICAgQElucHV0KCkgcmVqZWN0TGFiZWw6IHN0cmluZyA9ICdObyc7XG4gICAgXG4gICAgQElucHV0KCkgcmVqZWN0VmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQElucHV0KCkgYWNjZXB0QnV0dG9uU3R5bGVDbGFzczogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIHJlamVjdEJ1dHRvblN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNsb3NlT25Fc2NhcGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYmxvY2tTY3JvbGw6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgcnRsOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgY2xvc2FibGU6IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBhbnk7XG4gICAgXG4gICAgQElucHV0KCkga2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcbiAgICBcbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuICAgIFxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnMTUwbXMgY3ViaWMtYmV6aWVyKDAsIDAsIDAuMiwgMSknO1xuXG4gICAgQElucHV0KCkgZm9jdXNUcmFwOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGdldCB2aXNpYmxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgIH1cbiAgICBzZXQgdmlzaWJsZSh2YWx1ZTphbnkpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHZhbHVlO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUgJiYgIXRoaXMubWFza1Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMubWFza1Zpc2libGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQENvbnRlbnRDaGlsZChGb290ZXIsIHsgc3RhdGljOiB0cnVlIH0pIGZvb3RlcjtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBjb250ZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuICAgIFxuICAgIGNvbmZpcm1hdGlvbjogQ29uZmlybWF0aW9uO1xuICAgICAgICBcbiAgICBfdmlzaWJsZTogYm9vbGVhbjtcblxuICAgIG1hc2tWaXNpYmxlOiBib29sZWFuO1xuICAgIFxuICAgIGRvY3VtZW50RXNjYXBlTGlzdGVuZXI6IGFueTtcbiAgICAgICAgXG4gICAgY29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcblxuICAgIHdyYXBwZXI6IEhUTUxFbGVtZW50O1xuICAgICAgICBcbiAgICBjb250ZW50Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgICAgIFxuICAgIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgcHJlV2lkdGg6IG51bWJlcjtcbiAgICAgICAgICAgICAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNvbmZpcm1hdGlvblNlcnZpY2U6IENvbmZpcm1hdGlvblNlcnZpY2UsIHB1YmxpYyB6b25lOiBOZ1pvbmUpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLmNvbmZpcm1hdGlvblNlcnZpY2UucmVxdWlyZUNvbmZpcm1hdGlvbiQuc3Vic2NyaWJlKGNvbmZpcm1hdGlvbiA9PiB7XG4gICAgICAgICAgICBpZiAoY29uZmlybWF0aW9uLmtleSA9PT0gdGhpcy5rZXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbiA9IGNvbmZpcm1hdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSB0aGlzLmNvbmZpcm1hdGlvbi5tZXNzYWdlfHx0aGlzLm1lc3NhZ2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pY29uID0gdGhpcy5jb25maXJtYXRpb24uaWNvbnx8dGhpcy5pY29uO1xuICAgICAgICAgICAgICAgIHRoaXMuaGVhZGVyID0gdGhpcy5jb25maXJtYXRpb24uaGVhZGVyfHx0aGlzLmhlYWRlcjtcbiAgICAgICAgICAgICAgICB0aGlzLnJlamVjdFZpc2libGUgPSB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RWaXNpYmxlID09IG51bGwgPyB0aGlzLnJlamVjdFZpc2libGUgOiB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RWaXNpYmxlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWNjZXB0VmlzaWJsZSA9IHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdFZpc2libGUgPT0gbnVsbCA/IHRoaXMuYWNjZXB0VmlzaWJsZSA6IHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdFZpc2libGU7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2NlcHRMYWJlbCA9IHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdExhYmVsfHx0aGlzLmFjY2VwdExhYmVsO1xuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0TGFiZWwgPSB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RMYWJlbHx8dGhpcy5yZWplY3RMYWJlbDtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24uYWNjZXB0RXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLmFjY2VwdEV2ZW50LnN1YnNjcmliZSh0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtYXRpb24ucmVqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RFdmVudC5zdWJzY3JpYmUodGhpcy5jb25maXJtYXRpb24ucmVqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb25maXJtYXRpb24uYmxvY2tTY3JvbGwgPT09IGZhbHNlIHx8IHRoaXMuY29uZmlybWF0aW9uLmJsb2NrU2Nyb2xsID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tTY3JvbGwgPSB0aGlzLmNvbmZpcm1hdGlvbi5ibG9ja1Njcm9sbDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgICAgICAgICBcbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2goZXZlbnQudG9TdGF0ZSkge1xuICAgICAgICAgICAgY2FzZSAndmlzaWJsZSc6XG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPSBldmVudC5lbGVtZW50O1xuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlciA9IHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Q29udGFpbmVyID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCAnLnVpLWRpYWxvZy1jb250ZW50Jyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWNjZXB0VmlzaWJsZSB8fCB0aGlzLnJlamVjdFZpc2libGUpIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCAnYnV0dG9uJykuZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmFwcGVuZENvbnRhaW5lcigpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZU9uVG9wKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmFibGVNb2RhbGl0eSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvbkVuZChldmVudDogQW5pbWF0aW9uRXZlbnQpIHtcbiAgICAgICAgc3dpdGNoKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmRDb250YWluZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzdG9yZUFwcGVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIFxuICAgIGVuYWJsZU1vZGFsaXR5KCkge1xuICAgICAgICBpZiAodGhpcy5ibG9ja1Njcm9sbCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhkb2N1bWVudC5ib2R5LCAndWktb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZGlzYWJsZU1vZGFsaXR5KCkge1xuICAgICAgICB0aGlzLm1hc2tWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgaWYgKHRoaXMuYmxvY2tTY3JvbGwpIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MoZG9jdW1lbnQuYm9keSwgJ3VpLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNsb3NlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlybWF0aW9uLnJlamVjdEV2ZW50LmVtaXQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIGhpZGUoKSB7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBtb3ZlT25Ub3AoKSB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnpJbmRleCA9IFN0cmluZyh0aGlzLmJhc2VaSW5kZXggKyAoKytEb21IYW5kbGVyLnppbmRleCkpO1xuICAgICAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLnpJbmRleCA9IFN0cmluZyh0aGlzLmJhc2VaSW5kZXggKyAoRG9tSGFuZGxlci56aW5kZXggLSAxKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKCh0aGlzLmNsb3NlT25Fc2NhcGUgJiYgdGhpcy5jbG9zYWJsZSkgfHwgdGhpcy5mb2N1c1RyYXAgJiYgIXRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMjcgJiYgKHRoaXMuY2xvc2VPbkVzY2FwZSAmJiB0aGlzLmNsb3NhYmxlKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQodGhpcy5jb250YWluZXIuc3R5bGUuekluZGV4KSA9PT0gKERvbUhhbmRsZXIuemluZGV4ICsgdGhpcy5iYXNlWkluZGV4KSAmJiB0aGlzLnZpc2libGUpwqB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gOSAmJiB0aGlzLmZvY3VzVHJhcCkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gRG9tSGFuZGxlci5nZXRGb2N1c2FibGVFbGVtZW50cyh0aGlzLmNvbnRhaW5lcik7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2FibGVFbGVtZW50cyAmJiBmb2N1c2FibGVFbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSW5kZXggPT0gLTEgfHwgZm9jdXNlZEluZGV4ID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNlZEluZGV4IC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSW5kZXggPT0gLTEgfHwgZm9jdXNlZEluZGV4ID09PSAoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2VkSW5kZXggKyAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHVuYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25PdmVybGF5SGlkZSgpIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlTW9kYWxpdHkoKTtcbiAgICAgICAgdGhpcy51bmJpbmRHbG9iYWxMaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBudWxsO1xuICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5yZXN0b3JlQXBwZW5kKCk7XG4gICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBcbiAgICBhY2NlcHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5hY2NlcHRFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24uYWNjZXB0RXZlbnQuZW1pdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb24gPSBudWxsO1xuICAgIH1cbiAgICBcbiAgICByZWplY3QoKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpcm1hdGlvbi5yZWplY3RFdmVudCkge1xuICAgICAgICAgICAgdGhpcy5jb25maXJtYXRpb24ucmVqZWN0RXZlbnQuZW1pdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5jb25maXJtYXRpb24gPSBudWxsO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLEJ1dHRvbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0NvbmZpcm1EaWFsb2csQnV0dG9uTW9kdWxlLFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQ29uZmlybURpYWxvZ11cbn0pXG5leHBvcnQgY2xhc3MgQ29uZmlybURpYWxvZ01vZHVsZSB7IH0iXX0=