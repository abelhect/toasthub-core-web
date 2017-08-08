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

toastHubRoles.prototype = Object.create(toastHubBase.prototype);
toastHubRoles.prototype.constructor = toastHubRoles;

function toastHubRoles(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "ROLES_SVC";
	this.pageToElement = [];
	this.contentArea = null;
	this.mainContainer = null;
	this.subMenuArea = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	this.table = new ToastHubTable();
	this.tab = new ToastHubTab();
	this.modal = new ToastHubModal();
	this.selectedRole = null;
	this.messageArea = null;
	this.baseContainer = null;
	var self = parent;
	
	this.openWidget = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::openWidget",params);
		self.baseContainer = params.container;
		document.addEventListener("rolesEvents",function(e){self.rolesEvents(e);});
		var modalParams = {id:"rolesWidgetModal",container:params.container,headerTitle:"Roles",
				declineLabel:"Close",declineClick:function(){jQuery('#rolesWidgetModal').modal('toggle');}};
		self.mainContainer = self.modal.render(modalParams);
		self.widgetCallBack = params.callBack;
		params = toastHub.initParams(params);	
		params.action = "LIST";
		params.service = this.service;
		params.pageMetaName = this.pageMetaName;
		params.callBack = function(JSONData){self.processWidget(JSONData.params);};
		params.appForms = ["ADMIN_ROLE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_ROLE_PAGE"];
		params.appLabels = ["ADMIN_ROLE_PAGE"];
		self.userId = params.item.id;
		params.userId = params.item.id;
		this.callService(params);
	}; // openWidget
	
	this.rolesEvents = function(e) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::rolesEvent ");
		if (e.detail != null) {
			toastHub.utils.applicationMessages({container:self.messageArea,statusMessage:e.detail.params.statusMessage})
		}
	}; //rolesEvents
	
	this.processWidget = function(params) {
		self.mainContainer.innerHTML = "";
		params.container = self.mainContainer;
		this.initContent(params);
		jQuery('#rolesWidgetModal').modal({backdrop:"static",show:true});
	}; // processWidget
	
	this.saveWidget = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::saveWidget save id "+ params.id + " op " + params.op );
		self.widgetCallBack(params);
	}; // saveWidget
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::initCustom");
		params.appForms = ["ADMIN_ROLE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_ROLE_PAGE"];
		params.appLabels = ["ADMIN_ROLE_PAGE"];
	}; // initCustom
	
	this.listCustom = function(params){
		if (self.isWidget){
			params.userId = self.userId;
		}
	}; // listCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::initContent");
		self.pageNames = params.items;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// header and search
		self.searchFieldId = "rolesSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,id:"rolesSearchField",
			title:self.pageTexts.ADMIN_ROLE_PAGE.ADMIN_ROLE_PAGE_HEADER.value,
			titleRender:self.pageTexts.ADMIN_ROLE_PAGE.ADMIN_ROLE_PAGE_HEADER.rendered,
			pageTexts:self.pageTexts,
			searchClick:function(e){self.searchClick(e);} });
		
		// Message area
		self.messageArea = document.createElement("DIV");
		self.messageArea.id = "rolesMessageArea";
		self.mainContainer.appendChild(self.messageArea);
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
								contentId:"content-area",
								header:true,
								menuId:"roles-menu",
								settings:{options:[
								          {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_ADD.value,
								        	  url:"#",
								        	  id:"roles-add",
								        	  onclick:function(params){self.openModal({title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value});}}
								          ]
								}
		});
		
		// create modal for save and edit
		var container = self.mainContainer;
		if (self.isWidget){
			container = self.baseContainer;
		}
		var modalParams = {id:"rolesModal",container:container,headerTitle:"Edit",
				acceptClick:function(params){self.saveItem(params);},declineClick:function(){jQuery('#rolesModal').modal('toggle');} };
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:container,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // initContent
	
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::processList");
		self.contentArea.innerHTML = "";
		params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
		toastHub.utils.pagingRenderer(params);

		// organize data for table
		var offSet = 0;
		var columns = ["Column 1","Column 2","Column 3",""];
		var col = self.pageLabels.ADMIN_ROLE_PAGE;
		
		if (self.isWidget){
			offSet = 1;
			columns = ["","Column 1","Column 2","Column 3",""];
		}
		
		for (var i = 0; i < col.length; i++) {
			columns[i + offSet] = col[i].value;
		}
		var rows = new Array();
		var items = params.items;
		for (var i =0; i < items.length; i++) {
			var r = new Array();
			// widget checkbox
			if (self.isWidget) {
				var status = "";
				if (params.roleIds != null){
					for (var z=0; z < params.roleIds.length; z++) {
						if (params.roleIds[z] == items[i].id){
							status = "checked";
							break;
						}
					}
				} else {
					if (self.selectedId != null && items[i].id == self.selectedId) {
						status = "checked";
					}
				}	
				r.push({type:"checkbox",status:status,id:"cboxrole-"+items[i].id});
			}
			for (var j = 0; j < col.length; j++) {
				var colValue = "";
				switch (col[j].name) {
					case "ADMIN_ROLE_PAGE_COLUMN_1":
						// Name
						colValue = toastHub.utils.getLangText({title:items[i].title});
						break;
					case "ADMIN_ROLE_PAGE_COLUMN_2":
						// Code
						colValue = items[i].code;
						break;
					case "ADMIN_ROLE_PAGE_COLUMN_3":
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
			
			// Permissions
			var permission_link = document.createElement("A");
			permission_link.id = "prm-"+items[i].id;
			permission_link.href = "#";
			var e = {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:items[i]};
			permission_link.onclick = (function(e) { return function(){self.modalPermissions(e); return false;}; })(e);
			permission_link.setAttribute("role","button");
			permission_link.setAttribute("aria-expanded","false");
			permission_link.innerHTML = "<i class='fa fa-key'></i>";
			button_wrapper.appendChild(permission_link);
			
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
		
		var tableParams = {container:self.contentArea,table:{columns:columns,rows:rows}};
		tableParams.saveCallBack = function(p){self.saveWidget(p);}
		self.table.render(tableParams);
		toastHub.utils.pagingRenderer(params);
	}; // processList

	
	this.openModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::openModal::"+params.title);
		var modalBody = document.getElementById('modalBody-rolesModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
		var mode = "create";
		var hiddenId = document.createElement("INPUT");
		hiddenId.type = "hidden";
		hiddenId.id = "ADMIN_ROLE_FORM_SAVE_ID";
		if (params.item != null && params.item.id != null) {
			hiddenId.value = params.item.id;
			mode = "modify";
		} else {
			hiddenId.value = "";
		}
		formWrapper.appendChild(hiddenId);
		
		var subContainers = {};
		var fields = self.pageFormFields.ADMIN_ROLE_FORM;
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				switch (fields[i].name) {
				case "ADMIN_ROLE_FORM_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "ADMIN_ROLE_FORM_CODE":
					var value = "";
					if (params.item != null && params.item.code != null){
						value = params.item.code;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_ROLE_FORM_ACTIVE":
					var value = false;
					if (params.item != null && params.item.active != null) {
						value = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "ADMIN_ROLE_FORM_APPLICATION":
					var value = "";
					var actionButton = "Choose";
					if (params.item != null && params.item.applicationId != null) {
						value = params.item.applicationId;
						actionButton = "Change";
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode,actionButton:actionButton,onclick:function(params){self.modalApplication(params);}});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "ADMIN_ROLE_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "ADMIN_ROLE_FORM_TITLE_TEXT":
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
		jQuery('#rolesModal').modal({backdrop:"static",show:true});
	}; // openModal
	
	this.modalApplication = function(params) {
		params.container = self.mainContainer;
		if (self.isWidget){
			params.container = self.baseContainer;
		}
		params.callBack = function(params){self.updateApplication(params);}
		toastHub.getWidget("application").openWidget(params);
	}; // modelApplication
	
	this.updateApplication = function(params) {
		document.getElementById("ADMIN_ROLE_FORM_APPLICATION").value = params.applicationId;
	}; // updateApplication
	
	this.modalPermissions = function(params) {
		params.container = self.mainContainer;
		if (self.isWidget){
			params.container = self.baseContainer;
		}
		self.selectedRole = params.item;
		params.callBack = function(params){self.savePermissions(params);}
		toastHub.getWidget("permissions").openWidget(params);
	}; // modalPermission
	
	this.savePermissions = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::savePermissions",params);
		var action = "DELETE_PERMISSION";
		if (params.op == "save"){
			action = "SAVE_PERMISSION"
		}
		var saveParams = {service:"ROLES_SVC",action:action,itemId:self.selectedRole.id,permissionId:parseInt(params.id),callBack:function(JSONData){self.permissionsCallBack(JSONData);}};
		self.callService(saveParams);
	}; // savePermissions
	
	this.permissionsCallBack = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::permissionsCallBack",params);
		var event = new CustomEvent('permissionsEvents',{'detail':params});
		document.dispatchEvent(event);
	};
	
	this.saveItem = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::saveItem",params);
		var valid = toastHub.utils.validateFields(self.pageFormFields.ADMIN_ROLE_FORM,toastHub.lang,toastHub.languages,"MAIN");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.ADMIN_ROLE_FORM,toastHub.lang,toastHub.languages);
			var id = jQuery("#ADMIN_ROLE_FORM_SAVE_ID").val();
			var saveParams = {service:"ROLES_SVC",action:"SAVE",itemId:parseInt(id),callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["ADMIN_ROLE_FORM"],inputFields:result};
			self.callService(saveParams);
		}
	}; // save
	
	this.deleteItem = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-roles::toastHubRoles::deleteItem",params);
		var deleteParams = {service:"ROLES_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // delete
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#rolesModal').modal('toggle');
			this.getList();
		} else {
			alert("error");
		}
	}; // saveCallBack

	this.deleteCallBack = function(JSONData) {
		jQuery('#acknowledgeModal').modal('toggle');
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1 
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			this.getList();
		} else {
			var event = new CustomEvent('rolesEvents',{'detail':JSONData});
			document.dispatchEvent(event);
		}
	}; // deleteCallBack
	
	this.searchClick = function(e){
		if (e.keyCode == null || e.keyCode == 13) {
			this.getList();
		}
	}; // searchClick;
	
	this.showStatusMessage = function(params){
		
	}; // showStatusMessage
} // toastHubRoles

