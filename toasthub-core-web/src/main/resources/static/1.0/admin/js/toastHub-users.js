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

toastHubUsers.prototype = Object.create(toastHubBase.prototype);
toastHubUsers.prototype.constructor = toastHubUsers;

function toastHubUsers(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "USERS_SVC";
	this.pageMetaName = "ADMIN_USERS";
	this.contentArea = null;
	this.formArea = null;
	this.subMenuArea = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	this.table = new ToastHubTable();
	this.tab = new ToastHubTab();
	this.modal = new ToastHubModal();
	this.selectedUser = null;
	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::initCustom",params);
		params.appForms = ["ADMIN_USER_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_USER_PAGE"];
		params.appLabels = ["ADMIN_USER_PAGE"];
	}; // initCustom
	
	this.initContent = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::initContent",params);
		self.items = params.items;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
		
		// header and search
		self.searchFieldId = "userSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,id:"userSearchField",
			title:self.pageTexts.ADMIN_USER_PAGE.ADMIN_USER_PAGE_HEADER.value,
			titleRender:self.pageTexts.ADMIN_USER_PAGE.ADMIN_USER_PAGE_HEADER.rendered,
			pageTexts:self.pageTexts,
			searchClick:function(e){self.searchClick(e);} });
		
		// create dashboard of user metrics
		var dashboard = new ToastHubDashboard();
		var params2 = {container:self.mainContainer,stats:[{icon:"<i class='fa fa-user'></i>",title:"Total Users",count:params.itemCount},
		                                {icon:"<i class='fa fa-user'></i>",title:"New Users",count:params.itemCount},
		                                {icon:"<i class='fa fa-user'></i>",title:"Locked Users",count:"0"},
		                                {icon:"<i class='fa fa-clock-o'></i>",title:"Login Failures",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From last week",count:"30"},
		           						{icon:"<i class='fa fa-clock-o'></i>",title:"Average Time",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"3000"}]};
		dashboard.listStats(params2);
		
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
								contentId:"content-area",
								header:true,
								menuId:"users-menu",
								settings:{options:[
								          {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_ADD.value,
								        	  url:"#",
								        	  id:"users-add",
								        	  onclick:function(params){self.openModal({title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value});}}
								          ]
								}
		});
		
		// create panel to hold list
		//this.contentArea = panel.drawLargePanel({container:mainContainer,contentId:"content-area",header:false});
		
		
		
		//params.itemName = "AppUser";
		//params.listName = "ADMIN_USER_LIST1";
		
		// create modal for save and edit
		var modalParams = {id:"usersModal",container:self.mainContainer,headerTitle:"Edit",
				acceptClick:function(params){self.saveItem(params);},declineClick:function(){jQuery('#usersModal').modal('toggle');} };
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // processInit
	
	
	/*this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::processList");
		params.controllerName = "users";
		params.container = this.contentArea;
		var editButton = new Object();
		editButton.name = "Edit";
		editButton.onClick = function(id){ return function(){toastHub.getController("users").edit({itemId:id,itemName:"AppUser",sysPageFormName:"ADMIN_USERS_FORM_EDIT",sysPageTextName:"ADMIN_USERS_FORM_EDIT",sysPageParamLoc:"response"});}; };
		var deleteButton = new Object();
		deleteButton.name = "Delete";
		deleteButton.onClick = function(id){ return function(){toastHub.getController("users").remove({itemId:id,itemName:"AppUser",sysPageFormName:"ADMIN_USERS_FORM_DELETE",sysPageTextName:"ADMIN_USERS_FORM_DELETE"});}; };
		var rolesButton = new Object();
		rolesButton.name = "Roles";
		rolesButton.onClick = function(id){};
		params.itemButtons = new Array(editButton,deleteButton,rolesButton);
		var addMenuButton = new Object();
		addMenuButton.img = "";
		addMenuButton.name = "Add";
		addMenuButton.onClick = function(){ return function(){toastHub.getController("users").add({itemName:"AppUser",sysPageFormName:"ADMIN_USERS_FORM_EDIT",sysPageTextName:"ADMIN_USERS_FORM_EDIT",sysPageParamLoc:"response"});}; };
		params.menuButtons = new Array(addMenuButton);
		
		var params4 = {container:this.contentArea,items:params.items};
		this.contacts.renderUsers(params4);
		
	}; // processList
	*/
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::processList",params);
		self.contentArea.innerHTML = "";
		params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
		toastHub.utils.pagingRenderer(params);

		// organize data for table
		var columns = ["Column 1","Column 2","Column 3","Column 4","Column 5",""];
		var col = self.pageLabels.ADMIN_USER_PAGE;
		for (var i = 0; i < col.length; i++) {
			columns[i] = col[i].value;
		}
		var rows = new Array();
		var items = params.items;
		for (var i =0; i < items.length; i++) {
			var r = new Array();
			for (var j = 0; j < col.length; j++) {
				var colValue = "";
				switch (col[j].name) {
					case "ADMIN_USER_PAGE_COLUMN_1":
						// Name
						colValue = items[i].firstname;
						break;
					case "ADMIN_USER_PAGE_COLUMN_2":
						// Code
						colValue = items[i].lastname;
						break;
					case "ADMIN_USER_PAGE_COLUMN_3":
						// Code
						colValue = items[i].username;
						break;
					case "ADMIN_USER_PAGE_COLUMN_4":
						// Code
						colValue = items[i].email;
						break;
					case "ADMIN_USER_PAGE_COLUMN_5":
						if (items[i].active) {
							colValue = "Active";
						} else {
							colValue = "Disabled";
						}
						break;
				}
				r.push(colValue);
			}
			// Buttons
			var button_wrapper = document.createElement("SPAN");
			button_wrapper.className = "active";
			
			// Edit
			var edit_link = document.createElement("A");
			edit_link.id = "sb-"+items[i].id;
			edit_link.href = "#";
			var e = {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:items[i]};
			edit_link.onclick = (function(e) { return function(){self.openModal(e); return false;}; })(e);
			edit_link.setAttribute("role","button");
			edit_link.setAttribute("aria-expanded","false");
			edit_link.innerHTML = "<i class='fa fa-edit'></i>";
			button_wrapper.appendChild(edit_link);
			
			// Roles
			var roles_link = document.createElement("A");
			roles_link.id = "rls-"+items[i].id;
			roles_link.href = "#";
			var z = {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:items[i]};
			roles_link.onclick = (function(e) { return function(){self.modalRoles(e); return false;}; })(z);
			roles_link.setAttribute("role","button");
			roles_link.setAttribute("aria-expanded","false");
			roles_link.innerHTML = "<i class='fa fa-user-plus'></i>";
			button_wrapper.appendChild(roles_link);
			
			// Delete
			var delete_link = document.createElement("A");
			delete_link.id = "db-"+items[i].id;
			delete_link.href = "#";
			var d = {id:"acknowledgeModal",headerTitle:"Delete",item:items[i],message:"Are you sure you want to delete?",
					acceptClick:function(params){self.deleteItem(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
			delete_link.onclick = (function(d) { return function(){self.openAcknowledge(d); return false;}; })(d);
			delete_link.setAttribute("role","button");
			delete_link.setAttribute("aria-expanded","false");
			delete_link.innerHTML = "<i class='fa fa-trash'></i>";
			button_wrapper.appendChild(delete_link);
			
			r.push({item:button_wrapper});
			rows.push(r);
			
		}
		
		self.table.render({container:self.contentArea,table:{columns:columns,rows:rows}});
		toastHub.utils.pagingRenderer(params);
	}; // processList

	
	this.openModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::openModal",params);
		var modalBody = document.getElementById('modalBody-usersModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
		var mode = "create";
		var hiddenId = document.createElement("INPUT");
		hiddenId.type = "hidden";
		hiddenId.id = "ADMIN_USER_FORM_SAVE_ID";
		if (params.item != null && params.item.id != null) {
			hiddenId.value = params.item.id;
			mode = "modify";
		} else {
			hiddenId.value = "";
		}
		formWrapper.appendChild(hiddenId);
		
		var subContainers = {};
		var fields = self.pageFormFields.ADMIN_USER_FORM;
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				switch (fields[i].name) {
				case "ADMIN_USER_FORM_FIRSTNAME":
					var value = "";
					if (params.item != null && params.item.firstname != null){
						value = params.item.firstname;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_MIDDLENAME":
					var value = "";
					if (params.item != null && params.item.middlename != null){
						value = params.item.middlename;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_LASTNAME":
					var value = "";
					if (params.item != null && params.item.lastname != null){
						value = params.item.lastname;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_USERNAME":
					var value = "";
					if (params.item != null && params.item.username != null){
						value = params.item.username;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_EMAIL":
					var value = "";
					if (params.item != null && params.item.email != null){
						value = params.item.email;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_ZIPCODE":
					var value = "";
					if (params.item != null && params.item.zipcode != null){
						value = params.item.zipcode;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_LANGUAGE":
					var value = "";
					var id = "";
					var actionButton = "Choose";
					if (params.item != null && params.item.lang != null) {
						value = params.item.lang;
						actionButton = "Change";
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode,actionButton:actionButton,onclick:function(params){self.modalLanguage(params);}});
					break;	
				case "ADMIN_USER_FORM_ALTERNATE_EMAIL":
					var value = "";
					if (params.item != null && params.item.alternateEmail != null){
						value = params.item.alternateEmail;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_USER_FORM_LOGLEVEL":
					var value = "";
					if (params.item != null && params.item.logLevel != null){
						value = params.item.logLevel;
					}
					self.form.selectRenderer({container:formWrapper,field:fields[i],item:params.item,value:value});
					break;
				case "ADMIN_USER_FORM_ACTIVE":
					var value = false;
					if (params.item != null && params.item.active != null) {
						value = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "ADMIN_USER_FORM_FORCERESET":
					var value = false;
					if (params.item != null && params.item.forceReset != null) {
						value = params.item.forceReset;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "ADMIN_USER_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "ADMIN_USER_FORM_TITLE_TEXT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.langTexts != null) {
						value = params.item;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",languages:toastHub.languages,lang:toastHub.lang,field:fields[i],item:value});
					break;
				}
			}
		}
		
		
		// open modal
		jQuery('#usersModal').modal({backdrop:"static",show:true});
	}; // openModal
	
	this.modalRoles = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::modalRoles",params);
		params.container = self.mainContainer;
		self.selectedUser = params.item;
		params.callBack = function(params){self.saveRoles(params);}
		toastHub.getWidget("roles").openWidget(params);
	}; // modalRoles
	
	this.saveRoles = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::saveRoles",params);
		var action = "DELETE_ROLE";
		if (params.op == "save"){
			action = "SAVE_ROLE";
		}
		var saveParams = {service:"USERS_SVC",action:action,itemId:self.selectedUser.id,roleId:parseInt(params.id),callBack:function(JSONData){self.rolesCallBack(JSONData);}};
		self.callService(saveParams);
	}; // saveRoles
	
	this.rolesCallBack = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::rolesCallBack",params);
		//toastHub.getWidget("roles").showStatusMessage(params);
		var event = new CustomEvent('rolesEvents',{'detail':params});
		document.dispatchEvent(event);
	};
	
	this.modalLanguage = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::modalLanguage",params);
		params.container = self.mainContainer;
		params.callBack = function(params){self.updateLanguage(params);}
		toastHub.getWidget("language").openWidget(params);
	}; // modelLanguage
	
	this.updateLanguage = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::updateLanguage",params);
		var language = toastHub.getWidget("language");
		var value = "";
		for (var i=0; i < language.items.length; i++){
			if (language.items[i].id == params.languageId) {
				value = language.items[i].code;
			}
		}
		document.getElementById("ADMIN_USER_FORM_LANGUAGE").value = value;
	}; // updateLanguage
	
	this.saveItem = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::saveItem",params);
		var valid = toastHub.utils.validateFields(self.pageFormFields.ADMIN_USER_FORM,toastHub.lang,toastHub.languages,"MAIN");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.ADMIN_USER_FORM,toastHub.lang,toastHub.languages);
			var id = jQuery("#ADMIN_USER_FORM_SAVE_ID").val();
			var saveParams = {service:"USERS_SVC",action:"SAVE",itemId:parseInt(id),callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["ADMIN_USER_FORM"],inputFields:result};
			self.callService(saveParams);
		}
	}; // save
	
	this.deleteItem = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::deleteItem",params);
		var deleteParams = {service:"USERS_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // delete
	
	this.saveCallBack = function(JSONData){
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::saveCallBack",JSONData.params);
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#usersModal').modal('toggle');
			this.getList();
		} else {
			alert("error");
		}
	}; // saveCallBack

	this.deleteCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-users::toastHubUsers::deleteCallBack",JSONData.params);
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1 
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#acknowledgeModal').modal('toggle');
			this.getList();
		} else {
			
			alert("error");
		}
	}; // deleteCallBack
	
	this.searchClick = function(e){
		if (e.keyCode == null || e.keyCode == 13) {
			this.getList();
		}
	}
}