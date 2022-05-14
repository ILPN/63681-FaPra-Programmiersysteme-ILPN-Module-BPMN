import { Gateway } from './../../../app/classes/diagram/elements/gateway'
import { GatewayType } from './../../../app/classes/diagram/elements/gatewaytype'
import { Diagram } from './../../../app/classes/diagram/diagram'
import { Task } from './../../../app/classes/diagram/elements/task'
import { TaskType } from './../../../app/classes/diagram/elements/tasktype'




describe('Diagram unit tests', () => {

    beforeAll(() => {
    })

    describe('Diagram with 2 elements and edge', () => {

        it('should add elements to diagram and edge between them and should not add if already exist', () => {
            let diagram: Diagram = new Diagram();
            let task = new Task("Test", TaskType.BusinessRule);
            let gateway = new Gateway(GatewayType.AND_SPLIT);
            diagram.addElement(task);
            diagram.addElement(gateway);
            diagram.addEdge(task, gateway);

            expect(diagram.elements.length).toEqual(2)
            expect(task.adjacentElements.length).toEqual(1)
            expect(gateway.adjacentElements.length).toEqual(0)

            //should not add again
            diagram.addElement(task);
            diagram.addElement(gateway);
            expect(diagram.elements.length).toEqual(2)

            //should not add again
            diagram.addEdge(task, gateway);

            expect(task.adjacentElements.length).toEqual(1);
            expect(gateway.adjacentElements.length).toEqual(0);
        })
    })

    describe('Remove element from diagram', () => {

        it('should remove element from diagram and all the edges that lead to it', () => {
            let diagram: Diagram = new Diagram();
            let task = new Task("Test", TaskType.BusinessRule);
            let task2 = new Task("Test2", TaskType.Manual);
            let gateway = new Gateway(GatewayType.AND_JOIN);
            diagram.addElement(task);
            diagram.addElement(gateway);
            diagram.addEdge(task, gateway);
            diagram.addEdge(task2, gateway);
            diagram.addEdge(task, task2);

            expect(diagram.elements.length).toEqual(3)
            expect(task.adjacentElements.length).toEqual(2)
            expect(task2.adjacentElements.length).toEqual(1)
            expect(gateway.adjacentElements.length).toEqual(0)

            //remove
            diagram.removeElement(gateway);

            expect(diagram.elements.length).toEqual(2)
            expect(task.adjacentElements.length).toEqual(1)
            expect(task2.adjacentElements.length).toEqual(0)
            expect(diagram.has(gateway)).not;

            expect(task.hasEdge(gateway)).not;
            expect(task2.hasEdge(gateway)).not;
            expect(task.hasEdge(task2));

        })
    })
})