import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public readonly urlHome:string = '/home/';
  public readonly urlProductCategory:string = this.urlHome + 'productCategories';
  public readonly urlDeviceManagement:string = this.urlHome + 'deviceManagement';
  public readonly urlTestCasesManagement:string = this.urlHome + 'testCasesManagement';
  public readonly urlCreateNewCategory:string = this.urlHome + 'deviceManagement/createNewCategory';
  public readonly urlUsersList:string = this.urlHome + 'usersList';
  public readonly urlAddUser:string = this.urlHome + 'addUser';
  public readonly urlTestExecution:string = this.urlHome + 'testExecution';

  constructor() { }
}
