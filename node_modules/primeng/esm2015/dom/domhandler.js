/**
 * @dynamic is for runtime initializing DomHandler.browser
 *
 * If delete below comment, we can see this error message:
 *  Metadata collected contains an error that will be reported at runtime:
 *  Only initialized variables and constants can be referenced
 *  because the value of this variable is needed by the template compiler.
 */
// @dynamic
export class DomHandler {
    static addClass(element, className) {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }
    static addMultipleClasses(element, className) {
        if (element.classList) {
            let styles = className.split(' ');
            for (let i = 0; i < styles.length; i++) {
                element.classList.add(styles[i]);
            }
        }
        else {
            let styles = className.split(' ');
            for (let i = 0; i < styles.length; i++) {
                element.className += ' ' + styles[i];
            }
        }
    }
    static removeClass(element, className) {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
    static hasClass(element, className) {
        if (element.classList)
            return element.classList.contains(className);
        else
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
    }
    static siblings(element) {
        return Array.prototype.filter.call(element.parentNode.children, function (child) {
            return child !== element;
        });
    }
    static find(element, selector) {
        return Array.from(element.querySelectorAll(selector));
    }
    static findSingle(element, selector) {
        if (element) {
            return element.querySelector(selector);
        }
        return null;
    }
    static index(element) {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static indexWithinGroup(element, attributeName) {
        let children = element.parentNode.childNodes;
        let num = 0;
        for (var i = 0; i < children.length; i++) {
            if (children[i] == element)
                return num;
            if (children[i].attributes && children[i].attributes[attributeName] && children[i].nodeType == 1)
                num++;
        }
        return -1;
    }
    static relativePosition(element, target) {
        let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        const targetHeight = target.offsetHeight;
        const targetOffset = target.getBoundingClientRect();
        const viewport = this.getViewport();
        let top, left;
        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = -1 * targetOffset.top;
            }
        }
        else {
            top = targetHeight;
        }
        if (elementDimensions.width > viewport.width) {
            // element wider then viewport and cannot fit on screen (align at left side of viewport)
            left = targetOffset.left * -1;
        }
        else if ((targetOffset.left + elementDimensions.width) > viewport.width) {
            // element wider then viewport but can be fit on screen (align at right side of viewport)
            left = (targetOffset.left + elementDimensions.width - viewport.width) * -1;
        }
        else {
            // element fits on screen (align with target)
            left = 0;
        }
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    static absolutePosition(element, target) {
        let elementDimensions = element.offsetParent ? { width: element.offsetWidth, height: element.offsetHeight } : this.getHiddenElementDimensions(element);
        let elementOuterHeight = elementDimensions.height;
        let elementOuterWidth = elementDimensions.width;
        let targetOuterHeight = target.offsetHeight;
        let targetOuterWidth = target.offsetWidth;
        let targetOffset = target.getBoundingClientRect();
        let windowScrollTop = this.getWindowScrollTop();
        let windowScrollLeft = this.getWindowScrollLeft();
        let viewport = this.getViewport();
        let top, left;
        if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
            top = targetOffset.top + windowScrollTop - elementOuterHeight;
            if (top < 0) {
                top = windowScrollTop;
            }
        }
        else {
            top = targetOuterHeight + targetOffset.top + windowScrollTop;
        }
        if (targetOffset.left + elementOuterWidth > viewport.width)
            left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
        else
            left = targetOffset.left + windowScrollLeft;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    }
    static getHiddenElementOuterHeight(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementHeight = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementHeight;
    }
    static getHiddenElementOuterWidth(element) {
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        let elementWidth = element.offsetWidth;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return elementWidth;
    }
    static getHiddenElementDimensions(element) {
        let dimensions = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    }
    static scrollInView(container, item) {
        let borderTopValue = getComputedStyle(container).getPropertyValue('borderTopWidth');
        let borderTop = borderTopValue ? parseFloat(borderTopValue) : 0;
        let paddingTopValue = getComputedStyle(container).getPropertyValue('paddingTop');
        let paddingTop = paddingTopValue ? parseFloat(paddingTopValue) : 0;
        let containerRect = container.getBoundingClientRect();
        let itemRect = item.getBoundingClientRect();
        let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
        let scroll = container.scrollTop;
        let elementHeight = container.clientHeight;
        let itemHeight = this.getOuterHeight(item);
        if (offset < 0) {
            container.scrollTop = scroll + offset;
        }
        else if ((offset + itemHeight) > elementHeight) {
            container.scrollTop = scroll + offset - elementHeight + itemHeight;
        }
    }
    static fadeIn(element, duration) {
        element.style.opacity = 0;
        let last = +new Date();
        let opacity = 0;
        let tick = function () {
            opacity = +element.style.opacity.replace(",", ".") + (new Date().getTime() - last) / duration;
            element.style.opacity = opacity;
            last = +new Date();
            if (+opacity < 1) {
                (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
            }
        };
        tick();
    }
    static fadeOut(element, ms) {
        var opacity = 1, interval = 50, duration = ms, gap = interval / duration;
        let fading = setInterval(() => {
            opacity = opacity - gap;
            if (opacity <= 0) {
                opacity = 0;
                clearInterval(fading);
            }
            element.style.opacity = opacity;
        }, interval);
    }
    static getWindowScrollTop() {
        let doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }
    static getWindowScrollLeft() {
        let doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }
    static matches(element, selector) {
        var p = Element.prototype;
        var f = p['matches'] || p.webkitMatchesSelector || p['mozMatchesSelector'] || p['msMatchesSelector'] || function (s) {
            return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
        };
        return f.call(element, selector);
    }
    static getOuterWidth(el, margin) {
        let width = el.offsetWidth;
        if (margin) {
            let style = getComputedStyle(el);
            width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }
        return width;
    }
    static getHorizontalPadding(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }
    static getHorizontalMargin(el) {
        let style = getComputedStyle(el);
        return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    }
    static innerWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static width(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        return width;
    }
    static getInnerHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
        return height;
    }
    static getOuterHeight(el, margin) {
        let height = el.offsetHeight;
        if (margin) {
            let style = getComputedStyle(el);
            height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        }
        return height;
    }
    static getHeight(el) {
        let height = el.offsetHeight;
        let style = getComputedStyle(el);
        height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        return height;
    }
    static getWidth(el) {
        let width = el.offsetWidth;
        let style = getComputedStyle(el);
        width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
        return width;
    }
    static getViewport() {
        let win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    }
    static getOffset(el) {
        let rect = el.getBoundingClientRect();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        };
    }
    static replaceElementWith(element, replacementElement) {
        let parentNode = element.parentNode;
        if (!parentNode)
            throw `Can't replace element`;
        return parentNode.replaceChild(replacementElement, element);
    }
    static getUserAgent() {
        return navigator.userAgent;
    }
    static isIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return version number
            return true;
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return version number
            var rv = ua.indexOf('rv:');
            return true;
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return version number
            return true;
        }
        // other browser
        return false;
    }
    static isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
    }
    static isAndroid() {
        return /(android)/i.test(navigator.userAgent);
    }
    static appendChild(element, target) {
        if (this.isElement(target))
            target.appendChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.appendChild(element);
        else
            throw 'Cannot append ' + target + ' to ' + element;
    }
    static removeChild(element, target) {
        if (this.isElement(target))
            target.removeChild(element);
        else if (target.el && target.el.nativeElement)
            target.el.nativeElement.removeChild(element);
        else
            throw 'Cannot remove ' + element + ' from ' + target;
    }
    static isElement(obj) {
        return (typeof HTMLElement === "object" ? obj instanceof HTMLElement :
            obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === "string");
    }
    static calculateScrollbarWidth(el) {
        if (el) {
            let style = getComputedStyle(el);
            return (el.offsetWidth - el.clientWidth - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth));
        }
        else {
            if (this.calculatedScrollbarWidth !== null)
                return this.calculatedScrollbarWidth;
            let scrollDiv = document.createElement("div");
            scrollDiv.className = "ui-scrollbar-measure";
            document.body.appendChild(scrollDiv);
            let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            this.calculatedScrollbarWidth = scrollbarWidth;
            return scrollbarWidth;
        }
    }
    static calculateScrollbarHeight() {
        if (this.calculatedScrollbarHeight !== null)
            return this.calculatedScrollbarHeight;
        let scrollDiv = document.createElement("div");
        scrollDiv.className = "ui-scrollbar-measure";
        document.body.appendChild(scrollDiv);
        let scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
        document.body.removeChild(scrollDiv);
        this.calculatedScrollbarWidth = scrollbarHeight;
        return scrollbarHeight;
    }
    static invokeElementMethod(element, methodName, args) {
        element[methodName].apply(element, args);
    }
    static clearSelection() {
        if (window.getSelection) {
            if (window.getSelection().empty) {
                window.getSelection().empty();
            }
            else if (window.getSelection().removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
                window.getSelection().removeAllRanges();
            }
        }
        else if (document['selection'] && document['selection'].empty) {
            try {
                document['selection'].empty();
            }
            catch (error) {
                //ignore IE bug
            }
        }
    }
    static getBrowser() {
        if (!this.browser) {
            let matched = this.resolveUserAgent();
            this.browser = {};
            if (matched.browser) {
                this.browser[matched.browser] = true;
                this.browser['version'] = matched.version;
            }
            if (this.browser['chrome']) {
                this.browser['webkit'] = true;
            }
            else if (this.browser['webkit']) {
                this.browser['safari'] = true;
            }
        }
        return this.browser;
    }
    static resolveUserAgent() {
        let ua = navigator.userAgent.toLowerCase();
        let match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];
        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    }
    static isInteger(value) {
        if (Number.isInteger) {
            return Number.isInteger(value);
        }
        else {
            return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
        }
    }
    static isHidden(element) {
        return element.offsetParent === null;
    }
    static getFocusableElements(element) {
        let focusableElements = DomHandler.find(element, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), 
                [href][clientHeight][clientWidth]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), 
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), 
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), 
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])`);
        let visibleFocusableElements = [];
        for (let focusableElement of focusableElements) {
            if (getComputedStyle(focusableElement).display != "none" && getComputedStyle(focusableElement).visibility != "hidden")
                visibleFocusableElements.push(focusableElement);
        }
        return visibleFocusableElements;
    }
}
DomHandler.zindex = 1000;
DomHandler.calculatedScrollbarWidth = null;
DomHandler.calculatedScrollbarHeight = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9taGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3ByaW1lbmcvZG9tLyIsInNvdXJjZXMiOlsiZG9taGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztHQU9HO0FBQ0gsV0FBVztBQUNYLE1BQU0sT0FBTyxVQUFVO0lBVVosTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7UUFDbEQsSUFBSSxPQUFPLENBQUMsU0FBUztZQUNqQixPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7WUFFakMsT0FBTyxDQUFDLFNBQVMsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFFTSxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBWSxFQUFFLFNBQWlCO1FBQzVELElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLE1BQU0sR0FBYSxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNwQztTQUVKO2FBQ0k7WUFDRCxJQUFJLE1BQU0sR0FBYSxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNwQyxPQUFPLENBQUMsU0FBUyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDeEM7U0FDSjtJQUNMLENBQUM7SUFFTSxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQVksRUFBRSxTQUFpQjtRQUNy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QUFDLENBQUMsQ0FBQyxJQUFJLEdBQUc7U0FDM0IsQ0FBQztJQUNOLENBQUM7SUFFTSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUs7UUFDekIsSUFBRyxNQUFNLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNsQzthQUNJO1lBQ0QsT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxDQUFDO1NBQ3ZGO0lBQ0wsQ0FBQztJQUVNLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBb0I7UUFDdkMsT0FBTyxPQUFPLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQztJQUN6QyxDQUFDO0lBRU0sTUFBTSxDQUFDLG9CQUFvQixDQUFDLE9BQW1CO1FBQ2xELElBQUksaUJBQWlCLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUM7Ozs7b0hBSTRELENBQ3ZHLENBQUM7UUFFRixJQUFJLHdCQUF3QixHQUFHLEVBQUUsQ0FBQztRQUNsQyxLQUFJLElBQUksZ0JBQWdCLElBQUksaUJBQWlCLEVBQUU7WUFDM0MsSUFBRyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sSUFBSSxNQUFNLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxVQUFVLElBQUksUUFBUTtnQkFDaEgsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDdkQ7UUFDTCxPQUFPLHdCQUF3QixDQUFDO0lBQ3BDLENBQUM7O0FBemhCYSxpQkFBTSxHQUFXLElBQUksQ0FBQztBQUVyQixtQ0FBd0IsR0FBVyxJQUFJLENBQUM7QUFFeEMsb0NBQXlCLEdBQVcsSUFBSSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZHluYW1pYyBpcyBmb3IgcnVudGltZSBpbml0aWFsaXppbmcgRG9tSGFuZGxlci5icm93c2VyXG4gKlxuICogSWYgZGVsZXRlIGJlbG93IGNvbW1lbnQsIHdlIGNhbiBzZWUgdGhpcyBlcnJvciBtZXNzYWdlOlxuICogIE1ldGFkYXRhIGNvbGxlY3RlZCBjb250YWlucyBhbiBlcnJvciB0aGF0IHdpbGwgYmUgcmVwb3J0ZWQgYXQgcnVudGltZTpcbiAqICBPbmx5IGluaXRpYWxpemVkIHZhcmlhYmxlcyBhbmQgY29uc3RhbnRzIGNhbiBiZSByZWZlcmVuY2VkXG4gKiAgYmVjYXVzZSB0aGUgdmFsdWUgb2YgdGhpcyB2YXJpYWJsZSBpcyBuZWVkZWQgYnkgdGhlIHRlbXBsYXRlIGNvbXBpbGVyLlxuICovXG4vLyBAZHluYW1pY1xuZXhwb3J0IGNsYXNzIERvbUhhbmRsZXIge1xuXG4gICAgcHVibGljIHN0YXRpYyB6aW5kZXg6IG51bWJlciA9IDEwMDA7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgICBwcml2YXRlIHN0YXRpYyBjYWxjdWxhdGVkU2Nyb2xsYmFySGVpZ2h0OiBudW1iZXIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBzdGF0aWMgYnJvd3NlcjogYW55O1xuXG4gICAgcHVibGljIHN0YXRpYyBhZGRDbGFzcyhlbGVtZW50OiBhbnksIGNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmIChlbGVtZW50LmNsYXNzTGlzdClcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBhZGRNdWx0aXBsZUNsYXNzZXMoZWxlbWVudDogYW55LCBjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICAgIGxldCBzdHlsZXM6IHN0cmluZ1tdID0gY2xhc3NOYW1lLnNwbGl0KCcgJyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChzdHlsZXNbaV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgc3R5bGVzOiBzdHJpbmdbXSA9IGNsYXNzTmFtZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBzdHlsZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUNsYXNzKGVsZW1lbnQ6IGFueSwgY2xhc3NOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KVxuICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXnxcXFxcYiknICsgY2xhc3NOYW1lLnNwbGl0KCcgJykuam9pbignfCcpICsgJyhcXFxcYnwkKScsICdnaScpLCAnICcpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaGFzQ2xhc3MoZWxlbWVudDogYW55LCBjbGFzc05hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpXG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoJyhefCApJyArIGNsYXNzTmFtZSArICcoIHwkKScsICdnaScpLnRlc3QoZWxlbWVudC5jbGFzc05hbWUpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgc2libGluZ3MoZWxlbWVudDogYW55KTogYW55IHtcbiAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5maWx0ZXIuY2FsbChlbGVtZW50LnBhcmVudE5vZGUuY2hpbGRyZW4sIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkICE9PSBlbGVtZW50O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZpbmQoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYW55W10ge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGZpbmRTaW5nbGUoZWxlbWVudDogYW55LCBzZWxlY3Rvcjogc3RyaW5nKTogYW55IHtcbiAgICAgICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaW5kZXgoZWxlbWVudDogYW55KTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGNoaWxkcmVuID0gZWxlbWVudC5wYXJlbnROb2RlLmNoaWxkTm9kZXM7XG4gICAgICAgIGxldCBudW0gPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0gPT0gZWxlbWVudCkgcmV0dXJuIG51bTtcbiAgICAgICAgICAgIGlmIChjaGlsZHJlbltpXS5ub2RlVHlwZSA9PSAxKSBudW0rKztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzdGF0aWMgaW5kZXhXaXRoaW5Hcm91cChlbGVtZW50OiBhbnksIGF0dHJpYnV0ZU5hbWU6IHN0cmluZyk6IG51bWJlciB7XG4gICAgICAgIGxldCBjaGlsZHJlbiA9IGVsZW1lbnQucGFyZW50Tm9kZS5jaGlsZE5vZGVzO1xuICAgICAgICBsZXQgbnVtID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGNoaWxkcmVuW2ldID09IGVsZW1lbnQpIHJldHVybiBudW07XG4gICAgICAgICAgICBpZiAoY2hpbGRyZW5baV0uYXR0cmlidXRlcyAmJiBjaGlsZHJlbltpXS5hdHRyaWJ1dGVzW2F0dHJpYnV0ZU5hbWVdICYmIGNoaWxkcmVuW2ldLm5vZGVUeXBlID09IDEpIG51bSsrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHJlbGF0aXZlUG9zaXRpb24oZWxlbWVudDogYW55LCB0YXJnZXQ6IGFueSk6IHZvaWQge1xuICAgICAgICBsZXQgZWxlbWVudERpbWVuc2lvbnMgPSBlbGVtZW50Lm9mZnNldFBhcmVudCA/IHsgd2lkdGg6IGVsZW1lbnQub2Zmc2V0V2lkdGgsIGhlaWdodDogZWxlbWVudC5vZmZzZXRIZWlnaHQgfSA6IHRoaXMuZ2V0SGlkZGVuRWxlbWVudERpbWVuc2lvbnMoZWxlbWVudCk7XG4gICAgICAgIGNvbnN0IHRhcmdldEhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGNvbnN0IHRhcmdldE9mZnNldCA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLmdldFZpZXdwb3J0KCk7XG4gICAgICAgIGxldCB0b3A6IG51bWJlciwgbGVmdDogbnVtYmVyO1xuXG4gICAgICAgIGlmICgodGFyZ2V0T2Zmc2V0LnRvcCArIHRhcmdldEhlaWdodCArIGVsZW1lbnREaW1lbnNpb25zLmhlaWdodCkgPiB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvcCA9IC0xICogKGVsZW1lbnREaW1lbnNpb25zLmhlaWdodCk7XG4gICAgICAgICAgICBpZiAodGFyZ2V0T2Zmc2V0LnRvcCArIHRvcCA8IDApIHtcbiAgICAgICAgICAgICAgICB0b3AgPSAtMSAqIHRhcmdldE9mZnNldC50b3A7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0b3AgPSB0YXJnZXRIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbWVudERpbWVuc2lvbnMud2lkdGggPiB2aWV3cG9ydC53aWR0aCkge1xuICAgICAgICAgICAgLy8gZWxlbWVudCB3aWRlciB0aGVuIHZpZXdwb3J0IGFuZCBjYW5ub3QgZml0IG9uIHNjcmVlbiAoYWxpZ24gYXQgbGVmdCBzaWRlIG9mIHZpZXdwb3J0KVxuICAgICAgICAgICAgbGVmdCA9IHRhcmdldE9mZnNldC5sZWZ0ICogLTE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKHRhcmdldE9mZnNldC5sZWZ0ICsgZWxlbWVudERpbWVuc2lvbnMud2lkdGgpID4gdmlld3BvcnQud2lkdGgpIHtcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgd2lkZXIgdGhlbiB2aWV3cG9ydCBidXQgY2FuIGJlIGZpdCBvbiBzY3JlZW4gKGFsaWduIGF0IHJpZ2h0IHNpZGUgb2Ygdmlld3BvcnQpXG4gICAgICAgICAgICBsZWZ0ID0gKHRhcmdldE9mZnNldC5sZWZ0ICsgZWxlbWVudERpbWVuc2lvbnMud2lkdGggLSB2aWV3cG9ydC53aWR0aCkgKiAtMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVsZW1lbnQgZml0cyBvbiBzY3JlZW4gKGFsaWduIHdpdGggdGFyZ2V0KVxuICAgICAgICAgICAgbGVmdCA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgYWJzb2x1dGVQb3NpdGlvbihlbGVtZW50OiBhbnksIHRhcmdldDogYW55KTogdm9pZCB7XG4gICAgICAgIGxldCBlbGVtZW50RGltZW5zaW9ucyA9IGVsZW1lbnQub2Zmc2V0UGFyZW50ID8geyB3aWR0aDogZWxlbWVudC5vZmZzZXRXaWR0aCwgaGVpZ2h0OiBlbGVtZW50Lm9mZnNldEhlaWdodCB9IDogdGhpcy5nZXRIaWRkZW5FbGVtZW50RGltZW5zaW9ucyhlbGVtZW50KTtcbiAgICAgICAgbGV0IGVsZW1lbnRPdXRlckhlaWdodCA9IGVsZW1lbnREaW1lbnNpb25zLmhlaWdodDtcbiAgICAgICAgbGV0IGVsZW1lbnRPdXRlcldpZHRoID0gZWxlbWVudERpbWVuc2lvbnMud2lkdGg7XG4gICAgICAgIGxldCB0YXJnZXRPdXRlckhlaWdodCA9IHRhcmdldC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGxldCB0YXJnZXRPdXRlcldpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgdGFyZ2V0T2Zmc2V0ID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgd2luZG93U2Nyb2xsVG9wID0gdGhpcy5nZXRXaW5kb3dTY3JvbGxUb3AoKTtcbiAgICAgICAgbGV0IHdpbmRvd1Njcm9sbExlZnQgPSB0aGlzLmdldFdpbmRvd1Njcm9sbExlZnQoKTtcbiAgICAgICAgbGV0IHZpZXdwb3J0ID0gdGhpcy5nZXRWaWV3cG9ydCgpO1xuICAgICAgICBsZXQgdG9wLCBsZWZ0O1xuXG4gICAgICAgIGlmICh0YXJnZXRPZmZzZXQudG9wICsgdGFyZ2V0T3V0ZXJIZWlnaHQgKyBlbGVtZW50T3V0ZXJIZWlnaHQgPiB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvcCA9IHRhcmdldE9mZnNldC50b3AgKyB3aW5kb3dTY3JvbGxUb3AgLSBlbGVtZW50T3V0ZXJIZWlnaHQ7XG4gICAgICAgICAgICBpZih0b3AgPCAwKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gd2luZG93U2Nyb2xsVG9wO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRvcCA9IHRhcmdldE91dGVySGVpZ2h0ICsgdGFyZ2V0T2Zmc2V0LnRvcCArIHdpbmRvd1Njcm9sbFRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0YXJnZXRPZmZzZXQubGVmdCArIGVsZW1lbnRPdXRlcldpZHRoID4gdmlld3BvcnQud2lkdGgpXG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5tYXgoMCwgdGFyZ2V0T2Zmc2V0LmxlZnQgKyB3aW5kb3dTY3JvbGxMZWZ0ICsgdGFyZ2V0T3V0ZXJXaWR0aCAtIGVsZW1lbnRPdXRlcldpZHRoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgbGVmdCA9IHRhcmdldE9mZnNldC5sZWZ0ICsgd2luZG93U2Nyb2xsTGVmdDtcblxuICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHRvcCArICdweCc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KGVsZW1lbnQ6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBsZXQgZWxlbWVudEhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICByZXR1cm4gZWxlbWVudEhlaWdodDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhpZGRlbkVsZW1lbnRPdXRlcldpZHRoKGVsZW1lbnQ6IGFueSk6IG51bWJlciB7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICBsZXQgZWxlbWVudFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG5cbiAgICAgICAgcmV0dXJuIGVsZW1lbnRXaWR0aDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEhpZGRlbkVsZW1lbnREaW1lbnNpb25zKGVsZW1lbnQ6IGFueSk6IGFueSB7XG4gICAgICAgIGxldCBkaW1lbnNpb25zOiBhbnkgPSB7fTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGRpbWVuc2lvbnMud2lkdGggPSBlbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBkaW1lbnNpb25zLmhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICByZXR1cm4gZGltZW5zaW9ucztcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIHNjcm9sbEluVmlldyhjb250YWluZXIsIGl0ZW0pIHtcbiAgICAgICAgbGV0IGJvcmRlclRvcFZhbHVlOiBzdHJpbmcgPSBnZXRDb21wdXRlZFN0eWxlKGNvbnRhaW5lcikuZ2V0UHJvcGVydHlWYWx1ZSgnYm9yZGVyVG9wV2lkdGgnKTtcbiAgICAgICAgbGV0IGJvcmRlclRvcDogbnVtYmVyID0gYm9yZGVyVG9wVmFsdWUgPyBwYXJzZUZsb2F0KGJvcmRlclRvcFZhbHVlKSA6IDA7XG4gICAgICAgIGxldCBwYWRkaW5nVG9wVmFsdWU6IHN0cmluZyA9IGdldENvbXB1dGVkU3R5bGUoY29udGFpbmVyKS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nVG9wJyk7XG4gICAgICAgIGxldCBwYWRkaW5nVG9wOiBudW1iZXIgPSBwYWRkaW5nVG9wVmFsdWUgPyBwYXJzZUZsb2F0KHBhZGRpbmdUb3BWYWx1ZSkgOiAwO1xuICAgICAgICBsZXQgY29udGFpbmVyUmVjdCA9IGNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IGl0ZW1SZWN0ID0gaXRlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgbGV0IG9mZnNldCA9IChpdGVtUmVjdC50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSAoY29udGFpbmVyUmVjdC50b3AgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCkgLSBib3JkZXJUb3AgLSBwYWRkaW5nVG9wO1xuICAgICAgICBsZXQgc2Nyb2xsID0gY29udGFpbmVyLnNjcm9sbFRvcDtcbiAgICAgICAgbGV0IGVsZW1lbnRIZWlnaHQgPSBjb250YWluZXIuY2xpZW50SGVpZ2h0O1xuICAgICAgICBsZXQgaXRlbUhlaWdodCA9IHRoaXMuZ2V0T3V0ZXJIZWlnaHQoaXRlbSk7XG5cbiAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lci5zY3JvbGxUb3AgPSBzY3JvbGwgKyBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoKG9mZnNldCArIGl0ZW1IZWlnaHQpID4gZWxlbWVudEhlaWdodCkge1xuICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvcCA9IHNjcm9sbCArIG9mZnNldCAtIGVsZW1lbnRIZWlnaHQgKyBpdGVtSGVpZ2h0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBmYWRlSW4oZWxlbWVudCwgZHVyYXRpb246IG51bWJlcik6IHZvaWQge1xuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuXG4gICAgICAgIGxldCBsYXN0ID0gK25ldyBEYXRlKCk7XG4gICAgICAgIGxldCBvcGFjaXR5ID0gMDtcbiAgICAgICAgbGV0IHRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBvcGFjaXR5ID0gK2VsZW1lbnQuc3R5bGUub3BhY2l0eS5yZXBsYWNlKFwiLFwiLCBcIi5cIikgKyAobmV3IERhdGUoKS5nZXRUaW1lKCkgLSBsYXN0KSAvIGR1cmF0aW9uO1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgICAgIGxhc3QgPSArbmV3IERhdGUoKTtcblxuICAgICAgICAgICAgaWYgKCtvcGFjaXR5IDwgMSkge1xuICAgICAgICAgICAgICAgICh3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lICYmIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aWNrKSkgfHwgc2V0VGltZW91dCh0aWNrLCAxNik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGljaygpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZmFkZU91dChlbGVtZW50LCBtcykge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IDEsXG4gICAgICAgICAgICBpbnRlcnZhbCA9IDUwLFxuICAgICAgICAgICAgZHVyYXRpb24gPSBtcyxcbiAgICAgICAgICAgIGdhcCA9IGludGVydmFsIC8gZHVyYXRpb247XG5cbiAgICAgICAgbGV0IGZhZGluZyA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICAgIG9wYWNpdHkgPSBvcGFjaXR5IC0gZ2FwO1xuXG4gICAgICAgICAgICBpZiAob3BhY2l0eSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChmYWRpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5O1xuICAgICAgICB9LCBpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRXaW5kb3dTY3JvbGxUb3AoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jLnNjcm9sbFRvcCkgLSAoZG9jLmNsaWVudFRvcCB8fCAwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldFdpbmRvd1Njcm9sbExlZnQoKTogbnVtYmVyIHtcbiAgICAgICAgbGV0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgcmV0dXJuICh3aW5kb3cucGFnZVhPZmZzZXQgfHwgZG9jLnNjcm9sbExlZnQpIC0gKGRvYy5jbGllbnRMZWZ0IHx8IDApO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgbWF0Y2hlcyhlbGVtZW50LCBzZWxlY3Rvcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgIHZhciBwID0gRWxlbWVudC5wcm90b3R5cGU7XG4gICAgICAgIHZhciBmID0gcFsnbWF0Y2hlcyddIHx8IHAud2Via2l0TWF0Y2hlc1NlbGVjdG9yIHx8IHBbJ21vek1hdGNoZXNTZWxlY3RvciddIHx8IHBbJ21zTWF0Y2hlc1NlbGVjdG9yJ10gfHwgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgICAgIHJldHVybiBbXS5pbmRleE9mLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzKSwgdGhpcykgIT09IC0xO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gZi5jYWxsKGVsZW1lbnQsIHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldE91dGVyV2lkdGgoZWwsIG1hcmdpbj8pIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZWwub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgaWYgKG1hcmdpbikge1xuICAgICAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICAgICAgICB3aWR0aCArPSBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpbkxlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5tYXJnaW5SaWdodCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIb3Jpem9udGFsUGFkZGluZyhlbCkge1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SG9yaXpvbnRhbE1hcmdpbihlbCkge1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLm1hcmdpblJpZ2h0KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlubmVyV2lkdGgoZWwpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gZWwub2Zmc2V0V2lkdGg7XG4gICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuXG4gICAgICAgIHdpZHRoICs9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0xlZnQpICsgcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nUmlnaHQpO1xuICAgICAgICByZXR1cm4gd2lkdGg7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyB3aWR0aChlbCkge1xuICAgICAgICBsZXQgd2lkdGggPSBlbC5vZmZzZXRXaWR0aDtcbiAgICAgICAgbGV0IHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG5cbiAgICAgICAgd2lkdGggLT0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nTGVmdCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdSaWdodCk7XG4gICAgICAgIHJldHVybiB3aWR0aDtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBnZXRJbm5lckhlaWdodChlbCkge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICBoZWlnaHQgKz0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSk7XG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRPdXRlckhlaWdodChlbCwgbWFyZ2luPykge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIGlmIChtYXJnaW4pIHtcbiAgICAgICAgICAgIGxldCBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgICAgICAgaGVpZ2h0ICs9IHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUubWFyZ2luQm90dG9tKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRIZWlnaHQoZWwpOiBudW1iZXIge1xuICAgICAgICBsZXQgaGVpZ2h0ID0gZWwub2Zmc2V0SGVpZ2h0O1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICBoZWlnaHQgLT0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSkgKyBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xuXG4gICAgICAgIHJldHVybiBoZWlnaHQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRXaWR0aChlbCk6IG51bWJlciB7XG4gICAgICAgIGxldCB3aWR0aCA9IGVsLm9mZnNldFdpZHRoO1xuICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcblxuICAgICAgICB3aWR0aCAtPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCk7XG5cbiAgICAgICAgcmV0dXJuIHdpZHRoO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0Vmlld3BvcnQoKTogYW55IHtcbiAgICAgICAgbGV0IHdpbiA9IHdpbmRvdyxcbiAgICAgICAgICAgIGQgPSBkb2N1bWVudCxcbiAgICAgICAgICAgIGUgPSBkLmRvY3VtZW50RWxlbWVudCxcbiAgICAgICAgICAgIGcgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0sXG4gICAgICAgICAgICB3ID0gd2luLmlubmVyV2lkdGggfHwgZS5jbGllbnRXaWR0aCB8fCBnLmNsaWVudFdpZHRoLFxuICAgICAgICAgICAgaCA9IHdpbi5pbm5lckhlaWdodCB8fCBlLmNsaWVudEhlaWdodCB8fCBnLmNsaWVudEhlaWdodDtcblxuICAgICAgICByZXR1cm4geyB3aWR0aDogdywgaGVpZ2h0OiBoIH07XG4gICAgfVxuICAgIFxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2Zmc2V0KGVsKSB7XG4gICAgICAgIGxldCByZWN0ID0gZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wLFxuICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXBsYWNlRWxlbWVudFdpdGgoZWxlbWVudDogYW55LCByZXBsYWNlbWVudEVsZW1lbnQ6IGFueSk6IGFueSB7XG4gICAgICAgIGxldCBwYXJlbnROb2RlID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgICBpZighcGFyZW50Tm9kZSkgXG4gICAgICAgICAgICB0aHJvdyBgQ2FuJ3QgcmVwbGFjZSBlbGVtZW50YDtcbiAgICAgICAgcmV0dXJuIHBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHJlcGxhY2VtZW50RWxlbWVudCwgZWxlbWVudCk7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRVc2VyQWdlbnQoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyAgaXNJRSgpIHtcbiAgICAgICAgdmFyIHVhID0gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICAgICAgdmFyIG1zaWUgPSB1YS5pbmRleE9mKCdNU0lFICcpO1xuICAgICAgICBpZiAobXNpZSA+IDApIHtcbiAgICAgICAgICAgIC8vIElFIDEwIG9yIG9sZGVyID0+IHJldHVybiB2ZXJzaW9uIG51bWJlclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdHJpZGVudCA9IHVhLmluZGV4T2YoJ1RyaWRlbnQvJyk7XG4gICAgICAgIGlmICh0cmlkZW50ID4gMCkge1xuICAgICAgICAgICAgLy8gSUUgMTEgPT4gcmV0dXJuIHZlcnNpb24gbnVtYmVyXG4gICAgICAgICAgICB2YXIgcnYgPSB1YS5pbmRleE9mKCdydjonKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGVkZ2UgPSB1YS5pbmRleE9mKCdFZGdlLycpO1xuICAgICAgICBpZiAoZWRnZSA+IDApIHtcbiAgICAgICAgICAgLy8gRWRnZSAoSUUgMTIrKSA9PiByZXR1cm4gdmVyc2lvbiBudW1iZXJcbiAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBvdGhlciBicm93c2VyXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzSU9TKCkge1xuICAgICAgICByZXR1cm4gL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIXdpbmRvd1snTVNTdHJlYW0nXTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzQW5kcm9pZCgpIHtcbiAgICAgICAgcmV0dXJuIC8oYW5kcm9pZCkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIH1cbiAgICAgXG4gICAgcHVibGljIHN0YXRpYyBhcHBlbmRDaGlsZChlbGVtZW50OiBhbnksIHRhcmdldDogYW55KSB7XG4gICAgICAgIGlmKHRoaXMuaXNFbGVtZW50KHRhcmdldCkpXG4gICAgICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2UgaWYodGFyZ2V0LmVsICYmIHRhcmdldC5lbC5uYXRpdmVFbGVtZW50KVxuICAgICAgICAgICAgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93ICdDYW5ub3QgYXBwZW5kICcgKyB0YXJnZXQgKyAnIHRvICcgKyBlbGVtZW50O1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIHJlbW92ZUNoaWxkKGVsZW1lbnQ6IGFueSwgdGFyZ2V0OiBhbnkpIHtcbiAgICAgICAgaWYodGhpcy5pc0VsZW1lbnQodGFyZ2V0KSlcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgZWxzZSBpZih0YXJnZXQuZWwgJiYgdGFyZ2V0LmVsLm5hdGl2ZUVsZW1lbnQpXG4gICAgICAgICAgICB0YXJnZXQuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVDaGlsZChlbGVtZW50KTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCByZW1vdmUgJyArIGVsZW1lbnQgKyAnIGZyb20gJyArIHRhcmdldDtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBpc0VsZW1lbnQob2JqOiBhbnkpIHtcbiAgICAgICAgcmV0dXJuICh0eXBlb2YgSFRNTEVsZW1lbnQgPT09IFwib2JqZWN0XCIgPyBvYmogaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA6XG4gICAgICAgICAgICBvYmogJiYgdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiBvYmogIT09IG51bGwgJiYgb2JqLm5vZGVUeXBlID09PSAxICYmIHR5cGVvZiBvYmoubm9kZU5hbWUgPT09IFwic3RyaW5nXCJcbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVTY3JvbGxiYXJXaWR0aChlbD86IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgICBsZXQgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgICAgICAgIHJldHVybiAoZWwub2Zmc2V0V2lkdGggLSBlbC5jbGllbnRXaWR0aCAtIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyTGVmdFdpZHRoKSAtIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyUmlnaHRXaWR0aCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYodGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggIT09IG51bGwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhcldpZHRoO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIHNjcm9sbERpdi5jbGFzc05hbWUgPSBcInVpLXNjcm9sbGJhci1tZWFzdXJlXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgICAgIGxldCBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxiYXJXaWR0aDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBjYWxjdWxhdGVTY3JvbGxiYXJIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgaWYodGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFySGVpZ2h0ICE9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlZFNjcm9sbGJhckhlaWdodDtcbiAgICAgICAgXG4gICAgICAgIGxldCBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzY3JvbGxEaXYuY2xhc3NOYW1lID0gXCJ1aS1zY3JvbGxiYXItbWVhc3VyZVwiO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgbGV0IHNjcm9sbGJhckhlaWdodCA9IHNjcm9sbERpdi5vZmZzZXRIZWlnaHQgLSBzY3JvbGxEaXYuY2xpZW50SGVpZ2h0O1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG5cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVkU2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxiYXJIZWlnaHQ7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFySGVpZ2h0O1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIGludm9rZUVsZW1lbnRNZXRob2QoZWxlbWVudDogYW55LCBtZXRob2ROYW1lOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSk6IHZvaWQge1xuICAgICAgICAoZWxlbWVudCBhcyBhbnkpW21ldGhvZE5hbWVdLmFwcGx5KGVsZW1lbnQsIGFyZ3MpO1xuICAgIH1cbiAgICBcbiAgICBwdWJsaWMgc3RhdGljIGNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgICAgICBpZih3aW5kb3cuZ2V0U2VsZWN0aW9uKSB7XG4gICAgICAgICAgICBpZih3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZW1wdHkoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZih3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzICYmIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yYW5nZUNvdW50ID4gMCAmJiB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkuZ2V0UmFuZ2VBdCgwKS5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkucmVtb3ZlQWxsUmFuZ2VzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihkb2N1bWVudFsnc2VsZWN0aW9uJ10gJiYgZG9jdW1lbnRbJ3NlbGVjdGlvbiddLmVtcHR5KSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50WydzZWxlY3Rpb24nXS5lbXB0eSgpO1xuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vaWdub3JlIElFIGJ1Z1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyBnZXRCcm93c2VyKCkge1xuICAgICAgICBpZighdGhpcy5icm93c2VyKSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2hlZCA9IHRoaXMucmVzb2x2ZVVzZXJBZ2VudCgpO1xuICAgICAgICAgICAgdGhpcy5icm93c2VyID0ge307XG5cbiAgICAgICAgICAgIGlmIChtYXRjaGVkLmJyb3dzZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb3dzZXJbbWF0Y2hlZC5icm93c2VyXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5icm93c2VyWyd2ZXJzaW9uJ10gPSBtYXRjaGVkLnZlcnNpb247XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJyb3dzZXJbJ2Nocm9tZSddKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm93c2VyWyd3ZWJraXQnXSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYnJvd3Nlclsnd2Via2l0J10pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb3dzZXJbJ3NhZmFyaSddID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzLmJyb3dzZXI7XG4gICAgfVxuXG4gICAgcHVibGljIHN0YXRpYyByZXNvbHZlVXNlckFnZW50KCkge1xuICAgICAgICBsZXQgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGxldCBtYXRjaCA9IC8oY2hyb21lKVsgXFwvXShbXFx3Ll0rKS8uZXhlYyh1YSkgfHxcbiAgICAgICAgICAgIC8od2Via2l0KVsgXFwvXShbXFx3Ll0rKS8uZXhlYyh1YSkgfHxcbiAgICAgICAgICAgIC8ob3BlcmEpKD86Lip2ZXJzaW9ufClbIFxcL10oW1xcdy5dKykvLmV4ZWModWEpIHx8XG4gICAgICAgICAgICAvKG1zaWUpIChbXFx3Ll0rKS8uZXhlYyh1YSkgfHxcbiAgICAgICAgICAgIHVhLmluZGV4T2YoXCJjb21wYXRpYmxlXCIpIDwgMCAmJiAvKG1vemlsbGEpKD86Lio/IHJ2OihbXFx3Ll0rKXwpLy5leGVjKHVhKSB8fFxuICAgICAgICAgICAgW107XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGJyb3dzZXI6IG1hdGNoWzFdIHx8IFwiXCIsXG4gICAgICAgICAgICB2ZXJzaW9uOiBtYXRjaFsyXSB8fCBcIjBcIlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgaXNJbnRlZ2VyKHZhbHVlKTogYm9vbGVhbiB7XG4gICAgICAgIGlmKE51bWJlci5pc0ludGVnZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIgJiYgaXNGaW5pdGUodmFsdWUpICYmICBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGlzSGlkZGVuKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldFBhcmVudCA9PT0gbnVsbDtcbiAgICB9XG5cbiAgICBwdWJsaWMgc3RhdGljIGdldEZvY3VzYWJsZUVsZW1lbnRzKGVsZW1lbnQ6SFRNTEVsZW1lbnQpIHtcbiAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gRG9tSGFuZGxlci5maW5kKGVsZW1lbnQsYGJ1dHRvbjpub3QoW3RhYmluZGV4ID0gXCItMVwiXSk6bm90KFtkaXNhYmxlZF0pOm5vdChbc3R5bGUqPVwiZGlzcGxheTpub25lXCJdKTpub3QoW2hpZGRlbl0pLCBcbiAgICAgICAgICAgICAgICBbaHJlZl1bY2xpZW50SGVpZ2h0XVtjbGllbnRXaWR0aF06bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSwgXG4gICAgICAgICAgICAgICAgaW5wdXQ6bm90KFt0YWJpbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSwgc2VsZWN0Om5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSksIFxuICAgICAgICAgICAgICAgIHRleHRhcmVhOm5vdChbdGFiaW5kZXggPSBcIi0xXCJdKTpub3QoW2Rpc2FibGVkXSk6bm90KFtzdHlsZSo9XCJkaXNwbGF5Om5vbmVcIl0pOm5vdChbaGlkZGVuXSksIFt0YWJJbmRleF06bm90KFt0YWJJbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKSwgXG4gICAgICAgICAgICAgICAgW2NvbnRlbnRlZGl0YWJsZV06bm90KFt0YWJJbmRleCA9IFwiLTFcIl0pOm5vdChbZGlzYWJsZWRdKTpub3QoW3N0eWxlKj1cImRpc3BsYXk6bm9uZVwiXSk6bm90KFtoaWRkZW5dKWBcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGxldCB2aXNpYmxlRm9jdXNhYmxlRWxlbWVudHMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgZm9jdXNhYmxlRWxlbWVudCBvZiBmb2N1c2FibGVFbGVtZW50cykge1xuICAgICAgICAgICAgICAgIGlmKGdldENvbXB1dGVkU3R5bGUoZm9jdXNhYmxlRWxlbWVudCkuZGlzcGxheSAhPSBcIm5vbmVcIiAmJiBnZXRDb21wdXRlZFN0eWxlKGZvY3VzYWJsZUVsZW1lbnQpLnZpc2liaWxpdHkgIT0gXCJoaWRkZW5cIilcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJsZUZvY3VzYWJsZUVsZW1lbnRzLnB1c2goZm9jdXNhYmxlRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIHJldHVybiB2aXNpYmxlRm9jdXNhYmxlRWxlbWVudHM7XG4gICAgfVxufVxuIl19