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

function ToastHubAccordion() {
	var self = this;

	this.render = function(params) {
		var container = this.createContainer(params);
		var items = params.items;
		for(var i = 0; i < items.length; i++) {
			this.addPanel({container:container,panelId:i,item:items[i]})
		}
		
	}; // render
	
	this.createContainer = function(params) {
		var accordion = document.createElement("DIV");
		accordion.id = "accordion";
		accordion.className = "accordion";
		accordion.setAttribute("role","tablist");
		accordion.setAttribute("aria-multiselectable","true");
		params.container.appendChild(accordion);
		
		return accordion
	}; // createContainer

	this.addPanel = function(params) {
		var panel = document.createElement("DIV");
		panel.className = "panel";
		params.container.appendChild(panel);
		
		var panelHeading = document.createElement("A");
		if (params.panelId < 1) {
			panelHeading.className = "panel-heading";
		} else {
			panelHeading.className = "panel-heading collapsed";
		}
		panelHeading.setAttribute("role","tab");
		panelHeading.id = "heading-"+params.panelId;
		panelHeading.setAttribute("data-toggle","collapse");
		panelHeading.setAttribute("data-parent","#accordian");
		panelHeading.href = "#collapse-"+params.panelId;
		panelHeading.setAttribute("aria-expanded","true");
		panelHeading.setAttribute("aria-controls","collapse-"+params.panelId);
		panel.appendChild(panelHeading);
		
		var panelTitle = document.createElement("H4");
		panelTitle.className = "panel-title";
		panelTitle.innerHTML = params.title;
		panelHeading.appendChild(panelTitle);
		
		var tabPanel = document.createElement("DIV");
		tabPanel.id = "collapse-"+params.panelId;
		if (params.panelId < 1) {
			tabPanel.className = "panel-collapse collapse in";
		} else {
			tabPanel.className = "panel-collapse collapse";
		}
		tabPanel.setAttribute("role","tabpanel");
		tabPanel.setAttribute("aria-labelledby","heading-"+params.panelId);
		panel.appendChild(tabPanel);
		
		var panelBody = document.createElement("DIV");
		panelBody.className = "panel-body";
		tabPanel.appendChild(panelBody);
		
		return panelBody;
		
	};
	
}; // ToastHubAccordian
