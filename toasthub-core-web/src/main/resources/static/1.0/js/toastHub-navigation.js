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

toastHubTopMenu.prototype = Object.create(toastHubBase.prototype);
// reassign constructor
toastHubTopMenu.prototype.constructor = toastHubTopMenu;

toastHub.registerController("topmenu",new toastHubTopMenu("topmenu"));

function toastHubTopMenu(instanceName){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "public";
	var self = this;
		
/////////////////////////////////// init Top Nav ////////////////////////
	this.init = function(params){
		toastHub.logSystem.log("DEBUG","toasthub-navigation::toastHubTopMenu::init");
		//var callUrl = toastHub.restUrl + this.ajaxFunc + "/callService";
		var nav = document.createElement("NAV");
		nav.id = "mainNav";
		nav.className = "navbar navbar-default navbar-custom navbar-fixed-top";
		toastHub.containerMenuObj = nav;
		toastHub.body.appendChild(nav);
		var params = toastHub.initParams();
		params.action = "INIT_MENU";
		params.service = "PUBLIC_SVC";
		params.callBack = function(JSONData){self.processTopMenu(JSONData);};
		this.callService(params);
	}; // init
	
	this.processTopMenu = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toasthub-navigation::toastHubTopMenu::processTopMenu");
		var menuRight = JSONData.menuRight;
		
		var nav = document.getElementById("mainNav")
		
		var navWrap = document.createElement("DIV");
		navWrap.className = "container";
		nav.appendChild(navWrap);
		var navHeader = document.createElement("DIV");
		navHeader.className = "navbar-header page-scroll";
		navWrap.appendChild(navHeader);
		var buttonToggle = document.createElement("BUTTON");
		buttonToggle.type = "button";
		buttonToggle.className = "navbar-toggle";
		//buttonToggle.data-toggle = "collapse";
		//buttonToggle.data-target = "#bs-example-navbar-collapse-1";
		
		buttonToggle.innerHTML = "<span class='sr-only'>Toggle navigation</span> Menu <i class='fa fa-bars'></i>"
		navHeader.appendChild(buttonToggle);
		var logo = document.createElement("A");
		logo.className = "navbar-brand page-scroll";
		logo.href = "#page-top";
		logo.innerHTML = "ToastHub";
		navHeader.appendChild(logo);
		
		
		var menu = document.createElement("DIV");
		menu.className = "collapse navbar-collapse";
		menu.id = "bs-example-navbar-collapse-1";
		navWrap.appendChild(menu);
		var menuUL = document.createElement("UL");
		menuUL.className = "nav navbar-nav navbar-right";
		menu.appendChild(menuUL);
		
		for (var i in menuRight){
			if (menuRight.hasOwnProperty(i)){
				var menuLI = document.createElement("li");
				menuUL.appendChild(menuLI);
				var menuHref = document.createElement("a");
				menuHref.className = 'page-scroll';
				menuHref.href = menuRight[i].values[0].href;
				menuHref.innerHTML = menuRight[i].values[0].value;
				menuLI.appendChild(menuHref);
				if (menuRight[i].children != null){
					var menuSub = document.createElement("ul");
					menuSub.className = "sub";
					this.addSubMenu(menuSub,menuRight[i].children);
					menuLI.appendChild(menuSub);
				}
			}
		}
		
		
		
	}

	this.processTopMenuOld = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-navigation::toastHubTopMenu::processTopMenu");
		var menuRight = JSONData.menuRight;
		var menuLeft = JSONData.menuLeft;
		var navLeftImg = document.getElementById("nav-left-img");
		var navLeftSpan = document.createElement("span");
		navLeftImg.appendChild(navLeftSpan);
		navLeftSpan.className = 'jd-btn';
		navLeftSpan.onclick = function(){jQuery("#nav-left-area").toggle("fast");return false;};
		var navLeftIcon = document.createElement("span");
		navLeftIcon.className = 'jd-icon-36 jd-icon-grid-36';
		navLeftSpan.appendChild(navLeftIcon);
		
		var navRightImg = document.getElementById("nav-right-img");
		var navRightSpan = document.createElement("span");
		navRightImg.appendChild(navRightSpan);
		navRightSpan.className = 'jd-btn';
		navRightSpan.onclick = function(){jQuery("#nav-right-area").toggle("fast");return false;};
		var navRightIcon = document.createElement("span");
		navRightIcon.className = 'jd-icon-36 jd-icon-gear-36';
		navRightSpan.appendChild(navRightIcon);

		var navLogin = document.getElementById("nav-loggedin");
		if (JSONData.username == null){
			var loginHref = document.createElement("a");
			loginHref.href = "/login/login.html";
			loginHref.innerHTML = "Login";
			navLogin.appendChild(loginHref);
		} else {
			navLogin.innerHTML = JSONData.username;
			navLogin.onclick = function(){jQuery("#nav-right-area").toggle("fast");return false;};
		}
		
		var navLeft = document.getElementById("nav-left-area");
		var navLeftMenuUL = document.createElement("ul");
		navLeftMenuUL.className = 'navSystem';
		navLeft.appendChild(navLeftMenuUL);
		for (var i in menuLeft) {
			if (menuLeft.hasOwnProperty(i)){
				var navLeftMenuLI = document.createElement("li");
				navLeftMenuLI.className = 'topLeft';
				navLeftMenuUL.appendChild(navLeftMenuLI);
				var navLeftMenuHref = document.createElement("a");
				navLeftMenuHref.className = 'topLink';
				navLeftMenuHref.href = menuLeft[i].values[0].href;
				navLeftMenuHref.innerHTML = menuLeft[i].values[0].value;
				navLeftMenuLI.appendChild(navLeftMenuHref);
				if (menuLeft[i].children != null){
					var navLeftMenuSub = document.createElement("ul");
					navLeftMenuSub.className = "sub";
					this.addSubMenu(navLeftMenuSub,menuLeft[i].children);
					navLeftMenuLI.appendChild(navLeftMenuSub);
				}
			}
		}

		var navRight = document.getElementById("nav-right-area");
		var navRightMenuUL = document.createElement("ul");
		navRightMenuUL.className = 'navSystem';
		navRight.appendChild(navRightMenuUL);
		for (var i in menuRight){
			if (menuRight.hasOwnProperty(i)){
				var navRightMenuLI = document.createElement("li");
				navRightMenuLI.className = 'topRight';
				navRightMenuUL.appendChild(navRightMenuLI);
				var navRightMenuHref = document.createElement("a");
				navRightMenuHref.className = 'topLink';
				navRightMenuHref.href = menuRight[i].values[0].href;
				navRightMenuHref.innerHTML = menuRight[i].values[0].value;
				navRightMenuLI.appendChild(navRightMenuHref);
				if (menuRight[i].children != null){
					var navRightMenuSub = document.createElement("ul");
					navRightMenuSub.className = "sub";
					this.addSubMenu(navRightMenuSub,menuRight[i].children);
					navRightMenuLI.appendChild(navRightMenuSub);
				}
			}
		}
	}; //processTopNav
	
	this.addSubMenu = function(container,children){
		for (var i in children){
			if (children.hasOwnProperty(i)){
				var subMenu = document.createElement("li");
				container.appendChild(subMenu);
				var subMenuHref = document.createElement("a");
				subMenuHref.href = children[i].values[0].href;
				subMenuHref.innerHTML = children[i].values[0].value;
				subMenu.appendChild(subMenuHref);
				if (children[i].children != null){
					var subMenuUL = document.createElement("ul");
					subMenuUl.className = "sub";
					this.addSubMenu(subMenuUL,children[i].children);
					subMenu.appendChild(subMenuUL);
				}
			}
		}
	}; // addSubMenu
	
}	// TopNav