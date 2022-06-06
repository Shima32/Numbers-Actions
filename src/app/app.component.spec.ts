import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { OperationService } from './service/operation.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'operation-list-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('operation-list-app');
  });
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.myTest')?.textContent).toContain('Operation');
  });

  it('should call onActionOnTwoOperands function', () => {
    const operationResult = [
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
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OperationService)
    spyOn(service,"actionOnTwoOperands").and.callFake(() => {return of(operationResult)})
    app.onActionOnTwoOperands();
    expect (app.numbers).toEqual(operationResult);
    
    
  });
});