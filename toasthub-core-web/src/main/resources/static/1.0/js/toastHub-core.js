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

// Base object

function toastHubBase(instanceName,parent){
	this.instanceName = instanceName;
	this.addAnother = false;
	this.pageTextsMap = null;
	this.pageNames = null;
	this.pageFormFields = null;
	this.pageLabels = null;
	this.pageTexts = null;
	this.cacheJSONData = null;
	this.id = null;				// used for acknowledge
	this.tabId = null;
	this.tabName = null;
	this.modal = false;
	this.modalCallback = null;
	this.modalCount = 1;
	this.sortModeCboxId = null;
	this.archiveCboxId = null;
	this.searchFieldId = null;  // use for search
	this.highLightId = null;
	this.view = null;
	this.translateSelectField = null;
	this.readOnly = false;
	this.menuName = null;
	this.formWidth = "90%";
	this.widgetContainer = null;
	this.isWidget = false;
	this.widgetCallBack = null;
	this.parentId = null;
	this.items = null;
	var self = parent;
	
	this.preConstruct = function(){
		
	};
	
	/////////////////////////////////////// construct
	this.init = function(initParams){
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubBase::init");
		var params = toastHub.initParams(initParams);	
		params.action = "INIT";
		params.service = this.service;
		params.pageMetaName = this.pageMetaName;
		params.callBack = function(JSONData){self.processInit(JSONData);};
		self.initCustom(params);
		this.callService(params);
    }; // setInitInstance
    
    // this should be overridden in sub class
    this.processInit = function(JSONData){
    	toastHub.logSystem.log("DEBUG","toastHub-core::toastHubBase::processInit",JSONData.params);

		if (toastHub.utils.checkVersion()){
			if (toastHub.layoutMap == null){
				//this.processPage();
			} else if (toastHub.pageLayout != null && toastHub.layoutMap[toastHub.pageLayout] != null){
				toastHub.layoutMap[toastHub.pageLayout].initPage(JSONData.params);
			} else {
				//this.processPage();
			}
		} else {
			this.alternateBrowser();
		}
    };
	
    this.modalForm = function(id,tabId){
		this.modal = true;
		this.highLightId = id;
		this.tabId = tabId;
		this.initPage(tabId);
	}; // modal
	
	this.initContent = function(initParams){
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubBase::initContent");
		jQuery("#statusAjax").toggle();
		var params = toastHub.initParams(initParams);
		params.action = "INIT";
		params.pageMetaName = this.pageMetaName;
		params.callBack = function(JSONData){toastHub.utils.clearErrorMessages();
							self.processInit(JSONData);
						};
		this.initCustom(params);
		this.callService(params);

	}; // initContent
	
	this.getList = function(initParams){
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubBase::getList ");
		jQuery("#".concat(this.statusAjaxContainer)).show();
		var params = toastHub.initParams(initParams);
		params.action = "LIST";
		if (initParams != null && initParams.id != null){
			this.id = initParams.id;
		}
		params.id = this.id;
    	if (initParams != null && initParams.pageStart != null){
    		this.pageStart = initParams.pageStart;
    	}
    	params.pageStart = this.pageStart;
    	if (this.sortModeCboxId != null && document.getElementById(this.sortModeCboxId) != null) {
    		params.sortMode = document.getElementById(this.sortModeCboxId).checked;
    	}
    	if (this.archiveCboxId != null && document.getElementById(this.archiveCboxId) != null && (sortMode == null || sortMode != null && !sortMode)) {
    		params.showArchive = document.getElementById(this.archiveCboxId).checked;
    	} else {
    		params.showArchive = false;
    	}
    	if (params.searchFieldId != null && document.getElementById(params.searchFieldId) != null){
    		var val = document.getElementById(params.searchFieldId).value;
    		if (val != "Search for..." && val != ""){
    			params.searchValue = encodeURIComponent(val);
    		}
    	} else if (this.searchFieldId != null && document.getElementById(this.searchFieldId) != null) {
    		var val = document.getElementById(this.searchFieldId).value;
    		if (val != "Search for..." && val != ""){
    			params.searchValue = encodeURIComponent(val);
    		}
    	}
    	this.listCustom(params);
    	
    	params.callBack = function(JSONData){self.processList(JSONData.params);};
		this.callService(params);
    }; // getList
    
    this.getTab = function(initParams){
    	toastHub.logSystem.log("DEBUG","toastHub-core:toastHubBase:getTab ");
		jQuery("#".concat(this.statusAjaxContainer)).show();
		var params = toastHub.initParams(initParams);
		params.action = "LIST";
		if (initParams != null && initParams.tabId != null){
			this.tabId = initParams.tabId;
		}
		params.tabId = this.tabId;
		if (initParams != null && initParams.tabName != null){
			this.tabName = initParams.tabName;
		}
		params.tabName = this.tabName;
		if (initParams != null && initParams.id != null){
			this.id = initParams.id;
		}
		params.id = this.id;
		if (initParams != null && initParams.type != null){
			params.type = initParams.type;
		}
    	if (initParams != null && initParams.pageStart != null){
    		this.pageStart = initParams.pageStart;
    		params.pageStart = initParams.pageStart;
    	}
    	if (this.sortModeCboxId != null && document.getElementById(this.sortModeCboxId) != null) {
    		params.sortMode = document.getElementById(this.sortModeCboxId).checked;
    	}
    	if (this.archiveCboxId != null && document.getElementById(this.archiveCboxId) != null && (sortMode == null || sortMode != null && !sortMode)) {
    		params.showArchive = document.getElementById(this.archiveCboxId).checked;
    	} else {
    		params.showArchive = false;
    	}
    	if (this.searchFieldId != null && document.getElementById(this.searchFieldId) != null && (sortMode == null || sortMode != null && !sortMode)){
    		params.searchValue = document.getElementById(this.searchFieldId).value;
    	} else {
    		params.searchValue = -1;
    	}

    	this.tabCustom(params);
    	params.callBack = function(JSONData){self.fillTab(JSONData);};
		this.callService(params);
    }; // getTab
    
    this.pagingRefresh = function(pageStart){
    	toastHub.logSystem.log("DEBUG","toastHub-core:toastHubBase:pagingRefresh ");
    	if (this.view == "TRANSLATE"){
    		this.getTranslate({pageStart:pageStart});
    	} else {
    		this.getList({pageStart:pageStart});
    	}
    };
    
    this.onSortModeChange = function(){
    	toastHub.logSystem.log("DEBUG","toastHub-core:toastHubBase:onSortModeChange ");
    	if (this.sortModeCboxId != null && document.getElementById(this.sortModeCboxId).checked) {
    		if (this.translateCboxId != null && document.getElementById(this.translateCboxId) != null){
    			document.getElementById(this.translateCboxId).checked = false;
    		}
    		if (this.archiveCboxId != null && document.getElementById(this.archiveCboxId) != null){
    			document.getElementById(this.archiveCboxId).checked = false;
    		}
    		if (this.searchValueFieldId != null && document.getElementById(this.searchValueFieldId) != null){
    			document.getElementById(this.searchValueFieldId).value = "";
    			document.getElementById(this.searchValueFieldId).disabled = true;
    		}
    	} else {
    		if (this.searchValueFieldId != null && document.getElementById(this.searchValueFieldId) != null){
    			document.getElementById(this.searchValueFieldId).disabled = false;
    		}
    	}
    	this.getList();
    }; // onSortModeChange

    this.uploadFile = function(imgId,id){
    	toastHub.logSystem.log("DEBUG","toastHub-core:toastHubBase:uploadFile ");
		this.id = id;
		this.fileUploadIndex = 0;
		this.filesQueue = document.getElementById(imgId).files;
		//for ( var i = 0; i < files.length; i++) {
			//this.filename = file.name;
			//console.log("file size "+file.size);
			this.saveFile(this.filesQueue[this.fileUploadIndex],id);
		//}
		//if (file.size > 256000){
		//	this.resizeFile(file);
		//} else {
			
		//}
	}; // uploadFile
	
	this.nextFile = function(){
		if (this.fileUploadIndex < this.filesQueue.length){
			this.saveFile(this.filesQueue[this.fileUploadIndex],this.id);
		}
	};
	
	this.saveFile = function(file,id){
		var callUrl = toastHub.restUrl.concat(this.ajaxFunc).concat("/attachment/upload");
		toastHub.logSystem.log("DEBUG","ajax toastHub-core:saveFile ".concat(callUrl));
		var xhr = new XMLHttpRequest();
		if (xhr.upload) {
			xhr.upload.addEventListener('progress',(function(i){
				return function(ev){
					var progress = Math.round(ev.loaded/ev.total*100);
					jQuery("#progress_".concat(i)).progressbar({ value: progress });
					var percent = (ev.loaded/ev.total)*100;
					toastHub.logSystem.log("DEBUG",percent.concat('% size ').concat(ev.total));
				};
			})(this.fileUploadIndex), false);
			xhr.onreadystatechange = (function(context) { 
				return function(ev){
					if (xhr.readyState==4 && xhr.status==200){
						var progress = document.getElementById("progress_".concat(context.fileUploadIndex));
						progress.className = "";
						progress.innerHTML = "";
						var status = document.getElementById("status_".concat(context.fileUploadIndex));
						status.src = "../../img/icons/16x16/check.png";
						context.fileUploadIndex++;
						var jsonResponse = JSON.parse(xhr.responseText);
						context.id = jsonResponse.id;
						context.nextFile();
					}
				}; 
			})(self);
			// start upload
			xhr.open("POST", callUrl, true);
			var formData = new FormData();
			formData.append('id',id);
			var comment = document.getElementById("comment_".concat(this.fileUploadIndex));
			formData.append('comment',comment.value);
			formData.append('uploadedFile', file, file.name);
			xhr.setRequestHeader("X_FILENAME", file.name);
			xhr.send(formData);
		}
	}; 
    
	this.callService = function(params){
		jQuery("#".concat(this.statusAjaxContainer)).show();
		var request = new Object();
		if (params == null) {
			// Error out params must have at least have the callName
			request.params = new Object();
		} else {
			request.params = params;
		}
		if (params.service == null){
			params.service = this.service;
		}
		this.params = params;
		var myAjaxFunc = this.ajaxFunc;
		if (params.ajaxFunc != null) {
			myAjaxFunc = params.ajaxFunc;
		}
		var myAjaxEndpoint = toastHub.ajaxEndpoint;
		if (params.ajaxEndpoint != null) {
			myAjaxEndpoint = params.ajaxEndpoint;
		}
    	var callUrl = toastHub.restUrl.concat(myAjaxFunc).concat(myAjaxEndpoint);
    	toastHub.logSystem.log("DEBUG","toastHub-core:toastHubBase:callService ".concat(callUrl).concat(" action ").concat(params.action));
    	jQuery.ajax({ type: "POST",
    		url: callUrl,
			data: JSON.stringify(request),
			contentType:"application/json; charset=utf-8",
			dataType: "json",
			context: this,
			success: function(JSONData){
				if (JSONData == null){
					this.serverErrorMessage();
				} else if (JSONData.status == false){
					this.applicationErrorMessage(JSONData);
				} else {
					this.params['callBack'](JSONData);
				}
				jQuery("#".concat(this.statusAjaxContainer)).hide();
				},
			error: function(statusCode){
					this.errorMessage(statusCode);
					jQuery("#".concat(this.statusAjaxContainer)).hide();
				}
			});
    }; // callService
	
    this.saveAdditional = function(params){
    	// holding place for special conditions
    }; // saveAdditional
    
    this.editCustom = function(params){
    	// holding place for special conditions
    }; // editCustom
    
    this.initCustom = function(params){
    	// holding place for special conditions
    }; // initCustom
    
    this.listCustom = function(params){
    	// holding place for special conditions
    }; // listCustom
    
    this.tabCustom = function(params){
    	// holding place for special conditions
    }; // tabCustom
    
    this.saveCallBack = function(JSONData){
    	this.getList();
    }; // saveCallBack
    
    this.clearErrorMessages = function(){
		toastHub.containerErrorObj.innerHTML = "";
		toastHub.containerErrorObj.style.display = "none";
	}; //clearErrorMessages
	
	this.serverErrorMessage = function(){
		toastHub.containerErrorObj.innerHTML = "JSON data is missing";
		toastHub.containerErrorObj.style.display = "inline-block";
	}; //serverErrorMessage

	this.applicationErrorMessage = function(JSONData){
		toastHub.containerErrorObj.innerHTML = JSONData.statusMessage;
		toastHub.containerErrorObj.style.display = "inline-block";
	}; // applicationErrorMessage
	
	this.applicationInfoMessage = function(JSONData){
		toastHub.containerErrorObj.innerHTML = JSONData.statusMessage;
		toastHub.containerErrorObj.style.display = "inline-block";
	}; // applicationInfoMessage
	
	this.errorMessage = function(JSONData){
		
	}; // errorMessage
	
	this.openAcknowledge = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubBase::openAcknowledge");
		
		var modalBody = document.getElementById('modalBody-'.concat(params.id));
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var message = document.createElement("DIV");
		message.innerHTML = params.message;
		modalBody.appendChild(message);
		
		self.id = params.item.id;
		if (params.acceptClick != null){
			var modelAccept = document.getElementById('modalButtonAccept-'.concat(params.id));
			modelAccept.onclick = params.acceptClick;
		}
		
		jQuery('#acknowledgeModal').modal({backdrop:"static",show:true});
	}; //openAcknowledge
}; // toastHubBase


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  Page Context
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//inherit base class
toastHubPageContext.prototype = Object.create(toastHubBase.prototype);
toastHubPageContext.prototype.constructor = toastHubPageContext;

var toastHub = new toastHubPageContext("Singleton");

function toastHubPageContext(instanceName){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "public";
	this.ajaxEndpoint = "/callService";
	this.service = "PUBLIC_SVC";
	this.initObj = null;
	this.AllLanguages = null;
	this.statusDialogContainer = null;
	this.containerMenuObj = null;
	this.containerContentObj = null;
	this.containerFooterObj = null;
	this.containerErrorObj = null;
	this.containerSuccessObj = null;
	this.clientType = 'full';
	this.lang = 'en';
	this.restUrl = "/toasthubweb/rest/";
	this.cache = new Object();
	this.mainContainer = null;
	this.pageStart = 0;
	this.responseCache = null;
	this.formCache = new Object();
	this.addAnother = false;
	this.pageTextsMap = null;
	this.id = null;
	this.tabId = null;
	this.tabName = null;
	this.modal = false;
	this.modalCallback = null;
	this.modalCount = 1;
	this.statusMessageContainer = "statusMessage";
	this.statusAjaxContainer = "statusAjax";
	this.sortModeCboxId = null;
	this.archiveCboxId = null;
	this.searchValueFieldId = null;
	this.translateCboxId = null;
	this.langSelect1 = null;
	this.langSelect2 = null;
	this.highLightId = null;
	this.view = null;
	this.translateSelectField = null;
	this.readOnly = false;
	this.menuName = null;
	this.formWidth = "90%";
	this.dashboardMap = null;
	this.body = null;
	this.page = null;
	this.contextPath = null;
	this.appName = null;
	this.pageName = "index";
	this.paramMap = null;
	this.cssDir = "stylesheet/";
	this.imageDir = "/img/";
	this.pageLayout = null;
	this.dependencyMap = {};
	this.widgetMap = {};
	this.layoutMap = null;
	this.controllerMap = null;
	this.logSystem = new toastHubLogSystem();
	this.scriptRepo = new toastHubScriptRepo();
	this.utils = new toastHubUtils();
	this.pageDone = false;
	this.repoDone = false;
	this.localStorage = false;
	this.requireOnce = null;
	this.htmlPrefix = "";
	this.basePath = "";
	this.languages = null;
	var self = this;

	// First thing is to load the page context with pageLayout, appName and contextPath
	this.load = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::load");
		var params = toastHub.initParams(params);	
		params.action = "INIT";
		params.service = this.service;
		if (params.appLanguages == null) {
			params.appLanguages = true;
		}
		params.pageMetaName = this.pageMetaName;
		params.callBack = function(JSONData){self.processLoad(JSONData);};
		this.callService(params);
	}; 
	
	this.processLoad = function(JSONData) {
		this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::processLoad",JSONData.params);
		
		if (JSONData.params.languages != null) {
			this.languages = JSONData.params.languages;
		}
		if (JSONData.params.userLang != null) {
			this.lang = JSONData.params.userLang;
		}
		if (JSONData.params.pageLayout != null) {
			this.pageLayout = JSONData.params.pageLayout;
		}
    	this.appName = JSONData.params.appName;
		this.contextPath = JSONData.params.contextPath;
		var prefix = JSONData.params.htmlPrefix;
		if (prefix != null && prefix != "toastHub") {
			this.htmlPrefix = JSONData.params.htmlPrefix;
		}
		this.scriptRepo.load();	
		var params = {jspath:"js/".concat(this.pageName).concat(".js")};
		if (this.basePath != null) {
			params.basePath = this.basePath;
		}
		this.scriptRepo.requireOnce(params);
	};
	
	
	this.ready = function(params){
		this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::ready::".concat(params.code));
		
		if (params.code == "page"){
			var body = document.getElementById("page-top");
			body.innerHTML = "";
			this.body = body;
			if (typeof(Storage) !== "undefined") {
				this.localStorage = true;
			} else {;
				this.localStorage = false;
			}
			this.pageDone = true;
		}
		if (params.code == "repo"){
			// update repo
			this.dependencyMap[params.jspath] = "complete";
			// check to see if all is loaded
			this.repoDone = true;
			for (var key in this.dependencyMap) {
				  if (this.dependencyMap.hasOwnProperty(key) && this.dependencyMap[key] != "complete") {
					 this.repoDone = false;
				  }
			}
		}
		if (this.pageDone && this.repoDone) {
			if (toastHub.getController(toastHub.pageName) != null){
				toastHub.getController(toastHub.pageName).init(params);
			}
		}
	}; // ready
	
	this.processPageold = function(params){
		this.logSystem.log("DEBUG","Base:toastHubPageContext:processPage");
		var body = document.getElementById(this.body);
		body.innerHTML = "";
		this.containerMenuObj = document.createElement("div");
		this.containerMenuObj.id = "nav-menu-area";
		body.appendChild(this.containerMenuObj);
		var menuNavLeftImg = document.createElement("span");
		menuNavLeftImg.id = "nav-left-img";
		this.containerMenuObj.appendChild(menuNavLeftImg);
		var menuNavLeftArea = document.createElement("span");
		menuNavLeftArea.id = "nav-left-area";
		this.containerMenuObj.appendChild(menuNavLeftArea);
		var menuNavRightImg = document.createElement("span");
		menuNavRightImg.id = "nav-right-img";
		this.containerMenuObj.appendChild(menuNavRightImg);
		var menuNavRightArea = document.createElement("span");
		menuNavRightArea.id = "nav-right-area";
		this.containerMenuObj.appendChild(menuNavRightArea);
		var menuLogin = document.createElement("span");
		menuLogin.id = "nav-loggedin";
		this.containerMenuObj.appendChild(menuLogin);

		this.containerSuccessObj = document.createElement("div");
		this.containerSuccessObj.id = "success-area";
		body.appendChild(this.containerSuccessObj);
		this.containerErrorObj = document.createElement("div");
		this.containerErrorObj.id = "error-area";
		body.appendChild(this.containerErrorObj);
		this.containerContentObj = document.createElement("div");
		this.containerContentObj.id = "content";
		this.containerContentObj.className = "content";
		body.appendChild(this.containerContentObj);
		var footer = document.createElement("div");
		footer.id = "footer";
		footer.className = "jd-footer";
		footer.innerHTML = "<p>Powered by Toasthub</p>";
		body.appendChild(footer);
		if (toastHub.getController("topmenu") != null){
			toastHub.getController("topmenu").init({menuName:"nav"});
		}
		this.logSystem.log("DEBUG","the page is ".concat(this.pageName));
		// add content
		var contentProvider = this.getController(this.pageName);
		if (contentProvider != null) {
			contentProvider.initContent();
		}
	}; // processPage

	this.setParamMap = function(paramMap){
		if (paramMap != null) {
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::processing paramMap ".concat(paramMap["page"]));
			this.paramMap = paramMap;
			if (paramMap["page"] != null){
				this.pageName = paramMap["page"];
			}
		}	
		// var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
		// var paramMap = toastHub.utils.urlParams(hash);

		if (paramMap["logLevel"] != null) {
			this.logSystem.setLogLevel(paramMap["logLevel"]);   
		}
	}; // setParamMap

	this.registerLayout = function(name,obj){
		if (this.layoutMap == null){
			this.layoutMap = new Array();
		}
		if (name != null && obj != null){
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::Register layout for ".concat(name));
			this.layoutMap[name] = obj;
		} else {
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::Register layout failed ");
		}
	}; // registerLayout
	
	this.getLayout = function(name){
		this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::getLayout::".concat(name));
		if (name == null) {
			name = "toastHub-PublicLayout";
		}
		if (this.layoutMap != null && this.layoutMap[name] != null){
			return this.layoutMap[name];
		} else {
			return null;
		}
	}; // getController

	this.registerController = function(name,obj){
		if (this.controllerMap == null) {
			this.controllerMap = new Array();
		}
		if (name != null && obj != null){
			obj.isWidget = false;
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::registerController - controller for ".concat(name));
			this.controllerMap[name] = obj;
		} else {
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::registerController - controller failed ");
		}
	}; // registerController
	
	this.getController = function(name){
		this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::getController::".concat(name));
		if (name == null) {
			name = "index";
		}
		if (this.controllerMap != null && this.controllerMap[name] != null){
			return this.controllerMap[name];
		} else {
			return null;
		}
	}; // getController
	
	this.registerWidget = function(name,obj){
		if (name != null && obj != null) {
			obj.isWidget = true;
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::Register widget for ".concat(name));
			this.widgetMap[name] = obj;
		} else {
			this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::Register widget failed ");
		}
	}; // registerWidget
	
	this.getWidget = function(name){
		this.logSystem.log("DEBUG","toastHub-core::toastHubPageContext::getWidget");
		if (name != null && this.widgetMap != null && this.widgetMap[name] != null) {
			return this.widgetMap[name];
		} else {
			return null;
		}
	}; // getWidget

	this.registerDashboard = function(name,obj){
		if (this.dashboardMap == null) {
			this.dashboardMap = new Array();
		}
		this.dashboardMap[name] = obj;
	}; // registerDashboard
	
	this.getDashboard = function(name){
		return this.dashboardMap[name];	
	}; // getDashboard

	this.initParams = function(params){
		if (params != null && params.restUrl != null){
			this.restUrl = params.restUrl;
		}
		if (params == null) {
			params = new Object();
		}
		params.clientType = this.clientType;
		params.lang = this.lang;
		params.timestamp = new Date().getTime();
	    params.pageName = this.pageName;
	    return params;
	};
	
	this.getLanguageText = function(params){
		var result = "English";
		// loop through languages
		for(var j=0;j<this.languages.length;j++){
			// if code matches
			if (this.languages[j].code == params.lang) {
				// if there are lang texts
				if (this.languages[j].title.langTexts != null){
					for(var k=0;k<this.languages[j].title.langTexts.length;k++){
						if (this.languages[j].title.langTexts[k].lang == toastHub.lang){
							result = this.languages[j].title.langTexts[k].text;
							break;
						}
					}
					break;
				} else {
					// else use default lang
					result = this.languages[j].title.defaultText;
					break;
				}
			}
		}
		return result;
	}; // getLanguageText
	
	this.getLanguageSelect = function() {
		var result = new Array();
		// loop through languages
		for(var j=0;j<this.languages.length;j++){
			var label = "";
			var value = this.languages[j].code;
			// if there are lang texts
			if (this.languages[j].title.langTexts != null){
				for(var k=0;k<this.languages[j].title.langTexts.length;k++){
					if (this.languages[j].title.langTexts[k].lang == toastHub.lang){
						label = this.languages[j].title.langTexts[k].text;
						break;
					}
				}
			} else {
				// else use default lang
				label = this.languages[j].title.defaultText;
			}
			result.push({value:value,label:label}); 
		}
		return result;
	}
	
	
}; // toastHubPageContext

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////// toastHubLogSystem
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function toastHubLogSystem() {
	// log level ERROR, WARN, DEBUG, TRACE
	this.logLevel = 3;
	this.logLevelMap = {"ERROR":1,"WARN":2,"DEBUG":3,"TRACE":4};

	this.log = function(level,message,params){
		if (this.logLevelMap[level] != null){
			if (this.logLevelMap[level] <= this.logLevel)	{
				if (params != null) {
					console.log(level.concat(" ").concat(message).concat(" ").concat(JSON.stringify(params, null, 4)));
				} else {
					console.log(level.concat(" ").concat(message));
				}
			}
		}
	}; // log

	this.setLogLevel = function(level){
		if (level != null && this.logLevelMap[level] != null){
			this.logLevel = this.logLevelMap[level];
		}
	}; // setLogLevel
} // toastHubLogSystem

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////  toastHubScriptRepo
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function toastHubScriptRepo(){
	this.jsMapLoadOrder = [];
	this.jsMap = {};
	this.cssMapLoadOrder = [];
	this.cssMap = {};

	this.load = function(params){
		
		// add the pagelayout
		this.jsMapLoadOrder.push("PAGELAYOUT");
		this.jsMap.PAGELAYOUT = "js/".concat(toastHub.pageLayout).concat(".js");
		
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::load");
		if (params != null && params.basePath != null){
			toastHub.basePath = params.basePath;
		}
		// removed
		var mapLength = this.jsMapLoadOrder.length;
		for ( var i = 0; i < mapLength; i++) {
			var src = this.jsMap[this.jsMapLoadOrder[i]];
			if (src.indexOf("http") == -1) {
				src = toastHub.basePath.concat(this.jsMap[this.jsMapLoadOrder[i]]);
			}
			toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::loading ".concat(src));
			if (fileExists(src)) {
				var script = document.createElement("SCRIPT");
				script.type = "text/javascript";
				script.src = src;
				document.getElementsByTagName("head")[0].appendChild(script);
			}
		}
		
	};

	this.requireOnce = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::requireOnce");
		if (params.page != null){
			if (toastHub.dependencyMap[params.page] == null){
				toastHub.dependencyMap[params.page] = "loading";
				toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::checking and loading repo ".concat(params.page));
				if (fileExists(toastHub.basePath.concat("/js/toastHub-").concat(params.page).concat(".js"))) {
					var s = document.createElement("script");
					s.src = toastHub.basePath.concat("/js/toastHub-").concat(params.page).concat(".js");
					s.async = true;
					s.onreadystatechange = s.onload = function() {
						var state = s.readyState;
						console.log("toastHub-core::toastHubScriptRepo::loading file state ".concat(state));
						//  if (!callback.done && (!state || /loaded|complete/.test(state))) {
						//     callback.done = true;
						//callback();
						// }
					};
					document.head.appendChild(s);
				} else {
					toastHub.dependencyMap[params.page] = "error";
				}
			}
		} else if (params.jspath != null){
			toastHub.logSystem.log("TRACE","toastHub-core::toastHubScriptRepo::Load Dependency called");
			// check if already loaded
			if (toastHub.dependencyMap[params.jspath] == null){
				toastHub.dependencyMap[params.jspath] = "loading";
				toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::loading dependency ".concat(params.jspath));
				if (fileExists(params.jspath)) {
					var s = document.createElement("script");
					s.src = params.jspath;
					s.async = true;
					s.onreadstatechange = s.onload = function() {
						toastHub.ready({code:"repo",jspath:params.jspath});
					};
					document.head.appendChild(s);
				} else {
					toastHub.dependencyMap[params.jspath] = "file does not exist";
					toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::dependency file does not exist ".concat(params.jspath));
				}
			} else {
				toastHub.logSystem.log("DEBUG","toastHub-core::toastHubScriptRepo::dependency already loaded ".concat(params.jspath));
			}
		}
	};

} // ScriptRepo

function fileExists(url) {
	var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
	
}; // fileExists


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////
///////////////////////////////

function toastHubUtils(){
	const TAG = "toasthub-core::toastHubUtils::";
	
	this.getLangText = function(params){	
		var result = "";
		if (params.title != null){
			if (params.title.langTexts != null){
				for(var k=0;k<params.title.langTexts.length;k++){
					if (params.title.langTexts[k].lang == toastHub.lang){
						result = params.title.langTexts[k].text;
						break;
					}
				}
			} else {
				// else use default lang
				result = params.title.defaultText;
			}
		}
		return result;	
	}; // getLangText
	
	this.urlParams = function(params){
		var paramHash = new Array();
		var parts = params.split(",");
		for ( var i = 0; i < parts.length; i++) {
			if (parts[i] != null){
				var param = parts[i].split("=");
				paramHash[param[0]] = param[1];
				if (this.DEBUG) { console.log(param[0].concat(" - ").concat(param[1])); }
			}
		}
		return paramHash;
	}; // urlParams
	
	this.fillSelect = function(list,selectObj,first){
		//var selectObj = document.getElementById(select);
		selectObj.length = 0;
		// add initial option
		var newOpt = document.createElement('option');
		newOpt.text = first;
		newOpt.value = -1;
		try {
			selectObj.add(newOpt,null); //Standard
		} catch(ex){
			selectObj.add(newOpt);  //IE Only
		}
		if (list != null && list.length > 0){
			// add the option from the server
			for (var i in list){
				if (list.hasOwnProperty(i)) {
					var itemObj = list[i];
					var newOpt = document.createElement('option');
					newOpt.text = itemObj.name;
					newOpt.value = itemObj.id;
					try {
						selectObj.add(newOpt,null); //Standard
					} catch(ex){
						selectObj.add(newOpt);  //IE Only
					}
				}
			}
		}
	}; //fillSelect
	
	this.checkAuth = function(){
		// user in role
		if(userRoles.view != null && userRoles.view == true){
			return true;
		} else if(userRoles.contrib != null && userRoles.contrib == true){
			
		} else if(userRoles.admin != null && userRoles.admin == true){
			
		} else {
			this.hide(addProjectObj);
			this.hide(addProjectGrpObj);
			this.hide(addLaneObj);
			this.hide(addGateObj);
			this.hide(addPostObj);
			
		}
	}; // checkauth
	
	this.show = function(container){
		container.style.display = "inline-block";
	}; // show
	this.hide = function(container){
		container.style.display = "none";
	}; // hide
	
	this.errorMessage = function(errorStatus){
		if (errorStatus.status == 200){
			// this is for errors that give a false 200 send to login
			redirectUrl = errorStatus.getResponseHeader("Location");
			var newItem = document.createElement('div');
			newItem.id = "errorText";
			newItem.innerHTML = "Your session has Expired";
			toastHub.pluginArea.appendChild(newItem);
			jQuery("#errorDialog").dialog( "option", "buttons", { "Ok": function() { 
				window.location.href = redirectUrl;
				jQuery(this).dialog("close"); } });
		} else {
			//openErrorDialog();
			//var newItem = document.createElement('div');
			//newItem.id = "errorText";
			//newItem.innerHTML = "Error: "+ errorStatus.statusText +"!! Please try and perform your action again. If this happens again contact the system administrator.";
			//this.pluginArea.appendChild(newItem);
			window.location.href = "home.fly";
		}
	}; // errorMessage
	
	this.serverErrorMessage = function(){
		if (toastHub.containerErrorObj != null){
			toastHub.containerErrorObj.innerHTML = "JSON data is missing";
			toastHub.containerErrorObj.style.display = "inline-block";
		}
	}; //serverErrorMessage

	this.applicationMessages = function(params) {
		if (params.container != null) {
			params.container.innerHTML = "";
			if (params.statusMessage != null) {
				for(i=0;i<params.statusMessage.length;i++){
					var alert = document.createElement("DIV");
					var msgStrong = "";
					switch (params.statusMessage[i].code){
						case "SUCCESS":
							alert.className ="alert alert-success";
							msgStrong = "<strong>Success!</strong> ".concat(params.statusMessage[i].message);
							break;
						case "INFO":
							alert.className = "alert alert-info";
							msgStrong = "<strong>Info!</strong> ".concat(params.statusMessage[i].message);
							break;
						case "WARNING":
							alert.className = "alert alert-warning";
							msgStrong = "<strong>Warning!</strong> ".concat(params.statusMessage[i].message);
							break;
						case "ACTIONFAILED":
							alert.className = "alert alert-danger";
							msgStrong = "<strong>Error!</strong> ".concat(params.statusMessage[i].message);
							break;
					}
					alert.innerHTML = msgStrong;
					params.container.appendChild(alert);
					
				}
			}
			
		} else {
			alert("Issue ".concat(params.statusMessage));
		}
		jQuery(".alert").delay(1500).slideUp(200, function() {});
	};
	
	this.applicationErrorMessage = function(JSONData){
		if (toastHub.containerErrorObj != null){
			toastHub.containerErrorObj.innerHTML = JSONData.statusMessage;
			toastHub.containerErrorObj.style.display = "inline-block";
		}
	}; // applicationErrorMessage
	
	this.applicationInfoMessage = function(JSONData){
		if (toastHub.containerErrorObj != null){
			var statusArray = JSONData.params.statusMessage;
			if (statusArray != null) {
				var message = "";
				for (var i = 0; statusArray.length > i; i++) {
					message.concat(statusArray[i].message);
				}
				toastHub.containerErrorObj.innerHTML = message;
			}
			toastHub.containerErrorObj.style.display = "inline-block";
		}
	}; // applicationInfoMessage
	
	this.clearErrorMessages = function(){
		if (toastHub.containerErrorObj != null){
			toastHub.containerErrorObj.innerHTML = "";
			toastHub.containerErrorObj.style.display = "none";
		}
	}; //clearErrorMessages
	
	this.applicationSuccessMessage = function(JSONData){
		if (toastHub.containerSuccessObj != null){
			toastHub.containerSuccessObj.innerHTML = JSONData.statusMessage;
			toastHub.containerSuccessObj.style.display = "inline-block";
			setTimeout("toastHub.utils.clearSuccessMessages()", 1000);
		}
	}; // applicationStatusMessage
	
	this.clearSuccessMessages = function(){
		if (toastHub.containerSuccessObj != null){
			toastHub.containerSuccessObj.innerHTML = "";
			jQuery(toastHub.containerSuccessObj).fadeOut();
			//this.containerSuccessObj.style.display = "none";
		}
	}; //clearSuccessMessages
	
	this.statusDialog = function(type){
		if (type == "open"){
			soeComponentUtils.show(toastHub.statusDialogContainer);
		} else if(type == "create"){
			if(toastHub.statusDialogContainer == null){
				toastHub.statusDialogContainer = document.createElement('div');
				toastHub.statusDialogContainer.id = toastHub.main.concat("-status");
				toastHub.statusDialogContainer.style.display = "none";
				var iHTML = "<p>Processing...</p><img src='".concat(toastHub.imgHome).concat("spinner.gif'/>");
				toastHub.statusDialogContainer.innerHTML = iHTML;
				var pluginArea = document.getElementById(toastHub.main);
				pluginArea.appendChild(toastHub.statusDialogContainer);
			}
		} else {
			soeComponentUtils.hide(toastHub.statusDialogContainer);
		}
    }; // statusDialog
    
    this.createErrorMessage = function(id,message){
    	if (!document.getElementById("error-".concat(id))){
    		var mySpan = document.createElement('span');
    		mySpan.id = "error-".concat(id);
    		mySpan.className = "ui-error-message";
    		mySpan.innerHTML = message;
    		document.getElementById("wrap-".concat(id)).appendChild(mySpan);
    	}
	}; // createErrorMessage
	
	this.removeErrorMessage = function(id){
		var child = document.getElementById("error-".concat(id));
		if (child){
			document.getElementById("wrap-".concat(id)).removeChild(child);
		}
	}; //removeErrorMessage
	
	this.getMouseXY = function(event) {
		var coords = new Array();
		coords[0] = 0;
		coords[1] = 0;
		var e = null;
		if (!event){
			e = window.event;
		} else {
			e = event;
		}
		var IE = document.all ? true : false ;
		if (IE && (e.clientX || e.clientY)) { // grab the x-y pos.s if browser is IE
		    coords[0] = e.clientX + document.body.scrollLeft;
		    coords[1] = e.clientY + document.body.scrollTop;
		} else if (e.pageX || e.pageY) {  // grab the x-y pos.s if browser is NS
		    coords[0] = e.pageX;
		    coords[1] = e.pageY;
		}  
		return coords;
	}; //getMouseXY
	
	this.queryString = function() {
		var query_string = new Array();
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
		    	// If first entry with this name
		    if (typeof query_string[pair[0]] === "undefined") {
		      query_string[pair[0]] = pair[1];
		    	// If second entry with this name
		    } else if (typeof query_string[pair[0]] === "string") {
		      var arr = [ query_string[pair[0]], pair[1] ];
		      query_string[pair[0]] = arr;
		    	// If third or later entry with this name
		    } else {
		      query_string[pair[0]].push(pair[1]);
		    }
		} 
		return query_string;
	};
	
	
	this.getQueryStringValue = function(paramName){
		var p = escape(unescape(paramName));
	    var regex = new RegExp("[?&]".concat(p).concat("(?:=([^&]*))?","i"));
	    var match = regex.exec(window.location.search);
	    var value = null;
	    if( match != null ){
	    	value = match[1];
	    }
	    return value;
	};
	
	this.adjustStyle = function(params) {
		var width = parseInt(params.width);
		var cssname = toastHub.appName;
		if (params.cssname != null){
			cssname = params.cssname;
		}
		var contextPath = toastHub.contextPath;
		if (params.contextPath != null){
			contextPath = params.contextPath;
		}
		var cssDir = toastHub.cssDir;
		if (params.cssDir != null) {
			cssDir = params.cssDir;
		}
		if (document.getElementById("default-stylesheet") == null){
    		var headID = document.getElementsByTagName("head")[0];         
			var cssNode = document.createElement('link');
			cssNode.type = 'text/css';
			cssNode.rel = 'stylesheet';
			cssNode.id = 'default-stylesheet';
			cssNode.href = "/".concat(cssDir).concat('toastHub/site.css');
			cssNode.media = 'screen';
			headID.appendChild(cssNode);
    	}
		if (document.getElementById("base-stylesheet") == null){
    		var headID = document.getElementsByTagName("head")[0];         
			var cssNode = document.createElement('link');
			cssNode.type = 'text/css';
			cssNode.rel = 'stylesheet';
			cssNode.id = 'base-stylesheet';
			cssNode.href = "/".concat(cssDir).concat(cssname).concat('/site.css');
			cssNode.media = 'screen';
			headID.appendChild(cssNode);
    	}
	    if (width < 471 || (navigator.userAgent.indexOf('iPhone') != -1) || (navigator.userAgent.indexOf('iPod') != -1)) {
	    	if (document.getElementById("page-stylesheet") == null){
	    		var headID = document.getElementsByTagName("head")[0];         
				var cssNode = document.createElement('link');
				cssNode.type = 'text/css';
				cssNode.rel = 'stylesheet';
				cssNode.id = 'page-stylesheet';
				cssNode.href = "/".concat(cssDir).concat(cssname).concat('/small.css');
				cssNode.media = 'screen';
				headID.appendChild(cssNode);
	    	} else {
	    		jQuery("#page-stylesheet").attr("href", "/".concat(cssDir).concat(cssname).concat("/small.css"));
	    	}
	        jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/mobile/1.0/jquery.mobile-1.0.min.css");
	        toastHub.clientType = 'mobile';
	    } else if ((width >= 472) && (width < 900) || (navigator.userAgent.indexOf('iPad') != -1)) {
	    	if (document.getElementById("page-stylesheet") == null){
	    		var headID = document.getElementsByTagName("head")[0];         
				var cssNode = document.createElement('link');
				cssNode.type = 'text/css';
				cssNode.rel = 'stylesheet';
				cssNode.id = 'page-stylesheet';
				cssNode.href = "/".concat(cssDir).concat(cssname).concat('/medium.css');
				cssNode.media = 'screen';
				headID.appendChild(cssNode);
	    	} else {
	    		jQuery("#page-stylesheet").attr("href", "/".concat(cssDir).concat(cssname).concat("/medium.css"));
	    	}
	        jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/ui/1.8.17/themes/ui-lightness/jquery-ui.css");
	        toastHub.clientType = 'tablet';
	    } else {
	    	if (document.getElementById("page-stylesheet") == null){
	    		var headID = document.getElementsByTagName("head")[0];         
				var cssNode = document.createElement('link');
				cssNode.type = 'text/css';
				cssNode.rel = 'stylesheet';
				cssNode.id = 'page-stylesheet';
				cssNode.href = "/".concat(cssDir).concat(cssname).concat('/full.css');
				cssNode.media = 'screen';
				headID.appendChild(cssNode);
	    	} else {
	    		jQuery("#page-stylesheet").attr("href", "/".concat(cssDir).concat(cssname).concat("/full.css"));
	    	}
	    	jQuery("#jquery-stylesheet").attr("href", "http://code.jquery.com/ui/1.8.17/themes/ui-lightness/jquery-ui.css");
	    	toastHub.clientType = 'full';
	    }
	}; // adjustStyle
	
	this.moveAnimate = function(container,px){
		$(container).animate({
			'marginLeft' : px
		});
	}; // moveAnimate
	
	this.getInternetExplorerVersion = function(){
		// Returns the version of Internet Explorer or a -1
		// (indicating the use of another browser).
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null){
				rv = parseFloat( RegExp.$1 );
			}
		}
		return rv;
	}; // getInternetExplorerVersion
	this.checkVersion = function(){
		//var msg = "You're not using Internet Explorer.";
		var ver = this.getInternetExplorerVersion();
		if ( ver > -1 ){
			if ( ver >= 9.0 ){
				return true;
	    		//msg = "You're using a recent copy of Internet Explorer."
	    	} else {
	    		return false;
	    		//msg = "You should upgrade your copy of Internet Explorer.";
	    	}
		} else {
			return true;
		}
		//alert( msg );
	}; // checkVersion
	this.alternateBrowser = function(){
		
	}; // alternateBrowser
	
	// zipCodeFormat
    this.zipCodeFormat = function(fieldName,event){
        var field = document.getElementById(fieldName);
        var fieldValue = field.value;
        if(!(event.keyCode==8 || event.keyCode==46 || (event.keyCode>=33 && event.keyCode<=40) )){
            fieldValue = fieldValue.replace("-","");
            part1 = "";
            part2 = "";
            if(fieldValue.length<9 ){
                part1=fieldValue.substring(0,5);
                if(fieldValue.length>5){
                    part2 = "-".concat(fieldValue.substring(5));
                }

                field.value = part1.concat(part2);
            }
        }
    }; // zipCodeFormat
   
    this.phoneNumberFormat = function(fieldName,event){
        var field = document.getElementById(fieldName);
        var fieldValue = field.value;
        if(!(event.keyCode==8 || event.keyCode==46 || (event.keyCode>=33 && event.keyCode<=40) )){
            fieldValue = fieldValue.replace("(","");
            fieldValue = fieldValue.replace(")","");
            fieldValue = fieldValue.replace("-","");
            part1 = "";
            part2 = "";
            part3 = "";
            if(fieldValue.length<10 ){
                if(fieldValue.length>2){
                    part1="(".concat(fieldValue.substring(0,3)).concat(")");
                    if(fieldValue.length>5){
                        part2 = fieldValue.substring(3,6);
                        part3 = "-".concat(fieldValue.substring(6));
                    }else{
                        part2 = fieldValue.substring(3);
                    }
                    field.value = part1.concat(part2).concat(part3);
                }
            }

        }
    }; // phoneNumberFormat
   
    this.validateEmail = function(email) {
    	toastHub.logSystem.log("DEBUG","toasthub-core::toastHubUtils::validateEmail");
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }; // validateEmail
    
    this.dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0".concat(val);
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = this.dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    this.dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    this.dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    
    this.firstTimeClear = function(element,reportType){
        var patt = /^-.*-$/;
        if (patt.test(element.value)){
            element.value = "";
            element.style.color = "black";
        }
    }; // firstTimeClear
	
    this.pagingRenderer = function(params){
    	toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::pagingRenderer");
    	if (!this.isEmpty(params.paging.container) && params.itemCount > params.pageLimit){
    		var center = document.createElement("DIV");
    		center.className = "text-center";
    		params.paging.container.appendChild(center);
    		var ul = document.createElement("UL");
    		ul.className = "pagination";
    		center.appendChild(ul);
    		
	    	var imgFirst = "First";
	    	var imgPrevious = "Previous";
	        var imgNext = "Next";
	        var imgLast = "Last";
	    	if (params.paging.pageTexts != null && params.paging.pageTexts.GLOBAL_PAGE != null) {
	    		imgFirst = params.paging.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_PAGING_FIRST.value;
	    		imgPrevious = params.paging.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_PAGING_PREV.value;
	    		imgNext = params.paging.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_PAGING_NEXT.value;
	    		imgLast = params.paging.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_PAGING_LAST.value;
	    	}
	        
	        var pageStart = 0;
	        if (!this.isEmpty(params.pageStart)){ pageStart = params.pageStart; }
	        var pageLimit = 0;
	        if (!this.isEmpty(params.pageLimit)){ pageLimit = params.pageLimit; }
	        var itemCount = 0;
	        if (!this.isEmpty(params.itemCount)){ itemCount = params.itemCount; }
	        var current = pageStart + 1;
	        var next = pageStart + pageLimit;
	        var nextItem = next;
	        var last = itemCount - pageLimit;
	        if (last < 0){
	        	last = 0;
	        }
	        var previous = pageStart - pageLimit;
	        if (previous < 0){
	        	previous = 0;
	        }
	        if (next > itemCount){
	        	nextItem = itemCount;
	        }
	       
	        var liFirst = document.createElement("LI");
	        ul.appendChild(liFirst);
	        var hrefFirst = document.createElement("A");
        	hrefFirst.href = "#";
        	hrefFirst.innerHTML = imgFirst;
            liFirst.appendChild(hrefFirst);
	        if (pageStart < 1) {
	        	liFirst.className = "disabled";
	        } else {
	        	if (params.paging.callBack != null) {
					var p = {pageStart:0,onclick:params.paging.callBack};
					hrefFirst.onclick = (function(p) { return function(){p.onclick(p.pageStart);}})(p);
	        	}
	        }
	        var liPrevious = document.createElement("LI");
	        ul.appendChild(liPrevious);
	        var hrefPrev = document.createElement("A");
        	hrefPrev.href = "#";
        	hrefPrev.innerHTML = imgPrevious;
        	liPrevious.appendChild(hrefPrev)
	        if (pageStart < 1) {
	        	liPrevious.className = "disabled";
	        } else {
	        	if (params.paging.callBack != null) {
	        		var p = {pageStart:previous,onclick:params.paging.callBack};
	        		hrefPrev.onclick = (function(p) { return function(){p.onclick(p.pageStart);}})(p);
	        	}
	        }
	        
	        var liCount = document.createElement("LI");
	        ul.appendChild(liCount);
	        liCount.className = "disabled";
	        liCount.innerHTML = "<span class='pageNumbers'>".concat(current).concat(" - ").concat(nextItem).concat(" of ").concat(itemCount).concat("</span>");
	
	        var liNext = document.createElement("LI");
	        ul.appendChild(liNext);
	        var hrefNext = document.createElement("A");
        	hrefNext.href = "#";
        	hrefNext.innerHTML = imgNext;
        	liNext.appendChild(hrefNext);
	        if ( next < itemCount ) {
	        	if (params.paging.callBack != null) {
	        		var p = {pageStart:next,onclick:params.paging.callBack};
	        		hrefNext.onclick = (function(p) { return function(){p.onclick(p.pageStart);}})(p);
	        	}
	        } else {
	        	liNext.className = "disabled";
	        }
	        var liLast = document.createElement("LI");
	        ul.appendChild(liLast);
	        var hrefLast = document.createElement("A");
        	hrefLast.href = "#";
        	hrefLast.innerHTML = imgLast;
        	liLast.appendChild(hrefLast);
	        if ( next > itemCount ) {
	        	liLast.className = "disabled";
	        } else {
	        	if (params.paging.callBack != null) {
	        		var p = {pageStart:last,onclick:params.paging.callBack};
	        		hrefLast.onclick = (function(p) { return function(){p.onclick(p.pageStart);}})(p);
	        	}
	        }

    	}
    }; // pagingRenderer
    
    
    this.getPageTextsObj = function(params,key){
    	var value = null;
    	if (params.appPageTexts != null && params.appPageTexts.length > 0){
    		value = params.appPageTexts[params.headerModifyTxt];
    	} 
    	if (value == null && params.sysPageTexts != null && params.sysPageTexts != null){
    		value = params.sysPageTexts[params.headerModifyTxt];
    	}
    	return value;
    }
    
    this.fieldRenderer = function(params) {
    	var formField = params.formField;
		var item = params.item;
		var container = params.container;
    	if(formField.rendered && formField.group == params.group) {
	    	if (formField.required){ required="*"; } else { required = ""; }
	    	if (formField.fieldType == "MTXT"){
	    		if (formField.required){
	    			if (!toastHub.utils.validateMultiLingualText(params.formName.concat("-").concat(formField.name),lang,AllLanguages,null)){
	    				isValid = false; 
	    				document.getElementById(params.formName.concat("-").concat(formField.name).concat("_Error")).className = "showError";
	    			} else {
	    				document.getElementById(params.formName.concat("-").concat(formField.name).concat("_Error")).className = "hideError";
	    			}
	    		}
	    		
	    	} else if (formField.fieldType == "TXTA"){
	    		
	    		var td1 = document.createElement("TD");
	    		td1.innerHTML = formField.label.concat(required);
	    		var td2 = document.createElement("TD");
	    		var textarea = document.createElement("TEXTAREA");
	    		textarea.id = params.formName.concat("-").concat(formField.name);
	    		textarea.name = params.formName.concat("-").concat(formField.name);
	    		textarea.rows = formField.rows;
	    		textarea.cols = formField.cols;
	    		textarea.value = formField.value;
	    		td2.appendChild(textarea);
	    		var td3 = document.createElement("TD");
	    		var span = document.createElement("SPAN");
		    	span.id = formField.id.concat("-").concat(formField.name).concat("_ERROR");
		    	span.className = "ui-hide ui-error";
		    	span.value = "Error";
		    	td3.appendChild(span);
	    		fieldContainer.appendChild(td1);
	    		fieldContainer.appendChild(td2);
	    		fieldContainer.appendChild(td3);
				
	    	} else if (formField.fieldType == "TXT"){
	   
	    		var value = "";
	    		if (item != null && item[formField.jfield] != null){
	    			value = "value='".concat(item[formField.jfield]).concat("'");
	    		}
	    		var fieldWrap = document.createElement("DIV");
	    		fieldWrap.className = "form-group";
	    		container.appendChild(fieldWrap);
                 
	    		var errorLabel = document.createElement("LABEL");
	    		errorLabel.id = params.formName.concat("-").concat(formField.name).concat("-error");
	    		errorLabel.className = "control-label has-error";
	    		errorLabel.setAttribute("for",params.formName.concat("-").concat(formField.name));
	    		errorLabel.innerHTML = "Input error";
	    		errorLabel.style.display = "none";
	    		fieldWrap.appendChild(errorLabel);
	    		
	    		var input = document.createElement("INPUT");
	    		if (formField.htmlType != null){
	    			input.type = formField.htmlType;
	    			
	    		} else {
	    			input.type = "text";
	    		}
	    		input.className = "form-control";
	    		input.readonly = true;
    			input.autocapitalize = "off";
    			input.id = params.formName.concat("-").concat(formField.name);
    			input.name = params.formName.concat("-").concat(formField.name);
    			input.placeholder = formField.label.concat(required);
    			input.value = "";
    			input.tabindex = formField.tabIndex;
    			if (params.onfocus != null) {
    				input.onfocus = params.onfocus;
    			}
    			if (params.onkeyup != null) {
    				input.onkeyup = params.onkeyup;
    			}
    			if (params.onblur != null) {
    				input.onblur = params.onblur;
    			}
    			//input.setAttribute("required","required");
    			fieldWrap.appendChild(input);
    			
    		} else if (formField.fieldType == "DATE"){
	    		
	    		var dateObj = new Object();
				dataObj.name = params.formName.concat("-").concat(formField.name);
	    		if (dataObj != null && dataObj[formField.name] != null){
	    			dateObj.date = new Date(dataObj[formField.name]);
	    		}

	    		var td1 = document.createElement("TD");
	    		td1.innerHTML = formField.label.concat(required);
	    		var td2 = document.createElement("TD");
	    		var input = document.createElement("INPUT");
    			input.type = "text";
    			input.readonly = true;
    			input.id = params.formName.concat("-").concat(formField.name);
    			input.name = params.formName.concat("-").concat(formField.name);
    			input.className = formField.className;
    			//input.value = value;
    			td2.appendChild(input);
    			var inputHidden = document.createElement("INPUT");
    			inputHidden.type = "hidden";
    			inputHidden.id = params.formName.concat("-").concat(formField.name).concat("-HIDDEN");
    			td2.appendChild(inputHidden);
	    		var td3 = document.createElement("TD");
	    		var span = document.createElement("SPAN");
		    	span.id = params.formName.concat("-").concat(formField.name).concat("_ERROR");
		    	span.className = "ui-hide ui-error";
		    	span.value = "Error";
		    	td3.appendChild(span);
		    	fieldContainer.appendChild(td1);
		    	fieldContainer.appendChild(td2);
		    	fieldContainer.appendChild(td3);

				datePickerListener.push(dateObj);
	    	} else if (formField.fieldType == "RDO"){
		    	
		    	var td1 = document.createElement("TD");
		    	td1.innerHTML = formField.label.concat(required);
		    	var td2 = document.createElement("TD");
		    	// get radio group from pageTexts
		    	var input = "";
		    	for( var s = 0, slen = formFields.length; s < slen; s++ ) {
		    		var subFormField = formFields[s];
		    		if(subFormField.pageFormFieldName.subGroup == subFormField.pageFormFieldName.group) {
		    			input = document.createElement("INPUT");
		    			input.type = "radio";
		    			input.name = "group-".concat(name[1]);
		    			if (dataObj != null){
		    				if (dataObj[name[1]] != null){
		    					if (typeof dataObj[name[1]] == "boolean"){
		    						var b = false;
		    						if(subFormField.value == "true"){
		    							b = true;
		    						}
		    						if (dataObj[name[1]] == b){
		    							input.checked = true;
		    						}
		    					}
		    				}
		    			} else {
		    				if(subFormField.required){
		    					input.checked = true;
		    				}
		    			}
		    			input.value = subFormField.value;
		    			td2.appendChild(input);
		    			td2.appendChild(document.createTextNode(subFormField.label));
		    			td2.appendChild(document.createElement("BR"));
		    		}
		    	}
		    	var td3 = document.createElement("TD");
		    	var span = document.createElement("SPAN");
		    	span.id = params.formName.concat("-").concat(formField.name).concat("_ERROR");
		    	span.className = "ui-hide";
		    	span.value = "Error";
		    	td3.appendChild(span);
		    	fieldContainer.appendChild(td1);
		    	fieldContainer.appendChild(td2);
		    	fieldContainer.appendChild(td3);

		    }
	    }
    }; //fieldRenderer
    
    this.simpleFormRenderer = function(params){
    	toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::simpleFormRenderer");
    	//	JSONData,myObj,formName,container,group
    	//if(this.validateParams(params) == null) { return null; }
    	var pageTexts = params[params.pageTextsType];
    	if (pageTexts == null){
    		alert("Missing pageTexts");
    	}
		var formFields = params.formFields;
		var buttons = params.buttons;
		var item = params.item;
		var formName = params.sysPageFormName;
		var container = params.container;
		var headerDiv = null;
		// Create a header if available
		if (params.headerModifyTxt != null){
			var headerModifyTxt = pageTexts[params.headerModifyTxt];
			if (headerModifyTxt != null && headerModifyTxt.rendered) {
			//	if ( !this.isEmpty(params.dataObj)){
	
						headerDiv = document.createElement("DIV");
						headerDiv.innerHTML = headerModifyTxt.value;
						container.appendChild(headerDiv);
	
			/*	} else {
					var headerCreateTxt = this.getPageTextsObj(params,params.headerCreateTxt);
					if (headerCreateTxt.rendered){
						headerDiv = document.createElement("DIV");
						headerDiv.innerHTML = headerCreateTxt.value;
						container.appendChild(headerDiv);
					}
				}*/
			}
		}
		// Create fields as needed
		var form = document.createElement("DIV");
		if (params.formOnKeyPress != null){
			form.onkeypress = params.formOnKeyPress;
		}
		container.appendChild(form);
		var table = document.createElement("TABLE");
		form.appendChild(table);
		var datePickerListener = new Array();
		var fieldHorizontalTR = null;
		if (formFields != null){
			var required = "";
			var direction = "VERTICAL";
			if (!this.isEmpty(params.fieldDirection) && params.fieldDirection.toUpperCase() === "HORIZONTAL"){
				direction = "HORIZONTAL";
				var fieldHorizontalTR = document.createElement("TR");
				table.appendChild(fieldHorizontalTR);
			}
			for( var i = 0, len = formFields.length; i < len; i++ ) {
				var formField = formFields[i];
				var fieldContainer = null;
				if (direction === "HORIZONTAL"){
					fieldContainer = document.createElement("TD");
					fieldHorizontalTR.appendChild(fieldContainer);
				} else {
					fieldContainer = document.createElement("TR");
					table.appendChild(fieldContainer);
				}
				
			    if(formField.rendered && formField.pageFormFieldName.group == params.group) {
			    	if (formField.required){ required="*"; } else { required = ""; }
			    	if (formField.pageFormFieldName.fieldType == "MTXT"){
			    		if (formField.required){
			    			if (!toastHub.utils.validateMultiLingualText(formField.pageFormFieldName.name,lang,AllLanguages,null)){
			    				isValid = false; 
			    				document.getElementById(formField.pageFormFieldName.name.concat("_Error")).className = "showError";
			    			} else {
			    				document.getElementById(formField.pageFormFieldName.name.concat("_Error")).className = "hideError";
			    			}
			    		}
			    		
			    	} else if (formField.pageFormFieldName.fieldType == "TXTA"){
			    		var name = formField.pageFormFieldName.name.split("-");
						var value = "";
			    		if (item != null && item[name[1]] != null){
			    			value = item[name[1]];
			    		}
			    		
			    		var td1 = document.createElement("TD");
			    		td1.innerHTML = formField.label.concat(required);
			    		var td2 = document.createElement("TD");
			    		var textarea = document.createElement("TEXTAREA");
			    		textarea.id = formName.concat("-").concat(name[0]);
			    		textarea.name = formName.concat("-").concat(name[0]);
			    		textarea.rows = formField.pageFormFieldName.rows;
			    		textarea.cols = formField.pageFormFieldName.cols;
			    		textarea.value = value;
			    		td2.appendChild(textarea);
			    		var td3 = document.createElement("TD");
			    		var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[0]).concat("_ERROR");
				    	span.className = "ui-hide ui-error";
				    	span.value = "Error";
				    	td3.appendChild(span);
			    		fieldContainer.appendChild(td1);
			    		fieldContainer.appendChild(td2);
			    		fieldContainer.appendChild(td3);
						
			    	} else if (formField.pageFormFieldName.fieldType == "TXT"){
			    		var name = formField.pageFormFieldName.name.split("-");
			    		var value = "";
			    		if (item != null && item[name[1]] != null){
			    			value = "value='".concat(item[name[1]]).concat("'");
			    		}
			    		if (direction === "HORIZONTAL"){
			    			var inner = document.createElement("TABLE");
			    			fieldContainer.appendChild(inner);
			    			var tr1 = document.createElement("TR");
			    			inner.appendChild(tr1);
			    			var td1 = document.createElement("TD");
			    			tr1.appendChild(td1);
			    			td1.innerHTML = formFields[i].label.concat(required);
			    			
			    			var tr2 = document.createElement("TR");
			    			inner.appendChild(tr2);
				    		var td2 = document.createElement("TD");
				    		tr2.appendChild(td2);
				    		var input = document.createElement("INPUT");
				    		if (formField.pageFormFieldName.htmlType != null){
				    			input.type = formField.pageFormFieldName.htmlType;
				    		} else {
				    			input.type = "text";
				    		}
			    			input.readonly = true;
			    			input.autocapitalize = "off";
			    			input.id = formName.concat("-").concat(name[0]);
			    			input.name = formName.concat("-").concat(name[0]);
			    			if (formField.pageFormFieldName.className != null){
			    				input.className = formField.pageFormFieldName.className;
			    			}
			    			input.value = value;
			    			td2.appendChild(input);
			    			var td3 = document.createElement("TD");
				    		var span = document.createElement("SPAN");
					    	span.id = formName.concat("-").concat(name[0]).concat("_ERROR");
					    	span.className = "ui-hide ui-error";
					    	span.innerHTML = "Error";
					    	td3.appendChild(span);
					    	tr2.appendChild(td3);
			    			
			    		} else {
				    		var td1 = document.createElement("TD");
				    		td1.innerHTML = formFields[i].label.concat(required);
				    		var td2 = document.createElement("TD");
				    		var input = document.createElement("INPUT");
				    		if (formField.pageFormFieldName.htmlType != null){
				    			input.type = formField.pageFormFieldName.htmlType;
				    		} else {
				    			input.type = "text";
				    		}
			    			input.readonly = true;
			    			input.id = formName.concat("-").concat(name[0]);
			    			input.name = formName.concat("-").concat(name[0]);
			    			if (formField.pageFormFieldName.className != null){
			    				input.className = formField.pageFormFieldName.className;
			    			}
			    			input.value = value;
			    			td2.appendChild(input);
				    		var td3 = document.createElement("TD");
				    		var span = document.createElement("SPAN");
					    	span.id = formName.concat("-").concat(name[0]).concat("_ERROR");
					    	span.className = "ui-hide ui-error";
					    	span.innerHTML = "Error";
					    	td3.appendChild(span);
					    	fieldContainer.appendChild(td1);
					    	fieldContainer.appendChild(td2);
					    	fieldContainer.appendChild(td3);
			    		}

			    	} else if (formField.pageFormFieldName.fieldType == "DATE"){
			    		var name = formField.pageFormFieldName.name.split("-");
			    		var dateObj = new Object();
						dataObj.name = formName.concat("-").concat(name[1]);
			    		if (dataObj != null && dataObj[name[1]] != null){
			    			dateObj.date = new Date(dataObj[name[1]]);
			    		}

			    		var td1 = document.createElement("TD");
			    		td1.innerHTML = formFields[i].label.concat(required);
			    		var td2 = document.createElement("TD");
			    		var input = document.createElement("INPUT");
		    			input.type = "text";
		    			input.readonly = true;
		    			input.id = formName.concat("-").concat(name[1]);
		    			input.name = formName.concat("-").concat(name[1]);
		    			input.className = formField.pageFormFieldName.className;
		    			//input.value = value;
		    			td2.appendChild(input);
		    			var inputHidden = document.createElement("INPUT");
		    			inputHidden.type = "hidden";
		    			inputHidden.id = formName.concat("-").concat(name[1]).concat("-HIDDEN");
		    			td2.appendChild(inputHidden);
			    		var td3 = document.createElement("TD");
			    		var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[0]).concat("_ERROR");
				    	span.className = "ui-hide ui-error";
				    	span.value = "Error";
				    	td3.appendChild(span);
				    	fieldContainer.appendChild(td1);
				    	fieldContainer.appendChild(td2);
				    	fieldContainer.appendChild(td3);

						datePickerListener.push(dateObj);
			    	} else if (formField.pageFormFieldName.fieldType == "RDO"){
				    	var name = formField.pageFormFieldName.name.split("-");

				    	var td1 = document.createElement("TD");
				    	td1.innerHTML = formField.label.concat(required);
				    	var td2 = document.createElement("TD");
				    	// get radio group from pageTexts
				    	var input = "";
				    	for( var s = 0, slen = formFields.length; s < slen; s++ ) {
				    		var subFormField = formFields[s];
				    		if(subFormField.pageFormFieldName.subGroup == subFormField.pageFormFieldName.group) {
				    			input = document.createElement("INPUT");
				    			input.type = "radio";
				    			input.name = "group-".concat(name[1]);
				    			if (dataObj != null){
				    				if (dataObj[name[1]] != null){
				    					if (typeof dataObj[name[1]] == "boolean"){
				    						var b = false;
				    						if(subFormField.value == "true"){
				    							b = true;
				    						}
				    						if (dataObj[name[1]] == b){
				    							input.checked = true;
				    						}
				    					}
				    				}
				    			} else {
				    				if(subFormField.required){
				    					input.checked = true;
				    				}
				    			}
				    			input.value = subFormField.value;
				    			td2.appendChild(input);
				    			td2.appendChild(document.createTextNode(subFormField.label));
				    			td2.appendChild(document.createElement("BR"));
				    		}
				    	}
				    	var td3 = document.createElement("TD");
				    	var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[0]).concat("_ERROR");
				    	span.className = "ui-hide";
				    	span.value = "Error";
				    	td3.appendChild(span);
				    	fieldContainer.appendChild(td1);
				    	fieldContainer.appendChild(td2);
				    	fieldContainer.appendChild(td3);

				    }
			    }
	    	}
		}
		
		for ( var i = 0, len = datePickerListener.length; i < len; i++) {
			jQuery("#".concat(datePickerListener[i].name)).datepicker({ dateFormat: "DD, d MM, yy", altField: "#".concat(datePickerListener[i].name).concat("-HIDDEN"), altFormat: "yy-mm-dd"});
			if (datePickerListener[i].date != null){
				jQuery("#".concat(datePickerListener[i].name)).datepicker('setDate',datePickerListener[i].date);
			}
		}
		// Create buttons as needed
		if (buttons != null){
			var direction = "VERTICAL";
			var buttonsContainer = null;
			if (!this.isEmpty(params.buttonDirection) && params.buttonDirection.toUpperCase() === "HORIZONTAL"){
				direction = "HORIZONTAL";
				if (fieldHorizontalTR != null){
					buttonsContainer = fieldHorizontalTR;
				} else {
					buttonsContainer = table;
				}
			} else {
				buttonsContainer = table;
			}
			for( var i = 0, len = buttons.length; i < len; i++ ) {
				if (buttons[i].rendered == true){
					if (direction === "HORIZONTAL"){
						buttonContainer = document.createElement("TD");
						buttonsContainer.appendChild(buttonContainer);
					} else {
						buttonContainer = document.createElement("TR");
						buttonsContainer.appendChild(buttonContainer);
					}
					var wrapperDiv = document.createElement("DIV");
					var button = document.createElement("BUTTON");
					button.innerHTML = buttons[i].value;
					
					if (!this.isEmpty(params[buttons[i].pageLabelName.name.concat("_onclick")])){ button.onclick = params[buttons[i].pageLabelName.name.concat("_onclick")]; }
					wrapperDiv.appendChild(button);
					buttonContainer.appendChild(wrapperDiv);
				}
			}
			
		}
		
	}; // simpleFormRenderer
	
	this.simpleGridFormRenderer = function(params){
    	toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::simpleGridFormRenderer");
    	var pageTexts = params[params.pageTextsType];
		var formFields = params.formFields;
		var item = params.item;
		var formName = params.sysPageFormName;
		var container = params.container;
		var headerDiv = null;
		if (params.headerModifyTxt != null){
			var headerModifyTxt = pageTexts[params.headerModifyTxt];
			if (headerModifyTxt != null && headerModifyTxt.rendered) {
				headerDiv = document.createElement("DIV");
				headerDiv.innerHTML = headerModifyTxt.value;
				container.appendChild(headerDiv);
			}
		}
		var table = document.createElement("TABLE");
		var datePickerListener = new Array();
		if (formFields != null){
			var required = "";
			var tr = null;
			var td1 = null;
			var td2 = null;
			var td3 = null;
			for( var i = 0, len = formFields.length; i < len; i++ ) {
				var formField = formFields[i];
			    if(formField.rendered && formField.pageFormFieldName.group == params.group) {
			    	if (formField.required){ required="*"; } else { required = ""; }
			    	if (formField.pageFormFieldName.fieldType == "MTXT"){
			    		if (formField.required){
			    			if (!toastHub.utils.validateMultiLingualText(formField.pageFormFieldName.name,lang,AllLanguages,null)){
			    				isValid = false; 
			    				document.getElementById(formField.pageFormFieldName.name.concat("_Error")).className = "showError";
			    			} else {
			    				document.getElementById(formField.pageFormFieldName.name.concat("_Error")).className = "hideError";
			    			}
			    		}
			    		
			    	} else if (formField.pageFormFieldName.fieldType == "TXTA"){
			    		var name = formField.pageFormFieldName.name.split("-");
						var value = "";
			    		if (item != null && item[name[1]] != null){
			    			value =  "value='".concat(item[name[1]]).concat("'");
			    		}
			    		tr = document.createElement("TR");
			    		td1 = document.createElement("TD");
			    		td1.innerHTML = formField.label.concat(required);
			    		td2 = document.createElement("TD");
			    		var textarea = document.createElement("TEXTAREA");
			    		textarea.id = formName.concat("-").concat(name[0]);
			    		textarea.name = formName.concat("-").concat(name[0]);
			    		input.className = formField.pageFormFieldName.className;
			    		textarea.rows = formField.pageFormFieldName.rows;
			    		textarea.cols = formField.pageFormFieldName.cols;
			    		textarea.value = value;
			    		td2.appendChild(textarea);
			    		td3 = document.createElement("TD");
			    		var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[1]).concat("_ERROR");
				    	span.className = "jd-hide";
				    	span.value = "Error";
				    	td3.appendChild(span);
			    		tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						table.appendChild(tr);
			    	} else if (formField.pageFormFieldName.fieldType == "TXT"){
			    		var name = formField.pageFormFieldName.name.split("-");
			    		var value = "";
			    		if (item != null && item[name[1]] != null){
			    			value = "value='".concat(item[name[1]]).concat("'");
			    		}
			    		tr = document.createElement("TR");
			    		td1 = document.createElement("TD");
			    		td1.innerHTML = formFields[i].label.concat(required);
			    		td2 = document.createElement("TD");
			    		var input = document.createElement("INPUT");
		    			input.type = "text";
		    			input.readonly = true;
		    			input.id = formName.concat("-").concat(name[0]);
		    			input.name = formName.concat("-").concat(name[0]);
		    			input.className = formField.pageFormFieldName.className;
		    			input.value = value;
		    			td2.appendChild(input);
			    		td3 = document.createElement("TD");
			    		var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[1]).concat("_ERROR");
				    	span.className = "jd-hide";
				    	span.value = "Error";
				    	td3.appendChild(span);
			    		tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						table.appendChild(tr);
			    	} else if (formField.pageFormFieldName.fieldType == "DATE"){
			    		var name = formField.pageFormFieldName.name.split("-");
			    		var dateObj = new Object();
						dataObj.name = formName.concat("-").concat(name[1]);
			    		if (dataObj != null && dataObj[name[1]] != null){
			    			dateObj.date = new Date(dataObj[name[1]]);
			    		}
			    		tr = document.createElement("TR");
			    		td1 = document.createElement("TD");
			    		td1.innerHTML = formFields[i].label.concat(required);
			    		td2 = document.createElement("TD");
			    		var input = document.createElement("INPUT");
		    			input.type = "text";
		    			input.readonly = true;
		    			input.id = formName.concat("-").concat(name[1]);
		    			input.name = formName.concat("-").concat(name[1]);
		    			input.className = formField.pageFormFieldName.className;
		    			//input.value = value;
		    			td2.appendChild(input);
		    			var inputHidden = document.createElement("INPUT");
		    			inputHidden.type = "hidden";
		    			inputHidden.id = formName.concat("-").concat(name[1]).concat("-HIDDEN");
		    			td2.appendChild(inputHidden);
			    		td3 = document.createElement("TD");
			    		var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[1]).concat("_ERROR");
				    	span.className = "jd-hide";
				    	span.value = "Error";
				    	td3.appendChild(span);
			    		tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						table.appendChild(tr);
						datePickerListener.push(dateObj);
			    	} else if (formField.pageFormFieldName.fieldType == "RDO"){
				    	var name = formField.pageFormFieldName.name.split("-");
				    	tr = document.createElement("TR");
				    	td1 = document.createElement("TD");
				    	td1.innerHTML = formField.label.concat(required);
				    	td2 = document.createElement("TD");
				    	// get radio group from pageTexts
				    	var input = "";
				    	for( var s = 0, slen = formFields.length; s < slen; s++ ) {
				    		var subFormField = formFields[s];
				    		if(subFormField.pageFormFieldName.subGroup == subFormField.pageFormFieldName.group) {
				    			input = document.createElement("INPUT");
				    			input.type = "radio";
				    			input.name = "group-".concat(name[1]);
				    			if (dataObj != null){
				    				if (dataObj[name[1]] != null){
				    					if (typeof dataObj[name[1]] == "boolean"){
				    						var b = false;
				    						if(subFormField.value == "true"){
				    							b = true;
				    						}
				    						if (dataObj[name[1]] == b){
				    							input.checked = true;
				    						}
				    					}
				    				}
				    			} else {
				    				if(subFormField.required){
				    					input.checked = true;
				    				}
				    			}
				    			input.value = subFormField.value;
				    			td2.appendChild(input);
				    			td2.appendChild(document.createTextNode(subFormField.label));
				    			td2.appendChild(document.createElement("BR"));
				    		}
				    	}
				    	td3 = document.createElement("TD");
				    	var span = document.createElement("SPAN");
				    	span.id = formName.concat("-").concat(name[1]).concat("_ERROR");
				    	span.className = "jd-hide";
				    	span.value = "Error";
				    	td3.appendChild(span);
				    	tr.appendChild(td1);
						tr.appendChild(td2);
						tr.appendChild(td3);
						table.appendChild(tr);
				    }
			    }
	    	}
		}
		container.appendChild(table);
		for ( var i = 0, len = datePickerListener.length; i < len; i++) {
			jQuery("#".concat(datePickerListener[i].name)).datepicker({ dateFormat: "DD, d MM, yy", altField: "#".concat(datePickerListener[i].name).concat("-HIDDEN"), altFormat: "yy-mm-dd"});
			if (datePickerListener[i].date != null){
				jQuery("#".concat(datePickerListener[i].name)).datepicker('setDate',datePickerListener[i].date);
			}
		}
		if (!this.isEmpty(params.showSave) && params.showSave) {
			var saveDiv = document.createElement("DIV");
			var saveButton = document.createElement("BUTTON");
			saveButton.innerHTML = 'Save';
			if (!this.isEmpty(params.saveOnClick)){ saveButton.onclick = params.saveOnClick; }
			saveDiv.appendChild(saveButton);
			container.appendChild(saveDiv);
		}
		if (!this.isEmpty(params.showClose) && params.showClose) {
			var closeDiv = document.createElement("DIV");
			closeButton = document.createElement("BUTTON");
			closeButton.innerHTML = 'Close';
			if (!this.isEmpty(params.closeOnClick)){ closeButton.onclick = params.closeOnClick; }
			closeDiv.appendChild(closeButton);
			container.appendChild(closeDiv);
		}
	}; // simpleFormRenderer
	
	this.languageTabs = function(languages,container,theMap,textsMap,mapKey){
		var iHTML = "<div id='".concat(container).concat("-tabs'><ul>");
			for ( var l = 0; l < languages.length; l++) {
				var langRequired = "";
				if (languages[l].defaultLang){langRequired = "* ";}
				iHTML.concat("<li><a href='#").concat(container).concat("-tabs-").concat(l).concat("'>").concat(languages[l].languageName).concat(" ").concat(langRequired).concat("</a></li>");
			}
			iHTML.concat("</ul>");
			for ( var l = 0; l < languages.length; l++) {
				var langDir = "";
				if (languages[l].dir == "rtl"){ langDir = "dir='rtl'";}
				if (theMap != null && theMap.hasOwnProperty(languages[l].shortCode)){
					iHTML.concat("<div id='").concat(container).concat("-tabs-").concat(l).concat("'>");
					iHTML.concat("<form class='edit-form'>");
					iHTML.concat("<p>").concat(textsMap[mapKey.concat('_TRANSLATE_VALUE')].value).concat(" <input type='textarea' rows='3' cols='40' ").concat(langDir).concat(" id='").concat(container).concat("-value-").concat(languages[l].shortCode).concat("' class='edit-text' value='").concat(theMap[languages[l].shortCode].value).concat("'/></p><p>").concat(textsMap[mapKey.concat('_TRANSLATE_MODIFY')].value).concat(" ").concat(theMap[languages[l].shortCode].modified).concat("</p></form>");
					iHTML.concat("</div>");
				} else {
					iHTML.concat("<div id='").concat(container).concat("-tabs-").concat(l).concat("'>");
					iHTML.concat("<form class='edit-form'>");
					iHTML.concat("<p>").concat(textsMap[mapKey.concat('_TRANSLATE_VALUE')].value).concat(" <input type='textarea' rows='3' cols='40' ").concat(langDir).concat(" id='").concat(container).concat("-value-").concat(languages[l].shortCode).concat("' class='edit-text' value=''/></p><p>").concat(textsMap[mapKey.concat('_TRANSLATE_MODIFY')].value).concat(" ").concat(textsMap[mapKey.concat('_TRANSLATE_DEFAULT')].value).concat("</p></form>");
					iHTML.concat("<input type='hidden' id='").concat(container).concat("-novalue-").concat(languages[l].shortCode).concat("' />");
					iHTML.concat("</div>");
				}
			}
		iHTML.concat("</div>");
		return iHTML;
    }; // lauguageTabs
    
    this.languageTable = function(languages,container,theMap,textsMap,mapKey){
    	var iHTML = "<table border='1'><tr><th>Language</th><th>Value</th></tr>";
			for ( var l = 0; l < languages.length; l++) {
				var langRequired = "";
				if (languages[l].defaultLang){langRequired = "* ";}
				iHTML.concat("<tr><td>").concat(languages[l].languageName).concat(" ").concat(langRequired).concat("</td>");
				var langDir = "";
				if (languages[l].dir == "rtl"){ langDir = "dir='rtl'";}
				if (theMap != null && theMap.hasOwnProperty(languages[l].shortCode)){
					iHTML.concat("<td><div>").concat(textsMap[mapKey.concat('_TRANSLATE_VALUE')].value).concat(" <input type='textarea' rows='3' cols='40' ").concat(langDir).concat(" id='").concat(container).concat("-value-").concat(languages[l].shortCode).concat("' class='edit-text' value='").concat(theMap[languages[l].shortCode].value).concat("'/></div>")
							.concat("<div>").concat(textsMap[mapKey.concat('_TRANSLATE_MODIFY')].value).concat(" ").concat(theMap[languages[l].shortCode].modified).concat("</div></td>");
				} else {
					iHTML.concat("<td><div>").concat(textsMap[mapKey.concat('_TRANSLATE_VALUE')].value).concat(" <input type='textarea' rows='3' cols='40' ").concat(langDir).concat(" id='").concat(container).concat("-value-").concat(languages[l].shortCode).concat("' class='edit-text' value=''/></div>")
					.concat("<div>").concat(textsMap[mapKey.concat('_TRANSLATE_MODIFY')].value).concat(" ").concat(textsMap[mapKey.concat('_TRANSLATE_DEFAULT')].value).concat("</div><input type='hidden' id='").concat(container).concat("-novalue-").concat(languages[l].shortCode).concat("' /></td>");
				}
				iHTML.concat("</tr>");
			}
		iHTML.concat("</table>");
		return iHTML;
    	
    }; // languageTable
    
    this.getLangDir = function(languages,selectLang){
    	if (languages != null && languages.length > 0 && selectLang != null) {
    		for ( var i = 0; i < languages.length; i++) {
    			if (selectLang == languages[i].shortCode){
    				return languages[i].dir;
    			}
    		}
    	}
    }; // getLangDir
    
    this.getMultiLingualText = function(container,languages){
    	var multiText = new Array();
    	for ( var l = 0; l < languages.length; l++) {
    		var text = document.getElementById(container.concat("-value-").concat(languages[l].shortCode)).value;
    		if(document.getElementById(container.concat("-novalue-").concat(languages[l].shortCode)) && text == ""){
    			continue;
    		}
    		var valueObj = new Object();
    		valueObj.value = text;
    		valueObj.language = languages[l].shortCode;
    		multiText.push(valueObj);
    	}
    	return multiText;
    }; // getMultiLingualText
    
    this.validateMultiLingualText = function(container,mustHaveLang,languages,pattern){
    	var multiText = new Array();
    	var valid = true;
    	if (mustHaveLang != null && document.getElementById(container.concat("-value-").concat(mustHaveLang)).value == ""){ return false;}
    	/*if (pattern != null){
    		for ( var l = 0; l < languages.length; l++) {
    				var input = document.getElementById(container+"-value-"+languages[l].shortCode).value;
    				if(input != "" && !(pattern.test(input))){
    					return false;
    				}
    		}
    	}*/
    	return valid;
    }; // validateMultiLingualText
    
    this.validateFields = function(fields,lang,languages,group,prefix){
    	var isValid = true;
    	var errorList = new Array();
    	for( var i = 0, len = fields.length; i < len; i++ ) {
		    if(fields[i].rendered ) {
		    	
		    	switch (fields[i].fieldType) {
				case "MTXT":
					if (fields[i].required){
						for(var j=0;j<languages.length;j++){
							var fieldName = fields[i].name;
			    			if (prefix != null) {
			    				fieldName = prefix.concat("-").concat(fieldName);
			    			}
							var inputObj = jQuery("#".concat(fieldName).concat("-").concat(languages[j].code));
							if (input == null || (input != null && input == "")){
			    				isValid = false;
			    				inputObj.addClass('input-error');
			    			} else {
			    				inputObj.removeClass('input-error');
			    			}
						}
					}
		    		break;
				case "TXT":
					var fieldName = fields[i].name;
	    			if (prefix != null) {
	    				fieldName = prefix.concat("-").concat(fieldName);
	    			}
	    			var inputObj = jQuery("#".concat(fieldName));
	    			var input = inputObj.val();
	    			var errorText = jQuery("#".concat(fieldName).concat("-error"));
	    			var requiredError = false;
		    		if (fields[i].required){
		    			if (input == null || (input != null && input == "")){
		    				isValid = false;
		    				inputObj.addClass('input-error');
		    				errorText.show();
		    				errorText.text("Required");
		    				requiredError = true;
		    			} else {
		    				inputObj.removeClass('input-error');
		    				errorText.hide();
		    			}
		    		}
		    		if (requiredError == false && fields[i].validation != null && fields[i].validation != "") {
		    			var validateParams = JSON.parse(fields[i].validation);
						if (validateParams.regex != null && validateParams.regex != ""){
							var regex = new RegExp(validateParams.regex);
							
							if (input != null && regex != null && regex.exec(input) != null) {
								inputObj.removeClass('input-error');
								errorText.hide();
						    } else {
						    	isValid = false;
			    				inputObj.addClass('input-error');
			    				inputObj.focus();
			    				errorText.show();
			    				errorText.text(validateParams.errorMsg);
						    }
							
						}
		    		}
		    		
		    		break;
				case "TXTA":
		    		if (fields[i].required){
		    			var fieldName = fields[i].name;
		    			if (prefix != null) {
		    				fieldName = prefix.concat("-").concat(fieldName);
		    			}
		    			var inputObj = jQuery("#".concat(fieldName));
		    			var input = inputObj.val();
		    			if (input == null || (input != null && input == "")){
		    				isValid = false;
		    				inputObj.addClass('input-error');
		    			} else {
		    				inputObj.removeClass('input-error');
		    			}
		    		}
		    		
		    		break;
				case "BLN":
		    	
		    		break;
				case "LTXT":
					if (fields[i].required){
						for(var j=0;j<languages.length;j++){
							var fieldName = fields[i].name;
			    			if (prefix != null) {
			    				fieldName = prefix.concat("-").concat(fieldName);
			    			}
							var inputObj = jQuery("#".concat(fieldName).concat("-").concat(languages[j].code));
							if (languages[j].title.langTexts != null){
								for(var k=0;k<languages[j].title.langTexts.length;k++){
									if (languages[j].title.langTexts[k].lang == toastHub.lang && languages[j].code == toastHub.lang){
										var input = inputObj.val();
										if (input == null || (input != null && input == "")){
						    				isValid = false;
						    				inputObj.addClass('input-error');
						    			} else {
						    				inputObj.removeClass('input-error');
						    			}
									}
								}
							}
						}
					
					}
					break;
				case "MDLSNG":
					if (fields[i].required){
						var fieldName = fields[i].name;
		    			if (prefix != null) {
		    				fieldName = prefix.concat("-").concat(fieldName);
		    			}
		    			var inputObj = jQuery("#".concat(fieldName));
		    			var input = inputObj.val();
		    			if (input == null || (input != null && input == "")){
		    				isValid = false;
		    				inputObj.addClass('input-error');
		    			} else {
		    				inputObj.removeClass('input-error');
		    			}
		    		}
					break;
		    	}
		    }
    	}
    	return isValid;
    }; // validateFields
    
    this.marshallFields = function(fields,myObj,languages,prefix){
    	var resultObj = {};
    	for( var i = 0, len = fields.length; i < len; i++ ) {
		    if(fields[i].rendered) {
		    	var input = "";
		    	var fieldName = fields[i].name;
    			if (prefix != null) {
    				fieldName = prefix.concat("-").concat(fieldName);
    			}
		    	switch (fields[i].fieldType) {
				case "MTXT":
					var ltxt = {};
					for(var j=0;j<languages.length;j++){
						if (languages[j].title.langTexts != null){
							for(var k=0;k<languages[j].title.langTexts.length;k++){
								ltxt[languages[j].code] = jQuery("#".concat(fieldName).concat("-").concat(languages[j].code)).val();
							}
						}
					}
					resultObj[fields[i].name] = ltxt;
					break;
				case "TXT":
					resultObj[fields[i].name] = jQuery("#".concat(fieldName)).val();
					break;
				case "TXTA":
					break;
				case "BLN":
					if (fields[i].htmlType == "radioH"){
						resultObj[fields[i].name] = jQuery('#radio-'.concat(fieldName).concat(' label.active input')).val();
					}
					break;
				case "MBLN":
					if (fields[i].htmlType == "radioH"){
						var ltxt = {};
						for(var j=0;j<languages.length;j++){
							if (languages[j].title.langTexts != null){
								for(var k=0;k<languages[j].title.langTexts.length;k++){
									ltxt[languages[j].code] = jQuery("#radio-".concat(fieldName).concat("-").concat(languages[j].code).concat(' label.active input')).val();
								}
							}
						}
						resultObj[fields[i].name] = ltxt;
					}
					break;
				case "SLT":
					resultObj[fields[i].name] = jQuery("#".concat(fieldName)).val();
					break;
				case "LTXT":
					var ltxt = {};
					for(var j=0;j<languages.length;j++){
						if (languages[j].title.langTexts != null){
							for(var k=0;k<languages[j].title.langTexts.length;k++){
								ltxt[languages[j].code] = jQuery("#".concat(fieldName).concat("-").concat(languages[j].code)).val();
							}
						}
					}
					resultObj[fields[i].name] = ltxt;
					break;
				case "MDLSNG":
					resultObj[fields[i].name] = jQuery("#".concat(fieldName)).val();
					break;
		    	}
		    }
    	}
    	return resultObj;
    }; // marshallFields
    
    this.addStyleSheet = function(params) {
    	if (!document.getElementById(params.cssId)) {
    	    var head  = document.getElementsByTagName('head')[0];
    	    var link  = document.createElement('link');
    	    link.id   = params.cssId;
    	    link.rel  = 'stylesheet';
    	    link.type = 'text/css';
    	    link.href = params.href;
    	    link.media = 'all';
    	    head.appendChild(link);
    	}
    	
    }; // addStyleSheet
    
    this.checkMultipleFileSupport = function(){
		//do I support input type=file/multiple
		var el = document.createElement("input");
		return ("multiple" in el);
	};
	
	this.pictureViewer = function(params){
		// {container,images,baseUrl}
		var images = params.images;
		if (images != null){
			for ( var i = 0,len = images.length; i < len; i++) {
				var videoImageWrapper = document.createElement("DIV");
				videoImageWrapper.id = "attachment_".concat(images[i].id);
				videoImageWrapper.className = "jd-image-frame";
				params.container.appendChild(videoImageWrapper);
				if (images[i].contentType == "video/mp4"){
					var video = document.createElement("VIDEO");
					video.width = '320px';
					video.height = '240px';
					video.controls = true;
					video.innerHTML = "Your browser does not support the video tag.";
					videoImageWrapper.appendChild(video);
					var source = document.createElement("SOURCE");
					//source.src = toastHub.utils.restUrl.concat("eternal/bottleit/attachment/download/".concat(images[i].id;
					source.src = params.baseUrl.concat("attachment/video/download/").concat(images[i].id);
					//source.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
					video.appendChild(source);
					
				} else {
					var image = document.createElement("IMG");
					image.width = 320;
					image.height = 240;
					//image.src = toastHub.utils.restUrl.concat("eternal/bottleit/attachment/download/".concat(images[i].id;
					image.src = params.baseUrl.concat("attachment/thumbnail/download/").concat(images[i].id);
					videoImageWrapper.appendChild(image);
					
				}
				var menuDiv = document.createElement("DIV");
				videoImageWrapper.appendChild(menuDiv);
				menuDiv.appendChild(document.createTextNode(images[i].comment));
				if (params.allowDelete != null && params.allowDelete){
					var remove = document.createElement("IMG");
					remove.className = 'jd-right';
					remove.alt = "Delete";
					remove.src = "../../img/delete_icon&16.png";
					remove.onclick = (function(id){ return function(){pself.deleteImage(id);}; })(images[i].id);
					menuDiv.appendChild(remove);
				}
				var menuClear = document.createElement("SPAN");
				menuClear.className = 'jd-clear';
				menuDiv.appendChild(menuClear);
			}
		}
	}; // pictureViewer
	
	this.showPreview = function(id){
		var previewArea = document.getElementById("preview-".concat(id));
		previewArea.innerHTML = "";
		var files = document.getElementById("imageUpload-".concat(id)).files;
		for ( var i = 0; i < files.length; i++) {
			this.loadImg(files[i],previewArea,i);
		}
	}; //showPreview
	
	this.loadImg = function(file,previewArea,i){
		var wrapper = document.createElement("div");
		var img = document.createElement("img");
		img.setAttribute("class","jd-preview-image");
		var reader = new FileReader();  
		reader.onloadend = function(e) { img.src = e.target.result; };
		reader.readAsDataURL(file);
		wrapper.appendChild(img);
		var commentWrapper = document.createElement("div");
		commentWrapper.className = "jd-inline";
		var commentText = document.createElement("div");
		commentText.appendChild(document.createTextNode("Comment:"));
		commentWrapper.appendChild(commentText);
		var comment = document.createElement("textarea");
		comment.id = "comment_".concat(i);
		comment.rows = 2;
		comment.cols = 30;
		commentWrapper.appendChild(comment);
		wrapper.appendChild(commentWrapper);
		var status = document.createElement("img");
		status.id = "status_".concat(i);
		wrapper.appendChild(status);
		var progress = document.createElement("div");
		progress.id = "progress_".concat(i);
		wrapper.appendChild(progress);
		previewArea.appendChild(wrapper);
	};
	
	this.resizeFile = function(file){
		var fileType = file.type;
		var reader = new FileReader();
		reader.onloadend = function() {
			  var image = new Image();
			      image.src = reader.result;

			  image.onload = function() {
			    var maxWidth = 640,
			        maxHeight = 480,
			        imageWidth = image.width,
			        imageHeight = image.height;

			    if (imageWidth > imageHeight) {
			      if (imageWidth > maxWidth) {
			        imageHeight *= maxWidth / imageWidth;
			        imageWidth = maxWidth;
			      }
			    } else {
			      if (imageHeight > maxHeight) {
			        imageWidth *= maxHeight / imageHeight;
			        imageHeight = maxHeight;
			      }
			    }

			    var canvas = document.createElement('canvas');
			    canvas.width = imageWidth;
			    canvas.height = imageHeight;

			    var ctx = canvas.getContext("2d");
			    ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

			    // The resized file ready for upload
				var myBlob = pself.dataURItoBlob(canvas.toDataURL(fileType));
			    pself.saveFile(myBlob);
			  };
		};
		reader.readAsDataURL(file);
		
	}; // resizeFile
	
	this.dataURItoBlob = function(dataURI) {
	    var byteString, mimestring; 

	    if(dataURI.split(',')[0].indexOf('base64') !== -1 ) {
	        byteString = atob(dataURI.split(',')[1]);
	    } else {
	        byteString = decodeURI(dataURI.split(',')[1]);
	    }

	    mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];

	    var content = new Array();
	    for (var i = 0; i < byteString.length; i++) {
	        content[i] = byteString.charCodeAt(i);
	    }

	    return new Blob([new Uint8Array(content)], {type: mimestring});
	}; // dataURItoBlob
	
	this.boxRenderer = function(params){
		var className = "ui-boxColumn90";
		if (params.boxType == "column90"){
			className = "ui-boxColumn90";
		} else if (params.boxType == "column50") {
			className = "ui-boxColumn50";
		}
			var divColumn = document.createElement("DIV");
			divColumn.className = className;
			var divHeader = document.createElement("DIV");
			divHeader.className = "ui-boxHeader";
			divColumn.appendChild(divHeader);
			this.searchRenderer(params,divHeader);
			this.headerMenuRenderer(params,divHeader);
			var content = document.createElement("DIV");
			content.id = params.contentId;
			content.className = "ui-boxContent";
			divColumn.appendChild(content);
			params.tab.appendChild(divColumn);
		
	}; // boxRenderer
	
	this.searchRenderer = function(params){
		if (!this.isEmpty(params.searchContainer)) {
			var divSearch = document.createElement("DIV");
			if (!this.isEmpty(params.searchContainerClassName)){ divSearch.className = params.searchContainerClassName; } else { divSearch.className = "jd-searchwrapper"; }
			params.searchContainer.appendChild(divSearch);
			var inputSearchField = document.createElement("INPUT");
			inputSearchField.type = "text";
			if (!this.isEmpty(params.searchFieldClassName)){ inputSearchField.className = params.searchFieldClassName; } else { inputSearchField.className = "jd-searchField"; }
			if (!this.isEmpty(params.searchFieldId)){ inputSearchField.id = params.searchFieldId; } else { inputSearchField.id = this.randomId('searchField'); params.searchFieldId = inputSearchField.id;}
			if (!this.isEmpty(params.searchFieldName)){ inputSearchField.name = params.searchFieldName; } else { inputSearchField.name = inputSearchField.id; }
			if (!this.isEmpty(params.searchFieldOnBlur)){ inputSearchField.onblur = params.searchFieldOnBlur; } else { inputSearchField.onblur = function(){ if (this.value == "") { this.value = "Search...";} }; }
			if (!this.isEmpty(params.searchFieldOnFocus)){ inputSearchField.onfocus = params.searchFieldOnFocus; } else { inputSearchField.onfocus = function(){ if (this.value == "Search...") { this.value = "";} }; }
			if (!this.isEmpty(params.searchFieldValue)){ inputSearchField.value = params.searchFieldValue; } else { inputSearchField.value = "Search..."; }
			divSearch.appendChild(inputSearchField);
			var inputSearchButton  = document.createElement("INPUT");
			inputSearchButton.type = "button";
			if (!this.isEmpty(params.searchButtonClassName)){inputSearchButton.className = params.searchButtonClassName;} else { inputSearchButton.className = "jd-searchButton"; }
			if (!this.isEmpty(params.searchButtonOnClick)){ inputSearchButton.onclick = params.searchButtonOnClick; } else { inputSearchButton.onclick = (function(params){ return function(){toastHub.getController(params.controllerName).getList(params);}; })(params);  }
			if (!this.isEmpty(params.searchButtonValue)){ inputSearchButton.value = params.searchButtonValue; } else { inputSearchButton.value = "Go"; }
			divSearch.appendChild(inputSearchButton);
		}
	}; // searchRenderer
	
	this.boxMenuRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::boxMenuRenderer");
		if (!this.isEmpty(params.boxMenuContainer)) {
			var divMenu = document.createElement('DIV');
			if (!this.isEmpty(params.boxMenuContainerClassName)){ divMenu.className = params.boxMenuContainerClassName; } else { divMenu.className = "jd-boxMenu jd-right"; }
			params.searchContainer.appendChild(divMenu);
			var buttons = params.menuButtons;
			if (buttons != null){
				for (var i = 0; i < buttons.length; i++) {
					var buttonDiv = document.createElement("DIV");
					buttonDiv.className = 'jd-btn-flat jd-right';
					buttonDiv.innerHTML = buttons[i].name;
					if (buttons[i].onClick != null){
						buttonDiv.onclick = buttons[i].onClick();
					}
					divMenu.appendChild(buttonDiv);
				}
				var liMenuClear = document.createElement("SPAN");
				liMenuClear.className = 'jd-clear';
				
				divMenu.appendChild(liMenuClear);
			}
		}
	}
	
	this.headerMenuRenderer = function(params,container){
		var addMenu = document.createElement("SPAN");
		addMenu.className = "ui-title-right-area";
		addMenu.onclick = params.menuOnClick;
		addMenu.innerHTML = params.menuValue;
		container.appendChild(addMenu);
	}; // headerMenuRenderer
	
	this.simpleList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::simpleList");
		if (params.container == null){
			alert("Missing container");
			return;
		}
		params.container.innerHTML = "";
		
		// paging
		params.pagingContainer = params.container;
		this.pagingRenderer(params);
		
		// list
		if (params.listRenderer != null){
			params.listRenderer(params);
		} else {
			this.listRenderer(params);
		}

		// Paging
		this.pagingRenderer(params);
		
		this.makeTogglePosts();
	}; // esSimpleList
	
	
	this.listRenderer = function(params) {
		var ulList = document.createElement("UL");
		ulList.className = 'jd-list';
		params.container.appendChild(ulList);
		// headings
		if (!this.isEmpty(params.columns) && params.columns.length > 0){
			var columns = params.columns;
			var headerLi = document.createElement("LI");
			headerLi.id = "item-header";
			for (var c = 0, clen = columns.length; c < clen; c++){
				var title = document.createElement("DIV");
				title.className = 'jd-column-item jd-column-200';
				title.innerHTML = columns[c];
				headerLi.appendChild(title);
			}
			ulList.appendChild(headerLi);
		}
		
		// items
		if (!this.isEmpty(params.items) && params.items.length > 0){
			var items = params.items;
			var columns = params.columns;
			var dataTypes = params.dataTypes;
			for (var i = 0, len = items.length; i < len; i++){
				var myItem = items[i];
				var liList = document.createElement("LI");
				liList.id = "item-".concat(myItem.id);
				for (var c = 0, clen = columns.length; c < clen; c++){
				
					var title = document.createElement("DIV");
					title.className = 'jd-column-item jd-column-200';
					if (dataTypes[c] == "mtext"){
						liList.appendChild(this.mtextRenderer(items[i]));
					} else {
						title.innerHTML = myItem[columns[c]];
						liList.appendChild(title);
					}
				}
					
				if (!this.isEmpty(params.itemButtons) && params.itemButtons.length > 0){
					var buttons = params.itemButtons;
					for (var b = 0, blen = buttons.length; b < blen; b++){
						var buttonDiv = document.createElement("DIV");
						buttonDiv.className = 'jd-btn-flat jd-right';
						buttonDiv.innerHTML = buttons[b].name;
						if (buttons[b].onClick != null){
							buttonDiv.onclick = buttons[b].onClick(myItem.id);
						}
						liList.appendChild(buttonDiv);
					}
				
					var liMenuClear = document.createElement("SPAN");
					liMenuClear.className = 'jd-clear';
					liList.appendChild(liMenuClear);
				}
				
				ulList.appendChild(liList);
			}
		} else {
			var noResults = document.createElement("LI");
			noResults.innerHTML = "No results returned";
			ulList.appendChild(noResults);
		}
	}
	
	
	this.mtextRenderer = function(item){
		// default text
		var container = document.createElement("DIV");
		var labelDefaultText = document.createElement("DIV");
		labelDefaultText.innerHTML = "Default: ";
		container.appendChild(labelDefaultText);
		var valueDefaultText = document.createElement("DIV");
		valueDefaultText.innerHTML = item.defaultText;
		container.appendChild(valueDefaultText);
		// lang texts
		var langTexts = item.langTexts;
		for (var i = 0, len = langTexts.length; i < len; i++) {
			var labelText = document.createElement("DIV");
			labelText.innerHTML = langTexts[i].lang;
			container.appendChild(labelText);
			var valueText = document.createElement("DIV");
			valueText.innerHTML = langTexts[i].text;
			container.appendChild(valueText);
			var labelModified = document.createElement("DIV");
			labelModified.innerHTML = "Last Modified: ";
			container.appendChild(labelModified);
			var valueModified = document.createElement("DIV");
			valueModified.innerHTML = langTexts[i].modified;
			container.appendChild(valueModified);
		}
		return container;
	}
	
	this.makeTogglePosts = function(){
		toastHub.logSystem.log("DEBUG","toastHub-core::toasthubUtil::makeTogglePosts");
		jQuery( ".ui-lane-item-header .ui-icon" ).click(function() {
			jQuery( this ).toggleClass( "ui-icon-minusthick" ).toggleClass( "ui-icon-plusthick" );
			jQuery( this ).parents( ".ui-lane-item:first" ).find( ".ui-death-item-content" ).toggle();
		});
	}; // makeTogglePosts
	
	this.isEmpty = function(param){
		if (param != null && param != ""){
			return false;
		} else {
			return true;
		}
	}; // isEmpty
	
	this.randomId = function(param){
		while(true) {
			var id = param.concat("-").concat(Math.floor(Math.random()*1001));
			if (document.getElementById(id) == null){
				return id;
			}
		}
	}; // randomId
	
	this.validateParams = function(params){
		if (params == null) {
    		alert("Params Missing");
    		return null;
    	}
	}; // validateParams
		
	this.clearFix = function(container){
		var clear = document.createElement("DIV");
		clear.className = "clearfix";
		container.appendChild(clear);
	}; // clearFix
	
	this.drawRow = function(params) {
		var row = document.createElement("DIV");
		row.className = "row";
		params.container.appendChild(row);
	}; // drawRow
	
	this.drawColumns = function(params) {
		var col = document.createElement("DIV");
		col.className = params.columnCSS;
		params.container.appendChild(col);
	}; // drawColumns

} // toastHubUtils


//For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
