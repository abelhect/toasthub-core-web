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

toastHubPageOptions.prototype = Object.create(toastHubBase.prototype);
toastHubPageOptions.prototype.constructor = toastHubPageOptions;

function toastHubPageOptions(instanceName){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "PAGE_OPTIONS_SVC";
	this.pageMetaName = "ADMIN_PAGE_OPTIONS";
	this.listArea = null;
	this.formArea = null;
	this.subMenuArea = null;
	var self = this;
	
	this.initCustom = function(params){
		params.sysPageFormName = "ADMIN_PAGE_OPTIONS";
	}; // initCustom
	
	this.processInit = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-page_options::toastHubPageOptions::processInit");
		// list
		this.listArea = document.createElement("DIV");
		this.listArea.id = "list-area";
		toastHub.containerContentObj.appendChild(this.listArea);
		
		// form
		this.formArea = document.createElement("DIV");
		this.formArea.id = "form-area";
		toastHub.containerContentObj.appendChild(this.formArea);
		jQuery("#form-area").dialog({ autoOpen: false, modal:true, minWidth:600, width:800 });
		
		// subMenu
		this.subMenuArea = document.createElement("DIV");
		this.subMenuArea.id = "sub-menu-area";
		toastHub.containerContentObj.appendChild(this.subMenuArea);
		jQuery("#sub-menu-area").dialog({ autoOpen: false, modal:true, minWidth:600, width:800 });
		
		JSONData.params.itemName = "AppUser";
		JSONData.params.listName = "ADMIN_USER_LIST1";
		
		this.processList(JSONData);
	}; // processInit
	
	
	this.processList = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-page_options::toastHubPageOptions::processList");
		var params = JSONData.params;
		params.controllerName = "users";
		params.container = this.listArea;
		params.editOnClick = function(id){ return function(){toastHub.getController("users").edit({itemId:id,itemName:"AppUser",sysPageFormName:"ADMIN_USERS_FORM_EDIT",sysPageTextName:"ADMIN_USERS_FORM_EDIT"});}; };
		toastHub.utils.simpleList(params);
		
	}; // processList
	
	this.openEditForm = function(JSONData){
		toastHub.logSystem.log("DEBUG","es-users:esUsers:edit");
		this.formCache = JSONData;
		var container = document.getElementById('form-area');
		container.innerHTML = "";
		
		if (JSONData != null && JSONData.params != null){
			if ( JSONData.params.item != null ) {
				JSONData.params.sysPageFormName = "ADMIN_USERS_FORM_EDIT";
				JSONData.params.sysPageTextName = "ADMIN_USERS_FORM_EDIT";
				JSONData.params.headerModifyTxt = 'ADMIN_USERS_FORM_EDIT_HEADER';
				JSONData.params.headerCreateTxt = 'ADMIN_USER_EDIT_FORM_CREATE_HEADER';
				JSONData.params.container = container;
				JSONData.params.group = 'MAIN';
				JSONData.params.showHeader = true;
				JSONData.params.showSave = true;
				JSONData.params.saveOnClick = function(){ pSelf.validateForm(); };
				JSONData.params.showClose = true;
				JSONData.params.closeOnClick = function(){ jQuery("#form-area").dialog("close"); };
				JSONData.params.pageTextsType = "sysPageTexts";
				JSONData.params.pageFormFieldsType = "sysPageFormFields";
				toastHub.utils.simpleFormRenderer(JSONData.params);
			}
		} else {

			container.innerHTML = "Missing Params";
		}
		
		jQuery("#form-area").dialog("open");
	}; // edit
	
	this.searchUsers = function(){
		
	}; // searchUsers
}