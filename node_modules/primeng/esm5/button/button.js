var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Directive, Component, ElementRef, EventEmitter, AfterViewInit, Output, OnDestroy, Input } from '@angular/core';
import { DomHandler } from 'primeng/dom';
import { CommonModule } from '@angular/common';
var ButtonDirective = /** @class */ (function () {
    function ButtonDirective(el) {
        this.el = el;
        this.iconPos = 'left';
        this.cornerStyleClass = 'ui-corner-all';
    }
    ButtonDirective.prototype.ngAfterViewInit = function () {
        DomHandler.addMultipleClasses(this.el.nativeElement, this.getStyleClass());
        if (this.icon) {
            var iconElement = document.createElement("span");
            iconElement.setAttribute("aria-hidden", "true");
            var iconPosClass = (this.iconPos == 'right') ? 'ui-button-icon-right' : 'ui-button-icon-left';
            iconElement.className = iconPosClass + ' ui-clickable ' + this.icon;
            this.el.nativeElement.appendChild(iconElement);
        }
        var labelElement = document.createElement("span");
        labelElement.className = 'ui-button-text ui-clickable';
        labelElement.appendChild(document.createTextNode(this.label || 'ui-btn'));
        this.el.nativeElement.appendChild(labelElement);
        this.initialized = true;
    };
    ButtonDirective.prototype.getStyleClass = function () {
        var styleClass = 'ui-button ui-widget ui-state-default ' + this.cornerStyleClass;
        if (this.icon) {
            if (this.label != null && this.label != undefined) {
                if (this.iconPos == 'left')
                    styleClass = styleClass + ' ui-button-text-icon-left';
                else
                    styleClass = styleClass + ' ui-button-text-icon-right';
            }
            else {
                styleClass = styleClass + ' ui-button-icon-only';
            }
        }
        else {
            if (this.label) {
                styleClass = styleClass + ' ui-button-text-only';
            }
            else {
                styleClass = styleClass + ' ui-button-text-empty';
            }
        }
        return styleClass;
    };
    Object.defineProperty(ButtonDirective.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (val) {
            this._label = val;
            if (this.initialized) {
                DomHandler.findSingle(this.el.nativeElement, '.ui-button-text').textContent = this._label;
                if (!this.icon) {
                    if (this._label) {
                        DomHandler.removeClass(this.el.nativeElement, 'ui-button-text-empty');
                        DomHandler.addClass(this.el.nativeElement, 'ui-button-text-only');
                    }
                    else {
                        DomHandler.addClass(this.el.nativeElement, 'ui-button-text-empty');
                        DomHandler.removeClass(this.el.nativeElement, 'ui-button-text-only');
                    }
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonDirective.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (val) {
            this._icon = val;
            if (this.initialized) {
                var iconPosClass = (this.iconPos == 'right') ? 'ui-button-icon-right' : 'ui-button-icon-left';
                DomHandler.findSingle(this.el.nativeElement, '.ui-clickable').className =
                    iconPosClass + ' ui-clickable ' + this.icon;
            }
        },
        enumerable: true,
        configurable: true
    });
    ButtonDirective.prototype.ngOnDestroy = function () {
        while (this.el.nativeElement.hasChildNodes()) {
            this.el.nativeElement.removeChild(this.el.nativeElement.lastChild);
        }
        this.initialized = false;
    };
    ButtonDirective.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], ButtonDirective.prototype, "iconPos", void 0);
    __decorate([
        Input()
    ], ButtonDirective.prototype, "cornerStyleClass", void 0);
    __decorate([
        Input()
    ], ButtonDirective.prototype, "label", null);
    __decorate([
        Input()
    ], ButtonDirective.prototype, "icon", null);
    ButtonDirective = __decorate([
        Directive({
            selector: '[pButton]'
        })
    ], ButtonDirective);
    return ButtonDirective;
}());
export { ButtonDirective };
var Button = /** @class */ (function () {
    function Button() {
        this.iconPos = 'left';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    __decorate([
        Input()
    ], Button.prototype, "type", void 0);
    __decorate([
        Input()
    ], Button.prototype, "iconPos", void 0);
    __decorate([
        Input()
    ], Button.prototype, "icon", void 0);
    __decorate([
        Input()
    ], Button.prototype, "label", void 0);
    __decorate([
        Input()
    ], Button.prototype, "disabled", void 0);
    __decorate([
        Input()
    ], Button.prototype, "style", void 0);
    __decorate([
        Input()
    ], Button.prototype, "styleClass", void 0);
    __decorate([
        Output()
    ], Button.prototype, "onClick", void 0);
    __decorate([
        Output()
    ], Button.prototype, "onFocus", void 0);
    __decorate([
        Output()
    ], Button.prototype, "onBlur", void 0);
    Button = __decorate([
        Component({
            selector: 'p-button',
            template: "\n        <button [attr.type]=\"type\" [class]=\"styleClass\" [ngStyle]=\"style\" [disabled]=\"disabled\"\n            [ngClass]=\"{'ui-button ui-widget ui-state-default ui-corner-all':true,\n                        'ui-button-icon-only': (icon && !label),\n                        'ui-button-text-icon-left': (icon && label && iconPos === 'left'),\n                        'ui-button-text-icon-right': (icon && label && iconPos === 'right'),\n                        'ui-button-text-only': (!icon && label),\n                        'ui-button-text-empty': (!icon && !label),\n                        'ui-state-disabled': disabled}\"\n                        (click)=\"onClick.emit($event)\" (focus)=\"onFocus.emit($event)\" (blur)=\"onBlur.emit($event)\">\n            <ng-content></ng-content>\n            <span [ngClass]=\"{'ui-clickable': true,\n                        'ui-button-icon-left': (iconPos === 'left'), \n                        'ui-button-icon-right': (iconPos === 'right')}\"\n                        [class]=\"icon\" *ngIf=\"icon\"></span>\n            <span class=\"ui-button-text ui-clickable\">{{label||'ui-btn'}}</span>\n        </button>\n    "
        })
    ], Button);
    return Button;
}());
export { Button };
var ButtonModule = /** @class */ (function () {
    function ButtonModule() {
    }
    ButtonModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [ButtonDirective, Button],
            declarations: [ButtonDirective, Button]
        })
    ], ButtonModule);
    return ButtonModule;
}());
export { ButtonModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9idXR0b24vIiwic291cmNlcyI6WyJidXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxZQUFZLEVBQUMsYUFBYSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3hILE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBSzdDO0lBWUkseUJBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBVnhCLFlBQU8sR0FBcUIsTUFBTSxDQUFDO1FBRW5DLHFCQUFnQixHQUFXLGVBQWUsQ0FBQztJQVFoQixDQUFDO0lBRXJDLHlDQUFlLEdBQWY7UUFDSSxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDM0UsSUFBRyxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1YsSUFBSSxXQUFXLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxXQUFXLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNoRCxJQUFJLFlBQVksR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFBLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQztZQUM3RixXQUFXLENBQUMsU0FBUyxHQUFHLFlBQVksR0FBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3JFLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxX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QUU7MkNBQWlEO0lBRWhEO1FBQVQsTUFBTSxFQUFFOzJDQUFpRDtJQUVoRDtRQUFULE1BQU0sRUFBRTswQ0FBZ0Q7SUFwQmhELE1BQU07UUFyQmxCLFNBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFFBQVEsRUFBRSxtcENBaUJUO1NBQ0osQ0FBQztPQUNXLE1BQU0sQ0FxQmxCO0lBQUQsYUFBQztDQUFBLEFBckJELElBcUJDO1NBckJZLE1BQU07QUE0Qm5CO0lBQUE7SUFBNEIsQ0FBQztJQUFoQixZQUFZO1FBTHhCLFFBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN2QixPQUFPLEVBQUUsQ0FBQyxlQUFlLEVBQUMsTUFBTSxDQUFDO1lBQ2pDLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBQyxNQUFNLENBQUM7U0FDekMsQ0FBQztPQUNXLFlBQVksQ0FBSTtJQUFELG1CQUFDO0NBQUEsQUFBN0IsSUFBNkI7U0FBaEIsWUFBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TmdNb2R1bGUsRGlyZWN0aXZlLENvbXBvbmVudCxFbGVtZW50UmVmLEV2ZW50RW1pdHRlcixBZnRlclZpZXdJbml0LE91dHB1dCxPbkRlc3Ryb3ksSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEJ1dHRvbl0nXG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbkRpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG5cbiAgICBASW5wdXQoKSBpY29uUG9zOiAnbGVmdCcgfCAncmlnaHQnID0gJ2xlZnQnO1xuICAgIFxuICAgIEBJbnB1dCgpIGNvcm5lclN0eWxlQ2xhc3M6IHN0cmluZyA9ICd1aS1jb3JuZXItYWxsJztcbiAgICAgICAgXG4gICAgcHVibGljIF9sYWJlbDogc3RyaW5nO1xuICAgIFxuICAgIHB1YmxpYyBfaWNvbjogc3RyaW5nO1xuICAgICAgICAgICAgXG4gICAgcHVibGljIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgRG9tSGFuZGxlci5hZGRNdWx0aXBsZUNsYXNzZXModGhpcy5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLmdldFN0eWxlQ2xhc3MoKSk7XG4gICAgICAgIGlmKHRoaXMuaWNvbikge1xuICAgICAgICAgICAgbGV0IGljb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gICAgICAgICAgICBpY29uRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLCBcInRydWVcIik7XG4gICAgICAgICAgICBsZXQgaWNvblBvc0NsYXNzID0gKHRoaXMuaWNvblBvcyA9PSAncmlnaHQnKSA/ICd1aS1idXR0b24taWNvbi1yaWdodCc6ICd1aS1idXR0b24taWNvbi1sZWZ0JztcbiAgICAgICAgICAgIGljb25FbGVtZW50LmNsYXNzTmFtZSA9IGljb25Qb3NDbGFzcyAgKyAnIHVpLWNsaWNrYWJsZSAnICsgdGhpcy5pY29uO1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFwcGVuZENoaWxkKGljb25FbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICBsYWJlbEVsZW1lbnQuY2xhc3NOYW1lID0gJ3VpLWJ1dHRvbi10ZXh0IHVpLWNsaWNrYWJsZSc7XG4gICAgICAgIGxhYmVsRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLmxhYmVsfHwndWktYnRuJykpO1xuICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQobGFiZWxFbGVtZW50KTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICAgICAgICBcbiAgICBnZXRTdHlsZUNsYXNzKCk6IHN0cmluZyB7XG4gICAgICAgIGxldCBzdHlsZUNsYXNzID0gJ3VpLWJ1dHRvbiB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCAnICsgdGhpcy5jb3JuZXJTdHlsZUNsYXNzO1xuICAgICAgICBpZih0aGlzLmljb24pIHtcbiAgICAgICAgICAgIGlmKHRoaXMubGFiZWwgIT0gbnVsbCAmJiB0aGlzLmxhYmVsICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaWNvblBvcyA9PSAnbGVmdCcpXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3MgPSBzdHlsZUNsYXNzICsgJyB1aS1idXR0b24tdGV4dC1pY29uLWxlZnQnO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVDbGFzcyA9IHN0eWxlQ2xhc3MgKyAnIHVpLWJ1dHRvbi10ZXh0LWljb24tcmlnaHQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3R5bGVDbGFzcyA9IHN0eWxlQ2xhc3MgKyAnIHVpLWJ1dHRvbi1pY29uLW9ubHknO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5sYWJlbCkge1xuICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3MgPSBzdHlsZUNsYXNzICsgJyB1aS1idXR0b24tdGV4dC1vbmx5JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0eWxlQ2xhc3MgPSBzdHlsZUNsYXNzICsgJyB1aS1idXR0b24tdGV4dC1lbXB0eSc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzdHlsZUNsYXNzO1xuICAgIH1cbiAgICBcbiAgICBASW5wdXQoKSBnZXQgbGFiZWwoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhYmVsO1xuICAgIH1cblxuICAgIHNldCBsYWJlbCh2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9sYWJlbCA9IHZhbDtcbiAgICAgICAgXG4gICAgICAgIGlmKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICcudWktYnV0dG9uLXRleHQnKS50ZXh0Q29udGVudCA9IHRoaXMuX2xhYmVsO1xuXG4gICAgICAgICAgICBpZighdGhpcy5pY29uKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndWktYnV0dG9uLXRleHQtZW1wdHknKTtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd1aS1idXR0b24tdGV4dC1vbmx5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3VpLWJ1dHRvbi10ZXh0LWVtcHR5Jyk7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndWktYnV0dG9uLXRleHQtb25seScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBASW5wdXQoKSBnZXQgaWNvbigpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5faWNvbjtcbiAgICB9XG5cbiAgICBzZXQgaWNvbih2YWw6IHN0cmluZykge1xuICAgICAgICB0aGlzLl9pY29uID0gdmFsO1xuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgbGV0IGljb25Qb3NDbGFzcyA9ICh0aGlzLmljb25Qb3MgPT0gJ3JpZ2h0JykgPyAndWktYnV0dG9uLWljb24tcmlnaHQnOiAndWktYnV0dG9uLWljb24tbGVmdCc7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLnVpLWNsaWNrYWJsZScpLmNsYXNzTmFtZSA9XG4gICAgICAgICAgICAgICAgaWNvblBvc0NsYXNzICsgJyB1aS1jbGlja2FibGUgJyArIHRoaXMuaWNvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHdoaWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudC5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQubGFzdENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIH1cbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWJ1dHRvbicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGJ1dHRvbiBbYXR0ci50eXBlXT1cInR5cGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsndWktYnV0dG9uIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwnOnRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndWktYnV0dG9uLWljb24tb25seSc6IChpY29uICYmICFsYWJlbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAndWktYnV0dG9uLXRleHQtaWNvbi1sZWZ0JzogKGljb24gJiYgbGFiZWwgJiYgaWNvblBvcyA9PT0gJ2xlZnQnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd1aS1idXR0b24tdGV4dC1pY29uLXJpZ2h0JzogKGljb24gJiYgbGFiZWwgJiYgaWNvblBvcyA9PT0gJ3JpZ2h0JyksXG4gICAgICAgICAgICAgICAgICAgICAgICAndWktYnV0dG9uLXRleHQtb25seSc6ICghaWNvbiAmJiBsYWJlbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAndWktYnV0dG9uLXRleHQtZW1wdHknOiAoIWljb24gJiYgIWxhYmVsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICd1aS1zdGF0ZS1kaXNhYmxlZCc6IGRpc2FibGVkfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25DbGljay5lbWl0KCRldmVudClcIiAoZm9jdXMpPVwib25Gb2N1cy5lbWl0KCRldmVudClcIiAoYmx1cik9XCJvbkJsdXIuZW1pdCgkZXZlbnQpXCI+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8c3BhbiBbbmdDbGFzc109XCJ7J3VpLWNsaWNrYWJsZSc6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAndWktYnV0dG9uLWljb24tbGVmdCc6IChpY29uUG9zID09PSAnbGVmdCcpLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICd1aS1idXR0b24taWNvbi1yaWdodCc6IChpY29uUG9zID09PSAncmlnaHQnKX1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cImljb25cIiAqbmdJZj1cImljb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLWJ1dHRvbi10ZXh0IHVpLWNsaWNrYWJsZVwiPnt7bGFiZWx8fCd1aS1idG4nfX08L3NwYW4+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uIHtcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGljb25Qb3M6IHN0cmluZyA9ICdsZWZ0JztcblxuICAgIEBJbnB1dCgpIGljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBAT3V0cHV0KCkgb25DbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Gb2N1czogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CbHVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQnV0dG9uRGlyZWN0aXZlLEJ1dHRvbl0sXG4gICAgZGVjbGFyYXRpb25zOiBbQnV0dG9uRGlyZWN0aXZlLEJ1dHRvbl1cbn0pXG5leHBvcnQgY2xhc3MgQnV0dG9uTW9kdWxlIHsgfVxuIl19