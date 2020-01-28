var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ViewChild, ElementRef, AfterViewChecked, AfterContentInit, OnDestroy, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, Renderer2, forwardRef, ChangeDetectorRef, IterableDiffers } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils, UniqueComponentId } from 'primeng/utils';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
export const AUTOCOMPLETE_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AutoComplete),
    multi: true
};
let AutoComplete = class AutoComplete {
    constructor(el, renderer, cd, differs) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.differs = differs;
        this.minLength = 1;
        this.delay = 300;
        this.type = 'text';
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.dropdownIcon = "pi pi-caret-down";
        this.unique = true;
        this.completeMethod = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onUnselect = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onDropdownClick = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onKeyUp = new EventEmitter();
        this.scrollHeight = '200px';
        this.dropdownMode = 'blank';
        this.showTransitionOptions = '225ms ease-out';
        this.hideTransitionOptions = '195ms ease-in';
        this.autocomplete = 'off';
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.overlayVisible = false;
        this.focus = false;
        this.inputFieldValue = null;
        this.differ = differs.find([]).create(null);
        this.listId = UniqueComponentId() + '_list';
    }
    get suggestions() {
        return this._suggestions;
    }
    set suggestions(val) {
        this._suggestions = val;
        this.handleSuggestionsChange();
    }
    ngAfterViewChecked() {
        //Use timeouts as since Angular 4.2, AfterViewChecked is broken and not called after panel is updated
        if (this.suggestionsUpdated && this.overlay && this.overlay.offsetParent) {
            setTimeout(() => {
                if (this.overlay) {
                    this.alignOverlay();
                }
            }, 1);
            this.suggestionsUpdated = false;
        }
        if (this.highlightOptionChanged) {
            setTimeout(() => {
                if (this.overlay) {
                    let listItem = DomHandler.findSingle(this.overlay, 'li.ui-state-highlight');
                    if (listItem) {
                        DomHandler.scrollInView(this.overlay, listItem);
                    }
                }
            }, 1);
            this.highlightOptionChanged = false;
        }
    }
    handleSuggestionsChange() {
        if (this._suggestions != null && this.loading) {
            this.highlightOption = null;
            if (this._suggestions.length) {
                this.noResults = false;
                this.show();
                this.suggestionsUpdated = true;
                if (this.autoHighlight) {
                    this.highlightOption = this._suggestions[0];
                }
            }
            else {
                this.noResults = true;
                if (this.emptyMessage) {
                    this.show();
                    this.suggestionsUpdated = true;
                }
                else {
                    this.hide();
                }
            }
            this.loading = false;
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'selectedItem':
                    this.selectedItemTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    writeValue(value) {
        this.value = value;
        this.filled = this.value && this.value != '';
        this.updateInputField();
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
    onInput(event) {
        // When an input element with a placeholder is clicked, the onInput event is invoked in IE.
        if (!this.inputKeyDown && DomHandler.isIE()) {
            return;
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        let value = event.target.value;
        if (!this.multiple && !this.forceSelection) {
            this.onModelChange(value);
        }
        if (value.length === 0 && !this.multiple) {
            this.hide();
            this.onClear.emit(event);
            this.onModelChange(value);
        }
        if (value.length >= this.minLength) {
            this.timeout = setTimeout(() => {
                this.search(event, value);
            }, this.delay);
        }
        else {
            this.suggestions = null;
            this.hide();
        }
        this.updateFilledState();
        this.inputKeyDown = false;
    }
    onInputClick(event) {
        if (this.documentClickListener) {
            this.inputClick = true;
        }
    }
    search(event, query) {
        //allow empty string but not undefined or null
        if (query === undefined || query === null) {
            return;
        }
        this.loading = true;
        this.completeMethod.emit({
            originalEvent: event,
            query: query
        });
    }
    selectItem(option, focus = true) {
        if (this.forceSelectionUpdateModelTimeout) {
            clearTimeout(this.forceSelectionUpdateModelTimeout);
            this.forceSelectionUpdateModelTimeout = null;
        }
        if (this.multiple) {
            this.multiInputEL.nativeElement.value = '';
            this.value = this.value || [];
            if (!this.isSelected(option) || !this.unique) {
                this.value = [...this.value, option];
                this.onModelChange(this.value);
            }
        }
        else {
            this.inputEL.nativeElement.value = this.field ? ObjectUtils.resolveFieldData(option, this.field) || '' : option;
            this.value = option;
            this.onModelChange(this.value);
        }
        this.onSelect.emit(option);
        this.updateFilledState();
        if (focus) {
            this.focusInput();
        }
    }
    show() {
        if (this.multiInputEL || this.inputEL) {
            let hasFocus = this.multiple ? document.activeElement == this.multiInputEL.nativeElement : document.activeElement == this.inputEL.nativeElement;
            if (!this.overlayVisible && hasFocus) {
                this.overlayVisible = true;
            }
        }
    }
    onOverlayAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.overlay = event.element;
                this.appendOverlay();
                if (this.autoZIndex) {
                    this.overlay.style.zIndex = String(this.baseZIndex + (++DomHandler.zindex));
                }
                this.alignOverlay();
                this.bindDocumentClickListener();
                this.bindDocumentResizeListener();
                break;
            case 'void':
                this.onOverlayHide();
                break;
        }
    }
    onOverlayAnimationDone(event) {
        if (event.toState === 'void') {
            this._suggestions = null;
        }
    }
    appendOverlay() {
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.overlay);
            else
                DomHandler.appendChild(this.overlay, this.appendTo);
            this.overlay.style.minWidth = DomHandler.getWidth(this.el.nativeElement.children[0]) + 'px';
        }
    }
    resolveFieldData(value) {
        return this.field ? ObjectUtils.resolveFieldData(value, this.field) : value;
    }
    restoreOverlayAppend() {
        if (this.overlay && this.appendTo) {
            this.el.nativeElement.appendChild(this.overlay);
        }
    }
    alignOverlay() {
        if (this.appendTo)
            DomHandler.absolutePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
        else
            DomHandler.relativePosition(this.overlay, (this.multiple ? this.multiContainerEL.nativeElement : this.inputEL.nativeElement));
    }
    hide() {
        this.overlayVisible = false;
    }
    handleDropdownClick(event) {
        this.focusInput();
        let queryValue = this.multiple ? this.multiInputEL.nativeElement.value : this.inputEL.nativeElement.value;
        if (this.dropdownMode === 'blank')
            this.search(event, '');
        else if (this.dropdownMode === 'current')
            this.search(event, queryValue);
        this.onDropdownClick.emit({
            originalEvent: event,
            query: queryValue
        });
    }
    focusInput() {
        if (this.multiple)
            this.multiInputEL.nativeElement.focus();
        else
            this.inputEL.nativeElement.focus();
    }
    removeItem(item) {
        let itemIndex = DomHandler.index(item);
        let removedValue = this.value[itemIndex];
        this.value = this.value.filter((val, i) => i != itemIndex);
        this.onModelChange(this.value);
        this.updateFilledState();
        this.onUnselect.emit(removedValue);
    }
    onKeydown(event) {
        if (this.overlayVisible) {
            let highlightItemIndex = this.findOptionIndex(this.highlightOption);
            switch (event.which) {
                //down
                case 40:
                    if (highlightItemIndex != -1) {
                        var nextItemIndex = highlightItemIndex + 1;
                        if (nextItemIndex != (this.suggestions.length)) {
                            this.highlightOption = this.suggestions[nextItemIndex];
                            this.highlightOptionChanged = true;
                        }
                    }
                    else {
                        this.highlightOption = this.suggestions[0];
                    }
                    event.preventDefault();
                    break;
                //up
                case 38:
                    if (highlightItemIndex > 0) {
                        let prevItemIndex = highlightItemIndex - 1;
                        this.highlightOption = this.suggestions[prevItemIndex];
                        this.highlightOptionChanged = true;
                    }
                    event.preventDefault();
                    break;
                //enter
                case 13:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                        this.hide();
                    }
                    event.preventDefault();
                    break;
                //escape
                case 27:
                    this.hide();
                    event.preventDefault();
                    break;
                //tab
                case 9:
                    if (this.highlightOption) {
                        this.selectItem(this.highlightOption);
                    }
                    this.hide();
                    break;
            }
        }
        else {
            if (event.which === 40 && this.suggestions) {
                this.search(event, event.target.value);
            }
        }
        if (this.multiple) {
            switch (event.which) {
                //backspace
                case 8:
                    if (this.value && this.value.length && !this.multiInputEL.nativeElement.value) {
                        this.value = [...this.value];
                        const removedValue = this.value.pop();
                        this.onModelChange(this.value);
                        this.updateFilledState();
                        this.onUnselect.emit(removedValue);
                    }
                    break;
            }
        }
        this.inputKeyDown = true;
    }
    onKeyup(event) {
        this.onKeyUp.emit(event);
    }
    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }
    onInputChange(event) {
        if (this.forceSelection && this.suggestions) {
            let valid = false;
            let inputValue = event.target.value.trim();
            if (this.suggestions) {
                for (let suggestion of this.suggestions) {
                    let itemValue = this.field ? ObjectUtils.resolveFieldData(suggestion, this.field) : suggestion;
                    if (itemValue && inputValue === itemValue.trim()) {
                        valid = true;
                        this.forceSelectionUpdateModelTimeout = setTimeout(() => {
                            this.selectItem(suggestion, false);
                        }, 250);
                        break;
                    }
                }
            }
            if (!valid) {
                if (this.multiple) {
                    this.multiInputEL.nativeElement.value = '';
                }
                else {
                    this.value = null;
                    this.inputEL.nativeElement.value = '';
                }
                this.onClear.emit(event);
                this.onModelChange(this.value);
            }
        }
    }
    onInputPaste(event) {
        this.onKeydown(event);
    }
    isSelected(val) {
        let selected = false;
        if (this.value && this.value.length) {
            for (let i = 0; i < this.value.length; i++) {
                if (ObjectUtils.equals(this.value[i], val, this.dataKey)) {
                    selected = true;
                    break;
                }
            }
        }
        return selected;
    }
    findOptionIndex(option) {
        let index = -1;
        if (this.suggestions) {
            for (let i = 0; i < this.suggestions.length; i++) {
                if (ObjectUtils.equals(option, this.suggestions[i])) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    updateFilledState() {
        if (this.multiple)
            this.filled = (this.value && this.value.length) || (this.multiInputEL && this.multiInputEL.nativeElement && this.multiInputEL.nativeElement.value != '');
        else
            this.filled = (this.inputFieldValue && this.inputFieldValue != '') || (this.inputEL && this.inputEL.nativeElement && this.inputEL.nativeElement.value != '');
        ;
    }
    updateInputField() {
        let formattedValue = this.value ? (this.field ? ObjectUtils.resolveFieldData(this.value, this.field) || '' : this.value) : '';
        this.inputFieldValue = formattedValue;
        if (this.inputEL && this.inputEL.nativeElement) {
            this.inputEL.nativeElement.value = formattedValue;
        }
        this.updateFilledState();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
                if (event.which === 3) {
                    return;
                }
                if (!this.inputClick && !this.isDropdownClick(event)) {
                    this.hide();
                }
                this.inputClick = false;
                this.cd.markForCheck();
            });
        }
    }
    isDropdownClick(event) {
        if (this.dropdown) {
            let target = event.target;
            return (target === this.dropdownButton.nativeElement || target.parentNode === this.dropdownButton.nativeElement);
        }
        else {
            return false;
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        this.documentResizeListener = this.onWindowResize.bind(this);
        window.addEventListener('resize', this.documentResizeListener);
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            window.removeEventListener('resize', this.documentResizeListener);
            this.documentResizeListener = null;
        }
    }
    onWindowResize() {
        this.hide();
    }
    onOverlayHide() {
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.overlay = null;
    }
    ngOnDestroy() {
        this.restoreOverlayAppend();
        this.onOverlayHide();
    }
};
AutoComplete.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: IterableDiffers }
];
__decorate([
    Input()
], AutoComplete.prototype, "minLength", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "delay", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "style", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "panelStyle", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "styleClass", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "panelStyleClass", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "inputStyle", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "inputId", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "inputStyleClass", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "placeholder", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "readonly", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "disabled", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "maxlength", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "name", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "required", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "size", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "appendTo", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "autoHighlight", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "forceSelection", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "type", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "autoZIndex", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "baseZIndex", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "ariaLabel", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "ariaLabelledBy", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "dropdownIcon", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "unique", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "completeMethod", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onSelect", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onUnselect", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onFocus", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onBlur", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onDropdownClick", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onClear", void 0);
__decorate([
    Output()
], AutoComplete.prototype, "onKeyUp", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "field", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "scrollHeight", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "dropdown", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "dropdownMode", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "multiple", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "tabindex", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "dataKey", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "emptyMessage", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "showTransitionOptions", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "hideTransitionOptions", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "autofocus", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "autocomplete", void 0);
__decorate([
    ViewChild('in', { static: false })
], AutoComplete.prototype, "inputEL", void 0);
__decorate([
    ViewChild('multiIn', { static: false })
], AutoComplete.prototype, "multiInputEL", void 0);
__decorate([
    ViewChild('multiContainer', { static: false })
], AutoComplete.prototype, "multiContainerEL", void 0);
__decorate([
    ViewChild('ddBtn', { static: false })
], AutoComplete.prototype, "dropdownButton", void 0);
__decorate([
    ContentChildren(PrimeTemplate)
], AutoComplete.prototype, "templates", void 0);
__decorate([
    Input()
], AutoComplete.prototype, "suggestions", null);
AutoComplete = __decorate([
    Component({
        selector: 'p-autoComplete',
        template: `
        <span [ngClass]="{'ui-autocomplete ui-widget':true,'ui-autocomplete-dd':dropdown,'ui-autocomplete-multiple':multiple}" [ngStyle]="style" [class]="styleClass">
            <input *ngIf="!multiple" #in [attr.type]="type" [attr.id]="inputId" [ngStyle]="inputStyle" [class]="inputStyleClass" [autocomplete]="autocomplete" [attr.required]="required" [attr.name]="name"
            [ngClass]="'ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input'" [value]="inputFieldValue" aria-autocomplete="list" [attr.aria-controls]="listId" role="searchbox" [attr.aria-expanded]="overlayVisible" aria-haspopup="true" [attr.aria-activedescendant]="'p-highlighted-option'"
            (click)="onInputClick($event)" (input)="onInput($event)" (keydown)="onKeydown($event)" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)"
            [attr.placeholder]="placeholder" [attr.size]="size" [attr.maxlength]="maxlength" [attr.tabindex]="tabindex" [readonly]="readonly" [disabled]="disabled" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
            ><ul *ngIf="multiple" #multiContainer class="ui-autocomplete-multiple-container ui-widget ui-inputtext ui-state-default ui-corner-all" [ngClass]="{'ui-state-disabled':disabled,'ui-state-focus':focus}" (click)="multiIn.focus()">
                <li #token *ngFor="let val of value" class="ui-autocomplete-token ui-state-highlight ui-corner-all">
                    <span class="ui-autocomplete-token-icon pi pi-fw pi-times" (click)="removeItem(token)" *ngIf="!disabled"></span>
                    <span *ngIf="!selectedItemTemplate" class="ui-autocomplete-token-label">{{resolveFieldData(val)}}</span>
                    <ng-container *ngTemplateOutlet="selectedItemTemplate; context: {$implicit: val}"></ng-container>
                </li>
                <li class="ui-autocomplete-input-token">
                    <input #multiIn [attr.type]="type" [attr.id]="inputId" [disabled]="disabled" [attr.placeholder]="(value&&value.length ? null : placeholder)" [attr.tabindex]="tabindex" [attr.maxlength]="maxlength" (input)="onInput($event)"  (click)="onInputClick($event)"
                            (keydown)="onKeydown($event)" [readonly]="readonly" (keyup)="onKeyup($event)" [attr.autofocus]="autofocus" (focus)="onInputFocus($event)" (blur)="onInputBlur($event)" (change)="onInputChange($event)" (paste)="onInputPaste($event)" [autocomplete]="autocomplete"
                            [ngStyle]="inputStyle" [class]="inputStyleClass" [attr.aria-label]="ariaLabel" [attr.aria-labelledby]="ariaLabelledBy" [attr.aria-required]="required"
                            aria-autocomplete="list" [attr.aria-controls]="listId" role="searchbox" [attr.aria-expanded]="overlayVisible" aria-haspopup="true" [attr.aria-activedescendant]="'p-highlighted-option'">
                </li>
            </ul>
            <i *ngIf="loading" class="ui-autocomplete-loader pi pi-spinner pi-spin"></i><button #ddBtn type="button" pButton [icon]="dropdownIcon" class="ui-autocomplete-dropdown" [disabled]="disabled"
                (click)="handleDropdownClick($event)" *ngIf="dropdown" [attr.tabindex]="tabindex"></button>
            <div #panel *ngIf="overlayVisible" [ngClass]="['ui-autocomplete-panel ui-widget ui-widget-content ui-corner-all ui-shadow']" [style.max-height]="scrollHeight" [ngStyle]="panelStyle" [class]="panelStyleClass"
                [@overlayAnimation]="{value: 'visible', params: {showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions}}" (@overlayAnimation.start)="onOverlayAnimationStart($event)" (@overlayAnimation.done)="onOverlayAnimationDone($event)" >
                <ul role="listbox" [attr.id]="listId" class="ui-autocomplete-items ui-autocomplete-list ui-widget-content ui-widget ui-corner-all ui-helper-reset">
                    <li role="option"  *ngFor="let option of suggestions; let idx = index" [ngClass]="{'ui-autocomplete-list-item ui-corner-all':true,'ui-state-highlight':(highlightOption==option)}"
                        (mouseenter)="highlightOption=option" (mouseleave)="highlightOption=null" [id]="highlightOption == option ? 'p-highlighted-option':''" (click)="selectItem(option)">
                        <span *ngIf="!itemTemplate">{{resolveFieldData(option)}}</span>
                        <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: option, index: idx}"></ng-container>
                    </li>
                    <li *ngIf="noResults && emptyMessage" class="ui-autocomplete-emptymessage ui-autocomplete-list-item ui-corner-all">{{emptyMessage}}</li>
                </ul>
            </div>
        </span>
    `,
        animations: [
            trigger('overlayAnimation', [
                state('void', style({
                    transform: 'translateY(5%)',
                    opacity: 0
                })),
                state('visible', style({
                    transform: 'translateY(0)',
                    opacity: 1
                })),
                transition('void => visible', animate('{{showTransitionParams}}')),
                transition('visible => void', animate('{{hideTransitionParams}}'))
            ])
        ],
        host: {
            '[class.ui-inputwrapper-filled]': 'filled',
            '[class.ui-inputwrapper-focus]': 'focus && !disabled'
        },
        providers: [AUTOCOMPLETE_VALUE_ACCESSOR]
    })
], AutoComplete);
export { AutoComplete };
let AutoCompleteModule = class AutoCompleteModule {
};
AutoCompleteModule = __decorate([
    NgModule({
        imports: [CommonModule, InputTextModule, ButtonModule, SharedModule],
        exports: [AutoComplete, SharedModule],
        declarations: [AutoComplete]
    })
], AutoCompleteModule);
export { AutoCompleteModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vcHJpbWVuZy9hdXRvY29tcGxldGUvIiwic291cmNlcyI6WyJhdXRvY29tcGxldGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxnQkFBZ0IsRUFBQyxnQkFBZ0IsRUFBQyxTQUFTLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxZQUFZLEVBQUMsZUFBZSxFQUFDLFNBQVMsRUFBQyxXQUFXLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxpQkFBaUIsRUFBQyxlQUFlLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDek8sT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxPQUFPLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBQyxVQUFVLEVBQUMsT0FBTyxFQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBQzFGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLFlBQVksRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUN2QyxPQUFPLEVBQUMsV0FBVyxFQUFFLGlCQUFpQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBQyxpQkFBaUIsRUFBdUIsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RSxNQUFNLENBQUMsTUFBTSwyQkFBMkIsR0FBUTtJQUM5QyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQztBQTBERixJQUFhLFlB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LE1BQWEsa0JBQWtCO0NBQUksQ0FBQTtBQUF0QixrQkFBa0I7SUFMOUIsUUFBUSxDQUFDO1FBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFDLGVBQWUsRUFBQyxZQUFZLEVBQUMsWUFBWSxDQUFDO1FBQ2pFLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBQyxZQUFZLENBQUM7UUFDcEMsWUFBWSxFQUFFLENBQUMsWUFBWSxDQUFDO0tBQy9CLENBQUM7R0FDVyxrQkFBa0IsQ0FBSTtTQUF0QixrQkFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxWaWV3Q2hpbGQsRWxlbWVudFJlZixBZnRlclZpZXdDaGVja2VkLEFmdGVyQ29udGVudEluaXQsT25EZXN0cm95LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsQ29udGVudENoaWxkcmVuLFF1ZXJ5TGlzdCxUZW1wbGF0ZVJlZixSZW5kZXJlcjIsZm9yd2FyZFJlZixDaGFuZ2VEZXRlY3RvclJlZixJdGVyYWJsZURpZmZlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge3RyaWdnZXIsc3RhdGUsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlLEFuaW1hdGlvbkV2ZW50fSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7SW5wdXRUZXh0TW9kdWxlfSBmcm9tICdwcmltZW5nL2lucHV0dGV4dCc7XG5pbXBvcnQge0J1dHRvbk1vZHVsZX0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHtTaGFyZWRNb2R1bGUsUHJpbWVUZW1wbGF0ZX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge09iamVjdFV0aWxzLCBVbmlxdWVDb21wb25lbnRJZH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5pbXBvcnQge05HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3Nvcn0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5leHBvcnQgY29uc3QgQVVUT0NPTVBMRVRFX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBBdXRvQ29tcGxldGUpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLWF1dG9Db21wbGV0ZScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwieyd1aS1hdXRvY29tcGxldGUgdWktd2lkZ2V0Jzp0cnVlLCd1aS1hdXRvY29tcGxldGUtZGQnOmRyb3Bkb3duLCd1aS1hdXRvY29tcGxldGUtbXVsdGlwbGUnOm11bHRpcGxlfVwiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIj5cbiAgICAgICAgICAgIDxpbnB1dCAqbmdJZj1cIiFtdWx0aXBsZVwiICNpbiBbYXR0ci50eXBlXT1cInR5cGVcIiBbYXR0ci5pZF09XCJpbnB1dElkXCIgW25nU3R5bGVdPVwiaW5wdXRTdHlsZVwiIFtjbGFzc109XCJpbnB1dFN0eWxlQ2xhc3NcIiBbYXV0b2NvbXBsZXRlXT1cImF1dG9jb21wbGV0ZVwiIFthdHRyLnJlcXVpcmVkXT1cInJlcXVpcmVkXCIgW2F0dHIubmFtZV09XCJuYW1lXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIid1aS1pbnB1dHRleHQgdWktd2lkZ2V0IHVpLXN0YXRlLWRlZmF1bHQgdWktY29ybmVyLWFsbCB1aS1hdXRvY29tcGxldGUtaW5wdXQnXCIgW3ZhbHVlXT1cImlucHV0RmllbGRWYWx1ZVwiIGFyaWEtYXV0b2NvbXBsZXRlPVwibGlzdFwiIFthdHRyLmFyaWEtY29udHJvbHNdPVwibGlzdElkXCIgcm9sZT1cInNlYXJjaGJveFwiIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwib3ZlcmxheVZpc2libGVcIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIFthdHRyLmFyaWEtYWN0aXZlZGVzY2VuZGFudF09XCIncC1oaWdobGlnaHRlZC1vcHRpb24nXCJcbiAgICAgICAgICAgIChjbGljayk9XCJvbklucHV0Q2xpY2soJGV2ZW50KVwiIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIiAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50KVwiIChrZXl1cCk9XCJvbktleXVwKCRldmVudClcIiBbYXR0ci5hdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCIgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCIgKGJsdXIpPVwib25JbnB1dEJsdXIoJGV2ZW50KVwiIChjaGFuZ2UpPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCIgKHBhc3RlKT1cIm9uSW5wdXRQYXN0ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIFthdHRyLnBsYWNlaG9sZGVyXT1cInBsYWNlaG9sZGVyXCIgW2F0dHIuc2l6ZV09XCJzaXplXCIgW2F0dHIubWF4bGVuZ3RoXT1cIm1heGxlbmd0aFwiIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCIgW3JlYWRvbmx5XT1cInJlYWRvbmx5XCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiBbYXR0ci5hcmlhLXJlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgID48dWwgKm5nSWY9XCJtdWx0aXBsZVwiICNtdWx0aUNvbnRhaW5lciBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS1tdWx0aXBsZS1jb250YWluZXIgdWktd2lkZ2V0IHVpLWlucHV0dGV4dCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGxcIiBbbmdDbGFzc109XCJ7J3VpLXN0YXRlLWRpc2FibGVkJzpkaXNhYmxlZCwndWktc3RhdGUtZm9jdXMnOmZvY3VzfVwiIChjbGljayk9XCJtdWx0aUluLmZvY3VzKClcIj5cbiAgICAgICAgICAgICAgICA8bGkgI3Rva2VuICpuZ0Zvcj1cImxldCB2YWwgb2YgdmFsdWVcIiBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS10b2tlbiB1aS1zdGF0ZS1oaWdobGlnaHQgdWktY29ybmVyLWFsbFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS10b2tlbi1pY29uIHBpIHBpLWZ3IHBpLXRpbWVzXCIgKGNsaWNrKT1cInJlbW92ZUl0ZW0odG9rZW4pXCIgKm5nSWY9XCIhZGlzYWJsZWRcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIXNlbGVjdGVkSXRlbVRlbXBsYXRlXCIgY2xhc3M9XCJ1aS1hdXRvY29tcGxldGUtdG9rZW4tbGFiZWxcIj57e3Jlc29sdmVGaWVsZERhdGEodmFsKX19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwic2VsZWN0ZWRJdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IHZhbH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS1pbnB1dC10b2tlblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgI211bHRpSW4gW2F0dHIudHlwZV09XCJ0eXBlXCIgW2F0dHIuaWRdPVwiaW5wdXRJZFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFthdHRyLnBsYWNlaG9sZGVyXT1cIih2YWx1ZSYmdmFsdWUubGVuZ3RoID8gbnVsbCA6IHBsYWNlaG9sZGVyKVwiIFthdHRyLnRhYmluZGV4XT1cInRhYmluZGV4XCIgW2F0dHIubWF4bGVuZ3RoXT1cIm1heGxlbmd0aFwiIChpbnB1dCk9XCJvbklucHV0KCRldmVudClcIiAgKGNsaWNrKT1cIm9uSW5wdXRDbGljaygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbktleWRvd24oJGV2ZW50KVwiIFtyZWFkb25seV09XCJyZWFkb25seVwiIChrZXl1cCk9XCJvbktleXVwKCRldmVudClcIiBbYXR0ci5hdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCIgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCIgKGJsdXIpPVwib25JbnB1dEJsdXIoJGV2ZW50KVwiIChjaGFuZ2UpPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCIgKHBhc3RlKT1cIm9uSW5wdXRQYXN0ZSgkZXZlbnQpXCIgW2F1dG9jb21wbGV0ZV09XCJhdXRvY29tcGxldGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImlucHV0U3R5bGVcIiBbY2xhc3NdPVwiaW5wdXRTdHlsZUNsYXNzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIiBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIiBbYXR0ci5hcmlhLXJlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWF1dG9jb21wbGV0ZT1cImxpc3RcIiBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImxpc3RJZFwiIHJvbGU9XCJzZWFyY2hib3hcIiBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cIm92ZXJsYXlWaXNpYmxlXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdPVwiJ3AtaGlnaGxpZ2h0ZWQtb3B0aW9uJ1wiPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPGkgKm5nSWY9XCJsb2FkaW5nXCIgY2xhc3M9XCJ1aS1hdXRvY29tcGxldGUtbG9hZGVyIHBpIHBpLXNwaW5uZXIgcGktc3BpblwiPjwvaT48YnV0dG9uICNkZEJ0biB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBbaWNvbl09XCJkcm9wZG93bkljb25cIiBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS1kcm9wZG93blwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgKGNsaWNrKT1cImhhbmRsZURyb3Bkb3duQ2xpY2soJGV2ZW50KVwiICpuZ0lmPVwiZHJvcGRvd25cIiBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgPGRpdiAjcGFuZWwgKm5nSWY9XCJvdmVybGF5VmlzaWJsZVwiIFtuZ0NsYXNzXT1cIlsndWktYXV0b2NvbXBsZXRlLXBhbmVsIHVpLXdpZGdldCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYWxsIHVpLXNoYWRvdyddXCIgW3N0eWxlLm1heC1oZWlnaHRdPVwic2Nyb2xsSGVpZ2h0XCIgW25nU3R5bGVdPVwicGFuZWxTdHlsZVwiIFtjbGFzc109XCJwYW5lbFN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtAb3ZlcmxheUFuaW1hdGlvbl09XCJ7dmFsdWU6ICd2aXNpYmxlJywgcGFyYW1zOiB7c2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9uc319XCIgKEBvdmVybGF5QW5pbWF0aW9uLnN0YXJ0KT1cIm9uT3ZlcmxheUFuaW1hdGlvblN0YXJ0KCRldmVudClcIiAoQG92ZXJsYXlBbmltYXRpb24uZG9uZSk9XCJvbk92ZXJsYXlBbmltYXRpb25Eb25lKCRldmVudClcIiA+XG4gICAgICAgICAgICAgICAgPHVsIHJvbGU9XCJsaXN0Ym94XCIgW2F0dHIuaWRdPVwibGlzdElkXCIgY2xhc3M9XCJ1aS1hdXRvY29tcGxldGUtaXRlbXMgdWktYXV0b2NvbXBsZXRlLWxpc3QgdWktd2lkZ2V0LWNvbnRlbnQgdWktd2lkZ2V0IHVpLWNvcm5lci1hbGwgdWktaGVscGVyLXJlc2V0XCI+XG4gICAgICAgICAgICAgICAgICAgIDxsaSByb2xlPVwib3B0aW9uXCIgICpuZ0Zvcj1cImxldCBvcHRpb24gb2Ygc3VnZ2VzdGlvbnM7IGxldCBpZHggPSBpbmRleFwiIFtuZ0NsYXNzXT1cInsndWktYXV0b2NvbXBsZXRlLWxpc3QtaXRlbSB1aS1jb3JuZXItYWxsJzp0cnVlLCd1aS1zdGF0ZS1oaWdobGlnaHQnOihoaWdobGlnaHRPcHRpb249PW9wdGlvbil9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cImhpZ2hsaWdodE9wdGlvbj1vcHRpb25cIiAobW91c2VsZWF2ZSk9XCJoaWdobGlnaHRPcHRpb249bnVsbFwiIFtpZF09XCJoaWdobGlnaHRPcHRpb24gPT0gb3B0aW9uID8gJ3AtaGlnaGxpZ2h0ZWQtb3B0aW9uJzonJ1wiIChjbGljayk9XCJzZWxlY3RJdGVtKG9wdGlvbilcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuICpuZ0lmPVwiIWl0ZW1UZW1wbGF0ZVwiPnt7cmVzb2x2ZUZpZWxkRGF0YShvcHRpb24pfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbVRlbXBsYXRlOyBjb250ZXh0OiB7JGltcGxpY2l0OiBvcHRpb24sIGluZGV4OiBpZHh9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cIm5vUmVzdWx0cyAmJiBlbXB0eU1lc3NhZ2VcIiBjbGFzcz1cInVpLWF1dG9jb21wbGV0ZS1lbXB0eW1lc3NhZ2UgdWktYXV0b2NvbXBsZXRlLWxpc3QtaXRlbSB1aS1jb3JuZXItYWxsXCI+e3tlbXB0eU1lc3NhZ2V9fTwvbGk+XG4gICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3NwYW4+XG4gICAgYCxcbiAgICBhbmltYXRpb25zOiBbXG4gICAgICAgIHRyaWdnZXIoJ292ZXJsYXlBbmltYXRpb24nLCBbXG4gICAgICAgICAgICBzdGF0ZSgndm9pZCcsIHN0eWxlKHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDUlKScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMFxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgc3RhdGUoJ3Zpc2libGUnLCBzdHlsZSh7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgwKScsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfSkpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiB2aXNpYmxlJywgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JykpLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndmlzaWJsZSA9PiB2b2lkJywgYW5pbWF0ZSgne3toaWRlVHJhbnNpdGlvblBhcmFtc319JykpXG4gICAgICAgIF0pXG4gICAgXSxcbiAgICBob3N0OiB7XG4gICAgICAgICdbY2xhc3MudWktaW5wdXR3cmFwcGVyLWZpbGxlZF0nOiAnZmlsbGVkJyxcbiAgICAgICAgJ1tjbGFzcy51aS1pbnB1dHdyYXBwZXItZm9jdXNdJzogJ2ZvY3VzICYmICFkaXNhYmxlZCdcbiAgICB9LFxuICAgIHByb3ZpZGVyczogW0FVVE9DT01QTEVURV9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgQXV0b0NvbXBsZXRlIGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCxBZnRlckNvbnRlbnRJbml0LE9uRGVzdHJveSxDb250cm9sVmFsdWVBY2Nlc3NvciB7XG5cbiAgICBASW5wdXQoKSBtaW5MZW5ndGg6IG51bWJlciA9IDE7XG5cbiAgICBASW5wdXQoKSBkZWxheTogbnVtYmVyID0gMzAwO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHBhbmVsU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSBwYW5lbFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGlucHV0U3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcGxhY2Vob2xkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlYWRvbmx5OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBtYXhsZW5ndGg6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIG5hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlcXVpcmVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgc2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgYXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIGF1dG9IaWdobGlnaHQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBmb3JjZVNlbGVjdGlvbjogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICd0ZXh0JztcblxuICAgIEBJbnB1dCgpIGF1dG9aSW5kZXg6IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkcm9wZG93bkljb246IHN0cmluZyA9IFwicGkgcGktY2FyZXQtZG93blwiO1xuXG4gICAgQElucHV0KCkgdW5pcXVlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBPdXRwdXQoKSBjb21wbGV0ZU1ldGhvZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uVW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uRm9jdXM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmx1cjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ecm9wZG93bkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuXHRAT3V0cHV0KCkgb25DbGVhcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25LZXlVcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSBmaWVsZDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2Nyb2xsSGVpZ2h0OiBzdHJpbmcgPSAnMjAwcHgnO1xuXG4gICAgQElucHV0KCkgZHJvcGRvd246IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBkcm9wZG93bk1vZGU6IHN0cmluZyA9ICdibGFuayc7XG5cbiAgICBASW5wdXQoKSBtdWx0aXBsZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBkYXRhS2V5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlbXB0eU1lc3NhZ2U6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNob3dUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzIyNW1zIGVhc2Utb3V0JztcblxuICAgIEBJbnB1dCgpIGhpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzE5NW1zIGVhc2UtaW4nO1xuXG4gICAgQElucHV0KCkgYXV0b2ZvY3VzOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgYXV0b2NvbXBsZXRlOiBzdHJpbmcgPSAnb2ZmJztcblxuICAgIEBWaWV3Q2hpbGQoJ2luJywgeyBzdGF0aWM6IGZhbHNlIH0pIGlucHV0RUw6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdtdWx0aUluJywgeyBzdGF0aWM6IGZhbHNlIH0pIG11bHRpSW5wdXRFTDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ211bHRpQ29udGFpbmVyJywgeyBzdGF0aWM6IGZhbHNlIH0pIG11bHRpQ29udGFpbmVyRUw6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdkZEJ0bicsIHsgc3RhdGljOiBmYWxzZSB9KSBkcm9wZG93bkJ1dHRvbjogRWxlbWVudFJlZjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIG92ZXJsYXk6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgc2VsZWN0ZWRJdGVtVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICB2YWx1ZTogYW55O1xuXG4gICAgX3N1Z2dlc3Rpb25zOiBhbnlbXTtcblxuICAgIG9uTW9kZWxDaGFuZ2U6IEZ1bmN0aW9uID0gKCkgPT4ge307XG5cbiAgICBvbk1vZGVsVG91Y2hlZDogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIHRpbWVvdXQ6IGFueTtcblxuICAgIG92ZXJsYXlWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBkb2N1bWVudENsaWNrTGlzdGVuZXI6IGFueTtcblxuICAgIHN1Z2dlc3Rpb25zVXBkYXRlZDogYm9vbGVhbjtcblxuICAgIGhpZ2hsaWdodE9wdGlvbjogYW55O1xuXG4gICAgaGlnaGxpZ2h0T3B0aW9uQ2hhbmdlZDogYm9vbGVhbjtcblxuICAgIGZvY3VzOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBmaWxsZWQ6IGJvb2xlYW47XG5cbiAgICBpbnB1dENsaWNrOiBib29sZWFuO1xuXG4gICAgaW5wdXRLZXlEb3duOiBib29sZWFuO1xuXG4gICAgbm9SZXN1bHRzOiBib29sZWFuO1xuXG4gICAgZGlmZmVyOiBhbnk7XG5cbiAgICBpbnB1dEZpZWxkVmFsdWU6IHN0cmluZyA9IG51bGw7XG5cbiAgICBsb2FkaW5nOiBib29sZWFuO1xuXG4gICAgZG9jdW1lbnRSZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQ6IGFueTtcblxuICAgIGxpc3RJZDogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHVibGljIGRpZmZlcnM6IEl0ZXJhYmxlRGlmZmVycykge1xuICAgICAgICB0aGlzLmRpZmZlciA9IGRpZmZlcnMuZmluZChbXSkuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLmxpc3RJZCA9IFVuaXF1ZUNvbXBvbmVudElkKCkgKyAnX2xpc3QnO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdWdnZXN0aW9ucygpOiBhbnlbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdWdnZXN0aW9ucztcbiAgICB9XG5cbiAgICBzZXQgc3VnZ2VzdGlvbnModmFsOmFueVtdKSB7XG4gICAgICAgIHRoaXMuX3N1Z2dlc3Rpb25zID0gdmFsO1xuICAgICAgICB0aGlzLmhhbmRsZVN1Z2dlc3Rpb25zQ2hhbmdlKCk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICAvL1VzZSB0aW1lb3V0cyBhcyBzaW5jZSBBbmd1bGFyIDQuMiwgQWZ0ZXJWaWV3Q2hlY2tlZCBpcyBicm9rZW4gYW5kIG5vdCBjYWxsZWQgYWZ0ZXIgcGFuZWwgaXMgdXBkYXRlZFxuICAgICAgICBpZiAodGhpcy5zdWdnZXN0aW9uc1VwZGF0ZWQgJiYgdGhpcy5vdmVybGF5ICYmIHRoaXMub3ZlcmxheS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm92ZXJsYXkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbk92ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAxKTtcbiAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNVcGRhdGVkID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vdmVybGF5KSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBsaXN0SXRlbSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLm92ZXJsYXksICdsaS51aS1zdGF0ZS1oaWdobGlnaHQnKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnNjcm9sbEluVmlldyh0aGlzLm92ZXJsYXksIGxpc3RJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDEpO1xuICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVTdWdnZXN0aW9uc0NoYW5nZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N1Z2dlc3Rpb25zICE9IG51bGwgJiYgdGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAodGhpcy5fc3VnZ2VzdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub1Jlc3VsdHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zVXBkYXRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvSGlnaGxpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5fc3VnZ2VzdGlvbnNbMF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ub1Jlc3VsdHMgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW1wdHlNZXNzYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zVXBkYXRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3NlbGVjdGVkSXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpIDogdm9pZCB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5maWxsZWQgPSB0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUgIT0gJyc7XG4gICAgICAgIHRoaXMudXBkYXRlSW5wdXRGaWVsZCgpO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSA9IGZuO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBGdW5jdGlvbik6IHZvaWQge1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkID0gZm47XG4gICAgfVxuXG4gICAgc2V0RGlzYWJsZWRTdGF0ZSh2YWw6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IHZhbDtcbiAgICB9XG5cbiAgICBvbklucHV0KGV2ZW50OiBFdmVudCkge1xuICAgICAgICAvLyBXaGVuIGFuIGlucHV0IGVsZW1lbnQgd2l0aCBhIHBsYWNlaG9sZGVyIGlzIGNsaWNrZWQsIHRoZSBvbklucHV0IGV2ZW50IGlzIGludm9rZWQgaW4gSUUuXG4gICAgICAgIGlmICghdGhpcy5pbnB1dEtleURvd24gJiYgRG9tSGFuZGxlci5pc0lFKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZhbHVlID0gKDxIVE1MSW5wdXRFbGVtZW50PiBldmVudC50YXJnZXQpLnZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubXVsdGlwbGUgJiYgIXRoaXMuZm9yY2VTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID09PSAwICYmICF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICB0aGlzLm9uQ2xlYXIuZW1pdChldmVudCk7XG5cdCAgIHRoaXMub25Nb2RlbENoYW5nZSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsdWUubGVuZ3RoID49IHRoaXMubWluTGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaChldmVudCwgdmFsdWUpO1xuICAgICAgICAgICAgfSwgdGhpcy5kZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5pbnB1dEtleURvd24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICBvbklucHV0Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Q2xpY2sgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2VhcmNoKGV2ZW50OiBhbnksIHF1ZXJ5OiBzdHJpbmcpIHtcbiAgICAgICAgLy9hbGxvdyBlbXB0eSBzdHJpbmcgYnV0IG5vdCB1bmRlZmluZWQgb3IgbnVsbFxuICAgICAgIGlmIChxdWVyeSA9PT0gdW5kZWZpbmVkIHx8IHF1ZXJ5ID09PSBudWxsKSB7XG4gICAgICAgICAgIHJldHVybjtcbiAgICAgICB9XG5cbiAgICAgICB0aGlzLmxvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgdGhpcy5jb21wbGV0ZU1ldGhvZC5lbWl0KHtcbiAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgIHF1ZXJ5OiBxdWVyeVxuICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNlbGVjdEl0ZW0ob3B0aW9uOiBhbnksIGZvY3VzOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICBpZiAodGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5mb3JjZVNlbGVjdGlvblVwZGF0ZU1vZGVsVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSkge1xuICAgICAgICAgICAgdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWV8fFtdO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU2VsZWN0ZWQob3B0aW9uKSB8fCAhdGhpcy51bmlxdWUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gWy4uLnRoaXMudmFsdWUsb3B0aW9uXTtcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuZmllbGQgPyBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKG9wdGlvbiwgdGhpcy5maWVsZCl8fCcnOiBvcHRpb247XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gb3B0aW9uO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdC5lbWl0KG9wdGlvbik7XG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcblxuICAgICAgICBpZiAoZm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNJbnB1dCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgaWYgKHRoaXMubXVsdGlJbnB1dEVMIHx8IHRoaXMuaW5wdXRFTCkge1xuICAgICAgICAgICAgbGV0IGhhc0ZvY3VzID0gdGhpcy5tdWx0aXBsZSA/IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudCA6IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT0gdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQgO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXRoaXMub3ZlcmxheVZpc2libGUgJiYgaGFzRm9jdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uT3ZlcmxheUFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheSA9IGV2ZW50LmVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBlbmRPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXkuc3R5bGUuekluZGV4ID0gU3RyaW5nKHRoaXMuYmFzZVpJbmRleCArICgrK0RvbUhhbmRsZXIuemluZGV4KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25PdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk92ZXJsYXlBbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQudG9TdGF0ZSA9PT0gJ3ZvaWQnKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWdnZXN0aW9ucyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhcHBlbmRPdmVybGF5KCkge1xuICAgICAgICBpZiAodGhpcy5hcHBlbmRUbykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8gPT09ICdib2R5JylcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMub3ZlcmxheSk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLm92ZXJsYXksIHRoaXMuYXBwZW5kVG8pO1xuXG4gICAgICAgICAgICB0aGlzLm92ZXJsYXkuc3R5bGUubWluV2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSkgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzb2x2ZUZpZWxkRGF0YSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWVsZCA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEodmFsdWUsIHRoaXMuZmllbGQpOiB2YWx1ZTtcbiAgICB9XG5cbiAgICByZXN0b3JlT3ZlcmxheUFwcGVuZCgpIHtcbiAgICAgICAgaWYgKHRoaXMub3ZlcmxheSAmJiB0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5vdmVybGF5KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFsaWduT3ZlcmxheSgpIHtcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pXG4gICAgICAgICAgICBEb21IYW5kbGVyLmFic29sdXRlUG9zaXRpb24odGhpcy5vdmVybGF5LCAodGhpcy5tdWx0aXBsZSA/IHRoaXMubXVsdGlDb250YWluZXJFTC5uYXRpdmVFbGVtZW50IDogdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQpKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgRG9tSGFuZGxlci5yZWxhdGl2ZVBvc2l0aW9uKHRoaXMub3ZlcmxheSwgKHRoaXMubXVsdGlwbGUgPyB0aGlzLm11bHRpQ29udGFpbmVyRUwubmF0aXZlRWxlbWVudCA6IHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50KSk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5VmlzaWJsZSA9IGZhbHNlO1xuICAgIH1cblxuICAgIGhhbmRsZURyb3Bkb3duQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1c0lucHV0KCk7XG4gICAgICAgIGxldCBxdWVyeVZhbHVlID0gdGhpcy5tdWx0aXBsZSA/IHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgOiB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5kcm9wZG93bk1vZGUgPT09ICdibGFuaycpXG4gICAgICAgICAgICB0aGlzLnNlYXJjaChldmVudCwgJycpO1xuICAgICAgICBlbHNlIGlmICh0aGlzLmRyb3Bkb3duTW9kZSA9PT0gJ2N1cnJlbnQnKVxuICAgICAgICAgICAgdGhpcy5zZWFyY2goZXZlbnQsIHF1ZXJ5VmFsdWUpO1xuXG4gICAgICAgIHRoaXMub25Ecm9wZG93bkNsaWNrLmVtaXQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICBxdWVyeTogcXVlcnlWYWx1ZVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmb2N1c0lucHV0KCkge1xuICAgICAgICBpZiAodGhpcy5tdWx0aXBsZSlcbiAgICAgICAgICAgIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGl0ZW06IGFueSkge1xuICAgICAgICBsZXQgaXRlbUluZGV4ID0gRG9tSGFuZGxlci5pbmRleChpdGVtKTtcbiAgICAgICAgbGV0IHJlbW92ZWRWYWx1ZSA9IHRoaXMudmFsdWVbaXRlbUluZGV4XTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHRoaXMudmFsdWUuZmlsdGVyKCh2YWwsIGkpID0+IGkhPWl0ZW1JbmRleCk7XG4gICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy51cGRhdGVGaWxsZWRTdGF0ZSgpO1xuICAgICAgICB0aGlzLm9uVW5zZWxlY3QuZW1pdChyZW1vdmVkVmFsdWUpO1xuICAgIH1cblxuICAgIG9uS2V5ZG93bihldmVudCkge1xuICAgICAgICBpZiAodGhpcy5vdmVybGF5VmlzaWJsZSkge1xuICAgICAgICAgICAgbGV0IGhpZ2hsaWdodEl0ZW1JbmRleCA9IHRoaXMuZmluZE9wdGlvbkluZGV4KHRoaXMuaGlnaGxpZ2h0T3B0aW9uKTtcblxuICAgICAgICAgICAgc3dpdGNoKGV2ZW50LndoaWNoKSB7XG4gICAgICAgICAgICAgICAgLy9kb3duXG4gICAgICAgICAgICAgICAgY2FzZSA0MDpcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhpZ2hsaWdodEl0ZW1JbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRJdGVtSW5kZXggPSBoaWdobGlnaHRJdGVtSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5leHRJdGVtSW5kZXggIT0gKHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0T3B0aW9uID0gdGhpcy5zdWdnZXN0aW9uc1tuZXh0SXRlbUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZ2hsaWdodE9wdGlvbkNoYW5nZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLnN1Z2dlc3Rpb25zWzBdO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vdXBcbiAgICAgICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgICAgICBpZiAoaGlnaGxpZ2h0SXRlbUluZGV4ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByZXZJdGVtSW5kZXggPSBoaWdobGlnaHRJdGVtSW5kZXggLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb24gPSB0aGlzLnN1Z2dlc3Rpb25zW3ByZXZJdGVtSW5kZXhdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWdobGlnaHRPcHRpb25DaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAvL2VudGVyXG4gICAgICAgICAgICAgICAgY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGlnaGxpZ2h0T3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0odGhpcy5oaWdobGlnaHRPcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIC8vZXNjYXBlXG4gICAgICAgICAgICAgICAgY2FzZSAyNzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cblxuICAgICAgICAgICAgICAgIC8vdGFiXG4gICAgICAgICAgICAgICAgY2FzZSA5OlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oaWdobGlnaHRPcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0SXRlbSh0aGlzLmhpZ2hsaWdodE9wdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDQwICYmIHRoaXMuc3VnZ2VzdGlvbnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlYXJjaChldmVudCxldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgIHN3aXRjaChldmVudC53aGljaCkge1xuICAgICAgICAgICAgICAgIC8vYmFja3NwYWNlXG4gICAgICAgICAgICAgICAgY2FzZSA4OlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCAmJiAhdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IFsuLi50aGlzLnZhbHVlXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlbW92ZWRWYWx1ZSA9IHRoaXMudmFsdWUucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlZFN0YXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVW5zZWxlY3QuZW1pdChyZW1vdmVkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlucHV0S2V5RG93biA9IHRydWU7XG4gICAgfVxuXG4gICAgb25LZXl1cChldmVudCkge1xuICAgICAgICB0aGlzLm9uS2V5VXAuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgb25JbnB1dEZvY3VzKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSB0cnVlO1xuICAgICAgICB0aGlzLm9uRm9jdXMuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgb25JbnB1dEJsdXIoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uTW9kZWxUb3VjaGVkKCk7XG4gICAgICAgIHRoaXMub25CbHVyLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRDaGFuZ2UoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZm9yY2VTZWxlY3Rpb24gJiYgdGhpcy5zdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgbGV0IHZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZS50cmltKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnN1Z2dlc3Rpb25zKSAge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IHN1Z2dlc3Rpb24gb2YgdGhpcy5zdWdnZXN0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaXRlbVZhbHVlID0gdGhpcy5maWVsZCA/IE9iamVjdFV0aWxzLnJlc29sdmVGaWVsZERhdGEoc3VnZ2VzdGlvbiwgdGhpcy5maWVsZCkgOiBzdWdnZXN0aW9uO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVZhbHVlICYmIGlucHV0VmFsdWUgPT09IGl0ZW1WYWx1ZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZm9yY2VTZWxlY3Rpb25VcGRhdGVNb2RlbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdEl0ZW0oc3VnZ2VzdGlvbiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXZhbGlkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubXVsdGlwbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tdWx0aUlucHV0RUwubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRFTC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNsZWFyLmVtaXQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMub25Nb2RlbENoYW5nZSh0aGlzLnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSW5wdXRQYXN0ZShldmVudDogQ2xpcGJvYXJkRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vbktleWRvd24oZXZlbnQpO1xuICAgIH1cblxuICAgIGlzU2VsZWN0ZWQodmFsOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHNlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLnZhbHVlICYmIHRoaXMudmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuZXF1YWxzKHRoaXMudmFsdWVbaV0sIHZhbCwgdGhpcy5kYXRhS2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2VsZWN0ZWQ7XG4gICAgfVxuXG4gICAgZmluZE9wdGlvbkluZGV4KG9wdGlvbik6IG51bWJlciB7XG4gICAgICAgIGxldCBpbmRleDogbnVtYmVyID0gLTE7XG4gICAgICAgIGlmICh0aGlzLnN1Z2dlc3Rpb25zKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc3VnZ2VzdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0VXRpbHMuZXF1YWxzKG9wdGlvbiwgdGhpcy5zdWdnZXN0aW9uc1tpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuXG4gICAgdXBkYXRlRmlsbGVkU3RhdGUoKSB7XG4gICAgICAgIGlmICh0aGlzLm11bHRpcGxlKVxuICAgICAgICAgICAgdGhpcy5maWxsZWQgPSAodGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCkgfHzCoCh0aGlzLm11bHRpSW5wdXRFTCAmJiB0aGlzLm11bHRpSW5wdXRFTC5uYXRpdmVFbGVtZW50ICYmIHRoaXMubXVsdGlJbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgIT0gJycpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICB0aGlzLmZpbGxlZCA9ICh0aGlzLmlucHV0RmllbGRWYWx1ZSAmJiB0aGlzLmlucHV0RmllbGRWYWx1ZSAhPSAnJykgfHzCoCh0aGlzLmlucHV0RUwgJiYgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQgJiYgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgIT0gJycpOztcbiAgICB9XG5cbiAgICB1cGRhdGVJbnB1dEZpZWxkKCkge1xuICAgICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLnZhbHVlID8gKHRoaXMuZmllbGQgPyBPYmplY3RVdGlscy5yZXNvbHZlRmllbGREYXRhKHRoaXMudmFsdWUsIHRoaXMuZmllbGQpfHwnJyA6IHRoaXMudmFsdWUpIDogJyc7XG4gICAgICAgIHRoaXMuaW5wdXRGaWVsZFZhbHVlID0gZm9ybWF0dGVkVmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuaW5wdXRFTCAmJiB0aGlzLmlucHV0RUwubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dEVMLm5hdGl2ZUVsZW1lbnQudmFsdWUgPSBmb3JtYXR0ZWRWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudXBkYXRlRmlsbGVkU3RhdGUoKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKCdkb2N1bWVudCcsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC53aGljaCA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlucHV0Q2xpY2sgJiYgIXRoaXMuaXNEcm9wZG93bkNsaWNrKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Q2xpY2sgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc0Ryb3Bkb3duQ2xpY2soZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJvcGRvd24pIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gICAgICAgICAgICByZXR1cm4gKHRhcmdldCA9PT0gdGhpcy5kcm9wZG93bkJ1dHRvbi5uYXRpdmVFbGVtZW50IHx8IHRhcmdldC5wYXJlbnROb2RlID09PSB0aGlzLmRyb3Bkb3duQnV0dG9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyKTtcbiAgICB9XG4gICAgXG4gICAgdW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25XaW5kb3dSZXNpemUoKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUhpZGUoKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLm92ZXJsYXkgPSBudWxsO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnJlc3RvcmVPdmVybGF5QXBwZW5kKCk7XG4gICAgICAgIHRoaXMub25PdmVybGF5SGlkZSgpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLElucHV0VGV4dE1vZHVsZSxCdXR0b25Nb2R1bGUsU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQXV0b0NvbXBsZXRlLFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbQXV0b0NvbXBsZXRlXVxufSlcbmV4cG9ydCBjbGFzcyBBdXRvQ29tcGxldGVNb2R1bGUgeyB9XG4iXX0=