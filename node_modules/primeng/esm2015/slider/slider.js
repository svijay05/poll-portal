var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, OnDestroy, Input, Output, EventEmitter, forwardRef, Renderer2, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomHandler } from 'primeng/dom';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
let Slider = class Slider {
    constructor(el, renderer, ngZone, cd) {
        this.el = el;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.cd = cd;
        this.min = 0;
        this.max = 100;
        this.orientation = 'horizontal';
        this.tabindex = 0;
        this.onChange = new EventEmitter();
        this.onSlideEnd = new EventEmitter();
        this.handleValues = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.handleIndex = 0;
    }
    onMouseDown(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        this.handleIndex = index;
        this.bindDragListeners();
        event.target.focus();
        event.preventDefault();
    }
    onTouchStart(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0];
        this.startHandleValue = (this.range) ? this.handleValues[index] : this.handleValue;
        this.dragging = true;
        this.handleIndex = index;
        if (this.orientation === 'horizontal') {
            this.startx = parseInt(touchobj.clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        }
        else {
            this.starty = parseInt(touchobj.clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }
        event.preventDefault();
    }
    onTouchMove(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0], handleValue = 0;
        if (this.orientation === 'horizontal') {
            handleValue = Math.floor(((parseInt(touchobj.clientX, 10) - this.startx) * 100) / (this.barWidth)) + this.startHandleValue;
        }
        else {
            handleValue = Math.floor(((this.starty - parseInt(touchobj.clientY, 10)) * 100) / (this.barHeight)) + this.startHandleValue;
        }
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    }
    onTouchEnd(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = false;
        if (this.range)
            this.onSlideEnd.emit({ originalEvent: event, values: this.values });
        else
            this.onSlideEnd.emit({ originalEvent: event, value: this.value });
        event.preventDefault();
    }
    onBarClick(event) {
        if (this.disabled) {
            return;
        }
        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
        }
        this.sliderHandleClick = false;
    }
    onHandleKeydown(event, handleIndex) {
        if (event.which == 38 || event.which == 39) {
            this.spin(event, 1, handleIndex);
        }
        else if (event.which == 37 || event.which == 40) {
            this.spin(event, -1, handleIndex);
        }
    }
    spin(event, dir, handleIndex) {
        let step = (this.step || 1) * dir;
        if (this.range) {
            this.handleIndex = handleIndex;
            this.updateValue(this.values[this.handleIndex] + step);
            this.updateHandleValue();
        }
        else {
            this.updateValue(this.value + step);
            this.updateHandleValue();
        }
        event.preventDefault();
    }
    handleChange(event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }
    bindDragListeners() {
        this.ngZone.runOutsideAngular(() => {
            if (!this.dragListener) {
                this.dragListener = this.renderer.listen('document', 'mousemove', (event) => {
                    if (this.dragging) {
                        this.ngZone.run(() => {
                            this.handleChange(event);
                        });
                    }
                });
            }
            if (!this.mouseupListener) {
                this.mouseupListener = this.renderer.listen('document', 'mouseup', (event) => {
                    if (this.dragging) {
                        this.dragging = false;
                        this.ngZone.run(() => {
                            if (this.range) {
                                this.onSlideEnd.emit({ originalEvent: event, values: this.values });
                            }
                            else {
                                this.onSlideEnd.emit({ originalEvent: event, value: this.value });
                            }
                        });
                    }
                });
            }
        });
    }
    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
        }
        if (this.mouseupListener) {
            this.mouseupListener();
        }
    }
    setValueFromHandle(event, handleValue) {
        let newValue = this.getValueFromHandle(handleValue);
        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, this.values[this.handleIndex]);
            }
            else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        }
        else {
            if (this.step) {
                this.handleStepChange(newValue, this.value);
            }
            else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }
    }
    handleStepChange(newValue, oldValue) {
        let diff = (newValue - oldValue);
        let val = oldValue;
        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / this.step - oldValue / this.step) * this.step;
        }
        else if (diff > 0) {
            val = oldValue + Math.floor(newValue / this.step - oldValue / this.step) * this.step;
        }
        this.updateValue(val);
        this.updateHandleValue();
    }
    writeValue(value) {
        if (this.range)
            this.values = value || [0, 0];
        else
            this.value = value || 0;
        this.updateHandleValue();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
    }
    get rangeStartLeft() {
        return this.isVertical() ? 'auto' : this.handleValues[0] + '%';
    }
    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }
    get rangeEndLeft() {
        return this.isVertical() ? 'auto' : this.handleValues[1] + '%';
    }
    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    updateDomData() {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }
    calculateHandleValue(event) {
        if (this.orientation === 'horizontal')
            return ((event.pageX - this.initX) * 100) / (this.barWidth);
        else
            return (((this.initY + this.barHeight) - event.pageY) * 100) / (this.barHeight);
    }
    updateHandleValue() {
        if (this.range) {
            this.handleValues[0] = (this.values[0] < this.min ? 0 : this.values[0] - this.min) * 100 / (this.max - this.min);
            this.handleValues[1] = (this.values[1] > this.max ? 100 : this.values[1] - this.min) * 100 / (this.max - this.min);
        }
        else {
            if (this.value < this.min)
                this.handleValue = 0;
            else if (this.value > this.max)
                this.handleValue = 100;
            else
                this.handleValue = (this.value - this.min) * 100 / (this.max - this.min);
        }
    }
    updateValue(val, event) {
        if (this.range) {
            let value = val;
            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                }
                else if (value > this.values[1]) {
                    value = this.values[1];
                    this.handleValues[0] = this.handleValues[1];
                }
                this.sliderHandleStart.nativeElement.focus();
            }
            else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                }
                else if (value < this.values[0]) {
                    value = this.values[0];
                    this.handleValues[1] = this.handleValues[0];
                }
                this.sliderHandleEnd.nativeElement.focus();
            }
            this.values[this.handleIndex] = this.getNormalizedValue(value);
            this.onModelChange(this.values);
            this.onChange.emit({ event: event, values: this.values });
        }
        else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            }
            else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }
            this.value = this.getNormalizedValue(val);
            this.onModelChange(this.value);
            this.onChange.emit({ event: event, value: this.value });
            this.sliderHandle.nativeElement.focus();
        }
    }
    getValueFromHandle(handleValue) {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }
    getDecimalsCount(value) {
        if (value && Math.floor(value) !== value)
            return value.toString().split(".")[1].length || 0;
        return 0;
    }
    getNormalizedValue(val) {
        let decimalsCount = this.getDecimalsCount(this.step);
        if (decimalsCount > 0) {
            return +val.toFixed(decimalsCount);
        }
        else {
            return Math.floor(val);
        }
    }
    ngOnDestroy() {
        this.unbindDragListeners();
    }
};
Slider.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
__decorate([
    Input()
], Slider.prototype, "animate", void 0);
__decorate([
    Input()
], Slider.prototype, "disabled", void 0);
__decorate([
    Input()
], Slider.prototype, "min", void 0);
__decorate([
    Input()
], Slider.prototype, "max", void 0);
__decorate([
    Input()
], Slider.prototype, "orientation", void 0);
__decorate([
    Input()
], Slider.prototype, "step", void 0);
__decorate([
    Input()
], Slider.prototype, "range", void 0);
__decorate([
    Input()
], Slider.prototype, "style", void 0);
__decorate([
    Input()
], Slider.prototype, "styleClass", void 0);
__decorate([
    Input()
], Slider.prototype, "ariaLabelledBy", void 0);
__decorate([
    Input()
], Slider.prototype, "tabindex", void 0);
__decorate([
    Output()
], Slider.prototype, "onChange", void 0);
__decorate([
    Output()
], Slider.prototype, "onSlideEnd", void 0);
__decorate([
    ViewChild("sliderHandle", { static: false })
], Slider.prototype, "sliderHandle", void 0);
__decorate([
    ViewChild("sliderHandleStart", { static: false })
], Slider.prototype, "sliderHandleStart", void 0);
__decorate([
    ViewChild("sliderHandleEnd", { static: false })
], Slider.prototype, "sliderHandleEnd", void 0);
Slider = __decorate([
    Component({
        selector: 'p-slider',
        template: `
        <div [ngStyle]="style" [class]="styleClass" [ngClass]="{'ui-slider ui-widget ui-widget-content ui-corner-all':true,'ui-state-disabled':disabled,
            'ui-slider-horizontal':orientation == 'horizontal','ui-slider-vertical':orientation == 'vertical','ui-slider-animate':animate}"
            (click)="onBarClick($event)">
            <span *ngIf="range && orientation == 'horizontal'" class="ui-slider-range ui-widget-header ui-corner-all" [ngStyle]="{'left':handleValues[0] + '%',width: (handleValues[1] - handleValues[0] + '%')}"></span>
            <span *ngIf="range && orientation == 'vertical'" class="ui-slider-range ui-widget-header ui-corner-all" [ngStyle]="{'bottom':handleValues[0] + '%',height: (handleValues[1] - handleValues[0] + '%')}"></span>
            <span *ngIf="!range && orientation=='vertical'" class="ui-slider-range ui-slider-range-min ui-widget-header ui-corner-all" [ngStyle]="{'height': handleValue + '%'}"></span>
            <span *ngIf="!range && orientation=='horizontal'" class="ui-slider-range ui-slider-range-min ui-widget-header ui-corner-all" [ngStyle]="{'width': handleValue + '%'}"></span>
            <span #sliderHandle *ngIf="!range" [attr.tabindex]="tabindex" (keydown)="onHandleKeydown($event)" class="ui-slider-handle ui-state-default ui-corner-all ui-clickable" (mousedown)="onMouseDown($event)" (touchstart)="onTouchStart($event)" (touchmove)="onTouchMove($event)" (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none': null" [ngStyle]="{'left': orientation == 'horizontal' ? handleValue + '%' : null,'bottom': orientation == 'vertical' ? handleValue + '%' : null}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleStart *ngIf="range" [attr.tabindex]="tabindex" (keydown)="onHandleKeydown($event,0)" (mousedown)="onMouseDown($event,0)" (touchstart)="onTouchStart($event,0)" (touchmove)="onTouchMove($event,0)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="ui-slider-handle ui-state-default ui-corner-all ui-clickable" 
                [ngStyle]="{'left': rangeStartLeft, 'bottom': rangeStartBottom}" [ngClass]="{'ui-slider-handle-active':handleIndex==0}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[0] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
            <span #sliderHandleEnd *ngIf="range" [attr.tabindex]="tabindex" (keydown)="onHandleKeydown($event,1)" (mousedown)="onMouseDown($event,1)" (touchstart)="onTouchStart($event,1)" (touchmove)="onTouchMove($event,1)" (touchend)="onTouchEnd($event)" [style.transition]="dragging ? 'none': null" class="ui-slider-handle ui-state-default ui-corner-all ui-clickable" 
                [ngStyle]="{'left': rangeEndLeft, 'bottom': rangeEndBottom}" [ngClass]="{'ui-slider-handle-active':handleIndex==1}"
                [attr.aria-valuemin]="min" [attr.aria-valuenow]="value ? value[1] : null" [attr.aria-valuemax]="max" [attr.aria-labelledby]="ariaLabelledBy"></span>
        </div>
    `,
        providers: [SLIDER_VALUE_ACCESSOR]
    })
], Slider);
export { Slider };
let SliderModule = class SliderModule {
};
SliderModule = __decorate([
    NgModule({
        imports: [CommonModule],
        exports: [Slider],
        declarations: [Slider]
    })
], SliderModule);
export { SliderModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9zbGlkZXIvIiwic291cmNlcyI6WyJzbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLE1BQU0sRUFBQyxpQkFBaUIsRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakssT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFDLGlCQUFpQixFQUF1QixNQUFNLGdCQUFnQixDQUFDO0FBRXZFLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3hDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDckMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDO0FBeUJGLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU07SUFzRWYsWUFBbUIsRUFBYyxFQUFTLFFBQW1CLEVBQVUsTUFBYyxFQUFTLEVBQXFCO1FBQWhHLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBaEUxRyxRQUFHLEdBQVcsQ0FBQyxDQUFDO1FBRWhCLFFBQUcsR0FBVyxHQUFHLENBQUM7UUFFbEIsZ0JBQVcsR0FBVyxZQUFZLENBQUM7UUFZbkMsYUFBUSxHQUFXLENBQUMsQ0FBQztRQUVwQixhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsZUFBVSxHQUFzQixJQUFJLFlBQVksRUFBRSxD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Y2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIE9uRGVzdHJveSwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBmb3J3YXJkUmVmLCBSZW5kZXJlcjIsTmdab25lLENoYW5nZURldGVjdG9yUmVmLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbUhhbmRsZXJ9IGZyb20gJ3ByaW1lbmcvZG9tJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmV4cG9ydCBjb25zdCBTTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWRlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2xpZGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdDbGFzc109XCJ7J3VpLXNsaWRlciB1aS13aWRnZXQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbCc6dHJ1ZSwndWktc3RhdGUtZGlzYWJsZWQnOmRpc2FibGVkLFxuICAgICAgICAgICAgJ3VpLXNsaWRlci1ob3Jpem9udGFsJzpvcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcsJ3VpLXNsaWRlci12ZXJ0aWNhbCc6b3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJywndWktc2xpZGVyLWFuaW1hdGUnOmFuaW1hdGV9XCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbkJhckNsaWNrKCRldmVudClcIj5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwicmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnXCIgY2xhc3M9XCJ1aS1zbGlkZXItcmFuZ2UgdWktd2lkZ2V0LWhlYWRlciB1aS1jb3JuZXItYWxsXCIgW25nU3R5bGVdPVwieydsZWZ0JzpoYW5kbGVWYWx1ZXNbMF0gKyAnJScsd2lkdGg6IChoYW5kbGVWYWx1ZXNbMV0gLSBoYW5kbGVWYWx1ZXNbMF0gKyAnJScpfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwicmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJ1wiIGNsYXNzPVwidWktc2xpZGVyLXJhbmdlIHVpLXdpZGdldC1oZWFkZXIgdWktY29ybmVyLWFsbFwiIFtuZ1N0eWxlXT1cInsnYm90dG9tJzpoYW5kbGVWYWx1ZXNbMF0gKyAnJScsaGVpZ2h0OiAoaGFuZGxlVmFsdWVzWzFdIC0gaGFuZGxlVmFsdWVzWzBdICsgJyUnKX1cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFyYW5nZSAmJiBvcmllbnRhdGlvbj09J3ZlcnRpY2FsJ1wiIGNsYXNzPVwidWktc2xpZGVyLXJhbmdlIHVpLXNsaWRlci1yYW5nZS1taW4gdWktd2lkZ2V0LWhlYWRlciB1aS1jb3JuZXItYWxsXCIgW25nU3R5bGVdPVwieydoZWlnaHQnOiBoYW5kbGVWYWx1ZSArICclJ31cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFyYW5nZSAmJiBvcmllbnRhdGlvbj09J2hvcml6b250YWwnXCIgY2xhc3M9XCJ1aS1zbGlkZXItcmFuZ2UgdWktc2xpZGVyLXJhbmdlLW1pbiB1aS13aWRnZXQtaGVhZGVyIHVpLWNvcm5lci1hbGxcIiBbbmdTdHlsZV09XCJ7J3dpZHRoJzogaGFuZGxlVmFsdWUgKyAnJSd9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gI3NsaWRlckhhbmRsZSAqbmdJZj1cIiFyYW5nZVwiIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCIgKGtleWRvd24pPVwib25IYW5kbGVLZXlkb3duKCRldmVudClcIiBjbGFzcz1cInVpLXNsaWRlci1oYW5kbGUgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIHVpLWNsaWNrYWJsZVwiIChtb3VzZWRvd24pPVwib25Nb3VzZURvd24oJGV2ZW50KVwiICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQpXCIgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQpXCIgKHRvdWNoZW5kKT1cIm9uVG91Y2hFbmQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgW3N0eWxlLnRyYW5zaXRpb25dPVwiZHJhZ2dpbmcgPyAnbm9uZSc6IG51bGxcIiBbbmdTdHlsZV09XCJ7J2xlZnQnOiBvcmllbnRhdGlvbiA9PSAnaG9yaXpvbnRhbCcgPyBoYW5kbGVWYWx1ZSArICclJyA6IG51bGwsJ2JvdHRvbSc6IG9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgPyBoYW5kbGVWYWx1ZSArICclJyA6IG51bGx9XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWluXT1cIm1pblwiIFthdHRyLmFyaWEtdmFsdWVub3ddPVwidmFsdWVcIiBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuICNzbGlkZXJIYW5kbGVTdGFydCAqbmdJZj1cInJhbmdlXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIiAoa2V5ZG93bik9XCJvbkhhbmRsZUtleWRvd24oJGV2ZW50LDApXCIgKG1vdXNlZG93bik9XCJvbk1vdXNlRG93bigkZXZlbnQsMClcIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50LDApXCIgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQsMClcIiAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCIgW3N0eWxlLnRyYW5zaXRpb25dPVwiZHJhZ2dpbmcgPyAnbm9uZSc6IG51bGxcIiBjbGFzcz1cInVpLXNsaWRlci1oYW5kbGUgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIHVpLWNsaWNrYWJsZVwiIFxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsnbGVmdCc6IHJhbmdlU3RhcnRMZWZ0LCAnYm90dG9tJzogcmFuZ2VTdGFydEJvdHRvbX1cIiBbbmdDbGFzc109XCJ7J3VpLXNsaWRlci1oYW5kbGUtYWN0aXZlJzpoYW5kbGVJbmRleD09MH1cIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCIgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJ2YWx1ZSA/IHZhbHVlWzBdIDogbnVsbFwiIFthdHRyLmFyaWEtdmFsdWVtYXhdPVwibWF4XCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gI3NsaWRlckhhbmRsZUVuZCAqbmdJZj1cInJhbmdlXCIgW2F0dHIudGFiaW5kZXhdPVwidGFiaW5kZXhcIiAoa2V5ZG93bik9XCJvbkhhbmRsZUtleWRvd24oJGV2ZW50LDEpXCIgKG1vdXNlZG93bik9XCJvbk1vdXNlRG93bigkZXZlbnQsMSlcIiAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50LDEpXCIgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQsMSlcIiAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCIgW3N0eWxlLnRyYW5zaXRpb25dPVwiZHJhZ2dpbmcgPyAnbm9uZSc6IG51bGxcIiBjbGFzcz1cInVpLXNsaWRlci1oYW5kbGUgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsIHVpLWNsaWNrYWJsZVwiIFxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsnbGVmdCc6IHJhbmdlRW5kTGVmdCwgJ2JvdHRvbSc6IHJhbmdlRW5kQm90dG9tfVwiIFtuZ0NsYXNzXT1cInsndWktc2xpZGVyLWhhbmRsZS1hY3RpdmUnOmhhbmRsZUluZGV4PT0xfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJtaW5cIiBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMV0gOiBudWxsXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIj48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbU0xJREVSX1ZBTFVFX0FDQ0VTU09SXVxufSlcbmV4cG9ydCBjbGFzcyBTbGlkZXIgaW1wbGVtZW50cyBPbkRlc3Ryb3ksQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuXG4gICAgQElucHV0KCkgYW5pbWF0ZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgICBASW5wdXQoKSBvcmllbnRhdGlvbjogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuXG4gICAgQElucHV0KCkgc3RlcDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcmFuZ2U6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25TbGlkZUVuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgXG4gICAgQFZpZXdDaGlsZChcInNsaWRlckhhbmRsZVwiLCB7c3RhdGljOiBmYWxzZX0pIHNsaWRlckhhbmRsZTogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoXCJzbGlkZXJIYW5kbGVTdGFydFwiLCB7c3RhdGljOiBmYWxzZX0pIHNsaWRlckhhbmRsZVN0YXJ0OiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZChcInNsaWRlckhhbmRsZUVuZFwiLCB7c3RhdGljOiBmYWxzZX0pIHNsaWRlckhhbmRsZUVuZDogRWxlbWVudFJlZjtcblxuICAgIHB1YmxpYyB2YWx1ZTogbnVtYmVyO1xuICAgIFxuICAgIHB1YmxpYyB2YWx1ZXM6IG51bWJlcltdO1xuICAgIFxuICAgIHB1YmxpYyBoYW5kbGVWYWx1ZTogbnVtYmVyO1xuICAgIFxuICAgIHB1YmxpYyBoYW5kbGVWYWx1ZXM6IG51bWJlcltdID0gW107XG4gICAgICAgIFxuICAgIHB1YmxpYyBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuICAgIFxuICAgIHB1YmxpYyBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcbiAgICBcbiAgICBwdWJsaWMgZHJhZ2dpbmc6IGJvb2xlYW47XG4gICAgXG4gICAgcHVibGljIGRyYWdMaXN0ZW5lcjogYW55O1xuICAgIFxuICAgIHB1YmxpYyBtb3VzZXVwTGlzdGVuZXI6IGFueTtcbiAgICAgICAgXG4gICAgcHVibGljIGluaXRYOiBudW1iZXI7XG4gICAgXG4gICAgcHVibGljIGluaXRZOiBudW1iZXI7XG4gICAgXG4gICAgcHVibGljIGJhcldpZHRoOiBudW1iZXI7XG4gICAgXG4gICAgcHVibGljIGJhckhlaWdodDogbnVtYmVyO1xuICAgIFxuICAgIHB1YmxpYyBzbGlkZXJIYW5kbGVDbGljazogYm9vbGVhbjtcbiAgICBcbiAgICBwdWJsaWMgaGFuZGxlSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgc3RhcnRIYW5kbGVWYWx1ZTogYW55O1xuXG4gICAgcHVibGljIHN0YXJ0eDogbnVtYmVyO1xuXG4gICAgcHVibGljIHN0YXJ0eTogbnVtYmVyO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG4gICAgXG4gICAgb25Nb3VzZURvd24oZXZlbnQsIGluZGV4PzpudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVEb21EYXRhKCk7XG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlQ2xpY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gaW5kZXg7XG4gICAgICAgIHRoaXMuYmluZERyYWdMaXN0ZW5lcnMoKTtcbiAgICAgICAgZXZlbnQudGFyZ2V0LmZvY3VzKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50LCBpbmRleD86bnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b3VjaG9iaiA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgICAgICB0aGlzLnN0YXJ0SGFuZGxlVmFsdWUgPSAodGhpcy5yYW5nZSkgPyB0aGlzLmhhbmRsZVZhbHVlc1tpbmRleF0gOiB0aGlzLmhhbmRsZVZhbHVlO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5oYW5kbGVJbmRleCA9IGluZGV4O1xuXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR4ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR5ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvblRvdWNoTW92ZShldmVudCwgaW5kZXg/Om51bWJlcikge1xuICAgICAgICBpZih0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHZhciB0b3VjaG9iaiA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzWzBdLFxuICAgICAgICBoYW5kbGVWYWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgocGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCwgMTApIC0gdGhpcy5zdGFydHgpICogMTAwKSAvICh0aGlzLmJhcldpZHRoKSkgKyB0aGlzLnN0YXJ0SGFuZGxlVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoYW5kbGVWYWx1ZSA9IE1hdGguZmxvb3IoKCh0aGlzLnN0YXJ0eSAtIHBhcnNlSW50KHRvdWNob2JqLmNsaWVudFksIDEwKSkgKiAxMDApIC8gKHRoaXMuYmFySGVpZ2h0KSkgICsgdGhpcy5zdGFydEhhbmRsZVZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQsIGhhbmRsZVZhbHVlKTtcblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uVG91Y2hFbmQoZXZlbnQsIGluZGV4PzpudW1iZXIpIHtcbiAgICAgICAgaWYodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICB0aGlzLm9uU2xpZGVFbmQuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXN9KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5vblNsaWRlRW5kLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuICAgICAgICBcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgXG4gICAgb25CYXJDbGljayhldmVudCkge1xuICAgICAgICBpZih0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmKCF0aGlzLnNsaWRlckhhbmRsZUNsaWNrKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURvbURhdGEoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVDbGljayA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSGFuZGxlS2V5ZG93bihldmVudCwgaGFuZGxlSW5kZXg/Om51bWJlcikge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMzggfHwgZXZlbnQud2hpY2ggPT0gMzkpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbihldmVudCwgMSwgaGFuZGxlSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2ZW50LndoaWNoID09IDM3IHx8IGV2ZW50LndoaWNoID09IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW4oZXZlbnQsIC0xLCBoYW5kbGVJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgc3BpbihldmVudCwgZGlyOiBudW1iZXIsIGhhbmRsZUluZGV4PzpudW1iZXIpIHtcbiAgICAgICAgbGV0IHN0ZXAgPSAodGhpcy5zdGVwIHx8IDEpICogZGlyO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gaGFuZGxlSW5kZXg7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMudmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdICsgc3RlcCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZVZhbHVlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMudmFsdWUgKyBzdGVwKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBsZXQgaGFuZGxlVmFsdWUgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVZhbHVlKGV2ZW50KTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQsIGhhbmRsZVZhbHVlKTtcbiAgICB9XG4gICAgXG4gICAgYmluZERyYWdMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdtb3VzZW1vdmUnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF0aGlzLm1vdXNldXBMaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2V1cExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4oJ2RvY3VtZW50JywgJ21vdXNldXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNsaWRlRW5kLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZXM6IHRoaXMudmFsdWVzfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNsaWRlRW5kLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZX0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB1bmJpbmREcmFnTGlzdGVuZXJzKCkge1xuICAgICAgICBpZih0aGlzLmRyYWdMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5kcmFnTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYodGhpcy5tb3VzZXVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW91c2V1cExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQ6IEV2ZW50LCBoYW5kbGVWYWx1ZTogYW55KSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMuZ2V0VmFsdWVGcm9tSGFuZGxlKGhhbmRsZVZhbHVlKTtcblxuICAgICAgICBpZih0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBpZih0aGlzLnN0ZXApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVN0ZXBDaGFuZ2UobmV3VmFsdWUsIHRoaXMudmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdID0gaGFuZGxlVmFsdWU7ICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgICAgICAgICAgICBcbiAgICAgICAgICAgIGlmKHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3RlcENoYW5nZShuZXdWYWx1ZSwgdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IGhhbmRsZVZhbHVlO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUobmV3VmFsdWUsIGV2ZW50KTtcbiAgICAgICAgICAgIH0gICAgICAgICBcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBoYW5kbGVTdGVwQ2hhbmdlKG5ld1ZhbHVlOiBudW1iZXIsIG9sZFZhbHVlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IGRpZmYgPSAobmV3VmFsdWUgLSBvbGRWYWx1ZSk7XG4gICAgICAgIGxldCB2YWwgPSBvbGRWYWx1ZTtcbiAgICAgICAgXG4gICAgICAgIGlmKGRpZmYgPCAwKSB7XG4gICAgICAgICAgICB2YWwgPSBvbGRWYWx1ZSArIE1hdGguY2VpbChuZXdWYWx1ZSAvIHRoaXMuc3RlcCAtIG9sZFZhbHVlIC8gdGhpcy5zdGVwKSAqIHRoaXMuc3RlcDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICB2YWwgPSBvbGRWYWx1ZSArIE1hdGguZmxvb3IobmV3VmFsdWUgLyB0aGlzLnN0ZXAgLSBvbGRWYWx1ZSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlVmFsdWUodmFsKTtcbiAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVWYWx1ZSgpO1xuICAgIH1cbiAgICBcbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIGlmKHRoaXMucmFuZ2UpXG4gICAgICAgICAgICB0aGlzLnZhbHVlcyA9IHZhbHVlfHxbMCwwXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlfHwwO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVWYWx1ZSgpO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgICBcbiAgICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UgPSBmbjtcbiAgICB9XG5cbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCA9IGZuO1xuICAgIH1cbiAgICBcbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuZ2VTdGFydExlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmVydGljYWwoKSA/ICdhdXRvJyA6IHRoaXMuaGFuZGxlVmFsdWVzWzBdICsgJyUnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuZ2VTdGFydEJvdHRvbSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaXNWZXJ0aWNhbCgpID8gdGhpcy5oYW5kbGVWYWx1ZXNbMF0gKyAnJScgOiAnYXV0byc7XG4gICAgfVxuICAgIFxuICAgIGdldCByYW5nZUVuZExlZnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmVydGljYWwoKSA/ICdhdXRvJyA6IHRoaXMuaGFuZGxlVmFsdWVzWzFdICsgJyUnO1xuICAgIH1cbiAgICBcbiAgICBnZXQgcmFuZ2VFbmRCb3R0b20oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzVmVydGljYWwoKSA/IHRoaXMuaGFuZGxlVmFsdWVzWzFdICsgJyUnIDogJ2F1dG8nO1xuICAgIH1cbiAgICBcbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG4gICAgXG4gICAgdXBkYXRlRG9tRGF0YSgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHJlY3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMuaW5pdFggPSByZWN0LmxlZnQgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgdGhpcy5pbml0WSA9IHJlY3QudG9wICsgRG9tSGFuZGxlci5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgIH1cbiAgICBcbiAgICBjYWxjdWxhdGVIYW5kbGVWYWx1ZShldmVudCk6IG51bWJlciB7XG4gICAgICAgIGlmKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJylcbiAgICAgICAgICAgIHJldHVybiAoKGV2ZW50LnBhZ2VYIC0gdGhpcy5pbml0WCkgKiAxMDApIC8gKHRoaXMuYmFyV2lkdGgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4oKCh0aGlzLmluaXRZICsgdGhpcy5iYXJIZWlnaHQpIC0gZXZlbnQucGFnZVkpICogMTAwKSAvICh0aGlzLmJhckhlaWdodCk7XG4gICAgfVxuICAgIFxuICAgIHVwZGF0ZUhhbmRsZVZhbHVlKCk6IHZvaWQge1xuICAgICAgICBpZih0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1swXSA9ICh0aGlzLnZhbHVlc1swXSA8IHRoaXMubWluID8gMCA6IHRoaXMudmFsdWVzWzBdIC0gdGhpcy5taW4pICogMTAwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSAodGhpcy52YWx1ZXNbMV0gPiB0aGlzLm1heCA/IDEwMCA6IHRoaXMudmFsdWVzWzFdIC0gdGhpcy5taW4pICogMTAwIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy52YWx1ZSA8IHRoaXMubWluKVxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSAwO1xuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnZhbHVlID4gdGhpcy5tYXgpXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IDEwMDtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gKHRoaXMudmFsdWUgLSB0aGlzLm1pbikgKiAxMDAgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdXBkYXRlVmFsdWUodmFsOiBudW1iZXIsIGV2ZW50PzogRXZlbnQpOiB2b2lkIHtcbiAgICAgICAgaWYodGhpcy5yYW5nZSkge1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gdmFsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLmhhbmRsZUluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZSA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzBdID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPiB0aGlzLnZhbHVlc1sxXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1swXSA9IHRoaXMuaGFuZGxlVmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlU3RhcnQubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1sxXSA9IDEwMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodmFsdWUgPCB0aGlzLnZhbHVlc1swXSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudmFsdWVzWzBdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1sxXSA9IHRoaXMuaGFuZGxlVmFsdWVzWzBdO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlRW5kLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy52YWx1ZXNbdGhpcy5oYW5kbGVJbmRleF0gPSB0aGlzLmdldE5vcm1hbGl6ZWRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZXMpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtldmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXN9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKHZhbCA8IHRoaXMubWluKSB7XG4gICAgICAgICAgICAgICAgdmFsID0gdGhpcy5taW47XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh2YWwgPiB0aGlzLm1heCkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSAxMDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcblx0XHRcdHRoaXMudmFsdWUgPSB0aGlzLmdldE5vcm1hbGl6ZWRWYWx1ZSh2YWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe2V2ZW50OiBldmVudCwgdmFsdWU6IHRoaXMudmFsdWV9KTtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgICAgIFxuICAgIGdldFZhbHVlRnJvbUhhbmRsZShoYW5kbGVWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm1heCAtIHRoaXMubWluKSAqIChoYW5kbGVWYWx1ZSAvIDEwMCkgKyB0aGlzLm1pbjtcbiAgICB9XG5cdFxuXHRnZXREZWNpbWFsc0NvdW50KHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuXHRcdGlmICh2YWx1ZSAmJiBNYXRoLmZsb29yKHZhbHVlKSAhPT0gdmFsdWUpXG5cdFx0XHRyZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5zcGxpdChcIi5cIilbMV0ubGVuZ3RoIHx8IDA7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0XG5cdGdldE5vcm1hbGl6ZWRWYWx1ZSh2YWw6IG51bWJlcik6IG51bWJlciB7XG5cdFx0bGV0IGRlY2ltYWxzQ291bnQgPSB0aGlzLmdldERlY2ltYWxzQ291bnQodGhpcy5zdGVwKTtcblx0XHRpZiAoZGVjaW1hbHNDb3VudCA+IDApIHtcblx0XHRcdHJldHVybiArdmFsLnRvRml4ZWQoZGVjaW1hbHNDb3VudCk7XG5cdFx0fSBcblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiBNYXRoLmZsb29yKHZhbCk7XG5cdFx0fVxuXHR9XG4gICAgXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRHJhZ0xpc3RlbmVycygpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2xpZGVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTbGlkZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlck1vZHVsZSB7IH1cbiJdfQ==