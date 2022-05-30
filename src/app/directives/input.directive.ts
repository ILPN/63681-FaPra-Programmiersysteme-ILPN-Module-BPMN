import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appUpload]'
})
export class InputDirective {

  @Output() private filesChangeEmiter : EventEmitter<any> = new EventEmitter();

  constructor() { }

  @HostListener('mouseleave', ['$event']) onMouseLeave (evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const target = (evt.target as HTMLElement);
    target.classList.remove('mouse-hover');
  }

  @HostListener('mouseover', ['$event']) onMouseOver(evt: MouseEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const target = (evt.target as HTMLElement);
    target.classList.add('mouse-hover');
  }

  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const target = (evt.target as HTMLElement);
    target.classList.add('mouse-hover')
  }

  @HostListener('dragleave', ['$event']) onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    const target = (evt.target as HTMLElement);
    target.classList.remove('mouse-hover');
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent){
    evt.preventDefault();
    evt.stopPropagation();
    this.filesChangeEmiter.emit(evt);
    
  }
}
