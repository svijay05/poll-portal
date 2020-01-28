var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
let MessageService = class MessageService {
    constructor() {
        this.messageSource = new Subject();
        this.clearSource = new Subject();
        this.messageObserver = this.messageSource.asObservable();
        this.clearObserver = this.clearSource.asObservable();
    }
    add(message) {
        if (message) {
            this.messageSource.next(message);
        }
    }
    addAll(messages) {
        if (messages && messages.length) {
            this.messageSource.next(messages);
        }
    }
    clear(key) {
        this.clearSource.next(key || null);
    }
};
MessageService = __decorate([
    Injectable()
], MessageService);
export { MessageService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9wcmltZW5nL2FwaS8iLCJzb3VyY2VzIjpbIm1lc3NhZ2VzZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUkvQixJQUFhLGNBQWMsR0FBM0IsTUFBYSxjQUFjO0lBQTNCO1FBRVksa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBcUIsQ0FBQztRQUNqRCxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFVLENBQUM7UUFFNUMsb0JBQWUsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BELGtCQUFhLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQWtCcEQsQ0FBQztJQWhCRyxHQUFHLENBQUMsT0FBZ0I7UUFDaEIsSUFBRyxPQUFPLEVBQUU7WUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwQztJQUNMLENBQUM7SUFFRCxNQUFNLENBQUMsUUFBbUI7UUFDdEIsSUFBRyxRQUFRLElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUM1QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNyQztJQUNMLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBWTtRQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0NBRUosQ0FBQTtBQXhCWSxjQUFjO0lBRDFCLFVBQVUsRUFBRTtHQUNBLGNBQWMsQ0F3QjFCO1NBeEJZLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgICBcbiAgICBwcml2YXRlIG1lc3NhZ2VTb3VyY2UgPSBuZXcgU3ViamVjdDxNZXNzYWdlfE1lc3NhZ2VbXT4oKTtcbiAgICBwcml2YXRlIGNsZWFyU291cmNlID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIFxuICAgIG1lc3NhZ2VPYnNlcnZlciA9IHRoaXMubWVzc2FnZVNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICBjbGVhck9ic2VydmVyID0gdGhpcy5jbGVhclNvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgICBcbiAgICBhZGQobWVzc2FnZTogTWVzc2FnZSkge1xuICAgICAgICBpZihtZXNzYWdlKSB7XG4gICAgICAgICAgICB0aGlzLm1lc3NhZ2VTb3VyY2UubmV4dChtZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBhZGRBbGwobWVzc2FnZXM6IE1lc3NhZ2VbXSkge1xuICAgICAgICBpZihtZXNzYWdlcyAmJiBtZXNzYWdlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMubWVzc2FnZVNvdXJjZS5uZXh0KG1lc3NhZ2VzKTtcbiAgICAgICAgfSBcbiAgICB9XG4gICAgXG4gICAgY2xlYXIoa2V5Pzogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuY2xlYXJTb3VyY2UubmV4dChrZXl8fG51bGwpO1xuICAgIH1cbiAgICBcbn0iXX0=