var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, Input, Renderer2, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
var Lightbox = /** @class */ (function () {
    function Lightbox(el, renderer, cd) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.type = 'image';
        this.effectDuration = '500ms';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.closeOnEscape = true;
    }
    Lightbox.prototype.onImageClick = function (event, image, i, content) {
        this.index = i;
        this.loading = true;
        content.style.width = 32 + 'px';
        content.style.height = 32 + 'px';
        this.preventDocumentClickListener = true;
        this.show();
        this.displayImage(image);
        event.preventDefault();
    };
    Lightbox.prototype.ngAfterViewInit = function () {
        this.panel = DomHandler.findSingle(this.el.nativeElement, '.ui-lightbox ');
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.panel);
            else
                DomHandler.appendChild(this.panel, this.appendTo);
        }
    };
    Lightbox.prototype.onLinkClick = function (event, content) {
        this.preventDocumentClickListener = true;
        this.show();
        event.preventDefault();
    };
    Lightbox.prototype.displayImage = function (image) {
        var _this = this;
        setTimeout(function () {
            _this.cd.markForCheck();
            _this.currentImage = image;
            _this.captionText = image.title;
            _this.center();
        }, 1000);
    };
    Lightbox.prototype.show = function () {
        this.mask = document.createElement('div');
        DomHandler.addMultipleClasses(this.mask, 'ui-widget-overlay ui-dialog-mask');
        document.body.appendChild(this.mask);
        if (this.autoZIndex) {
            this.zindex = this.baseZIndex + (++DomHandler.zindex);
        }
        this.mask.style.zIndex = this.zindex - 1;
        this.center();
        this.visible = true;
        this.bindGlobalListeners();
    };
    Lightbox.prototype.hide = function (event) {
        this.captionText = null;
        this.index = null;
        this.currentImage = null;
        this.visible = false;
        if (this.mask) {
            document.body.removeChild(this.mask);
            this.mask = null;
        }
        this.unbindGlobalListeners();
        event.preventDefault();
    };
    Lightbox.prototype.center = function () {
        var elementWidth = DomHandler.getOuterWidth(this.panel);
        var elementHeight = DomHandler.getOuterHeight(this.panel);
        if (elementWidth == 0 && elementHeight == 0) {
            this.panel.style.visibility = 'hidden';
            this.panel.style.display = 'block';
            elementWidth = DomHandler.getOuterWidth(this.panel);
            elementHeight = DomHandler.getOuterHeight(this.panel);
            this.panel.style.display = 'none';
            this.panel.style.visibility = 'visible';
        }
    };
    Lightbox.prototype.onImageLoad = function (event, content) {
        var _this = this;
        var image = event.target;
        image.style.visibility = 'hidden';
        image.style.display = 'block';
        var imageWidth = DomHandler.getOuterWidth(image);
        var imageHeight = DomHandler.getOuterHeight(image);
        image.style.display = 'none';
        image.style.visibility = 'visible';
        content.style.width = imageWidth + 'px';
        content.style.height = imageHeight + 'px';
        this.panel.style.left = parseInt(this.panel.style.left) + (DomHandler.getOuterWidth(this.panel) - imageWidth) / 2 + 'px';
        this.panel.style.top = parseInt(this.panel.style.top) + (DomHandler.getOuterHeight(this.panel) - imageHeight) / 2 + 'px';
        setTimeout(function () {
            _this.cd.markForCheck();
            DomHandler.fadeIn(image, 500);
            image.style.display = 'block';
            //this.captionText = this.currentImage.title;
            _this.loading = false;
        }, parseInt(this.effectDuration));
    };
    Lightbox.prototype.prev = function (placeholder) {
        this.captionText = null;
        this.loading = true;
        placeholder.style.display = 'none';
        if (this.index > 0) {
            this.displayImage(this.images[--this.index]);
        }
    };
    Lightbox.prototype.next = function (placeholder) {
        this.captionText = null;
        this.loading = true;
        placeholder.style.display = 'none';
        if (this.index <= (this.images.length - 1)) {
            this.displayImage(this.images[++this.index]);
        }
    };
    Lightbox.prototype.bindGlobalListeners = function () {
        var _this = this;
        this.documentClickListener = this.renderer.listen('document', 'click', function (event) {
            if (!_this.preventDocumentClickListener && _this.visible) {
                _this.hide(event);
            }
            _this.preventDocumentClickListener = false;
            _this.cd.markForCheck();
        });
        if (this.closeOnEscape && !this.documentEscapeListener) {
            this.documentEscapeListener = this.renderer.listen('document', 'keydown', function (event) {
                if (event.which == 27) {
                    if (parseInt(_this.panel.style.zIndex) === (DomHandler.zindex + _this.baseZIndex)) {
                        _this.hide(event);
                    }
                }
            });
        }
    };
    Lightbox.prototype.unbindGlobalListeners = function () {
        if (this.documentEscapeListener) {
            this.documentEscapeListener();
            this.documentEscapeListener = null;
        }
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    };
    Object.defineProperty(Lightbox.prototype, "leftVisible", {
        get: function () {
            return this.images && this.images.length && this.index != 0 && !this.loading;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Lightbox.prototype, "rightVisible", {
        get: function () {
            return this.images && this.images.length && this.index < (this.images.length - 1) && !this.loading;
        },
        enumerable: true,
        configurable: true
    });
    Lightbox.prototype.ngOnDestroy = function () {
        this.unbindGlobalListeners();
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.panel);
        }
    };
    Lightbox.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    __decorate([
        Input()
    ], Lightbox.prototype, "images", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "type", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "style", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "styleClass", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "appendTo", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "easing", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "effectDuration", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "autoZIndex", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "baseZIndex", void 0);
    __decorate([
        Input()
    ], Lightbox.prototype, "closeOnEscape", void 0);
    Lightbox = __decorate([
        Component({
            selector: 'p-lightbox',
            template: "\n        <div [ngStyle]=\"style\" [class]=\"styleClass\" *ngIf=\"(type == 'image')\">\n            <a *ngFor=\"let image of images; let i = index;\" [href]=\"image.source\" (click)=\"onImageClick($event,image,i,content)\">\n                <img [src]=\"image.thumbnail\" [title]=\"image.title\" [alt]=\"image.alt\">\n            </a>\n        </div>\n        <span [ngStyle]=\"style\" [class]=\"styleClass\" *ngIf=\"(type == 'content')\" (click)=\"onLinkClick($event,content)\">\n            <ng-content select=\"a\"></ng-content>\n        </span>\n        <div class=\"ui-lightbox ui-widget ui-corner-all ui-shadow\" [style.display]=\"visible ? 'block' : 'none'\" [style.zIndex]=\"zindex\"\n            [ngClass]=\"{'ui-lightbox-loading': loading}\"\n            [style.transitionProperty]=\"'all'\" [style.transitionDuration]=\"effectDuration\" [style.transitionTimingFunction]=\"easing\" (click)=\"preventDocumentClickListener=true\">\n           <div class=\"ui-lightbox-content-wrapper\">\n              <a class=\"ui-state-default ui-lightbox-nav-left ui-corner-right\" [style.zIndex]=\"zindex + 1\" (click)=\"prev(img)\"\n                [ngClass]=\"{'ui-helper-hidden':!leftVisible}\"><span class=\"ui-lightbox-nav-icon pi pi-chevron-left\"></span></a>\n              <div #content class=\"ui-lightbox-content ui-corner-all\" \n                [style.transitionProperty]=\"'width,height'\" [style.transitionDuration]=\"effectDuration\" [style.transitionTimingFunction]=\"easing\">\n                <img #img [src]=\"currentImage ? currentImage.source||'' : ''\" (load)=\"onImageLoad($event,content)\" style=\"display:none\">\n                <ng-content></ng-content>\n              </div>\n              <a class=\"ui-state-default ui-lightbox-nav-right ui-corner-left ui-helper-hidden\" [style.zIndex]=\"zindex + 1\" (click)=\"next(img)\"\n                [ngClass]=\"{'ui-helper-hidden':!rightVisible}\"><span class=\"ui-lightbox-nav-icon pi pi-chevron-right\"></span></a>\n           </div>\n           <div class=\"ui-lightbox-caption ui-widget-header\" [style.display]=\"captionText ? 'block' : 'none'\">\n              <span class=\"ui-lightbox-caption-text\">{{captionText}}</span><a class=\"ui-lightbox-close ui-corner-all\" tabindex=\"0\" (click)=\"hide($event)\" (keydown.enter)=\"hide($event)\"><span class=\"pi pi-times\"></span></a>\n              <div style=\"clear:both\"></div>\n           </div>\n        </div>\n    "
        })
    ], Lightbox);
    return Lightbox;
}());
export { Lightbox };
var LightboxModule = /** @class */ (function () {
    function LightboxModule() {
    }
    LightboxModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [Lightbox],
            declarations: [Lightbox]
        })
    ], LightboxModule);
    return LightboxModule;
}());
export { LightboxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlnaHRib3guanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2xpZ2h0Ym94LyIsInNvdXJjZXMiOlsibGlnaHRib3gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLEtBQUssRUFBQyxTQUFTLEVBQUMsYUFBYSxFQUFDLFNBQVMsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN2SCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQWtDdkM7SUE0Q0ksa0JBQW1CLEVBQWMsRUFBUyxRQUFtQixFQUFTLEVBQXFCO1FBQXhFLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUF4Q2xGLFNBQUksR0FBVyxPQUFPLENBQUM7UUFVdkIsbUJBQWMsR0FBUSxPQUFPLENBQUM7UUFFOUIsZUFBVSxHQUFZLElBQUksQ0FBQztRQUUzQixlQUFVLEdBQVcsQ0FBQyxDQUFDO1FBRXZCLGtCQUFhLEdBQVksSUFBSSxDQUFDO0lBd0J1RCxDQUFDO0lBRS9GLCtCQUFZLEdBQVosVUFBYSxLQUFLLEVBQUMsS0FBSyxFQUFDLENBQUMsRUFBQyxPQUFPO1FBQzlCLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDcEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFD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QyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqRDtJQUNMLENBQUM7O2dCQXZLc0IsVUFBVTtnQkFBbUIsU0FBUztnQkFBYSxpQkFBaUI7O0lBMUNsRjtRQUFSLEtBQUssRUFBRTs0Q0FBZTtJQUVkO1FBQVIsS0FBSyxFQUFFOzBDQUF3QjtJQUV2QjtRQUFSLEtBQUssRUFBRTsyQ0FBWTtJQUVYO1FBQVIsS0FBSyxFQUFFO2dEQUFvQjtJQUVuQjtRQUFSLEtBQUssRUFBRTs4Q0FBZTtJQUVkO1FBQVIsS0FBSyxFQUFFOzRDQUFvQjtJQUVuQjtRQUFSLEtBQUssRUFBRTtvREFBK0I7SUFFOUI7UUFBUixLQUFLLEVBQUU7Z0RBQTRCO0lBRTNCO1FBQVIsS0FBSyxFQUFFO2dEQUF3QjtJQUV2QjtRQUFSLEtBQUssRUFBRTttREFBK0I7SUFwQjlCLFFBQVE7UUFoQ3BCLFNBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSw4NEVBNEJUO1NBQ0osQ0FBQztPQUNXLFFBQVEsQ0FxTnBCO0lBQUQsZUFBQztDQUFBLEFBck5ELElBcU5DO1NBck5ZLFFBQVE7QUE0TnJCO0lBQUE7SUFBOEIsQ0FBQztJQUFsQixjQUFjO1FBTDFCLFFBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN2QixPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbkIsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDO1NBQzNCLENBQUM7T0FDVyxjQUFjLENBQUk7SUFBRCxxQkFBQztDQUFBLEFBQS9CLElBQStCO1NBQWxCLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxFbGVtZW50UmVmLElucHV0LFJlbmRlcmVyMixBZnRlclZpZXdJbml0LE9uRGVzdHJveSwgQ2hhbmdlRGV0ZWN0b3JSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWxpZ2h0Ym94JyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiAqbmdJZj1cIih0eXBlID09ICdpbWFnZScpXCI+XG4gICAgICAgICAgICA8YSAqbmdGb3I9XCJsZXQgaW1hZ2Ugb2YgaW1hZ2VzOyBsZXQgaSA9IGluZGV4O1wiIFtocmVmXT1cImltYWdlLnNvdXJjZVwiIChjbGljayk9XCJvbkltYWdlQ2xpY2soJGV2ZW50LGltYWdlLGksY29udGVudClcIj5cbiAgICAgICAgICAgICAgICA8aW1nIFtzcmNdPVwiaW1hZ2UudGh1bWJuYWlsXCIgW3RpdGxlXT1cImltYWdlLnRpdGxlXCIgW2FsdF09XCJpbWFnZS5hbHRcIj5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzcGFuIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiAqbmdJZj1cIih0eXBlID09ICdjb250ZW50JylcIiAoY2xpY2spPVwib25MaW5rQ2xpY2soJGV2ZW50LGNvbnRlbnQpXCI+XG4gICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJhXCI+PC9uZy1jb250ZW50PlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1saWdodGJveCB1aS13aWRnZXQgdWktY29ybmVyLWFsbCB1aS1zaGFkb3dcIiBbc3R5bGUuZGlzcGxheV09XCJ2aXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJ1wiIFtzdHlsZS56SW5kZXhdPVwiemluZGV4XCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsndWktbGlnaHRib3gtbG9hZGluZyc6IGxvYWRpbmd9XCJcbiAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uUHJvcGVydHldPVwiJ2FsbCdcIiBbc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uXT1cImVmZmVjdER1cmF0aW9uXCIgW3N0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbl09XCJlYXNpbmdcIiAoY2xpY2spPVwicHJldmVudERvY3VtZW50Q2xpY2tMaXN0ZW5lcj10cnVlXCI+XG4gICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1saWdodGJveC1jb250ZW50LXdyYXBwZXJcIj5cbiAgICAgICAgICAgICAgPGEgY2xhc3M9XCJ1aS1zdGF0ZS1kZWZhdWx0IHVpLWxpZ2h0Ym94LW5hdi1sZWZ0IHVpLWNvcm5lci1yaWdodFwiIFtzdHlsZS56SW5kZXhdPVwiemluZGV4ICsgMVwiIChjbGljayk9XCJwcmV2KGltZylcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsndWktaGVscGVyLWhpZGRlbic6IWxlZnRWaXNpYmxlfVwiPjxzcGFuIGNsYXNzPVwidWktbGlnaHRib3gtbmF2LWljb24gcGkgcGktY2hldnJvbi1sZWZ0XCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgICAgPGRpdiAjY29udGVudCBjbGFzcz1cInVpLWxpZ2h0Ym94LWNvbnRlbnQgdWktY29ybmVyLWFsbFwiIFxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uUHJvcGVydHldPVwiJ3dpZHRoLGhlaWdodCdcIiBbc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uXT1cImVmZmVjdER1cmF0aW9uXCIgW3N0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbl09XCJlYXNpbmdcIj5cbiAgICAgICAgICAgICAgICA8aW1nICNpbWcgW3NyY109XCJjdXJyZW50SW1hZ2UgPyBjdXJyZW50SW1hZ2Uuc291cmNlfHwnJyA6ICcnXCIgKGxvYWQpPVwib25JbWFnZUxvYWQoJGV2ZW50LGNvbnRlbnQpXCIgc3R5bGU9XCJkaXNwbGF5Om5vbmVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8YSBjbGFzcz1cInVpLXN0YXRlLWRlZmF1bHQgdWktbGlnaHRib3gtbmF2LXJpZ2h0IHVpLWNvcm5lci1sZWZ0IHVpLWhlbHBlci1oaWRkZW5cIiBbc3R5bGUuekluZGV4XT1cInppbmRleCArIDFcIiAoY2xpY2spPVwibmV4dChpbWcpXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLWhlbHBlci1oaWRkZW4nOiFyaWdodFZpc2libGV9XCI+PHNwYW4gY2xhc3M9XCJ1aS1saWdodGJveC1uYXYtaWNvbiBwaSBwaS1jaGV2cm9uLXJpZ2h0XCI+PC9zcGFuPjwvYT5cbiAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1saWdodGJveC1jYXB0aW9uIHVpLXdpZGdldC1oZWFkZXJcIiBbc3R5bGUuZGlzcGxheV09XCJjYXB0aW9uVGV4dCA/ICdibG9jaycgOiAnbm9uZSdcIj5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1saWdodGJveC1jYXB0aW9uLXRleHRcIj57e2NhcHRpb25UZXh0fX08L3NwYW4+PGEgY2xhc3M9XCJ1aS1saWdodGJveC1jbG9zZSB1aS1jb3JuZXItYWxsXCIgdGFiaW5kZXg9XCIwXCIgKGNsaWNrKT1cImhpZGUoJGV2ZW50KVwiIChrZXlkb3duLmVudGVyKT1cImhpZGUoJGV2ZW50KVwiPjxzcGFuIGNsYXNzPVwicGkgcGktdGltZXNcIj48L3NwYW4+PC9hPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiY2xlYXI6Ym90aFwiPjwvZGl2PlxuICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBMaWdodGJveCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsT25EZXN0cm95IHtcblxuICAgIEBJbnB1dCgpIGltYWdlczogYW55W107XG4gICAgXG4gICAgQElucHV0KCkgdHlwZTogc3RyaW5nID0gJ2ltYWdlJztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuICAgIFxuICAgIEBJbnB1dCgpIGVhc2luZzogJ2Vhc2Utb3V0JztcbiAgICBcbiAgICBASW5wdXQoKSBlZmZlY3REdXJhdGlvbjogYW55ID0gJzUwMG1zJztcblxuICAgIEBJbnB1dCgpIGF1dG9aSW5kZXg6IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG4gICAgICAgICAgICAgICAgXG4gICAgQElucHV0KCkgY2xvc2VPbkVzY2FwZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBwdWJsaWMgdmlzaWJsZTogYm9vbGVhbjtcbiAgICBcbiAgICBwdWJsaWMgbG9hZGluZzogYm9vbGVhbjtcbiAgICAgICAgXG4gICAgcHVibGljIGN1cnJlbnRJbWFnZTogYW55O1xuICAgIFxuICAgIHB1YmxpYyBjYXB0aW9uVGV4dDogc3RyaW5nO1xuICAgIFxuICAgIHB1YmxpYyB6aW5kZXg6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgcGFuZWw6IGFueTtcbiAgICBcbiAgICBwdWJsaWMgaW5kZXg6IG51bWJlcjtcbiAgICBcbiAgICBwdWJsaWMgbWFzazogYW55O1xuICAgIFxuICAgIHB1YmxpYyBwcmV2ZW50RG9jdW1lbnRDbGlja0xpc3RlbmVyOiBib29sZWFuO1xuICAgIFxuICAgIHB1YmxpYyBkb2N1bWVudENsaWNrTGlzdGVuZXI6IGFueTtcblxuICAgIHB1YmxpYyBkb2N1bWVudEVzY2FwZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmKSB7fVxuICAgICAgICAgICAgICAgIFxuICAgIG9uSW1hZ2VDbGljayhldmVudCxpbWFnZSxpLGNvbnRlbnQpIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGk7XG4gICAgICAgIHRoaXMubG9hZGluZyA9IHRydWU7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUud2lkdGggPSAzMiArICdweCc7XG4gICAgICAgIGNvbnRlbnQuc3R5bGUuaGVpZ2h0ID0gMzIgKyAncHgnO1xuICAgICAgICB0aGlzLnByZXZlbnREb2N1bWVudENsaWNrTGlzdGVuZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5SW1hZ2UoaW1hZ2UpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMucGFuZWwgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLnVpLWxpZ2h0Ym94ICcpO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5hcHBlbmRUbykge1xuICAgICAgICAgICAgaWYodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKVxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5wYW5lbCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLnBhbmVsLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbkxpbmtDbGljayhldmVudCxjb250ZW50KSB7XG4gICAgICAgIHRoaXMucHJldmVudERvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRydWU7XG4gICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBkaXNwbGF5SW1hZ2UoaW1hZ2UpIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW1hZ2UgPSBpbWFnZTtcbiAgICAgICAgICAgIHRoaXMuY2FwdGlvblRleHQgPSBpbWFnZS50aXRsZTtcbiAgICAgICAgICAgIHRoaXMuY2VudGVyKCk7XG4gICAgICAgIH0sIDEwMDApO1xuICAgIH1cbiAgICBcbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLm1hc2sgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgXG4gICAgICAgIERvbUhhbmRsZXIuYWRkTXVsdGlwbGVDbGFzc2VzKHRoaXMubWFzaywgJ3VpLXdpZGdldC1vdmVybGF5IHVpLWRpYWxvZy1tYXNrJyk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tYXNrKTtcbiAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgdGhpcy56aW5kZXggPSB0aGlzLmJhc2VaSW5kZXggKyAoKytEb21IYW5kbGVyLnppbmRleCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tYXNrLnN0eWxlLnpJbmRleCA9IHRoaXMuemluZGV4IC0gMTtcbiAgICAgICAgdGhpcy5jZW50ZXIoKTtcbiAgICAgICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG4gICAgfVxuICAgIFxuICAgIGhpZGUoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5jYXB0aW9uVGV4dCA9IG51bGw7XG4gICAgICAgIHRoaXMuaW5kZXggPSBudWxsO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbWFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5tYXNrKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubWFzayk7XG4gICAgICAgICAgICB0aGlzLm1hc2sgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnVuYmluZEdsb2JhbExpc3RlbmVycygpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgICBcbiAgICBjZW50ZXIoKSB7XG4gICAgICAgIGxldCBlbGVtZW50V2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5wYW5lbCk7XG4gICAgICAgIGxldCBlbGVtZW50SGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnBhbmVsKTtcbiAgICAgICAgaWYoZWxlbWVudFdpZHRoID09IDAgJiYgZWxlbWVudEhlaWdodCA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnBhbmVsLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgICAgIHRoaXMucGFuZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICBlbGVtZW50V2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5wYW5lbCk7XG4gICAgICAgICAgICBlbGVtZW50SGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLnBhbmVsKTtcbiAgICAgICAgICAgIHRoaXMucGFuZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMucGFuZWwuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgb25JbWFnZUxvYWQoZXZlbnQsY29udGVudCkge1xuICAgICAgICBsZXQgaW1hZ2UgPSBldmVudC50YXJnZXQ7XG4gICAgICAgIGltYWdlLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgICAgaW1hZ2Uuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGxldCBpbWFnZVdpZHRoID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKGltYWdlKTtcbiAgICAgICAgbGV0IGltYWdlSGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodChpbWFnZSk7XG4gICAgICAgIGltYWdlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGltYWdlLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cbiAgICAgICAgY29udGVudC5zdHlsZS53aWR0aCA9IGltYWdlV2lkdGggKyAncHgnO1xuICAgICAgICBjb250ZW50LnN0eWxlLmhlaWdodCA9IGltYWdlSGVpZ2h0ICsgJ3B4JztcbiAgICAgICAgdGhpcy5wYW5lbC5zdHlsZS5sZWZ0ID0gcGFyc2VJbnQodGhpcy5wYW5lbC5zdHlsZS5sZWZ0KSArIChEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5wYW5lbCkgLSBpbWFnZVdpZHRoKSAvIDIgKyAncHgnO1xuICAgICAgICB0aGlzLnBhbmVsLnN0eWxlLnRvcCA9IHBhcnNlSW50KHRoaXMucGFuZWwuc3R5bGUudG9wKSArIChEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMucGFuZWwpIC0gaW1hZ2VIZWlnaHQpIC8gMiArICdweCc7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgRG9tSGFuZGxlci5mYWRlSW4oaW1hZ2UsIDUwMCk7XG4gICAgICAgICAgICBpbWFnZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgICAgIC8vdGhpcy5jYXB0aW9uVGV4dCA9IHRoaXMuY3VycmVudEltYWdlLnRpdGxlO1xuICAgICAgICAgICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgICAgIH0sIHBhcnNlSW50KHRoaXMuZWZmZWN0RHVyYXRpb24pKTtcbiAgICB9XG4gICAgXG4gICAgcHJldihwbGFjZWhvbGRlcjogYW55KSB7XG4gICAgICAgIHRoaXMuY2FwdGlvblRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICBwbGFjZWhvbGRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBpZih0aGlzLmluZGV4ID4gMCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SW1hZ2UodGhpcy5pbWFnZXNbLS10aGlzLmluZGV4XSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgbmV4dChwbGFjZWhvbGRlcjogYW55KSB7XG4gICAgICAgIHRoaXMuY2FwdGlvblRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuICAgICAgICBwbGFjZWhvbGRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBpZih0aGlzLmluZGV4IDw9ICh0aGlzLmltYWdlcy5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgdGhpcy5kaXNwbGF5SW1hZ2UodGhpcy5pbWFnZXNbKyt0aGlzLmluZGV4XSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kR2xvYmFsTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYoIXRoaXMucHJldmVudERvY3VtZW50Q2xpY2tMaXN0ZW5lciYmdGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucHJldmVudERvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5jZC5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKHRoaXMuY2xvc2VPbkVzY2FwZSAmJiAhdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbignZG9jdW1lbnQnLCAna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMjcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KHRoaXMucGFuZWwuc3R5bGUuekluZGV4KSA9PT0gKERvbUhhbmRsZXIuemluZGV4ICsgdGhpcy5iYXNlWkluZGV4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kR2xvYmFsTGlzdGVuZXJzKCkge1xuICAgICAgICBpZih0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIpe1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudEVzY2FwZUxpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50RXNjYXBlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIFxuICAgIGdldCBsZWZ0VmlzaWJsZSgpOmJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoICYmIHRoaXMuaW5kZXggIT0gMCAmJiAhdGhpcy5sb2FkaW5nOyBcbiAgICB9XG4gICAgXG4gICAgZ2V0IHJpZ2h0VmlzaWJsZSgpOmJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5pbWFnZXMgJiYgdGhpcy5pbWFnZXMubGVuZ3RoICYmIHRoaXMuaW5kZXggPCAodGhpcy5pbWFnZXMubGVuZ3RoIC0gMSkgJiYgIXRoaXMubG9hZGluZzsgXG4gICAgfVxuICAgIFxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZEdsb2JhbExpc3RlbmVycygpO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5hcHBlbmRUbykge1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucGFuZWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgICAgICBcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTGlnaHRib3hdLFxuICAgIGRlY2xhcmF0aW9uczogW0xpZ2h0Ym94XVxufSlcbmV4cG9ydCBjbGFzcyBMaWdodGJveE1vZHVsZSB7IH1cbiJdfQ==