var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, AfterViewChecked, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
let Galleria = class Galleria {
    constructor(el) {
        this.el = el;
        this.panelWidth = 600;
        this.panelHeight = 400;
        this.frameWidth = 60;
        this.frameHeight = 40;
        this.activeIndex = 0;
        this.showFilmstrip = true;
        this.autoPlay = true;
        this.transitionInterval = 4000;
        this.showCaption = true;
        this.effectDuration = 500;
        this.onImageClicked = new EventEmitter();
        this.onImageChange = new EventEmitter();
        this.stripLeft = 0;
    }
    ngAfterViewChecked() {
        if (this.imagesChanged) {
            this.stopSlideshow();
            this.render();
            this.imagesChanged = false;
        }
    }
    get images() {
        return this._images;
    }
    set images(value) {
        this._images = value;
        this.imagesChanged = true;
        if (this.initialized) {
            this.activeIndex = 0;
        }
    }
    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];
        this.panelWrapper = DomHandler.findSingle(this.el.nativeElement, 'ul.ui-galleria-panel-wrapper');
        this.initialized = true;
        if (this.showFilmstrip) {
            this.stripWrapper = DomHandler.findSingle(this.container, 'div.ui-galleria-filmstrip-wrapper');
            this.strip = DomHandler.findSingle(this.stripWrapper, 'ul.ui-galleria-filmstrip');
        }
        if (this.images && this.images.length) {
            this.render();
        }
    }
    render() {
        this.panels = DomHandler.find(this.panelWrapper, 'li.ui-galleria-panel');
        if (this.showFilmstrip) {
            this.frames = DomHandler.find(this.strip, 'li.ui-galleria-frame');
            this.stripWrapper.style.width = DomHandler.width(this.panelWrapper) - 50 + 'px';
            this.stripWrapper.style.height = this.frameHeight + 'px';
        }
        if (this.showCaption) {
            this.caption = DomHandler.findSingle(this.container, 'div.ui-galleria-caption');
            this.caption.style.bottom = this.showFilmstrip ? DomHandler.getOuterHeight(this.stripWrapper, true) + 'px' : 0 + 'px';
            this.caption.style.width = DomHandler.width(this.panelWrapper) + 'px';
        }
        if (this.autoPlay) {
            this.startSlideshow();
        }
        this.container.style.visibility = 'visible';
    }
    startSlideshow() {
        this.interval = setInterval(() => {
            this.next();
        }, this.transitionInterval);
        this.slideshowActive = true;
    }
    stopSlideshow() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.slideshowActive = false;
    }
    clickNavRight() {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.next();
    }
    clickNavLeft() {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.prev();
    }
    frameClick(frame) {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.select(DomHandler.index(frame), false);
    }
    prev() {
        if (this.activeIndex !== 0) {
            this.select(this.activeIndex - 1, true);
        }
    }
    next() {
        if (this.activeIndex !== (this.panels.length - 1)) {
            this.select(this.activeIndex + 1, true);
        }
        else {
            this.select(0, false);
            this.stripLeft = 0;
        }
    }
    select(index, reposition) {
        if (index !== this.activeIndex) {
            let oldPanel = this.panels[this.activeIndex], newPanel = this.panels[index];
            DomHandler.fadeIn(newPanel, this.effectDuration);
            if (this.showFilmstrip) {
                let oldFrame = this.frames[this.activeIndex], newFrame = this.frames[index];
                if (reposition === undefined || reposition === true) {
                    let frameLeft = newFrame.offsetLeft, stepFactor = this.frameWidth + parseInt(getComputedStyle(newFrame)['margin-right'], 10), stripLeft = this.strip.offsetLeft, frameViewportLeft = frameLeft + stripLeft, frameViewportRight = frameViewportLeft + this.frameWidth;
                    if (frameViewportRight > DomHandler.width(this.stripWrapper))
                        this.stripLeft -= stepFactor;
                    else if (frameViewportLeft < 0)
                        this.stripLeft += stepFactor;
                }
            }
            this.activeIndex = index;
            this.onImageChange.emit({ index: index });
        }
    }
    clickImage(event, image, i) {
        this.onImageClicked.emit({ originalEvent: event, image: image, index: i });
    }
    ngOnDestroy() {
        this.stopSlideshow();
    }
};
Galleria.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], Galleria.prototype, "style", void 0);
__decorate([
    Input()
], Galleria.prototype, "styleClass", void 0);
__decorate([
    Input()
], Galleria.prototype, "panelWidth", void 0);
__decorate([
    Input()
], Galleria.prototype, "panelHeight", void 0);
__decorate([
    Input()
], Galleria.prototype, "frameWidth", void 0);
__decorate([
    Input()
], Galleria.prototype, "frameHeight", void 0);
__decorate([
    Input()
], Galleria.prototype, "activeIndex", void 0);
__decorate([
    Input()
], Galleria.prototype, "showFilmstrip", void 0);
__decorate([
    Input()
], Galleria.prototype, "autoPlay", void 0);
__decorate([
    Input()
], Galleria.prototype, "transitionInterval", void 0);
__decorate([
    Input()
], Galleria.prototype, "showCaption", void 0);
__decorate([
    Input()
], Galleria.prototype, "effectDuration", void 0);
__decorate([
    Output()
], Galleria.prototype, "onImageClicked", void 0);
__decorate([
    Output()
], Galleria.prototype, "onImageChange", void 0);
__decorate([
    Input()
], Galleria.prototype, "images", null);
Galleria = __decorate([
    Component({
        selector: 'p-galleria',
        template: `
        <div [ngClass]="{'ui-galleria ui-widget ui-widget-content ui-corner-all':true}" [ngStyle]="style" [class]="styleClass" [style.width.px]="panelWidth">
            <ul class="ui-galleria-panel-wrapper" [style.width.px]="panelWidth" [style.height.px]="panelHeight">
                <li *ngFor="let image of images;let i=index" class="ui-galleria-panel" [ngClass]="{'ui-helper-hidden':i!=activeIndex}"
                    [style.width.px]="panelWidth" [style.height.px]="panelHeight" (click)="clickImage($event,image,i)">
                    <img class="ui-panel-images" [src]="image.source" [alt]="image.alt" [title]="image.title"/>
                </li>
            </ul>
            <div [ngClass]="{'ui-galleria-filmstrip-wrapper':true}" *ngIf="showFilmstrip">
                <ul class="ui-galleria-filmstrip" style="transition:left 1s" [style.left.px]="stripLeft">
                    <li #frame *ngFor="let image of images;let i=index" [ngClass]="{'ui-galleria-frame-active':i==activeIndex}" class="ui-galleria-frame" (click)="frameClick(frame)"
                        [style.width.px]="frameWidth" [style.height.px]="frameHeight" [style.transition]="'opacity 0.75s ease'">
                        <div class="ui-galleria-frame-content">
                            <img [src]="image.source" [alt]="image.alt" [title]="image.title" class="ui-galleria-frame-image"
                                [style.width.px]="frameWidth" [style.height.px]="frameHeight">
                        </div>
                    </li>
                </ul>
            </div>
            <div class="ui-galleria-nav-prev pi pi-fw pi-chevron-left" (click)="clickNavLeft()" [style.bottom.px]="frameHeight/2" *ngIf="activeIndex !== 0"></div>
            <div class="ui-galleria-nav-next pi pi-fw pi-chevron-right" (click)="clickNavRight()" [style.bottom.px]="frameHeight/2"></div>
            <div class="ui-galleria-caption" *ngIf="showCaption&&images" style="display:block">
                <h4>{{images[activeIndex]?.title}}</h4><p>{{images[activeIndex]?.alt}}</p>
            </div>
        </div>
    `
    })
], Galleria);
export { Galleria };
let GalleriaModule = class GalleriaModule {
};
GalleriaModule = __decorate([
    NgModule({
        imports: [CommonModule],
        exports: [Galleria],
        declarations: [Galleria]
    })
], GalleriaModule);
export { GalleriaModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyaWEuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2dhbGxlcmlhLyIsInNvdXJjZXMiOlsiZ2FsbGVyaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGdCQUFnQixFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUErQnZDLElBQWEsUUFBUSxHQUFyQixNQUFhLFFBQVE7SUF3RGpCLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBbER4QixlQUFVLEdBQVcsR0FBRyxDQUFDO1FBRXpCLGdCQUFXLEdBQVcsR0FBRyxDQUFDO1FBRTFCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFFeEIsZ0JBQVcsR0FBVyxFQUFFLENBQUM7UUFFekIsZ0JBQVcsR0FBVyxDQUFDLENBQUM7UUFFeEIsa0JBQWEsR0FBWSxJQUFJLENBQUM7UUFFOUIsYUFBUSxHQUFZLElBQUksQ0FBQztRQUV6Qix1QkFBa0IsR0FBVyxJQUFJLENBQUM7UUFFbEMsZ0JBQVcsR0FBWSxJQUFJLENBQUM7UUFFNUIsbUJBQWMsR0FBVyxHQUFHLENBQUM7UUFFNUIsbUJBQWMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXBDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQXNCdEMsY0FBUyxHQUFXLENBQUMsQ0FBQztJQU1PLENBQUM7SUFFckMsa0JBQWtCO1FBQ2QsSUFBRyxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ25CLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDZCxJ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S0FBSyxFQUFFO3NDQUVQO0FBcEVRLFFBQVE7SUE3QnBCLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxZQUFZO1FBQ3RCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQXlCVDtLQUNKLENBQUM7R0FDVyxRQUFRLENBZ05wQjtTQWhOWSxRQUFRO0FBdU5yQixJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0NBQUksQ0FBQTtBQUFsQixjQUFjO0lBTDFCLFFBQVEsQ0FBQztRQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztRQUN2QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFDbkIsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO0tBQzNCLENBQUM7R0FDVyxjQUFjLENBQUk7U0FBbEIsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsQ29tcG9uZW50LEVsZW1lbnRSZWYsQWZ0ZXJWaWV3Q2hlY2tlZCxBZnRlclZpZXdJbml0LE9uRGVzdHJveSxJbnB1dCxPdXRwdXQsRXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1nYWxsZXJpYScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3VpLWdhbGxlcmlhIHVpLXdpZGdldCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsJzp0cnVlfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbc3R5bGUud2lkdGgucHhdPVwicGFuZWxXaWR0aFwiPlxuICAgICAgICAgICAgPHVsIGNsYXNzPVwidWktZ2FsbGVyaWEtcGFuZWwtd3JhcHBlclwiIFtzdHlsZS53aWR0aC5weF09XCJwYW5lbFdpZHRoXCIgW3N0eWxlLmhlaWdodC5weF09XCJwYW5lbEhlaWdodFwiPlxuICAgICAgICAgICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaW1hZ2Ugb2YgaW1hZ2VzO2xldCBpPWluZGV4XCIgY2xhc3M9XCJ1aS1nYWxsZXJpYS1wYW5lbFwiIFtuZ0NsYXNzXT1cInsndWktaGVscGVyLWhpZGRlbic6aSE9YWN0aXZlSW5kZXh9XCJcbiAgICAgICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cInBhbmVsV2lkdGhcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cInBhbmVsSGVpZ2h0XCIgKGNsaWNrKT1cImNsaWNrSW1hZ2UoJGV2ZW50LGltYWdlLGkpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJ1aS1wYW5lbC1pbWFnZXNcIiBbc3JjXT1cImltYWdlLnNvdXJjZVwiIFthbHRdPVwiaW1hZ2UuYWx0XCIgW3RpdGxlXT1cImltYWdlLnRpdGxlXCIvPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGRpdiBbbmdDbGFzc109XCJ7J3VpLWdhbGxlcmlhLWZpbG1zdHJpcC13cmFwcGVyJzp0cnVlfVwiICpuZ0lmPVwic2hvd0ZpbG1zdHJpcFwiPlxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInVpLWdhbGxlcmlhLWZpbG1zdHJpcFwiIHN0eWxlPVwidHJhbnNpdGlvbjpsZWZ0IDFzXCIgW3N0eWxlLmxlZnQucHhdPVwic3RyaXBMZWZ0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAjZnJhbWUgKm5nRm9yPVwibGV0IGltYWdlIG9mIGltYWdlcztsZXQgaT1pbmRleFwiIFtuZ0NsYXNzXT1cInsndWktZ2FsbGVyaWEtZnJhbWUtYWN0aXZlJzppPT1hY3RpdmVJbmRleH1cIiBjbGFzcz1cInVpLWdhbGxlcmlhLWZyYW1lXCIgKGNsaWNrKT1cImZyYW1lQ2xpY2soZnJhbWUpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZS53aWR0aC5weF09XCJmcmFtZVdpZHRoXCIgW3N0eWxlLmhlaWdodC5weF09XCJmcmFtZUhlaWdodFwiIFtzdHlsZS50cmFuc2l0aW9uXT1cIidvcGFjaXR5IDAuNzVzIGVhc2UnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktZ2FsbGVyaWEtZnJhbWUtY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgW3NyY109XCJpbWFnZS5zb3VyY2VcIiBbYWx0XT1cImltYWdlLmFsdFwiIFt0aXRsZV09XCJpbWFnZS50aXRsZVwiIGNsYXNzPVwidWktZ2FsbGVyaWEtZnJhbWUtaW1hZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwiZnJhbWVXaWR0aFwiIFtzdHlsZS5oZWlnaHQucHhdPVwiZnJhbWVIZWlnaHRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1nYWxsZXJpYS1uYXYtcHJldiBwaSBwaS1mdyBwaS1jaGV2cm9uLWxlZnRcIiAoY2xpY2spPVwiY2xpY2tOYXZMZWZ0KClcIiBbc3R5bGUuYm90dG9tLnB4XT1cImZyYW1lSGVpZ2h0LzJcIiAqbmdJZj1cImFjdGl2ZUluZGV4ICE9PSAwXCI+PC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktZ2FsbGVyaWEtbmF2LW5leHQgcGkgcGktZncgcGktY2hldnJvbi1yaWdodFwiIChjbGljayk9XCJjbGlja05hdlJpZ2h0KClcIiBbc3R5bGUuYm90dG9tLnB4XT1cImZyYW1lSGVpZ2h0LzJcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1nYWxsZXJpYS1jYXB0aW9uXCIgKm5nSWY9XCJzaG93Q2FwdGlvbiYmaW1hZ2VzXCIgc3R5bGU9XCJkaXNwbGF5OmJsb2NrXCI+XG4gICAgICAgICAgICAgICAgPGg0Pnt7aW1hZ2VzW2FjdGl2ZUluZGV4XT8udGl0bGV9fTwvaDQ+PHA+e3tpbWFnZXNbYWN0aXZlSW5kZXhdPy5hbHR9fTwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIEdhbGxlcmlhIGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCxBZnRlclZpZXdJbml0LE9uRGVzdHJveSB7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBwYW5lbFdpZHRoOiBudW1iZXIgPSA2MDA7XG5cbiAgICBASW5wdXQoKSBwYW5lbEhlaWdodDogbnVtYmVyID0gNDAwO1xuXG4gICAgQElucHV0KCkgZnJhbWVXaWR0aDogbnVtYmVyID0gNjA7XG4gICAgXG4gICAgQElucHV0KCkgZnJhbWVIZWlnaHQ6IG51bWJlciA9IDQwO1xuXG4gICAgQElucHV0KCkgYWN0aXZlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBzaG93RmlsbXN0cmlwOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGF1dG9QbGF5OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25JbnRlcnZhbDogbnVtYmVyID0gNDAwMDtcblxuICAgIEBJbnB1dCgpIHNob3dDYXB0aW9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGVmZmVjdER1cmF0aW9uOiBudW1iZXIgPSA1MDA7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uSW1hZ2VDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uSW1hZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgXG4gICAgX2ltYWdlczogYW55W107XG4gICAgXG4gICAgc2xpZGVzaG93QWN0aXZlOiBib29sZWFuO1xuICAgIFxuICAgIHB1YmxpYyBjb250YWluZXI6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgcGFuZWxXcmFwcGVyOiBhbnk7XG4gICAgXG4gICAgcHVibGljIHBhbmVsczogYW55O1xuICAgIFxuICAgIHB1YmxpYyBjYXB0aW9uOiBhbnk7XG4gICAgXG4gICAgcHVibGljIHN0cmlwV3JhcHBlcjogYW55O1xuICAgIFxuICAgIHB1YmxpYyBzdHJpcDogYW55O1xuICAgIFxuICAgIHB1YmxpYyBmcmFtZXM6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgaW50ZXJ2YWw6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgc3RyaXBMZWZ0OiBudW1iZXIgPSAwO1xuICAgIFxuICAgIHB1YmxpYyBpbWFnZXNDaGFuZ2VkOiBib29sZWFuO1xuICAgIFxuICAgIHB1YmxpYyBpbml0aWFsaXplZDogYm9vbGVhbjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZikge31cbiAgICBcbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIGlmKHRoaXMuaW1hZ2VzQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5zdG9wU2xpZGVzaG93KCk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICAgICAgdGhpcy5pbWFnZXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaW1hZ2VzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltYWdlcztcbiAgICB9XG4gICAgc2V0IGltYWdlcyh2YWx1ZTphbnlbXSkge1xuICAgICAgICB0aGlzLl9pbWFnZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5pbWFnZXNDaGFuZ2VkID0gdHJ1ZTtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF07XG4gICAgICAgIHRoaXMucGFuZWxXcmFwcGVyID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3VsLnVpLWdhbGxlcmlhLXBhbmVsLXdyYXBwZXInKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLnNob3dGaWxtc3RyaXApIHtcbiAgICAgICAgICAgIHRoaXMuc3RyaXBXcmFwcGVyID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCdkaXYudWktZ2FsbGVyaWEtZmlsbXN0cmlwLXdyYXBwZXInKTtcbiAgICAgICAgICAgIHRoaXMuc3RyaXAgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5zdHJpcFdyYXBwZXIsJ3VsLnVpLWdhbGxlcmlhLWZpbG1zdHJpcCcpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLmltYWdlcyAmJiB0aGlzLmltYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH0gXG4gICAgfVxuICAgIFxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgdGhpcy5wYW5lbHMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5wYW5lbFdyYXBwZXIsICdsaS51aS1nYWxsZXJpYS1wYW5lbCcpOyBcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuc2hvd0ZpbG1zdHJpcCkge1xuICAgICAgICAgICAgdGhpcy5mcmFtZXMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5zdHJpcCwnbGkudWktZ2FsbGVyaWEtZnJhbWUnKTtcbiAgICAgICAgICAgIHRoaXMuc3RyaXBXcmFwcGVyLnN0eWxlLndpZHRoID0gRG9tSGFuZGxlci53aWR0aCh0aGlzLnBhbmVsV3JhcHBlcikgLSA1MCArICdweCc7XG4gICAgICAgICAgICB0aGlzLnN0cmlwV3JhcHBlci5zdHlsZS5oZWlnaHQgPSB0aGlzLmZyYW1lSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5zaG93Q2FwdGlvbikge1xuICAgICAgICAgICAgdGhpcy5jYXB0aW9uID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuY29udGFpbmVyLCdkaXYudWktZ2FsbGVyaWEtY2FwdGlvbicpO1xuICAgICAgICAgICAgdGhpcy5jYXB0aW9uLnN0eWxlLmJvdHRvbSA9IHRoaXMuc2hvd0ZpbG1zdHJpcCA/IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5zdHJpcFdyYXBwZXIsdHJ1ZSkgKyAncHgnIDogMCArICdweCc7XG4gICAgICAgICAgICB0aGlzLmNhcHRpb24uc3R5bGUud2lkdGggPSBEb21IYW5kbGVyLndpZHRoKHRoaXMucGFuZWxXcmFwcGVyKSArICdweCc7XG4gICAgICAgIH1cbiAgIFxuICAgICAgICBpZih0aGlzLmF1dG9QbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0U2xpZGVzaG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgfVxuICAgIFxuICAgIHN0YXJ0U2xpZGVzaG93KCkge1xuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgIH0sIHRoaXMudHJhbnNpdGlvbkludGVydmFsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2xpZGVzaG93QWN0aXZlID0gdHJ1ZTtcbiAgICB9XG4gICAgICAgIFxuICAgIHN0b3BTbGlkZXNob3coKSB7XG4gICAgICAgIGlmKHRoaXMuaW50ZXJ2YWwpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2xpZGVzaG93QWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGNsaWNrTmF2UmlnaHQoKSB7XG4gICAgICAgIGlmKHRoaXMuc2xpZGVzaG93QWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BTbGlkZXNob3coKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm5leHQoKTtcbiAgICB9IFxuICAgIFxuICAgIGNsaWNrTmF2TGVmdCgpIHtcbiAgICAgICAgaWYodGhpcy5zbGlkZXNob3dBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNsaWRlc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucHJldigpO1xuICAgIH1cbiAgICBcbiAgICBmcmFtZUNsaWNrKGZyYW1lKSB7XG4gICAgICAgIGlmKHRoaXMuc2xpZGVzaG93QWN0aXZlKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BTbGlkZXNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zZWxlY3QoRG9tSGFuZGxlci5pbmRleChmcmFtZSksIGZhbHNlKTtcbiAgICB9XG4gICAgXG4gICAgcHJldigpIHtcbiAgICAgICAgaWYodGhpcy5hY3RpdmVJbmRleCAhPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5hY3RpdmVJbmRleCAtIDEsIHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmKHRoaXMuYWN0aXZlSW5kZXggIT09ICh0aGlzLnBhbmVscy5sZW5ndGgtMSkpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KHRoaXMuYWN0aXZlSW5kZXggKyAxLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0KDAsIGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuc3RyaXBMZWZ0ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgc2VsZWN0KGluZGV4LCByZXBvc2l0aW9uKSB7XG4gICAgICAgIGlmKGluZGV4ICE9PSB0aGlzLmFjdGl2ZUluZGV4KSB7ICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgb2xkUGFuZWwgPSB0aGlzLnBhbmVsc1t0aGlzLmFjdGl2ZUluZGV4XSxcbiAgICAgICAgICAgIG5ld1BhbmVsID0gdGhpcy5wYW5lbHNbaW5kZXhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBEb21IYW5kbGVyLmZhZGVJbihuZXdQYW5lbCwgdGhpcy5lZmZlY3REdXJhdGlvbik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHRoaXMuc2hvd0ZpbG1zdHJpcCkge1xuICAgICAgICAgICAgICAgIGxldCBvbGRGcmFtZSA9IHRoaXMuZnJhbWVzW3RoaXMuYWN0aXZlSW5kZXhdLFxuICAgICAgICAgICAgICAgIG5ld0ZyYW1lID0gdGhpcy5mcmFtZXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKHJlcG9zaXRpb24gPT09IHVuZGVmaW5lZCB8fCByZXBvc2l0aW9uID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmcmFtZUxlZnQgPSBuZXdGcmFtZS5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBzdGVwRmFjdG9yID0gdGhpcy5mcmFtZVdpZHRoICsgcGFyc2VJbnQoZ2V0Q29tcHV0ZWRTdHlsZShuZXdGcmFtZSlbJ21hcmdpbi1yaWdodCddLCAxMCksXG4gICAgICAgICAgICAgICAgICAgIHN0cmlwTGVmdCA9IHRoaXMuc3RyaXAub2Zmc2V0TGVmdCxcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVWaWV3cG9ydExlZnQgPSBmcmFtZUxlZnQgKyBzdHJpcExlZnQsXG4gICAgICAgICAgICAgICAgICAgIGZyYW1lVmlld3BvcnRSaWdodCA9IGZyYW1lVmlld3BvcnRMZWZ0ICsgdGhpcy5mcmFtZVdpZHRoO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoZnJhbWVWaWV3cG9ydFJpZ2h0ID4gRG9tSGFuZGxlci53aWR0aCh0aGlzLnN0cmlwV3JhcHBlcikpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0cmlwTGVmdCAtPSBzdGVwRmFjdG9yO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGZyYW1lVmlld3BvcnRMZWZ0IDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyaXBMZWZ0ICs9IHN0ZXBGYWN0b3I7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gaW5kZXg7XG5cbiAgICAgICAgICAgIHRoaXMub25JbWFnZUNoYW5nZS5lbWl0KHtpbmRleDogaW5kZXh9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBjbGlja0ltYWdlKGV2ZW50LCBpbWFnZSwgaSkge1xuICAgICAgICB0aGlzLm9uSW1hZ2VDbGlja2VkLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbWFnZTogaW1hZ2UsIGluZGV4OiBpfSlcbiAgICB9XG4gICAgICAgIFxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnN0b3BTbGlkZXNob3coKTtcbiAgICB9XG5cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbR2FsbGVyaWFdLFxuICAgIGRlY2xhcmF0aW9uczogW0dhbGxlcmlhXVxufSlcbmV4cG9ydCBjbGFzcyBHYWxsZXJpYU1vZHVsZSB7IH0iXX0=