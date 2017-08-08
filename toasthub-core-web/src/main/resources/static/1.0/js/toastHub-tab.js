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

function ToastHubTab() {
	var self = this;

	this.render = function(params) {
		var container = this.createContainer(params);
		var items = params.items;
		var returnTab = null;
		for(var i = 0; i < items.length; i++) {
			var tabContent = this.addTab({container:container,tabId:params.tabId,item:items[i]});
			if (items[i].optionalParams != null) {
				var optional = JSON.parse(items[i].optionalParams);
				if (optional.selected != null && optional.selected == true) {
					returnTab = tabContent;
					tabContent.innerHTML = "<p> Loading... <p>";
				}
			}
		}
		return returnTab;
	}; // render
	
	this.createContainer = function(params) {
		
		var tabPanel = document.createElement("DIV");
		tabPanel.className = "";
		tabPanel.setAttribute("role","tabpanel");
		tabPanel.setAttribute("data-example-id","togglable-tabs");
		params.container.appendChild(tabPanel);
		
		// tab list
		var tabListWrapper = document.createElement("UL");
		tabListWrapper.id = "tabListWrapper-"+params.tabId;
		tabListWrapper.className = "nav nav-tabs bar_tabs";
		tabListWrapper.setAttribute("role","tablist");
		tabPanel.appendChild(tabListWrapper);
		
		// tab content
		var tabContentWrapper = document.createElement("DIV");
		tabContentWrapper.id = "tabContentWrapper-"+params.tabId;
		tabContentWrapper.className = "tab-content";
		tabPanel.appendChild(tabContentWrapper);
		
		return {tabPanel:tabPanel,tabListWrapper:tabListWrapper,tabContentWrapper:tabContentWrapper};
	}; // createContainer

	
	this.addTab = function(params) {
		// tab
		var optional = null;
		if (params.item.optionalParams != null) {
			optional = JSON.parse(params.item.optionalParams);
		} else {
			return null;
		}
		var tabLi = document.createElement("LI");
		if (optional.selected != null && optional.selected == true) {
			tabLi.className = "active";
		} else {
			tabLi.className = "";
		}
		tabLi.setAttribute("role","presentation");
		params.container.tabListWrapper.appendChild(tabLi);
		
		var tabLink = document.createElement("A");
		tabLink.setAttribute("role","tab");
		tabLink.id = "tab_"+optional.tabCode+"-"+params.tabId;
		tabLink.setAttribute("data-toggle","tab");
		tabLink.href = "#tabContent_"+optional.tabCode+"-"+params.tabId;
		tabLink.setAttribute("aria-expanded","true");
		tabLink.innerHTML = params.item.value;
		tabLi.appendChild(tabLink);
		
		// content
		// <div role="tabpanel" class="tab-pane fade active in" id="tab_content1" aria-labelledby="home-tab">
		var tabContent = document.createElement("DIV");
		tabContent.id = "tabContent_"+optional.tabCode+"-"+params.tabId;
		if (optional.selected != null && optional.selected == true) {
			tabContent.className = "tab-pane fade active in";
		} else {
			tabContent.className = "tab-pane fade";
		}
		tabContent.setAttribute("role","tabpanel");
		tabContent.setAttribute("aria-labelledby","tab_"+optional.tabCode+"-"+params.tabId);
		params.container.tabContentWrapper.appendChild(tabContent);
		
		return tabContent;
	};
	
}; // ToastHubTab
