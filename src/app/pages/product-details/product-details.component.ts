import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { MarkdownService } from 'ngx-markdown';
import { AppConfigService } from 'src/app/shared/services/app-config.service';
import * as _ from 'lodash';

import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  providers: [MessageService]
})
export class ProductDetailsComponent implements OnInit {
  public selectedProduct:string = '';
  public productsLoader:boolean = false;
  public productData:any = {};
  public breadcrumblist:any[] = [];
  public productMainCategory:any;
  public productSubCategory:any;
  public testCasesData:string = '';
  public testScriptsData:string = '';
  public successResponcePopup:boolean=false;
  public generateTestCaseResponceData:string = '';

  public selectedTestTypeId:string = '';
  

  public productSubCategoryId:string='';

  public generateTestcasesLoader:boolean = false;
  public loadingTestCases:boolean = false;

  public testCasesLoader:boolean = false;

  public latestTestCases:any[] = [];
  public selectedTestCase:any;

  public selectedTestType:any;
  public selectedTestTypes: any[] = [];
  public selectedTestTypeCategories:any[] = [];
  public testTypes: any[] = [];
  public productTestTypes:any[] = [];
  public testCategoriesOfSelectedTestType:any[] = [];

  public productName:string='Product Details';
  public backUrl:string = '';

  public generateTestCasesFormSidebar:boolean = false;

  public testCategorys:any[]=[];
  public generatedTestCases:any;

  public mainCategoryLoader:boolean = false;
  public subCategoryLoader:boolean = false;

  public currentUser:any;

  public showGenerateTestCase:boolean = false;

  public testCaseCategoryLoader:boolean = false;
  public testCategoriesListLoader:boolean = false;

  public testCases:string= "\n\n# Regression Test Cases for Network Router MX480\n\n## Test Case 1: Power On Self Test\n### Description\nVerify that the router successfully completes the Power On Self Test (POST) without any errors.\n\n### Steps\n1. Power on the router.\n2. Observe the LED indicators for any abnormal behavior.\n3. Check the console output for any error messages during boot-up.\n\n### Expected Result\nThe router completes the POST without any errors and boots up successfully.\n\n## Test Case 2: Port Configuration\n### Description\nVerify that all ports on the router are configured correctly and are operational.\n\n### Steps\n1. Connect a device to each port on the router.\n2. Verify that the ports are active and able to transmit and receive data.\n3. Check the port configuration settings.\n\n### Expected Result\nAll ports should be operational and able to transmit/receive data without any issues.\n\n## Test Case 3: Routing and Switching Functionality\n### Description\nVerify that the router is able to perform routing and switching functions as expected.\n\n### Steps\n1. Configure multiple VLANs and assign them to different ports.\n2. Set up routing between the VLANs.\n3. Send packets between different VLANs and verify proper routing and switching behavior.\n\n### Expected Result\nThe router should successfully route packets between VLANs and perform switching functions without any errors.\n\n## Test Case 4: Quality of Service (QoS) Configuration\n### Description\nVerify that the router is able to prioritize network traffic using Quality of Service (QoS) settings.\n\n### Steps\n1. Configure QoS settings for specific types of network traffic.\n2. Generate network traffic that matches the configured QoS settings.\n3. Monitor the traffic to ensure that QoS prioritization is working as expected.\n\n### Expected Result\nThe router should prioritize network traffic according to the configured QoS settings.\n\n```python\n# Example QoS Configuration\nclass-of-service {\n    interfaces {\n        ge-0/0/0 {\n            shaping-rate 100m;\n            scheduler-map out-scheduler;\n        }\n        ge-0/0/1 {\n            shaping-rate 50m;\n            scheduler-map out-scheduler;\n        }\n    }\n    schedulers {\n        out-scheduler {\n            transmit-rate 1m;\n            priority low;\n        }\n    }\n}\n```\n\n## Test Case 5: High Availability and Failover\n### Description\nVerify that the router is able to maintain high availability and perform failover in case of hardware or network issues.\n\n### Steps\n1. Simulate a hardware or network failure on one of the redundant components (e.g., power supply, routing engine).\n2. Monitor the router's behavior during the failure to observe failover mechanisms.\n3. Restore the failed component and ensure that the router returns to normal operation.\n\n### Expected Result\nThe router should demonstrate resilience to hardware or network failures and be able to perform failover seamlessly.\n\nThese regression test cases cover a range of essential functionalities and aspects to ensure the reliability and performance of the Network Router MX480.\n\n# Regression Test for MX480\n\n## Test Case 1: Interface Connectivity\n\n### Setup\n1. Connect the MX480 to the testing environment.\n2. Power on the MX480 and wait for the system to initialize.\n\n### Execution\n1. Log in to the MX480 console and check the status of all interfaces using the \"show interfaces\" command.\n2. Verify that all interfaces are up and there are no errors or drops.\n\n### Verification\n- All interfaces should be in the \"up\" state.\n- There should be no errors or drops reported for any interface.\n\n### Teardown\n1. Power off the MX480.\n2. Disconnect the MX480 from the testing environment.\n\n## Test Case 2: Routing Functionality\n\n### Setup\n1. Connect the MX480 to a network with multiple connected devices.\n2. Power on the MX480 and wait for the system to initialize.\n\n### Execution\n1. Configure routing protocols (e.g. OSPF, BGP) on the MX480.\n2. Verify that the MX480 can successfully route traffic between the connected devices.\n\n### Verification\n- All connected devices should be able to communicate with each other through the MX480.\n- Routing tables should be populated with the correct routes.\n\n### Teardown\n1. Power off the MX480.\n2. Disconnect the MX480 from the network.\n\n## Test Case 3: High Availability\n\n### Setup\n1. Configure a redundant setup with two MX480 routers in a high availability (redundancy) configuration.\n2. Power on both MX480 routers and ensure they synchronize their configurations.\n\n### Execution\n1. Simulate a failure on one of the MX480 routers (e.g. power off one of the routers).\n2. Verify that the other MX480 router takes over the traffic seamlessly without any interruption.\n\n### Verification\n- There should be no loss of connectivity when one MX480 router fails.\n- The active and standby status of the routers should switch appropriately.\n\n### Teardown\n1. Power off both MX480 routers.\n2. Disconnect the MX480 routers from the redundant setup.\n\n```python\n# Sample Python code to simulate router failure\nimport os\n\ndef simulate_router_failure(router_ip):\n    os.system(f\"ssh admin@{router_ip} power-off\")\n```\n\n## Python Regression Test for MX480\n\n### Background\nWe are performing a Python regression test for the MX480. The purpose of this test is to identify and address any potential issues that may have been introduced as a result of recent changes to the codebase.\n\n### Test Data\nWe obtained the following data for the regression test:\n\n```python\n# Import necessary libraries\nimport pandas as pd\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error\n\n# Load the dataset\ndata = pd.read_csv('mx480_regression_data.csv')\n\n# Split the data into features and target variable\nX = data[['feature1', 'feature2', 'feature3']]\ny = data['target']\n\n# Split the data into training and testing sets\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Fit the linear regression model\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Make predictions\ny_pred = model.predict(X_test)\n\n# Evaluate the model\nmse = mean_squared_error(y_test, y_pred)\nprint(f'Mean Squared Error: {mse}')\n```\n\n### Expected Output\nUpon running the regression test, we expect to see the following output:\n\n```\nMean Squared Error: 0.034\n```\n\n### Conclusion\nBased on the output from the regression test, the mean squared error for the MX480 is within an acceptable range. This indicates that the recent changes to the codebase have not introduced any significant regression issues.\n\n## MX480 Router Configuration Regression Test\n\n### Objective:\nThe objective of this regression test is to verify the configuration settings on the MX480 router to ensure it is functioning as expected after any recent changes or updates.\n\n### Test Setup:\n- MX480 router with the latest software update\n- Test environment with similar network configurations\n- Access to the router's CLI for verification and testing\n\n### Test Steps:\n1. **Verify Interface Configuration:**\n    ```bash\n    show interfaces terse\n    ```\n    The output should display the list of interfaces with their configured settings and status. Ensure the interfaces are properly configured and are in an operational state.\n\n2. **Check Routing Table:**\n    ```bash\n    show route\n    ```\n    Verify the routing table to ensure it has the correct routes and next hops for reaching different networks. \n\n3. **Inspect Firewall Policies:**\n    ```bash\n    show configuration security policy\n    ```\n    Check the firewall policies to ensure they are configured correctly and are actively enforcing the desired security rules.\n\n4. **Validate BGP Configuration:**\n    ```bash\n    show configuration protocols bgp\n    ```\n    Verify the BGP configuration to ensure peers, neighbors, and route advertisements are correctly configured.\n\n5. **Review System Logging:**\n    ```bash\n    show system syslog\n    ```\n    Check the system logging to verify that it is capturing relevant events and errors.\n\n### Expected Results:\n- All configured interfaces should be up and operational\n- The routing table should contain the expected routes\n- Firewall policies should be correctly enforced\n- BGP peers and route advertisements should be properly configured\n- System logging should be capturing relevant events without errors\n\n### Conclusion:\nAfter running the regression test and reviewing the output, the MX480 router's configuration has been verified and is functioning as expected. Any discrepancies or issues found will be investigated and resolved accordingly.";
  public testScripts:string= "\n\nCertainly! Here's an example of a Python script for a simple linear regression test and the corresponding data in markdown format:\n\nPython Script (linear_regression_test.py):\n```python\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression\n\n# Sample data\nX = np.array([[1], [2], [3], [4]])\ny = np.array([3, 5, 7, 9])\n\n# Create and fit the model\nmodel = LinearRegression()\nmodel.fit(X, y)\n\n# Print the coefficients\nprint(\"Slope:\", model.coef_[0])\nprint(\"Intercept:\", model.intercept_)\n```\n\nMarkdown Formatted Data:\n```markdown\n# Linear Regression Test\n\n## Introduction\nThis test involves fitting a simple linear regression model to a small dataset to demonstrate the principles of linear regression.\n\n## Dataset\nWe have a dataset consisting of two variables, X and y, where X represents the independent variable and y represents the dependent variable.\n```python\nX = np.array([[1], [2], [3], [4]])\ny = np.array([3, 5, 7, 9])\n```\n\n## Model Fitting\nWe use the `LinearRegression` model from the `sklearn` library to fit the model to the data.\n\n## Model Coefficients\nAfter fitting the model, we print the coefficients:\n```python\nSlope: 2.0\nIntercept: 1.0\n```\n```\n\nThis markdown data can be used to create a clear and organized documentation for the regression test in a tool like ChatGPT."
   
  public unitTestCategories:any[] = [
    {'category':'Bootup process', 'generated':true},
    {'category':'Routing protocols', 'generated':true},
    {'category':'Firewall filters', 'generated':true},
    {'category':'NAT configuration', 'generated':false},
    {'category':'VPN configuration', 'generated':false},
    {'category':'Access control lists', 'generated':false},
    {'category':'QoS configuration', 'generated':false},
    {'category':'Interface configuration', 'generated':false},
    {'category':'VLAN configuration', 'generated':false},
    {'category':'Static routes', 'generated':false},
    {'category':'Policy configuration', 'generated':false},
    {'category':'SNMP configuration', 'generated':false},
  ]

  constructor(
    private authenticationService:AuthService, 
    private dataService:DataService, 
    private _router: Router, 
    private _aRoute: ActivatedRoute,
    private mdService:MarkdownService,
    private appConfig:AppConfigService,
    private messageService: MessageService
    ) { 
      this.currentUser = {};
      this.authenticationService.user.subscribe((user:any) => this.currentUser = user.user_details);
      if (this.currentUser.role_name === 'user'){
        this.showGenerateTestCase = false;
      } else {
        this.showGenerateTestCase = true;
      }
    }

  ngOnInit(): void {
    //this.selectedCategories = this.categories.slice(1,3);
    this.selectedProduct = this._aRoute.snapshot.params?.['productID'];
    const productMainCategoryId = this._aRoute.snapshot.params?.['mainID'];
    this.productSubCategoryId = this._aRoute.snapshot.params?.['subID'];
    if(this.selectedProduct){
      this.getProductDetails(this.selectedProduct);
      //this.getAllGeneratedTestCases(this.selectedProduct);
    }
    
    if(this.productSubCategoryId){
      this.getSubCategoryDetails(this.productSubCategoryId);
    }
    this.getTestTypes();
   // this.testCasesData = "\n\n# Regression Test Cases for Network MSeries Router MX480\n\n## Test Case 1: Interface Configuration\n### Description\nVerify that interface configurations are applied correctly on the MX480 router.\n\n### Test Steps\n1. Verify the ability to configure physical and logical interfaces.\n2. Verify the ability to assign IP addresses to interfaces.\n3. Verify the ability to enable and disable interfaces.\n\n### Expected Results\n- All interface configurations should be successfully applied.\n- IP addresses should be successfully assigned to interfaces.\n- Interfaces should be able to be enabled and disabled as expected.\n\n## Test Case 2: Routing Protocols\n### Description\nEnsure that routing protocols function correctly on the MX480 router.\n\n### Test Steps\n1. Verify the ability to configure routing protocols such as OSPF, BGP, and RIP.\n2. Verify the ability to establish neighbor relationships and exchange routing information.\n3. Verify the ability to manipulate routing tables through the chosen routing protocol.\n\n### Expected Results\n- Routing protocols should be successfully configured and functioning.\n- Neighbor relationships should be established, and routing information should be exchanged.\n- Routing tables should be updated and manipulated as expected.\n\n## Test Case 3: High Availability\n### Description\nCheck the high availability features of the MX480 router.\n\n### Test Steps\n1. Verify the ability to configure redundancy features such as graceful Routing Engine switchover (GRES) and non-stop routing (NSR).\n2. Simulate failure scenarios and ensure failover mechanisms are triggered as expected.\n3. Verify the ability to perform software upgrades without disrupting packet forwarding.\n\n### Expected Results\n- Redundancy features should be successfully configured and functioning.\n- Failover mechanisms should be triggered in case of failure scenarios.\n- Software upgrades should be performed without disrupting packet forwarding.\n\n## Test Case 4: Security Features\n### Description\nEnsure that security features are effectively implemented on the MX480 router.\n\n### Test Steps\n1. Verify the ability to configure firewall filters and security policies.\n2. Test traffic filtering and ensure that only allowed traffic is permitted.\n3. Verify the ability to implement and manage VPNs.\n\n### Expected Results\n- Firewall filters and security policies should be successfully configured and applied.\n- Traffic filtering should only permit allowed traffic as per the defined policies.\n- VPN configurations should be effective and manageable.\n\n```markdown\nSample code snippet:\n\n...\nset interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24\nset interfaces ge-0/0/1 unit 0 family inet address 192.168.2.1/24\n...\n```\n\n## Test Case 1: Interface Configuration\n### Setup\n1. Connect to MX480 via console or SSH.\n2. Enter configuration mode.\n\n### Execution\n```bash\nset interfaces ge-0/0/0 unit 0 description \"Test Interface\"\nset interfaces ge-0/0/0 unit 0 family inet address 192.168.1.1/24\ncommit\n```\n\n### Verification\n```bash\nshow interfaces ge-0/0/0\n```\nOutput:\n```\nPhysical interface: ge-0/0/0, Enabled, Physical link is Up\n  Description: Test Interface\n  ...\n  ...\n```\n\n### Teardown\n1. Delete the configured interface.\n2. Commit the changes.\n\n## Test Case 2: Routing Configuration\n### Setup\n1. Connect to MX480 via console or SSH.\n2. Enter configuration mode.\n\n### Execution\n```bash\nset routing-options static route 10.0.0.0/24 next-hop 192.168.1.2\ncommit\n```\n\n### Verification\n```bash\nshow route 10.0.0.0/24\n```\nOutput:\n```\ninet.0: 10 destinations, 10 routes (10 active, 0 holddown, 0 hidden)\n+ = Active Route, - = Last Active, * = Both\n\n10.0.0.0/24       *[Static/5] 00:01:23\n                    > to 192.168.1.2 via ge-0/0/0.0\n```\n\n### Teardown\n1. Delete the configured route.\n2. Commit the changes.\n\n# MX480 Regression Test\n\n## Overview\nThe MX480 regression test is a Python script designed to validate the performance and stability of the MX480 router. The test consists of various regression scenarios to ensure that the router is functioning as expected.\n\n## Setup\nBefore running the regression test, make sure that the MX480 router is properly connected and configured. Additionally, ensure that the Python libraries required for the test are installed.\n\n```python\n# Install required Python packages\npip install paramiko\npip install pyserial\n```\n\n## Test Scenarios\nThe regression test covers the following scenarios:\n1. Interface connectivity\n2. Routing table consistency\n3. Service availability\n4. Traffic throughput\n\n## Test Execution\nTo run the regression test, execute the following Python script:\n\n```python\npython mx480_regression_test.py\n```\n\n## Test Results\nUpon completion of the test, the script will provide detailed results for each scenario. Any failures or issues will be reported along with relevant diagnostic information.\n\n## Conclusion\nThe MX480 regression test is essential for ensuring the reliability and performance of the MX480 router. By validating various scenarios, we can confidently deploy the router in production environments.\n\n# MX480 Router Regression Test\n\n## Overview\nThe regression test will be conducted to verify the configuration of the MX480 router. This test will ensure that the router operates according to the specified configurations and does not introduce any unexpected behavior that may affect its functionality.\n\n## Test Environment\n- **Device:** MX480 Router\n- **Software Version:** Junos OS 18.3R1\n- **Test Setup:** The router is connected to a test network with specific traffic patterns\n\n## Test Procedure\n1. **Preparation:** Backup the current configuration of the router and save it for reference.\n2. **Test Configuration:** Apply the test configurations to the router, including routing protocols, interface settings, and security policies.\n3. **Traffic Generation:** Generate synthetic traffic to simulate the expected traffic patterns on the network.\n4. **Observation:** Monitor the router's performance and behavior during the traffic generation to identify any deviations from the expected behavior.\n5. **Verification:** Compare the observed behavior with the expected behavior based on the configured settings.\n\n## Test Scenarios\n### Scenario 1: Routing Protocols\n- **Description:** Test the functionality of OSPF and BGP routing protocols.\n- **Expected Outcome:** The router should successfully establish neighbor relationships and exchange routing information with neighboring routers.\n\n```bash\nshow ospf neighbor\nshow bgp summary\n```\n\n### Scenario 2: Interface Configurations\n- **Description:** Verify the configuration of interfaces, including VLAN assignments and link settings.\n- **Expected Outcome:** All interfaces should be properly configured and operational.\n\n```bash\nshow interfaces\n```\n\n### Scenario 3: Security Policies\n- **Description:** Validate the application of security policies, including firewall rules and traffic filtering.\n- **Expected Outcome:** The router should correctly enforce the defined security policies without impacting legitimate traffic.\n\n```bash\nshow security policies\n```\n\n## Test Results\nThe test results indicate that the MX480 router successfully passed all test scenarios, demonstrating that the configured settings are functioning as expected without any deviations or unexpected behavior observed."
    //this.testCasesData = this.mdService.parse(testCasesDataRaw);
    //this.testCasesData = this.testCases;
    //this.testScriptsData = this.testScripts;
  }

  getProductDetails(productID:any) {
    this.productsLoader = true;
    const getProductCategory = {
      action: 'product/product/',
      method: 'get',
      params: {
        id: productID
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      console.log('getProductCategory result', result);
      if(!_.isEmpty(result.data)){
        this.productData = result.data[0];
        this.productTestTypes = result.data[0]?.test_types;
       // this.breadcrumblist = [];
        //this.breadcrumblist.push({'name':'home', 'disabled':false}, {'name':'Product Categories', 'disabled':true}, {'name':'Product Sub Categories', 'disabled':true}, {'name':'Products List', 'disabled':true}, {'name':this.productData.product_code, 'disabled':true});
        this.productName = this.productData.product_code;
        
        if(!_.isEmpty(this.productTestTypes)){
          console.log('this.productTestTypes[0]', this.productTestTypes[0]?.test_type_id);
          this.getGeneratedTestCategories(this.productTestTypes[0], productID);
        }
        
        console.log('Product Data', this.productData);
      } 
      this.productsLoader = false;
      const productMainCategoryId = this._aRoute.snapshot.params?.['mainID'];
      if(productMainCategoryId && this.productName){
        this.getMainCategoryDetails(productMainCategoryId);
      }
    })
  }

  getMainCategoryDetails(productId:any){
    this.mainCategoryLoader = true;
    const getProductCategory = {
      action: 'product/productcategory/',
      method: 'get',
      params: {
        id: productId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      if(!_.isEmpty(result)){
        this.productMainCategory = result[0];      
        const mainCategoryName = this.productMainCategory.category + '-' + this.productMainCategory.id;
        const productsListUrl = this.appConfig.urlProductCategory + '/' + this.productMainCategory.id + '/' + this.productSubCategoryId +'/products'
        this.backUrl = this.appConfig.urlTestCaseManagement;
        this.breadcrumblist.push(
          {'name':'Home','url':this.appConfig.urlHome, 'disabled':false}, 
          {'name':'Test Generation','url':'', 'disabled':true},
          {'name':'Product Categories','url':this.appConfig.urlProductCategory, 'disabled':false}, 
          {'name':mainCategoryName, 'url':this.appConfig.urlProductCategory + '/' + this.productMainCategory.id, 'disabled':false}, 
          {'name':this.productSubCategory.sub_category, 'url':this.appConfig.urlProductCategory + '/' + this.productMainCategory.id, 'disabled':false}, 
          {'name':'Products List', 'url':productsListUrl, 'disabled':false}, 
          {'name':this.productName, 'disabled':true});
        console.log('productMainCategory', this.productMainCategory);
      }      
      this.mainCategoryLoader = false;
    }, error =>{
      console.log('error', error);
      this.mainCategoryLoader = false;
    })
  }

  getSubCategoryDetails(productId:any){
    this.subCategoryLoader= true;
    const getProductCategory = {
      action: 'product/productsubcategory/',
      method: 'get',
      params: {
        id: productId
      }
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      if(!_.isEmpty(result)){
        this.productSubCategory = result.data[0];      
        console.log('productSubCategory', this.productSubCategory);
      }      
      this.subCategoryLoader = false;
    }, error =>{
      console.log('error', error);
      this.subCategoryLoader = false;
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
      if(!_.isEmpty(result)) {
        this.testTypes = [...result.data]; 
        // testCases.forEach((item:any) => {
        //   this.testTypes.push(item.code)
        // });
        console.log('testTypes', this.testTypes);
        
      }      
    }, error => {      
      console.log('error',error);
    })
  }

  showTestCategories(selectedTestType:any){
    this.selectedTestType = selectedTestType;
    this.testCategoriesOfSelectedTestType = [];
    console.log('selectedTestType', selectedTestType);
    console.log('selectedTestTypes Values', this.selectedTestTypes);
    
    this.getTestCategoriedList(selectedTestType.id);
  }

  getTestCategoriedList(testTypeId:string){
    this.testCategoriesListLoader = true;
    const getTestCategories = {
      action: 'product/test_categories/',
      method: 'get',
      params: {
        test_type_id : testTypeId
      }
    }
    this.dataService.apiDelegate(getTestCategories).subscribe((result: any) => {
      //const testCases = result.data; 
      const filteredData:any = _.filter(this.testTypes, {id:this.selectedTestType.id});
      console.log('filteredData', filteredData);
      console.log('result', result);
      if(!_.isEmpty(result)) {
        this.testCategoriesOfSelectedTestType = result.data; 
        // testCases.forEach((item:any) => {
        //   this.testTypes.push(item.code)
        // });
        filteredData.push({'testCategories':this.testCategoriesOfSelectedTestType});
        console.log('testCategoriesOfSelectedTestType', this.testCategoriesOfSelectedTestType);
      }      
      console.log('---------this.testTypes', this.testTypes);
      this.testCategoriesListLoader = false;
    }, error => {  
      this.testCategoriesListLoader = false;    
      console.log('error',error);
    })
  }

  getAllGeneratedTestCases(productId:any) {
    this.loadingTestCases = true;
    const getAllTestCases = {
      action: 'product/test_cases/',
      method: 'get',
      params: {
        ordering: '-id'
      }
    }
    this.dataService.apiDelegate(getAllTestCases).subscribe((result: any) => {
      //this.productCategoryData = result;
      //this.productsLoader = false;
      
      //const latestTestCase = result.data[result.data.length - 2];
      //console.log('GeneratedTestCases new test case', latestTestCase);
      console.log('GeneratedTestCases', result);
      if(!_.isEmpty(result?.data)){        
      console.log('GeneratedTestCases length', result.data.length);   
      this.latestTestCases.push(result.data[result.data.length - 2], result.data[result.data.length - 1]);
      console.log('this.latestTestCases', this.latestTestCases);  
       // this.getTestCategories(this.latestTestCases[0]);
      }
    }, error => {
      this.loadingTestCases = false;
      console.log('error',error);
    })
  }

  showSelectedCategories(){
    console.log('selectedTestTypeCategories', this.selectedTestTypeCategories);
  }


  getGeneratedTestCategories(selectedTestCase:any, productId:any) {
    this.selectedTestCase = {}
    this.selectedTestCase = selectedTestCase
    console.log('this.selectedTestCase', this.selectedTestCase);
    this.selectedTestTypeId = this.selectedTestCase.test_type_id;
    this.testCategorys = [];
    //console.log('selectedRequist',this.selectedTestCase.requist);
      const testCategories = {
        action: 'product/structured_test_cases_and_scripts/',
        method: 'get',
        params: {
          test_type_id: this.selectedTestCase.test_type_id,
          product_id: productId
        }
      }
      this.dataService.apiDelegate(testCategories).subscribe((responce: any) => {
        //this.productCategoryData = result;
        //this.productsLoader = false;  
        if(!_.isEmpty(responce?.data[0])){
          this.testCategorys = responce.data[0].categories;
          console.log('---------------------test Categorys', this.testCategorys);
          this.getTestCasesOfCategory(productId, this.selectedTestCase.test_type_id, this.testCategorys[0].test_category_id);
        } 
      }, error => {
        this.loadingTestCases = false;
        console.log('error',error);
      })
  }

  getTestCasesOfCategory(productId:any, selectedTestCase:any, test_category_id:any){
    this.testCaseCategoryLoader = true;
    this.generatedTestCases = {};
    const testCategories = {
      action: 'product/structured_test_cases_and_scripts/',
      method: 'get',
      params: {
        product_id: productId,
        test_type_id: selectedTestCase,
        test_category_id:test_category_id
      }
    }
    this.dataService.apiDelegate(testCategories).subscribe((responce: any) => {
      //this.productCategoryData = result;
      //this.productsLoader = false;
      // this.testCategorys = responce.data
      // if(this.testCategorys){
      //   //this.getFileChanges(responce[0], sha);
      // }      
      if(!_.isEmpty(responce)){
          this.generatedTestCases = responce.data
          console.log('test Case of category', this.generatedTestCases);
      }
      this.testCaseCategoryLoader = false;      
    }, error => {
      this.testCaseCategoryLoader = false;
      console.log('error',error);
    })
  }

  // getFiles(sha:string) {
  //   const getFiles = {
  //     action: 'product/files_in_commit/',
  //     method: 'get',
  //     params: {
  //       sha: sha
  //     }
  //   }
  //   this.dataService.apiDelegate(getFiles).subscribe((responce: any) => {
  //     //this.productCategoryData = result;
  //     //this.productsLoader = false;
  //     if(responce){
  //       this.getFileChanges(responce[0], sha);
  //     }
  //     console.log('files list', responce);
      
  //   }, error => {
  //     this.loadingTestCases = false;
  //     console.log('error',error);
  //   })
  // }

  // getFileChanges(filename:string, sha:string) {
  //   const getFiles = {
  //     action: 'product/file_changes/',
  //     method: 'get',
  //     params: {
  //       file_name:filename,
  //       sha: sha
  //     }
  //   }
  //   this.dataService.apiDelegate(getFiles).subscribe((responce: any) => {
  //     //this.productCategoryData = result;
  //     //this.productsLoader = false;
  //     this.loadingTestCases = false;
  //     console.log('file changes', responce);
  //     this.testCasesData = responce.data;
      
  //   }, error => {
  //     this.loadingTestCases = false;
  //     console.log('error',error);
  //   })
  // }

  


  generateTestCases(){
    console.log('selectedTestTypes', this.selectedTestTypes);
    console.log('selectedTestTypeCategories', this.selectedTestTypeCategories);
    
    this.generateTestcasesLoader = true;
    const testTypesData:any[] = [
      {
       "test_type_id":this.selectedTestTypes,
       "test_category_ids":this.selectedTestTypeCategories
      }
    ];
    // this.selectedTestTypes.forEach((item:any) => {
    //   testTypesData.push(item.id)
    // });
    const productData:any = {
      'device_id': this.productData.id,
      'test_type_data':testTypesData,
      'ai_model':'anthropic.claude-v2'
    }
    const getProductCategory = {
      action: 'product/generate_test_cases/',
      method: 'post',
      data: productData
    }
    this.dataService.apiDelegate(getProductCategory).subscribe((result: any) => {
      this.generateTestcasesLoader = false;
      console.log('result', result);
      if(!_.isEmpty(result)){
        this.generateTestCasesFormSidebar = false;
        this.successResponcePopup = true;
        this.generateTestCaseResponceData = result.response.Message;
        // this.testCasesData = responceData.TestCases;        
      }     
      //this.testScriptsData = responceData.TestScripts;
    });
  }

  afterSuccess(){
    this.successResponcePopup = false;    
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Test Case Generation has submitted successfully!'});
  }

  showGenerateTestCasesSection(){
    //console.log('-----')
    this.generateTestCasesFormSidebar = true;
  }

  closeGenerateTestCasesSection(){
    this.generateTestCasesFormSidebar = false;
  }

  

}
