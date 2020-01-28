var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, AfterViewInit, AfterViewChecked, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
let Sidebar = class Sidebar {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.position = 'left';
        this.blockScroll = false;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.modal = true;
        this.dismissible = true;
        this.showCloseIcon = true;
        this.closeOnEscape = true;
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.visibleChange = new EventEmitter();
    }
    ngAfterViewInit() {
        this.initialized = true;
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
        if (this.visible) {
            this.show();
        }
    }
    get visible() {
        return this._visible;
    }
    set visible(val) {
        this._visible = val;
        if (this.initialized && this.containerViewChild && this.containerViewChild.nativeElement) {
            if (this._visible)
                this.show();
            else {
                if (this.preventVisibleChangePropagation)
                    this.preventVisibleChangePropagation = false;
                else
                    this.hide();
            }
        }
    }
    ngAfterViewChecked() {
        if (this.executePostDisplayActions) {
            this.onShow.emit({});
            this.executePostDisplayActions = false;
        }
    }
    show() {
        this.executePostDisplayActions = true;
        if (this.autoZIndex) {
            this.containerViewChild.nativeElement.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
        }
        if (this.modal) {
            this.enableModality();
        }
    }
    hide() {
        this.onHide.emit({});
        if (this.modal) {
            this.disableModality();
        }
    }
    close(event) {
        this.preventVisibleChangePropagation = true;
        this.hide();
        this.visibleChange.emit(false);
        event.preventDefault();
    }
    enableModality() {
        if (!this.mask) {
            this.mask = document.createElement('div');
            this.mask.style.zIndex = String(parseInt(this.containerViewChild.nativeElement.style.zIndex) - 1);
            DomHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-sidebar-mask');
            if (this.dismissible) {
                this.maskClickListener = this.renderer.listen(this.mask, 'click', (event) => {
                    if (this.dismissible) {
                        this.close(event);
                    }
                });
            }
            document.body.appendChild(this.mask);
            if (this.blockScroll) {
                DomHandler.addClass(document.body, 'ui-overflow-hidden');
            }
        }
    }
    disableModality() {
        if (this.mask) {
            this.unbindMaskClickListener();
            document.body.removeChild(this.mask);
            if (this.blockScroll) {
                DomHandler.removeClass(document.body, 'ui-overflow-hidden');
            }
            this.mask = null;
        }
    }
    onAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                if (this.closeOnEscape) {
                    this.bindDocumentEscapeListener();
                }
                break;
            case 'hidden':
                this.unbindGlobalListeners();
                break;
        }
    }
    bindDocumentEscapeListener() {
        this.documentEscapeListener = this.renderer.listen('document', 'keydown', (event) => {
            if (event.which == 27) {
                if (parseInt(this.containerViewChild.nativeElement.style.zIndex) === (DomHandler.zindex + this.baseZIndex)) {
                    this.close(event);
                }
            }
        });
    }
    unbindDocumentEscapeListener() {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
    }
    unbindMaskClickListener() {
        if (this.maskClickListener) {
            this.maskClickListener();
            this.maskClickListener = null;
        }
    }
    unbindGlobalListeners() {
        this.unbindMaskClickListener();
        this.unbindDocumentEscapeListener();
    }
    ngOnDestroy() {
        this.initialized = false;
        if (this.visible) {
            this.hide();
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.containerViewChild.nativeElement);
        }
        this.unbindGlobalListeners();
    }
};
Sidebar.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
__decorate([
    Input()
], Sidebar.prototype, "position", void 0);
__decorate([
    Input()
], Sidebar.prototype, "fullScreen", void 0);
__decorate([
    Input()
], Sidebar.prototype, "appendTo", void 0);
__decorate([
    Input()
], Sidebar.prototype, "blockScroll", void 0);
__decorate([
    Input()
], Sidebar.prototype, "style", void 0);
__decorate([
    Input()
], Sidebar.prototype, "styleClass", void 0);
__decorate([
    Input()
], Sidebar.prototype, "ariaCloseLabel", void 0);
__decorate([
    Input()
], Sidebar.prototype, "autoZIndex", void 0);
__decorate([
    Input()
], Sidebar.prototype, "baseZIndex", void 0);
__decorate([
    Input()
], Sidebar.prototype, "modal", void 0);
__decorate([
    Input()
], Sidebar.prototype, "dismissible", void 0);
__decorate([
    Input()
], Sidebar.prototype, "showCloseIcon", void 0);
__decorate([
    Input()
], Sidebar.prototype, "closeOnEscape", void 0);
__decorate([
    ViewChild('container', { static: true })
], Sidebar.prototype, "containerViewChild", void 0);
__decorate([
    Output()
], Sidebar.prototype, "onShow", void 0);
__decorate([
    Output()
], Sidebar.prototype, "onHide", void 0);
__decorate([
    Output()
], Sidebar.prototype, "visibleChange", void 0);
__decorate([
    Input()
], Sidebar.prototype, "visible", null);
Sidebar = __decorate([
    Component({
        selector: 'p-sidebar',
        template: `
        <div #container [ngClass]="{'ui-sidebar ui-widget ui-widget-content ui-shadow':true, 'ui-sidebar-active': visible, 
            'ui-sidebar-left': (position === 'left'), 'ui-sidebar-right': (position === 'right'),
            'ui-sidebar-top': (position === 'top'), 'ui-sidebar-bottom': (position === 'bottom'), 
            'ui-sidebar-full': fullScreen}"
            [@panelState]="visible ? 'visible' : 'hidden'" (@panelState.start)="onAnimationStart($event)" [ngStyle]="style" [class]="styleClass"  role="complementary" [attr.aria-modal]="modal">
            <a [ngClass]="{'ui-sidebar-close ui-corner-all':true}" *ngIf="showCloseIcon" tabindex="0" role="button" (click)="close($event)" (keydown.enter)="close($event)" [attr.aria-label]="ariaCloseLabel">
                <span class="pi pi-times"></span>
            </a>
            <ng-content></ng-content>
        </div>
    `,
        animations: [
            trigger('panelState', [
                state('hidden', style({
                    opacity: 0
                })),
                state('visible', style({
                    opacity: 1
                })),
                transition('visible => hidden', animate('300ms ease-in')),
                transition('hidden => visible', animate('300ms ease-out'))
            ])
        ]
    })
], Sidebar);
export { Sidebar };
let SidebarModule = class SidebarModule {
};
SidebarModule = __decorate([
    NgModule({
        imports: [CommonModule],
        exports: [Sidebar],
        declarations: [Sidebar]
    })
], SidebarModule);
export { SidebarModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lkZWJhci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvc2lkZWJhci8iLCJzb3VyY2VzIjpbInNpZGViYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsYUFBYSxFQUFDLGdCQUFnQixFQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsTUFBTSxFQUFDLFlBQVksRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuSixPQUFPLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQy9FLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBNkJ2QyxJQUFhLE9BQU8sR0FBcEIsTUFBYSxPQUFPO0lBa0RoQixZQUFtQixFQUFjLEVBQVMsUUFBbUI7UUFBMUMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFoRHBELGFBQVEsR0FBVyxNQUFNLENBQUM7UUFNMUIsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFRN0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLFVBQUssR0FBWSxJQUFJLENBQUM7UUFFdEIsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFFNUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFFOUIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFJN0IsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUUvQyxrQkFBYSxHQUFxQixJQUFJLFlBQVksRUFBRSxDQUFDO0lBZ0JDLENBQUM7SUFFakUsZUFBZTtRQUNYLElB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RUFBRSxLQUFLLENBQUM7b0JBQ25CLE9BQU8sRUFBRSxDQUFDO2lCQUNiLENBQUMsQ0FBQztnQkFDSCxVQUFVLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUN6RCxVQUFVLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7YUFDN0QsQ0FBQztTQUNMO0tBQ0osQ0FBQztHQUNXLE9BQU8sQ0ErTW5CO1NBL01ZLE9BQU87QUFzTnBCLElBQWEsYUFBYSxHQUExQixNQUFhLGFBQWE7Q0FBSSxDQUFBO0FBQWpCLGFBQWE7SUFMekIsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztRQUNsQixZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDMUIsQ0FBQztHQUNXLGFBQWEsQ0FBSTtTQUFqQixhQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsQWZ0ZXJWaWV3SW5pdCxBZnRlclZpZXdDaGVja2VkLE9uRGVzdHJveSxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyLFZpZXdDaGlsZCxFbGVtZW50UmVmLFJlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3RyaWdnZXIsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgYW5pbWF0ZX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7RG9tSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2lkZWJhcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFtuZ0NsYXNzXT1cInsndWktc2lkZWJhciB1aS13aWRnZXQgdWktd2lkZ2V0LWNvbnRlbnQgdWktc2hhZG93Jzp0cnVlLCAndWktc2lkZWJhci1hY3RpdmUnOiB2aXNpYmxlLCBcbiAgICAgICAgICAgICd1aS1zaWRlYmFyLWxlZnQnOiAocG9zaXRpb24gPT09ICdsZWZ0JyksICd1aS1zaWRlYmFyLXJpZ2h0JzogKHBvc2l0aW9uID09PSAncmlnaHQnKSxcbiAgICAgICAgICAgICd1aS1zaWRlYmFyLXRvcCc6IChwb3NpdGlvbiA9PT0gJ3RvcCcpLCAndWktc2lkZWJhci1ib3R0b20nOiAocG9zaXRpb24gPT09ICdib3R0b20nKSwgXG4gICAgICAgICAgICAndWktc2lkZWJhci1mdWxsJzogZnVsbFNjcmVlbn1cIlxuICAgICAgICAgICAgW0BwYW5lbFN0YXRlXT1cInZpc2libGUgPyAndmlzaWJsZScgOiAnaGlkZGVuJ1wiIChAcGFuZWxTdGF0ZS5zdGFydCk9XCJvbkFuaW1hdGlvblN0YXJ0KCRldmVudClcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgIHJvbGU9XCJjb21wbGVtZW50YXJ5XCIgW2F0dHIuYXJpYS1tb2RhbF09XCJtb2RhbFwiPlxuICAgICAgICAgICAgPGEgW25nQ2xhc3NdPVwieyd1aS1zaWRlYmFyLWNsb3NlIHVpLWNvcm5lci1hbGwnOnRydWV9XCIgKm5nSWY9XCJzaG93Q2xvc2VJY29uXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJjbG9zZSgkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2xvc2UoJGV2ZW50KVwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYUNsb3NlTGFiZWxcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInBpIHBpLXRpbWVzXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcigncGFuZWxTdGF0ZScsIFtcbiAgICAgICAgICAgIHN0YXRlKCdoaWRkZW4nLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ3Zpc2libGUnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA9PiBoaWRkZW4nLCBhbmltYXRlKCczMDBtcyBlYXNlLWluJykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbignaGlkZGVuID0+IHZpc2libGUnLCBhbmltYXRlKCczMDBtcyBlYXNlLW91dCcpKVxuICAgICAgICBdKVxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgU2lkZWJhciBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyVmlld0NoZWNrZWQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBwb3NpdGlvbjogc3RyaW5nID0gJ2xlZnQnO1xuXG4gICAgQElucHV0KCkgZnVsbFNjcmVlbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGFwcGVuZFRvOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBibG9ja1Njcm9sbDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFDbG9zZUxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBtb2RhbDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBkaXNtaXNzaWJsZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBzaG93Q2xvc2VJY29uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGNsb3NlT25Fc2NhcGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGFpbmVyJywgeyBzdGF0aWM6IHRydWUgfSkgY29udGFpbmVyVmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSB2aXNpYmxlQ2hhbmdlOkV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgICBfdmlzaWJsZTogYm9vbGVhbjtcblxuICAgIHByZXZlbnRWaXNpYmxlQ2hhbmdlUHJvcGFnYXRpb246IGJvb2xlYW47XG5cbiAgICBtYXNrOiBIVE1MRGl2RWxlbWVudDtcblxuICAgIG1hc2tDbGlja0xpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGRvY3VtZW50RXNjYXBlTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgZXhlY3V0ZVBvc3REaXNwbGF5QWN0aW9uczogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIGlmKHRoaXMuYXBwZW5kVG8gPT09ICdib2R5JylcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLnZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl92aXNpYmxlO1xuICAgIH1cblxuICAgIHNldCB2aXNpYmxlKHZhbDpib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWw7XG5cbiAgICAgICAgaWYodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCAmJiB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICBpZih0aGlzLl92aXNpYmxlKVxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5wcmV2ZW50VmlzaWJsZUNoYW5nZVByb3BhZ2F0aW9uKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXZlbnRWaXNpYmxlQ2hhbmdlUHJvcGFnYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZih0aGlzLmV4ZWN1dGVQb3N0RGlzcGxheUFjdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMub25TaG93LmVtaXQoe30pO1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlUG9zdERpc3BsYXlBY3Rpb25zID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLmV4ZWN1dGVQb3N0RGlzcGxheUFjdGlvbnMgPSB0cnVlO1xuICAgICAgICBpZih0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZU1vZGFsaXR5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLm9uSGlkZS5lbWl0KHt9KTtcblxuICAgICAgICBpZih0aGlzLm1vZGFsKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2FibGVNb2RhbGl0eSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xvc2UoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMucHJldmVudFZpc2libGVDaGFuZ2VQcm9wYWdhdGlvbiA9IHRydWU7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgZW5hYmxlTW9kYWxpdHkoKSB7XG4gICAgICAgIGlmKCF0aGlzLm1hc2spIHtcbiAgICAgICAgICAgIHRoaXMubWFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdGhpcy5tYXNrLnN0eWxlLnpJbmRleCA9IFN0cmluZyhwYXJzZUludCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCkgLSAxKTtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkTXVsdGlwbGVDbGFzc2VzKHRoaXMubWFzaywgJ3VpLXdpZGdldC1vdmVybGF5IHVpLXNpZGViYXItbWFzaycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLmRpc21pc3NpYmxlKXtcbiAgICAgICAgICAgICAgICB0aGlzLm1hc2tDbGlja0xpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy5tYXNrLCAnY2xpY2snLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXNtaXNzaWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZShldmVudCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm1hc2spO1xuICAgICAgICAgICAgaWYodGhpcy5ibG9ja1Njcm9sbCkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoZG9jdW1lbnQuYm9keSwgJ3VpLW92ZXJmbG93LWhpZGRlbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZU1vZGFsaXR5KCkge1xuICAgICAgICBpZih0aGlzLm1hc2spIHtcbiAgICAgICAgICAgIHRoaXMudW5iaW5kTWFza0NsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5tYXNrKTtcbiAgICAgICAgICAgIGlmKHRoaXMuYmxvY2tTY3JvbGwpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKGRvY3VtZW50LmJvZHksICd1aS1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWFzayA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkFuaW1hdGlvblN0YXJ0KGV2ZW50KXtcbiAgICAgICAgc3dpdGNoKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNsb3NlT25Fc2NhcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRFc2NhcGVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYXNlICdoaWRkZW4nOlxuICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEVzY2FwZUxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IDI3KSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4KSA9PT0gKERvbUhhbmRsZXIuemluZGV4ICsgdGhpcy5iYXNlWkluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50RXNjYXBlTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmKHRoaXMuZG9jdW1lbnRFc2NhcGVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kTWFza0NsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLm1hc2tDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLm1hc2tDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLm1hc2tDbGlja0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy51bmJpbmRNYXNrQ2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50RXNjYXBlTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmKHRoaXMudmlzaWJsZSkge1xuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cblxuXHRcdHRoaXMudW5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtTaWRlYmFyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTaWRlYmFyXVxufSlcbmV4cG9ydCBjbGFzcyBTaWRlYmFyTW9kdWxlIHsgfVxuIl19