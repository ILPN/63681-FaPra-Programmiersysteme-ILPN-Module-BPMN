import {Injectable} from '@angular/core';
import {Diagram} from '../classes/diagram/diagram';
import {Element} from '../classes/diagram/element';
import { Task } from '../classes/diagram/elements/task';
import { TaskType } from '../classes/diagram/elements/tasktype';

@Injectable({
    providedIn: 'root'
})
export class ParserService {

    constructor() {
    }

    parse(text: string): Diagram | undefined {
        const lines = text.split('\n');

        const result = new Diagram();

        lines.forEach(line => {
            if (line.trimEnd().length > 0) {
                result.addElement(this.parseElement(line));
            }
        });

        return result;
    }

    private parseElement(line: string): Element {
        return new Task("Hotel buchen", TaskType.Service);
    }
}
