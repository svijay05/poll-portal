var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Directive, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
var FocusTrap = /** @class */ (function () {
    function FocusTrap(el) {
        this.el = el;
    }
    FocusTrap.prototype.onkeydown = function (e) {
        if (e.which === 9) {
            e.preventDefault();
            var focusableElements = DomHandler.getFocusableElements(this.el.nativeElement);
            if (focusableElements && focusableElements.length > 0) {
                if (!document.activeElement) {
                    focusableElements[0].focus();
                }
                else {
                    var focusedIndex = focusableElements.indexOf(document.activeElement);
                    if (e.shiftKey) {
                        if (focusedIndex == -1 || focusedIndex === 0)
                            focusableElements[focusableElements.length - 1].focus();
                        else
                            focusableElements[focusedIndex - 1].focus();
                    }
                    else {
                        if (focusedIndex == -1 || focusedIndex === (focusableElements.length - 1))
                            focusableElements[0].focus();
                        else
                            focusableElements[focusedIndex + 1].focus();
                    }
                }
            }
        }
    };
    FocusTrap.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        HostListener('keydown', ['$event'])
    ], FocusTrap.prototype, "onkeydown", null);
    FocusTrap = __decorate([
        Directive({
            selector: '[pFocusTrap]',
        })
    ], FocusTrap);
    return FocusTrap;
}());
export { FocusTrap };
var FocusTrapModule = /** @class */ (function () {
    function FocusTrapModule() {
    }
    FocusTrapModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [FocusTrap],
            declarations: [FocusTrap]
        })
    ], FocusTrapModule);
    return FocusTrapModule;
}());
export { FocusTrapModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXN0cmFwLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9mb2N1c3RyYXAvIiwic291cmNlcyI6WyJmb2N1c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsVUFBVSxFQUFDLFlBQVksRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN6RSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUt2QztJQUVJLG1CQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtJQUFHLENBQUM7SUFHckMsNkJBQVMsR0FBVCxVQUFVLENBQUM7UUFDUCxJQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2QsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBRW5CLElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFL0UsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRTtvQkFDekIsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7aUJBQ2hDO3FCQUNJO29CQUNELElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBRXJFLElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTt3QkFDWixJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQzs0QkFDeEMsaUJBQWlCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDOzs0QkFFeEQsaUJBQWlCLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO3FCQUNuRDt5QkFDSTt3QkFDRCxJQUFJLFlBQVksSUFBSSxDQUFDLENBQUMsSUFBSSxZQUFZLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzRCQUNyRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs7NEJBRTdCLGlCQUFpQixDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDbkQ7aUJBQ0o7YUFDSjtTQUNKO0lBQ0wsQ0FBQzs7Z0JBL0JzQixVQUFVOztJQUdqQztRQURDLFlBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQzs4Q0E2Qm5DO0lBakNRLFNBQVM7UUFIckIsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLGNBQWM7U0FDM0IsQ0FBQztPQUNXLFNBQVMsQ0FrQ3JCO0lBQUQsZ0JBQUM7Q0FBQSxBQWxDRCxJQWtDQztTQWxDWSxTQUFTO0FBeUN0QjtJQUFBO0lBQStCLENBQUM7SUFBbkIsZUFBZTtRQUwzQixRQUFRLENBQUM7WUFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDdkIsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO1lBQ3BCLFlBQVksRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUM1QixDQUFDO09BQ1csZUFBZSxDQUFJO0lBQUQsc0JBQUM7Q0FBQSxBQUFoQyxJQUFnQztTQUFuQixlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxEaXJlY3RpdmUsRWxlbWVudFJlZixIb3N0TGlzdGVuZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEZvY3VzVHJhcF0nLFxufSlcbmV4cG9ydCBjbGFzcyBGb2N1c1RyYXAge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgQEhvc3RMaXN0ZW5lcigna2V5ZG93bicsIFsnJGV2ZW50J10pIFxuICAgIG9ua2V5ZG93bihlKSB7XG4gICAgICAgIGlmKGUud2hpY2ggPT09IDkpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gRG9tSGFuZGxlci5nZXRGb2N1c2FibGVFbGVtZW50cyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAgICAgICBpZiAoZm9jdXNhYmxlRWxlbWVudHMgJiYgZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGlmICghZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1swXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZvY3VzZWRJbmRleCA9IGZvY3VzYWJsZUVsZW1lbnRzLmluZGV4T2YoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSW5kZXggPT0gLTEgfHwgZm9jdXNlZEluZGV4ID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvY3VzYWJsZUVsZW1lbnRzW2ZvY3VzYWJsZUVsZW1lbnRzLmxlbmd0aCAtIDFdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbZm9jdXNlZEluZGV4IC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb2N1c2VkSW5kZXggPT0gLTEgfHwgZm9jdXNlZEluZGV4ID09PSAoZm9jdXNhYmxlRWxlbWVudHMubGVuZ3RoIC0gMSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9jdXNhYmxlRWxlbWVudHNbMF0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb2N1c2FibGVFbGVtZW50c1tmb2N1c2VkSW5kZXggKyAxXS5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtGb2N1c1RyYXBdLFxuICAgIGRlY2xhcmF0aW9uczogW0ZvY3VzVHJhcF1cbn0pXG5leHBvcnQgY2xhc3MgRm9jdXNUcmFwTW9kdWxlIHsgfSJdfQ==