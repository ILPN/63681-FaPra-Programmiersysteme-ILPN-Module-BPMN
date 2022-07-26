import {TestBed} from '@angular/core/testing';
import {ParserService} from './parser.service';

describe('ParserService', () => {
    let service: ParserService;
    let validGraph: string;
    let sampleGraph: string;


    beforeAll(() => {
        validGraph = '.events\n' +
            'e1 start "Start" (60,190)\n' +
            'e2 intermediate "BpmnEventIntermediate" (850,190)\n' +
            'e3 end "BpmnEventEnd" (1600,190)\n' +
            '\n' +
            '.activities\n' +
            't1 service "BpmnTaskService" (442,60)\n' +
            't2 manual "BpmnTaskManual" (442,320)\n' +
            't3 usertask "BpmnTaskUser" (1225,190)\n' +
            '\n' +
            '.gateways \n' +
            'g1 or_split (210,190)\n' +
            'g2 or_join (675,190)\n' +
            '\n' +
            '.sequences\n' +
            'connector sequenceflow "1" e1 g1 \n' +
            'pfeil sequenceflow "p2" g1 t1\n' +
            'connector2 sequenceflow "p3" g1 t2 (210,320)\n' +
            'connector3 sequenceflow "a4" t1 g2 (675,60)\n' +
            'connector4 sequenceflow "a5" t2 g2 (675,320)\n' +
            'connector5 sequenceflow "a6" g2 e2 \n' +
            'connector6 sequenceflow "a7" e2 t3\n' +
            'connector7 sequenceflow "a8" t3 e3';


        sampleGraph = '.events\n' +
            'e1 start "Am Start" (60,190)\n' +
            'e2 intermediate "BpmnEventIntermediate" (850,190)\n' +
            'e3 end "BpmnEventEnd" (1600,190)\n' +
            'ee3 end "ende gelaende" (1600,190)\n' +
            '\n' +
            '.activities\n' +
            't1 service "BpmnTaskService" (442,60)\n' +
            't2 manual "BpmnTaskManual" (442,320)\n' +
            't3 usertask "BpmnTaskUser" (1225,190)\n' +
            '\n' +
            '.gateways \n' +
            'g1 or_split (210,190)\n' +
            'g2 or_join (675,190)\n' +
            '\n' +
            '.sequences\n' +
            'coupou sequenceflow "1vvv" ee3 e3\n' +
            'connector sequenceflow "1" e1 g1 \n' +
            'pfeil sequenceflow "p2" g1 t1\n' +
            'connector2 sequenceflow "p3" g1 t2 (210,320)\n' +
            'connector3 sequenceflow "a4" t1 g2 (675,60)\n' +
            'connector4 sequenceflow "a5" t2 g2 (675,320)\n' +
            'connector5 sequenceflow "a6" g2 e2 \n' +
            'connector6 sequenceflow "a7" e2 t3\n' +
            'connector7 sequenceflow "a8" t3 e3';
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ParserService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // todo: needs to be fixed
    xit('should parse input file correctly', () => {
        let parse = service.parse(validGraph); // TODO: Warum kann das Ergebnis undefined sein?
        console.log(parse)
    });

});
