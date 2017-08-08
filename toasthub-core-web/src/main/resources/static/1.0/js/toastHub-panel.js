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

var ToastHubPanel = function() {
	
	this.x_message = null;
	this.x_content = null;
	this.x_title = null;
	
	this.drawLargePanel = function(params) {
		
		var row = document.createElement("DIV");
		row.className = "row";
		params.container.appendChild(row);
		var column = document.createElement("DIV");
		column.className = "col_md_12";
		row.appendChild(column);
		
		params.container = column;
		return this.drawPanel(params);
	};
	
	this.drawPanel = function(params) {
		
		var x_panel = document.createElement("DIV");
		x_panel.className = "x_panel";
		params.container.appendChild(x_panel);
		
		if (params.header != false) {
			this.x_title = document.createElement("DIV");
			this.x_title.className = "x_title";
			x_panel.appendChild(this.x_title);
			
			if (params.title != null) {
				var title = document.createElement("H2");
				title.innerHTML = params.title;
				this.x_title.appendChild(title);
			}
			
			var nav_wrapper = document.createElement("UL");
			nav_wrapper.className = "nav navbar-right panel_toolbox";
			this.x_title.appendChild(nav_wrapper);
			
			// minimize
			if (params.minimize != null){
				var showHide = document.createElement("li");
				showHide.innerHTML = "<a class='collapse-link' id='panel-collapse'><i class='fa fa-chevron-up'></i></a>";
				nav_wrapper.appendChild(showHide);
			}
			
			// settings menu
			if (params.settings != null) {
				var setting_wrapper = document.createElement("li");
				setting_wrapper.className = "dropdown";
				nav_wrapper.appendChild(setting_wrapper);
				
				var setting_link = document.createElement("A");
				setting_link.href = "#";
				if (params.menuId != null) {
					setting_link.id = params.menuId;
				} else {
					setting_link.id = "settings-menu";
				}
				setting_link.className = "dropdown-toggle";
				setting_link.setAttribute("data-toggle","dropdown");
				setting_link.setAttribute("role","button");
				setting_link.setAttribute("aria-expanded","false");
				setting_link.innerHTML = "<i class='fa fa-bars'></i>";
				setting_wrapper.appendChild(setting_link);
				
				var setting_options = document.createElement("UL");
				setting_options.className = "dropdown-menu";
				setting_options.setAttribute("role","menu");
				setting_wrapper.appendChild(setting_options);
				
				
				var options = params.settings.options;
				for (var i = 0; i < options.length; i++) {
					var item = document.createElement("li");
					var link = document.createElement("A");
					link.href = options[i].url;
					if (options[i].id != null) {
						link.id = options[i].id;
					}
					link.innerHTML = options[i].title;
					if (options[i].onclick != null) {
						link.onclick = options[i].onclick;
					}
					item.appendChild(link);
					setting_options.appendChild(item);
				}
			}
			// close
			if (params.menuClose != null) {
				var close = document.createElement("li");
				close.innerHTML = "<a class='close-link' id='menu-close'><i class='fa fa-close'></i></a>";
				nav_wrapper.appendChild(close);
			}
			
			toastHub.utils.clearFix(this.x_title);
		}
		this.x_message = document.createElement("DIV");
		x_panel.appendChild(this.x_message);
		this.x_content = document.createElement("DIV");
		if (params.contentId != null){
			this.x_content.id = params.contentId;
		}
		this.x_content.className = "x_content";
		x_panel.appendChild(this.x_content);
		
		return this.x_content;
	}; // drawProjectPanel	
	
	this.headerWithSearchRenderer = function(params) {
		if (params.pageTexts != null){
			params.searchRender = params.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_SEARCH_INPUT.rendered;
			params.placeHolder = params.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_SEARCH_INPUT.value;
			params.searchButton = params.pageTexts.GLOBAL_PAGE.GLOBAL_PAGE_SEARCH_BUTTON.value;
		}
		var wrapper = document.createElement("DIV");
		wrapper.className = "page-title";
		params.container.appendChild(wrapper);
		
		if (params.titleRender == null || (params.titleRender != null && params.titleRender == true)){
			var title = document.createElement("DIV");
			title.className = "title_left";
			title.innerHTML = "<h3>"+params.title+"</h3>";
			wrapper.appendChild(title);
		}
		var searchWrapper = document.createElement("DIV");
		searchWrapper.className = "title_right";
		wrapper.appendChild(searchWrapper);
		
		var col = document.createElement("DIV");
		col.className = "col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search";
		searchWrapper.appendChild(col);
		
		if (params.searchRender == null || (params.searchRender != null && params.searchRender == true)) {
			var inputWrapper = document.createElement("DIV");
			inputWrapper.className = "input-group";
			col.appendChild(inputWrapper);
		
			var input = document.createElement("INPUT");
			input.id = params.id;
			input.type = "text";
			input.className = "form-control";
			input.onkeypress = params.searchClick;
			if (params.placeHolder != null){
				input.setAttribute("placeholder",params.placeHolder);
			} else {
				input.setAttribute("placeholder","Search for...");
			}
			inputWrapper.appendChild(input);
		
			var buttonWrapper = document.createElement("SPAN");
			buttonWrapper.className = "input-group-btn";
			inputWrapper.appendChild(buttonWrapper);
		
			var button = document.createElement("BUTTON");
			button.className = "btn btn-default";
			button.type = "button";
			button.id = params.id+"-button";
			if (params.searchButton != null) {
				button.innerHTML = params.searchButton;
			} else {
				button.innerHTML = "Go!";
			}
			if (params.searchClick != null) {
				button.onclick = params.searchClick;
			}
			buttonWrapper.appendChild(button);
		}
		toastHub.utils.clearFix(wrapper);
	}; //headerWithSearchRenderer
	
	this.collapsePanelRenderer = function(params) {
		//var x_panel = document.createElement("DIV");
		//x_panel.className = "x_panel";
		//params.container.appendChild(x_panel);
		
		var x_title = document.createElement("DIV");
		x_title.className = "list_title";
		params.container.appendChild(x_title);
		
		var titleWrapper = document.createElement("H2");
		x_title.appendChild(titleWrapper);
	/*	
		var heading = document.createElement("DIV");
		heading.className = "panel-heading";
		x_panel.appendChild(heading);
		
		var titleWrapper = document.createElement("H4");
		titleWrapper.className = "panel-title";
		heading.appendChild(titleWrapper);
		*/
		var title = document.createElement("A");
		title.setAttribute("data-toggle","collapse");
		title.href = "#collapse"+params.itemId;
		title.innerHTML = params.title +" <i class='fa fa-angle-down'></i>" ;
		titleWrapper.appendChild(title);
		
		var nav_wrapper = document.createElement("UL");
		nav_wrapper.className = "nav navbar-right panel_toolbox";
		x_title.appendChild(nav_wrapper);
		
		// settings menu
		if (params.settings != null) {
			var setting_wrapper = document.createElement("li");
			setting_wrapper.className = "dropdown";
			nav_wrapper.appendChild(setting_wrapper);
			
			var setting_link = document.createElement("A");
			setting_link.href = "#";
			if (params.menuId != null) {
				setting_link.id = params.menuId;
			} else {
				setting_link.id = "settings-menu";
			}
			setting_link.className = "dropdown-toggle";
			setting_link.setAttribute("data-toggle","dropdown");
			setting_link.setAttribute("role","button");
			setting_link.setAttribute("aria-expanded","false");
			setting_link.innerHTML = "<i class='fa fa-bars'></i>";
			setting_wrapper.appendChild(setting_link);
			
			var setting_options = document.createElement("UL");
			setting_options.className = "dropdown-menu";
			setting_options.setAttribute("role","menu");
			setting_wrapper.appendChild(setting_options);
			
			var options = params.settings.options;
			for (var i = 0; i < options.length; i++) {
				var item = document.createElement("li");
				var link = document.createElement("A");
				link.innerHTML = options[i].title;
				if (options[i].id != null) {
					link.id = options[i].id;
				}
				if (options[i].onclick != null) {
					var p = {title:options[i].title,item:options[i].item,parentId:params.parentId,onclick:options[i].onclick};
					link.onclick = (function(p) { return function(){p.onclick(p);}})(p);
				}
				item.appendChild(link);
				setting_options.appendChild(item);
			}
		}
		
		
		var contentWrapper = document.createElement("DIV");
		contentWrapper.id = "collapse"+params.itemId;
		contentWrapper.className = "panel-collapse collapse sub_list";
		params.container.appendChild(contentWrapper);
		
		toastHub.utils.clearFix(x_title);
		
		var body = document.createElement("DIV");
		body.className = "panel-body";
		contentWrapper.appendChild(body);
		if (params.body != null) {
			body.appendChild(params.body);
		}
		
		if (params.footer != null) {
			var footer = document.createElement("DIV");
			footer.className = "panel-footer";
			contentWrapper.appendChild(footer);
			footer.appendChild(params.footer);
		}
		
		return body;
	}; //collapsePanelRenderer
	
	this.menuPanelRenderer = function(params) {
		
		var x_title = document.createElement("DIV");
		//x_title.className = "list_title";
		params.container.appendChild(x_title);
		
		var nav_wrapper = document.createElement("UL");
		nav_wrapper.className = "nav navbar-right panel_toolbox";
		x_title.appendChild(nav_wrapper);
		
		// settings menu
		if (params.settings != null) {
			var setting_wrapper = document.createElement("li");
			setting_wrapper.className = "dropdown";
			nav_wrapper.appendChild(setting_wrapper);
			
			var setting_link = document.createElement("A");
			setting_link.href = "#";
			if (params.menuId != null) {
				setting_link.id = params.menuId;
			} else {
				setting_link.id = "settings-menu";
			}
			setting_link.className = "dropdown-toggle";
			setting_link.setAttribute("data-toggle","dropdown");
			setting_link.setAttribute("role","button");
			setting_link.setAttribute("aria-expanded","false");
			setting_link.innerHTML = "<i class='fa fa-bars'></i>";
			setting_wrapper.appendChild(setting_link);
			
			var setting_options = document.createElement("UL");
			setting_options.className = "dropdown-menu";
			setting_options.setAttribute("role","menu");
			setting_wrapper.appendChild(setting_options);
			
			var options = params.settings.options;
			for (var i = 0; i < options.length; i++) {
				var item = document.createElement("li");
				var link = document.createElement("A");
				link.innerHTML = options[i].title;
				if (options[i].id != null) {
					link.id = options[i].id;
				}
				if (options[i].onclick != null) {
					var p = {title:options[i].title,item:options[i].item,parentId:params.parentId,onclick:options[i].onclick};
					link.onclick = (function(p) { return function(){p.onclick(p);}})(p);
				}
				item.appendChild(link);
				setting_options.appendChild(item);
			}
		}
		
		toastHub.utils.clearFix(x_title);

	}; //menuPanelRenderer
	
	
	this.mtxtPanelRenderer = function(params) {
		var x_panel = document.createElement("DIV");
		x_panel.className = "x_panel";
		params.container.appendChild(x_panel);
		
		var x_content = document.createElement("DIV");
		if (params.contentId != null){
			x_content.id = params.contentId;
		}
		x_content.className = "x_content";
		x_panel.appendChild(x_content);
		
		return x_content;
	}; // mtxtPanelRenderer
	
	this.plainPanelListRenderer = function(params) {
		var x_panel = document.createElement("DIV");
		x_panel.className = "x_panel";
		params.container.appendChild(x_panel);
		
		return x_panel;
	}
	
}; // Panel	