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

ToastHubWorkFlow.prototype = Object.create(toastHubBase.prototype);
ToastHubWorkFlow.prototype.constructor = ToastHubWorkFlow;

function ToastHubWorkFlow(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "WORKFLOW_SVC";
	this.workflows = null;
	this.contentArea = null;
	this.mainContainer = null;
	this.panel = new ToastHubPanel();
	this.form = new ToastHubForm();
	this.modal = new ToastHubModal();
	this.selectedItem = null;
	this.selectedParent = null;
	var self = parent;
		
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::initCustom");
		params.appForms = ["APP_WORKFLOW_FORM","APP_WORKFLOW_ITEM_FORM"];
		params.appTexts = ["GLOBAL_PAGE","APP_MENU_PAGE"];
		//params.appLabels = ["APP_MENU_PAGE"];
	}; // initCustom
	
	this.listCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::listCustom");
	}; // listCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::initContent");
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
		
		// header and search
		self.searchFieldId = "menuSearchField";
		self.panel.headerWithSearchRenderer({container:self.mainContainer,
			id:"menuSearchField",
			title:self.pageTexts.APP_MENU_PAGE.APP_MENU_PAGE_HEADER.value + " - " + this.category,
			titleRender:self.pageTexts.APP_MENU_PAGE.APP_MENU_PAGE_HEADER.rendered,
			pageTexts:self.pageTexts,
			searchClick:function(e){self.searchClick(e);} });
		
		// create panel to hold list
		self.contentArea = self.panel.drawLargePanel({container:self.mainContainer,
								contentId:"content-area",
								header:false});
		
		// create modal for save and edit
		var modalParams = {id:"menuModal",container:self.mainContainer,headerTitle:"Edit",
				acceptClick:function(params){self.saveItem(params);},declineClick:function(){jQuery('#menuModal').modal('toggle');} };
		self.modal.render(modalParams);
		
		// create modal for accept
		var modalParams = {id:"acknowledgeModal",container:self.mainContainer,headerTitle:"Acknowledge",
				acceptClick:function(){},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.modal.render(modalParams);
		
		this.processList(params);
	}; // initContent
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::processList");
		self.menus = params.items;
		self.contentArea.innerHTML = "";
		
		var panelGroup = document.createElement("DIV");
		panelGroup.className = "panel-group";
		self.contentArea.appendChild(panelGroup);
		
		self.panel.menuPanelRenderer(
				{container:panelGroup,
					menuId:"menu-menu",
					parentId:"collapse_menu-ROOT",
					settings:{options:[
					           {onclick:function(params){self.openMenuModal(params);},
					        	   id:"menu-add",
					        	   title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}
					           ] 
					}
				}
			);
		
		if (self.menus != null && self.menus.length > 0) {
			params.paging = {container:self.contentArea,callBack:function(params){self.pagingRefresh(params);},pageTexts:self.pageTexts};
			toastHub.utils.pagingRenderer(params);
			for (var i =0; i < self.menus.length; i++) {
				//self.pageToElement[self.menus[i].id] = i;
				var body = self.panel.collapsePanelRenderer(
						{container:panelGroup,
							itemId:"_menu-"+self.menus[i].id,
							menuId:"menu_item_menu-"+self.menus[i].id,
							parentId:"collapse_menu-ROOT",
							title:toastHub.utils.getLangText({title:self.menus[i].title}),
							settings:{options:[
							            {onclick:function(params){self.openMenuModal(params);},
							            	title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
							            	id:"menu_item_modify-"+self.menus[i].id,
							            	item:self.menus[i]},
							            {onclick:function(params){self.openMenuDelete(params);},
							            	title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
							            	id:"menu_item_delete-"+self.menus[i].id,
							            	item:self.menus[i]}
							          ]
							}
						}
					);
			}
			jQuery(".collapse").on("show.bs.collapse",self.listItemOpen);
			toastHub.utils.pagingRenderer(params);
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_LIST_EMPTY.value;
			self.contentArea.appendChild(empty);
		}

	}; // processList
	
	this.listItemOpen = function(event){
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::listItemOpen");
		//self.selectedParent = event.target.id;
		var item = event.target.id.split("-");
		if (event.target.id.indexOf("menu") >= 0) {
			var params = {service:"MENU_SVC",action:"LIST_MENUITEMS",menuId:parseInt(item[1]),callBack:function(JSONData){self.menuListCallBack(JSONData);}};
			self.callService(params);
		} else {
			var params = {service:"MENU_SVC",action:"LIST_MENUITEMS",parentId:parseInt(item[1]),callBack:function(JSONData){self.menuItemsListCallBack(JSONData);}};
			self.callService(params);
		}
	}; // listItemOpen
	
	this.menuListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::menuListCallBack");
		var container = document.getElementById("collapse_menu-"+JSONData.params.parentId);
		container.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:container,
					menuId:"menu_item_main_menu-"+JSONData.params.parentId,
					parentId:"collapse_menu-"+JSONData.params.parentId,
					settings:{options:[   
					            {onclick:function(params){self.openMenuItemModal(params);},
					            id:"menu_item_main_create-"+JSONData.params.parentId,
					            title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}
						] 
					}
				}
			);
		if (JSONData.params.items != null && JSONData.params.items.length > 0) {
			var items = JSONData.params.items;
			// group menu with parents

			var parentMap = {};
			for (var i=0; i<items.length; i++){
				var myContainer = null;
				if (items[i].parentId != null){
					myContainer = parentMap[items[i].parentId];
				} else {
					myContainer = container
				}
				var body = self.panel.collapsePanelRenderer(
						{container:myContainer,
							itemId:"_subItem-"+items[i].id,
							parentId:"collapse_menu-"+JSONData.params.parentId,
							menuId:"menu_subItem_menu-"+items[i].id,
							title:this.getValueText({item:items[i]}),
							settings:{options:[{onclick:function(params){self.openMenuItemModal(params);},
													title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
													id:"menu_subItem_modify-"+items[i].id,
													item:items[i]},
							                   {onclick:function(params){self.openMenuItemDelete(params);},
													title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
													id:"menu_subItem_delete-"+items[i].id,
													item:items[i]}
												] 
							}
						}
					);
				parentMap[items[i].id] = body;
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = "No items available";
			container.appendChild(empty);
		}
	}; // formFieldListCallBack
	
	this.menuItemsListCallBack = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::menuItemListCallBack");
		var container = document.getElementById("collapse_subItem-"+JSONData.params.parentId);
		container.innerHTML = "";
		self.panel.menuPanelRenderer(
				{container:container,
					menuId:"menu_subItem_main_menu-"+JSONData.params.parentId,
					parentId:"collapse_subItem-"+JSONData.params.parentId,
					settings:{options:[   
					            {onclick:function(params){self.openMenuItemModal(params);},
					            id:"menu_subItem_main_create-"+JSONData.params.parentId,
					            title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_CREATE.value}
						] 
					}
				}
			);
		if (JSONData.params.items != null && JSONData.params.items.length > 0) {
			var items = JSONData.params.items;
			// group menu with parents

			var parentMap = {};
			for (var i=0; i<items.length; i++){
				
				//if (items[i].parentId != null){
				//	myContainer = parentMap[items[i].parentId];
				//} else {
				//	myContainer = container
				//}
				var body = self.panel.collapsePanelRenderer(
						{container:container,
							itemId:"_subItem-"+items[i].id,
							menuId:"menu_subItem_menu-"+items[i].id,
							parentId:"collapse_subItem-"+JSONData.params.parentId,
							title:this.getValueText({item:items[i]}),
							settings:{options:[{onclick:function(params){self.openMenuItemModal(params);},
													title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,
													id:"menu_subItem_modify-"+items[i].id,
													item:items[i]},
							                   {onclick:function(params){self.openMenuItemDelete(params);},
													title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,
													id:"menu_subItem_delete-"+items[i].id,
													item:items[i]}
												] 
							}
						}
					);
				parentMap[items[i].id] = body;
			}
		} else {
			var empty = document.createElement("DIV");
			empty.innerHTML = "No items available";
			container.appendChild(empty);
		}
	}; // formFieldListCallBack
	
	this.openMenuModal = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::openMenuModal::"+params.title);

		self.selectedParent = params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = "menu-"+params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "menu-CREATE";
		}
		// get form 
		var modalBody = document.getElementById('modalBody-menuModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_MENU_FORM;
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_MENU_FORM_CODE":
					if (params.item != null && params.item.code != null){
						value = params.item.code;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_MENU_FORM_TITLE":
					var result = self.form.inputRenderer({container:formWrapper,field:fields[i]});
					subContainers.titleContainer = self.panel.mtxtPanelRenderer({container:result});
					break;
				case "APP_MENU_FORM_APIVERSION":
					if (params.item != null && params.item.apiVersion != null) {
						value = params.item.apiVersion;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_MENU_FORM_APPVERSION":
					if (params.item != null && params.item.appVersion != null) {
						value = params.item.appVersion;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_MENU_FORM_CATEGORY":
					var value = "";
					if (params.item != null && params.item.category != null){
						value = params.item.category;
					}
					self.form.selectRenderer({container:formWrapper,field:fields[i],item:params.item,value:value});
					break;
				case "APP_MENU_FORM_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				}
			} else if (fields[i].group == "MTITLE") {
				switch (fields[i].name) {
				case "APP_MENU_FORM_TITLE_DEFAULT":
					var value = "";
					if (params.item != null && params.item.title != null && params.item.title.defaultText != null) {
						value = params.item.title.defaultText;
					}
					self.form.inputRenderer({container:subContainers.titleContainer,orientation:"horizontal",field:fields[i],value:value});
					break;
				case "APP_MENU_FORM_TITLE_TEXT":
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
		jQuery('#menuModal').modal({backdrop:"static",show:true});
	}; // openMenuModal
	
	this.openMenuDelete = function(params) {
		self.selectedParent = params.parentId;
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteMenu(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openMenuDelete
	
	this.deleteMenu = function(params) {
		var deleteParams = {service:"MENU_SVC",action:"DELETE",itemId:parseInt(self.id),itemType:"menu",callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteMenu
	
	this.openMenuItemModal = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-workflow::ToastHubWorkFlow::openMenuItemModal::"+params.title);
		
		self.selectedParent = params.parentId;
		var mode = "create";
		if (params.item != null && params.item.id != null) {
			self.selectedItem = "subItem-"+params.item.id;
			mode = "modify";
		} else {
			self.selectedItem = "subItem-CREATE";
		}
		// get formfield form 
		var modalBody = document.getElementById('modalBody-menuModal');
		modalBody.innerHTML = "";
		
		var formWrapper = document.createElement("DIV");
		formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		modalBody.appendChild(formWrapper);
	
		var subContainers = {};
		var fields = self.pageFormFields.APP_MENU_ITEM_FORM;
		var fieldMValues = [];
		for(var i = 0; i < fields.length; i++) {
			
			if (fields[i].group == "MAIN") {
				var value = "";
				switch (fields[i].name) {
				case "APP_MENU_ITEM_FORM_CODE":
					if (params.item != null && params.item.code != null){
						value = params.item.code;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:value,mode:mode});
					break;
				case "APP_MENU_ITEM_FORM_ACTIVE":
					var boolValue = false;
					if (params.item != null && params.item.active != null) {
						boolValue = params.item.active;
					}
					self.form.inputRenderer({container:formWrapper,field:fields[i],value:boolValue});
					break;
				case "APP_MENU_ITEM_FORM_VALUES":
					if (params.item != null && params.item.values != null) {
						
					}
					subContainers.valuesContainer = self.panel.mtxtPanelRenderer({container:formWrapper});
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
						this.mValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:values[i].lang,fieldMValues:fieldMValues,item:values[i]});
					}
				}
				if (valueAvail == false) {
					var langText = toastHub.getLanguageText({lang:languages[l].code});
					this.mValueRenderer({container:subContainers.valuesContainer,orientation:"horizontal",lang:languages[l].code,fieldMValues:fieldMValues});
				}
			}
		}
		
		// open modal
		jQuery('#menuModal').modal({backdrop:"static",show:true});
	}; // openMenuItemModal
	
	this.mValueRenderer = function(params) {
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
			case "APP_MENU_ITEM_FORM_VALUE":
				if (params.item != null && params.item.value != null) {
					value = params.item.value;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_MENU_ITEM_FORM_HREF":
				if (params.item != null && params.item.href != null) {
					value = params.item.href;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_MENU_ITEM_FORM_IMAGE":
				if (params.item != null && params.item.image != null) {
					value = params.item.image;
				}
				self.form.inputRenderer({container:params.container,orientation:params.orientation,lang:params.lang,field:fieldMValues[j],value:value});
				break;
			case "APP_MENU_ITEM_FORM_RENDERED":
				var boolValue = false;
				if (params.item != null && params.item.rendered != null) {
					boolValue = params.item.rendered;
				}
				self.form.inputRenderer({container:params.container,lang:params.lang,field:fieldMValues[j],value:boolValue});
				break;
			}
		}
	}; // mValueRenderer
	
	this.openMenuItemDelete = function(params) {
		self.selectedParent = params.parentId;
		var d = {id:"acknowledgeModal",headerTitle:"Delete",item:params.item,message:"Are you sure you want to delete?",
				acceptClick:function(params){self.deleteMenuItem(params);},declineClick:function(){jQuery('#acknowledgeModal').modal('toggle');}};
		self.openAcknowledge(d);
	}; // openMenuItemDelete
	
	this.deleteMenuItem = function(params) {
		var deleteParams = {service:"MENU_SVC",action:"DELETE",itemId:parseInt(self.id),itemType:"subItem",callBack:function(JSONData){self.deleteCallBack(JSONData);}};
		self.callService(deleteParams);
	}; // deleteMenu
	
	this.menuValues = function(params) {
		/*var value = params.item.
		for (var i = 0; i < values.length; i++) {
			var body = self.panel.collapsePanelRenderer({container:container,itemId:"_subItem-"+items[i].id,parentId:JSONData.params.parentId,title:toastHub.utils.getLangText({title:items[i].title}),settings:{options:[{onclick:function(params){self.openMenuItemModal(params);},title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_FORM_HEADER_MODIFY.value,item:items[i]},{title:self.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_MENU_OPTION_DELETE.value,item:items[i]}] }});
			
		}*/
	}; // menuValues
	
	this.getValueText = function(params) {
		var value = "";
		var values = params.item.values;
		for (var i = 0; i < values.length; i++) {
			if (values[i].lang == toastHub.lang){
				value = values[i].value;
			}
		}
		return value;
	};
	
	this.saveItem = function(params) {
		if (self.selectedItem.indexOf("menu") >= 0) {
			var valid = toastHub.utils.validateFields(self.pageFormFields.APP_MENU_FORM,toastHub.lang,toastHub.languages,"MAIN");
			if (valid == true) {
				var result = toastHub.utils.marshallFields(self.pageFormFields.APP_MENU_FORM,toastHub.lang,toastHub.languages);
				var item = self.selectedItem.split("-");
				var id = '';
				if (item[1] != "CREATE"){
					id = parseInt(item[1]);
				}
				var saveParams = {service:"MENU_SVC",action:"SAVE",itemType:"menu",itemId:id,callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_MENU_FORM"],inputFields:result};
				self.callService(saveParams);
			}
		} else if (self.selectedItem.indexOf("subItem") >= 0) {
			var valid = toastHub.utils.validateFields(self.pageFormFields.APP_MENU_ITEM_FORM,toastHub.lang,toastHub.languages,"MAIN");
			if (valid == true) {
				var result = toastHub.utils.marshallFields(self.pageFormFields.APP_MENU_ITEM_FORM,toastHub.lang,toastHub.languages);
				var item = self.selectedItem.split("-");
				var id = '';
				if (item[1] != "CREATE"){
					id = parseInt(item[1]);
				}
				var parent = self.selectedParent.split("-");
				var itemType = "subItem";
				if (self.selectedParent.indexOf("subItem") >= 0){
					// this is a sub sub item
					itemType = "subSub";
				}
				var saveParams = {service:"MENU_SVC",action:"SAVE",itemType:itemType,itemId:id,parentId:parseInt(parent[1]),callBack:function(JSONData){self.saveCallBack(JSONData);},appForms:["APP_MENU_ITEM_FORM"],inputFields:result};
				self.callService(saveParams);
			}
		}
	}; // save
	
	
	this.saveCallBack = function(JSONData){
		if (JSONData.params.statusMessage != null && JSONData.params.statusMessage.length <= 1
				&& JSONData.params.statusMessage[0].status == "INFO" && JSONData.params.statusMessage[0].code == "SUCCESS"){
			jQuery('#menuModal').modal('toggle');
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
	}; // searchClick
	
	this.updateItems = function() {
		if (self.selectedParent != null) {
			var item = self.selectedParent.split("-");
			if (self.selectedParent.indexOf("menu") >= 0) {
				if (item[1] == "ROOT"){
					this.getList({category:self.category});
				} else {
					var params = {service:"MENU_SVC",action:"LIST_MENUITEMS",menuId:parseInt(item[1]),callBack:function(JSONData){self.menuListCallBack(JSONData);}};
					self.callService(params);
				}
			} else {
				var params = {service:"MENU_SVC",action:"LIST_MENUITEMS",parentId:parseInt(item[1]),callBack:function(JSONData){self.menuItemsListCallBack(JSONData);}};
				self.callService(params);
			}
			
		} else {
			this.getList({category:self.category});
		}
	}; // updateItems
	
	
	
	
} // ToastHubMenu
