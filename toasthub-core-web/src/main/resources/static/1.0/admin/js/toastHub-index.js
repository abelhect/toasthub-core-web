/**
 * @author Edward H. Seufert
 * Copyright (C) 2016 The ToastHub Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

toastHubIndex.prototype = Object.create(toastHubBase.prototype);
toastHubIndex.prototype.constructor = toastHubIndex;

function toastHubIndex(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "ADMIN_SVC";
	this.mainContainer = null;
	this.modal = new ToastHubModal();
	this.dashBoard2 = new ToastHubDashBoard2();
	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-index::toastHubIndex::initCustom",params);
		params.appForms = ["ADMIN_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_PAGE"];
		params.appLabels = ["ADMIN_PAGE"];
	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-index::toastHubIndex::initContent",params);
		self.pageNames = params.items;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;

		// create dashboard of user metrics
		var dashboard = new ToastHubDashboard();
		var totalCount = params.itemCount ? null : 0;
		var params2 = {container:self.mainContainer,stats:[{icon:"<i class='fa fa-user'></i>",title:"New Users",count:"23",percent:"<i class='green'><i class='fa fa-sort-asc'></i>50% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-user'></i>",title:"Locked Users",count:"45",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-user'></i>",title:"Purchases",count:"200",percent:"<i class='green'><i class='fa fa-sort-asc'></i>15% </i>",percentTitle:"From last week"},
		                                {icon:"<i class='fa fa-clock-o'></i>",title:"Login Failures",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From last week",count:"30"},
		           						{icon:"<i class='fa fa-clock-o'></i>",title:"Average Time",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"3000"}]};
		dashboard.listStats(params2);
		
		// create panel to hold list
		var row = document.createElement("DIV");
		row.className = "row";
		self.mainContainer.appendChild(row);
		var column = document.createElement("DIV");
		column.className = "col_md_12";
		row.appendChild(column);
		var x_panel = document.createElement("DIV");
		x_panel.className = "x_panel";
		column.appendChild(x_panel);
		
		self.dashBoard2.render({container:x_panel,title:"User activity summary",chartKey:"Registration",
								tiles:[{id:"sg1",title:"Logins",count:"230,000"},{id:"sg2",title:"Failures",count:"30,000"},{id:"sg3",title:"Complaints",count:"2,000"}],
								topItems:[{name:"Joe Smith",msg1:"Sales total: $2300",msg2:"12 Sales Today"},{name:"Zoe Smith",msg1:"Sales total: $4400",msg2:"56 Sales Today"},{name:"Ricky Bobby",msg1:"Sales total: $45300",msg2:"900 Sales Today"}]});
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		//this.processList(params);
	}; // initContent
	
};