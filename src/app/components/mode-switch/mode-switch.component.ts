import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-mode-switch',
  templateUrl: './mode-switch.component.html',
  styleUrls: ['./mode-switch.component.scss']
})
export class ModeSwitchComponent implements OnInit,AfterViewInit {
  selectedToggle: string;
  toggleOptions: Array<string> = ["Manuelles Layout", "Sugiyama Layout", "Schalten"];
  constructor( private _appComponent: AppComponent) {
    this.selectedToggle = this.toggleOptions[0]
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
  }

  selectionChanged(item : any) {

    if(item.value == this.toggleOptions[1]){
      if(!confirm("Achtung: Durch die erneute Anwendung des Sugiyama Layouts werden die jetzigen Positionen der Knoten und Ecken der Kanten überschrieben!")) {
        setTimeout(()=>{ this.selectedToggle = this._appComponent.mode},5)
        return
      }
    }
    this.selectedToggle = item.value
    this._appComponent.mode = item.value


  }

}
