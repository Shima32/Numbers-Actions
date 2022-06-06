import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { catchError, filter, map, mergeMap, Observable, of, Subject} from 'rxjs';
import { INumbers } from 'src/app/interface/number';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IOperations } from '../interface/operation';



@Injectable({
  providedIn: 'root'
})
export class OperationService {

  erroe = new Subject<string>();
  errorMessage: string= null;

  constructor(private http: HttpClient, private snackbar: MatSnackBar) { }


  ///getting the first value and the action
  getFistValAndAction() : Observable <INumbers[]>{
    return this.http.get <INumbers[]>('assets/Numbers.json').pipe(
      catchError((err) => {
        console.log(err);
        this.errorMessage ="Numbers Error";
        this.snackbar.open('«Server Error»','',{
          panelClass: 'snackbar',
          verticalPosition: 'top',
          horizontalPosition: 'center'
        })
        return of([]);
      })
    )
  }

////getting the second value

getNextValue(action: string){
  return this.http.get<IOperations>(`assets/${action}.json`)

  .pipe(
    map( (nextValue) =>{
      return nextValue.value;
    }),
    catchError((err) =>{
      console.log('<MISSING DATA>',err);
      this.errorMessage ="<MISSING DATA>";
      this.snackbar.open('The file which contains the second operand is missing!','',{
        verticalPosition: 'bottom',
        horizontalPosition: 'left'
      })
      return of([]);
    })
  );
}

////executing operations on operands
  actionOnTwoOperands() :Observable <INumbers[]>{

    return this.getFistValAndAction().pipe(
      
      mergeMap(numbers => { 
          return this.getNextValue('Add')
          .pipe( map((value) => {
            return numbers.map((number) => {
              if(number.action === 'add'){
                return {
                  ...number,
                  action: '+',
                  operand: value,
                  result: number.value + <number>value
                }
              }else return number
            })     
          }))
      })
      , filter((result1:any) => !result1.error),
          map((result1:any) => result1), 

      mergeMap(numbers => { 
        return this.getNextValue('Multiply')
        .pipe(map((value) => {
          return numbers.map((number) => {
            if(number.action === 'multiply'){
              return {
                ...number,
                action: '*',
                operand: value,
                result: number.value*<number>value
              }
            }else return number
          })     
        }));
    }), filter((result:any) => !result.error),
    map((result:any) => result)
    
    )
  }
}
