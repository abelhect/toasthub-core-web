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

//inherit base class
toastHubUserManager.prototype = Object.create(toastHubBase.prototype);
// reassign constructor
toastHubUserManager.prototype.constructor = toastHubUserManager;

////////////////////////////////////////////////////// User Manager ////////////////////////////////////////////////
function toastHubUserManager(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "login";
	this.service = "LOGIN_SVC"
	this.registerParams = null;
	this.registerResult = null;
	this.loginAlertSuccess = null;
	this.loginAlertDanger = null;
	this.cycle = null;
	this.username = null;
	this.usernameObj = null;
	this.usernameGood = false;
    this.firstNameObj = null;
    this.firstNameGood = false;
    this.middleNameObj = null;
    this.middleNameGood = false;
    this.lastNameObj = null;
    this.lastNameGood = false;
    this.wrapper = null;
    this.passwordObj = null;
    this.passwordStatus = null;
    this.cPasswordObj = null;
    this.cPasswordStatus = null;
    this.passwordGood = false;
    this.submitObj = null;
    this.searchObj = null;
    this.minlength = 8;
    this.maxlength = 16;
    this.showRegiser = true;
    var self = parent;
	/////////////////////////////////// init Login ///////////////////////////
	
    this.initCustom = function(params){
    	toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::initCustom");
    	params.appForms = ["LOGIN_FORM","REGISTRATION_FORM","FORGOTPASSWORD_FORM","PASSWORD_CHANGE_FORM"];
		params.appTexts = ["GLOBAL_PAGE","LOGIN_FORM","REGISTRATION_FORM","FORGOTPASSWORD_FORM","PASSWORD_CHANGE_FORM"];
		params.appLabels = ["LOGIN_FORM","REGISTRATION_FORM"];
		params.appOptions = ["REGISTRATION_FORM"];
		// check to see if this is just a login or a confirmation of a login
		var q = toastHub.utils.queryString();
    	if (q.username != null && q.token != null){
    		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::confirmToken");
    		params.inputFields = {"CONFIRM_EMAIL_SERVICE_USERNAME":q.username,"CONFIRM_EMAIL_SERVICE_TOKEN":q.token}; 
    		params.urlaction = q.action;
    	}
    };
    
    this.initContent = function(params){
    	toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::initContent",params);
    	self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.pageOptions = params.appPageOptions;
		self.mainContainer = params.container;
    	// add header
    	var header = document.createElement("header");
		self.mainContainer.appendChild(header);
		toastHub.containerContentObj = header;
		params.container = header;
    	
    	this.loginRenderer(params);
    }; // processPage
	
    //////////////////////////////////////////// Login
    
	this.loginRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::loginRenderer");
		var alertMessage = "";

		var container = document.createElement("DIV");
		container.className = "intro-text";
		params.container.appendChild(container);
		this.registerResult = container;
		var row = document.createElement("DIV");
		row.className = "row";
		container.appendChild(row);
		
		var column = document.createElement("DIV");
		column.id = "content_column";
		column.className = "col-md-6 col-md-offset-3";
		row.appendChild(column);
		
		var panel = document.createElement("DIV");
		panel.className = "panel panel-login";
		column.appendChild(panel);

		var panelHeading = document.createElement("DIV");
		panelHeading.className = "panel-heading";
		panel.appendChild(panelHeading);
		
		var rowHeading = document.createElement("DIV");
		rowHeading.className = "row";
		panelHeading.appendChild(rowHeading);
		
		var col1 = document.createElement("DIV");
		col1.className = "col-xs-6";
		col1.innerHTML = "<a href='#' class='active' id='login-form-link'>".concat(self.pageTexts.LOGIN_FORM.LOGIN_FORM_HEADER.value).concat("</a>");
		rowHeading.appendChild(col1);
		
		if (self.pageOptions != null && self.pageOptions.REGISTRATION_FORM != null && self.pageOptions.REGISTRATION_FORM.REGISTRATION_SHOW_FORM.value == "true") {
			var col2 = document.createElement("DIV");
			col2.className = "col-xs-6";
			col2.innerHTML = "<a href='#' class='active' id='register-form-link'>Register</a>";
			rowHeading.appendChild(col2);
		}
		
		// status
		var panelStatus = document.createElement("DIV");
		panelStatus.id = "login-status";
		panelStatus.style.display = "none";
		panelStatus.setAttribute("role","alert");
		column.appendChild(panelStatus);
		
		// status for email confirm
		if(params.statusMessage != null && params.statusMessage[0].code == "SUCCESS"){
			panelStatus.className = "alert alert-success";
			panelStatus.style.display = "block";
			panelStatus.innerHTML = params.statusMessage[0].message;
		} else if (params.statusMessage != null && params.statusMessage[0].code == "EXECUTIONFAILED") {
			panelStatus.className = "alert alert-danger";
			panelStatus.style.display = "block";
			panelStatus.innerHTML = params.statusMessage[0].message;
		}
		
		// forms
		var panel2 = document.createElement("DIV");
		panel2.className = "panel-body";
		column.appendChild(panel2);
		
		var panel2Row = document.createElement("DIV");
		panel2Row.className = "row";
		panel2.appendChild(panel2Row);
		
		var panel2Col = document.createElement("DIV");
		panel2Col.className = "col-lg-12";
		panel2Row.appendChild(panel2Col);
		
		var loginForm = document.createElement("DIV");
		loginForm.id = "login-form";
		loginForm.style.display="block";
		panel2Col.appendChild(loginForm);
	
		params.container = loginForm;
		params.group = 'MAIN';
		params.formName = 'LOGIN_FORM';
		var formFields = self.pageFormFields.LOGIN_FORM;
		
		// render fields
		for( var i = 0, len = formFields.length; i < len; i++ ) {
			params.formField = formFields[i];
			if (params.formField.name == "LOGIN_FORM_PASSWORD") {
				params.onkeyup = function(e) { 
					e.preventDefault();
					if (e.keyCode == 13) {
						self.authenticate();
					}
				};
			}
			toastHub.utils.fieldRenderer(params);
			params.onkeyup = null;
			params.formField = null;
		}
		
		// remember me checkbox
		if (self.pageTexts.LOGIN_FORM.LOGIN_FORM_REMEMBER_ME != null && self.pageTexts.LOGIN_FORM.LOGIN_FORM_REMEMBER_ME.rendered == true){
			params.textItem = self.pageTexts.LOGIN_FORM.LOGIN_FORM_REMEMBER_ME;
			this.rememberMeRenderer(params);
			params.textItem = null;
		}
		
		// Login button
		if (self.pageLabels.LOGIN_FORM.length > 0) {
			params.onclick = function() { self.authenticate(); };
			params.buttons = self.pageLabels.LOGIN_FORM;
			this.buttonRenderer(params);
			params.onclick = null;
			params.buttons = null;
		}
		
		// Forgot Password link
		if (self.pageTexts.LOGIN_FORM.LOGIN_FORM_FORGOT_PASSWORD != null && self.pageTexts.LOGIN_FORM.LOGIN_FORM_FORGOT_PASSWORD.rendered == true){
			params.textItem = self.pageTexts.LOGIN_FORM.LOGIN_FORM_FORGOT_PASSWORD;
			this.forgotPassLink(params);
			params.textItem = null;
		}
		
		// Change Password link
		if (self.pageTexts.LOGIN_FORM.LOGIN_FORM_CHANGE_PASSWORD != null && self.pageTexts.LOGIN_FORM.LOGIN_FORM_CHANGE_PASSWORD.rendered == true){
			params.textItem = self.pageTexts.LOGIN_FORM.LOGIN_FORM_CHANGE_PASSWORD;
			this.changePassLink(params);
			params.textItem = null;
		}
		
		this.addLoginActions();
		
		// register 
		if (self.pageOptions != null && self.pageOptions.REGISTRATION_FORM != null && self.pageOptions.REGISTRATION_FORM.REGISTRATION_SHOW_FORM.value == "true") {
			
			var registerForm = document.createElement("DIV");
			registerForm.id = "register-form";
			registerForm.style.display="none";
			panel2Col.appendChild(registerForm);
			
			this.registerParams = params;
			this.registerParams.container = registerForm;
			this.registerParams.group = 'MAIN';
			this.registerParams.formName = 'REGISTRATION_FORM';
			this.registerParams.onclick = function() { self.validateRegistration(); };
			this.registerParams.formFields = self.pageFormFields.REGISTRATION_FORM;
			
			// render fields
			for( var i = 0, len = this.registerParams.formFields.length; i < len; i++ ) {
				params.formField = this.registerParams.formFields[i];
				if (this.registerParams.formFields[i].name == "REGISTRATION_FORM_PASSWORD") {
					this.registerParams.onfocus = function() { self.showPasswordChart({"formName":"REGISTRATION_FORM"}); };
					this.registerParams.onkeyup = function() { self.checkPasswordChart({"formName":"REGISTRATION_FORM","passwordId":"REGISTRATION_FORM-REGISTRATION_FORM_PASSWORD"}); };
					this.registerParams.onblur = function() { self.checkPasswordChart({"formName":"REGISTRATION_FORM","passwordId":"REGISTRATION_FORM-REGISTRATION_FORM_PASSWORD"}); };
					toastHub.utils.fieldRenderer(this.registerParams);
					this.passwordChart(params);
					this.registerParams.onfocus = null;
					this.registerParams.onkeyup = null;
					this.registerParams.onblur = null;
				} else if (this.registerParams.formFields[i].name == "REGISTRATION_FORM_VERIFYPASSWORD") {
					this.registerParams.onfocus = function() { self.showMatchPassword({"formName":"REGISTRATION_FORM"}); };
					this.registerParams.onkeyup = function(e) { self.checkMatchPassword({"e":e,"formName":"REGISTRATION_FORM","passwordId":"REGISTRATION_FORM-REGISTRATION_FORM_PASSWORD","verifyPasswordId":"REGISTRATION_FORM-REGISTRATION_FORM_VERIFYPASSWORD"});};
					this.registerParams.onblur = function() { self.checkMatchPassword({"formName":"REGISTRATION_FORM","passwordId":"REGISTRATION_FORM-REGISTRATION_FORM_PASSWORD","verifyPasswordId":"REGISTRATION_FORM-REGISTRATION_FORM_VERIFYPASSWORD"}); };
					toastHub.utils.fieldRenderer(this.registerParams);
					this.matchPassword(params);
					this.registerParams.onfocus = null;
					this.registerParams.onkeyup = null;
					this.registerParams.onblur = null;
				} else {
					toastHub.utils.fieldRenderer(this.registerParams);
				}
			}
			
			if (self.pageLabels.REGISTRATION_FORM.length > 0) {
				params.buttons = self.pageLabels.REGISTRATION_FORM;
				this.buttonRenderer(params);
			}
			this.addRegisterActions();
		}
		
	}; //loginRenderer
	
	this.addLoginActions = function(){
	    jQuery('#login-form-link').click(function(e) {
			jQuery("#login-form").delay(100).fadeIn(100);
	 		jQuery("#register-form").fadeOut(100);
			jQuery('#register-form-link').removeClass('active');
			jQuery(this).addClass('active');
			toastHub.getController("usermanager").statusPanelClear("login-status");
			e.preventDefault();
		});
	}; // addLoginActions
	
	this.addRegisterActions = function(){
	    
		jQuery('#register-form-link').click(function(e) {
			jQuery("#register-form").delay(100).fadeIn(100);
	 		jQuery("#login-form").fadeOut(100);
			jQuery('#login-form-link').removeClass('active');
			jQuery(this).addClass('active');
			toastHub.getController("usermanager").statusPanelClear("login-status");
			e.preventDefault();
		});
	}; // addRegisterActions
	
	this.passwordChart = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::passwordChart");
		
		var wrap = document.createElement("DIV");
		wrap.id = params.formName.concat("-PASSWORD_CHART_WRAP");
		wrap.style.display = "none";
		wrap.className = "form-group";
		params.container.appendChild(wrap);
		
		var row = document.createElement("DIV");
		row.className = "row";
		wrap.appendChild(row);
		
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_ALPHA_CHECK != null) {
			var alpha = document.createElement("DIV");
			alpha.id = params.formName.concat("-REGISTRATION_FORM_ALPHA_CHECK");
			alpha.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_ALPHA_CHECK.value;			
			wrap.appendChild(alpha);
		}
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_CAPITAL_CHECK != null) {
			var capital = document.createElement("DIV");
			capital.id = params.formName.concat("-REGISTRATION_FORM_CAPITAL_CHECK");
			capital.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_CAPITAL_CHECK.value;			
			wrap.appendChild(capital);
		}
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_NUMBER_CHECK != null) {
			var number = document.createElement("DIV");
			number.id = params.formName.concat("-REGISTRATION_FORM_NUMBER_CHECK");
			number.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_NUMBER_CHECK.value;			
			wrap.appendChild(number);
		}
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_SPECIAL_CHECK != null) {
			var special = document.createElement("DIV");
			special.id = params.formName.concat("-REGISTRATION_FORM_SPECIAL_CHECK");
			special.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_SPECIAL_CHECK.value;			
			wrap.appendChild(special);
		}
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_COUNT_CHECK != null) {
			var count = document.createElement("DIV");
			count.id = params.formName.concat("-REGISTRATION_FORM_COUNT_CHECK");
			count.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_COUNT_CHECK.value;			
			wrap.appendChild(count);
		}
		
		var chart = document.createElement("DIV");
	}; // passwordChart
	
	this.showPasswordChart = function(params) {
		var wrap = document.getElementById(params.formName.concat("-PASSWORD_CHART_WRAP"));
		wrap.style.display = "block";
	}; // updatePasswordChart
	
	this.checkPasswordChart = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::checkPasswordChart");
		var pass = document.getElementById(params.passwordId).value;
		
		var alpha = document.getElementById(params.formName.concat("-REGISTRATION_FORM_ALPHA_CHECK"));
		if (this.containsAlpha(pass) == 1) {
			 alpha.style.color = "green";
		 } else {
			 alpha.style.color = "#FFFFFF";
		 }
		 var number = document.getElementById(params.formName.concat("-REGISTRATION_FORM_NUMBER_CHECK"));
		 if (this.containsNumeric(pass) == 1){
			 number.style.color = "green";
		 } else {
			 number.style.color = "#FFFFFF";
		 }
		 var upper = document.getElementById(params.formName.concat("-REGISTRATION_FORM_CAPITAL_CHECK"));
		 if (this.containsUpperCase(pass) == 1) {
			 upper.style.color = "green";
		 } else {
			 upper.style.color = "#FFFFFF";
		 }
		 var special = document.getElementById(params.formName.concat("-REGISTRATION_FORM_SPECIAL_CHECK"));
		 if (this.containsSpecialCharacter(pass) == 1) {
			 special.style.color = "green";
		 } else {
			 special.style.color = "#FFFFFF";
		 }
		 var count = document.getElementById(params.formName.concat("-REGISTRATION_FORM_COUNT_CHECK"));
		 if (pass.length >= 8) {
			 count.style.color = "green";
		 } else {
			 count.style.color = "#FFFFFF";
		 }
	}; // checkPasswordChart
	
	this.matchPassword = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::passwordChart");
		
		var wrap = document.createElement("DIV");
		wrap.id = params.formName.concat("-PASSWORD_MATCH_WRAP");
		wrap.style.display = "none";
		wrap.className = "form-group";
		params.container.appendChild(wrap);
		
		var row = document.createElement("DIV");
		row.className = "row";
		wrap.appendChild(row);
		
		if (self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_MATCH_CHECK != null) {
			var match = document.createElement("DIV");
			match.id = params.formName.concat("-REGISTRATION_FORM_MATCH_CHECK");
			match.innerHTML = self.pageTexts.REGISTRATION_FORM.REGISTRATION_FORM_MATCH_CHECK.value;			
			wrap.appendChild(match);
		}
	}; // matchPassword
	
	this.showMatchPassword = function(params) {
		var wrap = document.getElementById(params.formName.concat("-PASSWORD_MATCH_WRAP"));
		wrap.style.display = "block";
	}; // showMatchPassword
	
	this.checkMatchPassword = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::checkMatchPassword");
		var pass = document.getElementById(params.passwordId).value;
		var verify = document.getElementById(params.verifyPasswordId).value;
		
		var match = document.getElementById(params.formName.concat("-REGISTRATION_FORM_MATCH_CHECK"));
		if (pass == verify) {
			 match.style.color = "green";
		 } else {
			 match.style.color = "#FFFFFF";
		 }
		if (params.e != null) {
			params.e.preventDefault();
			if (params.e.keyCode == 13) {
				if (params.formName == "REGISTRATION_FORM"){
					this.validateRegistration();
				} else if (params.formName == "PASSWORD_CHANGE_FORM") {
					this.changePassword();
				}
			}
		}
	}; // checkMatchPassword
	
	this.rememberMeRenderer = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::rememberMeRenderer");
		var wrap = document.createElement("DIV");
		wrap.className = "form-group text-center";
		params.container.appendChild(wrap);
		
		var input = document.createElement("INPUT");
		input.className = "";
		input.type = "checkbox";
		if (params.textItem.tabIndex != null){
			input.tabindex = params.textItem.tabIndex;
		}
		input.name = params.textItem.name;
		input.id = params.textItem.name;
		wrap.appendChild(input);
		
		var label = document.createElement("label");
		label.setAttribute("for","remember");
		label.innerHTML = params.textItem.value;
		wrap.appendChild(label);
		
	}; // rememberMeRenderer
	
	this.buttonRenderer = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::buttonRenderer");
		var wrap = document.createElement("DIV");
		wrap.className = "form-group";
		params.container.appendChild(wrap);
		
		var row = document.createElement("DIV");
		row.className = "row";
		wrap.appendChild(row);
		
		var col = document.createElement("DIV");
		col.className = "col-sm-6 col-sm-offset-3";
		row.appendChild(col);
		if (params.buttons != null) {
			for( var i = 0, len = params.buttons.length; i < len; i++ ) {
				var input = document.createElement("INPUT");
				input.type = "submit";
				input.name = params.buttons[i].name;
				if (params.buttons[i].tabIndex != null) {
					input.setAttribute("tabindex",params.buttons[i].tabIndex);
				}
				input.id = params.buttons[i].name;
				if (params.buttons[i].className != null) {
					input.className = params.buttons[i].className;
				} else {
					input.className = "btn btn-xl";
				}
				input.value = params.buttons[i].value;
				input.onclick = params.onclick;
				col.appendChild(input);
			}
		} else if (params.button != null ) {
			var input = document.createElement("INPUT");
			input.type = "submit";
			input.name = params.button.name;
			if (params.button.tabIndex != null) {
				input.setAttribute("tabindex",params.button.tabIndex);
			}
			input.id = params.button.name;
			if (params.button.className != null) {
				input.className = params.button.className;
			} else {
				input.className = "btn btn-xl";
			}
			input.value = params.button.value;
			input.onclick = params.onclick;
			col.appendChild(input);
		}
	}; //buttonRenderer
	
	this.authenticate = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::authenticate");
		this.statusPanelClear("login-status");
		
		var valid = toastHub.utils.validateFields(self.pageFormFields.LOGIN_FORM,toastHub.lang,toastHub.languages,"MAIN","LOGIN_FORM");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.LOGIN_FORM,toastHub.lang,toastHub.languages,"LOGIN_FORM");
			var params = toastHub.initParams();
			var tokenParam = toastHub.utils.getQueryStringValue("token");
			if (tokenParam != null){
				params.token = tokenParam;
			}
	
			params.action = "LOGINAUTHENTICATE";
			params.callBack = function(JSONData){self.processAuthenticate(JSONData);};
			params.appForms = ["LOGIN_FORM"];
			params.inputFields = result;
			params.ajaxEndpoint = "/authenticate";
			this.callService(params);
		}
	}; // authenticate
	
	this.processAuthenticate = function(JSONData){
		var statusPanel = document.getElementById("login-status");
		if(JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "SUCCESS"){
			statusPanel.className = "alert alert-success";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
			toastHub.getController("usermanager").redirectToDashboard();
		} else if (JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "EXECUTIONFAILED") {
			statusPanel.className = "alert alert-danger";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
		} else {
			statusPanel.style.display = "none";
		}
	}; // processAuthenticate
	
	this.validateRegistration = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::validateRegistration");
		var status = false;
		var valid = toastHub.utils.validateFields(self.pageFormFields.REGISTRATION_FORM,toastHub.lang,toastHub.languages,"MAIN","REGISTRATION_FORM");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.REGISTRATION_FORM,toastHub.lang,toastHub.languages,"REGISTRATION_FORM");
			var saveParams = toastHub.initParams();
			saveParams.action = "REGISTERFULL";
			saveParams.callBack = function(JSONData){toastHub.getController("usermanager").registrationCallback(JSONData);};
			saveParams.appForms = ["REGISTRATION_FORM"];
			saveParams.inputFields = result;
			self.callService(saveParams);
		}
	
	}; // validateRegistration

	this.registrationCallback = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::registrationCallback");
		var statusPanel = document.getElementById("login-status");
		if(JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "SUCCESS"){
			statusPanel.className = "alert alert-success";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
			setTimeout(function(){self.redirectToLogin();},4000);
		} else if (JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "EXECUTIONFAILED") {
			statusPanel.className = "alert alert-danger";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
		} else {
			statusPanel.style.display = "none";
		}
	};
	
	////////////////////////////////////////////// Forgot Password
	
	this.forgotPassLink = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::forgotPassLink");
		var wrap = document.createElement("DIV");
		wrap.className = "form-group";
		params.container.appendChild(wrap);
		
		var row = document.createElement("DIV");
		row.className = "row";
		wrap.appendChild(row);
		
		var col = document.createElement("DIV");
		col.className = "col-lg-12";
		row.appendChild(col);
		
		var linkCenter = document.createElement("DIV");
		linkCenter.className = "text-center";
		col.appendChild(linkCenter);
		
		var link = document.createElement("A");
		link.onclick = function() { self.forgotPassRenderer(); };
		link.tabindex = params.textItem.tabIndex;
		link.className = "forgot-password";
		link.innerHTML = params.textItem.value;
		linkCenter.appendChild(link);
		
	}; //forgotPassLink
	
	this.forgotPassRenderer = function() {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::forgotPassRenderer");
		var column = document.getElementById("content_column");
		column.innerHTML = "";
		var panel = document.createElement("DIV");
		panel.className = "panel panel-login";
		column.appendChild(panel);

		var panelHeading = document.createElement("DIV");
		panelHeading.className = "panel-heading";
		panel.appendChild(panelHeading);
		
		var rowHeading = document.createElement("DIV");
		rowHeading.className = "row";
		panelHeading.appendChild(rowHeading);
		
		var col1 = document.createElement("DIV");
		//col1.className = "col-xs-6";
		col1.innerHTML = "<a href='#' class='active' id='login-form-link'>".concat(self.pageTexts.LOGIN_FORM.LOGIN_FORM_FORGOT_PASSWORD.value).concat("</a>");
		rowHeading.appendChild(col1);

		// status
		var panelStatus = document.createElement("DIV");
		panelStatus.id = "forgot-password-status";
		panelStatus.style.display = "none";
		panelStatus.setAttribute("role","alert");
		column.appendChild(panelStatus);
		
		// forms
		var panel2 = document.createElement("DIV");
		panel2.className = "panel-body";
		column.appendChild(panel2);
		
		var panel2Row = document.createElement("DIV");
		panel2Row.className = "row";
		panel2.appendChild(panel2Row);
		
		var panel2Col = document.createElement("DIV");
		panel2Col.className = "col-lg-12";
		panel2Row.appendChild(panel2Col);
		
		var forgotPassForm = document.createElement("DIV");
		forgotPassForm.id = "forgot-pass-form";
		panel2Col.appendChild(forgotPassForm);
		
		var params = new Object();
		params.container = forgotPassForm;
		params.group = 'MAIN';
		params.formName = 'FORGOTPASSWORD_FORM';
		var formFields = self.pageFormFields.FORGOTPASSWORD_FORM;
		
		// render fields
		for( var i = 0, len = formFields.length; i < len; i++ ) {
			params.formField = formFields[i];
			if (params.formField.name == "FORGOTPASSWORD_FORM_USERNAME") {
				params.onkeyup = function(e) { 
					e.preventDefault();
					if (e.keyCode == 13) {
						self.forgotPassword();
					}
				};
			}
			toastHub.utils.fieldRenderer(params);
			params.onkeyup = null;
			params.formField = null;
		}
	
		// Forgot Pass button
		if (self.pageTexts.FORGOTPASSWORD_FORM != null && self.pageTexts.FORGOTPASSWORD_FORM.FORGOTPASSWORD_FORM_SUBMIT.rendered == true) {
			params.onclick = function() { self.forgotPassword("FORGOTPASSWORD_FORM-FORGOTPASSWORD_FORM_USERNAME"); };
			params.button = self.pageTexts.FORGOTPASSWORD_FORM.FORGOTPASSWORD_FORM_SUBMIT;
			this.buttonRenderer(params);
			params.onclick = null;
			params.button = null;
		}
		
	}; //forgotPassRenderer
	
	this.forgotPassword = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::forgotPassword");
		var valid = toastHub.utils.validateFields(self.pageFormFields.FORGOTPASSWORD_FORM,toastHub.lang,toastHub.languages,"MAIN","FORGOTPASSWORD_FORM");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.FORGOTPASSWORD_FORM,toastHub.lang,toastHub.languages,"FORGOTPASSWORD_FORM");
			var params = toastHub.initParams();
			params.action = "FORGOTPASSWORD";
			params.callBack = function(JSONData){ self.processForgotPassword(JSONData);};
			params.appForms = ["FORGOTPASSWORD_FORM"];
			params.inputFields = result;
			this.callService(params);
			
		}
	}; // forgotPassword
	
	this.processForgotPassword = function(JSONData){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::processForgotPassword");

		var statusPanel = document.getElementById("forgot-password-status");
		if(JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "SUCCESS"){
			statusPanel.className = "alert alert-success";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
			setTimeout(function(){self.redirectToLogin();},3000);
		} else if (JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "EXECUTIONFAILED") {
			statusPanel.className = "alert alert-danger";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
		}
	}; // processForgotPassword
	
	this.processConfirmToken = function(JSONData){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::processConfirmToken");
		var x = document.createElement("div");
		if (JSONData != null && JSONData.params != null && JSONData.params.statusMessage != null) {
			toastHub.utils.applicationMessages(JSONData,true);
		} else {
			x.innerHTML = "Error processing request";
		}
		toastHub.containerContentObj.appendChild(x);
	}; // processConfirmToken
	
	this.redirectToLogin = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::redirectToLogin");
		if (this.username != null){
			window.location = "/login/login.html?username=".concat(this.username);
		} else {
			window.location = "/login/login.html";
		}
	}; //redirectToLogin
	
	this.redirectToRegister = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::redirectToRegister");
		window.location = "register.fly";
	}; //redirectToRegister
	
	this.redirectToDashboard = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::redirectToDashboard");
		window.location = "/member/index.html";
	}; //redirectToDashboard
	
    this.containsAlpha = function(str) {
    	var rx = new RegExp(/[a-z]/);
        if (rx.test(str)){ return 1; } else { return 0; }
    }; // containsAlpha

    this.containsNumeric = function(str) {
    	var rx = new RegExp(/[0-9]/);
        if (rx.test(str)) { return 1; } else { return 0; }
    }; // containsNumeric

    this.containsUpperCase = function(str) {
        var rx = new RegExp(/[A-Z]/);
        if (rx.test(str)) { return 1; } else { return 0; }
    }; // containsUpperCase
        
    this.containsSpecialCharacter = function(str) {
        var rx = new RegExp(/[^a-zA-Z0-9]/);
        if (rx.test(str)) { return 1; } else { return 0; }
    }; // containsSpecial

    ////////////////////////////////////////////////////////////// Change Password
    
    this.changePassLink = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::changePassLink");
		var wrap = document.createElement("DIV");
		wrap.className = "form-group";
		params.container.appendChild(wrap);
		
		var row = document.createElement("DIV");
		row.className = "row";
		wrap.appendChild(row);
		
		var col = document.createElement("DIV");
		col.className = "col-lg-12";
		row.appendChild(col);
		
		var linkCenter = document.createElement("DIV");
		linkCenter.className = "text-center";
		col.appendChild(linkCenter);
		
		var link = document.createElement("A");
		link.onclick = function() { self.changePassRenderer(); };
		link.tabindex = params.textItem.tabIndex;
		link.className = "forgot-password";
		link.innerHTML = params.textItem.value;
		linkCenter.appendChild(link);
		
	}; //changePassLink
	
	this.changePassRenderer = function() {
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::changePassRenderer");
		var column = document.getElementById("content_column");
		column.innerHTML = "";
		var panel = document.createElement("DIV");
		panel.className = "panel panel-login";
		column.appendChild(panel);

		var panelHeading = document.createElement("DIV");
		panelHeading.className = "panel-heading";
		panel.appendChild(panelHeading);
		
		var rowHeading = document.createElement("DIV");
		rowHeading.className = "row";
		panelHeading.appendChild(rowHeading);
		
		var col1 = document.createElement("DIV");
		//col1.className = "col-xs-6";
		col1.innerHTML = "<a href='#' class='active' id='login-form-link'>".concat(self.pageTexts.LOGIN_FORM.LOGIN_FORM_CHANGE_PASSWORD.value).concat("</a>");
		rowHeading.appendChild(col1);

		// status
		var panelStatus = document.createElement("DIV");
		panelStatus.id = "change-password-status";
		panelStatus.style.display = "none";
		panelStatus.setAttribute("role","alert");
		column.appendChild(panelStatus);
		
		// forms
		var panel2 = document.createElement("DIV");
		panel2.className = "panel-body";
		column.appendChild(panel2);
		
		var panel2Row = document.createElement("DIV");
		panel2Row.className = "row";
		panel2.appendChild(panel2Row);
		
		var panel2Col = document.createElement("DIV");
		panel2Col.className = "col-lg-12";
		panel2Row.appendChild(panel2Col);
		
		var changePassForm = document.createElement("DIV");
		changePassForm.id = "change-pass-form";
		panel2Col.appendChild(changePassForm);
		
		var params = new Object();
		params.container = changePassForm;
		params.group = 'MAIN';
		params.formName = 'PASSWORD_CHANGE_FORM';

		params.onclick = function() { self.validateRegistration(); };
		params.formFields = self.pageFormFields.PASSWORD_CHANGE_FORM;
		
		// render fields
		for( var i = 0, len = params.formFields.length; i < len; i++ ) {
			params.formField = params.formFields[i];
			if (params.formFields[i].name == "PASSWORD_CHANGE_FORM_PASSWORD") {
				params.onfocus = function() { self.showPasswordChart({"formName":"PASSWORD_CHANGE_FORM"}); };
				params.onkeyup = function() { self.checkPasswordChart({"formName":"PASSWORD_CHANGE_FORM","passwordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_PASSWORD"}); };
				params.onblur = function() { self.checkPasswordChart({"formName":"PASSWORD_CHANGE_FORM","passwordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_PASSWORD"}); };
				toastHub.utils.fieldRenderer(params);
				this.passwordChart(params);
				params.onfocus = null;
				params.onkeyup = null;
				params.onblur = null;
			} else if (params.formFields[i].name == "PASSWORD_CHANGE_FORM_VERIFYPASSWORD") {
				params.onfocus = function() { self.showMatchPassword({"formName":"PASSWORD_CHANGE_FORM"}); };
				params.onkeyup = function(e) { self.checkMatchPassword({"e":e,"formName":"PASSWORD_CHANGE_FORM","passwordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_PASSWORD","verifyPasswordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_VERIFYPASSWORD"});};
				params.onblur = function() { self.checkMatchPassword({"formName":"PASSWORD_CHANGE_FORM","passwordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_PASSWORD","verifyPasswordId":"PASSWORD_CHANGE_FORM-PASSWORD_CHANGE_FORM_VERIFYPASSWORD"}); };
				toastHub.utils.fieldRenderer(params);
				this.matchPassword(params);
				params.onfocus = null;
				params.onkeyup = null;
				params.onblur = null;
			} else {
				toastHub.utils.fieldRenderer(params);
			}
			params.formField = null;
		}
	
		// Change Pass button
		if (self.pageTexts.PASSWORD_CHANGE_FORM != null && self.pageTexts.PASSWORD_CHANGE_FORM.PASSWORD_CHANGE_FORM_SUBMIT.rendered == true) {
			params.onclick = function() { self.changePassword(); };
			params.button = self.pageTexts.PASSWORD_CHANGE_FORM.PASSWORD_CHANGE_FORM_SUBMIT;
			this.buttonRenderer(params);
			params.onclick = null;
			params.button = null;
		}
		
	}; //changePassRenderer
	
	this.changePassword = function(){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::changePassword");
		var valid = toastHub.utils.validateFields(self.pageFormFields.PASSWORD_CHANGE_FORM,toastHub.lang,toastHub.languages,"MAIN","PASSWORD_CHANGE_FORM");
		if (valid == true) {
			var result = toastHub.utils.marshallFields(self.pageFormFields.PASSWORD_CHANGE_FORM,toastHub.lang,toastHub.languages,"PASSWORD_CHANGE_FORM");
			var params = toastHub.initParams();
			params.action = "CHANGEPASSWORD";
			params.callBack = function(JSONData){ self.processChangePassword(JSONData);};
			params.appForms = ["PASSWORD_CHANGE_FORM"];
			params.inputFields = result;
			this.callService(params);
			
		}
	}; // changePassword
	
	this.processChangePassword = function(JSONData){
		toastHub.logSystem.log("DEBUG","toastHub-usermanager::toastHubUserManager::processChangePassword");
		var statusPanel = document.getElementById("change-password-status");
		if(JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "SUCCESS"){
			statusPanel.className = "alert alert-success";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
			setTimeout(function(){self.redirectToLogin();},3000);
		} else if (JSONData.params.statusMessage != null && JSONData.params.statusMessage[0].code == "EXECUTIONFAILED") {
			statusPanel.className = "alert alert-danger";
			statusPanel.style.display = "block";
			statusPanel.innerHTML = JSONData.params.statusMessage[0].message;
		}
	}; // processChangePassword
	
	this.statusPanelClear = function(id){
		var statusPanel = document.getElementById(id);
		statusPanel.style.display = "none";
		statusPanel.innerHTML = "";
	}; // statusPanelClear
	
} // toastHub-userManager

