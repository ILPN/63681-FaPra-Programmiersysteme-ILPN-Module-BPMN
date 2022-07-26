import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ErrorHintComponent} from './error-hint.component';
import {DisplayErrorService} from "../../services/display-error.service";
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('ErrorHintComponent', () => {
    let component: ErrorHintComponent;
    let fixture: ComponentFixture<ErrorHintComponent>;
    let service: DisplayErrorService;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ErrorHintComponent],
            providers: [DisplayErrorService]
        })
        .compileComponents();

        fixture = TestBed.createComponent(ErrorHintComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        debugElement = fixture.debugElement;
        service = debugElement.injector.get(DisplayErrorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('it should render message if service.displayError() is called', () => {
        serviceDisplayError('This is a test');
        let displayedErrorMessage = getDisplayedErrorMessage();
        expect(displayedErrorMessage).toBeTruthy();
    });

    it('should not render message if service.displayError() is not called', () => {
        let hint = debugElement.query(By.css('p.message'));
        expect(hint).toBeNull();
    });

    it('should close error hint if closeButton is been clicked', () => {
        serviceDisplayError('This is a test');
        clickOnCloseButton();
        let displayedErrorMessage = getDisplayedErrorMessage();
        expect(displayedErrorMessage).toBeNull();
    });

    it('should render correct message if service.displayError() is called', () => {
        serviceDisplayError('This is a test');
        let errorMessage: string = getErrorMessage();
        expect(errorMessage).toEqual("This is a test");
    });

    it('should change message if service.displayError() is called multiple times', () => {
        serviceDisplayError('This is a test');
        serviceDisplayError('hello');
        let errorMessage: string = getErrorMessage();
        expect(errorMessage).toEqual('hello');
    });

    function getErrorMessage(): string {
        return debugElement
        .query(By.css('p.message'))
            .nativeElement.textContent;
    }

    function serviceDisplayError(msg: string): void {
        service.displayError(msg);
        fixture.detectChanges();
    }

    function getDisplayedErrorMessage() {
        return debugElement.query(By.css('p.message'));
    }

    function clickOnCloseButton(): void {
        debugElement
        .query(By.css('button.closeButton'))
        .triggerEventHandler('click', null);
        fixture.detectChanges();
    }
});


