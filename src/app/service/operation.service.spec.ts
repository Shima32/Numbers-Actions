import { TestBed } from '@angular/core/testing';

import { OperationService } from './operation.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing'
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';


describe('OperationService', () => {
  let service: OperationService;
  let httpMock: HttpTestingController;
 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[
        HttpClientTestingModule,
        HttpClientModule,
        MatSnackBarModule
      ],
      providers: [
        OperationService
      ]
    });
    service = TestBed.inject(OperationService);
    httpMock = TestBed.inject(HttpTestingController);
    
  });

  afterEach(() => {
    httpMock.verify();
    
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /////////////////////////////////////////////////////////////////////////

  it('should return numbers and actions',() => {
    service.getFistValAndAction().subscribe( result =>{
      expect(result).toBeTruthy();
      expect(result.entries.length).toEqual(1);
      console.log('result verified');
    });
    const req = httpMock.expectOne('assets/Numbers.json');
    expect (req.request.method).toBe('GET');
    req.flush({
      result: [
        {
          "value" : 1, 
          "action" : "add"
        }
      ]
    })
  }
  )
//////////////////////////////////////////////////////////////////
  it('in case of Numbers file is missing for fetching numbers and actions',() => {

    const eMess = "404 Not Found";
    service.getFistValAndAction().subscribe( () =>{ fail('Numbers Error'),
    (error: HttpErrorResponse) => {
      expect (error.status).toEqual(404,'status');
      expect (error.error).toEqual(eMess, 'message');
    }
      console.log('result verified');
    });
    const req = httpMock.expectOne('assets/Numbers.json');
    expect (req.request.method).toBe('GET');
    req.flush(eMess, {status: 404, statusText: 'Not Found'})
  }
  )

  ///////////////////////////////////////////////////////
  it('in case of action file is missing ',() => {
    const eMess = "404 Not Found";
    const actionA ="Add"
    service.getNextValue(actionA).subscribe( () =>{ fail('MISSING DATA'),
    (error: HttpErrorResponse) => {
      expect (error.status).toEqual(404,'status');
      expect (error.error).toEqual(eMess, 'message');
    }
      console.log('result verified');
    });
    const req = httpMock.expectOne('assets/Add.json');
    expect (req.request.method).toBe('GET');
    req.flush(eMess, {status: 404, statusText: 'Not Found'})
   }
  )


  /////////////////////////////////////////////
  it('should fetch the second value from action files', () => {
    const testData = {value: 5};
     service.getNextValue("Add").subscribe(data =>
        expect(data.valueOf).toEqual(testData)
      );
    const req = httpMock.expectOne('assets/Add.json');
    expect(req.request.method).toBe('GET');
    req.flush(5);
  });
  ////////////////////////////////////////////

 it('should return the result of actions',() => {
   const recivedValue = [];
    const numbersValue = [ {
      value: 1,
      action: 'add',
    },
    {
      value: 2,
      action: 'multiply',
    },
    {
      value: 3,
      action: 'add',
    },
    {
      value: 4,
      action: 'add',
    },
    {
      value: 5,
      action: 'multiply',
    },
    {
      value: 6,
      action: 'multiply',
    }
  ] ; 

    const addValue = [{
      value: 5,
    }
    ];
    const mulValue = of([{
      value: 10,
    }
    ]);

    const expectedResult = [
      {
        value: 1,
        action: '+',
        operand: 5,
        result: 6,
      },
      {
        value: 2,
        action: '*',
        operand: 10,
        result: 20,
      },
      {
        value: 3,
        action: '+',
        operand: 5,
        result: 8,
      },
      {
        value: 4,
        action: '+',
        operand: 5,
        result: 9,
      },
      {
        value: 5,
        action: '*',
        operand: 10,
        result: 50,
      },
      {
        value: 6,
        action: '*',
        operand: 10,
        result: 60,
      }
    ];

    spyOn(service,"getFistValAndAction").and.callFake(() => {return of(numbersValue)})
    spyOn(service,"getNextValue").and.callFake(() => {return of(addValue)})
    service.actionOnTwoOperands().subscribe(
      (val) => {
        recivedValue.push(val);
      } );
      expect (recivedValue.entries).toEqual(expectedResult.entries);

 })
});

////////////////////////////////

