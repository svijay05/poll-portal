var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, TemplateRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'primeng/api';
let Paginator = class Paginator {
    constructor(cd) {
        this.cd = cd;
        this.pageLinkSize = 5;
        this.onPageChange = new EventEmitter();
        this.alwaysShow = true;
        this.dropdownScrollHeight = '200px';
        this.currentPageReportTemplate = '{currentPage} of {totalPages}';
        this.totalRecords = 0;
        this.rows = 0;
        this._first = 0;
    }
    ngOnInit() {
        this.updatePaginatorState();
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.totalRecords) {
            this.updatePageLinks();
            this.updatePaginatorState();
            this.updateFirst();
            this.updateRowsPerPageOptions();
        }
        if (simpleChange.first) {
            this._first = simpleChange.first.currentValue;
            this.updatePageLinks();
            this.updatePaginatorState();
        }
        if (simpleChange.rows) {
            this.updatePageLinks();
            this.updatePaginatorState();
        }
        if (simpleChange.rowsPerPageOptions) {
            this.updateRowsPerPageOptions();
        }
    }
    get first() {
        return this._first;
    }
    set first(val) {
        this._first = val;
    }
    updateRowsPerPageOptions() {
        if (this.rowsPerPageOptions) {
            this.rowsPerPageItems = [];
            for (let opt of this.rowsPerPageOptions) {
                if (typeof opt == 'object' && opt['showAll']) {
                    this.rowsPerPageItems.push({ label: opt['showAll'], value: this.totalRecords });
                }
                else {
                    this.rowsPerPageItems.push({ label: String(opt), value: opt });
                }
            }
        }
    }
    isFirstPage() {
        return this.getPage() === 0;
    }
    isLastPage() {
        return this.getPage() === this.getPageCount() - 1;
    }
    getPageCount() {
        return Math.ceil(this.totalRecords / this.rows) || 1;
    }
    calculatePageLinkBoundaries() {
        let numberOfPages = this.getPageCount(), visiblePages = Math.min(this.pageLinkSize, numberOfPages);
        //calculate range, keep current in middle if necessary
        let start = Math.max(0, Math.ceil(this.getPage() - ((visiblePages) / 2))), end = Math.min(numberOfPages - 1, start + visiblePages - 1);
        //check when approaching to last page
        var delta = this.pageLinkSize - (end - start + 1);
        start = Math.max(0, start - delta);
        return [start, end];
    }
    updatePageLinks() {
        this.pageLinks = [];
        let boundaries = this.calculatePageLinkBoundaries(), start = boundaries[0], end = boundaries[1];
        for (let i = start; i <= end; i++) {
            this.pageLinks.push(i + 1);
        }
    }
    changePage(p) {
        var pc = this.getPageCount();
        if (p >= 0 && p < pc) {
            this._first = this.rows * p;
            var state = {
                page: p,
                first: this.first,
                rows: this.rows,
                pageCount: pc
            };
            this.updatePageLinks();
            this.onPageChange.emit(state);
            this.updatePaginatorState();
        }
    }
    updateFirst() {
        const page = this.getPage();
        if (page > 0 && this.totalRecords && (this.first >= this.totalRecords)) {
            Promise.resolve(null).then(() => this.changePage(page - 1));
        }
    }
    getPage() {
        return Math.floor(this.first / this.rows);
    }
    changePageToFirst(event) {
        if (!this.isFirstPage()) {
            this.changePage(0);
        }
        event.preventDefault();
    }
    changePageToPrev(event) {
        this.changePage(this.getPage() - 1);
        event.preventDefault();
    }
    changePageToNext(event) {
        this.changePage(this.getPage() + 1);
        event.preventDefault();
    }
    changePageToLast(event) {
        if (!this.isLastPage()) {
            this.changePage(this.getPageCount() - 1);
        }
        event.preventDefault();
    }
    onPageLinkClick(event, page) {
        this.changePage(page);
        event.preventDefault();
    }
    onRppChange(event) {
        this.changePage(this.getPage());
    }
    updatePaginatorState() {
        this.paginatorState = {
            page: this.getPage(),
            pageCount: this.getPageCount(),
            rows: this.rows,
            first: this.first,
            totalRecords: this.totalRecords
        };
    }
    get currentPageReport() {
        return this.currentPageReportTemplate
            .replace("{currentPage}", (this.getPage() + 1).toString())
            .replace("{totalPages}", this.getPageCount().toString());
    }
};
Paginator.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], Paginator.prototype, "pageLinkSize", void 0);
__decorate([
    Output()
], Paginator.prototype, "onPageChange", void 0);
__decorate([
    Input()
], Paginator.prototype, "style", void 0);
__decorate([
    Input()
], Paginator.prototype, "styleClass", void 0);
__decorate([
    Input()
], Paginator.prototype, "alwaysShow", void 0);
__decorate([
    Input()
], Paginator.prototype, "templateLeft", void 0);
__decorate([
    Input()
], Paginator.prototype, "templateRight", void 0);
__decorate([
    Input()
], Paginator.prototype, "dropdownAppendTo", void 0);
__decorate([
    Input()
], Paginator.prototype, "dropdownScrollHeight", void 0);
__decorate([
    Input()
], Paginator.prototype, "currentPageReportTemplate", void 0);
__decorate([
    Input()
], Paginator.prototype, "showCurrentPageReport", void 0);
__decorate([
    Input()
], Paginator.prototype, "totalRecords", void 0);
__decorate([
    Input()
], Paginator.prototype, "rows", void 0);
__decorate([
    Input()
], Paginator.prototype, "rowsPerPageOptions", void 0);
__decorate([
    Input()
], Paginator.prototype, "first", null);
Paginator = __decorate([
    Component({
        selector: 'p-paginator',
        template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="'ui-paginator ui-widget ui-widget-header ui-unselectable-text ui-helper-clearfix'"
            *ngIf="alwaysShow ? true : (pageLinks && pageLinks.length > 1)">
            <div class="ui-paginator-left-content" *ngIf="templateLeft">
                <ng-container *ngTemplateOutlet="templateLeft; context: {$implicit: paginatorState}"></ng-container>
            </div>
            <span class="ui-paginator-current" *ngIf="showCurrentPageReport">{{currentPageReport}}</span>
            <a [attr.tabindex]="isFirstPage() ? null : '0'" class="ui-paginator-first ui-paginator-element ui-state-default ui-corner-all"
                    (click)="changePageToFirst($event)" (keydown.enter)="changePageToFirst($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">
                <span class="ui-paginator-icon pi pi-step-backward"></span>
            </a>
            <a tabindex="0" [attr.tabindex]="isFirstPage() ? null : '0'" class="ui-paginator-prev ui-paginator-element ui-state-default ui-corner-all"
                    (click)="changePageToPrev($event)" (keydown.enter)="changePageToPrev($event)" [ngClass]="{'ui-state-disabled':isFirstPage()}" [tabindex]="isFirstPage() ? -1 : null">
                <span class="ui-paginator-icon pi pi-caret-left"></span>
            </a>
            <span class="ui-paginator-pages">
                <a tabindex="0" *ngFor="let pageLink of pageLinks" class="ui-paginator-page ui-paginator-element ui-state-default ui-corner-all"
                    (click)="onPageLinkClick($event, pageLink - 1)" (keydown.enter)="onPageLinkClick($event, pageLink - 1)" [ngClass]="{'ui-state-active': (pageLink-1 == getPage())}">{{pageLink}}</a>
            </span>
            <a [attr.tabindex]="isLastPage() ? null : '0'" class="ui-paginator-next ui-paginator-element ui-state-default ui-corner-all"
                    (click)="changePageToNext($event)" (keydown.enter)="changePageToNext($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="ui-paginator-icon pi pi-caret-right"></span>
            </a>
            <a [attr.tabindex]="isLastPage() ? null : '0'" class="ui-paginator-last ui-paginator-element ui-state-default ui-corner-all"
                    (click)="changePageToLast($event)" (keydown.enter)="changePageToLast($event)" [ngClass]="{'ui-state-disabled':isLastPage()}" [tabindex]="isLastPage() ? -1 : null">
                <span class="ui-paginator-icon pi pi-step-forward"></span>
            </a>
            <p-dropdown [options]="rowsPerPageItems" [(ngModel)]="rows" *ngIf="rowsPerPageOptions" 
                (onChange)="onRppChange($event)" [appendTo]="dropdownAppendTo" [scrollHeight]="dropdownScrollHeight"></p-dropdown>
            <div class="ui-paginator-right-content" *ngIf="templateRight">
                <ng-container *ngTemplateOutlet="templateRight; context: {$implicit: paginatorState}"></ng-container>
            </div>
        </div>
    `
    })
], Paginator);
export { Paginator };
let PaginatorModule = class PaginatorModule {
};
PaginatorModule = __decorate([
    NgModule({
        imports: [CommonModule, DropdownModule, FormsModule, SharedModule],
        exports: [Paginator, DropdownModule, FormsModule, SharedModule],
        declarations: [Paginator]
    })
], PaginatorModule);
export { PaginatorModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5hdG9yLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9wYWdpbmF0b3IvIiwic291cmNlcyI6WyJwYWdpbmF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsaUJBQWlCLEVBQUMsWUFBWSxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzFJLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBRWhELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUF1Q3pDLElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVM7SUFzQ2xCLFlBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBcENoQyxpQkFBWSxHQUFXLENBQUMsQ0FBQztRQUV4QixpQkFBWSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBTXRELGVBQVUsR0FBWSxJQUFJLENBQUM7UUFRM0IseUJBQW9CLEdBQVcsT0FBTyxDQUFDO1FBRXZDLDhCQUF5QixHQUFXLCtCQUErQixDQUFDO1FBSXBFLGlCQUFZLEdBQVcsQ0FBQyxDQUFDO1FBRXpCLFNBQUksR0FBVyxDQUFDLENBQUM7UUFVMUIsV0FBTSxHQUFXLENBQUMsQ0FBQztJQUV5QixDQUFDO0lBRTdDLFFBQVE7UUFDSixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsV0FBVyxDQUFDLFlBQTJCO1FBQ25DLElBQUksWUFBWSxDQUFDLFlBQVksRUFBRTtZQUMzQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsSUFBSSxD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O0FBRXZDO0lBQVIsS0FBSyxFQUFFOzREQUFxRTtBQUVwRTtJQUFSLEtBQUssRUFBRTt3REFBZ0M7QUFFL0I7SUFBUixLQUFLLEVBQUU7K0NBQTBCO0FBRXpCO0lBQVIsS0FBSyxFQUFFO3VDQUFrQjtBQUVqQjtJQUFSLEtBQUssRUFBRTtxREFBMkI7QUF3QzFCO0lBQVIsS0FBSyxFQUFFO3NDQUVQO0FBdEVRLFNBQVM7SUFyQ3JCLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBaUNUO0tBQ0osQ0FBQztHQUNXLFNBQVMsQ0E4TXJCO1NBOU1ZLFNBQVM7QUFxTnRCLElBQWEsZUFBZSxHQUE1QixNQUFhLGVBQWU7Q0FBSSxDQUFBO0FBQW5CLGVBQWU7SUFMM0IsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLGNBQWMsRUFBQyxXQUFXLEVBQUMsWUFBWSxDQUFDO1FBQy9ELE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBQyxjQUFjLEVBQUMsV0FBVyxFQUFDLFlBQVksQ0FBQztRQUM1RCxZQUFZLEVBQUUsQ0FBQyxTQUFTLENBQUM7S0FDNUIsQ0FBQztHQUNXLGVBQWUsQ0FBSTtTQUFuQixlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsT25Jbml0LElucHV0LE91dHB1dCxDaGFuZ2VEZXRlY3RvclJlZixFdmVudEVtaXR0ZXIsVGVtcGxhdGVSZWYsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7Rm9ybXNNb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RHJvcGRvd25Nb2R1bGV9IGZyb20gJ3ByaW1lbmcvZHJvcGRvd24nO1xuaW1wb3J0IHtTZWxlY3RJdGVtfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge1NoYXJlZE1vZHVsZX0gZnJvbSAncHJpbWVuZy9hcGknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtcGFnaW5hdG9yJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbbmdDbGFzc109XCIndWktcGFnaW5hdG9yIHVpLXdpZGdldCB1aS13aWRnZXQtaGVhZGVyIHVpLXVuc2VsZWN0YWJsZS10ZXh0IHVpLWhlbHBlci1jbGVhcmZpeCdcIlxuICAgICAgICAgICAgKm5nSWY9XCJhbHdheXNTaG93ID8gdHJ1ZSA6IChwYWdlTGlua3MgJiYgcGFnZUxpbmtzLmxlbmd0aCA+IDEpXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGFnaW5hdG9yLWxlZnQtY29udGVudFwiICpuZ0lmPVwidGVtcGxhdGVMZWZ0XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlTGVmdDsgY29udGV4dDogeyRpbXBsaWNpdDogcGFnaW5hdG9yU3RhdGV9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFnaW5hdG9yLWN1cnJlbnRcIiAqbmdJZj1cInNob3dDdXJyZW50UGFnZVJlcG9ydFwiPnt7Y3VycmVudFBhZ2VSZXBvcnR9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxhIFthdHRyLnRhYmluZGV4XT1cImlzRmlyc3RQYWdlKCkgPyBudWxsIDogJzAnXCIgY2xhc3M9XCJ1aS1wYWdpbmF0b3ItZmlyc3QgdWktcGFnaW5hdG9yLWVsZW1lbnQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cImNoYW5nZVBhZ2VUb0ZpcnN0KCRldmVudClcIiAoa2V5ZG93bi5lbnRlcik9XCJjaGFuZ2VQYWdlVG9GaXJzdCgkZXZlbnQpXCIgW25nQ2xhc3NdPVwieyd1aS1zdGF0ZS1kaXNhYmxlZCc6aXNGaXJzdFBhZ2UoKX1cIiBbdGFiaW5kZXhdPVwiaXNGaXJzdFBhZ2UoKSA/IC0xIDogbnVsbFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFnaW5hdG9yLWljb24gcGkgcGktc3RlcC1iYWNrd2FyZFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxhIHRhYmluZGV4PVwiMFwiIFthdHRyLnRhYmluZGV4XT1cImlzRmlyc3RQYWdlKCkgPyBudWxsIDogJzAnXCIgY2xhc3M9XCJ1aS1wYWdpbmF0b3ItcHJldiB1aS1wYWdpbmF0b3ItZWxlbWVudCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGxcIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hhbmdlUGFnZVRvUHJldigkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2hhbmdlUGFnZVRvUHJldigkZXZlbnQpXCIgW25nQ2xhc3NdPVwieyd1aS1zdGF0ZS1kaXNhYmxlZCc6aXNGaXJzdFBhZ2UoKX1cIiBbdGFiaW5kZXhdPVwiaXNGaXJzdFBhZ2UoKSA/IC0xIDogbnVsbFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFnaW5hdG9yLWljb24gcGkgcGktY2FyZXQtbGVmdFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFnaW5hdG9yLXBhZ2VzXCI+XG4gICAgICAgICAgICAgICAgPGEgdGFiaW5kZXg9XCIwXCIgKm5nRm9yPVwibGV0IHBhZ2VMaW5rIG9mIHBhZ2VMaW5rc1wiIGNsYXNzPVwidWktcGFnaW5hdG9yLXBhZ2UgdWktcGFnaW5hdG9yLWVsZW1lbnQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsXCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uUGFnZUxpbmtDbGljaygkZXZlbnQsIHBhZ2VMaW5rIC0gMSlcIiAoa2V5ZG93bi5lbnRlcik9XCJvblBhZ2VMaW5rQ2xpY2soJGV2ZW50LCBwYWdlTGluayAtIDEpXCIgW25nQ2xhc3NdPVwieyd1aS1zdGF0ZS1hY3RpdmUnOiAocGFnZUxpbmstMSA9PSBnZXRQYWdlKCkpfVwiPnt7cGFnZUxpbmt9fTwvYT5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxhIFthdHRyLnRhYmluZGV4XT1cImlzTGFzdFBhZ2UoKSA/IG51bGwgOiAnMCdcIiBjbGFzcz1cInVpLXBhZ2luYXRvci1uZXh0IHVpLXBhZ2luYXRvci1lbGVtZW50IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbFwiXG4gICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJjaGFuZ2VQYWdlVG9OZXh0KCRldmVudClcIiAoa2V5ZG93bi5lbnRlcik9XCJjaGFuZ2VQYWdlVG9OZXh0KCRldmVudClcIiBbbmdDbGFzc109XCJ7J3VpLXN0YXRlLWRpc2FibGVkJzppc0xhc3RQYWdlKCl9XCIgW3RhYmluZGV4XT1cImlzTGFzdFBhZ2UoKSA/IC0xIDogbnVsbFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGFnaW5hdG9yLWljb24gcGkgcGktY2FyZXQtcmlnaHRcIj48L3NwYW4+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICA8YSBbYXR0ci50YWJpbmRleF09XCJpc0xhc3RQYWdlKCkgPyBudWxsIDogJzAnXCIgY2xhc3M9XCJ1aS1wYWdpbmF0b3ItbGFzdCB1aS1wYWdpbmF0b3ItZWxlbWVudCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGxcIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwiY2hhbmdlUGFnZVRvTGFzdCgkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2hhbmdlUGFnZVRvTGFzdCgkZXZlbnQpXCIgW25nQ2xhc3NdPVwieyd1aS1zdGF0ZS1kaXNhYmxlZCc6aXNMYXN0UGFnZSgpfVwiIFt0YWJpbmRleF09XCJpc0xhc3RQYWdlKCkgPyAtMSA6IG51bGxcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXBhZ2luYXRvci1pY29uIHBpIHBpLXN0ZXAtZm9yd2FyZFwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxwLWRyb3Bkb3duIFtvcHRpb25zXT1cInJvd3NQZXJQYWdlSXRlbXNcIiBbKG5nTW9kZWwpXT1cInJvd3NcIiAqbmdJZj1cInJvd3NQZXJQYWdlT3B0aW9uc1wiIFxuICAgICAgICAgICAgICAgIChvbkNoYW5nZSk9XCJvblJwcENoYW5nZSgkZXZlbnQpXCIgW2FwcGVuZFRvXT1cImRyb3Bkb3duQXBwZW5kVG9cIiBbc2Nyb2xsSGVpZ2h0XT1cImRyb3Bkb3duU2Nyb2xsSGVpZ2h0XCI+PC9wLWRyb3Bkb3duPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLXBhZ2luYXRvci1yaWdodC1jb250ZW50XCIgKm5nSWY9XCJ0ZW1wbGF0ZVJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlUmlnaHQ7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHBhZ2luYXRvclN0YXRlfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgUGFnaW5hdG9yIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuXG4gICAgQElucHV0KCkgcGFnZUxpbmtTaXplOiBudW1iZXIgPSA1O1xuXG4gICAgQE91dHB1dCgpIG9uUGFnZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYWx3YXlzU2hvdzogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQElucHV0KCkgdGVtcGxhdGVMZWZ0OiBUZW1wbGF0ZVJlZjxhbnk+O1xuICAgIFxuICAgIEBJbnB1dCgpIHRlbXBsYXRlUmlnaHQ6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBASW5wdXQoKSBkcm9wZG93bkFwcGVuZFRvOiBhbnk7XG5cbiAgICBASW5wdXQoKSBkcm9wZG93blNjcm9sbEhlaWdodDogc3RyaW5nID0gJzIwMHB4JztcblxuICAgIEBJbnB1dCgpIGN1cnJlbnRQYWdlUmVwb3J0VGVtcGxhdGU6IHN0cmluZyA9ICd7Y3VycmVudFBhZ2V9IG9mIHt0b3RhbFBhZ2VzfSc7XG5cbiAgICBASW5wdXQoKSBzaG93Q3VycmVudFBhZ2VSZXBvcnQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0b3RhbFJlY29yZHM6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSByb3dzOiBudW1iZXIgPSAwO1xuICAgIFxuICAgIEBJbnB1dCgpIHJvd3NQZXJQYWdlT3B0aW9uczogYW55W107XG5cbiAgICBwYWdlTGlua3M6IG51bWJlcltdO1xuXG4gICAgcm93c1BlclBhZ2VJdGVtczogU2VsZWN0SXRlbVtdO1xuICAgIFxuICAgIHBhZ2luYXRvclN0YXRlOiBhbnk7XG5cbiAgICBfZmlyc3Q6IG51bWJlciA9IDA7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cbiAgICBcbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnRvdGFsUmVjb3Jkcykge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlTGlua3MoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yU3RhdGUoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlyc3QoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUm93c1BlclBhZ2VPcHRpb25zKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmZpcnN0KSB7XG4gICAgICAgICAgICB0aGlzLl9maXJzdCA9IHNpbXBsZUNoYW5nZS5maXJzdC5jdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5yb3dzKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdpbmF0b3JTdGF0ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5yb3dzUGVyUGFnZU9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUm93c1BlclBhZ2VPcHRpb25zKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgZmlyc3QoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZpcnN0O1xuICAgIH1cbiAgICBzZXQgZmlyc3QodmFsOm51bWJlcikge1xuICAgICAgICB0aGlzLl9maXJzdCA9IHZhbDtcbiAgICB9XG5cbiAgICB1cGRhdGVSb3dzUGVyUGFnZU9wdGlvbnMoKSB7XG4gICAgICAgIGlmKHRoaXMucm93c1BlclBhZ2VPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLnJvd3NQZXJQYWdlSXRlbXMgPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IG9wdCBvZiB0aGlzLnJvd3NQZXJQYWdlT3B0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0ID09ICdvYmplY3QnICYmIG9wdFsnc2hvd0FsbCddKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucm93c1BlclBhZ2VJdGVtcy5wdXNoKHtsYWJlbDogb3B0WydzaG93QWxsJ10sIHZhbHVlOiB0aGlzLnRvdGFsUmVjb3Jkc30pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3dzUGVyUGFnZUl0ZW1zLnB1c2goe2xhYmVsOiBTdHJpbmcob3B0KSwgdmFsdWU6IG9wdH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzRmlyc3RQYWdlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRQYWdlKCkgPT09IDA7XG4gICAgfVxuXG4gICAgaXNMYXN0UGFnZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UGFnZSgpID09PSB0aGlzLmdldFBhZ2VDb3VudCgpIC0gMTtcbiAgICB9XG5cbiAgICBnZXRQYWdlQ291bnQoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmNlaWwodGhpcy50b3RhbFJlY29yZHMvdGhpcy5yb3dzKXx8MTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQYWdlTGlua0JvdW5kYXJpZXMoKSB7XG4gICAgICAgIGxldCBudW1iZXJPZlBhZ2VzID0gdGhpcy5nZXRQYWdlQ291bnQoKSxcbiAgICAgICAgdmlzaWJsZVBhZ2VzID0gTWF0aC5taW4odGhpcy5wYWdlTGlua1NpemUsIG51bWJlck9mUGFnZXMpO1xuXG4gICAgICAgIC8vY2FsY3VsYXRlIHJhbmdlLCBrZWVwIGN1cnJlbnQgaW4gbWlkZGxlIGlmIG5lY2Vzc2FyeVxuICAgICAgICBsZXQgc3RhcnQgPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwodGhpcy5nZXRQYWdlKCkgLSAoKHZpc2libGVQYWdlcykgLyAyKSkpLFxuICAgICAgICBlbmQgPSBNYXRoLm1pbihudW1iZXJPZlBhZ2VzIC0gMSwgc3RhcnQgKyB2aXNpYmxlUGFnZXMgLSAxKTtcblxuICAgICAgICAvL2NoZWNrIHdoZW4gYXBwcm9hY2hpbmcgdG8gbGFzdCBwYWdlXG4gICAgICAgIHZhciBkZWx0YSA9IHRoaXMucGFnZUxpbmtTaXplIC0gKGVuZCAtIHN0YXJ0ICsgMSk7XG4gICAgICAgIHN0YXJ0ID0gTWF0aC5tYXgoMCwgc3RhcnQgLSBkZWx0YSk7XG5cbiAgICAgICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgICB9XG5cbiAgICB1cGRhdGVQYWdlTGlua3MoKSB7XG4gICAgICAgIHRoaXMucGFnZUxpbmtzID0gW107XG4gICAgICAgIGxldCBib3VuZGFyaWVzID0gdGhpcy5jYWxjdWxhdGVQYWdlTGlua0JvdW5kYXJpZXMoKSxcbiAgICAgICAgc3RhcnQgPSBib3VuZGFyaWVzWzBdLFxuICAgICAgICBlbmQgPSBib3VuZGFyaWVzWzFdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnBhZ2VMaW5rcy5wdXNoKGkgKyAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZVBhZ2UocCA6bnVtYmVyKSB7XG4gICAgICAgIHZhciBwYyA9IHRoaXMuZ2V0UGFnZUNvdW50KCk7XG5cbiAgICAgICAgaWYocCA+PSAwICYmIHAgPCBwYykge1xuICAgICAgICAgICAgdGhpcy5fZmlyc3QgPSB0aGlzLnJvd3MgKiBwO1xuICAgICAgICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICAgICAgICAgIHBhZ2U6IHAsXG4gICAgICAgICAgICAgICAgZmlyc3Q6IHRoaXMuZmlyc3QsXG4gICAgICAgICAgICAgICAgcm93czogdGhpcy5yb3dzLFxuICAgICAgICAgICAgICAgIHBhZ2VDb3VudDogcGNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VMaW5rcygpO1xuXG4gICAgICAgICAgICB0aGlzLm9uUGFnZUNoYW5nZS5lbWl0KHN0YXRlKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnaW5hdG9yU3RhdGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUZpcnN0KCkge1xuICAgICAgICBjb25zdCBwYWdlID0gdGhpcy5nZXRQYWdlKCk7XG4gICAgICAgIGlmIChwYWdlID4gMCAmJiB0aGlzLnRvdGFsUmVjb3JkcyAmJiAodGhpcy5maXJzdCA+PSB0aGlzLnRvdGFsUmVjb3JkcykpIHtcbiAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZShudWxsKS50aGVuKCgpID0+IHRoaXMuY2hhbmdlUGFnZShwYWdlIC0gMSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0UGFnZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmZpcnN0IC8gdGhpcy5yb3dzKTtcbiAgICB9XG5cbiAgICBjaGFuZ2VQYWdlVG9GaXJzdChldmVudCkge1xuICAgICAgaWYoIXRoaXMuaXNGaXJzdFBhZ2UoKSl7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKDApO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIGNoYW5nZVBhZ2VUb1ByZXYoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHRoaXMuZ2V0UGFnZSgpIC0gMSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZVRvTmV4dChldmVudCkge1xuICAgICAgICB0aGlzLmNoYW5nZVBhZ2UodGhpcy5nZXRQYWdlKCkgICsgMSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgY2hhbmdlUGFnZVRvTGFzdChldmVudCkge1xuICAgICAgaWYoIXRoaXMuaXNMYXN0UGFnZSgpKXtcbiAgICAgICAgICB0aGlzLmNoYW5nZVBhZ2UodGhpcy5nZXRQYWdlQ291bnQoKSAtIDEpO1xuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uUGFnZUxpbmtDbGljayhldmVudCwgcGFnZSkge1xuICAgICAgICB0aGlzLmNoYW5nZVBhZ2UocGFnZSk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgb25ScHBDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VQYWdlKHRoaXMuZ2V0UGFnZSgpKTtcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlUGFnaW5hdG9yU3RhdGUoKSB7XG4gICAgICAgIHRoaXMucGFnaW5hdG9yU3RhdGUgPSB7XG4gICAgICAgICAgICBwYWdlOiB0aGlzLmdldFBhZ2UoKSxcbiAgICAgICAgICAgIHBhZ2VDb3VudDogdGhpcy5nZXRQYWdlQ291bnQoKSxcbiAgICAgICAgICAgIHJvd3M6IHRoaXMucm93cyxcbiAgICAgICAgICAgIGZpcnN0OiB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgdG90YWxSZWNvcmRzOiB0aGlzLnRvdGFsUmVjb3Jkc1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGN1cnJlbnRQYWdlUmVwb3J0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZVJlcG9ydFRlbXBsYXRlXG4gICAgICAgICAgICAucmVwbGFjZShcIntjdXJyZW50UGFnZX1cIiwgKHRoaXMuZ2V0UGFnZSgpICsgMSkudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIC5yZXBsYWNlKFwie3RvdGFsUGFnZXN9XCIsIHRoaXMuZ2V0UGFnZUNvdW50KCkudG9TdHJpbmcoKSk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsRHJvcGRvd25Nb2R1bGUsRm9ybXNNb2R1bGUsU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbUGFnaW5hdG9yLERyb3Bkb3duTW9kdWxlLEZvcm1zTW9kdWxlLFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbUGFnaW5hdG9yXVxufSlcbmV4cG9ydCBjbGFzcyBQYWdpbmF0b3JNb2R1bGUgeyB9XG4iXX0=