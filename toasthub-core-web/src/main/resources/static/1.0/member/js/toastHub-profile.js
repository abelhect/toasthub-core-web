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

toastHubProfile.prototype = Object.create(toastHubBase.prototype);
toastHubProfile.prototype.constructor = toastHubProfile;

function toastHubProfile(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "member";
	this.service = "MEMBER_SVC";
	this.userProfile = null;
	this.mainContainer = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	
	
	var self = parent;

	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-profile::toastHubProfile::initCustom");
		params.category = this.category;
		params.action = "INIT_PROFILE";
		params.appForms = ["USER_PROFILE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","USER_PROFILE_PAGE"];
		//params.appLabels = ["ADMIN_LANGUAGE_FORM"];
	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-profile::toastHubProfile::initContent");
		self.userProfile = params.item;
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,contentId:"content-area",header:true});
		
		
		
		this.processProfile(params);
	}; // initContent
	
	
	this.processProfile = function(params){
		
		var test = document.createElement("H2");
		test.innerHTML = self.pageTexts.USER_PROFILE_PAGE.USER_PROFILE_PAGE_HEADER.value;
		self.contentArea.appendChild(test);
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = "profile_form";
		formWrapper.className = "form-horizontal form-label-left";
		self.contentArea.appendChild(formWrapper);
		
		var fields = self.pageFormFields.USER_PROFILE_FORM;
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "USER_PROFILE_FORM_FIRSTNAME":
					if (params.item != null && params.item.firstname != null){
						value = params.item.firstname;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "USER_PROFILE_FORM_MIDDLENAME":
					if (params.item != null && params.item.middlename != null) {
						value = params.item.middlename;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "USER_PROFILE_FORM_LASTNAME":
					if (params.item != null && params.item.lastname != null) {
						value = params.item.lastname;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "USER_PROFILE_FORM_USERNAME":
					if (params.item != null && params.item.username != null) {
						value = params.item.username;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:"modify"});
					break;
				case "USER_PROFILE_FORM_EMAIL":
					if (params.item != null && params.item.email != null) {
						value = params.item.email;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "USER_PROFILE_FORM_ZIPCODE":
					if (params.item != null && params.item.zipcode != null) {
						value = params.item.zipcode;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value});
					break;
				case "USER_PROFILE_FORM_LANGUAGE":
					if (params.item != null && params.item.lang != null) {
						value = params.item.lang;
					}
					self.form.selectRenderer({container:formWrapper,field:fields[i],item:params.item,value:value});
					break;
				}
			}
		}
		var buttonAccept = document.createElement("BUTTON");
		buttonAccept.type = "button";
		buttonAccept.className = "btn btn-primary";
		buttonAccept.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_BUTTON_ACCEPT.value;
		buttonAccept.onclick = self.saveProfile;
		formWrapper.appendChild(buttonAccept);
	}; // processProfile
	
	this.saveProfile = function(params) {
		var valid = toastHub.utils.validateFields(self.pageFormFields.USER_PROFILE_FORM,toastHub.lang,toastHub.languages,"MAIN");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.USER_PROFILE_FORM,toastHub.lang,toastHub.languages);
			var saveParams = {service:"MEMBER_SVC",action:"SAVE_PROFILE",callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["USER_PROFILE_FORM"],inputFields:result};
			self.callService(saveParams);
		}
	}; // saveProfile
	
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			location.reload();
		} else {
			alert("error");
		}
	}; // saveCallBack
} // toastHubProfile