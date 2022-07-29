import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let debugElement: DebugElement;


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;

    });

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });


    it('should detect file input change and set uploadedFile  model', () => {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(new File([''], 'validGraph.txt')); // todo: file einfuegen und pfad anpassen

        const inputDebugEl = fixture.debugElement.query(By.css('div input-field'));
        inputDebugEl.nativeElement.files = dataTransfer.files;

        inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

        fixture.detectChanges();

        expect(component.textareaFc).toBeTruthy()
        // expect(component.uploadedFile).toBe('validGraph.txt') //todo: wo kann ich den Wert abgreifen?

    });

    it('should unsubscribe after ngOnDestroy is called', () => {
        spyOn(component['_sub'], 'unsubscribe');
        component.ngOnDestroy();
        expect(component['_sub'].unsubscribe).toHaveBeenCalled();
    });

    //todo: fix test
    // it('file change event should arrive in handler', () => {
    //     const element = fixture.nativeElement;
    //     const input = element.querySelector('div input-field');
    //     spyOn(component, 'extracted');
    //     input.dispatchEvent(new Event('newInputEvent'));
    //     fixture.detectChanges();
    //     expect(component.extracted).toHaveBeenCalled();
    // });

});
