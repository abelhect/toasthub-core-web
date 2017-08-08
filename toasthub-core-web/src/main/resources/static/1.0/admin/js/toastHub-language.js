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

toastHubLanguage.prototype = Object.create(toastHubBase.prototype);
toastHubLanguage.prototype.constructor = toastHubLanguage;

function toastHubLanguage(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "LANGUAGE_SVC";
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
	this.selectedCode = null;
	this.fieldType = null;
	var self = parent;
	
	this.openWidget = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::openWidget");
		// remove any old widgets
		var oldWidget = document.getElementById("languageWidgetModal");
		if (oldWidget != null) {
			oldWidget.parentNode.removeChild(oldWidget);
		}
		var modalParams = {id:"languageWidgetModal",container:params.container,headerTitle:"Select Item",
				acceptClick:function(){self.saveWidget();},declineClick:function(){jQuery('#languageWidgetModal').modal('toggle');} };
		self.mainContainer = self.modal.render(modalParams);
		self.selectedCode = params.value;
		self.fieldType = params.field.fieldType;
		self.widgetCallBack = params.callBack;
		params = toastHub.initParams(params);
		params.action = "LIST";
		params.service = this.service;
		params.pageMetaName = this.pageMetaName;
		params.callBack = function(JSONData){self.processWidget(JSONData.params);};
		params.appForms = ["ADMIN_LANGUAGE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_LANGUAGE_PAGE"];
		params.appLabels = ["ADMIN_LANGUAGE_PAGE"];
		
		this.callService(params);
	}; // openWidget
	
	this.processWidget = function(params) {
		self.mainContainer.innerHTML = "";
		params.container = self.mainContainer;
		this.initContent(params);
		jQuery('#languageWidgetModal').modal({backdrop:"static",show:true});
	}; // processWidget
	
	this.saveWidget = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::saveWidget::" +self.table.selectedId);
		jQuery('#languageWidgetModal').modal('toggle');
		var id = self.table.selectedId.split("-");
		self.widgetCallBack({languageId:id[1]});
	}; // saveWidget
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::initCustom",params);
		params.category = this.category;
		params.appForms = ["ADMIN_LANGUAGE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_LANGUAGE_PAGE"];
		params.appLabels = ["ADMIN_LANGUAGE_PAGE"];
	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::initContent",params);
		self.pageNames = params.items;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// header and search
		self.searchFieldId = "languageSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,
						id:"languageSearchField",
						title:self.pageTexts.ADMIN_LANGUAGE_PAGE.ADMIN_LANGUAGE_PAGE_HEADER.value,
						titleRender:self.pageTexts.ADMIN_LANGUAGE_PAGE.ADMIN_LANGUAGE_PAGE_HEADER.rendered,
						pageTexts:self.pageTexts,
						searchClick:function(e){self.searchClick(e);} 
		});
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
									contentId:"content-area",
									header:true,
									menuId:"language-menu",
									settings:{options:[
									             {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_ADD.value,
									            	 url:"#",
									            	 id:"language-add",
									            	 onclick:function(params){self.openModal({title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value});}}
									          ]
									}
		});
		
		// create modal for save and edit
		var modalParams = {id:"languageModal",container:self.mainContainer,headerTitle:"Edit",
				acceptClick:function(params){self.saveItem(params);},declineClick:function(){jQuery('#languageModal').modal('toggle');} };
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // initContent
	
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::processList",params);
		self.contentArea.innerHTML = "";
		params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
		toastHub.utils.pagingRenderer(params);
		
		// organize data for table
		var offSet = 0;
		var columns = ["Column 1","Column 2","Column 3","Column 4","Column 5",""];
		var col = self.pageLabels.ADMIN_LANGUAGE_PAGE;
		if (self.isWidget){
			offSet = 1;
			columns = ["","Column 1","Column 2","Column 3","Column 4","Column 5",""];
		} 
		
		for (var i = 0; i < col.length; i++) {
			columns[i + offSet] = col[i].value;
		}
		var rows = new Array();
		self.items = params.items;
		for (var i =0; i < self.items.length; i++) {
			var r = new Array();
			// widget checkbox
			if (self.isWidget) {
				var status = "";
				if (self.selectedCode != null && self.items[i].code == self.selectedCode) {
					status = "checked";
				}
				r.push({type:"checkbox",status:status,id:"cboxlanguage-"+self.items[i].id});
			}
			for (var j = 0; j < col.length; j++) {
				var colValue = "";
				switch (col[j].name) {
					case "ADMIN_LANGUAGE_PAGE_COLUMN_1":
						// Title
						colValue = toastHub.utils.getLangText({title:self.items[i].title});
						break;
					case "ADMIN_LANGUAGE_PAGE_COLUMN_2":
						colValue = self.items[i].code;
						break;
					case "ADMIN_LANGUAGE_PAGE_COLUMN_3":
						// Status
						if (self.items[i].active) {
							colValue = "Active";
						} else {
							colValue = "Disabled";
						}
						break;
					case "ADMIN_LANGUAGE_PAGE_COLUMN_4":
						// Default Language
						if (self.items[i].defaultLang) {
							colValue = "Yes";
						}
						break;
					case "ADMIN_LANGUAGE_PAGE_COLUMN_5":
						colValue = self.items[i].dir;
						break;
				}
				r.push(colValue);
			}
			// Buttons
			var button_wrapper = document.createElement("SPAN");
			button_wrapper.className = "active";
			var edit_link = document.createElement("A");
			edit_link.id = "sb-"+self.items[i].id;
			edit_link.href = "#";
			var e = {title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:self.items[i]};
			edit_link.onclick = (function(e) { return function(){self.openModal(e); return false;}; })(e);
			edit_link.setAttribute("role","button");
			edit_link.setAttribute("aria-expanded","false");
			edit_link.innerHTML = "<i class='fa fa-edit'></i>";
			button_wrapper.appendChild(edit_link);
			
			var delete_link = document.createElement("A");
			delete_link.id = "db-"+self.items[i].id;
			delete_link.href = "#";
			var d = {id:"acknowledgeModal",headerTitle:"Delete",item:self.items[i],message:"Are you sure you want to delete?",
					acceptClick:function(params){self.deleteItem(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
			delete_link.onclick = (function(d) { return function(){self.openAcknowledge(d); return false;}; })(d);
			delete_link.setAttribute("role","button");
			delete_link.setAttribute("aria-expanded","false");
			delete_link.innerHTML = "<i class='fa fa-trash'></i>";
			button_wrapper.appendChild(delete_link);
			
			r.push({item:button_wrapper});
			rows.push(r);
			
		}
		
		self.table.render({container:self.contentArea,table:{columns:columns,rows:rows},fieldType:self.fieldType});
		toastHub.utils.pagingRenderer(params);
	}; // processList

	
	this.openModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::openModal",params);
		var modalBody = document.getElementById('modalBody-languageModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
		var mode = "create";
		var hiddenId = document.createElement("INPUT");
		hiddenId.type = "hidden";
		hiddenId.id = "ADMIN_LANGUAGE_FORM_SAVE_ID";
		if (params.item != null && params.item.id != null) {
			hiddenId.value = params.item.id;
			mode = "modify";
		} else {
			hiddenId.value = "";
		}
		formWrapper.appendChild(hiddenId);
		
		var subContainers = {};
		var fields = self.pageFormFields.ADMIN_LANGUAGE_FORM;
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				switch (fields[i].name) {
				case "ADMIN_LANGUAGE_FORM_CODE":
					var value = "";
					if (params.item != null && params.item.code != null){
						value = params.item.code;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "ADMIN_LANGUAGE_FORM_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "ADMIN_LANGUAGE_FORM_ACTIVE":
					var value = false;
					if (params.item != null && params.item.active != null) {
						value = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "ADMIN_LANGUAGE_FORM_DEFAULT":
					var value = false;
					if (params.item != null && params.item.defaultLang != null){
						value = params.item.defaultLang;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "ADMIN_LANGUAGE_FORM_DIRECTION":
					var value = "rtl";
					if (params.item != null && params.item.dir != null){
						value = params.item.dir;
					}
					self.form.selectRenderer({container:formWrapper,field:fields[i],item:params.item,value:value});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "ADMIN_LANGUAGE_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "ADMIN_LANGUAGE_FORM_TITLE_TEXT":
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
		jQuery('#languageModal').modal({backdrop:"static",show:true});
	}; // openModal
	
	this.saveItem = function(params) {
		var valid = toastHub.utils.validateFields(self.pageFormFields.ADMIN_LANGUAGE_FORM,toastHub.lang,toastHub.languages,"MAIN");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.ADMIN_LANGUAGE_FORM,toastHub.lang,toastHub.languages);
			var id = jQuery("#ADMIN_LANGUAGE_FORM_SAVE_ID").val();
			var saveParams = {service:"LANGUAGE_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["ADMIN_LANGUAGE_FORM"],inputFields:result};
			self.callService(saveParams);
		}
	}; // save
	
	this.deleteItem = function(params) {
		var deleteParams = {service:"LANGUAGE_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // delete
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#languageModal').modal('toggle');
			this.getList();
		} else {
			alert("error");
		}
	}; // saveCallBack

	this.deleteCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-language::toastHubLanguage::deleteCallBack",JSONData.params);
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
} // toastHubLanguage

