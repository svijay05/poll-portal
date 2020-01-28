var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule, Component, OnDestroy, Input, Output, EventEmitter, TemplateRef, AfterViewInit, AfterContentInit, ContentChildren, QueryList, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ProgressBarModule } from 'primeng/progressbar';
import { DomHandler } from 'primeng/dom';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from "@angular/common/http";
let FileUpload = class FileUpload {
    constructor(el, sanitizer, zone, http) {
        this.el = el;
        this.sanitizer = sanitizer;
        this.zone = zone;
        this.http = http;
        this.method = 'POST';
        this.invalidFileSizeMessageSummary = '{0}: Invalid file size, ';
        this.invalidFileSizeMessageDetail = 'maximum upload size is {0}.';
        this.invalidFileTypeMessageSummary = '{0}: Invalid file type, ';
        this.invalidFileTypeMessageDetail = 'allowed file types: {0}.';
        this.invalidFileLimitMessageDetail = 'limit is {0} at most.';
        this.invalidFileLimitMessageSummary = 'Maximum number of files exceeded, ';
        this.previewWidth = 50;
        this.chooseLabel = 'Choose';
        this.uploadLabel = 'Upload';
        this.cancelLabel = 'Cancel';
        this.showUploadButton = true;
        this.showCancelButton = true;
        this.mode = 'advanced';
        this.onBeforeUpload = new EventEmitter();
        this.onSend = new EventEmitter();
        this.onUpload = new EventEmitter();
        this.onError = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onRemove = new EventEmitter();
        this.onSelect = new EventEmitter();
        this.onProgress = new EventEmitter();
        this.uploadHandler = new EventEmitter();
        this._files = [];
        this.progress = 0;
        this.uploadedFileCount = 0;
    }
    set files(files) {
        this._files = [];
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (this.validate(file)) {
                if (this.isImage(file)) {
                    file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                }
                this._files.push(files[i]);
            }
        }
    }
    get files() {
        return this._files;
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'file':
                    this.fileTemplate = item.template;
                    break;
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'toolbar':
                    this.toolbarTemplate = item.template;
                    break;
                default:
                    this.fileTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        if (this.mode === 'advanced') {
            this.zone.runOutsideAngular(() => {
                if (this.content)
                    this.content.nativeElement.addEventListener('dragover', this.onDragOver.bind(this));
            });
        }
    }
    onFileSelect(event) {
        if (event.type !== 'drop' && this.isIE11() && this.duplicateIEEvent) {
            this.duplicateIEEvent = false;
            return;
        }
        this.msgs = [];
        if (!this.multiple) {
            this.files = [];
        }
        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (!this.isFileSelected(file)) {
                if (this.validate(file)) {
                    if (this.isImage(file)) {
                        file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
                    }
                    this.files.push(files[i]);
                }
            }
        }
        this.onSelect.emit({ originalEvent: event, files: files });
        if (this.fileLimit && this.mode == "advanced") {
            this.checkFileLimit();
        }
        if (this.hasFiles() && this.auto && (!(this.mode === "advanced") || !this.isFileLimitExceeded())) {
            this.upload();
        }
        if (event.type !== 'drop' && this.isIE11()) {
            this.clearIEInput();
        }
        else {
            this.clearInputElement();
        }
    }
    isFileSelected(file) {
        for (let sFile of this.files) {
            if ((sFile.name + sFile.type + sFile.size) === (file.name + file.type + file.size)) {
                return true;
            }
        }
        return false;
    }
    isIE11() {
        return !!window['MSInputMethodContext'] && !!document['documentMode'];
    }
    validate(file) {
        if (this.accept && !this.isFileTypeValid(file)) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileTypeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileTypeMessageDetail.replace('{0}', this.accept)
            });
            return false;
        }
        if (this.maxFileSize && file.size > this.maxFileSize) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileSizeMessageSummary.replace('{0}', file.name),
                detail: this.invalidFileSizeMessageDetail.replace('{0}', this.formatSize(this.maxFileSize))
            });
            return false;
        }
        return true;
    }
    isFileTypeValid(file) {
        let acceptableTypes = this.accept.split(',').map(type => type.trim());
        for (let type of acceptableTypes) {
            let acceptable = this.isWildcard(type) ? this.getTypeClass(file.type) === this.getTypeClass(type)
                : file.type == type || this.getFileExtension(file).toLowerCase() === type.toLowerCase();
            if (acceptable) {
                return true;
            }
        }
        return false;
    }
    getTypeClass(fileType) {
        return fileType.substring(0, fileType.indexOf('/'));
    }
    isWildcard(fileType) {
        return fileType.indexOf('*') !== -1;
    }
    getFileExtension(file) {
        return '.' + file.name.split('.').pop();
    }
    isImage(file) {
        return /^image\//.test(file.type);
    }
    onImageLoad(img) {
        window.URL.revokeObjectURL(img.src);
    }
    upload() {
        if (this.customUpload) {
            if (this.fileLimit) {
                this.uploadedFileCount += this.files.length;
            }
            this.uploadHandler.emit({
                files: this.files
            });
        }
        else {
            this.uploading = true;
            this.msgs = [];
            let formData = new FormData();
            this.onBeforeUpload.emit({
                'formData': formData
            });
            for (let i = 0; i < this.files.length; i++) {
                formData.append(this.name, this.files[i], this.files[i].name);
            }
            this.http.post(this.url, formData, {
                headers: this.headers, reportProgress: true, observe: 'events', withCredentials: this.withCredentials
            }).subscribe((event) => {
                switch (event.type) {
                    case HttpEventType.Sent:
                        this.onSend.emit({
                            originalEvent: event,
                            'formData': formData
                        });
                        break;
                    case HttpEventType.Response:
                        this.uploading = false;
                        this.progress = 0;
                        if (event['status'] >= 200 && event['status'] < 300) {
                            if (this.fileLimit) {
                                this.uploadedFileCount += this.files.length;
                            }
                            this.onUpload.emit({ originalEvent: event, files: this.files });
                        }
                        else {
                            this.onError.emit({ files: this.files });
                        }
                        this.clear();
                        break;
                    case HttpEventType.UploadProgress: {
                        if (event['loaded']) {
                            this.progress = Math.round((event['loaded'] * 100) / event['total']);
                        }
                        this.onProgress.emit({ originalEvent: event, progress: this.progress });
                        break;
                    }
                }
            }, error => {
                this.uploading = false;
                this.onError.emit({ files: this.files, error: error });
            });
        }
    }
    clear() {
        this.files = [];
        this.onClear.emit();
        this.clearInputElement();
    }
    remove(event, index) {
        this.clearInputElement();
        this.onRemove.emit({ originalEvent: event, file: this.files[index] });
        this.files.splice(index, 1);
    }
    isFileLimitExceeded() {
        if (this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount && this.focus) {
            this.focus = false;
        }
        return this.fileLimit && this.fileLimit < this.files.length + this.uploadedFileCount;
    }
    isChooseDisabled() {
        return this.fileLimit && this.fileLimit <= this.files.length + this.uploadedFileCount;
    }
    checkFileLimit() {
        if (this.isFileLimitExceeded()) {
            this.msgs.push({
                severity: 'error',
                summary: this.invalidFileLimitMessageSummary.replace('{0}', this.fileLimit.toString()),
                detail: this.invalidFileLimitMessageDetail.replace('{0}', this.fileLimit.toString())
            });
        }
    }
    clearInputElement() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.advancedFileInput.nativeElement.value = '';
        }
        if (this.basicFileInput && this.basicFileInput.nativeElement) {
            this.basicFileInput.nativeElement.value = '';
        }
    }
    clearIEInput() {
        if (this.advancedFileInput && this.advancedFileInput.nativeElement) {
            this.duplicateIEEvent = true; //IE11 fix to prevent onFileChange trigger again
            this.advancedFileInput.nativeElement.value = '';
        }
    }
    hasFiles() {
        return this.files && this.files.length > 0;
    }
    onDragEnter(e) {
        if (!this.disabled) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragOver(e) {
        if (!this.disabled) {
            DomHandler.addClass(this.content.nativeElement, 'ui-fileupload-highlight');
            this.dragHighlight = true;
            e.stopPropagation();
            e.preventDefault();
        }
    }
    onDragLeave(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
        }
    }
    onDrop(event) {
        if (!this.disabled) {
            DomHandler.removeClass(this.content.nativeElement, 'ui-fileupload-highlight');
            event.stopPropagation();
            event.preventDefault();
            let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
            let allowDrop = this.multiple || (files && files.length === 1);
            if (allowDrop) {
                this.onFileSelect(event);
            }
        }
    }
    onFocus() {
        this.focus = true;
    }
    onBlur() {
        this.focus = false;
    }
    formatSize(bytes) {
        if (bytes == 0) {
            return '0 B';
        }
        let k = 1000, dm = 3, sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    onSimpleUploaderClick(event) {
        if (this.hasFiles()) {
            this.upload();
        }
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    ngOnDestroy() {
        if (this.content && this.content.nativeElement) {
            this.content.nativeElement.removeEventListener('dragover', this.onDragOver);
        }
    }
};
FileUpload.ctorParameters = () => [
    { type: ElementRef },
    { type: DomSanitizer },
    { type: NgZone },
    { type: HttpClient }
];
__decorate([
    Input()
], FileUpload.prototype, "name", void 0);
__decorate([
    Input()
], FileUpload.prototype, "url", void 0);
__decorate([
    Input()
], FileUpload.prototype, "method", void 0);
__decorate([
    Input()
], FileUpload.prototype, "multiple", void 0);
__decorate([
    Input()
], FileUpload.prototype, "accept", void 0);
__decorate([
    Input()
], FileUpload.prototype, "disabled", void 0);
__decorate([
    Input()
], FileUpload.prototype, "auto", void 0);
__decorate([
    Input()
], FileUpload.prototype, "withCredentials", void 0);
__decorate([
    Input()
], FileUpload.prototype, "maxFileSize", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileSizeMessageSummary", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileSizeMessageDetail", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileTypeMessageSummary", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileTypeMessageDetail", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileLimitMessageDetail", void 0);
__decorate([
    Input()
], FileUpload.prototype, "invalidFileLimitMessageSummary", void 0);
__decorate([
    Input()
], FileUpload.prototype, "style", void 0);
__decorate([
    Input()
], FileUpload.prototype, "styleClass", void 0);
__decorate([
    Input()
], FileUpload.prototype, "previewWidth", void 0);
__decorate([
    Input()
], FileUpload.prototype, "chooseLabel", void 0);
__decorate([
    Input()
], FileUpload.prototype, "uploadLabel", void 0);
__decorate([
    Input()
], FileUpload.prototype, "cancelLabel", void 0);
__decorate([
    Input()
], FileUpload.prototype, "showUploadButton", void 0);
__decorate([
    Input()
], FileUpload.prototype, "showCancelButton", void 0);
__decorate([
    Input()
], FileUpload.prototype, "mode", void 0);
__decorate([
    Input()
], FileUpload.prototype, "headers", void 0);
__decorate([
    Input()
], FileUpload.prototype, "customUpload", void 0);
__decorate([
    Input()
], FileUpload.prototype, "fileLimit", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onBeforeUpload", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onSend", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onUpload", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onError", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onClear", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onRemove", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onSelect", void 0);
__decorate([
    Output()
], FileUpload.prototype, "onProgress", void 0);
__decorate([
    Output()
], FileUpload.prototype, "uploadHandler", void 0);
__decorate([
    ContentChildren(PrimeTemplate)
], FileUpload.prototype, "templates", void 0);
__decorate([
    ViewChild('advancedfileinput', { static: false })
], FileUpload.prototype, "advancedFileInput", void 0);
__decorate([
    ViewChild('basicfileinput', { static: false })
], FileUpload.prototype, "basicFileInput", void 0);
__decorate([
    ViewChild('content', { static: false })
], FileUpload.prototype, "content", void 0);
__decorate([
    Input()
], FileUpload.prototype, "files", null);
FileUpload = __decorate([
    Component({
        selector: 'p-fileUpload',
        template: `
        <div [ngClass]="'ui-fileupload ui-widget'" [ngStyle]="style" [class]="styleClass" *ngIf="mode === 'advanced'">
            <div class="ui-fileupload-buttonbar ui-widget-header ui-corner-top">
                <span class="ui-fileupload-choose" [label]="chooseLabel" icon="pi pi-plus" pButton [ngClass]="{'ui-state-focus': focus, 'ui-state-disabled':disabled || isChooseDisabled()}"> 
                    <input #advancedfileinput type="file" (change)="onFileSelect($event)" [multiple]="multiple" [accept]="accept" [disabled]="disabled || isChooseDisabled()" (focus)="onFocus()" (blur)="onBlur()">
                </span>

                <p-button *ngIf="!auto&&showUploadButton" type="button" [label]="uploadLabel" icon="pi pi-upload" (onClick)="upload()" [disabled]="!hasFiles() || isFileLimitExceeded()"></p-button>
                <p-button *ngIf="!auto&&showCancelButton" type="button" [label]="cancelLabel" icon="pi pi-times" (onClick)="clear()" [disabled]="!hasFiles() || uploading"></p-button>

                <ng-container *ngTemplateOutlet="toolbarTemplate"></ng-container>
            </div>
            <div #content [ngClass]="{'ui-fileupload-content ui-widget-content ui-corner-bottom':true}"
                 (dragenter)="onDragEnter($event)" (dragleave)="onDragLeave($event)" (drop)="onDrop($event)">
                <p-progressBar [value]="progress" [showValue]="false" *ngIf="hasFiles()"></p-progressBar>

                <p-messages [value]="msgs" [enableService]="false"></p-messages>

                <div class="ui-fileupload-files" *ngIf="hasFiles()">
                    <div *ngIf="!fileTemplate">
                        <div class="ui-fileupload-row" *ngFor="let file of files; let i = index;">
                            <div><img [src]="file.objectURL" *ngIf="isImage(file)" [width]="previewWidth" /></div>
                            <div>{{file.name}}</div>
                            <div>{{formatSize(file.size)}}</div>
                            <div>
                                <button type="button" icon="pi pi-times" pButton (click)="remove($event,i)" [disabled]="uploading"></button>
                            </div>
                        </div>
                    </div>
                    <div *ngIf="fileTemplate">
                        <ng-template ngFor [ngForOf]="files" [ngForTemplate]="fileTemplate"></ng-template>
                    </div>
                </div>
                <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            </div>
        </div>
        <span *ngIf="mode === 'basic'" [ngClass]="{'ui-button ui-fileupload-choose ui-widget ui-state-default ui-corner-all ui-button-text-icon-left': true, 
                'ui-fileupload-choose-selected': hasFiles(),'ui-state-focus': focus, 'ui-state-disabled':disabled}"
              [ngStyle]="style" [class]="styleClass" (mouseup)="onSimpleUploaderClick($event)">
            <span class="ui-button-icon-left pi" [ngClass]="{'pi-plus': !hasFiles()||auto, 'pi-upload': hasFiles()&&!auto}"></span>
            <span class="ui-button-text ui-clickable">{{auto ? chooseLabel : hasFiles() ? files[0].name : chooseLabel}}</span>
            <input #basicfileinput type="file" [accept]="accept" [multiple]="multiple" [disabled]="disabled"
                   (change)="onFileSelect($event)" *ngIf="!hasFiles()" (focus)="onFocus()" (blur)="onBlur()">
        </span>
    `
    })
], FileUpload);
export { FileUpload };
let FileUploadModule = class FileUploadModule {
};
FileUploadModule = __decorate([
    NgModule({
        imports: [CommonModule, SharedModule, ButtonModule, ProgressBarModule, MessagesModule],
        exports: [FileUpload, SharedModule, ButtonModule, ProgressBarModule, MessagesModule],
        declarations: [FileUpload]
    })
], FileUploadModule);
export { FileUploadModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXVwbG9hZC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvZmlsZXVwbG9hZC8iLCJzb3VyY2VzIjpbImZpbGV1cGxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsT0FBTyxFQUFDLFFBQVEsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLEtBQUssRUFBQyxNQUFNLEVBQUMsWUFBWSxFQUFDLFdBQVcsRUFBQyxhQUFhLEVBQUMsZ0JBQWdCLEVBQzdGLGVBQWUsRUFBQyxTQUFTLEVBQUMsU0FBUyxFQUFDLFVBQVUsRUFBQyxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDeEYsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUN2RCxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdkMsT0FBTyxFQUFDLGFBQWEsRUFBQyxZQUFZLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFdkQsT0FBTyxFQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBa0R2RixJQUFhLFVBQVUsR0FBdkIsTUFBYSxVQUFVO0lBNEhuQixZQUFvQixFQUFjLEVBQVMsU0FBdUIsRUFBUyxJQUFZLEVBQVUsSUFBZ0I7UUFBN0YsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBWTtRQXRIeEcsV0FBTSxHQUFXLE1BQU0sQ0FBQztR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QyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUM7MkNBQXFCO0FBRXBEO0lBQVIsS0FBSyxFQUFFO3VDQWNQO0FBaEdRLFVBQVU7SUFoRHRCLFNBQVMsQ0FBQztRQUNQLFFBQVEsRUFBRSxjQUFjO1FBQ3hCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0E0Q1Q7S0FDSixDQUFDO0dBQ1csVUFBVSxDQStjdEI7U0EvY1ksVUFBVTtBQXNkdkIsSUFBYSxnQkFBZ0IsR0FBN0IsTUFBYSxnQkFBZ0I7Q0FBSSxDQUFBO0FBQXBCLGdCQUFnQjtJQUw1QixRQUFRLENBQUM7UUFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUMsWUFBWSxFQUFDLFlBQVksRUFBQyxpQkFBaUIsRUFBQyxjQUFjLENBQUM7UUFDbEYsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFDLFlBQVksRUFBQyxZQUFZLEVBQUMsaUJBQWlCLEVBQUMsY0FBYyxDQUFDO1FBQ2hGLFlBQVksRUFBRSxDQUFDLFVBQVUsQ0FBQztLQUM3QixDQUFDO0dBQ1csZ0JBQWdCLENBQUk7U0FBcEIsZ0JBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtOZ01vZHVsZSxDb21wb25lbnQsT25EZXN0cm95LElucHV0LE91dHB1dCxFdmVudEVtaXR0ZXIsVGVtcGxhdGVSZWYsQWZ0ZXJWaWV3SW5pdCxBZnRlckNvbnRlbnRJbml0LFxuICAgICAgICAgICAgQ29udGVudENoaWxkcmVuLFF1ZXJ5TGlzdCxWaWV3Q2hpbGQsRWxlbWVudFJlZixOZ1pvbmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0RvbVNhbml0aXplcn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQge0J1dHRvbk1vZHVsZX0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHtNZXNzYWdlc01vZHVsZX0gZnJvbSAncHJpbWVuZy9tZXNzYWdlcyc7XG5pbXBvcnQge1Byb2dyZXNzQmFyTW9kdWxlfSBmcm9tICdwcmltZW5nL3Byb2dyZXNzYmFyJztcbmltcG9ydCB7RG9tSGFuZGxlcn0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHtNZXNzYWdlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge1ByaW1lVGVtcGxhdGUsU2hhcmVkTW9kdWxlfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0Jsb2NrYWJsZVVJfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBFdmVudCwgSHR0cEV2ZW50VHlwZSwgSHR0cEhlYWRlcnN9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtZmlsZVVwbG9hZCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiBbbmdDbGFzc109XCIndWktZmlsZXVwbG9hZCB1aS13aWRnZXQnXCIgW25nU3R5bGVdPVwic3R5bGVcIiBbY2xhc3NdPVwic3R5bGVDbGFzc1wiICpuZ0lmPVwibW9kZSA9PT0gJ2FkdmFuY2VkJ1wiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWZpbGV1cGxvYWQtYnV0dG9uYmFyIHVpLXdpZGdldC1oZWFkZXIgdWktY29ybmVyLXRvcFwiPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktZmlsZXVwbG9hZC1jaG9vc2VcIiBbbGFiZWxdPVwiY2hvb3NlTGFiZWxcIiBpY29uPVwicGkgcGktcGx1c1wiIHBCdXR0b24gW25nQ2xhc3NdPVwieyd1aS1zdGF0ZS1mb2N1cyc6IGZvY3VzLCAndWktc3RhdGUtZGlzYWJsZWQnOmRpc2FibGVkIHx8IGlzQ2hvb3NlRGlzYWJsZWQoKX1cIj4gXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCAjYWR2YW5jZWRmaWxlaW5wdXQgdHlwZT1cImZpbGVcIiAoY2hhbmdlKT1cIm9uRmlsZVNlbGVjdCgkZXZlbnQpXCIgW211bHRpcGxlXT1cIm11bHRpcGxlXCIgW2FjY2VwdF09XCJhY2NlcHRcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWQgfHwgaXNDaG9vc2VEaXNhYmxlZCgpXCIgKGZvY3VzKT1cIm9uRm9jdXMoKVwiIChibHVyKT1cIm9uQmx1cigpXCI+XG4gICAgICAgICAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgICAgICAgICAgPHAtYnV0dG9uICpuZ0lmPVwiIWF1dG8mJnNob3dVcGxvYWRCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgW2xhYmVsXT1cInVwbG9hZExhYmVsXCIgaWNvbj1cInBpIHBpLXVwbG9hZFwiIChvbkNsaWNrKT1cInVwbG9hZCgpXCIgW2Rpc2FibGVkXT1cIiFoYXNGaWxlcygpIHx8IGlzRmlsZUxpbWl0RXhjZWVkZWQoKVwiPjwvcC1idXR0b24+XG4gICAgICAgICAgICAgICAgPHAtYnV0dG9uICpuZ0lmPVwiIWF1dG8mJnNob3dDYW5jZWxCdXR0b25cIiB0eXBlPVwiYnV0dG9uXCIgW2xhYmVsXT1cImNhbmNlbExhYmVsXCIgaWNvbj1cInBpIHBpLXRpbWVzXCIgKG9uQ2xpY2spPVwiY2xlYXIoKVwiIFtkaXNhYmxlZF09XCIhaGFzRmlsZXMoKSB8fMKgdXBsb2FkaW5nXCI+PC9wLWJ1dHRvbj5cblxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0b29sYmFyVGVtcGxhdGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiAjY29udGVudCBbbmdDbGFzc109XCJ7J3VpLWZpbGV1cGxvYWQtY29udGVudCB1aS13aWRnZXQtY29udGVudCB1aS1jb3JuZXItYm90dG9tJzp0cnVlfVwiXG4gICAgICAgICAgICAgICAgIChkcmFnZW50ZXIpPVwib25EcmFnRW50ZXIoJGV2ZW50KVwiIChkcmFnbGVhdmUpPVwib25EcmFnTGVhdmUoJGV2ZW50KVwiIChkcm9wKT1cIm9uRHJvcCgkZXZlbnQpXCI+XG4gICAgICAgICAgICAgICAgPHAtcHJvZ3Jlc3NCYXIgW3ZhbHVlXT1cInByb2dyZXNzXCIgW3Nob3dWYWx1ZV09XCJmYWxzZVwiICpuZ0lmPVwiaGFzRmlsZXMoKVwiPjwvcC1wcm9ncmVzc0Jhcj5cblxuICAgICAgICAgICAgICAgIDxwLW1lc3NhZ2VzIFt2YWx1ZV09XCJtc2dzXCIgW2VuYWJsZVNlcnZpY2VdPVwiZmFsc2VcIj48L3AtbWVzc2FnZXM+XG5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktZmlsZXVwbG9hZC1maWxlc1wiICpuZ0lmPVwiaGFzRmlsZXMoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiIWZpbGVUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWZpbGV1cGxvYWQtcm93XCIgKm5nRm9yPVwibGV0IGZpbGUgb2YgZmlsZXM7IGxldCBpID0gaW5kZXg7XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj48aW1nIFtzcmNdPVwiZmlsZS5vYmplY3RVUkxcIiAqbmdJZj1cImlzSW1hZ2UoZmlsZSlcIiBbd2lkdGhdPVwicHJldmlld1dpZHRoXCIgLz48L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pnt7ZmlsZS5uYW1lfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2Pnt7Zm9ybWF0U2l6ZShmaWxlLnNpemUpfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpY29uPVwicGkgcGktdGltZXNcIiBwQnV0dG9uIChjbGljayk9XCJyZW1vdmUoJGV2ZW50LGkpXCIgW2Rpc2FibGVkXT1cInVwbG9hZGluZ1wiPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiZmlsZVRlbXBsYXRlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgbmdGb3IgW25nRm9yT2ZdPVwiZmlsZXNcIiBbbmdGb3JUZW1wbGF0ZV09XCJmaWxlVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwibW9kZSA9PT0gJ2Jhc2ljJ1wiIFtuZ0NsYXNzXT1cInsndWktYnV0dG9uIHVpLWZpbGV1cGxvYWQtY2hvb3NlIHVpLXdpZGdldCB1aS1zdGF0ZS1kZWZhdWx0IHVpLWNvcm5lci1hbGwgdWktYnV0dG9uLXRleHQtaWNvbi1sZWZ0JzogdHJ1ZSwgXG4gICAgICAgICAgICAgICAgJ3VpLWZpbGV1cGxvYWQtY2hvb3NlLXNlbGVjdGVkJzogaGFzRmlsZXMoKSwndWktc3RhdGUtZm9jdXMnOiBmb2N1cywgJ3VpLXN0YXRlLWRpc2FibGVkJzpkaXNhYmxlZH1cIlxuICAgICAgICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVwiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgKG1vdXNldXApPVwib25TaW1wbGVVcGxvYWRlckNsaWNrKCRldmVudClcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktYnV0dG9uLWljb24tbGVmdCBwaVwiIFtuZ0NsYXNzXT1cInsncGktcGx1cyc6ICFoYXNGaWxlcygpfHxhdXRvLCAncGktdXBsb2FkJzogaGFzRmlsZXMoKSYmIWF1dG99XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1idXR0b24tdGV4dCB1aS1jbGlja2FibGVcIj57e2F1dG8gPyBjaG9vc2VMYWJlbCA6IGhhc0ZpbGVzKCkgPyBmaWxlc1swXS5uYW1lIDogY2hvb3NlTGFiZWx9fTwvc3Bhbj5cbiAgICAgICAgICAgIDxpbnB1dCAjYmFzaWNmaWxlaW5wdXQgdHlwZT1cImZpbGVcIiBbYWNjZXB0XT1cImFjY2VwdFwiIFttdWx0aXBsZV09XCJtdWx0aXBsZVwiIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAgKGNoYW5nZSk9XCJvbkZpbGVTZWxlY3QoJGV2ZW50KVwiICpuZ0lmPVwiIWhhc0ZpbGVzKClcIiAoZm9jdXMpPVwib25Gb2N1cygpXCIgKGJsdXIpPVwib25CbHVyKClcIj5cbiAgICAgICAgPC9zcGFuPlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgRmlsZVVwbG9hZCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsQWZ0ZXJDb250ZW50SW5pdCxPbkRlc3Ryb3ksQmxvY2thYmxlVUkge1xuXG4gICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdXJsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtZXRob2Q6IHN0cmluZyA9ICdQT1NUJztcblxuICAgIEBJbnB1dCgpIG11bHRpcGxlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgYWNjZXB0OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGF1dG86IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB3aXRoQ3JlZGVudGlhbHM6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBtYXhGaWxlU2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgaW52YWxpZEZpbGVTaXplTWVzc2FnZVN1bW1hcnk6IHN0cmluZyA9ICd7MH06IEludmFsaWQgZmlsZSBzaXplLCAnO1xuXG4gICAgQElucHV0KCkgaW52YWxpZEZpbGVTaXplTWVzc2FnZURldGFpbDogc3RyaW5nID0gJ21heGltdW0gdXBsb2FkIHNpemUgaXMgezB9Lic7XG5cbiAgICBASW5wdXQoKSBpbnZhbGlkRmlsZVR5cGVNZXNzYWdlU3VtbWFyeTogc3RyaW5nID0gJ3swfTogSW52YWxpZCBmaWxlIHR5cGUsICc7XG5cbiAgICBASW5wdXQoKSBpbnZhbGlkRmlsZVR5cGVNZXNzYWdlRGV0YWlsOiBzdHJpbmcgPSAnYWxsb3dlZCBmaWxlIHR5cGVzOiB7MH0uJztcblxuICAgIEBJbnB1dCgpIGludmFsaWRGaWxlTGltaXRNZXNzYWdlRGV0YWlsOiBzdHJpbmcgPSAnbGltaXQgaXMgezB9IGF0IG1vc3QuJztcblxuICAgIEBJbnB1dCgpIGludmFsaWRGaWxlTGltaXRNZXNzYWdlU3VtbWFyeTogc3RyaW5nID0gJ01heGltdW0gbnVtYmVyIG9mIGZpbGVzIGV4Y2VlZGVkLCAnO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHByZXZpZXdXaWR0aDogbnVtYmVyID0gNTA7XG5cbiAgICBASW5wdXQoKSBjaG9vc2VMYWJlbDogc3RyaW5nID0gJ0Nob29zZSc7XG5cbiAgICBASW5wdXQoKSB1cGxvYWRMYWJlbDogc3RyaW5nID0gJ1VwbG9hZCc7XG5cbiAgICBASW5wdXQoKSBjYW5jZWxMYWJlbDogc3RyaW5nID0gJ0NhbmNlbCc7XG5cbiAgICBASW5wdXQoKSBzaG93VXBsb2FkQnV0dG9uOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIHNob3dDYW5jZWxCdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgbW9kZTogc3RyaW5nID0gJ2FkdmFuY2VkJztcblxuICAgIEBJbnB1dCgpIGhlYWRlcnM6IEh0dHBIZWFkZXJzO1xuICAgIFxuICAgIEBJbnB1dCgpIGN1c3RvbVVwbG9hZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGZpbGVMaW1pdDogbnVtYmVyO1xuXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlVXBsb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNlbmQ6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uVXBsb2FkOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkVycm9yOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkNsZWFyOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblJlbW92ZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TZWxlY3Q6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uUHJvZ3Jlc3M6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIHVwbG9hZEhhbmRsZXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnYWR2YW5jZWRmaWxlaW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgYWR2YW5jZWRGaWxlSW5wdXQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdiYXNpY2ZpbGVpbnB1dCcsIHsgc3RhdGljOiBmYWxzZSB9KSBiYXNpY0ZpbGVJbnB1dDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgY29udGVudDogRWxlbWVudFJlZjtcblxuICAgIEBJbnB1dCgpIHNldCBmaWxlcyhmaWxlcykge1xuICAgICAgICB0aGlzLl9maWxlcyA9IFtdO1xuXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGZpbGUgPSBmaWxlc1tpXTtcblxuICAgICAgICAgICAgaWYodGhpcy52YWxpZGF0ZShmaWxlKSkge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNJbWFnZShmaWxlKSkge1xuICAgICAgICAgICAgICAgICAgICAoPGFueT5maWxlKS5vYmplY3RVUkwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0VXJsKCh3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlc1tpXSkpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9maWxlcy5wdXNoKGZpbGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBmaWxlcygpOiBGaWxlW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmlsZXM7XG4gICAgfVxuXG4gICAgcHVibGljIF9maWxlczogRmlsZVtdID0gW107XG5cbiAgICBwdWJsaWMgcHJvZ3Jlc3M6IG51bWJlciA9IDA7XG5cbiAgICBwdWJsaWMgZHJhZ0hpZ2hsaWdodDogYm9vbGVhbjtcblxuICAgIHB1YmxpYyBtc2dzOiBNZXNzYWdlW107XG5cbiAgICBwdWJsaWMgZmlsZVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgcHVibGljIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIHB1YmxpYyB0b29sYmFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBwdWJsaWMgdXBsb2FkZWRGaWxlQ291bnQ6IG51bWJlciA9IDA7XG5cbiAgICBmb2N1czogYm9vbGVhbjtcblxuICAgIHVwbG9hZGluZzogYm9vbGVhbjtcblxuICAgIGR1cGxpY2F0ZUlFRXZlbnQ6IGJvb2xlYW47ICAvLyBmbGFnIHRvIHJlY29nbml6ZSBkdXBsaWNhdGUgb25jaGFuZ2UgZXZlbnQgZm9yIGZpbGUgaW5wdXRcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBzYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KXt9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMudGVtcGxhdGVzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ2ZpbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGVUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAndG9vbGJhcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsZVRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBpZih0aGlzLm1vZGUgPT09ICdhZHZhbmNlZCcpIHtcbiAgICAgICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudClcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCB0aGlzLm9uRHJhZ092ZXIuYmluZCh0aGlzKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRmlsZVNlbGVjdChldmVudCkge1xuICAgICAgICBpZihldmVudC50eXBlICE9PSAnZHJvcCcgJiYgdGhpcy5pc0lFMTEoKSAmJiB0aGlzLmR1cGxpY2F0ZUlFRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlSUVFdmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5tc2dzID0gW107XG4gICAgICAgIGlmKCF0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVzID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZmlsZXMgPSBldmVudC5kYXRhVHJhbnNmZXIgPyBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMgOiBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBmaWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGZpbGUgPSBmaWxlc1tpXTtcblxuICAgICAgICAgICAgaWYoIXRoaXMuaXNGaWxlU2VsZWN0ZWQoZmlsZSkpe1xuICAgICAgICAgICAgICBpZih0aGlzLnZhbGlkYXRlKGZpbGUpKSB7XG4gICAgICAgICAgICAgICAgICBpZih0aGlzLmlzSW1hZ2UoZmlsZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICBmaWxlLm9iamVjdFVSTCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RVcmwoKHdpbmRvdy5VUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGVzW2ldKSkpO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICB0aGlzLmZpbGVzLnB1c2goZmlsZXNbaV0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLm9uU2VsZWN0LmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBmaWxlczogZmlsZXN9KTtcblxuICAgICAgICBpZiAodGhpcy5maWxlTGltaXQgJiYgdGhpcy5tb2RlID09IFwiYWR2YW5jZWRcIikge1xuICAgICAgICAgICAgdGhpcy5jaGVja0ZpbGVMaW1pdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5oYXNGaWxlcygpICYmIHRoaXMuYXV0byAmJiAoISh0aGlzLm1vZGUgPT09IFwiYWR2YW5jZWRcIikgfHwgIXRoaXMuaXNGaWxlTGltaXRFeGNlZWRlZCgpKSkge1xuICAgICAgICAgICAgdGhpcy51cGxvYWQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChldmVudC50eXBlICE9PSAnZHJvcCcgJiYgdGhpcy5pc0lFMTEoKSkge1xuICAgICAgICAgIHRoaXMuY2xlYXJJRUlucHV0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jbGVhcklucHV0RWxlbWVudCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNGaWxlU2VsZWN0ZWQoZmlsZTogRmlsZSk6IGJvb2xlYW57XG4gICAgICAgIGZvcihsZXQgc0ZpbGUgb2YgdGhpcy5maWxlcyl7XG4gICAgICAgICAgICBpZigoc0ZpbGUubmFtZSArIHNGaWxlLnR5cGUgKyBzRmlsZS5zaXplKSA9PT0gKGZpbGUubmFtZSArIGZpbGUudHlwZStmaWxlLnNpemUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNJRTExKCkge1xuICAgICAgICByZXR1cm4gISF3aW5kb3dbJ01TSW5wdXRNZXRob2RDb250ZXh0J10gJiYgISFkb2N1bWVudFsnZG9jdW1lbnRNb2RlJ107XG4gICAgfVxuXG4gICAgdmFsaWRhdGUoZmlsZTogRmlsZSk6IGJvb2xlYW4ge1xuICAgICAgICBpZih0aGlzLmFjY2VwdCAmJiAhdGhpcy5pc0ZpbGVUeXBlVmFsaWQoZmlsZSkpIHtcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiB0aGlzLmludmFsaWRGaWxlVHlwZU1lc3NhZ2VTdW1tYXJ5LnJlcGxhY2UoJ3swfScsIGZpbGUubmFtZSksXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmludmFsaWRGaWxlVHlwZU1lc3NhZ2VEZXRhaWwucmVwbGFjZSgnezB9JywgdGhpcy5hY2NlcHQpXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMubWF4RmlsZVNpemUgICYmIGZpbGUuc2l6ZSA+IHRoaXMubWF4RmlsZVNpemUpIHtcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiB0aGlzLmludmFsaWRGaWxlU2l6ZU1lc3NhZ2VTdW1tYXJ5LnJlcGxhY2UoJ3swfScsIGZpbGUubmFtZSksXG4gICAgICAgICAgICAgICAgZGV0YWlsOiB0aGlzLmludmFsaWRGaWxlU2l6ZU1lc3NhZ2VEZXRhaWwucmVwbGFjZSgnezB9JywgdGhpcy5mb3JtYXRTaXplKHRoaXMubWF4RmlsZVNpemUpKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGlzRmlsZVR5cGVWYWxpZChmaWxlOiBGaWxlKTogYm9vbGVhbiB7XG4gICAgICAgIGxldCBhY2NlcHRhYmxlVHlwZXMgPSB0aGlzLmFjY2VwdC5zcGxpdCgnLCcpLm1hcCh0eXBlID0+IHR5cGUudHJpbSgpKTtcbiAgICAgICAgZm9yKGxldCB0eXBlIG9mIGFjY2VwdGFibGVUeXBlcykge1xuICAgICAgICAgICAgbGV0IGFjY2VwdGFibGUgPSB0aGlzLmlzV2lsZGNhcmQodHlwZSkgPyB0aGlzLmdldFR5cGVDbGFzcyhmaWxlLnR5cGUpID09PSB0aGlzLmdldFR5cGVDbGFzcyh0eXBlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogZmlsZS50eXBlID09IHR5cGUgfHwgdGhpcy5nZXRGaWxlRXh0ZW5zaW9uKGZpbGUpLnRvTG93ZXJDYXNlKCkgPT09IHR5cGUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAgICAgaWYoYWNjZXB0YWJsZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGdldFR5cGVDbGFzcyhmaWxlVHlwZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGZpbGVUeXBlLnN1YnN0cmluZygwLCBmaWxlVHlwZS5pbmRleE9mKCcvJykpO1xuICAgIH1cblxuICAgIGlzV2lsZGNhcmQoZmlsZVR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmlsZVR5cGUuaW5kZXhPZignKicpICE9PSAtMTtcbiAgICB9XG5cbiAgICBnZXRGaWxlRXh0ZW5zaW9uKGZpbGU6IEZpbGUpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJy4nICsgZmlsZS5uYW1lLnNwbGl0KCcuJykucG9wKCk7XG4gICAgfVxuXG4gICAgaXNJbWFnZShmaWxlOiBGaWxlKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAvXmltYWdlXFwvLy50ZXN0KGZpbGUudHlwZSk7XG4gICAgfVxuXG4gICAgb25JbWFnZUxvYWQoaW1nOiBhbnkpIHtcbiAgICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwoaW1nLnNyYyk7XG4gICAgfVxuXG4gICAgdXBsb2FkKCkge1xuICAgICAgICBpZih0aGlzLmN1c3RvbVVwbG9hZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZmlsZUxpbWl0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlZEZpbGVDb3VudCArPSB0aGlzLmZpbGVzLmxlbmd0aDsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudXBsb2FkSGFuZGxlci5lbWl0KHtcbiAgICAgICAgICAgICAgICBmaWxlczogdGhpcy5maWxlc1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLm1zZ3MgPSBbXTtcbiAgICAgICAgICAgIGxldCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlVXBsb2FkLmVtaXQoe1xuICAgICAgICAgICAgICAgICdmb3JtRGF0YSc6IGZvcm1EYXRhXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmZpbGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm9ybURhdGEuYXBwZW5kKHRoaXMubmFtZSwgdGhpcy5maWxlc1tpXSwgdGhpcy5maWxlc1tpXS5uYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5odHRwLnBvc3QodGhpcy51cmwsIGZvcm1EYXRhLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczogdGhpcy5oZWFkZXJzLCByZXBvcnRQcm9ncmVzczogdHJ1ZSwgb2JzZXJ2ZTogJ2V2ZW50cycsIHdpdGhDcmVkZW50aWFsczogdGhpcy53aXRoQ3JlZGVudGlhbHNcbiAgICAgICAgICAgIH0pLnN1YnNjcmliZSggKGV2ZW50OiBIdHRwRXZlbnQ8YW55PikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5TZW50OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25TZW5kLmVtaXQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbEV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Zvcm1EYXRhJzogZm9ybURhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5SZXNwb25zZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwbG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucHJvZ3Jlc3MgPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50WydzdGF0dXMnXSA+PSAyMDAgJiYgZXZlbnRbJ3N0YXR1cyddIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbGVMaW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy51cGxvYWRlZEZpbGVDb3VudCArPSB0aGlzLmZpbGVzLmxlbmd0aDsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVXBsb2FkLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBmaWxlczogdGhpcy5maWxlc30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvci5lbWl0KHtmaWxlczogdGhpcy5maWxlc30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgSHR0cEV2ZW50VHlwZS5VcGxvYWRQcm9ncmVzczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudFsnbG9hZGVkJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9ncmVzcyA9IE1hdGgucm91bmQoKGV2ZW50Wydsb2FkZWQnXSAqIDEwMCkgLyBldmVudFsndG90YWwnXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vblByb2dyZXNzLmVtaXQoe29yaWdpbmFsRXZlbnQ6IGV2ZW50LCBwcm9ncmVzczogdGhpcy5wcm9ncmVzc30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBsb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25FcnJvci5lbWl0KHtmaWxlczogdGhpcy5maWxlcywgZXJyb3I6IGVycm9yfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5maWxlcyA9IFtdO1xuICAgICAgICB0aGlzLm9uQ2xlYXIuZW1pdCgpO1xuICAgICAgICB0aGlzLmNsZWFySW5wdXRFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgcmVtb3ZlKGV2ZW50OiBFdmVudCwgaW5kZXg6IG51bWJlcikge1xuICAgICAgICB0aGlzLmNsZWFySW5wdXRFbGVtZW50KCk7XG4gICAgICAgIHRoaXMub25SZW1vdmUuZW1pdCh7b3JpZ2luYWxFdmVudDogZXZlbnQsIGZpbGU6IHRoaXMuZmlsZXNbaW5kZXhdfSk7XG4gICAgICAgIHRoaXMuZmlsZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICBpc0ZpbGVMaW1pdEV4Y2VlZGVkKCkge1xuICAgICAgICBpZiAodGhpcy5maWxlTGltaXQgJiYgdGhpcy5maWxlTGltaXQgPD0gdGhpcy5maWxlcy5sZW5ndGggKyB0aGlzLnVwbG9hZGVkRmlsZUNvdW50ICYmIHRoaXMuZm9jdXMpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXMgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVMaW1pdCAmJiB0aGlzLmZpbGVMaW1pdCA8IHRoaXMuZmlsZXMubGVuZ3RoICsgdGhpcy51cGxvYWRlZEZpbGVDb3VudDtcbiAgICB9XG5cbiAgICBpc0Nob29zZURpc2FibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlTGltaXQgJiYgdGhpcy5maWxlTGltaXQgPD0gdGhpcy5maWxlcy5sZW5ndGggKyB0aGlzLnVwbG9hZGVkRmlsZUNvdW50O1xuICAgIH1cblxuICAgIGNoZWNrRmlsZUxpbWl0KCkge1xuICAgICAgICBpZiAodGhpcy5pc0ZpbGVMaW1pdEV4Y2VlZGVkKCkpIHtcbiAgICAgICAgICAgIHRoaXMubXNncy5wdXNoKHtcbiAgICAgICAgICAgICAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICAgICAgICAgICAgICBzdW1tYXJ5OiB0aGlzLmludmFsaWRGaWxlTGltaXRNZXNzYWdlU3VtbWFyeS5yZXBsYWNlKCd7MH0nLCB0aGlzLmZpbGVMaW1pdC50b1N0cmluZygpKSxcbiAgICAgICAgICAgICAgICBkZXRhaWw6IHRoaXMuaW52YWxpZEZpbGVMaW1pdE1lc3NhZ2VEZXRhaWwucmVwbGFjZSgnezB9JywgdGhpcy5maWxlTGltaXQudG9TdHJpbmcoKSlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJJbnB1dEVsZW1lbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLmFkdmFuY2VkRmlsZUlucHV0ICYmIHRoaXMuYWR2YW5jZWRGaWxlSW5wdXQubmF0aXZlRWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5hZHZhbmNlZEZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5iYXNpY0ZpbGVJbnB1dCAmJiB0aGlzLmJhc2ljRmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzaWNGaWxlSW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2xlYXJJRUlucHV0KCkge1xuICAgICAgICBpZiAodGhpcy5hZHZhbmNlZEZpbGVJbnB1dCAmJiB0aGlzLmFkdmFuY2VkRmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZHVwbGljYXRlSUVFdmVudCA9IHRydWU7IC8vSUUxMSBmaXggdG8gcHJldmVudCBvbkZpbGVDaGFuZ2UgdHJpZ2dlciBhZ2FpblxuICAgICAgICAgICAgdGhpcy5hZHZhbmNlZEZpbGVJbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYXNGaWxlcygpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZXMgJiYgdGhpcy5maWxlcy5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIG9uRHJhZ0VudGVyKGUpIHtcbiAgICAgICAgaWYoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyYWdPdmVyKGUpIHtcbiAgICAgICAgaWYoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQsICd1aS1maWxldXBsb2FkLWhpZ2hsaWdodCcpO1xuICAgICAgICAgICAgdGhpcy5kcmFnSGlnaGxpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyYWdMZWF2ZShldmVudCkge1xuICAgICAgICBpZighdGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudCwgJ3VpLWZpbGV1cGxvYWQtaGlnaGxpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkRyb3AoZXZlbnQpIHtcbiAgICAgICAgaWYoIXRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5jb250ZW50Lm5hdGl2ZUVsZW1lbnQsICd1aS1maWxldXBsb2FkLWhpZ2hsaWdodCcpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBsZXQgZmlsZXMgPSBldmVudC5kYXRhVHJhbnNmZXIgPyBldmVudC5kYXRhVHJhbnNmZXIuZmlsZXMgOiBldmVudC50YXJnZXQuZmlsZXM7XG4gICAgICAgICAgICBsZXQgYWxsb3dEcm9wID0gdGhpcy5tdWx0aXBsZXx8KGZpbGVzICYmIGZpbGVzLmxlbmd0aCA9PT0gMSk7XG5cbiAgICAgICAgICAgIGlmKGFsbG93RHJvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMub25GaWxlU2VsZWN0KGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uRm9jdXMoKSB7XG4gICAgICAgIHRoaXMuZm9jdXMgPSB0cnVlO1xuICAgIH1cblxuICAgIG9uQmx1cigpIHtcbiAgICAgICAgdGhpcy5mb2N1cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIGZvcm1hdFNpemUoYnl0ZXMpIHtcbiAgICAgICAgaWYoYnl0ZXMgPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICcwIEInO1xuICAgICAgICB9XG4gICAgICAgIGxldCBrID0gMTAwMCxcbiAgICAgICAgZG0gPSAzLFxuICAgICAgICBzaXplcyA9IFsnQicsICdLQicsICdNQicsICdHQicsICdUQicsICdQQicsICdFQicsICdaQicsICdZQiddLFxuICAgICAgICBpID0gTWF0aC5mbG9vcihNYXRoLmxvZyhieXRlcykgLyBNYXRoLmxvZyhrKSk7XG5cbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoKGJ5dGVzIC8gTWF0aC5wb3coaywgaSkpLnRvRml4ZWQoZG0pKSArICcgJyArIHNpemVzW2ldO1xuICAgIH1cblxuICAgIG9uU2ltcGxlVXBsb2FkZXJDbGljayhldmVudDogRXZlbnQpIHtcbiAgICAgICAgaWYodGhpcy5oYXNGaWxlcygpKSB7XG4gICAgICAgICAgICB0aGlzLnVwbG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0QmxvY2thYmxlRWxlbWVudCgpOiBIVE1MRWxlbWVudMKge1xuICAgICAgcmV0dXJuIHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYodGhpcy5jb250ZW50ICYmIHRoaXMuY29udGVudC5uYXRpdmVFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRlbnQubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHRoaXMub25EcmFnT3Zlcik7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSxTaGFyZWRNb2R1bGUsQnV0dG9uTW9kdWxlLFByb2dyZXNzQmFyTW9kdWxlLE1lc3NhZ2VzTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbRmlsZVVwbG9hZCxTaGFyZWRNb2R1bGUsQnV0dG9uTW9kdWxlLFByb2dyZXNzQmFyTW9kdWxlLE1lc3NhZ2VzTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtGaWxlVXBsb2FkXVxufSlcbmV4cG9ydCBjbGFzcyBGaWxlVXBsb2FkTW9kdWxlIHsgfVxuIl19