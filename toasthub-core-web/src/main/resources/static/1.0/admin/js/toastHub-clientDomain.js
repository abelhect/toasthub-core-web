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

toastHubClientDomain.prototype = Object.create(toastHubBase.prototype);
toastHubClientDomain.prototype.constructor = toastHubClientDomain;

function toastHubClientDomain(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "CLIENT_DOMAIN_SVC";
	this.category = "ADMIN";
	this.pageToElement = [];
	this.contentArea = null;
	this.mainContainer = null;
	this.subMenuArea = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	this.table = new ToastHubTable();
	this.tab = new ToastHubTab();
	this.modal = new ToastHubModal();
	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-clientDomain::toastHubClientDomain::initCustom");
		params.category = this.category;
		params.appForms = ["ADMIN_CLIENT_DOMAIN_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_CLIENT_DOMAIN_PAGE"];
		params.appLabels = ["ADMIN_CLIENT_DOMAIN_PAGE"];
	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-clientDomain::toastHubClientDomain::initContent");
		self.pageNames = params.items;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// header and search
		self.searchFieldId = "clientDomainSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,id:"clientDomainSearchField",
			title:self.pageTexts.ADMIN_CLIENT_DOMAIN_PAGE.ADMIN_CLIENT_DOMAIN_PAGE_HEADER.value,
			titleRender:self.pageTexts.ADMIN_CLIENT_DOMAIN_PAGE.ADMIN_CLIENT_DOMAIN_PAGE_HEADER.rendered,
			pageTexts:self.pageTexts,
			searchClick:function(e){self.searchClick(e);} });
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
								contentId:"content-area",
								header:true,
								menuId:"clientDomain-menu",
								settings:{options:[
								          {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_ADD.value,
								        	  url:"#",
								        	  id:"clientDomain-add",
								        	  onclick:function(params){self.openModal({title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value});}}
								          ]
								}
		});
		
		// create modal for save and edit
		var modalParams = {id:"clientDomainModal",container:self.mainContainer,headerTitle:"Edit",
				acceptClick:function(params){self.saveItem(params);},declineClick:function(){jQuery('#clientDomainModal').modal('toggle');} };
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // initContent
	
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-clientDomain::toastHubClientDomain::processList");
		self.contentArea.innerHTML = "";
		params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
		toastHub.utils.pagingRenderer(params);

		// organize data for table
		var columns = ["Column 1","Column 2","Column 3","Column 4","Column 5",""];
		var col = self.pageLabels.ADMIN_CLIENT_DOMAIN_PAGE;
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
					case "ADMIN_CLIENT_DOMAIN_PAGE_COLUMN_1":
						// Name
						colValue = toastHub.utils.getLangText({title:items[i].title});
						break;
					case "ADMIN_CLIENT_DOMAIN_PAGE_COLUMN_2":
						// URLDomain
						colValue = items[i].urldomain;
						break;
					case "ADMIN_CLIENT_DOMAIN_PAGE_COLUMN_3":
						// APPDomain
						colValue = items[i].appdomain;
						break;
					case "ADMIN_CLIENT_DOMAIN_PAGE_COLUMN_4":
						// APP Name
						colValue = items[i].appname;
						break;
					case "ADMIN_CLIENT_DOMAIN_PAGE_COLUMN_5":
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
			var edit_link = document.createElement("A");
			edit_link.id = "sb-"+items[i].id;
			edit_link.href = "#";
			var e = {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:items[i]};
			edit_link.onclick = (function(e) { return function(){self.openModal(e); return false;}; })(e);
			edit_link.setAttribute("role","button");
			edit_link.setAttribute("aria-expanded","false");
			edit_link.innerHTML = "<i class='fa fa-edit'></i>";
			button_wrapper.appendChild(edit_link);
			
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
		toastHub.logSystem.log("DEBUG","toastHub-clientDomain::toastHubClientDomain::openModal::"+params.title);
		var modalBody = document.getElementById('modalBody-clientDomainModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
		var mode = "create";
		var hiddenId = document.createElement("INPUT");
		hiddenId.type = "hidden";
		hiddenId.id = "ADMIN_CLIENT_DOMAIN_FORM_SAVE_ID";
		if (params.item != null && params.item.id != null) {
			hiddenId.value = params.item.id;
			mode = "modify";
		} else {
			hiddenId.value = "";
		}
		formWrapper.appendChild(hiddenId);
		
		var subContainers = {};
		var fields = self.pageFormFields.ADMIN_CLIENT_DOMAIN_FORM;
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				switch (fields[i].name) {
				case "ADMIN_CLIENT_DOMAIN_FORM_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_URL_DOMAIN":
					var value = "";
					if (params.item != null && params.item.urldomain != null){
						value = params.item.urldomain;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_APP_DOMAIN":
					var value = "";
					if (params.item != null && params.item.appdomain != null){
						value = params.item.appdomain;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_ACTIVE":
					var value = false;
					if (params.item != null && params.item.active != null) {
						value = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_APP_NAME":
					var value = "";
					if (params.item != null && params.item.appname != null){
						value = params.item.appname;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_HTML_PREFIX":
					var value = "";
					if (params.item != null && params.item.htmlprefix != null){
						value = params.item.htmlprefix;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_PUBLIC_LAYOUT":
					var value = "";
					if (params.item != null && params.item.publicLayout != null){
						value = params.item.publicLayout;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_ADMIN_LAYOUT":
					var value = "";
					if (params.item != null && params.item.adminLayout != null){
						value = params.item.adminLayout;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_MEMBER_LAYOUT":
					var value = "";
					if (params.item != null && params.item.memberLayout != null){
						value = params.item.memberLayout;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_SYSADMIN_LAYOUT":
					var value = "";
					if (params.item != null && params.item.sysAdminLayout != null){
						value = params.item.sysAdminLayout;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "ADMIN_CLIENT_DOMAIN_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "ADMIN_CLIENT_DOMAIN_FORM_TITLE_TEXT":
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
		jQuery('#clientDomainModal').modal({backdrop:"static",show:true});
	}; // openModal
	
	this.saveItem = function(params) {
		var valid = toastHub.utils.validateFields(self.pageFormFields.ADMIN_CLIENT_DOMAIN_FORM,toastHub.lang,toastHub.languages,"MAIN");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.ADMIN_CLIENT_DOMAIN_FORM,toastHub.lang,toastHub.languages);
			var id = jQuery("#ADMIN_CLIENT_DOMAIN_FORM_SAVE_ID").val();
			var saveParams = {service:"CLIENT_DOMAIN_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["ADMIN_CLIENT_DOMAIN_FORM"],inputFields:result};
			self.callService(saveParams);
		}
	}; // save
	
	this.deleteItem = function(params) {
		var deleteParams = {service:"CLIENT_DOMAIN_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // delete
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#clientDomainModal').modal('toggle');
			this.getList();
		} else {
			alert("error");
		}
	}; // saveCallBack

	this.deleteCallBack = function(JSONData) {
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
	
} // toastHubClientDomain

