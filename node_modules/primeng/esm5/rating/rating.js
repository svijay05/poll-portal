var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, OnInit, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export var RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return Rating; }),
    multi: true
};
var Rating = /** @class */ (function () {
    function Rating(cd) {
        this.cd = cd;
        this.stars = 5;
        this.cancel = true;
        this.iconOnClass = 'pi pi-star';
        this.iconOffClass = 'pi pi-star-o';
        this.iconCancelClass = 'pi pi-ban';
        this.onRate = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.onModelChange = function () { };
        this.onModelTouched = function () { };
    }
    Rating.prototype.ngOnInit = function () {
        this.starsArray = [];
        for (var i = 0; i < this.stars; i++) {
            this.starsArray[i] = i;
        }
    };
    Rating.prototype.rate = function (event, i) {
        if (!this.readonly && !this.disabled) {
            this.value = (i + 1);
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onRate.emit({
                originalEvent: event,
                value: (i + 1)
            });
        }
        event.preventDefault();
    };
    Rating.prototype.clear = function (event) {
        if (!this.readonly && !this.disabled) {
            this.value = null;
            this.onModelChange(this.value);
            this.onModelTouched();
            this.onCancel.emit(event);
        }
        event.preventDefault();
    };
    Rating.prototype.writeValue = function (value) {
        this.value = value;
        this.cd.detectChanges();
    };
    Rating.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    Rating.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    Rating.prototype.setDisabledState = function (val) {
        this.disabled = val;
    };
    Rating.ctorParameters = function () { return [
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], Rating.prototype, "disabled", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "readonly", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "stars", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "cancel", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconOnClass", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconOnStyle", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconOffClass", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconOffStyle", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconCancelClass", void 0);
    __decorate([
        Input()
    ], Rating.prototype, "iconCancelStyle", void 0);
    __decorate([
        Output()
    ], Rating.prototype, "onRate", void 0);
    __decorate([
        Output()
    ], Rating.prototype, "onCancel", void 0);
    Rating = __decorate([
        Component({
            selector: 'p-rating',
            template: "\n        <div class=\"ui-rating\" [ngClass]=\"{'ui-state-disabled': disabled}\">\n            <a [attr.tabindex]=\"disabled ? null : '0'\" *ngIf=\"cancel\" (click)=\"clear($event)\" (keydown.enter)=\"clear($event)\"  class=\"ui-rating-cancel\">\n                <span class=\"ui-rating-icon\" [ngClass]=\"iconCancelClass\" [ngStyle]=\"iconCancelStyle\"></span>\n            </a>\n            <a [attr.tabindex]=\"disabled ? null : '0'\" *ngFor=\"let star of starsArray;let i=index\" (click)=\"rate($event,i)\" (keydown.enter)=\"rate($event,i)\">\n                <span class=\"ui-rating-icon\" \n                    [ngClass]=\"(!value || i >= value) ? iconOffClass : iconOnClass\"\n                    [ngStyle]=\"(!value || i >= value) ? iconOffStyle : iconOnStyle\"\n                ></span>\n            </a>\n        </div>\n    ",
            providers: [RATING_VALUE_ACCESSOR]
        })
    ], Rating);
    return Rating;
}());
export { Rating };
var RatingModule = /** @class */ (function () {
    function RatingModule() {
    }
    RatingModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [Rating],
            declarations: [Rating]
        })
    ], RatingModule);
    return RatingModule;
}());
export { RatingModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF0aW5nLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9yYXRpbmcvIiwic291cmNlcyI6WyJyYXRpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsTUFBTSxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFVBQVUsRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMvRyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxJQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxjQUFNLE9BQUEsTUFBTSxFQUFOLENBQU0sQ0FBQztJQUNyQyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFtQkY7SUEwQkksZ0JBQW9CLEVBQXFCO1FBQXJCLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBcEJoQyxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBRWxCLFdBQU0sR0FBWSxJQUFJLENBQUM7UUFFdkIsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFJbkMsaUJBQVksR0FBVyxjQUFjLENBQUM7UUFJdEMsb0JBQWUsR0FBVyxXQUFXLENBQUM7UUFJckMsV0FBTSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRS9DLGFBQVEsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQU0zRCxrQkFBYSxHQUFhLGNBQU8sQ0FBQyxDQUFDO1FBRW5DLG1CQUFjLEdBQWEsY0FBTyxDQUFDLENBQUM7SUFOUSxDQUFDO0lBVTdDLHlCQUFRLEdBQVI7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUNyQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFB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QUFDO1NBQ3pCLENBQUM7T0FDVyxZQUFZLENBQUk7SUFBRCxtQkFBQztDQUFBLEFBQTdCLElBQTZCO1NBQWhCLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxPbkluaXQsSW5wdXQsT3V0cHV0LEV2ZW50RW1pdHRlcixmb3J3YXJkUmVmLENoYW5nZURldGVjdG9yUmVmfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOR19WQUxVRV9BQ0NFU1NPUiwgQ29udHJvbFZhbHVlQWNjZXNzb3J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuZXhwb3J0IGNvbnN0IFJBVElOR19WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gUmF0aW5nKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1yYXRpbmcnLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1yYXRpbmdcIiBbbmdDbGFzc109XCJ7J3VpLXN0YXRlLWRpc2FibGVkJzogZGlzYWJsZWR9XCI+XG4gICAgICAgICAgICA8YSBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IG51bGwgOiAnMCdcIiAqbmdJZj1cImNhbmNlbFwiIChjbGljayk9XCJjbGVhcigkZXZlbnQpXCIgKGtleWRvd24uZW50ZXIpPVwiY2xlYXIoJGV2ZW50KVwiICBjbGFzcz1cInVpLXJhdGluZy1jYW5jZWxcIj5cbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXJhdGluZy1pY29uXCIgW25nQ2xhc3NdPVwiaWNvbkNhbmNlbENsYXNzXCIgW25nU3R5bGVdPVwiaWNvbkNhbmNlbFN0eWxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPGEgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogJzAnXCIgKm5nRm9yPVwibGV0IHN0YXIgb2Ygc3RhcnNBcnJheTtsZXQgaT1pbmRleFwiIChjbGljayk9XCJyYXRlKCRldmVudCxpKVwiIChrZXlkb3duLmVudGVyKT1cInJhdGUoJGV2ZW50LGkpXCI+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1yYXRpbmctaWNvblwiIFxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIoIXZhbHVlIHx8IGkgPj0gdmFsdWUpID8gaWNvbk9mZkNsYXNzIDogaWNvbk9uQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCIoIXZhbHVlIHx8IGkgPj0gdmFsdWUpID8gaWNvbk9mZlN0eWxlIDogaWNvbk9uU3R5bGVcIlxuICAgICAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICA8L2E+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbUkFUSU5HX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBSYXRpbmcgaW1wbGVtZW50cyBPbkluaXQsQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSByZWFkb25seTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHN0YXJzOiBudW1iZXIgPSA1O1xuXG4gICAgQElucHV0KCkgY2FuY2VsOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGljb25PbkNsYXNzOiBzdHJpbmcgPSAncGkgcGktc3Rhcic7XG5cbiAgICBASW5wdXQoKSBpY29uT25TdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgaWNvbk9mZkNsYXNzOiBzdHJpbmcgPSAncGkgcGktc3Rhci1vJztcblxuICAgIEBJbnB1dCgpIGljb25PZmZTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgaWNvbkNhbmNlbENsYXNzOiBzdHJpbmcgPSAncGkgcGktYmFuJztcblxuICAgIEBJbnB1dCgpIGljb25DYW5jZWxTdHlsZTogYW55O1xuXG4gICAgQE91dHB1dCgpIG9uUmF0ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25DYW5jZWw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9IFxuICAgIFxuICAgIHZhbHVlOiBudW1iZXI7XG4gICAgXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBwdWJsaWMgc3RhcnNBcnJheTogbnVtYmVyW107XG4gICAgXG4gICAgbmdPbkluaXQoKSB7XG4gICAgICAgIHRoaXMuc3RhcnNBcnJheSA9IFtdO1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zdGFyczsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJzQXJyYXlbaV0gPSBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJhdGUoZXZlbnQsIGk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZighdGhpcy5yZWFkb25seSYmIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSAoaSArIDEpO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgICAgICAgICAgdGhpcy5vblJhdGUuZW1pdCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgdmFsdWU6IChpKzEpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpOyAgICAgICAgXG4gICAgfVxuICAgIFxuICAgIGNsZWFyKGV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmKCF0aGlzLnJlYWRvbmx5JiYhdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgICAgICB0aGlzLm9uQ2FuY2VsLmVtaXQoZXZlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkgOiB2b2lkIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICB9XG4gICAgXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG4gICAgXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW1JhdGluZ10sXG4gICAgZGVjbGFyYXRpb25zOiBbUmF0aW5nXVxufSlcbmV4cG9ydCBjbGFzcyBSYXRpbmdNb2R1bGUgeyB9Il19