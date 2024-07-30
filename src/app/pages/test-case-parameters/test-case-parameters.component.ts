import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, Message, MessageService} from 'primeng/api';
import { sequence } from '@angular/animations';
import { error } from 'highcharts';

@Component({
  selector: 'app-test-case-parameters',
  templateUrl: './test-case-parameters.component.html',
  styleUrls: ['./test-case-parameters.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class TestCaseParametersComponent implements OnInit {
  public backUrl:string = '';
  public breadcrumblist:any[] = [];
  public configFilesLoader:boolean = false;
  public gitHubConfigData:any[] = [];
  public uploadConfigFilesSidebar:boolean = false;
  githubForm: FormGroup = new FormGroup({
    access_key:new FormControl(''),
    repository: new FormControl(''),
    branch: new FormControl(''),
    // status: new FormControl(''),
    valid_till:new FormControl(''),
  });
  public submitted:boolean = false;
  public successResponce:any;
  public successMessage!:Message[];
  public successResponcePopup: boolean = false;
  public submitSuccessMessage:string ='';
  public loggedInUserDetails:any;
  public gitOperation:any;
  public gitData:any;
  public responceDialogTitle:string = '';
  public statusOptions:any[] = [{name:'ACTIVE', value:'ACTIVE'}, {name:'INACTIVE', value:"INACTIVE"}];

  configFilesData:any[]= [];
  uploadedFiles: any[] = [];
  csvContent: any;
  convertedArray: Array<any> = [];
  properties: any = '';

  uploadedFileNames:any[]=[];
  fileHeaders:any[]=[];

  //paremsForm!:FormGroup;

  joinFileCompareOptions:any[]=['=='];  
  joinFilesForm!: FormGroup;
  
  mergeColumnsSaperatorOptions:any=['-','_','.'];
  mergeColumnsForm!:FormGroup;

  filterMainConditions:any[] = ['And','Or'];
  filterConditions:any[] = ['in', 'exact', 'iexact', 'notin', 'notequal', 'startswith', 'istartswith', 'endswith', 'iendswith', 'contains', 'icontains'];
  filtersForm!:FormGroup;
  showNestedFilters:boolean = false;
  filterOrder:number = 1;

  requestedParamsForm!: FormGroup;

  finalData:any = {
    "subCategoryId":0,
    "joinFilesItems":[],
    "mergeColumnsItems":[],
    "filterConditionItems":[],
    "requestedParamItems":[]
  }

  public testTypes:any[]=[];
  public selectedTestType:any;
  public selectedTestId!:any;
  public testCategoriesLoader:boolean = false;
  public testTypeCategories:any[] = [];
  public testSubCategoryData:any[] = [];
  public testSubCategoryLoader:boolean = false;

  testTypesForm!: FormGroup;

  public filesList:any[]=[];
  public columnsList:any[]=[];
  public fileNamesAndColumnsData:any[]=[];
  public getFilesAndColumnsLoader:boolean = false;

  public parametersData:any[] =[];
  public parametersLoader:boolean = false;

  public submitParameterDataLoader:boolean = false;

  public parameterName:string = '';

  constructor(private authenticationService:AuthService,
    private dataService:DataService,
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) {   
      

      this.joinFilesForm = this.fb.group({
        joinFilesItems: this.fb.array([])
      });

      this.mergeColumnsForm = this.fb.group({
        mergeColumnsItems: this.fb.array([])
      });

      this.filtersForm = this.fb.group({
        filterMainConditionItems: this.fb.array([]),
        nestedConditionSections: this.fb.array([])
      });

      this.requestedParamsForm = this.fb.group({
        requestedParamItems: this.fb.array([])
      });

    }

  ngOnInit(): void {
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserDetails = userData.user_details;
    //console.log('----userData', this.loggedInUserDetails);

    this.backUrl = this.appConfig.urlGitConfig;
    this.breadcrumblist.push(
          {'name':'Home','url':this.appConfig.urlHome, 'disabled':false},
          {'name':' Test Case Parameters','url':'', 'disabled':true})
    this.getConfigFilesData();
    this.testTypesForm = this.fb.group({
      testType: ['', Validators.required],
      testCategory: ['', Validators.required],
      testSubCategory: ['', Validators.required]
    });
    this.getTestTypes();
    this.getParameters('');
  }
  getConfigFilesData(){
    this.configFilesLoader = true;
    this.configFilesData = [
      {
          "id": 1,
          "name": "Parameter 1",
          "status": "Active",
          "totalFiles": "3",
          "created_at": "2024-04-25 18:55",
          "created_by": "rafi",
          "valid_till": "2027-05-01",
          "created_by_id": 1
      },
      {
          "id": 2,
          "name": "Parameter 2",
          "status": "Active",
          "totalFiles": "2",
          "created_at": "2024-04-26 03:45",
          "created_by": "rafi",
          "valid_till": "2024-08-21",
          "created_by_id": 1
      },
      {
        "id": 3,
        "name": "Parameter 3",
        "status": "Inactive",
        "totalFiles": "4",
        "created_at": "2024-05-21 01:10",
        "created_by": "damodar",
        "valid_till": "2024-08-21",
        "created_by_id": 2
    }
  ]
  this.configFilesLoader = false;
    // const getConfigFilesData = {
    //     action: 'git_details/',
    //     method: 'get',
    //     // params: {
    //     //   id: productId
    //     // }
    //   }
    //   this.dataService.apiDelegate(getConfigFilesData).subscribe((result: any) => {
    //     this.gitHubConfigData = result.data;
    //     this.gitData = result.data.data
    //     this.configFilesLoader = false;
    //     // this.enterpriseList = result.data;
    //     console.log('get GitCongigs', result);

    // }, error => {
    //   this.configFilesLoader = false;
    //   console.log('error',error);
    // })
  }

  
 

  //Join Files Form Start 
  get joinFilesItems(): FormArray {
    return this.joinFilesForm.get('joinFilesItems') as FormArray;
  }

  addJoinFilesItem(): void {
    const itemFormGroup = this.fb.group({
      fileOne: ['', Validators.required],
      fieldOne: ['', Validators.required],
      condition: ['', Validators.required],
      fileTwo: ['', Validators.required],
      fieldTwo: ['', Validators.required],
      is_mandatory: [true],
      skip_if_no_column: [false]
    });
    this.joinFilesItems.push(itemFormGroup);
  }
  removeJoinFilesItem(index: number): void {
    this.joinFilesItems.removeAt(index);
  }
  // submitJoinFiles(): void {
  //   if (this.joinFilesForm.valid) {   
  //     console.log(this.joinFilesForm.value);  
  //     this.joinFilesForm.value.joinFilesItems.forEach((item:any)=>{
  //       delete item.fileOne.columns;
  //       delete item.fileTwo.columns;
  //     })
  //     console.log(this.joinFilesForm.value);
  //   } else {
  //     console.log('Form is not valid');
  //   }
  // }
/////Join Files Form END

/// Merge Form Start
get mergeColumnsItems(): FormArray {
  return this.mergeColumnsForm.get('mergeColumnsItems') as FormArray;
}
addMergeItem(): void {
  const mergeItemFormGroup = this.fb.group({
    fileName: ['', Validators.required],
    newColumnHeader: ['', Validators.required],
    mergeColumns: ['', Validators.required],
    separator: ['', Validators.required],
    is_mandatory: [true],
    skip_if_no_column: [false]
  });
  this.mergeColumnsItems.push(mergeItemFormGroup);
}
removeMergeItem(index: number): void {
  this.mergeColumnsItems.removeAt(index);
}
// submitMergeColumns(): void {
//   if (this.mergeColumnsForm.valid) {
//     console.log(this.mergeColumnsForm.value);
//   } else {
//     console.log('Form is not valid');
//   }
// }
//Merge Form END

/// Filters Form Start
get filterMainConditionItems(): FormArray {
  return this.filtersForm.get('filterMainConditionItems') as FormArray;
}

addFilterItem(): void {
  let itemOrder = this.filterOrder;
  this.filterOrder = this.filterOrder + 1;
  const filterMainItemFormGroup = this.fb.group({
    sNo:[itemOrder],
    fileName: ['', Validators.required],
    columnTitle: ['', Validators.required],
    condition: ['', Validators.required],
    columnValue: ['', Validators.required],
    mainCondition:[this.filterMainConditions[0]],
    is_mandatory: [true],
    skip_if_no_column: [false]
  });
  this.filterMainConditionItems.push(filterMainItemFormGroup);
  console.log('this.filterOrder', this.filterOrder);
}
removeMainFilterItem(index: number): void {
  this.filterMainConditionItems.removeAt(index);
}

get nestedConditionSections():FormArray {
  return this.filtersForm.get('nestedConditionSections') as FormArray;
}

addNestedFilterItemsSection(): void {
  let itemOrder = this.filterOrder;
  this.filterOrder = this.filterOrder + 1;
  const sectionFormGroup = this.fb.group({
    sNo:[itemOrder],
    nestedConditionItems: this.fb.array([]),
    mainCondition:[this.filterMainConditions[0]]
  });
  this.nestedConditionSections.push(sectionFormGroup);
  console.log('this.filterOrder', this.filterOrder);
}

addNestedFilterItem(sectionIndex: number): void {  
  const sectionItems = this.getNestedConditionSections(sectionIndex);
  console.log('sectionItems', sectionItems);
  const filterNestedItemFormGroup = this.fb.group({
    fileName: ['', Validators.required],
    columnTitle: ['', Validators.required],
    condition: ['', Validators.required],
    columnValue: ['', Validators.required],
    mainCondition:[this.filterMainConditions[0]],
    is_mandatory: [true],
    skip_if_no_column: [false]
  });
  sectionItems.push(filterNestedItemFormGroup);
  //this.nestedConditionSections.push(filterNestedItemFormGroup);
}

getNestedConditionSections(sectionIndex: number): FormArray {
  return this.nestedConditionSections.at(sectionIndex).get('nestedConditionItems') as FormArray;
}

removeNestedFilterItemsSection(sectionIndex: number): void {
  this.nestedConditionSections.removeAt(sectionIndex);
}

removeNestedFilterItem(sectionIndex: number, itemIndex: number): void {
  const items = this.getNestedConditionSections(sectionIndex);
  items.removeAt(itemIndex);
}
// submitFilterForm(): void {
//   if (this.filtersForm.valid) {
//     console.log(this.filtersForm.value);
//   } else {
//     console.log('Form is not valid');
//   }
// }
//Filter Form END

/// Requested Params Form Start
get requestedParamItems(): FormArray {
  return this.requestedParamsForm.get('requestedParamItems') as FormArray;
}
addRequestedParamsItem(): void {
  const requestedParamsItemFormGroup = this.fb.group({
    fileName: ['', Validators.required],
    requestedColumns: ['', Validators.required]
  });
  this.requestedParamItems.push(requestedParamsItemFormGroup);
}
removeRequestedParamsItem(index: number): void {
  this.requestedParamItems.removeAt(index);
}
// submitMergeColumns(): void {
//   if (this.mergeColumnsForm.valid) {
//     console.log(this.mergeColumnsForm.value);
//   } else {
//     console.log('Form is not valid');
//   }
// }
//Merge Form END


  showUploadConfigFilesSideBar(){
    this.uploadConfigFilesSidebar = true;
  }
  hideUploadConfigFilesSideBar(){
    this.uploadConfigFilesSidebar = false;
  }


  onUpload(event:any) {
    console.log('----event', event);
    this.uploadedFiles = [];
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }
    console.log('uploadedFiles', this.uploadedFiles);

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    this.convertToJSON();
  }

  convertToJSON(){
    this.uploadedFileNames = [];
    this.fileHeaders = [];
    //read file from input
    var fileTypes = ['csv']; //acceptable file types
    this.uploadedFiles.forEach((item:any)=>{
      //const f : File = fileList.item(0)
     // console.log("[FOO] File", f)
      let decoder = new window.TextDecoder('utf-8');
      item.arrayBuffer().then( (data:any) => {
          let _data = decoder.decode(data)
          //console.log("Dataset", data, _data)
          let lines:any = _data.split("\n")
          let headers:Array<any> = lines[0].split(',')
          let results:Array<any> = []
          for ( let i = 1; i < lines.length; i++) {
              let line = lines[i]
              let row:any = {}
              line.split(",").forEach( (val:any, idx:number) => {
                  row[headers[idx]] = val;
              })
              results.push(row)
          }
         
          const fileName:string = item.name.replace(' ', '_').replace('.csv', '');
          this.uploadedFileNames.push(fileName);
          //this.fileHeaders[fileName] = headers;
          this.fileHeaders.push({
            'name':fileName,
            'headers':headers
            //[fileName] : headers
          }            
          )
          console.log('File names', this.uploadedFileNames);
          console.log('fileHeaders', this.fileHeaders);
          //console.log("JSON ARRAY", results)
      })
    })
    //this.addJoinFilesItem();
    //this.addMergeItem();
  }

  getFields(selectedFile:string){
    //console.log('selectedFile', selectedFile);
    const filtered_array = _.filter(this.fileNamesAndColumnsData, selectedFile);
    //console.log('filtered_array', filtered_array);
    return filtered_array[0].columns;
  }

  onFileSelect(input:any) {
    
    const files = input.files;
    console.log('---input', files);
    var fileTypes = ['csv']; //acceptable file types

    if (files && files.length) {
      var extension = input.files[0].name.split('.').pop().toLowerCase(), //file extension from input file
        //Validating type of File Uploaded
        isSuccess = fileTypes.indexOf(extension) > -1; //is extension in acceptable types
      //console.log(isSuccess);
      //console.log("Filename: " + files[0].name);
      // console.log("Type: " + files[0].type);
      //  console.log("Size: " + files[0].size + " bytes");
      var that = this;
      //Flag to check the Validation Result
      if (isSuccess) {
        const fileToRead = files[0];

        const fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent:any) {
          const textFromFileLoaded = fileLoadedEvent?.target.result;
          that.csvContent = textFromFileLoaded;
          //console.log('csvContent', that.csvContent);
          //Flag is for extracting first line
          let flag = false;
          // Main Data
          let objarray: Array<any> = [];
          //Properties
          let prop: Array<any> = [];
          //Total Length
          let size: any = 0;

          for (const line of that.csvContent.split(/[\r\n]+/)) {
            //console.log('line', line);
            if (flag) {
              let obj:any = {};
              for (let k = 0; k < size; k++) {
                //Dynamic Object Properties
                obj[prop[k]] = line.split(',')[k];
              }
              objarray.push(obj);
            } else {
              //First Line of CSV will be having Properties
              for (let k = 0; k < line.split(',').length; k++) {
                size = line.split(',').length;
                //Removing all the spaces to make them usefull
                prop.push(line.split(',')[k].replace(/ /g, ''));
              }
              flag = true;
            }
          }
          //All the values converted from CSV to JSON Array
          that.convertedArray = objarray;
          that.properties = [];
          //Object Keys of Converted JSON Array
          that.properties = prop;

          let finalResult = {
            properties: that.properties,
            result: that.convertedArray,
          };
          //On Convert Success
          console.log(finalResult);
        };

        fileReader.readAsText(fileToRead, 'UTF-8');
      } else {
        //On Error
        console.error('Invalid File Format!');
      }
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.githubForm.controls;
  }

  setForm(){
    this.githubForm = this.fb.group({
      access_key: ['', [Validators.required]],
      repository:['', [Validators.required]],
      branch: ['', [Validators.required]],
      // status: ['', [Validators.required]],
      valid_till: ['', [Validators.required]]
    })
    //this.githubForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  navigateToDetails(selectedRequist:string){
    //this.selectedSubCategory = selectedRequist;
    const url = this.appConfig.urlConfigFiles + '/configRequistDetails/' + selectedRequist;
    // console.log('url', url)
    this._router.navigateByUrl(url);
  }

  submitParameterData(){
    this.submitParameterDataLoader = true;
    this.finalData = {  
      "parameterName":this.parameterName,  
      "subCategoryId": this.testTypesForm.get('testSubCategory')?.value.id,
      "joinFilesItems":[],
      "mergeColumnsItems":[],
      "filterConditionItems":[],
      "requestedParamItems":[]
    }
    if (this.joinFilesForm.valid) {
      console.log(this.joinFilesForm.value);
      this.finalData.joinFilesItems = this.joinFilesForm.value.joinFilesItems
    } else {
      console.log('Form is not valid');
      //return
    }

    if (this.mergeColumnsForm.valid) {
      console.log(this.mergeColumnsForm.value);
      this.finalData.mergeColumnsItems = this.mergeColumnsForm.value.mergeColumnsItems
    } else {
      console.log('Form is not valid');
      //return
    }    

    if (this.filtersForm.valid) {
      console.log(this.filtersForm.value);
      const filteredData:any[]=[];
      const data:any = this.filtersForm.value;
      data.filterMainConditionItems.forEach((item:any)=>{
        filteredData.push(item);
      })
      data.nestedConditionSections.forEach((item:any)=>{
        console.log('item.nestedConditionSections', item.nestedConditionSections);
        console.log('item-----', item);
        filteredData.push({
          "conditions":item.nestedConditionItems,
          "mainCondition":item.mainCondition,
          "is_mandatory": true,
          "skip_if_no_column": false
        })
      })
      console.log('filteredData', filteredData);
      this.finalData.filterConditionItems = filteredData
    } else {
      console.log('Form is not valid');
      //return
    }

    if (this.requestedParamsForm.valid) {
      console.log(this.requestedParamsForm.value);
      this.finalData.requestedParamItems = this.requestedParamsForm.value.requestedParamItems
    } else {
      console.log('Form is not valid');
      //return
    }

    //console.log("--finalDaya:", this.finalData);
    const setUser = {
      action: 'product/update_parameters/',
      method: 'post',
      data: this.finalData
    }
    this.dataService.apiDelegate(setUser).subscribe((result: any) => {
      this.submitParameterDataLoader = false;        
      this.successResponce = result;
      console.log('successResponce', this.successResponce);
      if(!_.isEmpty(result)) {
        this.submitSuccessMessage = 'Parameter created successfully';
        this.clearParameterFormsData();
        //this.successResponcePopup = true;       
        this.messageService.add({severity:'success', summary:'Success', detail:'Parameter created successfully'});
        this.hideUploadConfigFilesSideBar();
        //this.messageService.add({severity:'success', summary: 'Success', detail: 'User added successfully'});          
        //const responceData = result.response.Regression;
        //this.testCasesData = responceData.TestCases;
      }      
    }, error=>{
      this.submitParameterDataLoader = false;
      console.log('Error', error);
    })
    
  }

  clearParameterFormsData(){
    this.parameterName = '';
    this.joinFilesForm.reset();
    this.mergeColumnsForm.reset();
    this.filtersForm.reset();
    this.requestedParamsForm.reset();
    while (this.joinFilesItems.length !== 0) {
      this.joinFilesItems.removeAt(0);
    }
    while (this.mergeColumnsItems.length !== 0) {
      this.mergeColumnsItems.removeAt(0);
    }

    while (this.filterMainConditionItems.length !== 0) {
      this.filterMainConditionItems.removeAt(0);
    }

    while (this.nestedConditionSections.length !== 0) {
      this.nestedConditionSections.removeAt(0);
    }

    while (this.requestedParamItems.length !== 0) {
      this.requestedParamItems.removeAt(0);
    }
    // this.joinFilesItems.controls.forEach(section => {
    //   const items = section.get('items') as FormArray;
    //   while (items.length !== 0) {
    //     items.removeAt(0);
    //   }
    // });
    this.finalData = {    
      "parameterName":'',
      "subCategoryId": 0,
      "joinFilesItems":[],
      "mergeColumnsItems":[],
      "filterConditionItems":[],
      "requestedParamItems":[]
    }
  }

  getParameters(subCategoryId:any) {
    this.parametersData = [];
    this.parametersLoader = true;
    const getParameters = {
      action: 'product/get_test_sub_category_params/',
      method: 'get',
      params: {
        //test_sub_category_id: subCategoryId,
        get_parameters:true
      }
    }
    this.dataService.apiDelegate(getParameters).subscribe((result: any) => {
      if(result) {
        this.parametersData = result.result; 
      }  
      this.parametersLoader = false;    
      console.log('parametersData', this.parametersData);
    })
  }

  getTestTypes() {
    const getProductCategory = {
      action: 'product/testtypes/',
      method: 'get',
      // params: {
      //   id: productId
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      this.testTypes = [...result.data]; 
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      console.log('testTypes', this.testTypes);
    })
  }

  getTestTypeCategory(selecedTestType:any) {
    // if(this.selectedTestId == selecedTestType.id){
    //   this.selectedTestId = '';
    //   return
    // }
    this.selectedTestType = selecedTestType;
    this.selectedTestId = selecedTestType.id;
    this.testCategoriesLoader = true;
    const getProductCategory = {
      action: 'product/test_categories/',
      method: 'get',
      params: {
        test_type_id: this.selectedTestId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //const testCases = result.data;   
      if(result){
        this.testTypeCategories = [...result.data]; 
      }
      
      // testCases.forEach((item:any) => {
      //   this.testTypes.push(item.code)
      // });
      
      this.testCategoriesLoader = false;
      console.log('testTypeCategories', this.testTypeCategories);
    })
  }

  getTestCaseSUbCategory(selectedTestCase:any, test_category_id:any){
    //console.log('-------------------');
    this.testSubCategoryData = [];
    this.testSubCategoryLoader = true;
    const testCategories = {
      action: 'product/test_sub_categories/',
      method: 'get',
      params: {
        //product_id: productId,
        test_type_id: selectedTestCase,
        test_category_id:test_category_id
      }
    }
    this.dataService.apiDelegate(testCategories).subscribe((responce: any) => {     
      if(!_.isEmpty(responce)){
          this.testSubCategoryData = responce.data
          console.log('test Case Sub category', this.testSubCategoryData);
      }
      this.testSubCategoryLoader = false;      
    }, error => {
      this.testSubCategoryLoader = false;
      console.log('error',error);
    })
  }

  getFilesAndColumns(selectedSubCategoryId:any) {
    this.getParameters(selectedSubCategoryId);
    this.filesList = [];
    this.columnsList =[];
    this.getFilesAndColumnsLoader = true;
    const getProductCategory = {
      action: 'product/get_csv_files_and_its_columns/',
      method: 'get',
      params: {
        topology_id: selectedSubCategoryId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.fileNamesAndColumnsData = result.result;
      this.fileNamesAndColumnsData.forEach((item:any)=>{
        this.filesList.push({
          file_name:item.file_name,
          bucket_name:item.bucket_name,
          s3_location:item.s3_location
        })
      })
      this.getFilesAndColumnsLoader = false;
      console.log('filesAndColumns', this.fileNamesAndColumnsData);   
      console.log('filesList', this.filesList);   
    })
  }

  onSubmit() {
    if (this.testTypesForm.valid) {
      console.log(this.testTypesForm.value);
    }
  }

}
