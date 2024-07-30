import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

import * as Highcharts from 'highcharts';
import HC_networkgraph from 'highcharts/modules/networkgraph';
HC_networkgraph(Highcharts);

@Component({
  selector: 'app-config-files-details',
  templateUrl: './config-files-details.component.html',
  styleUrls: ['./config-files-details.component.scss']
})
export class ConfigFilesDetailsComponent implements OnInit {

  public breadcrumblist:any[] = []; 
  public backUrl:string = '';
  public hasSubCategory:boolean = false;
  public loggedInUserDetails:any;
  public selectedRequistId:string = '';
  public configFilesList:any[]=[
    {
      'name':'r0.config',
      'status':'success'
    },{
      'name':'r2.config',
      'status':'success'
    },
    {
      'name':'r3.config',
      'status':'success'
    },
    {
      'name':'r4.config',
      'status':'success'
    },
    {
      'name':'r5.config',
      'status':'success'
    },
    {
      'name':'r6.config',
      'status':'success'
    },
    {
      'name':'r7.config',
      'status':'success'
    },
    {
      'name':'r8.config',
      'status':'success'
    },
    {
      'name':'r9.config',
      'status':'success'
    },
    {
      'name':'r10.config',
      'status':'success'
    },
    {
      'name':'r11.config',
      'status':'success'
    },
    {
      'name':'r12.config',
      'status':'success'
    },{
      'name':'r13.config',
      'status':'success'
    },
  ];

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
    private appConfig:AppConfigService,
    public fb: FormBuilder,
    private _aRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    const userData:any = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.loggedInUserDetails = userData.user_details;
    console.log('----userData', this.loggedInUserDetails);

    this.backUrl = this.appConfig.urlConfigFiles;
    this.breadcrumblist.push({'name':'Home', 'url':this.appConfig.urlHome, 'disabled':false}, {'name':'Config Files','url':this.appConfig.urlConfigFiles, 'disabled':false}, {'name':'Config Requist Details','url':'', 'disabled':true});
    this.selectedRequistId = this._aRoute.snapshot.params?.['reqId'];
  }

  onUpload(event:any) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

    //this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }

}
