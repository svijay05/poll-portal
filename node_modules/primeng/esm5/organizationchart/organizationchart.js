var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { NgModule, Component, ElementRef, Input, Output, AfterContentInit, EventEmitter, TemplateRef, Inject, forwardRef, ContentChildren, QueryList } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { PrimeTemplate } from 'primeng/api';
var OrganizationChartNode = /** @class */ (function () {
    function OrganizationChartNode(chart) {
        this.chart = chart;
    }
    Object.defineProperty(OrganizationChartNode.prototype, "leaf", {
        get: function () {
            return this.node.leaf == false ? false : !(this.node.children && this.node.children.length);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OrganizationChartNode.prototype, "colspan", {
        get: function () {
            return (this.node.children && this.node.children.length) ? this.node.children.length * 2 : null;
        },
        enumerable: true,
        configurable: true
    });
    OrganizationChartNode.prototype.onNodeClick = function (event, node) {
        this.chart.onNodeClick(event, node);
    };
    OrganizationChartNode.prototype.toggleNode = function (event, node) {
        node.expanded = !node.expanded;
        if (node.expanded)
            this.chart.onNodeExpand.emit({ originalEvent: event, node: this.node });
        else
            this.chart.onNodeCollapse.emit({ originalEvent: event, node: this.node });
        event.preventDefault();
    };
    OrganizationChartNode.prototype.isSelected = function () {
        return this.chart.isSelected(this.node);
    };
    OrganizationChartNode.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [forwardRef(function () { return OrganizationChart; }),] }] }
    ]; };
    __decorate([
        Input()
    ], OrganizationChartNode.prototype, "node", void 0);
    __decorate([
        Input()
    ], OrganizationChartNode.prototype, "root", void 0);
    __decorate([
        Input()
    ], OrganizationChartNode.prototype, "first", void 0);
    __decorate([
        Input()
    ], OrganizationChartNode.prototype, "last", void 0);
    OrganizationChartNode = __decorate([
        Component({
            selector: '[pOrganizationChartNode]',
            template: "\n        <tr *ngIf=\"node\">\n            <td [attr.colspan]=\"colspan\">\n                <div class=\"ui-organizationchart-node-content ui-widget-content ui-corner-all {{node.styleClass}}\" \n                    [ngClass]=\"{'ui-organizationchart-selectable-node': chart.selectionMode && node.selectable !== false,'ui-state-highlight':isSelected()}\"\n                    (click)=\"onNodeClick($event,node)\">\n                    <div *ngIf=\"!chart.getTemplateForNode(node)\">{{node.label}}</div>\n                    <div *ngIf=\"chart.getTemplateForNode(node)\">\n                        <ng-container *ngTemplateOutlet=\"chart.getTemplateForNode(node); context: {$implicit: node}\"></ng-container>\n                    </div>\n                    <a *ngIf=\"!leaf\" tabindex=\"0\" class=\"ui-node-toggler\" (click)=\"toggleNode($event, node)\" (keydown.enter)=\"toggleNode($event, node)\">\n                        <i class=\"ui-node-toggler-icon pi\" [ngClass]=\"{'pi-chevron-down': node.expanded, 'pi-chevron-up': !node.expanded}\"></i>\n                    </a>\n                </div>\n            </td>\n        </tr>\n        <tr [style.visibility]=\"!leaf&&node.expanded ? 'inherit' : 'hidden'\" class=\"ui-organizationchart-lines\" [@childState]=\"'in'\">\n            <td [attr.colspan]=\"colspan\">\n                <div class=\"ui-organizationchart-line-down\"></div>\n            </td>\n        </tr>\n        <tr [style.visibility]=\"!leaf&&node.expanded ? 'inherit' : 'hidden'\" class=\"ui-organizationchart-lines\" [@childState]=\"'in'\">\n            <ng-container *ngIf=\"node.children && node.children.length === 1\">\n                <td [attr.colspan]=\"colspan\">\n                    <div class=\"ui-organizationchart-line-down\"></div>\n                </td>\n            </ng-container>\n            <ng-container *ngIf=\"node.children && node.children.length > 1\">\n                <ng-template ngFor let-child [ngForOf]=\"node.children\" let-first=\"first\" let-last=\"last\">\n                    <td class=\"ui-organizationchart-line-left\" [ngClass]=\"{'ui-organizationchart-line-top':!first}\">&nbsp;</td>\n                    <td class=\"ui-organizationchart-line-right\" [ngClass]=\"{'ui-organizationchart-line-top':!last}\">&nbsp;</td>\n                </ng-template>\n            </ng-container>\n        </tr>\n        <tr [style.visibility]=\"!leaf&&node.expanded ? 'inherit' : 'hidden'\" class=\"ui-organizationchart-nodes\" [@childState]=\"'in'\">\n            <td *ngFor=\"let child of node.children\" colspan=\"2\">\n                <table class=\"ui-organizationchart-table\" pOrganizationChartNode [node]=\"child\"></table>\n            </td>\n        </tr>\n    ",
            animations: [
                trigger('childState', [
                    state('in', style({ opacity: 1 })),
                    transition('void => *', [
                        style({ opacity: 0 }),
                        animate(150)
                    ]),
                    transition('* => void', [
                        animate(150, style({ opacity: 0 }))
                    ])
                ])
            ]
        }),
        __param(0, Inject(forwardRef(function () { return OrganizationChart; })))
    ], OrganizationChartNode);
    return OrganizationChartNode;
}());
export { OrganizationChartNode };
var OrganizationChart = /** @class */ (function () {
    function OrganizationChart(el) {
        this.el = el;
        this.selectionChange = new EventEmitter();
        this.onNodeSelect = new EventEmitter();
        this.onNodeUnselect = new EventEmitter();
        this.onNodeExpand = new EventEmitter();
        this.onNodeCollapse = new EventEmitter();
    }
    Object.defineProperty(OrganizationChart.prototype, "root", {
        get: function () {
            return this.value && this.value.length ? this.value[0] : null;
        },
        enumerable: true,
        configurable: true
    });
    OrganizationChart.prototype.ngAfterContentInit = function () {
        var _this = this;
        if (this.templates.length) {
            this.templateMap = {};
        }
        this.templates.forEach(function (item) {
            _this.templateMap[item.getType()] = item.template;
        });
    };
    OrganizationChart.prototype.getTemplateForNode = function (node) {
        if (this.templateMap)
            return node.type ? this.templateMap[node.type] : this.templateMap['default'];
        else
            return null;
    };
    OrganizationChart.prototype.onNodeClick = function (event, node) {
        var eventTarget = event.target;
        if (eventTarget.className && (eventTarget.className.indexOf('ui-node-toggler') !== -1 || eventTarget.className.indexOf('ui-node-toggler-icon') !== -1)) {
            return;
        }
        else if (this.selectionMode) {
            if (node.selectable === false) {
                return;
            }
            var index_1 = this.findIndexInSelection(node);
            var selected = (index_1 >= 0);
            if (this.selectionMode === 'single') {
                if (selected) {
                    this.selection = null;
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = node;
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            else if (this.selectionMode === 'multiple') {
                if (selected) {
                    this.selection = this.selection.filter(function (val, i) { return i != index_1; });
                    this.onNodeUnselect.emit({ originalEvent: event, node: node });
                }
                else {
                    this.selection = __spread(this.selection || [], [node]);
                    this.onNodeSelect.emit({ originalEvent: event, node: node });
                }
            }
            this.selectionChange.emit(this.selection);
        }
    };
    OrganizationChart.prototype.findIndexInSelection = function (node) {
        var index = -1;
        if (this.selectionMode && this.selection) {
            if (this.selectionMode === 'single') {
                index = (this.selection == node) ? 0 : -1;
            }
            else if (this.selectionMode === 'multiple') {
                for (var i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == node) {
                        index = i;
                        break;
                    }
                }
            }
        }
        return index;
    };
    OrganizationChart.prototype.isSelected = function (node) {
        return this.findIndexInSelection(node) != -1;
    };
    OrganizationChart.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    __decorate([
        Input()
    ], OrganizationChart.prototype, "value", void 0);
    __decorate([
        Input()
    ], OrganizationChart.prototype, "style", void 0);
    __decorate([
        Input()
    ], OrganizationChart.prototype, "styleClass", void 0);
    __decorate([
        Input()
    ], OrganizationChart.prototype, "selectionMode", void 0);
    __decorate([
        Input()
    ], OrganizationChart.prototype, "selection", void 0);
    __decorate([
        Output()
    ], OrganizationChart.prototype, "selectionChange", void 0);
    __decorate([
        Output()
    ], OrganizationChart.prototype, "onNodeSelect", void 0);
    __decorate([
        Output()
    ], OrganizationChart.prototype, "onNodeUnselect", void 0);
    __decorate([
        Output()
    ], OrganizationChart.prototype, "onNodeExpand", void 0);
    __decorate([
        Output()
    ], OrganizationChart.prototype, "onNodeCollapse", void 0);
    __decorate([
        ContentChildren(PrimeTemplate)
    ], OrganizationChart.prototype, "templates", void 0);
    OrganizationChart = __decorate([
        Component({
            selector: 'p-organizationChart',
            template: "\n        <div [ngStyle]=\"style\" [class]=\"styleClass\" [ngClass]=\"'ui-organizationchart ui-widget'\">\n            <table class=\"ui-organizationchart-table\" pOrganizationChartNode [node]=\"root\" *ngIf=\"root\"></table>\n        </div>\n    "
        })
    ], OrganizationChart);
    return OrganizationChart;
}());
export { OrganizationChart };
var OrganizationChartModule = /** @class */ (function () {
    function OrganizationChartModule() {
    }
    OrganizationChartModule = __decorate([
        NgModule({
            imports: [CommonModule],
            exports: [OrganizationChart, SharedModule],
            declarations: [OrganizationChart, OrganizationChartNode]
        })
    ], OrganizationChartModule);
    return OrganizationChartModule;
}());
export { OrganizationChartModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JnYW5pemF0aW9uY2hhcnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL29yZ2FuaXphdGlvbmNoYXJ0LyIsInNvdXJjZXMiOlsib3JnYW5pemF0aW9uY2hhcnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLFNBQVMsRUFBQyxVQUFVLEVBQUMsS0FBSyxFQUFDLE1BQU0sRUFBQyxnQkFBZ0IsRUFBQyxZQUFZLEVBQUMsV0FBVyxFQUNwRixNQUFNLEVBQUMsVUFBVSxFQUFDLGVBQWUsRUFBQyxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDMUUsT0FBTyxFQUFDLE9BQU8sRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLFVBQVUsRUFBQyxPQUFPLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUMzRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDN0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUV6QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBeUQxQztJQVlJLCtCQUF5RCxLQUFLO1FBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBMEIsQ0FBQztJQUM1QyxDQUFDO0lBRUQsc0JBQUksdUNBQUk7YUFBUjtZQUNJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5RixDQUFDOzs7T0FBQTtJQUVELHNCQUFJLDBDQUFPO2FBQVg7WUFDSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FB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REFBeUQ7SUFFeEQ7UUFBVCxNQUFNLEVBQUU7MkRBQXNEO0lBRXJEO1FBQVQsTUFBTSxFQUFFOzZEQUF3RDtJQUV2RDtRQUFULE1BQU0sRUFBRTsyREFBc0Q7SUFFckQ7UUFBVCxNQUFNLEVBQUU7NkRBQXdEO0lBRWpDO1FBQS9CLGVBQWUsQ0FBQyxhQUFhLENBQUM7d0RBQTJCO0lBdEJqRCxpQkFBaUI7UUFSN0IsU0FBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixRQUFRLEVBQUUseVBBSVQ7U0FDSixDQUFDO09BQ1csaUJBQWlCLENBK0c3QjtJQUFELHdCQUFDO0NBQUEsQUEvR0QsSUErR0M7U0EvR1ksaUJBQWlCO0FBc0g5QjtJQUFBO0lBQXVDLENBQUM7SUFBM0IsdUJBQXVCO1FBTG5DLFFBQVEsQ0FBQztZQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN2QixPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsRUFBQyxZQUFZLENBQUM7WUFDekMsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUMscUJBQXFCLENBQUM7U0FDMUQsQ0FBQztPQUNXLHVCQUF1QixDQUFJO0lBQUQsOEJBQUM7Q0FBQSxBQUF4QyxJQUF3QztTQUEzQix1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLENvbXBvbmVudCxFbGVtZW50UmVmLElucHV0LE91dHB1dCxBZnRlckNvbnRlbnRJbml0LEV2ZW50RW1pdHRlcixUZW1wbGF0ZVJlZixcbiAgICAgICAgSW5qZWN0LGZvcndhcmRSZWYsQ29udGVudENoaWxkcmVuLFF1ZXJ5TGlzdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge3RyaWdnZXIsc3RhdGUsc3R5bGUsdHJhbnNpdGlvbixhbmltYXRlfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtTaGFyZWRNb2R1bGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7VHJlZU5vZGV9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7UHJpbWVUZW1wbGF0ZX0gZnJvbSAncHJpbWVuZy9hcGknO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ1twT3JnYW5pemF0aW9uQ2hhcnROb2RlXScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHRyICpuZ0lmPVwibm9kZVwiPlxuICAgICAgICAgICAgPHRkIFthdHRyLmNvbHNwYW5dPVwiY29sc3BhblwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1vcmdhbml6YXRpb25jaGFydC1ub2RlLWNvbnRlbnQgdWktd2lkZ2V0LWNvbnRlbnQgdWktY29ybmVyLWFsbCB7e25vZGUuc3R5bGVDbGFzc319XCIgXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsndWktb3JnYW5pemF0aW9uY2hhcnQtc2VsZWN0YWJsZS1ub2RlJzogY2hhcnQuc2VsZWN0aW9uTW9kZSAmJiBub2RlLnNlbGVjdGFibGUgIT09IGZhbHNlLCd1aS1zdGF0ZS1oaWdobGlnaHQnOmlzU2VsZWN0ZWQoKX1cIlxuICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25Ob2RlQ2xpY2soJGV2ZW50LG5vZGUpXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhY2hhcnQuZ2V0VGVtcGxhdGVGb3JOb2RlKG5vZGUpXCI+e3tub2RlLmxhYmVsfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiAqbmdJZj1cImNoYXJ0LmdldFRlbXBsYXRlRm9yTm9kZShub2RlKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNoYXJ0LmdldFRlbXBsYXRlRm9yTm9kZShub2RlKTsgY29udGV4dDogeyRpbXBsaWNpdDogbm9kZX1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDxhICpuZ0lmPVwiIWxlYWZcIiB0YWJpbmRleD1cIjBcIiBjbGFzcz1cInVpLW5vZGUtdG9nZ2xlclwiIChjbGljayk9XCJ0b2dnbGVOb2RlKCRldmVudCwgbm9kZSlcIiAoa2V5ZG93bi5lbnRlcik9XCJ0b2dnbGVOb2RlKCRldmVudCwgbm9kZSlcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwidWktbm9kZS10b2dnbGVyLWljb24gcGlcIiBbbmdDbGFzc109XCJ7J3BpLWNoZXZyb24tZG93bic6IG5vZGUuZXhwYW5kZWQsICdwaS1jaGV2cm9uLXVwJzogIW5vZGUuZXhwYW5kZWR9XCI+PC9pPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgICAgICA8dHIgW3N0eWxlLnZpc2liaWxpdHldPVwiIWxlYWYmJm5vZGUuZXhwYW5kZWQgPyAnaW5oZXJpdCcgOiAnaGlkZGVuJ1wiIGNsYXNzPVwidWktb3JnYW5pemF0aW9uY2hhcnQtbGluZXNcIiBbQGNoaWxkU3RhdGVdPVwiJ2luJ1wiPlxuICAgICAgICAgICAgPHRkIFthdHRyLmNvbHNwYW5dPVwiY29sc3BhblwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1vcmdhbml6YXRpb25jaGFydC1saW5lLWRvd25cIj48L2Rpdj5cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0ciBbc3R5bGUudmlzaWJpbGl0eV09XCIhbGVhZiYmbm9kZS5leHBhbmRlZCA/ICdpbmhlcml0JyA6ICdoaWRkZW4nXCIgY2xhc3M9XCJ1aS1vcmdhbml6YXRpb25jaGFydC1saW5lc1wiIFtAY2hpbGRTdGF0ZV09XCInaW4nXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibm9kZS5jaGlsZHJlbiAmJiBub2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gMVwiPlxuICAgICAgICAgICAgICAgIDx0ZCBbYXR0ci5jb2xzcGFuXT1cImNvbHNwYW5cIj5cbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmUtZG93blwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJub2RlLmNoaWxkcmVuICYmIG5vZGUuY2hpbGRyZW4ubGVuZ3RoID4gMVwiPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtY2hpbGQgW25nRm9yT2ZdPVwibm9kZS5jaGlsZHJlblwiIGxldC1maXJzdD1cImZpcnN0XCIgbGV0LWxhc3Q9XCJsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cInVpLW9yZ2FuaXphdGlvbmNoYXJ0LWxpbmUtbGVmdFwiIFtuZ0NsYXNzXT1cInsndWktb3JnYW5pemF0aW9uY2hhcnQtbGluZS10b3AnOiFmaXJzdH1cIj4mbmJzcDs8L3RkPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ1aS1vcmdhbml6YXRpb25jaGFydC1saW5lLXJpZ2h0XCIgW25nQ2xhc3NdPVwieyd1aS1vcmdhbml6YXRpb25jaGFydC1saW5lLXRvcCc6IWxhc3R9XCI+Jm5ic3A7PC90ZD5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvdHI+XG4gICAgICAgIDx0ciBbc3R5bGUudmlzaWJpbGl0eV09XCIhbGVhZiYmbm9kZS5leHBhbmRlZCA/ICdpbmhlcml0JyA6ICdoaWRkZW4nXCIgY2xhc3M9XCJ1aS1vcmdhbml6YXRpb25jaGFydC1ub2Rlc1wiIFtAY2hpbGRTdGF0ZV09XCInaW4nXCI+XG4gICAgICAgICAgICA8dGQgKm5nRm9yPVwibGV0IGNoaWxkIG9mIG5vZGUuY2hpbGRyZW5cIiBjb2xzcGFuPVwiMlwiPlxuICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInVpLW9yZ2FuaXphdGlvbmNoYXJ0LXRhYmxlXCIgcE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZSBbbm9kZV09XCJjaGlsZFwiPjwvdGFibGU+XG4gICAgICAgICAgICA8L3RkPlxuICAgICAgICA8L3RyPlxuICAgIGAsXG4gICAgYW5pbWF0aW9uczogW1xuICAgICAgICB0cmlnZ2VyKCdjaGlsZFN0YXRlJywgW1xuICAgICAgICAgICAgc3RhdGUoJ2luJywgc3R5bGUoe29wYWNpdHk6IDF9KSksXG4gICAgICAgICAgIHRyYW5zaXRpb24oJ3ZvaWQgPT4gKicsIFtcbiAgICAgICAgICAgICBzdHlsZSh7b3BhY2l0eTogMH0pLFxuICAgICAgICAgICAgIGFuaW1hdGUoMTUwKVxuICAgICAgICAgICBdKSxcbiAgICAgICAgICAgdHJhbnNpdGlvbignKiA9PiB2b2lkJywgW1xuICAgICAgICAgICAgIGFuaW1hdGUoMTUwLCBzdHlsZSh7b3BhY2l0eTowfSkpXG4gICAgICAgICAgIF0pXG4gICAgICAgIF0pXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBPcmdhbml6YXRpb25DaGFydE5vZGUge1xuXG4gICAgQElucHV0KCkgbm9kZTogVHJlZU5vZGU7XG4gICAgICAgIFxuICAgIEBJbnB1dCgpIHJvb3Q6IGJvb2xlYW47XG4gICAgXG4gICAgQElucHV0KCkgZmlyc3Q6IGJvb2xlYW47XG4gICAgXG4gICAgQElucHV0KCkgbGFzdDogYm9vbGVhbjtcblxuICAgIGNoYXJ0OiBPcmdhbml6YXRpb25DaGFydDtcbiAgICAgICAgXG4gICAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE9yZ2FuaXphdGlvbkNoYXJ0KSkgY2hhcnQpIHtcbiAgICAgICAgdGhpcy5jaGFydCA9IGNoYXJ0IGFzIE9yZ2FuaXphdGlvbkNoYXJ0O1xuICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICBnZXQgbGVhZigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubm9kZS5sZWFmID09IGZhbHNlID8gZmFsc2UgOiAhKHRoaXMubm9kZS5jaGlsZHJlbiYmdGhpcy5ub2RlLmNoaWxkcmVuLmxlbmd0aCk7XG4gICAgfVxuICAgIFxuICAgIGdldCBjb2xzcGFuKCkge1xuICAgICAgICByZXR1cm4gKHRoaXMubm9kZS5jaGlsZHJlbiAmJiB0aGlzLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKSA/IHRoaXMubm9kZS5jaGlsZHJlbi5sZW5ndGggKiAyOiBudWxsO1xuICAgIH1cbiAgICBcbiAgICBvbk5vZGVDbGljayhldmVudDogRXZlbnQsIG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIHRoaXMuY2hhcnQub25Ob2RlQ2xpY2soZXZlbnQsIG5vZGUpXG4gICAgfVxuICAgIFxuICAgIHRvZ2dsZU5vZGUoZXZlbnQ6IEV2ZW50LCBub2RlOiBUcmVlTm9kZSkge1xuICAgICAgICBub2RlLmV4cGFuZGVkID0gIW5vZGUuZXhwYW5kZWQ7XG4gICAgICAgIGlmKG5vZGUuZXhwYW5kZWQpXG4gICAgICAgICAgICB0aGlzLmNoYXJ0Lm9uTm9kZUV4cGFuZC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgbm9kZTogdGhpcy5ub2RlfSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuY2hhcnQub25Ob2RlQ29sbGFwc2UuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIG5vZGU6IHRoaXMubm9kZX0pO1xuICAgICAgICAgICAgXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICAgIFxuICAgIGlzU2VsZWN0ZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNoYXJ0LmlzU2VsZWN0ZWQodGhpcy5ub2RlKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1vcmdhbml6YXRpb25DaGFydCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nQ2xhc3NdPVwiJ3VpLW9yZ2FuaXphdGlvbmNoYXJ0IHVpLXdpZGdldCdcIj5cbiAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInVpLW9yZ2FuaXphdGlvbmNoYXJ0LXRhYmxlXCIgcE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZSBbbm9kZV09XCJyb290XCIgKm5nSWY9XCJyb290XCI+PC90YWJsZT5cbiAgICAgICAgPC9kaXY+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBPcmdhbml6YXRpb25DaGFydCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgICAgICAgICAgXG4gICAgQElucHV0KCkgdmFsdWU6IFRyZWVOb2RlW107ICAgICAgICAgICAgXG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuICAgIFxuICAgIEBJbnB1dCgpIHNlbGVjdGlvbk1vZGU6IHN0cmluZztcbiAgICBcbiAgICBASW5wdXQoKSBzZWxlY3Rpb246IGFueTtcbiAgICBcbiAgICBAT3V0cHV0KCkgc2VsZWN0aW9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Ob2RlU2VsZWN0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBcbiAgICBAT3V0cHV0KCkgb25Ob2RlVW5zZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uTm9kZUV4cGFuZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25Ob2RlQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIFxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcbiAgICBcbiAgICBwdWJsaWMgdGVtcGxhdGVNYXA6IGFueTtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYpIHt9XG4gICAgXG4gICAgZ2V0IHJvb3QoKTogVHJlZU5vZGUge1xuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSAmJiB0aGlzLnZhbHVlLmxlbmd0aCA/IHRoaXMudmFsdWVbMF0gOiBudWxsO1xuICAgIH1cbiAgICBcbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIGlmKHRoaXMudGVtcGxhdGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZU1hcCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlTWFwW2l0ZW0uZ2V0VHlwZSgpXSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBnZXRUZW1wbGF0ZUZvck5vZGUobm9kZTogVHJlZU5vZGUpOiBUZW1wbGF0ZVJlZjxhbnk+IHtcbiAgICAgICAgaWYodGhpcy50ZW1wbGF0ZU1hcClcbiAgICAgICAgICAgIHJldHVybiBub2RlLnR5cGUgPyB0aGlzLnRlbXBsYXRlTWFwW25vZGUudHlwZV0gOiB0aGlzLnRlbXBsYXRlTWFwWydkZWZhdWx0J107XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBcbiAgICBvbk5vZGVDbGljayhldmVudDogRXZlbnQsIG5vZGU6IFRyZWVOb2RlKSB7XG4gICAgICAgIGxldCBldmVudFRhcmdldCA9ICg8RWxlbWVudD4gZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIGlmKGV2ZW50VGFyZ2V0LmNsYXNzTmFtZSAmJiAoZXZlbnRUYXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3VpLW5vZGUtdG9nZ2xlcicpICE9PSAtMSB8fMKgZXZlbnRUYXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3VpLW5vZGUtdG9nZ2xlci1pY29uJykgIT09IC0xKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYodGhpcy5zZWxlY3Rpb25Nb2RlKSB7XG4gICAgICAgICAgICBpZihub2RlLnNlbGVjdGFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLmZpbmRJbmRleEluU2VsZWN0aW9uKG5vZGUpO1xuICAgICAgICAgICAgbGV0IHNlbGVjdGVkID0gKGluZGV4ID49IDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZih0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdzaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgaWYoc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTm9kZVVuc2VsZWN0LmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBub2RlOiBub2RlfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IG5vZGU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25Ob2RlU2VsZWN0LmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBub2RlOiBub2RlfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZih0aGlzLnNlbGVjdGlvbk1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgICAgICAgICAgICBpZihzZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0aW9uLmZpbHRlcigodmFsLGkpID0+IGkhPWluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbk5vZGVVbnNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgbm9kZTogbm9kZX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb24gPSBbLi4udGhpcy5zZWxlY3Rpb258fFtdLG5vZGVdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uTm9kZVNlbGVjdC5lbWl0KHtvcmlnaW5hbEV2ZW50OiBldmVudCwgbm9kZTogbm9kZX0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdCh0aGlzLnNlbGVjdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgZmluZEluZGV4SW5TZWxlY3Rpb24obm9kZTogVHJlZU5vZGUpIHtcbiAgICAgICAgbGV0IGluZGV4OiBudW1iZXIgPSAtMTtcblxuICAgICAgICBpZih0aGlzLnNlbGVjdGlvbk1vZGUgJiYgdGhpcy5zZWxlY3Rpb24pIHtcbiAgICAgICAgICAgIGlmKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ3NpbmdsZScpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9ICh0aGlzLnNlbGVjdGlvbiA9PSBub2RlKSA/IDAgOiAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuc2VsZWN0aW9uTW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgIDwgdGhpcy5zZWxlY3Rpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5zZWxlY3Rpb25baV0gPT0gbm9kZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIFxuICAgIGlzU2VsZWN0ZWQobm9kZTogVHJlZU5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEluZGV4SW5TZWxlY3Rpb24obm9kZSkgIT0gLTE7ICAgICAgICAgXG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtPcmdhbml6YXRpb25DaGFydCxTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW09yZ2FuaXphdGlvbkNoYXJ0LE9yZ2FuaXphdGlvbkNoYXJ0Tm9kZV1cbn0pXG5leHBvcnQgY2xhc3MgT3JnYW5pemF0aW9uQ2hhcnRNb2R1bGUgeyB9Il19