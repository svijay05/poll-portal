var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, AfterViewChecked, AfterViewInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
var Galleria = /** @class */ (function () {
    function Galleria(el) {
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
    Galleria.prototype.ngAfterViewChecked = function () {
        if (this.imagesChanged) {
            this.stopSlideshow();
            this.render();
            this.imagesChanged = false;
        }
    };
    Object.defineProperty(Galleria.prototype, "images", {
        get: function () {
            return this._images;
        },
        set: function (value) {
            this._images = value;
            this.imagesChanged = true;
            if (this.initialized) {
                this.activeIndex = 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    Galleria.prototype.ngAfterViewInit = function () {
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
    };
    Galleria.prototype.render = function () {
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
    };
    Galleria.prototype.startSlideshow = function () {
        var _this = this;
        this.interval = setInterval(function () {
            _this.next();
        }, this.transitionInterval);
        this.slideshowActive = true;
    };
    Galleria.prototype.stopSlideshow = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.slideshowActive = false;
    };
    Galleria.prototype.clickNavRight = function () {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.next();
    };
    Galleria.prototype.clickNavLeft = function () {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.prev();
    };
    Galleria.prototype.frameClick = function (frame) {
        if (this.slideshowActive) {
            this.stopSlideshow();
        }
        this.select(DomHandler.index(frame), false);
    };
    Galleria.prototype.prev = function () {
        if (this.activeIndex !== 0) {
            this.select(this.activeIndex - 1, true);
        }
    };
    Galleria.prototype.next = function () {
        if (this.activeIndex !== (this.panels.length - 1)) {
            this.select(this.activeIndex + 1, true);
        }
        else {
            this.select(0, false);
            this.stripLeft = 0;
        }
    };
    Galleria.prototype.select = function (index, reposition) {
        if (index !== this.activeIndex) {
            var oldPanel = this.panels[this.activeIndex], newPanel = this.panels[index];
            DomHandler.fadeIn(newPanel, this.effectDuration);
            if (this.showFilmstrip) {
                var oldFrame = this.frames[this.activeIndex], newFrame = this.frames[index];
                if (reposition === undefined || reposition === true) {
                    var frameLeft = newFrame.offsetLeft, stepFactor = this.frameWidth + parseInt(getComputedStyle(newFrame)['margin-right'], 10), stripLeft = this.strip.offsetLeft, frameViewportLeft = frameLeft + stripLeft, frameViewportRight = frameViewportLeft + this.frameWidth;
                    if (frameViewportRight > DomHandler.width(this.stripWrapper))
                        this.stripLeft -= stepFactor;
                    else if (frameViewportLeft < 0)
                        this.stripLeft += stepFactor;
                }
            }
            this.activeIndex = index;
            this.onImageChange.emit({ index: index });
        }
    };
    Galleria.prototype.clickImage = function (event, image, i) {
        this.onImageClicked.emit({ originalEvent: event, image: image, index: i });
    };
    Galleria.prototype.ngOnDestroy = function () {
        this.stopSlideshow();
    };
    Galleria.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
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
            template: "\n        <div [ngClass]=\"{'ui-galleria ui-widget ui-widget-content ui-corner-all':true}\" [ngStyle]=\"style\" [class]=\"styleClass\" [style.width.px]=\"panelWidth\">\n            <ul class=\"ui-galleria-panel-wrapper\" [style.width.px]=\"panelWidth\" [style.height.px]=\"panelHeight\">\n                <li *ngFor=\"let image of images;let i=index\" class=\"ui-galleria-panel\" [ngClass]=\"{'ui-helper-hidden':i!=activeIndex}\"\n                    [style.width.px]=\"panelWidth\" [style.height.px]=\"panelHeight\" (click)=\"clickImage($event,image,i)\">\n                    <img class=\"ui-panel-images\" [src]=\"image.source\" [alt]=\"image.alt\" [title]=\"image.title\"/>\n                </li>\n            </ul>\n            <div [ngClass]=\"{'ui-galleria-filmstrip-wrapper':true}\" *ngIf=\"showFilmstrip\">\n                <ul class=\"ui-galleria-filmstrip\" style=\"transition:left 1s\" [style.left.px]=\"stripLeft\">\n                    <li #frame *ngFor=\"let image of images;let i=index\" [ngClass]=\"{'ui-galleria-frame-active':i==activeIndex}\" class=\"ui-galleria-frame\" (click)=\"frameClick(frame)\"\n                        [style.width.px]=\"frameWidth\" [style.height.px]=\"frameHeight\" [style.transition]=\"'opacity 0.75s ease'\">\n                        <div class=\"ui-galleria-frame-content\">\n                            <img [src]=\"image.source\" [alt]=\"image.alt\" [title]=\"image.title\" class=\"ui-galleria-frame-image\"\n                                [style.width.px]=\"frameWidth\" [style.height.px]=\"frameHeight\">\n                        </div>\n                    </li>\n                </ul>\n            </div>\n            <div class=\"ui-galleria-nav-prev pi pi-fw pi-chevron-left\" (click)=\"clickNavLeft()\" [style.bottom.px]=\"frameHeight/2\" *ngIf=\"activeIndex !== 0\"></div>\n            <div class=\"ui-galleria-nav-next pi pi-fw pi-chevron-right\" (click)=\"clickNavRight()\" [style.bottom.px]=\"frameHeight/2\"></div>\n            <div class=\"ui-galleria-caption\" *ngIf=\"showCaption&&images\" style=\"display:block\">\n                <h4>{{images[activeIndex]?.title}}</h4><p>{{images[activeIndex]?.alt}}</p>\n            </div>\n        </div>\n    "
        })
    ], Galleria);
    return Galleria;
}());
export { Galleria };
var GalleriaModule = /** @class */ (function () {
    function GalleriaModule() {
    }
    GalleriaModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [Galleria],
            declarations: [Galleria]
        })
    ], GalleriaModule);
    return GalleriaModule;
}());
export { GalleriaModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2FsbGVyaWEuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2dhbGxlcmlhLyIsInNvdXJjZXMiOlsiZ2FsbGVyaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLGdCQUFnQixFQUFDLGFBQWEsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0gsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUErQnZDO0lBd0RJLGtCQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQWxEeEIsZUFBVSxHQUFXLEdBQUcsQ0FBQztRQUV6QixnQkFBVyxHQUFXLEdBQUcsQ0FBQztRQUUxQixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBRXhCLGdCQUFXLEdBQVcsRUFBRSxDQUFDO1FBRXpCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLGtCQUFhLEdBQVksSUFBSSxDQUFDO1FBRTlCLGFBQVEsR0FBWSxJQUFJLENBQUM7UUFFekIsdUJBQWtCLEdBQVcsSUFBSSxDQUFDO1FBRWxDLGdCQUFXLEdBQVksSUFBSSxDQUFDO1FBRTVCLG1CQUFjLEdBQVcsR0FBRyxDQUFDO1FBRTVCLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVwQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFzQnRDLGNBQVMsR0FBVyxDQUFDLENBQUM7SUFNTyxDQUFDO0lBRXJDLHFDQUFrQixHQUFsQjtRQUNJLElBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNuQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7U0FDOUI7SUFDTCxDQUFDO0lBRVEsc0JBQUksNEJBQU07YUFBVjtZQUNMLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUN4QixDQUFDO2FBQ0QsVUFBVyxLQUFXO1lBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1lBRTFCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7YUFDeEI7UUFDTCxDQUFDOzs7T0FSQTtJQVVELGtDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsOEJBQThCLENBQUMsQ0FBQztRQUNqRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUV4QixJQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsbUNBQW1DLENBQUMsQ0FBQztZQUM5RixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBQywwQkFBMEIsQ0FBQyxDQUFDO1NBQ3BGO1FBRUQsSUFBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNqQjtJQUNMLENBQUM7SUFFRCx5QkFBTSxHQUFOO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUV6RSxJQUFHLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUMsc0JBQXNCLENBQUMsQ0FBQztZQUNqRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNoRixJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDNUQ7UUFFRCxJQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMseUJBQXlCLENBQUMsQ0FBQztZQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNySCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3pFO1FBRUQsSUFBRyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2QsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3pCO1FBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsaUNBQWMsR0FBZDtRQUFBLGlCQU1DO1FBTEcsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUM7WUFDeEIsS0FBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUU1QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztJQUNoQyxDQUFDO0lBRUQsZ0NBQWEsR0FBYjtRQUNJLElBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNkLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEM7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztJQUNqQyxDQUFDO0lBRUQsZ0NBQWEsR0FBYjtRQUNJLElBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELCtCQUFZLEdBQVo7UUFDSSxJQUFHLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDckIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3hCO1FBQ0QsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCw2QkFBVSxHQUFWLFVBQVcsS0FBSztRQUNaLElBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUNyQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELHVCQUFJLEdBQUo7UUFDSSxJQUFHLElBQUksQ0FBQyxXQUFXLEtBQUssQ0FBQyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0M7SUFDTCxDQUFDO0lBRUQsdUJBQUksR0FBSjtRQUNJLElBQUcsSUFBSSxDQUFDLFdBQVcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzVDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0M7YUFDSTtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztJQUVELHlCQUFNLEdBQU4sVUFBTyxLQUFLLEVBQUUsVUFBVTtRQUNwQixJQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQzNCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUM1QyxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUU5QixVQUFVLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFakQsSUFBRyxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNuQixJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsRUFDNUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTlCLElBQUcsVUFBVSxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssSUFBSSxFQUFFO29CQUNoRCxJQUFJLFNBQVMsR0FBRyxRQUFRLENBQUMsVUFBVSxFQUNuQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQ3ZGLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFDakMsaUJBQWlCLEdBQUcsU0FBUyxHQUFHLFNBQVMsRUFDekMsa0JBQWtCLEdBQUcsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztvQkFFekQsSUFBRyxrQkFBa0IsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7d0JBQ3ZELElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxDQUFDO3lCQUM1QixJQUFHLGlCQUFpQixHQUFHLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxTQUFTLElBQUksVUFBVSxDQUFDO2lCQUNwQzthQUNKO1lBRUQsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFFekIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztTQUMzQztJQUNMLENBQUM7SUFFRCw2QkFBVSxHQUFWLFVBQVcsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFBO0lBQzVFLENBQUM7SUFFRCw4QkFBVyxHQUFYO1FBQ0ksSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7O2dCQXRKc0IsVUFBVTs7SUF0RHhCO1FBQVIsS0FBSyxFQUFFOzJDQUFZO0lBRVg7UUFBUixLQUFLLEVBQUU7Z0RBQW9CO0lBRW5CO1FBQVIsS0FBSyxFQUFFO2dEQUEwQjtJQUV6QjtRQUFSLEtBQUssRUFBRTtpREFBMkI7SUFFMUI7UUFBUixLQUFLLEVBQUU7Z0RBQXlCO0lBRXhCO1FBQVIsS0FBSyxFQUFFO2lEQUEwQjtJQUV6QjtRQUFSLEtBQUssRUFBRTtpREFBeUI7SUFFeEI7UUFBUixLQUFLLEVBQUU7bURBQStCO0lBRTlCO1FBQVIsS0FBSyxFQUFFOzhDQUEwQjtJQUV6QjtRQUFSLEtBQUssRUFBRTt3REFBbUM7SUFFbEM7UUFBUixLQUFLLEVBQUU7aURBQTZCO0lBRTVCO1FBQVIsS0FBSyxFQUFFO29EQUE4QjtJQUU1QjtRQUFULE1BQU0sRUFBRTtvREFBcUM7SUFFcEM7UUFBVCxNQUFNLEVBQUU7bURBQW9DO0lBc0NwQztRQUFSLEtBQUssRUFBRTswQ0FFUDtJQXBFUSxRQUFRO1FBN0JwQixTQUFTLENBQUM7WUFDUCxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsd3FFQXlCVDtTQUNKLENBQUM7T0FDVyxRQUFRLENBZ05wQjtJQUFELGVBQUM7Q0FBQSxBQWhORCxJQWdOQztTQWhOWSxRQUFRO0FBdU5yQjtJQUFBO0lBQThCLENBQUM7SUFBbEIsY0FBYztRQUwxQixRQUFRLENBQUM7WUFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdkIsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ25CLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQztTQUMzQixDQUFDO09BQ1csY0FBYyxDQUFJO0lBQUQscUJBQUM7Q0FBQSxBQUEvQixJQUErQjtTQUFsQixjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsRWxlbWVudFJlZixBZnRlclZpZXdDaGVja2VkLEFmdGVyVmlld0luaXQsT25EZXN0cm95LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWdhbGxlcmlhJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsndWktZ2FsbGVyaWEgdWktd2lkZ2V0IHVpLXdpZGdldC1jb250ZW50IHVpLWNvcm5lci1hbGwnOnRydWV9XCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtzdHlsZS53aWR0aC5weF09XCJwYW5lbFdpZHRoXCI+XG4gICAgICAgICAgICA8dWwgY2xhc3M9XCJ1aS1nYWxsZXJpYS1wYW5lbC13cmFwcGVyXCIgW3N0eWxlLndpZHRoLnB4XT1cInBhbmVsV2lkdGhcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cInBhbmVsSGVpZ2h0XCI+XG4gICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBpbWFnZSBvZiBpbWFnZXM7bGV0IGk9aW5kZXhcIiBjbGFzcz1cInVpLWdhbGxlcmlhLXBhbmVsXCIgW25nQ2xhc3NdPVwieyd1aS1oZWxwZXItaGlkZGVuJzppIT1hY3RpdmVJbmRleH1cIlxuICAgICAgICAgICAgICAgICAgICBbc3R5bGUud2lkdGgucHhdPVwicGFuZWxXaWR0aFwiIFtzdHlsZS5oZWlnaHQucHhdPVwicGFuZWxIZWlnaHRcIiAoY2xpY2spPVwiY2xpY2tJbWFnZSgkZXZlbnQsaW1hZ2UsaSlcIj5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzcz1cInVpLXBhbmVsLWltYWdlc1wiIFtzcmNdPVwiaW1hZ2Uuc291cmNlXCIgW2FsdF09XCJpbWFnZS5hbHRcIiBbdGl0bGVdPVwiaW1hZ2UudGl0bGVcIi8+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsndWktZ2FsbGVyaWEtZmlsbXN0cmlwLXdyYXBwZXInOnRydWV9XCIgKm5nSWY9XCJzaG93RmlsbXN0cmlwXCI+XG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwidWktZ2FsbGVyaWEtZmlsbXN0cmlwXCIgc3R5bGU9XCJ0cmFuc2l0aW9uOmxlZnQgMXNcIiBbc3R5bGUubGVmdC5weF09XCJzdHJpcExlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGxpICNmcmFtZSAqbmdGb3I9XCJsZXQgaW1hZ2Ugb2YgaW1hZ2VzO2xldCBpPWluZGV4XCIgW25nQ2xhc3NdPVwieyd1aS1nYWxsZXJpYS1mcmFtZS1hY3RpdmUnOmk9PWFjdGl2ZUluZGV4fVwiIGNsYXNzPVwidWktZ2FsbGVyaWEtZnJhbWVcIiAoY2xpY2spPVwiZnJhbWVDbGljayhmcmFtZSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLndpZHRoLnB4XT1cImZyYW1lV2lkdGhcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cImZyYW1lSGVpZ2h0XCIgW3N0eWxlLnRyYW5zaXRpb25dPVwiJ29wYWNpdHkgMC43NXMgZWFzZSdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1nYWxsZXJpYS1mcmFtZS1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBbc3JjXT1cImltYWdlLnNvdXJjZVwiIFthbHRdPVwiaW1hZ2UuYWx0XCIgW3RpdGxlXT1cImltYWdlLnRpdGxlXCIgY2xhc3M9XCJ1aS1nYWxsZXJpYS1mcmFtZS1pbWFnZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtzdHlsZS53aWR0aC5weF09XCJmcmFtZVdpZHRoXCIgW3N0eWxlLmhlaWdodC5weF09XCJmcmFtZUhlaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWdhbGxlcmlhLW5hdi1wcmV2IHBpIHBpLWZ3IHBpLWNoZXZyb24tbGVmdFwiIChjbGljayk9XCJjbGlja05hdkxlZnQoKVwiIFtzdHlsZS5ib3R0b20ucHhdPVwiZnJhbWVIZWlnaHQvMlwiICpuZ0lmPVwiYWN0aXZlSW5kZXggIT09IDBcIj48L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1nYWxsZXJpYS1uYXYtbmV4dCBwaSBwaS1mdyBwaS1jaGV2cm9uLXJpZ2h0XCIgKGNsaWNrKT1cImNsaWNrTmF2UmlnaHQoKVwiIFtzdHlsZS5ib3R0b20ucHhdPVwiZnJhbWVIZWlnaHQvMlwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWdhbGxlcmlhLWNhcHRpb25cIiAqbmdJZj1cInNob3dDYXB0aW9uJiZpbWFnZXNcIiBzdHlsZT1cImRpc3BsYXk6YmxvY2tcIj5cbiAgICAgICAgICAgICAgICA8aDQ+e3tpbWFnZXNbYWN0aXZlSW5kZXhdPy50aXRsZX19PC9oND48cD57e2ltYWdlc1thY3RpdmVJbmRleF0/LmFsdH19PC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgR2FsbGVyaWEgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLEFmdGVyVmlld0luaXQsT25EZXN0cm95IHtcbiAgICAgICAgXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHBhbmVsV2lkdGg6IG51bWJlciA9IDYwMDtcblxuICAgIEBJbnB1dCgpIHBhbmVsSGVpZ2h0OiBudW1iZXIgPSA0MDA7XG5cbiAgICBASW5wdXQoKSBmcmFtZVdpZHRoOiBudW1iZXIgPSA2MDtcbiAgICBcbiAgICBASW5wdXQoKSBmcmFtZUhlaWdodDogbnVtYmVyID0gNDA7XG5cbiAgICBASW5wdXQoKSBhY3RpdmVJbmRleDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIHNob3dGaWxtc3RyaXA6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYXV0b1BsYXk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgdHJhbnNpdGlvbkludGVydmFsOiBudW1iZXIgPSA0MDAwO1xuXG4gICAgQElucHV0KCkgc2hvd0NhcHRpb246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgZWZmZWN0RHVyYXRpb246IG51bWJlciA9IDUwMDtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25JbWFnZUNsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25JbWFnZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBfaW1hZ2VzOiBhbnlbXTtcbiAgICBcbiAgICBzbGlkZXNob3dBY3RpdmU6IGJvb2xlYW47XG4gICAgXG4gICAgcHVibGljIGNvbnRhaW5lcjogYW55O1xuICAgIFxuICAgIHB1YmxpYyBwYW5lbFdyYXBwZXI6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgcGFuZWxzOiBhbnk7XG4gICAgXG4gICAgcHVibGljIGNhcHRpb246IGFueTtcbiAgICBcbiAgICBwdWJsaWMgc3RyaXBXcmFwcGVyOiBhbnk7XG4gICAgXG4gICAgcHVibGljIHN0cmlwOiBhbnk7XG4gICAgXG4gICAgcHVibGljIGZyYW1lczogYW55O1xuICAgIFxuICAgIHB1YmxpYyBpbnRlcnZhbDogYW55O1xuICAgIFxuICAgIHB1YmxpYyBzdHJpcExlZnQ6IG51bWJlciA9IDA7XG4gICAgXG4gICAgcHVibGljIGltYWdlc0NoYW5nZWQ6IGJvb2xlYW47XG4gICAgXG4gICAgcHVibGljIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3Q2hlY2tlZCgpIHtcbiAgICAgICAgaWYodGhpcy5pbWFnZXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BTbGlkZXNob3coKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLmltYWdlc0NoYW5nZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBpbWFnZXMoKTogYW55W10ge1xuICAgICAgICByZXR1cm4gdGhpcy5faW1hZ2VzO1xuICAgIH1cbiAgICBzZXQgaW1hZ2VzKHZhbHVlOmFueVtdKSB7XG4gICAgICAgIHRoaXMuX2ltYWdlcyA9IHZhbHVlO1xuICAgICAgICB0aGlzLmltYWdlc0NoYW5nZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICAgICAgdGhpcy5wYW5lbFdyYXBwZXIgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndWwudWktZ2FsbGVyaWEtcGFuZWwtd3JhcHBlcicpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuc2hvd0ZpbG1zdHJpcCkge1xuICAgICAgICAgICAgdGhpcy5zdHJpcFdyYXBwZXIgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXIsJ2Rpdi51aS1nYWxsZXJpYS1maWxtc3RyaXAtd3JhcHBlcicpO1xuICAgICAgICAgICAgdGhpcy5zdHJpcCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLnN0cmlwV3JhcHBlciwndWwudWktZ2FsbGVyaWEtZmlsbXN0cmlwJyk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuaW1hZ2VzICYmIHRoaXMuaW1hZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgfSBcbiAgICB9XG4gICAgXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnBhbmVscyA9IERvbUhhbmRsZXIuZmluZCh0aGlzLnBhbmVsV3JhcHBlciwgJ2xpLnVpLWdhbGxlcmlhLXBhbmVsJyk7IFxuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5zaG93RmlsbXN0cmlwKSB7XG4gICAgICAgICAgICB0aGlzLmZyYW1lcyA9IERvbUhhbmRsZXIuZmluZCh0aGlzLnN0cmlwLCdsaS51aS1nYWxsZXJpYS1mcmFtZScpO1xuICAgICAgICAgICAgdGhpcy5zdHJpcFdyYXBwZXIuc3R5bGUud2lkdGggPSBEb21IYW5kbGVyLndpZHRoKHRoaXMucGFuZWxXcmFwcGVyKSAtIDUwICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMuc3RyaXBXcmFwcGVyLnN0eWxlLmhlaWdodCA9IHRoaXMuZnJhbWVIZWlnaHQgKyAncHgnO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZih0aGlzLnNob3dDYXB0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmNhcHRpb24gPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXIsJ2Rpdi51aS1nYWxsZXJpYS1jYXB0aW9uJyk7XG4gICAgICAgICAgICB0aGlzLmNhcHRpb24uc3R5bGUuYm90dG9tID0gdGhpcy5zaG93RmlsbXN0cmlwID8gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnN0cmlwV3JhcHBlcix0cnVlKSArICdweCcgOiAwICsgJ3B4JztcbiAgICAgICAgICAgIHRoaXMuY2FwdGlvbi5zdHlsZS53aWR0aCA9IERvbUhhbmRsZXIud2lkdGgodGhpcy5wYW5lbFdyYXBwZXIpICsgJ3B4JztcbiAgICAgICAgfVxuICAgXG4gICAgICAgIGlmKHRoaXMuYXV0b1BsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRTbGlkZXNob3coKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICB9XG4gICAgXG4gICAgc3RhcnRTbGlkZXNob3coKSB7XG4gICAgICAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgfSwgdGhpcy50cmFuc2l0aW9uSW50ZXJ2YWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zbGlkZXNob3dBY3RpdmUgPSB0cnVlO1xuICAgIH1cbiAgICAgICAgXG4gICAgc3RvcFNsaWRlc2hvdygpIHtcbiAgICAgICAgaWYodGhpcy5pbnRlcnZhbCkge1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zbGlkZXNob3dBY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgY2xpY2tOYXZSaWdodCgpIHtcbiAgICAgICAgaWYodGhpcy5zbGlkZXNob3dBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNsaWRlc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmV4dCgpO1xuICAgIH0gXG4gICAgXG4gICAgY2xpY2tOYXZMZWZ0KCkge1xuICAgICAgICBpZih0aGlzLnNsaWRlc2hvd0FjdGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5zdG9wU2xpZGVzaG93KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcmV2KCk7XG4gICAgfVxuICAgIFxuICAgIGZyYW1lQ2xpY2soZnJhbWUpIHtcbiAgICAgICAgaWYodGhpcy5zbGlkZXNob3dBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcFNsaWRlc2hvdygpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNlbGVjdChEb21IYW5kbGVyLmluZGV4KGZyYW1lKSwgZmFsc2UpO1xuICAgIH1cbiAgICBcbiAgICBwcmV2KCkge1xuICAgICAgICBpZih0aGlzLmFjdGl2ZUluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdCh0aGlzLmFjdGl2ZUluZGV4IC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYodGhpcy5hY3RpdmVJbmRleCAhPT0gKHRoaXMucGFuZWxzLmxlbmd0aC0xKSkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5hY3RpdmVJbmRleCArIDEsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3QoMCwgZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5zdHJpcExlZnQgPSAwO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICBcbiAgICBzZWxlY3QoaW5kZXgsIHJlcG9zaXRpb24pIHtcbiAgICAgICAgaWYoaW5kZXggIT09IHRoaXMuYWN0aXZlSW5kZXgpIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBvbGRQYW5lbCA9IHRoaXMucGFuZWxzW3RoaXMuYWN0aXZlSW5kZXhdLFxuICAgICAgICAgICAgbmV3UGFuZWwgPSB0aGlzLnBhbmVsc1tpbmRleF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIERvbUhhbmRsZXIuZmFkZUluKG5ld1BhbmVsLCB0aGlzLmVmZmVjdER1cmF0aW9uKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYodGhpcy5zaG93RmlsbXN0cmlwKSB7XG4gICAgICAgICAgICAgICAgbGV0IG9sZEZyYW1lID0gdGhpcy5mcmFtZXNbdGhpcy5hY3RpdmVJbmRleF0sXG4gICAgICAgICAgICAgICAgbmV3RnJhbWUgPSB0aGlzLmZyYW1lc1tpbmRleF07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYocmVwb3NpdGlvbiA9PT0gdW5kZWZpbmVkIHx8IHJlcG9zaXRpb24gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZyYW1lTGVmdCA9IG5ld0ZyYW1lLm9mZnNldExlZnQsXG4gICAgICAgICAgICAgICAgICAgIHN0ZXBGYWN0b3IgPSB0aGlzLmZyYW1lV2lkdGggKyBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG5ld0ZyYW1lKVsnbWFyZ2luLXJpZ2h0J10sIDEwKSxcbiAgICAgICAgICAgICAgICAgICAgc3RyaXBMZWZ0ID0gdGhpcy5zdHJpcC5vZmZzZXRMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBmcmFtZVZpZXdwb3J0TGVmdCA9IGZyYW1lTGVmdCArIHN0cmlwTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgZnJhbWVWaWV3cG9ydFJpZ2h0ID0gZnJhbWVWaWV3cG9ydExlZnQgKyB0aGlzLmZyYW1lV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZihmcmFtZVZpZXdwb3J0UmlnaHQgPiBEb21IYW5kbGVyLndpZHRoKHRoaXMuc3RyaXBXcmFwcGVyKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RyaXBMZWZ0IC09IHN0ZXBGYWN0b3I7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoZnJhbWVWaWV3cG9ydExlZnQgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdHJpcExlZnQgKz0gc3RlcEZhY3RvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSW5kZXggPSBpbmRleDtcblxuICAgICAgICAgICAgdGhpcy5vbkltYWdlQ2hhbmdlLmVtaXQoe2luZGV4OiBpbmRleH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGNsaWNrSW1hZ2UoZXZlbnQsIGltYWdlLCBpKSB7XG4gICAgICAgIHRoaXMub25JbWFnZUNsaWNrZWQuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGltYWdlOiBpbWFnZSwgaW5kZXg6IGl9KVxuICAgIH1cbiAgICAgICAgXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc3RvcFNsaWRlc2hvdygpO1xuICAgIH1cblxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtHYWxsZXJpYV0sXG4gICAgZGVjbGFyYXRpb25zOiBbR2FsbGVyaWFdXG59KVxuZXhwb3J0IGNsYXNzIEdhbGxlcmlhTW9kdWxlIHsgfSJdfQ==