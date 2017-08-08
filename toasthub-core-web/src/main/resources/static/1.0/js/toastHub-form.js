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

var ToastHubForm = function() {
	
	this.render = function(params) {
		
		var formWrapper = document.createElement("DIV");
		//formWrapper.id = params.formId;
		formWrapper.className = "form-horizontal form-label-left";
		params.container.appendChild(formWrapper);
	
		var fields = params.fields;
		for(var i = 0; i < fields.length; i++) {
			input = this.inputRenderer({container:formWrapper,field:fields[i]});
			
		}
	}; // render
	
	this.inputRenderer = function(params) {
		var col = null;
		if (params.orientation == "horizontal" ) {
			if (params.field.fieldType != "LTXT") {
				var label = document.createElement("LABEL");
				label.setAttribute("for",params.field.name);
				if (params.field.required != null && params.field.required == true) {
					label.innerHTML = params.field.label +"<span class='required'>*</span>";
				} else {
					label.innerHTML = params.field.label;
				}
				params.container.appendChild(label);
			}
			col = params.container;
		} else {
			var formGroup = document.createElement("DIV");
			formGroup.className = "form-group";
			params.container.appendChild(formGroup);
			
			var label = document.createElement("LABEL");
			label.className = "control-label col-md-3 col-sm-3 col-xs-12";
			label.setAttribute("for",params.field.name);
			if (params.field.required != null && params.field.required == true) {
				label.innerHTML = params.field.label +"<span class='required'>*</span>";
			} else {
				label.innerHTML = params.field.label;
			}
			formGroup.appendChild(label);
		
			col = document.createElement("DIV");
			col.className = "col-md-6 col-sm-6 col-xs-12";
			formGroup.appendChild(col);
		}
		var input = null;
		switch (params.field.fieldType) {
		case "TXT":
			input = document.createElement("INPUT");
			input.type = "text";
			input.id = params.field.name;
			input.name = params.field.name;
			col.appendChild(input);
			if (params.field.fieldType == "date") {
				input.className = "date-picker form-control col-md-7 col-xs-12";
			} else {
				if (params.orientation == "horizontal") {
					input.className = "form-control";
				} else {
					input.className = "form-control col-md-7 col-xs-12";
				}
			}
			if (params.field.required != null && params.field.required == true) {
				input.setAttribute("required","required");
			}
			if (params.field.optionalParams != null && params.field.optionalParams != ""){
				var optional = JSON.parse(params.field.optionalParams);
				if (params.mode == "modify" && optional.modify != null) {
					input.disabled = optional.modify;
				}
			}
			input.value = params.value;
			break;
		case "BLN":
			if (params.field.htmlType == "radioH"){
				this.radioHorizontalRenderer({container:col,field:params.field,value:params.value});
			}
			break;
		case "MBLN":
			if (params.field.htmlType == "radioH"){
				this.radioHorizontalRenderer({container:col,field:params.field,value:params.value,lang:params.lang});
			}
			break;
		case "MTXT":
			input = document.createElement("INPUT");
			input.type = "text";
			if (params.lang != null) {
				input.id = params.field.name+"-"+params.lang;
				input.name = params.field.name+"-"+params.lang;
			} else {
				input.id = params.field.name;
				input.name = params.field.name;
			}
			col.appendChild(input);
			if (params.field.fieldType == "date") {
				input.className = "date-picker form-control col-md-7 col-xs-12";
			} else {
				if (params.orientation == "horizontal") {
					input.className = "form-control";
				} else {
					input.className = "form-control col-md-7 col-xs-12";
				}
			}
			if (params.field.required != null && params.field.required == true) {
				input.setAttribute("required","required");
			}
			if (params.field.optionalParams != null){
				var optional = JSON.parse(params.field.optionalParams);
				if (params.mode == "modify" && optional.modify != null) {
					input.disabled = optional.modify;
				}
			}
			input.value = params.value;
		case "GRP":
			return col;
			break;
		case "LTXT":
			var languages = params.languages;
			for(var j=0;j<languages.length;j++){
				if (languages[j].title.langTexts != null){
					for(var k=0;k<languages[j].title.langTexts.length;k++){
						if (languages[j].title.langTexts[k].lang == toastHub.lang){
							var label = document.createElement("LABEL");
							label.setAttribute("for",params.field.name);
							if (languages[j].defaultLang == true && params.field.required == true) {
								label.innerHTML = params.field.label +"<span class='required'>*</span> - " + languages[j].title.langTexts[k].text;
							} else {
								label.innerHTML = params.field.label + " - " + languages[j].title.langTexts[k].text;
							}
							col.appendChild(label);
							
							var input = document.createElement("INPUT");
							input.type = "text";
							input.id = params.field.name+"-"+languages[j].code;
							input.name = params.field.name+"-"+languages[j].code;
							input.className = "form-control";
							if (params.item != null && params.item != "") {
								for(var z=0;z<params.item.title.langTexts.length;z++){
									if (params.item.title.langTexts[z].lang == languages[j].code){
										input.value = params.item.title.langTexts[z].text;
									}
								}
							}
							col.appendChild(input);
							
							//if (params.field.required != null && params.field.required == true) {
							//	input.setAttribute("required","required");
							//}
						} 
					}
				} else {
					var label = document.createElement("LABEL");
					label.setAttribute("for",params.field.name);
					label.innerHTML = params.field.label + " - " + languages[j].title.defaultText;
					col.appendChild(label);
					var input = document.createElement("INPUT");
					input.type = "text";
					input.id = params.field.name;
					input.name = params.field.name;
					input.className = "form-control";
					input.value = params.item.title.defaultText;
					col.appendChild(input);
				}
			}
			return col;
			break;
		case "MDLSNG":
			var inputGroup = document.createElement("DIV");
			inputGroup.className = "input-group";
			col.appendChild(inputGroup);
			input = document.createElement("INPUT");
			input.type = "text";
			input.id = params.field.name;
			input.name = params.field.name;
			input.className = "form-control";
			input.disabled = true;
			input.value = params.value;
			inputGroup.appendChild(input);
			
			var span = document.createElement("SPAN");
			span.className = "input-group-btn";
			inputGroup.appendChild(span);
			var optional = null;
			if (params.field.optionalParams != null){
				optional = JSON.parse(params.field.optionalParams);
			}
			if (!(params.mode == "modify" && optional != null && optional.modify != null && optional.modify == "disabled")) {
				var button = document.createElement("BUTTON");
				button.id = params.field.name+"-button";
				button.type = "button";
				button.className = "btn btn-primary";
				button.innerHTML = params.actionButton;
				button.onclick = (function(params) { return function(){params.onclick(params);}})(params);
				span.appendChild(button);
			}
			
		
			break;
		case "MDLMLT":
			
			break;
		default:
			input = document.createElement("INPUT");
			input.type = "text";
			input.id = params.field.name;
			input.name = params.field.name;
			col.appendChild(input);
			if (params.field.fieldType == "date") {
				input.className = "date-picker form-control col-md-7 col-xs-12";
			} else {
				if (params.orientation == "horizontal") {
					input.className = "form-control";
				} else {
					input.className = "form-control col-md-7 col-xs-12";
				}
			}
			if (params.field.required != null && params.field.required == true) {
				input.setAttribute("required","required");
			}
			break;
		}
		
		return {fieldName:params.field.name ,inputObj:input};
	}; // inputRenderer
	
	this.radioHorizontalRenderer = function(params) {
	
		/*var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		label.innerHTML = params.element.value;
		formGroup.appendChild(label);
		
		var col = document.createElement("DIV");
		col.className = "col-md-6 col-sm-6 col-xs-12";
		formGroup.appendChild(col);
		*/
		
		var btnGroup = document.createElement("DIV");
		if (params.lang != null) {
			btnGroup.id = "radio-"+params.field.name+"-"+params.lang;
		} else {
			btnGroup.id = "radio-"+params.field.name;
		}
		btnGroup.className = "btn-group";
		btnGroup.setAttribute("data-toggle","buttons");
		params.container.appendChild(btnGroup);
		
		
		var settings = JSON.parse(params.field.value);
		var options = settings.options;
		for (var i = 0; i < options.length; i++) {
			var btnLabel = document.createElement("LABEL");
			if (options[i].default == true) {
				if (params.value != null && params.value){
					btnLabel.className = "btn btn-default active";
				} else {
					btnLabel.className = "btn btn-default";
				}
			} else {
				if (params.value != null && !params.value){
					btnLabel.className = "btn btn-default active";
				} else {
					btnLabel.className = "btn btn-default";
				}
			}
			//btnLabel.setAttribute("data-toggle-class","btn-primary");
			//btnLabel.setAttribute("data-toggle-passive-class","btn-default");
			btnGroup.appendChild(btnLabel);
			
			var btnInput = document.createElement("INPUT");
			btnInput.type = "radio"
			if (params.lang != null) {
				btnGroup.name = "radio-"+params.field.name+"-"+params.lang;
				btnInput.id = params.field.name+"-"+i+"-"+params.lang;
			} else {
				btnInput.name = "radio-"+params.field.name;
				btnInput.id = params.field.name+"-"+i;
			}
			btnInput.value = options[i].value;
			btnLabel.innerHTML = options[i].label;
			btnLabel.appendChild(btnInput);
		}
		
		/*
		var test = document.createElement("DIV");
		test.innerHTML = "<div class='btn-group' data-toggle='buttons'><label class='btn btn-default'>" +
          "<input type='radio' name='options' id='option1'> Option 1</label><label class='btn btn-default'>"+
		"<input type='radio' name='options' id='option2'> Option 2 </label><label class='btn btn-default'>" +
		"<input type='radio' name='options' id='option3'> Option 3 </label></div>";
		params.container.appendChild(test);*/
	}; // radioHorizontalRenderer

	this.selectRenderer = function(params) {
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		
		var label = document.createElement("LABEL");
		label.className = "control-label col-md-3 col-sm-3 col-xs-12";
		if (params.field.required != null && params.field.required == true) {
			label.innerHTML = params.field.label +"<span class='required'>*</span>";
		} else {
			label.innerHTML = params.field.label;
		}
		formGroup.appendChild(label);
	
		col = document.createElement("DIV");
		col.className = "col-md-6 col-sm-6 col-xs-12";
		formGroup.appendChild(col);
		
		var select = document.createElement("SELECT");
		select.id = params.field.name;
		select.className = "select2_group form-control";
		select.style="width: 100%";
		col.appendChild(select);
		
		var optGroup = null;
		var settings = JSON.parse(params.field.value);
		if (settings != null ) {
			var options = [];
			if (settings.options != null) {
				options = settings.options;
			} else if (settings.localList != null) {
				options = toastHub.getLanguageSelect();
			}
			for(var i = 0; i < options.length; i++) {
				if (options.grp != null) {
					var option = document.createElement("OPTGROUP");
					option.label = options[i].label;
					select.appendChild(option);
				} else {
					var option = document.createElement("OPTION");
					option.value = options[i].value;
					option.innerHTML = options[i].label;
					if (optGroup != null){
						optGroup.appendChild(option);
					} else {
						select.appendChild(option);
					}
					if (options[i].value == params.value){
						option.selected = true;
					}
				}
			}
		}
		jQuery(".select2_group").select2({minimumResultsForSearch: Infinity});
	}; // selectRenderer
	
	this.solid = function(params) {
		var solid = document.createElement("DIV");
		solid.className = "ln_solid";
		params.container.appendChild(solid);
	}; // solid
	
	this.buttonRenderer = function(params) {
		
		var formGroup = document.createElement("DIV");
		formGroup.className = "form-group";
		params.container.appendChild(formGroup);
		
		var col = document.createElement("DIV");
		col.className = "col-md-6 col-sm-6 col-xs-12 col-md-offset-3";
		formGroup.appendChild(col);
		
		var items = params.buttons;
		for (var i = 0; i < items.length; i++) {
			var btn = document.createElement("BUTTON");
			btn.type = "submit";
			btn.className = "btn btn-primary";
			btn.innerHTML = items[i].value;
			col.appendChild(btn);
		}
	
	}; // buttonRenderer
	
	
	
	
}; // ToastHubForm