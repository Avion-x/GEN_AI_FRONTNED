import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import {ConfirmationService, ConfirmEventType, Message, MessageService} from 'primeng/api';

import * as Highcharts from 'highcharts';
import HC_networkgraph from 'highcharts/modules/networkgraph';
HC_networkgraph(Highcharts);

@Component({
  selector: 'app-config-files',
  templateUrl: './config-files.component.html',
  styleUrls: ['./config-files.component.scss'],
  providers: [ConfirmationService,MessageService]
})
export class ConfigFilesComponent implements OnInit {
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


  dirDist50:any = "#E8544E";
  dirDist10:any = "#FFD265";
  dirDistLess10:any = "#2AA775";
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  configFilesData:any[]= [];
  uploadedFiles: any[] = [];

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'networkgraph',
      height: '600'
    },

    title: {
      text: 'Network Topology'
    },

    // tooltip:{
    //   formatter:function(){
    //     var info="";
    //     switch(this.color){
    //         case this.dirDist50: 
    //         console.log(dirDist50);
    //         info="is an aiport <b>more than 50</b> direct distinations"
    //         break;
    //         case dirDist10: 
    //         console.log(dirDist10);;
    //         info="is an aiport <b>more than 10</b> direct distinations"
    //         break;
    //         case dirDistLess10: 
    //         console.log(dirDistLess10);;
    //         info="is an aiport <b>less than 10</b> direct distinations"
    //         break;
    //     }
    //     return "<b>"+this.key + "</b>: "+info;
    //   }
    // },

    plotOptions: {
      networkgraph: {
        keys: ['from', 'to'],
        draggable:true,
        findNearestPointBy:"xy",
        lineWidth:3,
        stickyTracking:true,  
        className:'topology',  
        color:'#f00',    
        layoutAlgorithm: {
          //approximation:'none',
          enableSimulation: false,
          friction: -0.9,
          integration: 'euler',
          linkLength: 100
        }
      }
    },

    series: [
      {
        marker: {
          radius: 13
        },

        type: 'networkgraph',
        dataLabels: {
          enabled: true,
          linkFormat: '',
          allowOverlap: true
        },
        data: [
          ['r1','r2'],
          ['r2','r3'],
          ['r2','r1'],
          ['r1','r4'],
          ['r1','r5'],
          ['r1','r6'],
          ['r1','r7'],
          ['r1','r8'],
          ['r1','r9'],
          ['r1','r10'],
          ['r1','r11'],
          ['r1','r12'],
          ['r1','r13'],
          ['r1','r14'],
          ['r3', 'r5'],
          ['r4', 'r5']
        ],
        nodes: [{
          id: 'r1',
          color: this.dirDist50,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r2',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r3',
          color: this.dirDist50,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r4',
          color: this.dirDist10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        },
        {
          id: 'r5',
          color: this.dirDist50,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        },{
          id: 'r6',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r7',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r8',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r9',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r10',
          color: this.dirDist10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r11',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r12',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r13',
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        }, {
          id: 'r14',        
          color: this.dirDistLess10,
          marker: {
            radius: 50,
            symbol: 'url(../../../../../assets/images/wifi.png)',
            width:50,
            height:50
          }
        },]
      }
    ]
  };
  constructor(private authenticationService:AuthService,
    private dataService:DataService,
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private appConfig:AppConfigService,
    public fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserDetails = userData.user_details;
    console.log('----userData', this.loggedInUserDetails);

    this.backUrl = this.appConfig.urlGitConfig;
    this.breadcrumblist.push(
          {'name':'Home','url':this.appConfig.urlHome, 'disabled':false},
          {'name':' GitHub Configuration','url':'', 'disabled':true})
    this.getConfigFilesData();
  }
  getConfigFilesData(){
    this.configFilesLoader = true;
    this.configFilesData = [
      {
          "id": 1,
          "requistId": "req000000123",
          "status": "Success",
          "totalFiles": "13",
          "created_at": "2024-04-25 18:55",
          "created_by": "rafi",
          "valid_till": "2027-05-01",
          "created_by_id": 1
      },
      {
          "id": 2,
          "requistId": "req000000124",
          "status": "Inprogress",
          "totalFiles": "13",
          "created_at": "2024-04-26 03:45",
          "created_by": "rafi",
          "valid_till": "2024-08-21",
          "created_by_id": 1
      },
      {
        "id": 3,
        "requistId": "req000000125",
        "status": "Failed",
        "totalFiles": "13",
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

  showUploadConfigFilesSideBar(){
    this.uploadConfigFilesSidebar = true;
  }

  hideUploadConfigFilesSideBar(){
    this.uploadConfigFilesSidebar = false;
  }

  onUpload(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
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

}
