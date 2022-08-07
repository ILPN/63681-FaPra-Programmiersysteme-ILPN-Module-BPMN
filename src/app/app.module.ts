import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule} from '@angular/forms';
import {FooterComponent} from './components/footer/footer.component';
import {InputFieldComponent} from './components/input-field/input-field.component';
import {OutputFieldComponent} from './components/output-field/output-field.component';
import {InputDirective} from './directives/input.directive';
import {ErrorHintComponent} from './components/error-hint/error-hint.component';
import { ModeSwitchComponent } from './components/mode-switch/mode-switch.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { DisplayDraggableGraphComponent } from './components/display-draggable-graph/display-draggable-graph.component';
import { DisplayReorderGraphComponent } from './components/display-reorder-graph/display-reorder-graph.component';
import { DisplaySwitchGraphComponent } from './components/display-switch-graph/display-switch-graph.component';

@NgModule({
    declarations: [
        AppComponent,
        FooterComponent,
        ErrorHintComponent,
        InputFieldComponent,
        OutputFieldComponent,
        InputDirective,
        ModeSwitchComponent,
        DisplayDraggableGraphComponent,
        DisplayReorderGraphComponent,
        DisplaySwitchGraphComponent
    ],
    imports: [
        BrowserModule,
        FlexLayoutModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatButtonToggleModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
