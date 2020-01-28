var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, Input, Output, EventEmitter, ElementRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, Footer } from 'primeng/api';
import { trigger, state, style, transition, animate } from '@angular/animations';
let idx = 0;
let Panel = class Panel {
    constructor(el) {
        this.el = el;
        this.collapsed = false;
        this.expandIcon = 'pi pi-plus';
        this.collapseIcon = 'pi pi-minus';
        this.showHeader = true;
        this.toggler = "icon";
        this.collapsedChange = new EventEmitter();
        this.onBeforeToggle = new EventEmitter();
        this.onAfterToggle = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.id = `ui-panel-${idx++}`;
    }
    onHeaderClick(event) {
        if (this.toggler === 'header') {
            this.toggle(event);
        }
    }
    onIconClick(event) {
        if (this.toggler === 'icon') {
            this.toggle(event);
        }
    }
    toggle(event) {
        if (this.animating) {
            return false;
        }
        this.animating = true;
        this.onBeforeToggle.emit({ originalEvent: event, collapsed: this.collapsed });
        if (this.toggleable) {
            if (this.collapsed)
                this.expand(event);
            else
                this.collapse(event);
        }
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
        this.onAfterToggle.emit({ originalEvent: event, collapsed: this.collapsed });
    }
};
Panel.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], Panel.prototype, "toggleable", void 0);
__decorate([
    Input()
], Panel.prototype, "header", void 0);
__decorate([
    Input()
], Panel.prototype, "collapsed", void 0);
__decorate([
    Input()
], Panel.prototype, "style", void 0);
__decorate([
    Input()
], Panel.prototype, "styleClass", void 0);
__decorate([
    Input()
], Panel.prototype, "expandIcon", void 0);
__decorate([
    Input()
], Panel.prototype, "collapseIcon", void 0);
__decorate([
    Input()
], Panel.prototype, "showHeader", void 0);
__decorate([
    Input()
], Panel.prototype, "toggler", void 0);
__decorate([
    Output()
], Panel.prototype, "collapsedChange", void 0);
__decorate([
    Output()
], Panel.prototype, "onBeforeToggle", void 0);
__decorate([
    Output()
], Panel.prototype, "onAfterToggle", void 0);
__decorate([
    Input()
], Panel.prototype, "transitionOptions", void 0);
__decorate([
    ContentChild(Footer, { static: true })
], Panel.prototype, "footerFacet", void 0);
Panel = __decorate([
    Component({
        selector: 'p-panel',
        template: `
        <div [attr.id]="id" [ngClass]="'ui-panel ui-widget ui-widget-content ui-corner-all'" [ngStyle]="style" [class]="styleClass">
            <div [ngClass]="{'ui-panel-titlebar ui-widget-header ui-helper-clearfix ui-corner-all': true, 'ui-panel-titlebar-clickable': (toggleable && toggler === 'header')}" 
                *ngIf="showHeader" (click)="onHeaderClick($event)">
                <span class="ui-panel-title" *ngIf="header" [attr.id]="id + '_header'">{{header}}</span>
                <ng-content select="p-header"></ng-content>
                <a *ngIf="toggleable" [attr.id]="id + '-label'" class="ui-panel-titlebar-icon ui-panel-titlebar-toggler ui-corner-all ui-state-default" tabindex="0"
                    (click)="onIconClick($event)" (keydown.enter)="onIconClick($event)" [attr.aria-controls]="id + '-content'" role="tab" [attr.aria-expanded]="!collapsed">
                    <span [class]="collapsed ? expandIcon : collapseIcon"></span>
                </a>
            </div>
            <div [attr.id]="id + '-content'" class="ui-panel-content-wrapper" [@panelContent]="collapsed ? {value: 'hidden', params: {transitionParams: animating ? transitionOptions : '0ms', height: '0', opacity:'0'}} : {value: 'visible', params: {transitionParams: animating ? transitionOptions : '0ms', height: '*', opacity: '1'}}" (@panelContent.done)="onToggleDone($event)"
                [ngClass]="{'ui-panel-content-wrapper-overflown': collapsed||animating}"
                role="region" [attr.aria-hidden]="collapsed" [attr.aria-labelledby]="id + '-label'">
                <div class="ui-panel-content ui-widget-content">
                    <ng-content></ng-content>
                </div>
                
                <div class="ui-panel-footer ui-widget-content" *ngIf="footerFacet">
                    <ng-content select="p-footer"></ng-content>
                </div>
            </div>
        </div>
    `,
        animations: [
            trigger('panelContent', [
                state('hidden', style({
                    height: '0',
                    opacity: 0
                })),
                state('void', style({
                    height: '{{height}}',
                    opacity: '{{opacity}}'
                }), { params: { height: '0', opacity: '0' } }),
                state('visible', style({
                    height: '*',
                    opacity: 1
                })),
                transition('visible <=> hidden', animate('{{transitionParams}}')),
                transition('void => hidden', animate('{{transitionParams}}')),
                transition('void => visible', animate('{{transitionParams}}'))
            ])
        ]
    })
], Panel);
export { Panel };
let PanelModule = class PanelModule {
};
PanelModule = __decorate([
    NgModule({
        imports: [CommonModule],
        exports: [Panel, SharedModule],
        declarations: [Panel]
    })
], PanelModule);
export { PanelModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFuZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL3BhbmVsLyIsInNvdXJjZXMiOlsicGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsVUFBVSxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNuRyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFaEQsT0FBTyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUUzRSxJQUFJLEdBQUcsR0FBVyxDQUFDLENBQUM7QUFnRHBCLElBQWEsS0FBSyxHQUFsQixNQUFhLEtBQUs7SUFrQ2QsWUFBb0IsRUFBYztRQUFkLE9BQUUsR0FBRixFQUFFLENBQVk7UUE1QnpCLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFNM0IsZUFBVSxHQUFXLFlBQVksQ0FBQztRQUVsQyxpQkFBWSxHQUFXLGFBQWEsQ0FBQztRQUVyQyxlQUFVLEdBQVksSUFBSSxDQUFDO1FBRTNCLFlBQU8sR0FBVyxNQUFNLENBQUM7UUFFeEIsb0JBQWUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUV4RCxtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXZELGtCQUFhLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFdkQsc0JBQWlCLEdBQVcsc0NBQXNDLENBQUM7UUFNNUUsT0FBRSxHQUFXLFlBQVksR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUVJLENBQUM7SUFFdEMsYUFBYSxDQUFDLEtBQVk7UUFDdEIsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtZQUMzQixJQUFJ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LE1BQU0sRUFBRSxZQUFZO29CQUNwQixPQUFPLEVBQUUsYUFBYTtpQkFDekIsQ0FBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFDLEVBQUMsQ0FBQztnQkFDMUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7b0JBQ25CLE1BQU0sRUFBRSxHQUFHO29CQUNYLE9BQU8sRUFBRSxDQUFDO2lCQUNiLENBQUMsQ0FBQztnQkFDSCxVQUFVLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Z0JBQ2pFLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztnQkFDN0QsVUFBVSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2FBQ2pFLENBQUM7U0FDTDtLQUNKLENBQUM7R0FDVyxLQUFLLENBcUZqQjtTQXJGWSxLQUFLO0FBNEZsQixJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0NBQUksQ0FBQTtBQUFmLFdBQVc7SUFMdkIsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1FBQ3ZCLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBQyxZQUFZLENBQUM7UUFDN0IsWUFBWSxFQUFFLENBQUMsS0FBSyxDQUFDO0tBQ3hCLENBQUM7R0FDVyxXQUFXLENBQUk7U0FBZixXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsSW5wdXQsT3V0cHV0LEV2ZW50RW1pdHRlcixFbGVtZW50UmVmLENvbnRlbnRDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7U2hhcmVkTW9kdWxlLEZvb3Rlcn0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtCbG9ja2FibGVVSX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHt0cmlnZ2VyLHN0YXRlLHN0eWxlLHRyYW5zaXRpb24sYW5pbWF0ZX0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5cbmxldCBpZHg6IG51bWJlciA9IDA7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1wYW5lbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZFwiIFtuZ0NsYXNzXT1cIid1aS1wYW5lbCB1aS13aWRnZXQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbCdcIiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCI+XG4gICAgICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsndWktcGFuZWwtdGl0bGViYXIgdWktd2lkZ2V0LWhlYWRlciB1aS1oZWxwZXItY2xlYXJmaXggdWktY29ybmVyLWFsbCc6IHRydWUsICd1aS1wYW5lbC10aXRsZWJhci1jbGlja2FibGUnOiAodG9nZ2xlYWJsZSAmJiB0b2dnbGVyID09PSAnaGVhZGVyJyl9XCIgXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJzaG93SGVhZGVyXCIgKGNsaWNrKT1cIm9uSGVhZGVyQ2xpY2soJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFuZWwtdGl0bGVcIiAqbmdJZj1cImhlYWRlclwiIFthdHRyLmlkXT1cImlkICsgJ19oZWFkZXInXCI+e3toZWFkZXJ9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8YSAqbmdJZj1cInRvZ2dsZWFibGVcIiBbYXR0ci5pZF09XCJpZCArICctbGFiZWwnXCIgY2xhc3M9XCJ1aS1wYW5lbC10aXRsZWJhci1pY29uIHVpLXBhbmVsLXRpdGxlYmFyLXRvZ2dsZXIgdWktY29ybmVyLWFsbCB1aS1zdGF0ZS1kZWZhdWx0XCIgdGFiaW5kZXg9XCIwXCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uSWNvbkNsaWNrKCRldmVudClcIiAoa2V5ZG93bi5lbnRlcik9XCJvbkljb25DbGljaygkZXZlbnQpXCIgW2F0dHIuYXJpYS1jb250cm9sc109XCJpZCArICctY29udGVudCdcIiByb2xlPVwidGFiXCIgW2F0dHIuYXJpYS1leHBhbmRlZF09XCIhY29sbGFwc2VkXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIFtjbGFzc109XCJjb2xsYXBzZWQgPyBleHBhbmRJY29uIDogY29sbGFwc2VJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBbYXR0ci5pZF09XCJpZCArICctY29udGVudCdcIiBjbGFzcz1cInVpLXBhbmVsLWNvbnRlbnQtd3JhcHBlclwiIFtAcGFuZWxDb250ZW50XT1cImNvbGxhcHNlZCA/IHt2YWx1ZTogJ2hpZGRlbicsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IGFuaW1hdGluZyA/IHRyYW5zaXRpb25PcHRpb25zIDogJzBtcycsIGhlaWdodDogJzAnLCBvcGFjaXR5OicwJ319IDoge3ZhbHVlOiAndmlzaWJsZScsIHBhcmFtczoge3RyYW5zaXRpb25QYXJhbXM6IGFuaW1hdGluZyA/IHRyYW5zaXRpb25PcHRpb25zIDogJzBtcycsIGhlaWdodDogJyonLCBvcGFjaXR5OiAnMSd9fVwiIChAcGFuZWxDb250ZW50LmRvbmUpPVwib25Ub2dnbGVEb25lKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsndWktcGFuZWwtY29udGVudC13cmFwcGVyLW92ZXJmbG93bic6IGNvbGxhcHNlZHx8YW5pbWF0aW5nfVwiXG4gICAgICAgICAgICAgICAgcm9sZT1cInJlZ2lvblwiIFthdHRyLmFyaWEtaGlkZGVuXT1cImNvbGxhcHNlZFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJpZCArICctbGFiZWwnXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLXBhbmVsLWNvbnRlbnQgdWktd2lkZ2V0LWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1wYW5lbC1mb290ZXIgdWktd2lkZ2V0LWNvbnRlbnRcIiAqbmdJZj1cImZvb3RlckZhY2V0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50IHNlbGVjdD1cInAtZm9vdGVyXCI+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdwYW5lbENvbnRlbnQnLCBbXG4gICAgICAgICAgICBzdGF0ZSgnaGlkZGVuJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJzAnLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDBcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHN0YXRlKCd2b2lkJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJ3t7aGVpZ2h0fX0nLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6ICd7e29wYWNpdHl9fSdcbiAgICAgICAgICAgIH0pLCB7cGFyYW1zOiB7aGVpZ2h0OiAnMCcsIG9wYWNpdHk6ICcwJ319KSxcbiAgICAgICAgICAgIHN0YXRlKCd2aXNpYmxlJywgc3R5bGUoe1xuICAgICAgICAgICAgICAgIGhlaWdodDogJyonLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH0pKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3Zpc2libGUgPD0+IGhpZGRlbicsIGFuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiBoaWRkZW4nLCBhbmltYXRlKCd7e3RyYW5zaXRpb25QYXJhbXN9fScpKSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gdmlzaWJsZScsIGFuaW1hdGUoJ3t7dHJhbnNpdGlvblBhcmFtc319JykpXG4gICAgICAgIF0pXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBQYW5lbCBpbXBsZW1lbnRzIEJsb2NrYWJsZVVJIHtcblxuICAgIEBJbnB1dCgpIHRvZ2dsZWFibGU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBoZWFkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNvbGxhcHNlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG4gICAgXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIGV4cGFuZEljb246IHN0cmluZyA9ICdwaSBwaS1wbHVzJztcbiAgICBcbiAgICBASW5wdXQoKSBjb2xsYXBzZUljb246IHN0cmluZyA9ICdwaSBwaS1taW51cyc7XG4gIFxuICAgIEBJbnB1dCgpIHNob3dIZWFkZXI6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgdG9nZ2xlcjogc3RyaW5nID0gXCJpY29uXCI7XG4gICAgXG4gICAgQE91dHB1dCgpIGNvbGxhcHNlZENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQWZ0ZXJUb2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25PcHRpb25zOiBzdHJpbmcgPSAnNDAwbXMgY3ViaWMtYmV6aWVyKDAuODYsIDAsIDAuMDcsIDEpJztcblxuICAgIEBDb250ZW50Q2hpbGQoRm9vdGVyLCB7IHN0YXRpYzogdHJ1ZSB9KSBmb290ZXJGYWNldDtcbiAgICBcbiAgICBhbmltYXRpbmc6IGJvb2xlYW47XG4gICAgXG4gICAgaWQ6IHN0cmluZyA9IGB1aS1wYW5lbC0ke2lkeCsrfWA7XG4gICAgXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZikge31cblxuICAgIG9uSGVhZGVyQ2xpY2soZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnRvZ2dsZXIgPT09ICdoZWFkZXInKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkljb25DbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMudG9nZ2xlciA9PT0gJ2ljb24nKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdG9nZ2xlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBpZih0aGlzLmFuaW1hdGluZykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHRoaXMub25CZWZvcmVUb2dnbGUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGNvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWR9KTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMudG9nZ2xlYWJsZSkge1xuICAgICAgICAgICAgaWYodGhpcy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQoZXZlbnQpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGFwc2UoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBleHBhbmQoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWRDaGFuZ2UuZW1pdCh0aGlzLmNvbGxhcHNlZCk7XG4gICAgfVxuICAgIFxuICAgIGNvbGxhcHNlKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuY29sbGFwc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jb2xsYXBzZWRDaGFuZ2UuZW1pdCh0aGlzLmNvbGxhcHNlZCk7XG4gICAgfVxuICAgIFxuICAgIGdldEJsb2NrYWJsZUVsZW1lbnQoKTogSFRNTEVsZW1lbnTCoHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9XG4gICAgXG4gICAgb25Ub2dnbGVEb25lKGV2ZW50OiBFdmVudCkge1xuICAgICAgICB0aGlzLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uQWZ0ZXJUb2dnbGUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGNvbGxhcHNlZDogdGhpcy5jb2xsYXBzZWR9KTtcbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUGFuZWwsU2hhcmVkTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtQYW5lbF1cbn0pXG5leHBvcnQgY2xhc3MgUGFuZWxNb2R1bGUgeyB9XG4iXX0=