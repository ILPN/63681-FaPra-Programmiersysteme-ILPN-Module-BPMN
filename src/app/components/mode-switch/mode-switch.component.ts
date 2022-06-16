import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-mode-switch',
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss']
})
export class ModeSwitchComponent implements OnInit {
  selectedToggle: string;
  toggleOptions: Array<String> = ["Drag Free", "Sugiyama Mode", "Switch Diagram"];
  isFreeMode: boolean = false;

  constructor() {
    this.selectedToggle = "Drag Free",
    this.setIsFreeMode();
  }

  ngOnInit(): void {
    
  }

  selectionChanged(item : any) {
    console.log("Selected value: " + item.value);

    this.selectedToggle = item.value

    this.setIsFreeMode();
  }

  setIsFreeMode(){
    this.isFreeMode = this.selectedToggle === "Drag Free";
  }

  onDeleteAllCorners(){
    console.log("DeleteAllCorners clicked");
  }

  onMakeSquare(){
    console.log("MakeSquare clicked");
  }
}
