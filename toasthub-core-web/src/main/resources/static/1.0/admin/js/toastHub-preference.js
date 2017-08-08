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

toastHubPreference.prototype = Object.create(toastHubBase.prototype);
toastHubPreference.prototype.constructor = toastHubPreference;

function toastHubPreference(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "APPPAGE_SVC";
	this.category = "ADMIN";
	this.pageToElement = [];
	this.contentArea = null;
	this.mainContainer = null;
	this.subMenuArea = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	this.tab = new ToastHubTab();
	this.modal = new ToastHubModal();
	this.selectedItem = null;
	this.selectedParent = null;

	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::initCustom");
		params.category = this.category;
		params.appForms = ["APP_FORMFIELD_FORM","APP_LABEL_FORM","APP_TEXT_FORM","APP_OPTION_FORM","APP_PAGE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","ADMIN_PREFERENCE_PAGE"];
		params.appLabels = ["ADMIN_PREFERENCE_PAGE"];
	}; // initCustom
	
	this.initContent = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::initContent");
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
		
		// header and search
		self.searchFieldId = "preferenceSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,
						id:"preferenceSearchField",
						title:self.pageTexts.ADMIN_PREFERENCE_PAGE.ADMIN_PREFERENCE_PAGE_HEADER.value + " - " + this.category,
						titleRender:self.pageTexts.ADMIN_PREFERENCE_PAGE.ADMIN_PREFERENCE_PAGE_HEADER.rendered,
						pageTexts:self.pageTexts,
						searchClick:function(e){self.searchClick(e);} 
		});
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
								contentId:"content-area",
								header:false});
		
		// create modal for save and edit
		var modalParams = {id:"prefsModal",container:self.mainContainer,headerTitle:"Edit",
				acceptClick:function(params){self.savePref(params);},declineClick:function(){jQuery('#prefsModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // initContent
	
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::processList");
		self.pageNames = params.items;
		self.contentArea.innerHTML = "";
		
		var panelGroup = document.createElement("DIV");
		panelGroup.className = "panel-group";
		self.contentArea.appendChild(panelGroup);
		
		self.panel.menuPanelRenderer({container:panelGroup,
					menuId:"pref-menu",
					settings:{options:[
					                {onclick:function(params){self.openPageNameModal(params);},
					                id:"pref-add",
					                title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}
					                   ] 
							}
		});
		
		if (self.pageNames != null && self.pageNames.length > 0) {
			params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
			toastHub.utils.pagingRenderer(params);
			for (var i =0; i < self.pageNames.length; i++) {
				self.pageToElement[this.pageNames[i].id] = i;
				var body = self.panel.collapsePanelRenderer({container:panelGroup,
									itemId:"_page-"+i,
									parentId:"_page-"+i,
									menuId:"pref_page_menu-"+i,
									title:toastHub.utils.getLangText({title:self.pageNames[i].title}),
									settings:{options:[
									               {onclick:function(params){self.openPageNameModal(params);},
									            	   title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
									            	   id:"pref_page_modify-"+i,
									            	   item:self.pageNames[i]},
									               {onclick:function(params){self.openPageNameDelete(params);},
									            	   title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
									            	   id:"pref_page_delete-"+i,
									            	   item:self.pageNames[i]}
									            	   ] 
									}
				});
				self.tab.render({container:body,tabId:i,items:self.pageLabels.ADMIN_PREFERENCE_PAGE});
			}
			jQuery(".collapse").on("show.bs.collapse",self.listItemOpen);
			jQuery('.nav-tabs a').on('shown.bs.tab', self.tabItemOpen);
			toastHub.utils.pagingRenderer(params);
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_LIST_EMPTY.value;
			self.contentArea.appendChild(empty);
		}
	}; // processList
	
	this.listItemOpen = function(event){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::listItemOpen");
		var item = event.target.id.split("-");
		if (event.target.id.indexOf("page") >= 0) {
			var params = {service:"APPFORMFIELD_SVC",action:"LIST",parentId:self.pageNames[item[1]].id,callBack:function(JSONData){self.formFieldListCallBack(JSONData);},appForms:["APP_FORMFIELD_FORM"]};
			self.callService(params);
		}
	}; // pageNameListOpen
	
	this.formFieldListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::formFieldListCallBack");
		var tabContainer = document.getElementById("tabContent_formfield-"+self.pageToElement[JSONData.params.parentId]);
		tabContainer.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:tabContainer,
					parentId:JSONData.params.parentId,
					menuId:"pref_formfield_main_menu-"+self.pageToElement[JSONData.params.parentId],
					settings:{options:[{onclick:function(params){self.openFormFieldModal(params);},
						id:"pref_formfield_main_create-"+self.pageToElement[JSONData.params.parentId],
						title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}] }
				}
			);
		if (JSONData.params.appPageFormField != null && JSONData.params.appPageFormField.length > 0) {
			var items = JSONData.params.appPageFormField;
			for (var i=0; i<items.length; i++){
				var body = self.panel.collapsePanelRenderer({container:tabContainer,
									itemId:"_formfield-"+items[i].id,
									parentId:JSONData.params.parentId,
									menuId:"pref_formfield_menu-"+items[i].id,
									title:toastHub.utils.getLangText({title:items[i].title}),
									settings:{options:[
									    {onclick:function(params){self.openFormFieldModal(params);},
										    title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
										    id:"pref_formfield_modify-"+items[i].id,
										    item:items[i]},
										{onclick:function(params){self.openFormFieldDelete(params);},
											title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
											id:"pref_formfield_delete-"+items[i].id,
											item:items[i]}
										] }
				});
				this.formFieldValues({container:body,item:items[i]});
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = "No items available";
			tabContainer.appendChild(empty);
		}
	}; // formFieldListCallBack
	
	this.labelListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::labelListCallBack");
		var tabContainer = document.getElementById("tabContent_label-"+self.pageToElement[JSONData.params.parentId]);
		tabContainer.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:tabContainer,
					parentId:JSONData.params.parentId,
					menuId:"pref_label_main_menu-"+self.pageToElement[JSONData.params.parentId],
					settings:{options:[{onclick:function(params){self.openLabelModal(params);},
						id:"pref_label_main_create-"+self.pageToElement[JSONData.params.parentId],
						title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}] }
				}
			);
		if (JSONData.params.appPageLabel != null && JSONData.params.appPageLabel.length > 0) {
			var items = JSONData.params.appPageLabel;
			for (var i=0; i<items.length; i++){
				var body = self.panel.collapsePanelRenderer({container:tabContainer,
									itemId:"_label-"+items[i].id,
									parentId:JSONData.params.parentId,
									menuId:"pref_label_menu-"+items[i].id,
									title:toastHub.utils.getLangText({title:items[i].title}),
									settings:{options:[
									           {onclick:function(params){self.openLabelModal(params);},
									             title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
									             id:"pref_label_modify-"+items[i].id,
									             item:items[i]},
									           {onclick:function(params){self.openLabelDelete(params);},
											     title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
											     id:"pref_label_delete-"+items[i].id,
											     item:items[i]}
									             ] 
									}
				});
				this.labelValues({container:body,item:items[i]});
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_LIST_EMPTY.value;
			tabContainer.appendChild(empty);
		}
	}; // labelListCallBack
	
	this.textListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::textListCallBack");
		var tabContainer = document.getElementById("tabContent_text-"+self.pageToElement[JSONData.params.parentId]);
		tabContainer.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:tabContainer,
					parentId:JSONData.params.parentId,
					menuId:"pref_text_main_menu-"+self.pageToElement[JSONData.params.parentId],
					settings:{options:[{onclick:function(params){self.openTextModal(params);},
						id:"pref_text_main_create-"+self.pageToElement[JSONData.params.parentId],
						title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}] }
				}
			);
		if (JSONData.params.appPageText != null && JSONData.params.appPageText.length > 0) {
			var items = JSONData.params.appPageText;
			for (var i=0; i<items.length; i++){
				var body = self.panel.collapsePanelRenderer({container:tabContainer,
									itemId:"_text-"+items[i].id,
									parentId:JSONData.params.parentId,
									menuId:"pref_text_menu-"+items[i].id,
									title:toastHub.utils.getLangText({title:items[i].title}),
									settings:{options:[
									           {onclick:function(params){self.openTextModal(params);},
									             title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
									             id:"pref_text_modify-"+items[i].id,
									             item:items[i]},
									           {onclick:function(params){self.openTextDelete(params);},
									             title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
									             id:"pref_text_delete-"+items[i].id,
									             item:items[i]}
									             ] 
									}
				});
				this.textValues({container:body,item:items[i]});
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_LIST_EMPTY.value;
			tabContainer.appendChild(empty);
		}
	}; // textListCallBack
	
	this.optionListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::optionListCallBack");
		var tabContainer = document.getElementById("tabContent_option-"+self.pageToElement[JSONData.params.parentId]);
		tabContainer.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:tabContainer,
					parentId:JSONData.params.parentId,
					menuId:"pref_option_main_menu-"+self.pageToElement[JSONData.params.parentId],
					settings:{options:[{onclick:function(params){self.openOptionModal(params);},
						id:"pref_option_main_create-"+self.pageToElement[JSONData.params.parentId],
						title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}] }
				}
			);
		if (JSONData.params.appPageOption != null && JSONData.params.appPageOption.length > 0) {
			var items = JSONData.params.appPageOption;
			for (var i=0; i<items.length; i++){
				var body = self.panel.collapsePanelRenderer({container:tabContainer,
									itemId:"_option-"+items[i].id,
									parentId:JSONData.params.parentId,
									menuId:"pref_option_menu-"+items[i].id,
									title:toastHub.utils.getLangText({title:items[i].title}),
									settings:{options:[
									           {onclick:function(params){self.openOptionModal(params);},
										         title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
										         id:"pref_option_modify-"+items[i].id,
										         item:items[i]},
										       {onclick:function(params){self.openOptionDelete(params);},
										         title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
										         id:"pref_option_delete-"+items[i].id,
										         item:items[i]}
										         ] 
									}
				});
				this.optionValues({container:body,item:items[i]});
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_LIST_EMPTY.value;
			tabContainer.appendChild(empty);
		}
	}; // optionListCallBack
	
	this.tabItemOpen = function(event) {
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::tabItemOpen");
		 var x = jQuery(event.target).text();         // active tab
		 var y = jQuery(event.relatedTarget).text();  // previous tab
		 var item = event.target.id.split("-");
		 var params = null;
		 if (event.target.id.indexOf("formfield") >= 0) {
			 params = {service:"APPFORMFIELD_SVC",action:"LIST",parentId:self.pageNames[item[1]].id,callBack:function(JSONData){self.formFieldListCallBack(JSONData);}};
		 } else if (event.target.id.indexOf("label") >= 0) {
			 params = {service:"APPLABEL_SVC",action:"LIST",parentId:self.pageNames[item[1]].id,callBack:function(JSONData){self.labelListCallBack(JSONData);}};
		 } else if (event.target.id.indexOf("text") >= 0) {
			 params = {service:"APPTEXT_SVC",action:"LIST",parentId:self.pageNames[item[1]].id,callBack:function(JSONData){self.textListCallBack(JSONData);}};
		 } else if (event.target.id.indexOf("option") >= 0) {
			 params = {service:"APPOPTION_SVC",action:"LIST",parentId:self.pageNames[item[1]].id,callBack:function(JSONData){self.optionListCallBack(JSONData);}};
		 } else {
			 alert("Tab does not exist");
			 return false;
		 }
		self.callService(params);
	}; // tabOpen
	
	this.updateItems = function() {
		if (self.selectedParent != null) {
			var item = self.selectedParent.split("-");
			if (self.selectedParent.indexOf("formfield") >= 0) {//"tab_formfield-"
				params = {service:"APPFORMFIELD_SVC",action:"LIST",parentId:parseInt(item[1]),callBack:function(JSONData){self.formFieldListCallBack(JSONData);}};
			 } else if (self.selectedParent.indexOf("label") >= 0) {
				 params = {service:"APPLABEL_SVC",action:"LIST",parentId:parseInt(item[1]),callBack:function(JSONData){self.labelListCallBack(JSONData);}};
			 } else if (self.selectedParent.indexOf("text") >= 0) {
				 params = {service:"APPTEXT_SVC",action:"LIST",parentId:parseInt(item[1]),callBack:function(JSONData){self.textListCallBack(JSONData);}};
			 } else if (self.selectedParent.indexOf("option") >= 0) {
				 params = {service:"APPOPTION_SVC",action:"LIST",parentId:parseInt(item[1]),callBack:function(JSONData){self.optionListCallBack(JSONData);}};
			 } else {
				 alert("Tab does not exist");
				 return false;
			 }
			self.callService(params);
		} else {
			this.getList({category:self.category});
		}
	}; // updateItems
	
	this.formFieldValues = function(params) {
		this.generalPreferences(params);
	//////////
		this.adminPreferences(params);
	//////////
		var leftCol = document.createElement("DIV");
		leftCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(leftCol);
		
		var langTitle = document.createElement("P");
		langTitle.innerHTML = "<strong>Language preferences </strong>";
		leftCol.appendChild(langTitle);
		
		var items = params.item.values;
		for (var i=0;i<items.length;i++) {
			var lang = document.createElement("P");
			lang.innerHTML = "<strong>Language: </strong> "+items[i].lang;
			leftCol.appendChild(lang);
			
			var lStatusValue = "Disabled";
			if (items[i].active){
				lStatusValue = "Active"
			}
			var lStatus = document.createElement("P");
			lStatus.innerHTML = "<strong>Status: </strong> "+lStatusValue;
			leftCol.appendChild(lStatus);
			
			var lInfoWrap = document.createElement("UL");
			lInfoWrap.className = "list-unstyled";
			leftCol.appendChild(lInfoWrap);
			
			var lArchive = document.createElement("LI");
			lArchive.innerHTML = "Archive : "+items[i].archive;
			lInfoWrap.appendChild(lArchive);
			
			var lLabel = document.createElement("LI");
			lLabel.innerHTML = "Label : "+items[i].label;
			lInfoWrap.appendChild(lLabel);
			
			var lInput = document.createElement("LI");
			lInput.innerHTML = "Input placeholder : "+items[i].value;
			lInfoWrap.appendChild(lInput);
			
			var lRendered = document.createElement("LI");
			lRendered.innerHTML = "Rendered : "+items[i].rendered;
			lInfoWrap.appendChild(lRendered);
			
			var lRequired = document.createElement("LI");
			lRequired.innerHTML = "Required : "+items[i].required;
			lInfoWrap.appendChild(lRequired);
			
			var lSortOrder = document.createElement("LI");
			lSortOrder.innerHTML = "Sort Order : "+items[i].order;
			lInfoWrap.appendChild(lSortOrder);
			
			var lValidation = document.createElement("LI");
			lValidation.innerHTML = "Validation : "+items[i].validation;
			lInfoWrap.appendChild(lValidation);
			
			var lLocked = document.createElement("LI");
			lLocked.innerHTML = "Locked : "+items[i].locked;
			lInfoWrap.appendChild(lLocked);
			
			if (items[i].locked == true) {
				var lLockTime = document.createElement("LI");
				lLockTime.innerHTML = "Lock Time: "+new Date(items[i].lockTime);
				lInfoWrap.appendChild(lLockTime);
			}
			
			var lCreated = document.createElement("LI");
			lCreated.innerHTML = "Created: "+ new Date(items[i].created);
			lInfoWrap.appendChild(lCreated);
			
			var lModified = document.createElement("LI");
			lModified.innerHTML = "Last Modified: "+new Date(items[i].modified);
			lInfoWrap.appendChild(lModified);
		}
		
	}; // formFieldValues
	
	this.labelValues = function(params) {
		this.generalPreferences(params);
	//////////
		this.adminPreferences(params);
	//////////
		var leftCol = document.createElement("DIV");
		leftCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(leftCol);
		
		var langTitle = document.createElement("P");
		langTitle.innerHTML = "<strong>Language preferences </strong>";
		leftCol.appendChild(langTitle);
		
		var items = params.item.values;
		for (var i=0;i<items.length;i++) {
			var lang = document.createElement("P");
			lang.innerHTML = "<strong>Language: </strong> "+items[i].lang;
			leftCol.appendChild(lang);
			
			var lStatusValue = "Disabled";
			if (items[i].active){
				lStatusValue = "Active"
			}
			var lStatus = document.createElement("P");
			lStatus.innerHTML = "<strong>Status: </strong> "+lStatusValue;
			leftCol.appendChild(lStatus);
			
			var lInfoWrap = document.createElement("UL");
			lInfoWrap.className = "list-unstyled";
			leftCol.appendChild(lInfoWrap);
			
			var lArchive = document.createElement("LI");
			lArchive.innerHTML = "Archive : "+items[i].archive;
			lInfoWrap.appendChild(lArchive);
			
			var lInput = document.createElement("LI");
			lInput.innerHTML = "Label : "+items[i].value;
			lInfoWrap.appendChild(lInput);
			
			var lRendered = document.createElement("LI");
			lRendered.innerHTML = "Rendered : "+items[i].rendered;
			lInfoWrap.appendChild(lRendered);
			
			var lSortOrder = document.createElement("LI");
			lSortOrder.innerHTML = "Sort Order : "+items[i].order;
			lInfoWrap.appendChild(lSortOrder);

			var lLocked = document.createElement("LI");
			lLocked.innerHTML = "Locked : "+items[i].locked;
			lInfoWrap.appendChild(lLocked);
			
			if (items[i].locked == true) {
				var lLockTime = document.createElement("LI");
				lLockTime.innerHTML = "Lock Time: "+new Date(items[i].lockTime);
				lInfoWrap.appendChild(lLockTime);
			}
			
			var lCreated = document.createElement("LI");
			lCreated.innerHTML = "Created: "+ new Date(items[i].created);
			lInfoWrap.appendChild(lCreated);
			
			var lModified = document.createElement("LI");
			lModified.innerHTML = "Last Modified: "+new Date(items[i].modified);
			lInfoWrap.appendChild(lModified);
		}
		
	}; // labelValues
	
	this.textValues = function(params) {
		this.generalPreferences(params);
		//////////
		this.adminPreferences(params);
		//////////
		var leftCol = document.createElement("DIV");
		leftCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(leftCol);
		
		var langTitle = document.createElement("P");
		langTitle.innerHTML = "<strong>Language preferences </strong>";
		leftCol.appendChild(langTitle);
		
		var items = params.item.values;
		for (var i=0;i<items.length;i++) {
			var lang = document.createElement("P");
			lang.innerHTML = "<strong>Language: </strong> "+items[i].lang;
			leftCol.appendChild(lang);
			
			var lStatusValue = "Disabled";
			if (items[i].active){
				lStatusValue = "Active"
			}
			var lStatus = document.createElement("P");
			lStatus.innerHTML = "<strong>Status: </strong> "+lStatusValue;
			leftCol.appendChild(lStatus);
			
			var lInfoWrap = document.createElement("UL");
			lInfoWrap.className = "list-unstyled";
			leftCol.appendChild(lInfoWrap);
			
			var lArchive = document.createElement("LI");
			lArchive.innerHTML = "Archive : "+items[i].archive;
			lInfoWrap.appendChild(lArchive);
			
			var lInput = document.createElement("LI");
			lInput.innerHTML = "Label : "+items[i].value;
			lInfoWrap.appendChild(lInput);
			
			var lRendered = document.createElement("LI");
			lRendered.innerHTML = "Rendered : "+items[i].rendered;
			lInfoWrap.appendChild(lRendered);

			var lLocked = document.createElement("LI");
			lLocked.innerHTML = "Locked : "+items[i].locked;
			lInfoWrap.appendChild(lLocked);
			
			if (items[i].locked == true) {
				var lLockTime = document.createElement("LI");
				lLockTime.innerHTML = "Lock Time: "+new Date(items[i].lockTime);
				lInfoWrap.appendChild(lLockTime);
			}
			
			var lCreated = document.createElement("LI");
			lCreated.innerHTML = "Created: "+ new Date(items[i].created);
			lInfoWrap.appendChild(lCreated);
			
			var lModified = document.createElement("LI");
			lModified.innerHTML = "Last Modified: "+new Date(items[i].modified);
			lInfoWrap.appendChild(lModified);
		}
		
	}; // textValues
	
	this.optionValues = function(params) {
		this.generalPreferences(params);
		//////////
		this.adminPreferences(params);
	//////////
		var leftCol = document.createElement("DIV");
		leftCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(leftCol);
		
		var langTitle = document.createElement("P");
		langTitle.innerHTML = "<strong>Language preferences </strong>";
		leftCol.appendChild(langTitle);
		
		var items = params.item.values;
		for (var i=0;i<items.length;i++) {
			var lang = document.createElement("P");
			lang.innerHTML = "<strong>Language: </strong> "+items[i].lang;
			leftCol.appendChild(lang);
			
			var lStatusValue = "Disabled";
			if (items[i].active){
				lStatusValue = "Active"
			}
			var lStatus = document.createElement("P");
			lStatus.innerHTML = "<strong>Status: </strong> "+lStatusValue;
			leftCol.appendChild(lStatus);
			
			var lInfoWrap = document.createElement("UL");
			lInfoWrap.className = "list-unstyled";
			leftCol.appendChild(lInfoWrap);
			
			var lArchive = document.createElement("LI");
			lArchive.innerHTML = "Archive : "+items[i].archive;
			lInfoWrap.appendChild(lArchive);
			
			var lInput = document.createElement("LI");
			lInput.innerHTML = "Label : "+items[i].value;
			lInfoWrap.appendChild(lInput);
			
			var lRendered = document.createElement("LI");
			lRendered.innerHTML = "Rendered : "+items[i].rendered;
			lInfoWrap.appendChild(lRendered);
			
			var lLocked = document.createElement("LI");
			lLocked.innerHTML = "Locked : "+items[i].locked;
			lInfoWrap.appendChild(lLocked);
			
			if (items[i].locked == true) {
				var lLockTime = document.createElement("LI");
				lLockTime.innerHTML = "Lock Time: "+new Date(items[i].lockTime);
				lInfoWrap.appendChild(lLockTime);
			}
			
			var lCreated = document.createElement("LI");
			lCreated.innerHTML = "Created: "+ new Date(items[i].created);
			lInfoWrap.appendChild(lCreated);
			
			var lModified = document.createElement("LI");
			lModified.innerHTML = "Last Modified: "+new Date(items[i].modified);
			lInfoWrap.appendChild(lModified);
		}
		
	}; // optionValues
 	
	
	this.generalPreferences = function(params) {
		var rightCol = document.createElement("DIV");
		rightCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(rightCol);
		
		var rightTitle = document.createElement("P");
		rightTitle.innerHTML = "<strong>General preferences </strong>";
		rightCol.appendChild(rightTitle);
		
		var statusValue = "Disabled";
		if (params.item.active){
			statusValue = "Active"
		}
		var status = document.createElement("P");
		status.innerHTML = "<strong>Status: </strong> "+statusValue;
		rightCol.appendChild(status);
		
		var infoWrap = document.createElement("UL");
		infoWrap.className = "list-unstyled";
		rightCol.appendChild(infoWrap);
		
		if (params.item.valueType != null) {
			var valueType = document.createElement("LI");
			valueType.innerHTML = "Value type: "+params.item.valueType;
			infoWrap.appendChild(valueType);
		}
		
		if (params.item.defaultValue != null) {
			var defaultValue = document.createElement("LI");
			defaultValue.innerHTML = "Default value: "+params.item.defaultValue;
			infoWrap.appendChild(defaultValue);
		}
		
		if (params.item.useDefault != null) {
			var useDefault = document.createElement("LI");
			useDefault.innerHTML = "Use default: "+params.item.useDefault;
			infoWrap.appendChild(useDefault);
		}
		
		var code = document.createElement("LI");
		code.innerHTML = "Code: "+params.item.name;
		infoWrap.appendChild(code);
		
		var archive = document.createElement("LI");
		archive.innerHTML = "Archived: "+params.item.archive;
		infoWrap.appendChild(archive);
		
		var locked = document.createElement("LI");
		locked.innerHTML = "Locked : "+params.item.locked;
		infoWrap.appendChild(locked);
		
		if (params.item.locked == true) {
			var lockTime = document.createElement("LI");
			lockTime.innerHTML = "Lock Time: "+new Date(params.item.lockTime);
			infoWrap.appendChild(lockTime);
		}
		
		var created = document.createElement("LI");
		created.innerHTML = "Created: "+ new Date(params.item.created);
		infoWrap.appendChild(created);
		
		var modified = document.createElement("LI");
		modified.innerHTML = "Last Modified: "+new Date(params.item.modified);
		infoWrap.appendChild(modified);
		
		
	}; // generalPreferences
	
	this.adminPreferences = function(params) {
		var middleCol = document.createElement("DIV");
		middleCol.className = "col-md-4 col-sm-12 col-xs-12";
		params.container.appendChild(middleCol);
		
		var middleTitle = document.createElement("P");
		middleTitle.innerHTML = "<strong>Admin preferences </strong>";
		middleCol.appendChild(middleTitle);

		var defaultText = document.createElement("P");
		defaultText.innerHTML = "<strong>Default value: </strong>"+params.item.title.defaultText;
		middleCol.appendChild(defaultText);
		
		var titleItems = params.item.title.langTexts;
		for (var i=0;i<titleItems.length;i++) {
			var mLang = document.createElement("P");
			mLang.innerHTML = "<strong>Language: </strong> "+titleItems[i].lang;
			middleCol.appendChild(mLang);
			
			var mInfoWrap = document.createElement("UL");
			mInfoWrap.className = "list-unstyled";
			middleCol.appendChild(mInfoWrap);
			
			var text = document.createElement("LI");
			text.innerHTML = "Value : "+titleItems[i].text;
			mInfoWrap.appendChild(text);
			
		}
		
	}; // adminpPreferences
	
	this.openPageNameModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::openPageNameModal::"+params.title);
		self.selectedParent = null;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "";
		}
		// get formfield form 
		var modalBody = document.getElementById('modalBody-prefsModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_PAGE_FORM;
		var fieldMValues = [];
		
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_PAGE_FORM_NAME":
					if (params.item != null && params.item.name != null){
						value = params.item.name;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_PAGE_FORM_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_PAGE_FORM_CATEGORY":
					var value = "";
					if (params.item != null && params.item.category != null){
						value = params.item.category;
					}
					self.form.selectRenderer({container:formWrapper,field:fields[i],item:params.item,value:value});
					break;
				case "APP_PAGE_FORM_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_PAGE_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_PAGE_FORM_TITLE_TEXT":
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
		jQuery('#prefsModal').modal({backdrop:"static",show:true});
	}; // openPageNameModal
	
	this.openPageNameDelete = function(params) {
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deletePageName(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openPageNameDelete
	
	this.deletePageName = function(params) {
		this.selectedParent = null;
		var deleteParams = {service:"APPPAGE_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deletePageName
	
	this.openFormFieldModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::openFormFieldModal::"+params.title);
		
		self.selectedParent = "tab_formfield-"+params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "";
		}
		// get formfield form 
		var modalBody = document.getElementById('modalBody-prefsModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_FORMFIELD_FORM;
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_FORMFIELD_NAME_NAME":
					if (params.item != null && params.item.name != null){
						value = params.item.name;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_FORMFIELD_NAME_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_FORMFIELD_NAME_FIELDTYPE":
					if (params.item != null && params.item.fieldType != null) {
						value = params.item.fieldType;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_ROWS":
					if (params.item != null && params.item.rows != null) {
						value = params.item.rows;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_COLS":
					if (params.item != null && params.item.cols != null) {
						value = params.item.cols;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_CLASSNAME":
					if (params.item != null && params.item.className != null) {
						value = params.item.className;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_GROUP":
					if (params.item != null && params.item.group != null) {
						value = params.item.group;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_SUBGROUP":
					if (params.item != null && params.item.subGroup != null) {
						value = params.item.subGroup;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_FORMFIELD_NAME_ARCHIVE":
					var boolValue = false;
					if (params.item != null && params.item.archive != null) {
						boolValue = params.item.archive;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_FORMFIELD_NAME_LOCKED":
					var boolValue = false;
					if (params.item != null && params.item.locked != null) {
						boolValue = params.item.locked;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_FORMFIELD_NAME_VALUES":
					if (params.item != null && params.item.values != null) {
						
					}
					subContainers.valuesContainer = self.panel.mtxtPanelRenderer({container:formWrapper});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_FORMFIELD_NAME_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_FORMFIELD_NAME_TITLE_TEXT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.langTexts != null) {
						value = params.item;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",languages:toastHub.languages,lang:toastHub.lang,field:fields[i],item:value});
					break;
				}
			} else if (fields[i].group == "MVALUES"){
				fieldMValues.push(fields[i]);
			}
		}
		
		var values = [];
		if (params.item != null && params.item.values != null){
		 values = params.item.values;
		}
		// Loop through available languages
		var languages = toastHub.languages;
		for(var l=0;l<languages.length;l++){
			if (languages[l].title.langTexts != null){
				var valueAvail = false;
				for (var i = 0; i < values.length; i++) {
					if (languages[l].code == values[i].lang) {
						valueAvail = true;
						// show existing languages on if they are active 
						var langText = toastHub.getLanguageText({lang:values[i].lang});
						this.mFormFieldValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:values[i].lang,fieldMValues:fieldMValues,item:values[i]});
					}
				}
				if (valueAvail == false) {
					var langText = toastHub.getLanguageText({lang:languages[l].code});
					this.mFormFieldValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:languages[l].code,fieldMValues:fieldMValues});
				}
			}
		}
		
		// open modal
		jQuery('#prefsModal').modal({backdrop:"static",show:true});
	}; //openFormFieldModal
	
	this.mFormFieldValueRenderer = function(params) {
		var langText = toastHub.getLanguageText({lang:params.lang});
		
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		//if (languages[l].defaultLang == true && params.field.required == true) {
		//	label.innerHTML = params.field.label +"<span class='required'>*</span> - " + langText;
		//} else {
			label.innerHTML = langText;
		//}
		formGroup.appendChild(label);
		var fieldMValues = params.fieldMValues;
		for (var j = 0; j < fieldMValues.length; j++) {
			var value = "";
			switch (fieldMValues[j].name) {		
			case "APP_FORMFIELD_VALUE_VALUE":
				if (params.item != null && params.item.value != null) {
					value = params.item.value;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_FORMFIELD_VALUE_LABEL":
				if (params.item != null && params.item.label != null) {
					value = params.item.label;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_FORMFIELD_VALUE_RENDERED":
				var boolValue = false;
				if (params.item != null && params.item.rendered != null) {
					boolValue = params.item.rendered;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			case "APP_FORMFIELD_VALUE_REQUIRED":
				var boolValue = false;
				if (params.item != null && params.item.required != null) {
					boolValue = params.item.required;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			}
		}
	}; // mFormFieldValueRenderer
	
	this.openFormFieldDelete = function(params) {
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteFormField(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openFormFieldDelete
	
	this.deleteFormField = function(params) {
		var deleteParams = {service:"APPFORMFIELD_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteFormField
	
	this.openLabelModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::openLabelModal::"+params.title);
		
		self.selectedParent = "tab_label-"+params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "";
		}
		// get formfield form 
		var modalBody = document.getElementById('modalBody-prefsModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_LABEL_FORM;
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_LABEL_NAME_NAME":
					if (params.item != null && params.item.name != null){
						value = params.item.name;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_LABEL_NAME_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_LABEL_NAME_OPTIONALPARAMS":
					if (params.item != null && params.item.optionalParams != null) {
						value = params.item.optionalParams;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_LABEL_NAME_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_LABEL_NAME_ARCHIVE":
					var boolValue = false;
					if (params.item != null && params.item.archive != null) {
						boolValue = params.item.archive;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_LABEL_NAME_LOCKED":
					var boolValue = false;
					if (params.item != null && params.item.locked != null) {
						boolValue = params.item.locked;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_LABEL_NAME_VALUES":
					if (params.item != null && params.item.values != null) {
						
					}
					subContainers.valuesContainer = self.panel.mtxtPanelRenderer({container:formWrapper});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_LABEL_NAME_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_LABEL_NAME_TITLE_TEXT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.langTexts != null) {
						value = params.item;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",languages:toastHub.languages,lang:toastHub.lang,field:fields[i],item:value});
					break;
				}
			} else if (fields[i].group == "MVALUES"){
				fieldMValues.push(fields[i]);
			}
		}
		
		var values = [];
		if (params.item != null && params.item.values != null){
		 values = params.item.values;
		}
		// Loop through available languages
		var languages = toastHub.languages;
		for(var l=0;l<languages.length;l++){
			if (languages[l].title.langTexts != null){
				var valueAvail = false;
				for (var i = 0; i < values.length; i++) {
					if (languages[l].code == values[i].lang) {
						valueAvail = true;
						// show existing languages on if they are active 
						var langText = toastHub.getLanguageText({lang:values[i].lang});
						this.mLabelValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:values[i].lang,fieldMValues:fieldMValues,item:values[i]});
					}
				}
				if (valueAvail == false) {
					var langText = toastHub.getLanguageText({lang:languages[l].code});
					this.mLabelValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:languages[l].code,fieldMValues:fieldMValues});
				}
			}
		}
		
		// open modal
		jQuery('#prefsModal').modal({backdrop:"static",show:true});
	}; //openLabelModal
	
	this.mLabelValueRenderer = function(params){
		var langText = toastHub.getLanguageText({lang:params.lang});
		
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		//if (languages[j].defaultLang == true && params.field.required == true) {
		//	label.innerHTML = params.field.label +"<span class='required'>*</span> - " + languages[j].title.langTexts[k].text;
		//} else {
			label.innerHTML = langText;
		//}
		formGroup.appendChild(label);
		var fieldMValues = params.fieldMValues;
		for (var j = 0; j < fieldMValues.length; j++) {
			var value = "";
			switch (fieldMValues[j].name) {		
			case "APP_LABEL_VALUE_VALUE":
				if (params.item != null && params.item.value != null) {
					value = params.item.value;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_LABEL_VALUE_RENDERED":
				var boolValue = false;
				if (params.item != null && params.item.rendered != null) {
					boolValue = params.item.rendered;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			}
		}
	}; // mLabelValueRenderer
	
	this.openLabelDelete = function(params) {
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteLabel(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openLabelDelete
	
	this.deleteLabel = function(params) {
		var deleteParams = {service:"APPLABEL_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteLabel
	
	this.openTextModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::openTextModal::"+params.title);
		
		self.selectedParent = "tab_text-"+params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "";
		}
		// get text form 
		var modalBody = document.getElementById('modalBody-prefsModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = [];
		if (self.pageFormFields != null && self.pageFormFields.APP_TEXT_FORM != null) {
			fields = self.pageFormFields.APP_TEXT_FORM;
		}
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_TEXT_NAME_NAME":
					if (params.item != null && params.item.name != null){
						value = params.item.name;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_TEXT_NAME_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_TEXT_NAME_OPTIONALPARAMS":
					if (params.item != null && params.item.optionalParams != null) {
						value = params.item.fieldType;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_TEXT_NAME_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_TEXT_NAME_ARCHIVE":
					var boolValue = false;
					if (params.item != null && params.item.archive != null) {
						boolValue = params.item.archive;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_TEXT_NAME_LOCKED":
					var boolValue = false;
					if (params.item != null && params.item.locked != null) {
						boolValue = params.item.locked;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_TEXT_NAME_VALUES":
					if (params.item != null && params.item.values != null) {
						
					}
					subContainers.valuesContainer = self.panel.mtxtPanelRenderer({container:formWrapper});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_TEXT_NAME_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_TEXT_NAME_TITLE_TEXT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.langTexts != null) {
						value = params.item;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",languages:toastHub.languages,lang:toastHub.lang,field:fields[i],item:value});
					break;
				}
			} else if (fields[i].group == "MVALUES"){
				fieldMValues.push(fields[i]);
			}
		}
		
		var values = [];
		if (params.item != null && params.item.values != null){
		 values = params.item.values;
		}
		// Loop through available languages
		var languages = toastHub.languages;
		for(var l=0;l<languages.length;l++){
			if (languages[l].title.langTexts != null){
				var valueAvail = false;
				for (var i = 0; i < values.length; i++) {
					if (languages[l].code == values[i].lang) {
						valueAvail = true;
						// show existing languages on if they are active 
						var langText = toastHub.getLanguageText({lang:values[i].lang});
						this.mTextValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:values[i].lang,fieldMValues:fieldMValues,item:values[i]});
					}
				}
				if (valueAvail == false) {
					var langText = toastHub.getLanguageText({lang:languages[l].code});
					this.mTextValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:languages[l].code,fieldMValues:fieldMValues});
				}
			}
		}
		
		
		// open modal
		jQuery('#prefsModal').modal({backdrop:"static",show:true});
	}; //openTextModal
	
	this.mTextValueRenderer = function(params) {
		// show existing languages on if they are active 
		var langText = toastHub.getLanguageText({lang:params.lang});
		
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		//if (languages[j].defaultLang == true && params.field.required == true) {
		//	label.innerHTML = params.field.label +"<span class='required'>*</span> - " + languages[j].title.langTexts[k].text;
		//} else {
			label.innerHTML = langText;
		//}
		formGroup.appendChild(label);
		var fieldMValues = params.fieldMValues;
		for (var j = 0; j < fieldMValues.length; j++) {
			var value = "";
			switch (fieldMValues[j].name) {		
			case "APP_TEXT_VALUE_VALUE":
				if (params.item != null && params.item.value != null) {
					value = params.item.value;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_TEXT_VALUE_RENDERED":
				var boolValue = false;
				if (params.item != null && params.item.rendered != null) {
					boolValue = params.item.rendered;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			}
		}
	}; // mTextValueRenderer
	
	this.openTextDelete = function(params) {
		self.selectedItem = params.item.id;
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteText(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openTextDelete
	
	this.deleteText = function(params) {
		var deleteParams = {service:"APPTEXT_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteText
	
	this.openOptionModal = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-preference::toastHubPreference::openOptionModal::"+params.title);
		
		self.selectedParent = "tab_option-"+params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "";
		}
		// get option form 
		var modalBody = document.getElementById('modalBody-prefsModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_OPTION_FORM;
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_OPTION_NAME_NAME":
					if (params.item != null && params.item.name != null){
						value = params.item.name;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_OPTION_NAME_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_OPTION_NAME_VALUETYPE":
					if (params.item != null && params.item.valueType != null) {
						value = params.item.valueType;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_OPTION_NAME_DEFAULTVALUE":
					if (params.item != null && params.item.defaultValue != null) {
						value = params.item.defaultValue;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_OPTION_NAME_USEDEFAULT":
					var boolValue = false;
					if (params.item != null && params.item.useDefault != null) {
						boolValue = params.item.useDefault;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_OPTION_NAME_OPTIONALPARAMS":
					if (params.item != null && params.item.optionalParams != null) {
						value = params.item.optionalParams;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "APP_OPTION_NAME_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_OPTION_NAME_ARCHIVE":
					var boolValue = false;
					if (params.item != null && params.item.archive != null) {
						boolValue = params.item.archive;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_OPTION_NAME_LOCKED":
					var boolValue = false;
					if (params.item != null && params.item.locked != null) {
						boolValue = params.item.locked;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_OPTION_NAME_VALUES":
					if (params.item != null && params.item.values != null) {
						
					}
					subContainers.valuesContainer = self.panel.mtxtPanelRenderer({container:formWrapper});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_OPTION_NAME_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_OPTION_NAME_TITLE_TEXT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.langTexts != null) {
						value = params.item;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",languages:toastHub.languages,lang:toastHub.lang,field:fields[i],item:value});
					break;
				}
			} else if (fields[i].group == "MVALUES"){
				fieldMValues.push(fields[i]);
			}
		}
		
		var values = [];
		if (params.item != null && params.item.values != null){
		 values = params.item.values;
		}
		// Loop through available languages
		var languages = toastHub.languages;
		for(var l=0;l<languages.length;l++){
			if (languages[l].title.langTexts != null){
				var valueAvail = false;
				for (var i = 0; i < values.length; i++) {
					if (languages[l].code == values[i].lang) {
						valueAvail = true;
						// show existing languages on if they are active 
						var langText = toastHub.getLanguageText({lang:values[i].lang});
						this.mOptionValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:values[i].lang,fieldMValues:fieldMValues,item:values[i]});
					}
				}
				if (valueAvail == false) {
					var langText = toastHub.getLanguageText({lang:languages[l].code});
					this.mOptionValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:languages[l].code,fieldMValues:fieldMValues});
				}
			}
		}
		
		// open modal
		jQuery('#prefsModal').modal({backdrop:"static",show:true});
	}; //openOptionModal
	
	this.mOptionValueRenderer = function(params) {
		// show existing languages on if they are active 
		var langText = toastHub.getLanguageText({lang:params.lang});
		
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		//if (languages[j].defaultLang == true && params.field.required == true) {
		//	label.innerHTML = params.field.label +"<span class='required'>*</span> - " + languages[j].title.langTexts[k].text;
		//} else {
			label.innerHTML = langText;
		//}
		formGroup.appendChild(label);
		var fieldMValues = params.fieldMValues;
		for (var j = 0; j < fieldMValues.length; j++) {
			var value = "";
			switch (fieldMValues[j].name) {		
			case "APP_OPTION_VALUE_VALUE":
				if (params.item != null && params.item.value != null) {
					value = params.item.value;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_OPTION_VALUE_VALIDATION":
				if (params.item != null && params.item.validation != null) {
					value = params.item.validation;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_OPTION_VALUE_RENDERED":
				var boolValue = false;
				if (params.item != null && params.item.rendered != null) {
					boolValue = params.item.rendered;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			}
		}
		
	}; // mOptionValueRenderer
	
	this.openOptionDelete = function(params) {
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteOption(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openOptionDelete
	
	this.deleteOption = function(params) {
		var deleteParams = {service:"APPOPTION_SVC",action:"DELETE",itemId:parseInt(self.id),callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteOption
	
	this.savePref = function(params) {
		if (self.selectedParent != null) {
			if (self.selectedParent.indexOf("formfield") >= 0) {
				var valid = toastHub.utils.validateFields(self.pageFormFields.APP_FORMFIELD_FORM,toastHub.lang,toastHub.languages,"MAIN");
				if (valid == true) {
					var result = toastHub.utils.marshallFields(self.pageFormFields.APP_FORMFIELD_FORM,toastHub.lang,toastHub.languages);
					var id = self.selectedItem;
					var saveParams = {service:"APPFORMFIELD_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_FORMFIELD_FORM"],inputFields:result};
					if (id == ""){
						var x = self.selectedParent.split("-");
						saveParams.parentId = parseInt(x[1]);
					}
					self.callService(saveParams);
				}
			} else if (self.selectedParent.indexOf("label") >= 0) {
				var valid = toastHub.utils.validateFields(self.pageFormFields.APP_LABEL_FORM,toastHub.lang,toastHub.languages,"MAIN");
				if (valid == true) {
					var result = toastHub.utils.marshallFields(self.pageFormFields.APP_LABEL_FORM,toastHub.lang,toastHub.languages);
					var id = self.selectedItem;
					var saveParams = {service:"APPLABEL_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_LABEL_FORM"],inputFields:result};
					if (id == ""){
						var x = self.selectedParent.split("-");
						saveParams.parentId = parseInt(x[1]);
					}
					self.callService(saveParams);
				}
			} else if (self.selectedParent.indexOf("text") >= 0) {
				var valid = toastHub.utils.validateFields(self.pageFormFields.APP_TEXT_FORM,toastHub.lang,toastHub.languages,"MAIN");
				if (valid == true) {
					var result = toastHub.utils.marshallFields(self.pageFormFields.APP_TEXT_FORM,toastHub.lang,toastHub.languages);
					var id = self.selectedItem;
					var saveParams = {service:"APPTEXT_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_TEXT_FORM"],inputFields:result};
					if (id == ""){
						var x = self.selectedParent.split("-");
						saveParams.parentId = parseInt(x[1]);
					}
					self.callService(saveParams);
				}
			} else if (self.selectedParent.indexOf("option") >= 0) {
				var valid = toastHub.utils.validateFields(self.pageFormFields.APP_OPTION_FORM,toastHub.lang,toastHub.languages,"MAIN");
				if (valid == true) {
					var result = toastHub.utils.marshallFields(self.pageFormFields.APP_OPTION_FORM,toastHub.lang,toastHub.languages);
					var id = self.selectedItem;
					var saveParams = {service:"APPOPTION_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_OPTION_FORM"],inputFields:result};
					if (id == ""){
						var x = self.selectedParent.split("-");
						saveParams.parentId = parseInt(x[1]);
					}
					self.callService(saveParams);
				}
			}
		} else {
			var valid = toastHub.utils.validateFields(self.pageFormFields.APP_PAGE_FORM,toastHub.lang,toastHub.languages,"MAIN");
			if (valid == true) {
				var result = toastHub.utils.marshallFields(self.pageFormFields.APP_PAGE_FORM,toastHub.lang,toastHub.languages);
				var id = self.selectedItem;
				var saveParams = {service:"APPPAGE_SVC",action:"SAVE",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_PAGE_FORM"],inputFields:result};
				self.callService(saveParams);
			}
		}
	}; // save
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#prefsModal').modal('toggle');
			this.updateItems();
		} else {
			alert("error");
		}
	}; // saveCallBack
	
	this.deleteCallBack = function(JSONData) {
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1 
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#acknowledgeModal').modal('toggle');
			this.updateItems();
		} else {
			alert("error");
		}
	}; // deleteCallBack
	
	
	this.searchClick = function(e){
		if (e.keyCode == null || e.keyCode == 13) {
			var params = {category:this.category};
			this.getList(params);
		}
	}
}