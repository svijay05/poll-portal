var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
let InplaceDisplay = class InplaceDisplay {
};
InplaceDisplay = __decorate([
    Component({
        selector: 'p-inplaceDisplay',
        template: '<ng-content></ng-content>'
    })
], InplaceDisplay);
export { InplaceDisplay };
let InplaceContent = class InplaceContent {
};
InplaceContent = __decorate([
    Component({
        selector: 'p-inplaceContent',
        template: '<ng-content></ng-content>'
    })
], InplaceContent);
export { InplaceContent };
let Inplace = class Inplace {
    constructor() {
        this.onActivate = new EventEmitter();
        this.onDeactivate = new EventEmitter();
    }
    activate(event) {
        if (!this.disabled) {
            this.active = true;
            this.onActivate.emit(event);
        }
    }
    deactivate(event) {
        if (!this.disabled) {
            this.active = false;
            this.hover = false;
            this.onDeactivate.emit(event);
        }
    }
    onKeydown(event) {
        if (event.which === 13) {
            this.activate(event);
            event.preventDefault();
        }
    }
};
__decorate([
    Input()
], Inplace.prototype, "active", void 0);
__decorate([
    Input()
], Inplace.prototype, "closable", void 0);
__decorate([
    Input()
], Inplace.prototype, "disabled", void 0);
__decorate([
    Input()
], Inplace.prototype, "style", void 0);
__decorate([
    Input()
], Inplace.prototype, "styleClass", void 0);
__decorate([
    Output()
], Inplace.prototype, "onActivate", void 0);
__decorate([
    Output()
], Inplace.prototype, "onDeactivate", void 0);
Inplace = __decorate([
    Component({
        selector: 'p-inplace',
        template: `
        <div [ngClass]="{'ui-inplace ui-widget': true, 'ui-inplace-closable': closable}" [ngStyle]="style" [class]="styleClass">
            <div class="ui-inplace-display" (click)="activate($event)" tabindex="0" (keydown)="onKeydown($event)"   
                [ngClass]="{'ui-state-disabled':disabled}" *ngIf="!active">
                <ng-content select="[pInplaceDisplay]"></ng-content>
            </div>
            <div class="ui-inplace-content" *ngIf="active">
                <ng-content select="[pInplaceContent]"></ng-content>
                <button type="button" icon="pi pi-times" pButton (click)="deactivate($event)" *ngIf="closable"></button>
            </div>
        </div>
    `
    })
], Inplace);
export { Inplace };
let InplaceModule = class InplaceModule {
};
InplaceModule = __decorate([
    NgModule({
        imports: [CommonModule, ButtonModule],
        exports: [Inplace, InplaceDisplay, InplaceContent, ButtonModule],
        declarations: [Inplace, InplaceDisplay, InplaceContent]
    })
], InplaceModule);
export { InplaceModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wbGFjZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvaW5wbGFjZS8iLCJzb3VyY2VzIjpbImlucGxhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDM0UsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQU01QyxJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0NBQUcsQ0FBQTtBQUFqQixjQUFjO0lBSjFCLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxrQkFBa0I7UUFDNUIsUUFBUSxFQUFFLDJCQUEyQjtLQUN4QyxDQUFDO0dBQ1csY0FBYyxDQUFHO1NBQWpCLGNBQWM7QUFNM0IsSUFBYSxjQUFjLEdBQTNCLE1BQWEsY0FBYztDQUFHLENBQUE7QUFBakIsY0FBYztJQUoxQixTQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLFFBQVEsRUFBRSwyQkFBMkI7S0FDeEMsQ0FBQztHQUNXLGNBQWMsQ0FBRztTQUFqQixjQUFjO0FBaUIzQixJQUFhLE9BQU8sR0FBcEIsTUFBYSxPQUFPO0lBQXBCO1FBWWMsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRW5ELGlCQUFZLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7SUF5Qm5FLENBQUM7SUFyQkcsUUFBUSxDQUFDLEtBQWE7UUFDbEIsSUFBRyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjtJQUNMLENBQUM7SUFFRCxVQUFVLENBQUMsS0FBYTtRQUNwQixJQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2pDO0lBQ0wsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFvQjtRQUMxQixJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO0lBQ0wsQ0FBQztDQUNKLENBQUE7QUFyQ1k7SUFBUixLQUFLLEVBQUU7dUNBQWlCO0FBRWhCO0lBQVIsS0FBSyxFQUFFO3lDQUFtQjtBQUVsQjtJQUFSLEtBQUssRUFBRTt5Q0FBbUI7QUFFbEI7SUFBUixLQUFLLEVBQUU7c0NBQVk7QUFFWDtJQUFSLEtBQUssRUFBRTsyQ0FBb0I7QUFFbEI7SUFBVCxNQUFNLEVBQUU7MkNBQW9EO0FBRW5EO0lBQVQsTUFBTSxFQUFFOzZDQUFzRDtBQWR0RCxPQUFPO0lBZm5CLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxXQUFXO1FBQ3JCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7S0FXVDtLQUNKLENBQUM7R0FDVyxPQUFPLENBdUNuQjtTQXZDWSxPQUFPO0FBOENwQixJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFhO0NBQUksQ0FBQTtBQUFqQixhQUFhO0lBTHpCLFFBQVEsQ0FBQztRQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxZQUFZLENBQUM7UUFDcEMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxjQUFjLEVBQUMsWUFBWSxDQUFDO1FBQzdELFlBQVksRUFBRSxDQUFDLE9BQU8sRUFBQyxjQUFjLEVBQUMsY0FBYyxDQUFDO0tBQ3hELENBQUM7R0FDVyxhQUFhLENBQUk7U0FBakIsYUFBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0J1dHRvbk1vZHVsZX0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtaW5wbGFjZURpc3BsYXknLFxuICAgIHRlbXBsYXRlOiAnPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50Pidcbn0pXG5leHBvcnQgY2xhc3MgSW5wbGFjZURpc3BsYXkge31cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWlucGxhY2VDb250ZW50JyxcbiAgICB0ZW1wbGF0ZTogJzxuZy1jb250ZW50PjwvbmctY29udGVudD4nXG59KVxuZXhwb3J0IGNsYXNzIElucGxhY2VDb250ZW50IHt9XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1pbnBsYWNlJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsndWktaW5wbGFjZSB1aS13aWRnZXQnOiB0cnVlLCAndWktaW5wbGFjZS1jbG9zYWJsZSc6IGNsb3NhYmxlfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1pbnBsYWNlLWRpc3BsYXlcIiAoY2xpY2spPVwiYWN0aXZhdGUoJGV2ZW50KVwiIHRhYmluZGV4PVwiMFwiIChrZXlkb3duKT1cIm9uS2V5ZG93bigkZXZlbnQpXCIgICBcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLXN0YXRlLWRpc2FibGVkJzpkaXNhYmxlZH1cIiAqbmdJZj1cIiFhY3RpdmVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJbcElucGxhY2VEaXNwbGF5XVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWlucGxhY2UtY29udGVudFwiICpuZ0lmPVwiYWN0aXZlXCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQgc2VsZWN0PVwiW3BJbnBsYWNlQ29udGVudF1cIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWNvbj1cInBpIHBpLXRpbWVzXCIgcEJ1dHRvbiAoY2xpY2spPVwiZGVhY3RpdmF0ZSgkZXZlbnQpXCIgKm5nSWY9XCJjbG9zYWJsZVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgSW5wbGFjZSB7XG5cbiAgICBASW5wdXQoKSBhY3RpdmU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBjbG9zYWJsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBPdXRwdXQoKSBvbkFjdGl2YXRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkRlYWN0aXZhdGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgaG92ZXI6IGJvb2xlYW47XG5cbiAgICBhY3RpdmF0ZShldmVudD86IEV2ZW50KSB7XG4gICAgICAgIGlmKCF0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm9uQWN0aXZhdGUuZW1pdChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlKGV2ZW50PzogRXZlbnQpIHtcbiAgICAgICAgaWYoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmhvdmVyID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLm9uRGVhY3RpdmF0ZS5lbWl0KGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlKGV2ZW50KTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxCdXR0b25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtJbnBsYWNlLElucGxhY2VEaXNwbGF5LElucGxhY2VDb250ZW50LEJ1dHRvbk1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbSW5wbGFjZSxJbnBsYWNlRGlzcGxheSxJbnBsYWNlQ29udGVudF1cbn0pXG5leHBvcnQgY2xhc3MgSW5wbGFjZU1vZHVsZSB7IH1cbiJdfQ==