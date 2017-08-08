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

var ToastHubTopMenu = function() {
		
	this.render = function(params) {
		var navMenu = document.createElement("DIV");
		navMenu.className = "nav_menu";
		params.container.appendChild(navMenu);
		
		var nav = document.createElement("DIV");
		navMenu.appendChild(nav);
		if (params.navToggle){
			var navToggle = document.createElement("DIV");
			navToggle.className = "nav toggle";
			nav.appendChild(navToggle);
			
			var href = document.createElement("A");
			href.id = "menu_toggle";
			href.innerHTML = "<i class='fa fa-bars'></i>";
			if (params.menuToggle != null) {
				href.onclick = params.menuToggle;
			}
			navToggle.appendChild(href);
		}
		params.container = nav;
		this.navRight(params);
	}; // render
	
	this.navRight = function(params) {
		
		var ul = document.createElement("UL");
		ul.className = "nav navbar-nav navbar-right";
		params.container.appendChild(ul);
		
		var items = params.menu;
		for (var i in items){
			if (items.hasOwnProperty(i)){
				var li = document.createElement("LI");
				li.className = "dropdown";
				ul.appendChild(li);
				
				var href = document.createElement("A");
				
				if (items[i].values[0].href != null && items[i].values[0].href != "") {
					href.className = "user-profile ";
					href.href = items[i].values[0].href;
				} else {
					href.className = "user-profile dropdown-toggle ";
					href.setAttribute("data-toggle","dropdown");
					href.setAttribute("aria-expanded","false");
				}
				if (items[i].values[0].image != null && items[i].values[0].image != "") {
					var image = JSON.parse(items[i].values[0].image);
					if (image.localFile != null) {
						href.innerHTML = "<img src='".concat(image.localFile).concat("' alt=''><span class=' fa fa-angle-down'></span>");
					} else if (image.iconClass != null) {
						href.innerHTML = "<i class='".concat(image.iconClass).concat("'></i><span >").concat(items[i].values[0].value).concat("</span>");
					} else {
						href.innerHTML = "<span>".concat(items[i].values[0].value).concat("</span>");
					}
				} else {
					href.innerHTML = "<span>".concat(items[i].values[0].value).concat("</span>");
				}
				li.appendChild(href);
				
				// check for children	
				if (items[i].children != null) {
					var myParams = {container:li,parentId:items[i].values[0].id,items:items[i].children};
					this.childItem(myParams);
				}
			}
		}
		
	}; // navRight
	
	this.childItem = function(params) {
		var ul = document.createElement("UL");
		ul.id = params.parentId;
		ul.className = "dropdown-menu ";
		params.container.appendChild(ul);
		
		var items = params.items;
		for (var i in items){
			if (items.hasOwnProperty(i)){
				var li = document.createElement("LI");
				ul.appendChild(li);
				var href = document.createElement("A");
				if (items[i].values[0].href != null && items[i].values[0].href != "") {
					href.href = items[i].values[0].href;
				}
				if (items[i].values[0].image != null && items[i].values[0].image != "") {
					var image = JSON.parse(items[i].values[0].image);
					if (image.localFile != null) {
						href.innerHTML = "<img src='".concat(image.localFile).concat("' alt=''><span class=' fa fa-angle-down'></span>");
					} else if (image.iconClass != null) {
						href.innerHTML = "<i class='".concat(image.iconClass).concat("'></i><span >").concat(items[i].values[0].value).concat("</span>");
					} else {
						href.innerHTML = "<span>".concat(items[i].values[0].value).concat("</span>");
					}
				} else {
					href.innerHTML = items[i].values[0].value;
				}
				li.appendChild(href);
			}
		}
	}; // childItem
	
}; // TopMenu
	
	
	