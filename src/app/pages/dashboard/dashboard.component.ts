import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.widgetsTopSection = [
      {
        title:'Total Devices',
        count:'120'
      },
      {
        title:'Ready to Test Devices',
        count:'20',
      },
      {
        title:'Test Scheduled Devices',
        count:'15',
      },
      // {
      //   title:'Test Failed Devices',
      //   count:'5'
      // },
      
      {
        title:'Test Types',
        count:'7'
      },
      {
        title:'Users',
        count:'10'
      },
      {
        title:'Devices Expire in next 30 days',
        count:'2'
      },
      {
        title:'Categories',
        count:'6'
      },
      {
        title:'Sub Categories',
        count:'20'
      }
    ];

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


  }

}
