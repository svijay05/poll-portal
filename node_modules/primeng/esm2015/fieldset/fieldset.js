var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
let idx = 0;
let Fieldset = class Fieldset {
    constructor(el) {
        this.el = el;
        this.collapsed = false;
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = `ui-fieldset-${idx++}`;
    }
    toggle(event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.collapsed)
            this.expand(event);
        else
            this.collapse(event);
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        event.preventDefault();
    }
    expand(event) {
        this.collapsed = false;
        this.collapsedChange.emit(this.collapsed);
    }
    collapse(event) {
        this.collapsed = true;
        this.collapsedChange.emit(this.collapsed);
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    onToggleDone(event) {
        this.animating = false;
    }
};
Fieldset.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], Fieldset.prototype, "legend", void 0);
__decorate([
    Input()
], Fieldset.prototype, "toggleable", void 0);
__decorate([
    Input()
], Fieldset.prototype, "collapsed", void 0);
__decorate([
    Output()
], Fieldset.prototype, "collapsedChange", void 0);
__decorate([
    Output()
], Fieldset.prototype, "onBeforeToggle", void 0);
__decorate([
    Output()
], Fieldset.prototype, "onAfterToggle", void 0);
__decorate([
    Input()
], Fieldset.prototype, "style", void 0);
__decorate([
    Input()
], Fieldset.prototype, "styleClass", void 0);
__decorate([
    Input()
], Fieldset.prototype, "transitionOptions", void 0);
Fieldset = __decorate([
    Component({
        selector: 'p-fieldset',
        template: `
        <fieldset [attr.id]="id" [ngClass]="{'ui-fieldset ui-widget ui-widget-content ui-corner-all': true, 'ui-fieldset-toggleable': toggleable}" [ngStyle]="style" [class]="styleClass">
            <legend class="ui-fieldset-legend ui-corner-all ui-state-default ui-unselectable-text">
                <ng-container *ngIf="toggleable; else legendContent">
                    <a tabindex="0" (click)="toggle($event)" (keydown.enter)="toggle($event)" [attr.aria-controls]="id + '-content'" [attr.aria-expanded]="!collapsed">
                        <ng-container *ngTemplateOutlet="legendContent"></ng-container>
                    </a>
                </ng-container>
                <ng-template #legendContent>
                    <span class="ui-fieldset-toggler pi" *ngIf="toggleable" [ngClass]="{'pi-minus': !collapsed,'pi-plus':collapsed}"></span>
                    <span class="ui-fieldset-legend-text">{{legend}}</span>
                    <ng-content select="p-header"></ng-content>
                </ng-template>
            </legend>
            <div [attr.id]="id + '-content'" class="ui-fieldset-content-wrapper" [@fieldsetContent]="collapsed ? {value: 'hidden', params: {transitionParams: transitionOptions, height: '0'}} : {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*'}}" 
                        [attr.aria-labelledby]="id" [ngClass]="{'ui-fieldset-content-wrapper-overflown': collapsed||animating}" [attr.aria-hidden]="collapsed"
                         (@fieldsetContent.done)="onToggleDone($event)" role="region">
                <div class="ui-fieldset-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </fieldset>
    `,
        animations: [
            trigger('fieldsetContent', [
                state('hidden', style({
                    height: '0'
                })),
                state('void', style({
                    height: '{{height}}'
                }), { params: { height: '0' } }),
                state('visible', style({
                    height: '*'
                })),
                transition('visible => hidden', animate('{{transitionParams}}')),
                transition('hidden => visible', animate('{{transitionParams}}')),
                transition('void => hidden', animate('{{transitionParams}}')),
                transition('void => visible', animate('{{transitionParams}}'))
            ])
        ]
    })
], Fieldset);
export { Fieldset };
let FieldsetModule = class FieldsetModule {
};
FieldsetModule = __decorate([
    NgModule({
        imports: [CommonModule],
        exports: [Fieldset, SharedModule],
        declarations: [Fieldset]
    })
], FieldsetModule);
export { FieldsetModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmllbGRzZXQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2ZpZWxkc2V0LyIsInNvdXJjZXMiOlsiZmllbGRzZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3RGLE9BQU8sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDM0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFHekMsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDO0FBNkNwQixJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFRO0lBc0JqQixZQUFvQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQWhCekIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUxQixvQkFBZSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXhELG1CQUFjLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdkQsa0JBQWEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU12RCxzQkFBaUIsR0FBVyxzQ0FBc0MsQ0FBQztRQU01RSxPQUFFLEdBQVcsZUFBZSxHQUFHLEVBQUUsRUFBRSxDQUFDO0lBRkMsQ0FBQztJQUl0QyxNQUFNLENBQUMsS0FBSztRQUNSLElBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNmLE9BQU8sS0FBSyxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJ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QUUsQ0FBQyxRQUFRLENBQUM7S0FDM0IsQ0FBQztHQUNXLGNBQWMsQ0FBSTtTQUFsQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsSW5wdXQsT3V0cHV0LEV2ZW50RW1pdHRlcixFbGVtZW50UmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7dHJpZ2dlcixzdGF0ZSxzdHlsZSx0cmFuc2l0aW9uLGFuaW1hdGV9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1NoYXJlZE1vZHVsZX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtCbG9ja2FibGVVSX0gZnJvbSAncHJpbWVuZy9hcGknO1xuXG5sZXQgaWR4OiBudW1iZXIgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZmllbGRzZXQnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxmaWVsZHNldCBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cInsndWktZmllbGRzZXQgdWktd2lkZ2V0IHVpLXdpZGdldC1jb250ZW50IHVpLWNvcm5lci1hbGwnOiB0cnVlLCAndWktZmllbGRzZXQtdG9nZ2xlYWJsZSc6IHRvZ2dsZWFibGV9XCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiPlxuICAgICAgICAgICAgPGxlZ2VuZCBjbGFzcz1cInVpLWZpZWxkc2V0LWxlZ2VuZCB1aS1jb3JuZXItYWxsIHVpLXN0YXRlLWRlZmF1bHQgdWktdW5zZWxlY3RhYmxlLXRleHRcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwidG9nZ2xlYWJsZTsgZWxzZSBsZWdlbmRDb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgIDxhIHRhYmluZGV4PVwiMFwiIChjbGljayk9XCJ0b2dnbGUoJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cInRvZ2dsZSgkZXZlbnQpXCIgW2F0dHIuYXJpYS1jb250cm9sc109XCJpZCArICctY29udGVudCdcIiBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIiFjb2xsYXBzZWRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJsZWdlbmRDb250ZW50XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2xlZ2VuZENvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktZmllbGRzZXQtdG9nZ2xlciBwaVwiICpuZ0lmPVwidG9nZ2xlYWJsZVwiIFtuZ0NsYXNzXT1cInsncGktbWludXMnOiAhY29sbGFwc2VkLCdwaS1wbHVzJzpjb2xsYXBzZWR9XCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLWZpZWxkc2V0LWxlZ2VuZC10ZXh0XCI+e3tsZWdlbmR9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwicC1oZWFkZXJcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvbGVnZW5kPlxuICAgICAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZCArICctY29udGVudCdcIiBjbGFzcz1cInVpLWZpZWxkc2V0LWNvbnRlbnQtd3JhcHBlclwiIFtAZmllbGRzZXRDb250ZW50XT1cImNvbGxhcHNlZCA/IHt2YWx1ZTogJ2hpZGRlbicsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IHRyYW5zaXRpb25PcHRpb25zLCBoZWlnaHQ6ICcwJ319IDoge3ZhbHVlOiAndmlzaWJsZScsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IGFuaW1hdGluZyA/IHRyYW5zaXRpb25PcHRpb25zIDogJzBtcycsIGhlaWdodDogJyonfX1cIiBcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJpZFwiIFtuZ0NsYXNzXT1cInsndWktZmllbGRzZXQtY29udGVudC13cmFwcGVyLW92ZXJmbG93bic6IGNvbGxhcHNlZHx8YW5pbWF0aW5nfVwiIFthdHRyLmFyaWEtaGlkZGVuXT1cImNvbGxhcHNlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgKEBmaWVsZHNldENvbnRlbnQuZG9uZSk9XCJvblRvZ2dsZURvbmUoJGV2ZW50KVwiIHJvbGU9XCJyZWdpb25cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktZmllbGRzZXQtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9maWVsZHNldD5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcignZmllbGRzZXRDb250ZW50JywgW1xuICAgICAgICAgICAgc3RhdGUoJ2hpZGRlbicsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcwJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ3ZvaWQnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAne3toZWlnaHR9fSdcbiAgICAgICAgICAgIH0pLCB7cGFyYW1zOiB7aGVpZ2h0OiAnMCd9fSksXG4gICAgICAgICAgICBzdGF0ZSgndmlzaWJsZScsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcqJ1xuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA9PiBoaWRkZW4nLCBhbmltYXRlKCd7e3RyYW5zaXRpb25QYXJhbXN9fScpKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ2hpZGRlbiA9PiB2aXNpYmxlJywgYW5pbWF0ZSgne3t0cmFuc2l0aW9uUGFyYW1zfX0nKSksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2b2lkID0+IGhpZGRlbicsIGFuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiB2aXNpYmxlJywgYW5pbWF0ZSgne3t0cmFuc2l0aW9uUGFyYW1zfX0nKSlcbiAgICAgICAgXSlcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIEZpZWxkc2V0IGltcGxlbWVudHMgQmxvY2thYmxlVUkge1xuXG4gICAgQElucHV0KCkgbGVnZW5kOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0b2dnbGVhYmxlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgY29sbGFwc2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBAT3V0cHV0KCkgY29sbGFwc2VkQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25CZWZvcmVUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQWZ0ZXJUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnNDAwbXMgY3ViaWMtYmV6aWVyKDAuODYsIDAsIDAuMDcsIDEpJztcbiAgICBcbiAgICBwdWJsaWMgYW5pbWF0aW5nOiBib29sZWFuO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHt9XG4gICAgXG4gICAgaWQ6IHN0cmluZyA9IGB1aS1maWVsZHNldC0ke2lkeCsrfWA7XG4gICAgICAgIFxuICAgIHRvZ2dsZShldmVudCkge1xuICAgICAgICBpZih0aGlzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMub25CZWZvcmVUb2dnbGUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGNvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWR9KTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuY29sbGFwc2VkKVxuICAgICAgICAgICAgdGhpcy5leHBhbmQoZXZlbnQpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlKGV2ZW50KTtcbiAgICAgICAgICAgIFxuICAgICAgICB0aGlzLm9uQWZ0ZXJUb2dnbGUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGNvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWR9KTsgICBcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgXG4gICAgZXhwYW5kKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkQ2hhbmdlLmVtaXQodGhpcy5jb2xsYXBzZWQpO1xuICAgIH1cbiAgICBcbiAgICBjb2xsYXBzZShldmVudCkge1xuICAgICAgICB0aGlzLmNvbGxhcHNlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkQ2hhbmdlLmVtaXQodGhpcy5jb2xsYXBzZWQpO1xuICAgIH1cbiAgICBcbiAgICBnZXRCbG9ja2FibGVFbGVtZW50KCk6IEhUTUxFbGVtZW50wqB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF07XG4gICAgfVxuICAgIFxuICAgIG9uVG9nZ2xlRG9uZShldmVudDogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRmllbGRzZXQsU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtGaWVsZHNldF1cbn0pXG5leHBvcnQgY2xhc3MgRmllbGRzZXRNb2R1bGUgeyB9Il19