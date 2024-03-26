import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  widgetsTopSection:any[] = [];
  basicData: any;
  basicOptions: any;

  todaysTestData:any;
  approvedChartData:any;
  approvedChartOptions:any;
  widgetsLoader:boolean = false;
  public showSidebar:boolean = false;
  public categoryStackedData:any;
  public categoryStackedOptions:any;
  public moreDetailsTableData:any[] =[];
  public selectedWidget:string = '';
  public widgetDetailsLoader:boolean = false;
  public cols: any[] = [];
  public tableSearchKeys:any[] = [];

  constructor(private dataService:DataService) { }

  ngOnInit(): void {
    this.getWidgets();
    this.getCategoryDetails();
    // this.widgetsTopSection = [
    //   {
    //     title:'Total Devices',
    //     count:'120'
    //   },
    //   {
    //     title:'Ready to Test Devices',
    //     count:'20',
    //   },
    //   {
    //     title:'Test Scheduled Devices',
    //     count:'15',
    //   },
    //   // {
    //   //   title:'Test Failed Devices',
    //   //   count:'5'
    //   // },
      
    //   {
    //     title:'Test Types',
    //     count:'7'
    //   },
    //   {
    //     title:'Users',
    //     count:'10'
    //   },
    //   {
    //     title:'Devices Expire in next 30 days',
    //     count:'2'
    //   },
    //   {
    //     title:'Categories',
    //     count:'6'
    //   },
    //   {
    //     title:'Sub Categories',
    //     count:'20'
    //   }
    // ];

    this.todaysTestData = {
      labels: ['Unit', 'Regression', 'integration', 'Functional', 'System', 'Performance', 'User Acceptance',],
      datasets: [
          {
              label: 'Success Devices',
              backgroundColor: '#5b54bb',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Failed Devices',
              backgroundColor: '#d9d6ff',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
    }

    this.approvedChartData = {
      labels: ['Approved','Waiting for Approval'],
      datasets: [
          {
              data: [60, 40],
              backgroundColor: [
                  "#5b54bb",
                  "#d9d6ff",
              ],
              hoverBackgroundColor: [
                  "#5b54bb",
                  "#d9d6ff",
              ]
          }
      ]
  };

  this.approvedChartOptions = {
    plugins: {
        legend: {
            labels: {
               // color: '#ddd'
            }
        }
    }
}

    this.basicData = {
      labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      datasets: [
          {
              label: 'Success Devices',
              backgroundColor: '#FFC12B',
              data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
              label: 'Failed Devices',
              backgroundColor: '#F5A626',
              data: [28, 48, 40, 19, 86, 27, 90]
          }
      ]
    };

    this.basicOptions = {
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
    };


    this.categoryStackedOptions = {
        tooltips: {
            mode: 'index',
            intersect: false
        },
        responsive: true,
        scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true
            }]
        }
    };
  }

  getWidgets(){
    this.widgetsLoader = true;
    const getProductCategory = {
      action: 'product/dashboard_kpi/',
      method: 'get',
      // params: {
      //   unixid: this.userLogged
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //this.productCategoryData = result;
      this.widgetsTopSection = result.data;
      this.widgetsLoader = false;
      //console.log('this.productCategoryData', this.productCategoryData);
    })
  }

  getCategoryDetails(){
    //this.widgetsLoader = true;
    const getCategoryDetails = {
      action: 'product/category_details/',
      method: 'get',
      // params: {
      //   unixid: this.userLogged
      // }
    }
    this.dataService.apiDelegate(getCategoryDetails).subscribe((result: any) => {
      //this.productCategoryData = result;
      //this.widgetsTopSection = result.data;
      //this.widgetsLoader = false;
      console.log('getCategoryDetails', result.data);
      const categoriesData:any[] = result.data;
      const categorieNames:any[] = [];
      const subCategoriesCount:any[] = [];
      const devicesCount:any[] = [];
      categoriesData.forEach(item=>{
        categorieNames.push(item.category_name);
        subCategoriesCount.push(item.sub_category_count);
        devicesCount.push(item.device_count);
      })
      this.categoryStackedData = {
        labels: [...categorieNames],
        datasets: [{
            type: 'bar',
            label: 'Sub Categories',
            backgroundColor: '#d9d6ff',
            data: [...subCategoriesCount]
        }, {
            type: 'bar',
            label: 'Devices',
            backgroundColor: '#5b54bb',
            data: [...devicesCount]
        }]
    };
    })
  }

  showWidgetDetails(selectedWidget:any){
    console.log('selectedWidget', selectedWidget);
    if(selectedWidget.value == 0){
        return
    }
    this.selectedWidget = selectedWidget.title;
    this.getMoreDetails(selectedWidget.chart_data_point);
  }

  getMoreDetails(seletedWidgets:any){
    this.showSidebar = true;
    this.widgetDetailsLoader = true;
    const getProductCategory = {
      action: 'product/dashboard_chart/',
      method: 'get',
      params: {
        chart_data_point: seletedWidgets
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //this.productCategoryData = result;
      
      const responceData:any[] = result.data;
      const colArr:any[] = [];
      const keysArr:any[] = [];
      Object.keys(responceData[0]).forEach(key=>{
        if(key !== 'id' && key !== 'product_id'){
            colArr.push({ field: key, header:key.replace('_', ' ')});
            keysArr.push(key);
        }        
      })
    //   responceData.forEach((obj) => {
    //     Object.entries(obj).forEach(([key, value]) => {
    //      colArr.push({ field: key, header: key });
    //       //console.log(`${key} ${value}`);
    //     });
    //   });
      this.tableSearchKeys = keysArr;
      this.cols = colArr;
      console.log('tableSearchKeys', this.tableSearchKeys);
      this.moreDetailsTableData = responceData;
      this.widgetDetailsLoader = false;
    })
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

}
