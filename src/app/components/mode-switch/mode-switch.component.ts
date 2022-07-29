import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-mode-switch',
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss']
})
export class ModeSwitchComponent implements OnInit {
  selectedToggle: string;
  toggleOptions: Array<String> = ["free dragging", "change order", "switch diagram"];
  constructor( private _appComponent: AppComponent) {
    this.selectedToggle = "free dragging"
  }

  ngOnInit(): void {

  }

  selectionChanged(item : any) {
    //console.log("Selected value: " + item.value);

    this.selectedToggle = item.value
    this._appComponent.mode = item.value

  }


}
