import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'app-mode-switch',
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss']
})
export class ModeSwitchComponent implements OnInit {
  selectedToggle: string;
  toggleOptions: Array<String> = ["Drag Free", "Sugiyama Mode", "Switch Diagram"];
  isFreeMode: boolean = false;

  constructor( private _appComponent: AppComponent) {
    this.selectedToggle = "Drag Free",
    this.setIsFreeMode();
  }

  ngOnInit(): void {
    
  }

  selectionChanged(item : any) {
    console.log("Selected value: " + item.value);

    this.selectedToggle = item.value
    this._appComponent.mode = item.value

  }

  setIsFreeMode(){
    this.isFreeMode = this.selectedToggle === "Drag Free";
  }

}
