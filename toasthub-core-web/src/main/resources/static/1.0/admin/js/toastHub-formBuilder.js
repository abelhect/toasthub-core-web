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

toastHubFormBuilder.prototype = Object.create(toastHubBase.prototype);
toastHubFormBuilder.prototype.constructor = toastHubFormBuilder;

function toastHubFormBuilder(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "APPFORMFIELD_SVC";
	this.pageMetaName = "ADMIN_FORMFIELD";
	this.formContainer = null;
	this.layoutArea = null;
	this.currentLayoutChooser = null;
	this.currentElementSelected = null;
	this.currentCellSelected = null;
	this.formModel = null;
	this.rowCount = 4;
	this.columnCount = 0;
	this.properties = [{key:"Width",value:200},{key:"Height",value:30},{key:"Background Color",value:"#FFFFFF"},{key:"Text Color",value:"#111111"}];
	var self = this;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG",this.TAG+"initCustom");
		params.sysPageFormName = "ADMIN_FORMFIELD";
	}; // initCustom
	
	this.initContent = function(params){
		toastHub.logSystem.log("DEBUG",this.TAG+"initContent");
		
		var mainContainer = params.container;
		var panel = new ToastHubPanel();
		
		// header and search
		panel.headerWithSearchRenderer({container:mainContainer,title:"Forms"});
		
		// create panel to hold list
		this.contentArea = panel.drawLargePanel({container:mainContainer,header:false});
		
		// form
		this.formArea = document.createElement("DIV");
		this.formArea.id = "form-area";
		params.container.appendChild(this.formArea);
		jQuery("#form-area").dialog({ autoOpen: false, modal:true, minWidth:600, width:800 });
		
		// subMenu
		this.subMenuArea = document.createElement("DIV");
		this.subMenuArea.id = "sub-menu-area";
		params.container.appendChild(this.subMenuArea);
		jQuery("#sub-menu-area").dialog({ autoOpen: false, modal:true, minWidth:600, width:800 });
		
		
		this.processList(params);
	}; // processInit
	
	this.processList = function(params){
		toastHub.logSystem.log("DEBUG",this.TAG+"processList");
		params.controllerName = "AppRoles";
		params.container = this.contentArea;

		var tab = new ToastHubTab();
		var tabContainers = tab.createContainer(params);
		var map = {};
		var items = params.items;
		var category = null;
	/*	for (var i =0; i < items.length; i++) {
			// get domain and create accordion panel 
			if (domain != items[i].domain) {
				domain = items[i].domain;
				map[domain] = tab.addTab({container:tabContainers,tabId:i,title:"Domain: "+domain});
			}
			var role = document.createElement("DIV");
			role.innerHTML = items[i].roleName;
			map[domain].appendChild(role);
			
		
		}
*/
		
	}; // processList
	
	
	//this.processInit = function(JSONData) {
	//	toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:processInit");
	//	this.renderFormBuilder({formMeta:{layout:"oneColumn"}});
	//};
	
	this.renderForm = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderForm");
		this.initForm();
		// check if params is empty
		if (params == null){
			return null;
		}
		// get Layout
		var formLayout = params.formMeta.layout;
		if (formLayout == "twoColumn"){
			this.renderTwoColumn(params);
		} else if (formLayout == "threeColumn") {
			this.renderThreeColumn(params);
		} else {
			this.renderOneColumn(params);
		}
	};
	
	this.initForm = function(){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:initForm");
		var formArea = document.getElementById("form-area");
		if (formArea == null){
			formArea = document.createElement("DIV");
			formArea.id = "form-area";
			toastHub.containerContentObj.appendChild(formArea);
			jQuery("#form-area").dialog({ autoOpen: false, modal:true, minWidth:600, width:800 });
		}
		this.formContainer = formArea;
	};
	
	this.destroyForm = function(){
		var formArea = document.getElementById("form-area");
		formArea.parentNode.removeChild(formArea);
	};
	
	
	
	this.renderCheckBox = function(params){
		
	};
	
	this.renderRadioButtons = function(params){
		
	};
	
	this.renderButton = function(params){
		var wrapper = document.createElement("DIV");
		var input = document.createElement("INPUT");
		input.type = "button";
		input.value = params.value;
		input.onclick = params.onclick;
		wrapper.appendChild(input);
		params.container.appendChild(wrapper);
	};
	
	this.renderTextArea = function(params){
		var textAreaDiv = document.createElement("DIV");
		textAreaDiv.id = "label-"+params.formId;
		textAreaDiv.appendChild(document.createTextNode(params.label));
		params.container.appendChild(textAreaDiv);
		var textArea = document.createElement("textarea");
		textArea.id = "commentMessage"
		textArea.name = "commentMessage";
		textArea.rows = "20";
		textArea.cols = "50";
		textArea.maxlength = "2000";
		labelDiv.appendChild(textArea);
		var base = params[params.formMeta.textArea];
		if (base != null && base[params.formMeta.textShort] != null){
			textArea.value = base[params.formMeta.textShort];
			if (base[params.formMeta.textLong] != null){
				textArea.value = base[params.formMeta.textShort] + "" + base[params.formMeta.textLong];
			}
		}
		
	};
	
	this.renderTitle = function(params) {
		var titleDiv = document.createElement("DIV");
		var title = "Title";
		if (params[params.formMeta.contentObject] != null && JSONData.dicussionComment != null){
			this.comment = JSONData.discussionComment;
			title = "Modify Comment:  ";
		} else {
			title = "Create new Comment:  ";
		}
		titleDiv.innerHTML = title;
		params.container.appendChild(titleDiv);
	};
	
	this.renderHeading = function(params) {
		var label = document.createElement("INPUT");
		label.id = "label-"+params.id;
		label.name = "label-"+params.id;
		label.type = "text";
		label.className = "jd-form-label";
		label.onclick = function(event) {
			var event = event || window.event; // cross-browser event
			if (event.stopPropagation) {
				// W3C standard variant
				event.stopPropagation();
			} else {
				// IE variant
				event.cancelBubble = true;
			}
		};
		label.value = "Heading";
		params.container.appendChild(label);
	};
	
	this.preview = function(params){
		
		
	};
	
	this.renderOneColumn = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderOneColumn");
		var container = this.formContainer;
		container.innerHTML = "";
		// Loop through form 
		var dataArray = params.formMeta.dataArray;
		for ( var i = 0; i < dataArray.length; i++) {
			var type = dataArray[i].type;
			switch (type) {
		    case 'TITLE':
		    	this.renderTitle(params);
		    	break;
		    case 'BUTTON':
		    	//this.renderButton(params);
		    	this.renderButton({container:container,value:"Save",onclick:function(){self.validateComment();return false;}});
				this.renderButton({container:container,value:"Close",onclick:function(){jQuery("#form-area").dialog("close");return false;}})
		    	break;
		    case 'TEXTAREA':
		    	this.renderTextArea(params);
		    	break;
			}
		}
		jQuery("#form-area").dialog("open");
		
	};
	
	this.showParams = function(params){
		
		
	};
	
	this.renderFormBuilder = function(params) {
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderFormBuilder");
		var headerDiv = document.createElement("DIV");
		headerDiv.appendChild(document.createTextNode("Form Builder"));
		headerDiv.className = "jd-admin-header";
		toastHub.containerContentObj.appendChild(headerDiv);
		
		var navDiv = document.createElement("DIV");
		navDiv.className = "jd-admin-nav";
		toastHub.containerContentObj.appendChild(navDiv);
		// Elements
		this.renderElements({container:navDiv});
		
		// Properties
		this.renderProperties({container:navDiv});
		
		// Main
		var mainDiv = document.createElement("DIV");
		mainDiv.className = "jd-admin-main";
		mainDiv.id = "form-main-section";
		toastHub.containerContentObj.appendChild(mainDiv);
		// layout chooser
		var layoutChooserDiv = document.createElement("DIV");
		layoutChooserDiv.id = "form-layout-chooser";
		mainDiv.appendChild(layoutChooserDiv);
		// layout area
		this.layoutArea = document.createElement("DIV");
		this.layoutArea.id = "form-layout-section";
		mainDiv.appendChild(this.layoutArea);
		
		this.renderLayoutChooser({container:layoutChooserDiv});
		this.renderLayout({type:"oneColumn"});
		
	};
	
	this.renderElements = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderELements");
		// Elements
		var elementDiv = document.createElement("DIV");
		elementDiv.className = "jd-admin-nav-component";
		elementDiv.id = "form-element-section";
		params.container.appendChild(elementDiv);
		var header = document.createElement("DIV");
		header.className = "jd-admin-header";
		header.innerHTML = "Elements";
		elementDiv.appendChild(header);
		var titleDiv = document.createElement("DIV");
		titleDiv.className = "jd-admin-element";
		titleDiv.id = "jd-form-title";
		titleDiv.innerHTML = "Title";
		titleDiv.onclick = function(){ self.toggleElementSelect({id:"jd-form-title"}); };
		elementDiv.appendChild(titleDiv);
		var headingDiv = document.createElement("DIV");
		headingDiv.className = "jd-admin-element";
		headingDiv.id = "jd-form-heading";
		headingDiv.innerHTML = "Heading";
		headingDiv.onclick = function(){ self.toggleElementSelect({id:"jd-form-heading"}); };
		elementDiv.appendChild(headingDiv);
		var fieldDiv = document.createElement("DIV");
		fieldDiv.className = "jd-admin-element";
		fieldDiv.id = "jd-form-field";
		fieldDiv.innerHTML = "Field";
		fieldDiv.onclick = function(){ self.toggleElementSelect({id:"jd-form-field"}); };
		elementDiv.appendChild(fieldDiv);
		var textAreaDiv = document.createElement("DIV");
		textAreaDiv.className = "jd-admin-element";
		textAreaDiv.id = "jd-form-textarea";
		textAreaDiv.innerHTML = "TextArea";
		textAreaDiv.onclick = function(){ self.toggleElementSelect({id:"jd-form-textarea"}); };
		elementDiv.appendChild(textAreaDiv);
		var radioDiv = document.createElement("DIV");
		radioDiv.className = "jd-admin-element";
		radioDiv.id = "jd-form-radio";
		radioDiv.innerHTML = "Radio";
		radioDiv.onclick = function(){ self.toggleElementSelect({id:"jd-form-radio"}); };
		elementDiv.appendChild(radioDiv);
	};
	
	this.renderProperties = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderProperties");
		var propertiesDiv = document.createElement("DIV");
		propertiesDiv.className = "jd-admin-nav-component";
		propertiesDiv.id = "form-properties-section";
		params.container.appendChild(propertiesDiv);
		var header = document.createElement("DIV");
		header.className = "jd-admin-header";
		header.innerHTML = "Properties";
	
		var table = document.createElement("TABLE");
		table.id = "jd-form-property-table";
		propertiesDiv.innerHTML = "";
		propertiesDiv.appendChild(header);
		propertiesDiv.appendChild(table);
		var l = this.properties.length;
		for ( var i = 0; i < l; i++) {
			var row = table.insertRow(i);
			row.className = "jd-form-property-row";
			var cell1 = row.insertCell(0);
			cell1.id = "jd-property-"+i;
			cell1.innerHTML = this.properties[i].key;
			cell1.className = "jd-form-property-label";
			var cell2 = row.insertCell(1);
			cell2.id = "jd-property-"+i;
			cell2.className = "jd-form-property-value";
			cell2.innerHTML = this.properties[i].value;
			cell2.onclick = (function(r){ return function(){self.addPropertySelect({id:"jd-property-"+r});}; })(i);
		}
	};
	
	this.renderLayoutChooser = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderLayoutChooser");
		// layout chooser
		var oneColumnDiv = document.createElement("DIV");
		oneColumnDiv.id = "one-column-button";
		oneColumnDiv.className = "jd-layout-chooser-selected";
		oneColumnDiv.innerHTML = "One Column";
		oneColumnDiv.onclick = function(){ self.columnCount = 1; self.renderLayout({id:"one-column-button"}); };
		this.currentLayoutChooser = oneColumnDiv;
		params.container.appendChild(oneColumnDiv);
		var twoColumnDiv = document.createElement("DIV");
		twoColumnDiv.id = "two-column-button";
		twoColumnDiv.className = "jd-layout-chooser";
		twoColumnDiv.innerHTML = "Two Column";
		twoColumnDiv.onclick = function(){ self.columnCount = 2; self.renderLayout({id:"two-column-button"}); };
		params.container.appendChild(twoColumnDiv);
		var threeColumnDiv = document.createElement("DIV");
		threeColumnDiv.id = "three-column-button";
		threeColumnDiv.className = "jd-layout-chooser";
		threeColumnDiv.innerHTML = "Three Column";
		threeColumnDiv.onclick = function(){ self.columnCount = 3; self.renderLayout({id:"three-column-button"}); };
		params.container.appendChild(threeColumnDiv);
		
	};
	
	this.renderLayout = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderLayout");
		var selector = document.getElementById(params.id);
		if (selector != null){
			if (this.currentLayoutChooser != null){
				// same element
				if (this.currentLayoutChooser == selector){
					this.currentLayoutChooser.className = "jd-layout-chooser";
					this.currentLayoutChooser = null;
				} else {
					// differnt element
					this.currentLayoutChooser.className = "jd-layout-chooser";
					this.currentLayoutChooser = selector;
					this.currentLayoutChooser.className = "jd-layout-chooser-selected";
				}
			} else {
				this.currentLayoutChooser = selector;
				this.currentLayoutChooser.className = "jd-layout-chooser-selected";
			}
		}

		var table = document.createElement("TABLE");
		table.id = "jd-form-table-preview";
		table.className = "jd-form-table";
		this.layoutArea.innerHTML = "";
		this.layoutArea.appendChild(table);
		// create a base 5 rows if new
		for ( var i = 0; i < this.rowCount; i++) {
			var row = table.insertRow(i);
			row.className = "jd-form-row";
			var cell1 = row.insertCell(0);
			cell1.id = "jd-cell-"+i+"-0";
			cell1.innerHTML = "c1";
			cell1.className = "jd-form-cell";
			cell1.onclick = (function(r){ return function(){self.addElementSelect({id:"jd-cell-"+r+"-0",row:r,column:0});}; })(i);
			if (params.id == "two-column-button"){
				var cell2 = row.insertCell(1);
				cell2.id = "jd-cell-"+i+"-1";
				cell2.className = "jd-form-cell";
				cell2.innerHTML = "c2";
				cell2.onclick = (function(r){ return function(){self.addElementSelect({id:"jd-cell-"+r+"-1",row:r,column:1});}; })(i);
			} else if (params.id == "three-column-button"){
				var cell2 = row.insertCell(1);
				cell2.id = "jd-cell-"+i+"-1";
				cell2.className = "jd-form-cell";
				cell2.innerHTML = "c2";
				cell2.onclick = (function(r){ return function(){self.addElementSelect({id:"jd-cell-"+r+"-1",row:r,column:1});}; })(i);
				var cell3 = row.insertCell(2);
				cell3.id = "jd-cell-"+i+"-2";
				cell3.className = "jd-form-cell";
				cell3.innerHTML = "c3";
				cell3.onclick = (function(r){ return function(){self.addElementSelect({id:"jd-cell-"+r+"-2",row:r,column:2});}; })(i);
				
			}
		}
	};
	
	this.toggleElementSelect = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:toggleElementSelect");
		var element = document.getElementById(params.id);
		if (element != null){
			if (this.currentElementSelected != null) {
				// same element
				if (this.currentElementSelected == element){
					this.currentElementSelected.className = "jd-admin-element";
					this.currentElementSelected = null;
				} else {
					// differnt element
					this.currentElementSelected.className = "jd-admin-element";
					this.currentElementSelected = element;
					this.currentElementSelected.className = "jd-admin-element-selected";
				}
			} else {
				this.currentElementSelected = element;
				this.currentElementSelected.className = "jd-admin-element-selected";
			}
		}
	};
	
	this.addElementSelect = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:addElementSelect");
		var cell = document.getElementById(params.id);
		// if cell contains a child of text
		if (this.currentElementSelected != null && cell.firstChild && cell.firstChild.nodeName == "#text") {
			// remove existing highlight of cell
			if (this.currentCellSelected != null && this.currentCellSelected.id != params.id){
				if (this.currentCellSelected.firstChild && this.currentCellSelected.firstChild.nodeName == "#text"){
					this.currentCellSelected.className = "jd-form-cell";
				} else {
					this.currentCellSelected.className = "jd-form-cell-add";
				}
			}
			// add element to cell
			if (cell != null){
					cell.className = "jd-form-cell-selected";
					this.currentCellSelected = cell;
					cell.innerHTML = "";
					switch (this.currentElementSelected.id) {
					    case "jd-form-field":
					    	this.renderField({container:cell});
					        break;
					    case "jd-form-textarea":
					    	this.renderTextArea({container:cell});
					        break;
					    case "jd-form-title":
					    	this.renderTitle({container:cell});
					        break;
					    case "jd-form-heading":
					    	this.renderHeading({container:cell});
					        break;
					    case "jd-form-radio":
					    	this.renderRadio({container:cell});
					        break;
					}
			}
		} else {
			// Highlight cell
			if (this.currentCellSelected != null) {
				// same
				if (this.currentCellSelected == cell){
					if (cell.firstChild && cell.firstChild.nodeName == "#text"){
						this.currentCellSelected.className = "jd-form-cell";
					} else {
						this.currentCellSelected.className = "jd-form-cell-add";
					}
					this.currentCellSelected = null;
				} else {
					// different
					if (cell.firstChild && cell.firstChild.nodeName == "#text"){
						this.currentCellSelected.className = "jd-form-cell";
					} else {
						this.currentCellSelected.className = "jd-form-cell-add";
					}
					this.currentCellSelected = cell;
					this.currentCellSelected.className = "jd-form-cell-selected";
				}
			} else {
				this.currentCellSelected = cell;
				this.currentCellSelected.className = "jd-form-cell-selected";
			}	
		}
	};
	
	this.renderField = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-form:toastHubForm:renderField");
		var label = document.createElement("INPUT");
		label.id = "label-"+params.id;
		label.name = "label-"+params.id;
		label.type = "text";
		label.className = "jd-form-label";
		label.onclick = function(event) {
			var event = event || window.event; // cross-browser event
			if (event.stopPropagation) {
				// W3C standard variant
				event.stopPropagation();
			} else {
				// IE variant
				event.cancelBubble = true;
			}
		};
		label.value = "Field";
	
		var field = document.createElement("INPUT");
		field.type = "text";
		field.className = "searchField";
		field.id = "field-"+params.id;
		field.name = "field-"+params.id;
		//	field.onblur = function(){ if (this.value == "") { this.value = "Search...";}; };
		//	field.onfocus = function(){ if (this.value == "Search...") { this.value = "";}; };
		field.onclick = function(event) {
			var event = event || window.event; // cross-browser event
			if (event.stopPropagation) {
				// W3C standard variant
				event.stopPropagation();
			} else {
				// IE variant
				event.cancelBubble = true;
			}
		};
		field.value = "text here";
		params.container.appendChild(label);
		params.container.appendChild(field);
	};
}
