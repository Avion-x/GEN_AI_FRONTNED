import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/shared/services/data.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import * as _ from 'lodash';

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

  categoriesChartData: any[] = [];
  view: any[] = [700, 400];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  xAxisLabel: string = 'Country';
  showYAxisLabel: boolean = false;
  yAxisLabel: string = '';
  legendTitle: string = '';

  colorScheme: Color = { 
    domain: ['#5b54bb', '#d9d6ff'], 
    group: ScaleType.Ordinal, 
    selectable: true, 
    name: 'Customer Usage', 
  };

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
      // const categorieNames:any[] = [];
      // const subCategoriesCount:any[] = [];
      // const devicesCount:any[] = [];
      
      categoriesData.forEach(item=>{
        this.categoriesChartData.push({
          "name": item.category_name,
          "series": [
            {
              "name": "Sub Categories",
              "value": item.sub_category_count
            },
            {
              "name": "Devices",
              "value": item.device_count
            }
          ]
        })
        // categorieNames.push(item.category_name);
        // subCategoriesCount.push(item.sub_category_count);
        // devicesCount.push(item.device_count);
      })
      
    //   this.categoryStackedData = {
    //     labels: [...categorieNames],
    //     datasets: [{
    //         type: 'bar',
    //         label: 'Sub Categories',
    //         backgroundColor: '#d9d6ff',
    //         data: [...subCategoriesCount]
    //     }, {
    //         type: 'bar',
    //         label: 'Devices',
    //         backgroundColor: '#5b54bb',
    //         data: [...devicesCount]
    //     }]
    // };
    })
  }

  onCategoryChartBarSelect(data:any): void {
    const selectedBarData:any = JSON.parse(JSON.stringify(data))
    console.log('Item clicked', selectedBarData);
    this.selectedWidget = "Categories & Device Count Chart Details",
    this.getProducts(selectedBarData.series);
  }

  getProducts(selecedBar:string) {
    this.cols = [];
    this.showSidebar = true;
    this.widgetDetailsLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      // params: {
      //   product_category: 3
      // }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      //this.productsData = result.data;
      // this.productsLoader = false;
     // console.log('Product List', result.data);
      const responceData:any[] = result.data;
      const filtered_array = _.filter(responceData, { 'main_category_name': selecedBar });
      //console.log('filtered_array', filtered_array);
      const colArr:any[] = [
        {field:'product_code', header:'Device Name'},
        {field:'main_category_name', header:'Category Name'},
        {field:'sub_category_name', header:'Sub Category Name'},
        {field:'status', header:'Status'},
        {field:'valid_till', header:'Valid Till'},
        {field:'created_at', header:'Created At'},
        {field:'last_updated_at', header:'Last Updated At'},
        {field:'last_updated_by_name', header:'Last Updated By'},
      ];
      const keysArr:any[] = [];
      colArr.forEach(item=>{
        keysArr.push(item.field)
      })
      // Object.keys(responceData[0]).forEach(key=>{
      //   if(key !== 'id' && key !== 'product_id'){
      //       colArr.push({ field: key, header:key.replace('_', ' ')});
      //       keysArr.push(key);
      //   }        
      // })
      this.tableSearchKeys = keysArr;
      this.cols = colArr;
      //console.log('tableSearchKeys', this.tableSearchKeys);
      this.moreDetailsTableData = filtered_array;
      this.widgetDetailsLoader = false;
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
