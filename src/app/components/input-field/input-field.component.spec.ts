import {ComponentFixture, TestBed} from '@angular/core/testing';
import {InputFieldComponent} from './input-field.component';
import {By} from "@angular/platform-browser";

describe('TemplateButtonComponent', () => {
    let component: InputFieldComponent;
    let fixture: ComponentFixture<InputFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InputFieldComponent]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    //todo: onFileDragged wird nicht aufgerufen
    xit('should detect dragged file input', () => {
        const divDebugElement = fixture.debugElement.query(By.css('div.interactive-square'));

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(new File([''], 'validGraph.txt'));
        // divDebugElement.nativeElement.files = dataTransfer.files;

        spyOn(component, 'onFileDragged');
        let dragEvent = new DragEvent('change', {dataTransfer});
        divDebugElement.nativeElement.dispatchEvent(dragEvent);
        fixture.detectChanges();

        const fileInputDebugElement = fixture.debugElement.query(By.css('div input.file-input'));
        fileInputDebugElement.nativeElement.dispatchEvent(new InputEvent('change'));
        fixture.detectChanges();

        expect(component.onFileDragged).toHaveBeenCalled();
    });

    // todo: fileUpload wird nicht aufgerufen
    xit('should call fileUpload if div.interactive-square is clicked on', () => {
        const divDebugElement = fixture.debugElement.query(By.css('div.interactive-square'));

        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(new File([''], 'validGraph.txt'));

        spyOn(component, 'fileUpload');
        divDebugElement.nativeElement.dispatchEvent(new InputEvent('click'));
        fixture.detectChanges();

        expect(component.fileUpload).toHaveBeenCalled();

    });
});
