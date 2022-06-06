import { Component, OnInit } from '@angular/core';
import { OperationService } from './service/operation.service';

import { INumbers } from './interface/number';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

})

export class AppComponent implements OnInit {

  title='operation-list-app';
  numbers: INumbers[];
  errorMessage: string=null;


  constructor (private operationService: OperationService){}

 ngOnInit(): void {
 this. onActionOnTwoOperands(); 
  }

  onActionOnTwoOperands():  void {
    this.operationService.actionOnTwoOperands()
    .subscribe(
      (response) => {console.log(response);
        this.numbers = response;
        this.errorMessage = this.operationService.errorMessage;
      },
    );  
  }
  
}

