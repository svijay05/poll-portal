var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, ElementRef, AfterContentInit, AfterViewChecked, Input, Output, ContentChildren, QueryList, TemplateRef, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { ObjectUtils } from 'primeng/utils';
import { FilterUtils } from 'primeng/utils';
let PickList = class PickList {
    constructor(el) {
        this.el = el;
        this.trackBy = (index, item) => item;
        this.showSourceFilter = true;
        this.showTargetFilter = true;
        this.metaKeySelection = true;
        this.showSourceControls = true;
        this.showTargetControls = true;
        this.disabled = false;
        this.filterMatchMode = "contains";
        this.onMoveToSource = new EventEmitter();
        this.onMoveAllToSource = new EventEmitter();
        this.onMoveAllToTarget = new EventEmitter();
        this.onMoveToTarget = new EventEmitter();
        this.onSourceReorder = new EventEmitter();
        this.onTargetReorder = new EventEmitter();
        this.onSourceSelect = new EventEmitter();
        this.onTargetSelect = new EventEmitter();
        this.onSourceFilter = new EventEmitter();
        this.onTargetFilter = new EventEmitter();
        this.selectedItemsSource = [];
        this.selectedItemsTarget = [];
        this.SOURCE_LIST = -1;
        this.TARGET_LIST = 1;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'emptymessagesource':
                    this.emptyMessageSourceTemplate = item.template;
                    break;
                case 'emptymessagetarget':
                    this.emptyMessageTargetTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewChecked() {
        if (this.movedUp || this.movedDown) {
            let listItems = DomHandler.find(this.reorderedListElement, 'li.ui-state-highlight');
            let listItem;
            if (this.movedUp)
                listItem = listItems[0];
            else
                listItem = listItems[listItems.length - 1];
            DomHandler.scrollInView(this.reorderedListElement, listItem);
            this.movedUp = false;
            this.movedDown = false;
            this.reorderedListElement = null;
        }
    }
    onItemClick(event, item, selectedItems, callback) {
        if (this.disabled) {
            return;
        }
        let index = this.findIndexInSelection(item, selectedItems);
        let selected = (index != -1);
        let metaSelection = this.itemTouched ? false : this.metaKeySelection;
        if (metaSelection) {
            let metaKey = (event.metaKey || event.ctrlKey || event.shiftKey);
            if (selected && metaKey) {
                selectedItems.splice(index, 1);
            }
            else {
                if (!metaKey) {
                    selectedItems.length = 0;
                }
                selectedItems.push(item);
            }
        }
        else {
            if (selected)
                selectedItems.splice(index, 1);
            else
                selectedItems.push(item);
        }
        callback.emit({ originalEvent: event, items: selectedItems });
        this.itemTouched = false;
    }
    onSourceItemDblClick() {
        if (this.disabled) {
            return;
        }
        this.moveRight();
    }
    onTargetItemDblClick() {
        if (this.disabled) {
            return;
        }
        this.moveLeft();
    }
    onFilter(event, data, listType) {
        let query = event.target.value.trim().toLowerCase();
        let searchFields = this.filterBy.split(',');
        if (listType === this.SOURCE_LIST) {
            this.filterValueSource = query;
            this.visibleOptionsSource = FilterUtils.filter(data, searchFields, this.filterValueSource, this.filterMatchMode);
            this.onSourceFilter.emit({ query: this.filterValueSource, value: this.visibleOptionsSource });
        }
        else if (listType === this.TARGET_LIST) {
            this.filterValueTarget = query;
            this.visibleOptionsTarget = FilterUtils.filter(data, searchFields, this.filterValueTarget, this.filterMatchMode);
            this.onTargetFilter.emit({ query: this.filterValueTarget, value: this.visibleOptionsTarget });
        }
    }
    isItemVisible(item, listType) {
        if (listType == this.SOURCE_LIST)
            return this.isVisibleInList(this.visibleOptionsSource, item, this.filterValueSource);
        else
            return this.isVisibleInList(this.visibleOptionsTarget, item, this.filterValueTarget);
    }
    isVisibleInList(data, item, filterValue) {
        if (filterValue && filterValue.trim().length) {
            for (let i = 0; i < data.length; i++) {
                if (item == data[i]) {
                    return true;
                }
            }
        }
        else {
            return true;
        }
    }
    onItemTouchEnd(event) {
        if (this.disabled) {
            return;
        }
        this.itemTouched = true;
    }
    sortByIndexInList(items, list) {
        return items.sort((item1, item2) => this.findIndexInList(item1, list) - this.findIndexInList(item2, list));
    }
    moveUp(listElement, list, selectedItems, callback) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = this.findIndexInList(selectedItem, list);
                if (selectedItemIndex != 0) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex - 1];
                    list[selectedItemIndex - 1] = movedItem;
                    list[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            this.movedUp = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
        }
    }
    moveTop(listElement, list, selectedItems, callback) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = 0; i < selectedItems.length; i++) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = this.findIndexInList(selectedItem, list);
                if (selectedItemIndex != 0) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.unshift(movedItem);
                }
                else {
                    break;
                }
            }
            listElement.scrollTop = 0;
            callback.emit({ items: selectedItems });
        }
    }
    moveDown(listElement, list, selectedItems, callback) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = this.findIndexInList(selectedItem, list);
                if (selectedItemIndex != (list.length - 1)) {
                    let movedItem = list[selectedItemIndex];
                    let temp = list[selectedItemIndex + 1];
                    list[selectedItemIndex + 1] = movedItem;
                    list[selectedItemIndex] = temp;
                }
                else {
                    break;
                }
            }
            this.movedDown = true;
            this.reorderedListElement = listElement;
            callback.emit({ items: selectedItems });
        }
    }
    moveBottom(listElement, list, selectedItems, callback) {
        if (selectedItems && selectedItems.length) {
            selectedItems = this.sortByIndexInList(selectedItems, list);
            for (let i = selectedItems.length - 1; i >= 0; i--) {
                let selectedItem = selectedItems[i];
                let selectedItemIndex = this.findIndexInList(selectedItem, list);
                if (selectedItemIndex != (list.length - 1)) {
                    let movedItem = list.splice(selectedItemIndex, 1)[0];
                    list.push(movedItem);
                }
                else {
                    break;
                }
            }
            listElement.scrollTop = listElement.scrollHeight;
            callback.emit({ items: selectedItems });
        }
    }
    moveRight() {
        if (this.selectedItemsSource && this.selectedItemsSource.length) {
            for (let i = 0; i < this.selectedItemsSource.length; i++) {
                let selectedItem = this.selectedItemsSource[i];
                if (this.findIndexInList(selectedItem, this.target) == -1) {
                    this.target.push(this.source.splice(this.findIndexInList(selectedItem, this.source), 1)[0]);
                }
            }
            this.onMoveToTarget.emit({
                items: this.selectedItemsSource
            });
            this.selectedItemsSource = [];
        }
    }
    moveAllRight() {
        if (this.source) {
            let movedItems = [];
            for (let i = 0; i < this.source.length; i++) {
                if (this.isItemVisible(this.source[i], this.SOURCE_LIST)) {
                    let removedItem = this.source.splice(i, 1)[0];
                    this.target.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveToTarget.emit({
                items: movedItems
            });
            this.onMoveAllToTarget.emit({
                items: movedItems
            });
            this.selectedItemsSource = [];
        }
    }
    moveLeft() {
        if (this.selectedItemsTarget && this.selectedItemsTarget.length) {
            for (let i = 0; i < this.selectedItemsTarget.length; i++) {
                let selectedItem = this.selectedItemsTarget[i];
                if (this.findIndexInList(selectedItem, this.source) == -1) {
                    this.source.push(this.target.splice(this.findIndexInList(selectedItem, this.target), 1)[0]);
                }
            }
            this.onMoveToSource.emit({
                items: this.selectedItemsTarget
            });
            this.selectedItemsTarget = [];
        }
    }
    moveAllLeft() {
        if (this.target) {
            let movedItems = [];
            for (let i = 0; i < this.target.length; i++) {
                if (this.isItemVisible(this.target[i], this.TARGET_LIST)) {
                    let removedItem = this.target.splice(i, 1)[0];
                    this.source.push(removedItem);
                    movedItems.push(removedItem);
                    i--;
                }
            }
            this.onMoveToSource.emit({
                items: movedItems
            });
            this.onMoveAllToSource.emit({
                items: movedItems
            });
            this.selectedItemsTarget = [];
        }
    }
    isSelected(item, selectedItems) {
        return this.findIndexInSelection(item, selectedItems) != -1;
    }
    findIndexInSelection(item, selectedItems) {
        return this.findIndexInList(item, selectedItems);
    }
    findIndexInList(item, list) {
        let index = -1;
        if (list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] == item) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    }
    onDragStart(event, index, listType) {
        event.dataTransfer.setData('text', 'b'); // For firefox
        event.target.blur();
        this.dragging = true;
        this.fromListType = listType;
        if (listType === this.SOURCE_LIST)
            this.draggedItemIndexSource = index;
        else
            this.draggedItemIndexTarget = index;
    }
    onDragOver(event, index, listType) {
        if (this.dragging) {
            if (listType == this.SOURCE_LIST) {
                if (this.draggedItemIndexSource !== index && this.draggedItemIndexSource + 1 !== index || (this.fromListType === this.TARGET_LIST)) {
                    this.dragOverItemIndexSource = index;
                    event.preventDefault();
                }
            }
            else {
                if (this.draggedItemIndexTarget !== index && this.draggedItemIndexTarget + 1 !== index || (this.fromListType === this.SOURCE_LIST)) {
                    this.dragOverItemIndexTarget = index;
                    event.preventDefault();
                }
            }
            this.onListItemDroppoint = true;
        }
    }
    onDragLeave(event, listType) {
        this.dragOverItemIndexSource = null;
        this.dragOverItemIndexTarget = null;
        this.onListItemDroppoint = false;
    }
    onDrop(event, index, listType) {
        if (this.onListItemDroppoint) {
            if (listType === this.SOURCE_LIST) {
                if (this.fromListType === this.TARGET_LIST) {
                    this.insert(this.draggedItemIndexTarget, this.target, index, this.source, this.onMoveToSource);
                }
                else {
                    ObjectUtils.reorderArray(this.source, this.draggedItemIndexSource, (this.draggedItemIndexSource > index) ? index : (index === 0) ? 0 : index - 1);
                    this.onSourceReorder.emit({ items: this.source[this.draggedItemIndexSource] });
                }
                this.dragOverItemIndexSource = null;
            }
            else {
                if (this.fromListType === this.SOURCE_LIST) {
                    this.insert(this.draggedItemIndexSource, this.source, index, this.target, this.onMoveToTarget);
                }
                else {
                    ObjectUtils.reorderArray(this.target, this.draggedItemIndexTarget, (this.draggedItemIndexTarget > index) ? index : (index === 0) ? 0 : index - 1);
                    this.onTargetReorder.emit({ items: this.target[this.draggedItemIndexTarget] });
                }
                this.dragOverItemIndexTarget = null;
            }
            this.listHighlightTarget = false;
            this.listHighlightSource = false;
            event.preventDefault();
        }
    }
    onDragEnd(event) {
        this.dragging = false;
    }
    onListDrop(event, listType) {
        if (!this.onListItemDroppoint) {
            if (listType === this.SOURCE_LIST) {
                if (this.fromListType === this.TARGET_LIST) {
                    this.insert(this.draggedItemIndexTarget, this.target, null, this.source, this.onMoveToSource);
                }
            }
            else {
                if (this.fromListType === this.SOURCE_LIST) {
                    this.insert(this.draggedItemIndexSource, this.source, null, this.target, this.onMoveToTarget);
                }
            }
            this.listHighlightTarget = false;
            this.listHighlightSource = false;
            event.preventDefault();
        }
    }
    insert(fromIndex, fromList, toIndex, toList, callback) {
        const elementtomove = fromList[fromIndex];
        if (toIndex === null)
            toList.push(fromList.splice(fromIndex, 1)[0]);
        else
            toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0]);
        callback.emit({
            items: [elementtomove]
        });
    }
    onListMouseMove(event, listType) {
        if (this.dragging) {
            let moveListType = (listType == 0 ? this.listViewSourceChild : this.listViewTargetChild);
            let offsetY = moveListType.nativeElement.getBoundingClientRect().top + document.body.scrollTop;
            let bottomDiff = (offsetY + moveListType.nativeElement.clientHeight) - event.pageY;
            let topDiff = (event.pageY - offsetY);
            if (bottomDiff < 25 && bottomDiff > 0)
                moveListType.nativeElement.scrollTop += 15;
            else if (topDiff < 25 && topDiff > 0)
                moveListType.nativeElement.scrollTop -= 15;
            if (listType === this.SOURCE_LIST) {
                if (this.fromListType === this.TARGET_LIST)
                    this.listHighlightSource = true;
            }
            else {
                if (this.fromListType === this.SOURCE_LIST)
                    this.listHighlightTarget = true;
            }
            event.preventDefault();
        }
    }
    onListDragLeave() {
        this.listHighlightTarget = false;
        this.listHighlightSource = false;
    }
    resetFilter() {
        this.visibleOptionsSource = null;
        this.filterValueSource = null;
        this.visibleOptionsTarget = null;
        this.filterValueTarget = null;
        this.sourceFilterViewChild.nativeElement.value = '';
        this.targetFilterViewChild.nativeElement.value = '';
    }
    onItemKeydown(event, item, selectedItems, callback) {
        let listItem = event.currentTarget;
        switch (event.which) {
            //down
            case 40:
                var nextItem = this.findNextItem(listItem);
                if (nextItem) {
                    nextItem.focus();
                }
                event.preventDefault();
                break;
            //up
            case 38:
                var prevItem = this.findPrevItem(listItem);
                if (prevItem) {
                    prevItem.focus();
                }
                event.preventDefault();
                break;
            //enter
            case 13:
                this.onItemClick(event, item, selectedItems, callback);
                event.preventDefault();
                break;
        }
    }
    findNextItem(item) {
        let nextItem = item.nextElementSibling;
        if (nextItem)
            return !DomHandler.hasClass(nextItem, 'ui-picklist-item') || DomHandler.isHidden(nextItem) ? this.findNextItem(nextItem) : nextItem;
        else
            return null;
    }
    findPrevItem(item) {
        let prevItem = item.previousElementSibling;
        if (prevItem)
            return !DomHandler.hasClass(prevItem, 'ui-picklist-item') || DomHandler.isHidden(prevItem) ? this.findPrevItem(prevItem) : prevItem;
        else
            return null;
    }
};
PickList.ctorParameters = () => [
    { type: ElementRef }
];
__decorate([
    Input()
], PickList.prototype, "source", void 0);
__decorate([
    Input()
], PickList.prototype, "target", void 0);
__decorate([
    Input()
], PickList.prototype, "sourceHeader", void 0);
__decorate([
    Input()
], PickList.prototype, "targetHeader", void 0);
__decorate([
    Input()
], PickList.prototype, "responsive", void 0);
__decorate([
    Input()
], PickList.prototype, "filterBy", void 0);
__decorate([
    Input()
], PickList.prototype, "trackBy", void 0);
__decorate([
    Input()
], PickList.prototype, "sourceTrackBy", void 0);
__decorate([
    Input()
], PickList.prototype, "targetTrackBy", void 0);
__decorate([
    Input()
], PickList.prototype, "showSourceFilter", void 0);
__decorate([
    Input()
], PickList.prototype, "showTargetFilter", void 0);
__decorate([
    Input()
], PickList.prototype, "metaKeySelection", void 0);
__decorate([
    Input()
], PickList.prototype, "dragdrop", void 0);
__decorate([
    Input()
], PickList.prototype, "style", void 0);
__decorate([
    Input()
], PickList.prototype, "styleClass", void 0);
__decorate([
    Input()
], PickList.prototype, "sourceStyle", void 0);
__decorate([
    Input()
], PickList.prototype, "targetStyle", void 0);
__decorate([
    Input()
], PickList.prototype, "showSourceControls", void 0);
__decorate([
    Input()
], PickList.prototype, "showTargetControls", void 0);
__decorate([
    Input()
], PickList.prototype, "sourceFilterPlaceholder", void 0);
__decorate([
    Input()
], PickList.prototype, "targetFilterPlaceholder", void 0);
__decorate([
    Input()
], PickList.prototype, "disabled", void 0);
__decorate([
    Input()
], PickList.prototype, "ariaSourceFilterLabel", void 0);
__decorate([
    Input()
], PickList.prototype, "ariaTargetFilterLabel", void 0);
__decorate([
    Input()
], PickList.prototype, "filterMatchMode", void 0);
__decorate([
    Output()
], PickList.prototype, "onMoveToSource", void 0);
__decorate([
    Output()
], PickList.prototype, "onMoveAllToSource", void 0);
__decorate([
    Output()
], PickList.prototype, "onMoveAllToTarget", void 0);
__decorate([
    Output()
], PickList.prototype, "onMoveToTarget", void 0);
__decorate([
    Output()
], PickList.prototype, "onSourceReorder", void 0);
__decorate([
    Output()
], PickList.prototype, "onTargetReorder", void 0);
__decorate([
    Output()
], PickList.prototype, "onSourceSelect", void 0);
__decorate([
    Output()
], PickList.prototype, "onTargetSelect", void 0);
__decorate([
    Output()
], PickList.prototype, "onSourceFilter", void 0);
__decorate([
    Output()
], PickList.prototype, "onTargetFilter", void 0);
__decorate([
    ViewChild('sourcelist', { static: true })
], PickList.prototype, "listViewSourceChild", void 0);
__decorate([
    ViewChild('targetlist', { static: true })
], PickList.prototype, "listViewTargetChild", void 0);
__decorate([
    ViewChild('sourceFilter', { static: false })
], PickList.prototype, "sourceFilterViewChild", void 0);
__decorate([
    ViewChild('targetFilter', { static: false })
], PickList.prototype, "targetFilterViewChild", void 0);
__decorate([
    ContentChildren(PrimeTemplate)
], PickList.prototype, "templates", void 0);
PickList = __decorate([
    Component({
        selector: 'p-pickList',
        template: `
        <div [class]="styleClass" [ngStyle]="style" [ngClass]="{'ui-picklist ui-widget ui-helper-clearfix': true,'ui-picklist-responsive': responsive}">
            <div class="ui-picklist-source-controls ui-picklist-buttons" *ngIf="showSourceControls">
                <div class="ui-picklist-buttons-cell">
                    <button type="button" pButton icon="pi pi-angle-up" [disabled]="disabled" (click)="moveUp(sourcelist,source,selectedItemsSource,onSourceReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-double-up" [disabled]="disabled" (click)="moveTop(sourcelist,source,selectedItemsSource,onSourceReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-down" [disabled]="disabled" (click)="moveDown(sourcelist,source,selectedItemsSource,onSourceReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-double-down" [disabled]="disabled" (click)="moveBottom(sourcelist,source,selectedItemsSource,onSourceReorder)"></button>
                </div>
            </div>
            <div class="ui-picklist-listwrapper ui-picklist-source-wrapper" [ngClass]="{'ui-picklist-listwrapper-nocontrols':!showSourceControls}">
                <div class="ui-picklist-caption ui-widget-header ui-corner-tl ui-corner-tr" *ngIf="sourceHeader">{{sourceHeader}}</div>
                <div class="ui-picklist-filter-container ui-widget-content" *ngIf="filterBy && showSourceFilter !== false">
                    <input #sourceFilter type="text" role="textbox" (keyup)="onFilter($event,source,SOURCE_LIST)" class="ui-picklist-filter ui-inputtext ui-widget ui-state-default ui-corner-all" [disabled]="disabled" [attr.placeholder]="sourceFilterPlaceholder" [attr.aria-label]="ariaSourceFilterLabel">
                    <span class="ui-picklist-filter-icon pi pi-search"></span>
                </div>
                <ul #sourcelist class="ui-widget-content ui-picklist-list ui-picklist-source ui-corner-bottom" [ngClass]="{'ui-picklist-highlight': listHighlightSource}" 
                    [ngStyle]="sourceStyle" (dragover)="onListMouseMove($event,SOURCE_LIST)" (dragleave)="onListDragLeave()" (drop)="onListDrop($event, SOURCE_LIST)" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="source" [ngForTrackBy]="sourceTrackBy || trackBy" let-i="index" let-l="last">
                        <li class="ui-picklist-droppoint" *ngIf="dragdrop" (dragover)="onDragOver($event, i, SOURCE_LIST)" (drop)="onDrop($event, i, SOURCE_LIST)" (dragleave)="onDragLeave($event, SOURCE_LIST)"
                        [ngClass]="{'ui-picklist-droppoint-highlight': (i === dragOverItemIndexSource)}" [style.display]="isItemVisible(item, SOURCE_LIST) ? 'block' : 'none'"></li>
                        <li [ngClass]="{'ui-picklist-item':true,'ui-state-highlight':isSelected(item,selectedItemsSource), 'ui-state-disabled': disabled}"
                            (click)="onItemClick($event,item,selectedItemsSource,onSourceSelect)" (dblclick)="onSourceItemDblClick()" (touchend)="onItemTouchEnd($event)" (keydown)="onItemKeydown($event,item,selectedItemsSource,onSourceSelect)"
                            [style.display]="isItemVisible(item, SOURCE_LIST) ? 'block' : 'none'" tabindex="0" role="option" [attr.aria-selected]="isSelected(item, selectedItemsSource)"
                            [draggable]="dragdrop" (dragstart)="onDragStart($event, i, SOURCE_LIST)" (dragend)="onDragEnd($event)">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                        </li>
                        <li class="ui-picklist-droppoint" *ngIf="dragdrop&&l" (dragover)="onDragOver($event, i + 1, SOURCE_LIST)" (drop)="onDrop($event, i + 1, SOURCE_LIST)" (dragleave)="onDragLeave($event, SOURCE_LIST)"
                        [ngClass]="{'ui-picklist-droppoint-highlight': (i + 1 === dragOverItemIndexSource)}"></li>
                    </ng-template>
                    <ng-container *ngIf="(source == null || source.length === 0) && emptyMessageSourceTemplate">
                        <li class="ui-picklist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyMessageSourceTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="ui-picklist-buttons">
                <div class="ui-picklist-buttons-cell">
                    <button type="button" pButton icon="pi pi-angle-right" [disabled]="disabled" (click)="moveRight()"></button>
                    <button type="button" pButton icon="pi pi-angle-double-right" [disabled]="disabled" (click)="moveAllRight()"></button>
                    <button type="button" pButton icon="pi pi-angle-left" [disabled]="disabled" (click)="moveLeft()"></button>
                    <button type="button" pButton icon="pi pi-angle-double-left" [disabled]="disabled" (click)="moveAllLeft()"></button>
                </div>
            </div>
            <div class="ui-picklist-listwrapper ui-picklist-target-wrapper" [ngClass]="{'ui-picklist-listwrapper-nocontrols':!showTargetControls}">
                <div class="ui-picklist-caption ui-widget-header ui-corner-tl ui-corner-tr" *ngIf="targetHeader">{{targetHeader}}</div>
                <div class="ui-picklist-filter-container ui-widget-content" *ngIf="filterBy && showTargetFilter !== false">
                    <input #targetFilter type="text" role="textbox" (keyup)="onFilter($event,target,TARGET_LIST)" class="ui-picklist-filter ui-inputtext ui-widget ui-state-default ui-corner-all" [disabled]="disabled" [attr.placeholder]="targetFilterPlaceholder" [attr.aria-label]="ariaTargetFilterLabel">
                    <span class="ui-picklist-filter-icon pi pi-search"></span>
                </div>
                <ul #targetlist class="ui-widget-content ui-picklist-list ui-picklist-target ui-corner-bottom" [ngClass]="{'ui-picklist-highlight': listHighlightTarget}" 
                    [ngStyle]="targetStyle" (dragover)="onListMouseMove($event,TARGET_LIST)" (dragleave)="onListDragLeave()" (drop)="onListDrop($event,TARGET_LIST)" role="listbox" aria-multiselectable="multiple">
                    <ng-template ngFor let-item [ngForOf]="target" [ngForTrackBy]="targetTrackBy || trackBy" let-i="index" let-l="last">
                        <li class="ui-picklist-droppoint" *ngIf="dragdrop" (dragover)="onDragOver($event, i, TARGET_LIST)" (drop)="onDrop($event, i, TARGET_LIST)" (dragleave)="onDragLeave($event, TARGET_LIST)"
                        [ngClass]="{'ui-picklist-droppoint-highlight': (i === dragOverItemIndexTarget)}" [style.display]="isItemVisible(item, TARGET_LIST) ? 'block' : 'none'"></li>
                        <li [ngClass]="{'ui-picklist-item':true,'ui-state-highlight':isSelected(item,selectedItemsTarget), 'ui-state-disabled': disabled}"
                            (click)="onItemClick($event,item,selectedItemsTarget,onTargetSelect)" (dblclick)="onTargetItemDblClick()" (touchend)="onItemTouchEnd($event)" (keydown)="onItemKeydown($event,item,selectedItemsTarget,onTargetSelect)"
                            [style.display]="isItemVisible(item, TARGET_LIST) ? 'block' : 'none'" tabindex="0" role="option" [attr.aria-selected]="isSelected(item, selectedItemsTarget)"
                            [draggable]="dragdrop" (dragstart)="onDragStart($event, i, TARGET_LIST)" (dragend)="onDragEnd($event)">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: {$implicit: item, index: i}"></ng-container>
                        </li>
                        <li class="ui-picklist-droppoint" *ngIf="dragdrop&&l" (dragover)="onDragOver($event, i + 1, TARGET_LIST)" (drop)="onDrop($event, i + 1, TARGET_LIST)" (dragleave)="onDragLeave($event, TARGET_LIST)"
                        [ngClass]="{'ui-picklist-droppoint-highlight': (i + 1 === dragOverItemIndexTarget)}"></li>
                    </ng-template>
                    <ng-container *ngIf="(target == null || target.length === 0) && emptyMessageTargetTemplate">
                        <li class="ui-picklist-empty-message">
                            <ng-container *ngTemplateOutlet="emptyMessageTargetTemplate"></ng-container>
                        </li>
                    </ng-container>
                </ul>
            </div>
            <div class="ui-picklist-target-controls ui-picklist-buttons" *ngIf="showTargetControls">
                <div class="ui-picklist-buttons-cell">
                    <button type="button" pButton icon="pi pi-angle-up" [disabled]="disabled" (click)="moveUp(targetlist,target,selectedItemsTarget,onTargetReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-double-up" [disabled]="disabled" (click)="moveTop(targetlist,target,selectedItemsTarget,onTargetReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-down" [disabled]="disabled" (click)="moveDown(targetlist,target,selectedItemsTarget,onTargetReorder)"></button>
                    <button type="button" pButton icon="pi pi-angle-double-down" [disabled]="disabled" (click)="moveBottom(targetlist,target,selectedItemsTarget,onTargetReorder)"></button>
                </div>
            </div>
        </div>
    `
    })
], PickList);
export { PickList };
let PickListModule = class PickListModule {
};
PickListModule = __decorate([
    NgModule({
        imports: [CommonModule, ButtonModule, SharedModule],
        exports: [PickList, SharedModule],
        declarations: [PickList]
    })
], PickListModule);
export { PickListModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2xpc3QuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL3BpY2tsaXN0LyIsInNvdXJjZXMiOlsicGlja2xpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwTCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQzVDLE9BQU8sRUFBQyxZQUFZLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3ZELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDdkMsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBdUY1QyxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFRO0lBb0lqQixZQUFtQixFQUFjO1FBQWQsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQXRIeEIsWUFBTyxHQUFhLENBQUMsS0FBYSxFQUFFLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDO1FBTXZELHFCQUFnQixHQUFZLElBQUksQ0FBQztRQUVqQyxxQkFBZ0IsR0FBWSxJQUFJLENBQUM7UUFFakMscUJBQWdCLEdBQVksSUFBSSxDQUFDO1FBWWpDLHVCQUFrQixHQUFZLElBQUksQ0FBQztRQUVuQyx1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFNbkMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQU0xQixvQkFBZSxHQUFXLFVBQVUsQ0FBQztRQUVwQyxtQkFBYyxHQUFzQixJQUFJLFlBQVks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QUMsUUFBUSxDQUFDO0tBQzNCLENBQUM7R0FDVyxjQUFjLENBQUk7U0FBbEIsY0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0NoZWNrZWQsIElucHV0LCBPdXRwdXQsIENvbnRlbnRDaGlsZHJlbiwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgRXZlbnRFbWl0dGVyLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0J1dHRvbk1vZHVsZX0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHtTaGFyZWRNb2R1bGUsUHJpbWVUZW1wbGF0ZX0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHtEb21IYW5kbGVyfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQge09iamVjdFV0aWxzfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IEZpbHRlclV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1waWNrTGlzdCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW25nQ2xhc3NdPVwieyd1aS1waWNrbGlzdCB1aS13aWRnZXQgdWktaGVscGVyLWNsZWFyZml4JzogdHJ1ZSwndWktcGlja2xpc3QtcmVzcG9uc2l2ZSc6IHJlc3BvbnNpdmV9XCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGlja2xpc3Qtc291cmNlLWNvbnRyb2xzIHVpLXBpY2tsaXN0LWJ1dHRvbnNcIiAqbmdJZj1cInNob3dTb3VyY2VDb250cm9sc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1idXR0b25zLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtdXBcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZVVwKHNvdXJjZWxpc3Qsc291cmNlLHNlbGVjdGVkSXRlbXNTb3VyY2Usb25Tb3VyY2VSZW9yZGVyKVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIGljb249XCJwaSBwaS1hbmdsZS1kb3VibGUtdXBcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZVRvcChzb3VyY2VsaXN0LHNvdXJjZSxzZWxlY3RlZEl0ZW1zU291cmNlLG9uU291cmNlUmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtZG93blwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIChjbGljayk9XCJtb3ZlRG93bihzb3VyY2VsaXN0LHNvdXJjZSxzZWxlY3RlZEl0ZW1zU291cmNlLG9uU291cmNlUmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtZG91YmxlLWRvd25cIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZUJvdHRvbShzb3VyY2VsaXN0LHNvdXJjZSxzZWxlY3RlZEl0ZW1zU291cmNlLG9uU291cmNlUmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLXBpY2tsaXN0LWxpc3R3cmFwcGVyIHVpLXBpY2tsaXN0LXNvdXJjZS13cmFwcGVyXCIgW25nQ2xhc3NdPVwieyd1aS1waWNrbGlzdC1saXN0d3JhcHBlci1ub2NvbnRyb2xzJzohc2hvd1NvdXJjZUNvbnRyb2xzfVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1jYXB0aW9uIHVpLXdpZGdldC1oZWFkZXIgdWktY29ybmVyLXRsIHVpLWNvcm5lci10clwiICpuZ0lmPVwic291cmNlSGVhZGVyXCI+e3tzb3VyY2VIZWFkZXJ9fTwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1maWx0ZXItY29udGFpbmVyIHVpLXdpZGdldC1jb250ZW50XCIgKm5nSWY9XCJmaWx0ZXJCeSAmJiBzaG93U291cmNlRmlsdGVyICE9PSBmYWxzZVwiPlxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgI3NvdXJjZUZpbHRlciB0eXBlPVwidGV4dFwiIHJvbGU9XCJ0ZXh0Ym94XCIgKGtleXVwKT1cIm9uRmlsdGVyKCRldmVudCxzb3VyY2UsU09VUkNFX0xJU1QpXCIgY2xhc3M9XCJ1aS1waWNrbGlzdC1maWx0ZXIgdWktaW5wdXR0ZXh0IHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGxcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbYXR0ci5wbGFjZWhvbGRlcl09XCJzb3VyY2VGaWx0ZXJQbGFjZWhvbGRlclwiIFthdHRyLmFyaWEtbGFiZWxdPVwiYXJpYVNvdXJjZUZpbHRlckxhYmVsXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktcGlja2xpc3QtZmlsdGVyLWljb24gcGkgcGktc2VhcmNoXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDx1bCAjc291cmNlbGlzdCBjbGFzcz1cInVpLXdpZGdldC1jb250ZW50IHVpLXBpY2tsaXN0LWxpc3QgdWktcGlja2xpc3Qtc291cmNlIHVpLWNvcm5lci1ib3R0b21cIiBbbmdDbGFzc109XCJ7J3VpLXBpY2tsaXN0LWhpZ2hsaWdodCc6IGxpc3RIaWdobGlnaHRTb3VyY2V9XCIgXG4gICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInNvdXJjZVN0eWxlXCIgKGRyYWdvdmVyKT1cIm9uTGlzdE1vdXNlTW92ZSgkZXZlbnQsU09VUkNFX0xJU1QpXCIgKGRyYWdsZWF2ZSk9XCJvbkxpc3REcmFnTGVhdmUoKVwiIChkcm9wKT1cIm9uTGlzdERyb3AoJGV2ZW50LCBTT1VSQ0VfTElTVClcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbXVsdGlzZWxlY3RhYmxlPVwibXVsdGlwbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cInNvdXJjZVwiIFtuZ0ZvclRyYWNrQnldPVwic291cmNlVHJhY2tCeSB8fCB0cmFja0J5XCIgbGV0LWk9XCJpbmRleFwiIGxldC1sPVwibGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwidWktcGlja2xpc3QtZHJvcHBvaW50XCIgKm5nSWY9XCJkcmFnZHJvcFwiIChkcmFnb3Zlcik9XCJvbkRyYWdPdmVyKCRldmVudCwgaSwgU09VUkNFX0xJU1QpXCIgKGRyb3ApPVwib25Ecm9wKCRldmVudCwgaSwgU09VUkNFX0xJU1QpXCIgKGRyYWdsZWF2ZSk9XCJvbkRyYWdMZWF2ZSgkZXZlbnQsIFNPVVJDRV9MSVNUKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLXBpY2tsaXN0LWRyb3Bwb2ludC1oaWdobGlnaHQnOiAoaSA9PT0gZHJhZ092ZXJJdGVtSW5kZXhTb3VyY2UpfVwiIFtzdHlsZS5kaXNwbGF5XT1cImlzSXRlbVZpc2libGUoaXRlbSwgU09VUkNFX0xJU1QpID8gJ2Jsb2NrJyA6ICdub25lJ1wiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgW25nQ2xhc3NdPVwieyd1aS1waWNrbGlzdC1pdGVtJzp0cnVlLCd1aS1zdGF0ZS1oaWdobGlnaHQnOmlzU2VsZWN0ZWQoaXRlbSxzZWxlY3RlZEl0ZW1zU291cmNlKSwgJ3VpLXN0YXRlLWRpc2FibGVkJzogZGlzYWJsZWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LGl0ZW0sc2VsZWN0ZWRJdGVtc1NvdXJjZSxvblNvdXJjZVNlbGVjdClcIiAoZGJsY2xpY2spPVwib25Tb3VyY2VJdGVtRGJsQ2xpY2soKVwiICh0b3VjaGVuZCk9XCJvbkl0ZW1Ub3VjaEVuZCgkZXZlbnQpXCIgKGtleWRvd24pPVwib25JdGVtS2V5ZG93bigkZXZlbnQsaXRlbSxzZWxlY3RlZEl0ZW1zU291cmNlLG9uU291cmNlU2VsZWN0KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwiaXNJdGVtVmlzaWJsZShpdGVtLCBTT1VSQ0VfTElTVCkgPyAnYmxvY2snIDogJ25vbmUnXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cIm9wdGlvblwiIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChpdGVtLCBzZWxlY3RlZEl0ZW1zU291cmNlKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RyYWdnYWJsZV09XCJkcmFnZHJvcFwiIChkcmFnc3RhcnQpPVwib25EcmFnU3RhcnQoJGV2ZW50LCBpLCBTT1VSQ0VfTElTVClcIiAoZHJhZ2VuZCk9XCJvbkRyYWdFbmQoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW0sIGluZGV4OiBpfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInVpLXBpY2tsaXN0LWRyb3Bwb2ludFwiICpuZ0lmPVwiZHJhZ2Ryb3AmJmxcIiAoZHJhZ292ZXIpPVwib25EcmFnT3ZlcigkZXZlbnQsIGkgKyAxLCBTT1VSQ0VfTElTVClcIiAoZHJvcCk9XCJvbkRyb3AoJGV2ZW50LCBpICsgMSwgU09VUkNFX0xJU1QpXCIgKGRyYWdsZWF2ZSk9XCJvbkRyYWdMZWF2ZSgkZXZlbnQsIFNPVVJDRV9MSVNUKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLXBpY2tsaXN0LWRyb3Bwb2ludC1oaWdobGlnaHQnOiAoaSArIDEgPT09IGRyYWdPdmVySXRlbUluZGV4U291cmNlKX1cIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiKHNvdXJjZSA9PSBudWxsIHx8IHNvdXJjZS5sZW5ndGggPT09IDApICYmIGVtcHR5TWVzc2FnZVNvdXJjZVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJ1aS1waWNrbGlzdC1lbXB0eS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVtcHR5TWVzc2FnZVNvdXJjZVRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGlja2xpc3QtYnV0dG9uc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1idXR0b25zLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtcmlnaHRcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZVJpZ2h0KClcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtZG91YmxlLXJpZ2h0XCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgKGNsaWNrKT1cIm1vdmVBbGxSaWdodCgpXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIHBCdXR0b24gaWNvbj1cInBpIHBpLWFuZ2xlLWxlZnRcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZUxlZnQoKVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIGljb249XCJwaSBwaS1hbmdsZS1kb3VibGUtbGVmdFwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIChjbGljayk9XCJtb3ZlQWxsTGVmdCgpXCI+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1saXN0d3JhcHBlciB1aS1waWNrbGlzdC10YXJnZXQtd3JhcHBlclwiIFtuZ0NsYXNzXT1cInsndWktcGlja2xpc3QtbGlzdHdyYXBwZXItbm9jb250cm9scyc6IXNob3dUYXJnZXRDb250cm9sc31cIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGlja2xpc3QtY2FwdGlvbiB1aS13aWRnZXQtaGVhZGVyIHVpLWNvcm5lci10bCB1aS1jb3JuZXItdHJcIiAqbmdJZj1cInRhcmdldEhlYWRlclwiPnt7dGFyZ2V0SGVhZGVyfX08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGlja2xpc3QtZmlsdGVyLWNvbnRhaW5lciB1aS13aWRnZXQtY29udGVudFwiICpuZ0lmPVwiZmlsdGVyQnkgJiYgc2hvd1RhcmdldEZpbHRlciAhPT0gZmFsc2VcIj5cbiAgICAgICAgICAgICAgICAgICAgPGlucHV0ICN0YXJnZXRGaWx0ZXIgdHlwZT1cInRleHRcIiByb2xlPVwidGV4dGJveFwiIChrZXl1cCk9XCJvbkZpbHRlcigkZXZlbnQsdGFyZ2V0LFRBUkdFVF9MSVNUKVwiIGNsYXNzPVwidWktcGlja2xpc3QtZmlsdGVyIHVpLWlucHV0dGV4dCB1aS13aWRnZXQgdWktc3RhdGUtZGVmYXVsdCB1aS1jb3JuZXItYWxsXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2F0dHIucGxhY2Vob2xkZXJdPVwidGFyZ2V0RmlsdGVyUGxhY2Vob2xkZXJcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImFyaWFUYXJnZXRGaWx0ZXJMYWJlbFwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXBpY2tsaXN0LWZpbHRlci1pY29uIHBpIHBpLXNlYXJjaFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8dWwgI3RhcmdldGxpc3QgY2xhc3M9XCJ1aS13aWRnZXQtY29udGVudCB1aS1waWNrbGlzdC1saXN0IHVpLXBpY2tsaXN0LXRhcmdldCB1aS1jb3JuZXItYm90dG9tXCIgW25nQ2xhc3NdPVwieyd1aS1waWNrbGlzdC1oaWdobGlnaHQnOiBsaXN0SGlnaGxpZ2h0VGFyZ2V0fVwiIFxuICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJ0YXJnZXRTdHlsZVwiIChkcmFnb3Zlcik9XCJvbkxpc3RNb3VzZU1vdmUoJGV2ZW50LFRBUkdFVF9MSVNUKVwiIChkcmFnbGVhdmUpPVwib25MaXN0RHJhZ0xlYXZlKClcIiAoZHJvcCk9XCJvbkxpc3REcm9wKCRldmVudCxUQVJHRVRfTElTVClcIiByb2xlPVwibGlzdGJveFwiIGFyaWEtbXVsdGlzZWxlY3RhYmxlPVwibXVsdGlwbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1pdGVtIFtuZ0Zvck9mXT1cInRhcmdldFwiIFtuZ0ZvclRyYWNrQnldPVwidGFyZ2V0VHJhY2tCeSB8fCB0cmFja0J5XCIgbGV0LWk9XCJpbmRleFwiIGxldC1sPVwibGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwidWktcGlja2xpc3QtZHJvcHBvaW50XCIgKm5nSWY9XCJkcmFnZHJvcFwiIChkcmFnb3Zlcik9XCJvbkRyYWdPdmVyKCRldmVudCwgaSwgVEFSR0VUX0xJU1QpXCIgKGRyb3ApPVwib25Ecm9wKCRldmVudCwgaSwgVEFSR0VUX0xJU1QpXCIgKGRyYWdsZWF2ZSk9XCJvbkRyYWdMZWF2ZSgkZXZlbnQsIFRBUkdFVF9MSVNUKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLXBpY2tsaXN0LWRyb3Bwb2ludC1oaWdobGlnaHQnOiAoaSA9PT0gZHJhZ092ZXJJdGVtSW5kZXhUYXJnZXQpfVwiIFtzdHlsZS5kaXNwbGF5XT1cImlzSXRlbVZpc2libGUoaXRlbSwgVEFSR0VUX0xJU1QpID8gJ2Jsb2NrJyA6ICdub25lJ1wiPjwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgW25nQ2xhc3NdPVwieyd1aS1waWNrbGlzdC1pdGVtJzp0cnVlLCd1aS1zdGF0ZS1oaWdobGlnaHQnOmlzU2VsZWN0ZWQoaXRlbSxzZWxlY3RlZEl0ZW1zVGFyZ2V0KSwgJ3VpLXN0YXRlLWRpc2FibGVkJzogZGlzYWJsZWR9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LGl0ZW0sc2VsZWN0ZWRJdGVtc1RhcmdldCxvblRhcmdldFNlbGVjdClcIiAoZGJsY2xpY2spPVwib25UYXJnZXRJdGVtRGJsQ2xpY2soKVwiICh0b3VjaGVuZCk9XCJvbkl0ZW1Ub3VjaEVuZCgkZXZlbnQpXCIgKGtleWRvd24pPVwib25JdGVtS2V5ZG93bigkZXZlbnQsaXRlbSxzZWxlY3RlZEl0ZW1zVGFyZ2V0LG9uVGFyZ2V0U2VsZWN0KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW3N0eWxlLmRpc3BsYXldPVwiaXNJdGVtVmlzaWJsZShpdGVtLCBUQVJHRVRfTElTVCkgPyAnYmxvY2snIDogJ25vbmUnXCIgdGFiaW5kZXg9XCIwXCIgcm9sZT1cIm9wdGlvblwiIFthdHRyLmFyaWEtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZChpdGVtLCBzZWxlY3RlZEl0ZW1zVGFyZ2V0KVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RyYWdnYWJsZV09XCJkcmFnZHJvcFwiIChkcmFnc3RhcnQpPVwib25EcmFnU3RhcnQoJGV2ZW50LCBpLCBUQVJHRVRfTElTVClcIiAoZHJhZ2VuZCk9XCJvbkRyYWdFbmQoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHskaW1wbGljaXQ6IGl0ZW0sIGluZGV4OiBpfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBjbGFzcz1cInVpLXBpY2tsaXN0LWRyb3Bwb2ludFwiICpuZ0lmPVwiZHJhZ2Ryb3AmJmxcIiAoZHJhZ292ZXIpPVwib25EcmFnT3ZlcigkZXZlbnQsIGkgKyAxLCBUQVJHRVRfTElTVClcIiAoZHJvcCk9XCJvbkRyb3AoJGV2ZW50LCBpICsgMSwgVEFSR0VUX0xJU1QpXCIgKGRyYWdsZWF2ZSk9XCJvbkRyYWdMZWF2ZSgkZXZlbnQsIFRBUkdFVF9MSVNUKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7J3VpLXBpY2tsaXN0LWRyb3Bwb2ludC1oaWdobGlnaHQnOiAoaSArIDEgPT09IGRyYWdPdmVySXRlbUluZGV4VGFyZ2V0KX1cIj48L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiKHRhcmdldCA9PSBudWxsIHx8IHRhcmdldC5sZW5ndGggPT09IDApICYmIGVtcHR5TWVzc2FnZVRhcmdldFRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJ1aS1waWNrbGlzdC1lbXB0eS1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVtcHR5TWVzc2FnZVRhcmdldFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3VsPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktcGlja2xpc3QtdGFyZ2V0LWNvbnRyb2xzIHVpLXBpY2tsaXN0LWJ1dHRvbnNcIiAqbmdJZj1cInNob3dUYXJnZXRDb250cm9sc1wiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1waWNrbGlzdC1idXR0b25zLWNlbGxcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtdXBcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZVVwKHRhcmdldGxpc3QsdGFyZ2V0LHNlbGVjdGVkSXRlbXNUYXJnZXQsb25UYXJnZXRSZW9yZGVyKVwiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBwQnV0dG9uIGljb249XCJwaSBwaS1hbmdsZS1kb3VibGUtdXBcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZVRvcCh0YXJnZXRsaXN0LHRhcmdldCxzZWxlY3RlZEl0ZW1zVGFyZ2V0LG9uVGFyZ2V0UmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtZG93blwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIChjbGljayk9XCJtb3ZlRG93bih0YXJnZXRsaXN0LHRhcmdldCxzZWxlY3RlZEl0ZW1zVGFyZ2V0LG9uVGFyZ2V0UmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgcEJ1dHRvbiBpY29uPVwicGkgcGktYW5nbGUtZG91YmxlLWRvd25cIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiAoY2xpY2spPVwibW92ZUJvdHRvbSh0YXJnZXRsaXN0LHRhcmdldCxzZWxlY3RlZEl0ZW1zVGFyZ2V0LG9uVGFyZ2V0UmVvcmRlcilcIj48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgXG59KVxuZXhwb3J0IGNsYXNzIFBpY2tMaXN0IGltcGxlbWVudHMgQWZ0ZXJWaWV3Q2hlY2tlZCxBZnRlckNvbnRlbnRJbml0IHtcblxuICAgIEBJbnB1dCgpIHNvdXJjZTogYW55W107XG5cbiAgICBASW5wdXQoKSB0YXJnZXQ6IGFueVtdO1xuXG4gICAgQElucHV0KCkgc291cmNlSGVhZGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0YXJnZXRIZWFkZXI6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJlc3BvbnNpdmU6IGJvb2xlYW47XG4gICAgXG4gICAgQElucHV0KCkgZmlsdGVyQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRyYWNrQnk6IEZ1bmN0aW9uID0gKGluZGV4OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gaXRlbTtcblxuICAgIEBJbnB1dCgpIHNvdXJjZVRyYWNrQnk6IEZ1bmN0aW9uO1xuXG4gICAgQElucHV0KCkgdGFyZ2V0VHJhY2tCeTogRnVuY3Rpb247XG5cbiAgICBASW5wdXQoKSBzaG93U291cmNlRmlsdGVyOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dUYXJnZXRGaWx0ZXI6IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIG1ldGFLZXlTZWxlY3Rpb246IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIGRyYWdkcm9wOiBib29sZWFuO1xuICAgIFxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzb3VyY2VTdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgdGFyZ2V0U3R5bGU6IGFueTtcbiAgICBcbiAgICBASW5wdXQoKSBzaG93U291cmNlQ29udHJvbHM6IGJvb2xlYW4gPSB0cnVlO1xuICAgIFxuICAgIEBJbnB1dCgpIHNob3dUYXJnZXRDb250cm9sczogYm9vbGVhbiA9IHRydWU7XG4gICAgXG4gICAgQElucHV0KCkgc291cmNlRmlsdGVyUGxhY2Vob2xkZXI6IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSB0YXJnZXRGaWx0ZXJQbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGFyaWFTb3VyY2VGaWx0ZXJMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYVRhcmdldEZpbHRlckxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBmaWx0ZXJNYXRjaE1vZGU6IHN0cmluZyA9IFwiY29udGFpbnNcIjtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Nb3ZlVG9Tb3VyY2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvbk1vdmVBbGxUb1NvdXJjZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgXG4gICAgQE91dHB1dCgpIG9uTW92ZUFsbFRvVGFyZ2V0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Nb3ZlVG9UYXJnZXQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvblNvdXJjZVJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBPdXRwdXQoKSBvblRhcmdldFJlb3JkZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU291cmNlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblRhcmdldFNlbGVjdDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Tb3VyY2VGaWx0ZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uVGFyZ2V0RmlsdGVyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ3NvdXJjZWxpc3QnLCB7IHN0YXRpYzogdHJ1ZSB9KSBsaXN0Vmlld1NvdXJjZUNoaWxkOiBFbGVtZW50UmVmO1xuICAgIFxuICAgIEBWaWV3Q2hpbGQoJ3RhcmdldGxpc3QnLCB7IHN0YXRpYzogdHJ1ZSB9KSBsaXN0Vmlld1RhcmdldENoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnc291cmNlRmlsdGVyJywgeyBzdGF0aWM6IGZhbHNlIH0pIHNvdXJjZUZpbHRlclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3RhcmdldEZpbHRlcicsIHsgc3RhdGljOiBmYWxzZSB9KSB0YXJnZXRGaWx0ZXJWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG4gICAgXG4gICAgcHVibGljIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBcbiAgICBwdWJsaWMgdmlzaWJsZU9wdGlvbnNTb3VyY2U6IGFueVtdO1xuICAgIFxuICAgIHB1YmxpYyB2aXNpYmxlT3B0aW9uc1RhcmdldDogYW55W107XG4gICAgICAgICAgICBcbiAgICBzZWxlY3RlZEl0ZW1zU291cmNlOiBhbnlbXSA9IFtdO1xuICAgIFxuICAgIHNlbGVjdGVkSXRlbXNUYXJnZXQ6IGFueVtdID0gW107XG4gICAgICAgIFxuICAgIHJlb3JkZXJlZExpc3RFbGVtZW50OiBhbnk7XG4gICAgXG4gICAgZHJhZ2dlZEl0ZW1JbmRleFNvdXJjZTogbnVtYmVyO1xuICAgIFxuICAgIGRyYWdnZWRJdGVtSW5kZXhUYXJnZXQ6IG51bWJlcjtcbiAgICBcbiAgICBkcmFnT3Zlckl0ZW1JbmRleFNvdXJjZTogbnVtYmVyO1xuICAgIFxuICAgIGRyYWdPdmVySXRlbUluZGV4VGFyZ2V0OiBudW1iZXI7XG4gICAgXG4gICAgZHJhZ2dpbmc6IGJvb2xlYW47XG4gICAgXG4gICAgbW92ZWRVcDogYm9vbGVhbjtcbiAgICBcbiAgICBtb3ZlZERvd246IGJvb2xlYW47XG4gICAgXG4gICAgaXRlbVRvdWNoZWQ6IGJvb2xlYW47XG4gICAgXG4gICAgZmlsdGVyVmFsdWVTb3VyY2U6IHN0cmluZztcbiAgICBcbiAgICBmaWx0ZXJWYWx1ZVRhcmdldDogc3RyaW5nO1xuICAgIFxuICAgIGZyb21MaXN0VHlwZTogbnVtYmVyO1xuICAgIFxuICAgIHRvTGlzdFR5cGU6IG51bWJlcjtcbiAgICBcbiAgICBvbkxpc3RJdGVtRHJvcHBvaW50OiBib29sZWFuO1xuICAgIFxuICAgIGxpc3RIaWdobGlnaHRUYXJnZXQ6IGJvb2xlYW47XG4gICAgXG4gICAgbGlzdEhpZ2hsaWdodFNvdXJjZTogYm9vbGVhbjtcblxuICAgIGVtcHR5TWVzc2FnZVNvdXJjZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgZW1wdHlNZXNzYWdlVGFyZ2V0VGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICByZWFkb25seSBTT1VSQ0VfTElTVCA9IC0xO1xuXG4gICAgcmVhZG9ubHkgVEFSR0VUX0xJU1QgPSAxO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuICAgIFxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnaXRlbSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2VtcHR5bWVzc2FnZXNvdXJjZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlNZXNzYWdlU291cmNlVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHltZXNzYWdldGFyZ2V0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbXB0eU1lc3NhZ2VUYXJnZXRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlbVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgICAgICBcbiAgICBuZ0FmdGVyVmlld0NoZWNrZWQoKSB7XG4gICAgICAgIGlmKHRoaXMubW92ZWRVcHx8dGhpcy5tb3ZlZERvd24pIHtcbiAgICAgICAgICAgIGxldCBsaXN0SXRlbXMgPSBEb21IYW5kbGVyLmZpbmQodGhpcy5yZW9yZGVyZWRMaXN0RWxlbWVudCwgJ2xpLnVpLXN0YXRlLWhpZ2hsaWdodCcpO1xuICAgICAgICAgICAgbGV0IGxpc3RJdGVtO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLm1vdmVkVXApXG4gICAgICAgICAgICAgICAgbGlzdEl0ZW0gPSBsaXN0SXRlbXNbMF07XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbGlzdEl0ZW0gPSBsaXN0SXRlbXNbbGlzdEl0ZW1zLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBEb21IYW5kbGVyLnNjcm9sbEluVmlldyh0aGlzLnJlb3JkZXJlZExpc3RFbGVtZW50LCBsaXN0SXRlbSk7XG4gICAgICAgICAgICB0aGlzLm1vdmVkVXAgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubW92ZWREb3duID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnJlb3JkZXJlZExpc3RFbGVtZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbkl0ZW1DbGljayhldmVudCwgaXRlbTogYW55LCBzZWxlY3RlZEl0ZW1zOiBhbnlbXSwgY2FsbGJhY2s6IEV2ZW50RW1pdHRlcjxhbnk+KSB7XG4gICAgICAgIGlmKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5maW5kSW5kZXhJblNlbGVjdGlvbihpdGVtLHNlbGVjdGVkSXRlbXMpO1xuICAgICAgICBsZXQgc2VsZWN0ZWQgPSAoaW5kZXggIT0gLTEpO1xuICAgICAgICBsZXQgbWV0YVNlbGVjdGlvbiA9IHRoaXMuaXRlbVRvdWNoZWQgPyBmYWxzZSA6IHRoaXMubWV0YUtleVNlbGVjdGlvbjtcbiAgICAgICAgXG4gICAgICAgIGlmKG1ldGFTZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGxldCBtZXRhS2V5ID0gKGV2ZW50Lm1ldGFLZXl8fGV2ZW50LmN0cmxLZXl8fGV2ZW50LnNoaWZ0S2V5KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoc2VsZWN0ZWQgJiYgbWV0YUtleSkge1xuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKCFtZXRhS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYoc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxiYWNrLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpdGVtczogc2VsZWN0ZWRJdGVtc30pO1xuXG4gICAgICAgIHRoaXMuaXRlbVRvdWNoZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgb25Tb3VyY2VJdGVtRGJsQ2xpY2soKSB7XG4gICAgICAgIGlmKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5tb3ZlUmlnaHQoKTtcbiAgICB9XG4gICAgXG4gICAgb25UYXJnZXRJdGVtRGJsQ2xpY2soKSB7XG4gICAgICAgIGlmKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5tb3ZlTGVmdCgpO1xuICAgIH1cbiAgICBcbiAgICBvbkZpbHRlcihldmVudDogS2V5Ym9hcmRFdmVudCwgZGF0YTogYW55W10sIGxpc3RUeXBlOiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHF1ZXJ5ID0gKDxIVE1MSW5wdXRFbGVtZW50PiBldmVudC50YXJnZXQpLnZhbHVlLnRyaW0oKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBsZXQgc2VhcmNoRmllbGRzID0gdGhpcy5maWx0ZXJCeS5zcGxpdCgnLCcpO1xuXG4gICAgICAgIGlmKGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclZhbHVlU291cmNlID0gcXVlcnk7XG4gICAgICAgICAgICB0aGlzLnZpc2libGVPcHRpb25zU291cmNlID0gRmlsdGVyVXRpbHMuZmlsdGVyKGRhdGEsIHNlYXJjaEZpZWxkcywgdGhpcy5maWx0ZXJWYWx1ZVNvdXJjZSwgdGhpcy5maWx0ZXJNYXRjaE1vZGUpO1xuICAgICAgICAgICAgdGhpcy5vblNvdXJjZUZpbHRlci5lbWl0KHtxdWVyeTogdGhpcy5maWx0ZXJWYWx1ZVNvdXJjZSwgdmFsdWU6IHRoaXMudmlzaWJsZU9wdGlvbnNTb3VyY2V9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGxpc3RUeXBlID09PSB0aGlzLlRBUkdFVF9MSVNUKSB7XG4gICAgICAgICAgICB0aGlzLmZpbHRlclZhbHVlVGFyZ2V0ID0gcXVlcnk7XG4gICAgICAgICAgICB0aGlzLnZpc2libGVPcHRpb25zVGFyZ2V0ID0gRmlsdGVyVXRpbHMuZmlsdGVyKGRhdGEsIHNlYXJjaEZpZWxkcywgdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCwgdGhpcy5maWx0ZXJNYXRjaE1vZGUpO1xuICAgICAgICAgICAgdGhpcy5vblRhcmdldEZpbHRlci5lbWl0KHtxdWVyeTogdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCwgdmFsdWU6IHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXR9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAgICAgXG4gICAgaXNJdGVtVmlzaWJsZShpdGVtOiBhbnksIGxpc3RUeXBlOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgaWYobGlzdFR5cGUgPT0gdGhpcy5TT1VSQ0VfTElTVClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzVmlzaWJsZUluTGlzdCh0aGlzLnZpc2libGVPcHRpb25zU291cmNlLCBpdGVtLCB0aGlzLmZpbHRlclZhbHVlU291cmNlKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlSW5MaXN0KHRoaXMudmlzaWJsZU9wdGlvbnNUYXJnZXQsIGl0ZW0sIHRoaXMuZmlsdGVyVmFsdWVUYXJnZXQpO1xuICAgIH1cbiAgICBcbiAgICBpc1Zpc2libGVJbkxpc3QoZGF0YTogYW55W10sIGl0ZW06IGFueSwgZmlsdGVyVmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZihmaWx0ZXJWYWx1ZSAmJiBmaWx0ZXJWYWx1ZS50cmltKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmKGl0ZW0gPT0gZGF0YVtpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbkl0ZW1Ub3VjaEVuZChldmVudCkge1xuICAgICAgICBpZih0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuaXRlbVRvdWNoZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgc29ydEJ5SW5kZXhJbkxpc3QoaXRlbXM6IGFueVtdLCBsaXN0OiBhbnkpIHtcbiAgICAgICAgcmV0dXJuIGl0ZW1zLnNvcnQoKGl0ZW0xLCBpdGVtMikgPT5cbiAgICAgICAgICAgIHRoaXMuZmluZEluZGV4SW5MaXN0KGl0ZW0xLCBsaXN0KSAtIHRoaXMuZmluZEluZGV4SW5MaXN0KGl0ZW0yLCBsaXN0KSk7XG4gICAgfVxuXG4gICAgbW92ZVVwKGxpc3RFbGVtZW50LCBsaXN0LCBzZWxlY3RlZEl0ZW1zLCBjYWxsYmFjaykge1xuICAgICAgICBpZihzZWxlY3RlZEl0ZW1zICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zb3J0QnlJbmRleEluTGlzdChzZWxlY3RlZEl0ZW1zLCBsaXN0KTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzZWxlY3RlZEl0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHNlbGVjdGVkSXRlbXNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbUluZGV4OiBudW1iZXIgPSB0aGlzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIGxpc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWRJdGVtSW5kZXggIT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZWRJdGVtID0gbGlzdFtzZWxlY3RlZEl0ZW1JbmRleF07XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wID0gbGlzdFtzZWxlY3RlZEl0ZW1JbmRleC0xXTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtzZWxlY3RlZEl0ZW1JbmRleC0xXSA9IG1vdmVkSXRlbTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtzZWxlY3RlZEl0ZW1JbmRleF0gPSB0ZW1wO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm1vdmVkVXAgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5yZW9yZGVyZWRMaXN0RWxlbWVudCA9IGxpc3RFbGVtZW50O1xuICAgICAgICAgICAgY2FsbGJhY2suZW1pdCh7aXRlbXM6IHNlbGVjdGVkSXRlbXN9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVUb3AobGlzdEVsZW1lbnQsIGxpc3QsIHNlbGVjdGVkSXRlbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKHNlbGVjdGVkSXRlbXMgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMgPSB0aGlzLnNvcnRCeUluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbXMsIGxpc3QpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHNlbGVjdGVkSXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtSW5kZXg6IG51bWJlciA9IHRoaXMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgbGlzdCk7XG5cbiAgICAgICAgICAgICAgICBpZihzZWxlY3RlZEl0ZW1JbmRleCAhPSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW0gPSBsaXN0LnNwbGljZShzZWxlY3RlZEl0ZW1JbmRleCwxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgbGlzdC51bnNoaWZ0KG1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxpc3RFbGVtZW50LnNjcm9sbFRvcCA9IDA7XG4gICAgICAgICAgICBjYWxsYmFjay5lbWl0KHtpdGVtczogc2VsZWN0ZWRJdGVtc30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZURvd24obGlzdEVsZW1lbnQsIGxpc3QsIHNlbGVjdGVkSXRlbXMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmKHNlbGVjdGVkSXRlbXMgJiYgc2VsZWN0ZWRJdGVtcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbXMgPSB0aGlzLnNvcnRCeUluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbXMsIGxpc3QpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gc2VsZWN0ZWRJdGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW0gPSBzZWxlY3RlZEl0ZW1zW2ldO1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW1JbmRleDogbnVtYmVyID0gdGhpcy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCBsaXN0KTtcblxuICAgICAgICAgICAgICAgIGlmKHNlbGVjdGVkSXRlbUluZGV4ICE9IChsaXN0Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW0gPSBsaXN0W3NlbGVjdGVkSXRlbUluZGV4XTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXAgPSBsaXN0W3NlbGVjdGVkSXRlbUluZGV4KzFdO1xuICAgICAgICAgICAgICAgICAgICBsaXN0W3NlbGVjdGVkSXRlbUluZGV4KzFdID0gbW92ZWRJdGVtO1xuICAgICAgICAgICAgICAgICAgICBsaXN0W3NlbGVjdGVkSXRlbUluZGV4XSA9IHRlbXA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubW92ZWREb3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucmVvcmRlcmVkTGlzdEVsZW1lbnQgPSBsaXN0RWxlbWVudDtcbiAgICAgICAgICAgIGNhbGxiYWNrLmVtaXQoe2l0ZW1zOiBzZWxlY3RlZEl0ZW1zfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQm90dG9tKGxpc3RFbGVtZW50LCBsaXN0LCBzZWxlY3RlZEl0ZW1zLCBjYWxsYmFjaykge1xuICAgICAgICBpZihzZWxlY3RlZEl0ZW1zICYmIHNlbGVjdGVkSXRlbXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW1zID0gdGhpcy5zb3J0QnlJbmRleEluTGlzdChzZWxlY3RlZEl0ZW1zLCBsaXN0KTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IHNlbGVjdGVkSXRlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtID0gc2VsZWN0ZWRJdGVtc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWRJdGVtSW5kZXg6IG51bWJlciA9IHRoaXMuZmluZEluZGV4SW5MaXN0KHNlbGVjdGVkSXRlbSwgbGlzdCk7XG5cbiAgICAgICAgICAgICAgICBpZihzZWxlY3RlZEl0ZW1JbmRleCAhPSAobGlzdC5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbW92ZWRJdGVtID0gbGlzdC5zcGxpY2Uoc2VsZWN0ZWRJdGVtSW5kZXgsMSlbMF07XG4gICAgICAgICAgICAgICAgICAgIGxpc3QucHVzaChtb3ZlZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsaXN0RWxlbWVudC5zY3JvbGxUb3AgPSBsaXN0RWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICBjYWxsYmFjay5lbWl0KHtpdGVtczogc2VsZWN0ZWRJdGVtc30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZVJpZ2h0KCkge1xuICAgICAgICBpZih0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2UgJiYgdGhpcy5zZWxlY3RlZEl0ZW1zU291cmNlLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBzZWxlY3RlZEl0ZW0gPSB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2VbaV07XG4gICAgICAgICAgICAgICAgaWYodGhpcy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCB0aGlzLnRhcmdldCkgPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucHVzaCh0aGlzLnNvdXJjZS5zcGxpY2UodGhpcy5maW5kSW5kZXhJbkxpc3Qoc2VsZWN0ZWRJdGVtLCB0aGlzLnNvdXJjZSksMSlbMF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub25Nb3ZlVG9UYXJnZXQuZW1pdCh7XG4gICAgICAgICAgICAgICAgaXRlbXM6IHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSXRlbXNTb3VyY2UgPSBbXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG1vdmVBbGxSaWdodCgpIHtcbiAgICAgICAgaWYodGhpcy5zb3VyY2UpIHtcbiAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW1zID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnNvdXJjZS5sZW5ndGg7IGkrKykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzSXRlbVZpc2libGUodGhpcy5zb3VyY2VbaV0sIHRoaXMuU09VUkNFX0xJU1QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZW1vdmVkSXRlbSA9IHRoaXMuc291cmNlLnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YXJnZXQucHVzaChyZW1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkSXRlbXMucHVzaChyZW1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm9uTW92ZVRvVGFyZ2V0LmVtaXQoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBtb3ZlZEl0ZW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5vbk1vdmVBbGxUb1RhcmdldC5lbWl0KHtcbiAgICAgICAgICAgICAgICBpdGVtczogbW92ZWRJdGVtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1NvdXJjZSA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbW92ZUxlZnQoKSB7XG4gICAgICAgIGlmKHRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldCAmJiB0aGlzLnNlbGVjdGVkSXRlbXNUYXJnZXQubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHNlbGVjdGVkSXRlbSA9IHRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldFtpXTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIHRoaXMuc291cmNlKSA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNvdXJjZS5wdXNoKHRoaXMudGFyZ2V0LnNwbGljZSh0aGlzLmZpbmRJbmRleEluTGlzdChzZWxlY3RlZEl0ZW0sIHRoaXMudGFyZ2V0KSwxKVswXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5vbk1vdmVUb1NvdXJjZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBpdGVtczogdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEl0ZW1zVGFyZ2V0ID0gW107XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtb3ZlQWxsTGVmdCgpIHtcbiAgICAgICAgaWYodGhpcy50YXJnZXQpIHtcbiAgICAgICAgICAgIGxldCBtb3ZlZEl0ZW1zID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLnRhcmdldC5sZW5ndGg7IGkrKykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzSXRlbVZpc2libGUodGhpcy50YXJnZXRbaV0sIHRoaXMuVEFSR0VUX0xJU1QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZW1vdmVkSXRlbSA9IHRoaXMudGFyZ2V0LnNwbGljZShpLCAxKVswXTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zb3VyY2UucHVzaChyZW1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVkSXRlbXMucHVzaChyZW1vdmVkSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgICAgICB0aGlzLm9uTW92ZVRvU291cmNlLmVtaXQoe1xuICAgICAgICAgICAgICAgIGl0ZW1zOiBtb3ZlZEl0ZW1zXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5vbk1vdmVBbGxUb1NvdXJjZS5lbWl0KHtcbiAgICAgICAgICAgICAgICBpdGVtczogbW92ZWRJdGVtc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJdGVtc1RhcmdldCA9IFtdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTZWxlY3RlZChpdGVtOiBhbnksIHNlbGVjdGVkSXRlbXM6IGFueVtdKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKGl0ZW0sIHNlbGVjdGVkSXRlbXMpICE9IC0xO1xuICAgIH1cbiAgICBcbiAgICBmaW5kSW5kZXhJblNlbGVjdGlvbihpdGVtOiBhbnksIHNlbGVjdGVkSXRlbXM6IGFueVtdKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluZGV4SW5MaXN0KGl0ZW0sIHNlbGVjdGVkSXRlbXMpO1xuICAgIH1cbiAgICBcbiAgICBmaW5kSW5kZXhJbkxpc3QoaXRlbTogYW55LCBsaXN0OiBhbnkpOiBudW1iZXIge1xuICAgICAgICBsZXQgaW5kZXg6IG51bWJlciA9IC0xO1xuICAgICAgICBcbiAgICAgICAgaWYobGlzdCkge1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZihsaXN0W2ldID09IGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gICAgXG4gICAgb25EcmFnU3RhcnQoZXZlbnQ6IERyYWdFdmVudCwgaW5kZXg6IG51bWJlciwgbGlzdFR5cGU6IG51bWJlcikge1xuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YSgndGV4dCcsICdiJyk7ICAgIC8vIEZvciBmaXJlZm94XG4gICAgICAgICg8SFRNTExJRWxlbWVudD4gZXZlbnQudGFyZ2V0KS5ibHVyKCk7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLmZyb21MaXN0VHlwZSA9IGxpc3RUeXBlO1xuXG4gICAgICAgIGlmKGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKVxuICAgICAgICAgICAgdGhpcy5kcmFnZ2VkSXRlbUluZGV4U291cmNlID0gaW5kZXg7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFRhcmdldCA9IGluZGV4O1xuICAgIH1cbiAgICBcbiAgICBvbkRyYWdPdmVyKGV2ZW50OiBEcmFnRXZlbnQsIGluZGV4OiBudW1iZXIsIGxpc3RUeXBlOiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGlmKGxpc3RUeXBlID09IHRoaXMuU09VUkNFX0xJU1QpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmRyYWdnZWRJdGVtSW5kZXhTb3VyY2UgIT09IGluZGV4ICYmIHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFNvdXJjZSArIDEgIT09IGluZGV4IHx8wqAodGhpcy5mcm9tTGlzdFR5cGUgPT09IHRoaXMuVEFSR0VUX0xJU1QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJJdGVtSW5kZXhTb3VyY2UgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmRyYWdnZWRJdGVtSW5kZXhUYXJnZXQgIT09IGluZGV4ICYmIHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFRhcmdldCArIDEgIT09IGluZGV4IHx8wqAodGhpcy5mcm9tTGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhZ092ZXJJdGVtSW5kZXhUYXJnZXQgPSBpbmRleDtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9uTGlzdEl0ZW1Ecm9wcG9pbnQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG9uRHJhZ0xlYXZlKGV2ZW50OiBEcmFnRXZlbnQsIGxpc3RUeXBlOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5kcmFnT3Zlckl0ZW1JbmRleFNvdXJjZSA9IG51bGw7IFxuICAgICAgICB0aGlzLmRyYWdPdmVySXRlbUluZGV4VGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5vbkxpc3RJdGVtRHJvcHBvaW50ID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIG9uRHJvcChldmVudDogRHJhZ0V2ZW50LCBpbmRleDogbnVtYmVyLCBsaXN0VHlwZTogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMub25MaXN0SXRlbURyb3Bwb2ludCkge1xuICAgICAgICAgICAgaWYobGlzdFR5cGUgPT09IHRoaXMuU09VUkNFX0xJU1QpIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZyb21MaXN0VHlwZSA9PT0gdGhpcy5UQVJHRVRfTElTVCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydCh0aGlzLmRyYWdnZWRJdGVtSW5kZXhUYXJnZXQsIHRoaXMudGFyZ2V0LCBpbmRleCwgdGhpcy5zb3VyY2UsIHRoaXMub25Nb3ZlVG9Tb3VyY2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0VXRpbHMucmVvcmRlckFycmF5KHRoaXMuc291cmNlLCB0aGlzLmRyYWdnZWRJdGVtSW5kZXhTb3VyY2UsICh0aGlzLmRyYWdnZWRJdGVtSW5kZXhTb3VyY2UgPiBpbmRleCkgPyBpbmRleCA6IChpbmRleCA9PT0gMCkgPyAwIDogaW5kZXggLSAxKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblNvdXJjZVJlb3JkZXIuZW1pdCh7aXRlbXM6IHRoaXMuc291cmNlW3RoaXMuZHJhZ2dlZEl0ZW1JbmRleFNvdXJjZV19KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdPdmVySXRlbUluZGV4U291cmNlID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZnJvbUxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFNvdXJjZSwgdGhpcy5zb3VyY2UsIGluZGV4LCB0aGlzLnRhcmdldCwgdGhpcy5vbk1vdmVUb1RhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3RVdGlscy5yZW9yZGVyQXJyYXkodGhpcy50YXJnZXQsIHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFRhcmdldCwgKHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFRhcmdldCA+IGluZGV4KSA/IGluZGV4IDogKGluZGV4ID09PSAwKSA/IDAgOiBpbmRleCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVGFyZ2V0UmVvcmRlci5lbWl0KHtpdGVtczogdGhpcy50YXJnZXRbdGhpcy5kcmFnZ2VkSXRlbUluZGV4VGFyZ2V0XX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnT3Zlckl0ZW1JbmRleFRhcmdldCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMubGlzdEhpZ2hsaWdodFRhcmdldCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5saXN0SGlnaGxpZ2h0U291cmNlID0gZmFsc2U7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIG9uRHJhZ0VuZChldmVudDogRHJhZ0V2ZW50KSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgb25MaXN0RHJvcChldmVudDogRHJhZ0V2ZW50LCBsaXN0VHlwZTogIG51bWJlcikge1xuICAgICAgICBpZighdGhpcy5vbkxpc3RJdGVtRHJvcHBvaW50KSB7XG4gICAgICAgICAgICBpZihsaXN0VHlwZSA9PT0gdGhpcy5TT1VSQ0VfTElTVCkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZnJvbUxpc3RUeXBlID09PSB0aGlzLlRBUkdFVF9MSVNUKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KHRoaXMuZHJhZ2dlZEl0ZW1JbmRleFRhcmdldCwgdGhpcy50YXJnZXQsIG51bGwsIHRoaXMuc291cmNlLCB0aGlzLm9uTW92ZVRvU291cmNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZyb21MaXN0VHlwZSA9PT0gdGhpcy5TT1VSQ0VfTElTVCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmluc2VydCh0aGlzLmRyYWdnZWRJdGVtSW5kZXhTb3VyY2UsIHRoaXMuc291cmNlLCBudWxsLCB0aGlzLnRhcmdldCwgdGhpcy5vbk1vdmVUb1RhcmdldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmxpc3RIaWdobGlnaHRUYXJnZXQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubGlzdEhpZ2hsaWdodFNvdXJjZSA9IGZhbHNlO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpbnNlcnQoZnJvbUluZGV4LCBmcm9tTGlzdCwgdG9JbmRleCwgdG9MaXN0LCBjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBlbGVtZW50dG9tb3ZlID0gZnJvbUxpc3RbZnJvbUluZGV4XTtcbiAgICAgICAgXG4gICAgICAgIGlmKHRvSW5kZXggPT09IG51bGwpXG4gICAgICAgICAgICB0b0xpc3QucHVzaChmcm9tTGlzdC5zcGxpY2UoZnJvbUluZGV4LCAxKVswXSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRvTGlzdC5zcGxpY2UodG9JbmRleCwgMCwgZnJvbUxpc3Quc3BsaWNlKGZyb21JbmRleCwgMSlbMF0pO1xuICAgICAgICAgICAgXG4gICAgICAgIGNhbGxiYWNrLmVtaXQoe1xuICAgICAgICAgICAgaXRlbXM6IFtlbGVtZW50dG9tb3ZlXVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgb25MaXN0TW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50LCBsaXN0VHlwZTogbnVtYmVyKSB7XG4gICAgICAgIGlmKHRoaXMuZHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGxldCBtb3ZlTGlzdFR5cGUgPSAobGlzdFR5cGUgPT0gMCA/IHRoaXMubGlzdFZpZXdTb3VyY2VDaGlsZCA6IHRoaXMubGlzdFZpZXdUYXJnZXRDaGlsZCk7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IG1vdmVMaXN0VHlwZS5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuICAgICAgICAgICAgbGV0IGJvdHRvbURpZmYgPSAob2Zmc2V0WSArIG1vdmVMaXN0VHlwZS5uYXRpdmVFbGVtZW50LmNsaWVudEhlaWdodCkgLSBldmVudC5wYWdlWTtcbiAgICAgICAgICAgIGxldCB0b3BEaWZmID0gKGV2ZW50LnBhZ2VZIC0gb2Zmc2V0WSk7XG5cbiAgICAgICAgICAgIGlmKGJvdHRvbURpZmYgPCAyNSAmJiBib3R0b21EaWZmID4gMClcbiAgICAgICAgICAgICAgICBtb3ZlTGlzdFR5cGUubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgKz0gMTU7XG4gICAgICAgICAgICBlbHNlIGlmKHRvcERpZmYgPCAyNSAmJiB0b3BEaWZmID4gMClcbiAgICAgICAgICAgICAgICBtb3ZlTGlzdFR5cGUubmF0aXZlRWxlbWVudC5zY3JvbGxUb3AgLT0gMTU7XG5cbiAgICAgICAgICAgIGlmKGxpc3RUeXBlID09PSB0aGlzLlNPVVJDRV9MSVNUKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5mcm9tTGlzdFR5cGUgPT09IHRoaXMuVEFSR0VUX0xJU1QpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGlzdEhpZ2hsaWdodFNvdXJjZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmZyb21MaXN0VHlwZSA9PT0gdGhpcy5TT1VSQ0VfTElTVClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5saXN0SGlnaGxpZ2h0VGFyZ2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBvbkxpc3REcmFnTGVhdmUoKSB7XG4gICAgICAgIHRoaXMubGlzdEhpZ2hsaWdodFRhcmdldCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxpc3RIaWdobGlnaHRTb3VyY2UgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXNldEZpbHRlcigpIHtcbiAgICAgICAgdGhpcy52aXNpYmxlT3B0aW9uc1NvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMuZmlsdGVyVmFsdWVTb3VyY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnZpc2libGVPcHRpb25zVGFyZ2V0ID0gbnVsbDtcbiAgICAgICAgdGhpcy5maWx0ZXJWYWx1ZVRhcmdldCA9IG51bGw7XG5cbiAgICAgICAgKDxIVE1MSW5wdXRFbGVtZW50PiB0aGlzLnNvdXJjZUZpbHRlclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KS52YWx1ZSA9ICcnO1xuICAgICAgICAoPEhUTUxJbnB1dEVsZW1lbnQ+IHRoaXMudGFyZ2V0RmlsdGVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLnZhbHVlID0gJyc7XG4gICAgfVxuICAgIFxuICAgIG9uSXRlbUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQsIGl0ZW06IGFueSwgc2VsZWN0ZWRJdGVtczogYW55W10sIGNhbGxiYWNrOiBFdmVudEVtaXR0ZXI8YW55Pikge1xuICAgICAgICBsZXQgbGlzdEl0ZW0gPSA8SFRNTExJRWxlbWVudD4gZXZlbnQuY3VycmVudFRhcmdldDtcbiAgICAgICAgXG4gICAgICAgIHN3aXRjaChldmVudC53aGljaCkge1xuICAgICAgICAgICAgLy9kb3duXG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICAgIHZhciBuZXh0SXRlbSA9IHRoaXMuZmluZE5leHRJdGVtKGxpc3RJdGVtKTtcbiAgICAgICAgICAgICAgICBpZiAobmV4dEl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dEl0ZW0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3VwXG4gICAgICAgICAgICBjYXNlIDM4OlxuICAgICAgICAgICAgICAgIHZhciBwcmV2SXRlbSA9IHRoaXMuZmluZFByZXZJdGVtKGxpc3RJdGVtKTtcbiAgICAgICAgICAgICAgICBpZiAocHJldkl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgcHJldkl0ZW0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2VudGVyXG4gICAgICAgICAgICBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIHRoaXMub25JdGVtQ2xpY2soZXZlbnQsIGl0ZW0sIHNlbGVjdGVkSXRlbXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIFxuICAgIGZpbmROZXh0SXRlbShpdGVtKSB7XG4gICAgICAgIGxldCBuZXh0SXRlbSA9IGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0SXRlbSlcbiAgICAgICAgICAgIHJldHVybiAhRG9tSGFuZGxlci5oYXNDbGFzcyhuZXh0SXRlbSwgJ3VpLXBpY2tsaXN0LWl0ZW0nKSB8fCBEb21IYW5kbGVyLmlzSGlkZGVuKG5leHRJdGVtKSA/IHRoaXMuZmluZE5leHRJdGVtKG5leHRJdGVtKSA6IG5leHRJdGVtO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBmaW5kUHJldkl0ZW0oaXRlbSkge1xuICAgICAgICBsZXQgcHJldkl0ZW0gPSBpdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG4gICAgICAgIFxuICAgICAgICBpZiAocHJldkl0ZW0pXG4gICAgICAgICAgICByZXR1cm4gIURvbUhhbmRsZXIuaGFzQ2xhc3MocHJldkl0ZW0sICd1aS1waWNrbGlzdC1pdGVtJykgfHwgRG9tSGFuZGxlci5pc0hpZGRlbihwcmV2SXRlbSkgPyB0aGlzLmZpbmRQcmV2SXRlbShwcmV2SXRlbSkgOiBwcmV2SXRlbTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBcbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLEJ1dHRvbk1vZHVsZSxTaGFyZWRNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtQaWNrTGlzdCxTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW1BpY2tMaXN0XVxufSlcbmV4cG9ydCBjbGFzcyBQaWNrTGlzdE1vZHVsZSB7IH1cbiJdfQ==