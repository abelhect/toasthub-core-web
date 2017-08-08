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

toastHubPublicLayout.prototype = Object.create(toastHubBase.prototype);
toastHubPublicLayout.prototype.constructor = toastHubPublicLayout;

function toastHubPublicLayout(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "public";
	this.service = "PUBLIC_SVC";
	this.pageContentContainer = null;
	this.rightSideContainer = null;
	this.footerContainer = null;
	var self = parent;
	
	this.initPage = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-PublicLayout::toastHubPublicLayout::initPage");
		
		// setup layout
		this.layoutRenderer();
		
		// add menu
		this.navRenderer();
		
		// add content
		params.container = toastHub.body;
		toastHub.getController(toastHub.pageName).initContent(params);
		
		// add footer
		this.footerRenderer(params);
		
		this.addAction();
	}; // initPage
	
	this.layoutRenderer = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-PublicLayout::toastHubPublicLayout::layoutRenderer");
		
		var nav = document.createElement("NAV");
		nav.id = "mainNav";
		nav.className = "navbar navbar-Public navbar-custom navbar-fixed-top affix";
		toastHub.containerMenuObj = nav;
		toastHub.body.appendChild(nav);
		
	};
	
	this.navRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-publicLayout::toastHubPublicLayout::navRenderer");
		
		var params = toastHub.initParams();
		params.action = "INIT_MENU";
		params.service = "PUBLIC_SVC";
		params.menuNames = new Array("PUBLIC_MENU_RIGHT");
		params.callBack = function(JSONData){self.navRendererDraw(JSONData);};
		this.callService(params);
	}; // navRenderer
	
	this.navRendererDraw = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-publicLayout::toastHubPublicLayout::navRendererDraw");
		var menuRight = JSONData.params.MENUS.PUBLIC_MENU_RIGHT;
		
		var navWrap = document.createElement("DIV");
		navWrap.className = "container";
		toastHub.containerMenuObj.appendChild(navWrap);
		
		var navHeader = document.createElement("DIV");
		navHeader.className = "navbar-header page-scroll";
		navWrap.appendChild(navHeader);
		var buttonToggle = document.createElement("BUTTON");
		buttonToggle.type = "button";
		buttonToggle.className = "navbar-toggle";
		buttonToggle.setAttribute("data-toggle", "collapse");
		buttonToggle.setAttribute("data-target", "#bs-example-navbar-collapse-1");
		
		buttonToggle.innerHTML = "<span class='sr-only'>Toggle navigation</span> Menu <i class='fa fa-bars'></i>"
		navHeader.appendChild(buttonToggle);
		var logo = document.createElement("A");
		logo.className = "navbar-brand page-scroll";
		logo.href = "#page-top";
		logo.innerHTML = "CborgCust";
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

	}; // navRendererDraw
	
	this.footerRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-publicLayout::toastHubPublicLayout::footerRenderer");
		var footer = document.createElement("FOOTER");
		toastHub.body.appendChild(footer);
		
		var container = document.createElement("DIV");
		container.className = "row";
		footer.appendChild(container);
		
		var col1 = document.createElement("DIV");
		col1.className = "col-md-4";
			var copyright = document.createElement("SPAN");
			copyright.className = "copyright";
			copyright.innerHTML = "Copyright &copy; ToastHub 2016";
			col1.appendChild(copyright);
		container.appendChild(col1);
		
		var col2 = document.createElement("DIV");
		col2.className = "col-md-4";
			var ul1 = document.createElement("UL");
			ul1.className = "list-inline social-buttons";
			col2.appendChild(ul1);
			var li1 = document.createElement("LI");
			li1.innerHTML = "<a href='#'><i class='fa fa-twitter'></i></a>";
			ul1.appendChild(li1);
			var li2 = document.createElement("LI");
			li2.innerHTML = "<a href='#'><i class='fa fa-facebook'></i></a>";
			ul1.appendChild(li2);
			var li3 = document.createElement("LI");
			li3.innerHTML = "<a href='#'><i class='fa fa-linkedin'></i></a>";
			ul1.appendChild(li3);
		container.appendChild(col2);
			
		var col3 = document.createElement("DIV");
		col3.className = "col-md-4";
			var ul2 = document.createElement("UL");
			ul2.className = "list-inline quicklinks";
			col3.appendChild(ul2);
			var li31 = document.createElement("LI");
			li31.innerHTML = "<a href='#'>Privacy Policy</a>";
			ul2.appendChild(li31);
			var li32 = document.createElement("LI");
			li32.innerHTML = "<a href='#'>Terms of Use</a>";
			ul2.appendChild(li32);
		container.appendChild(col3);	

	}; // footerRenderer
	
	this.addAction = function() {
		
		jQuery('a.page-scroll').bind('click', function(event) {
	        var $anchor = $(this);
	        jQuery('html, body').stop().animate({
	            scrollTop: ($($anchor.attr('href')).offset().top - 50)
	        }, 1250, 'easeInOutExpo');
	        event.preventDefault();
	    });

	    // Highlight the top nav as scrolling occurs
	    jQuery('body').scrollspy({
	        target: '.navbar-fixed-top',
	        offset: 51
	    });

	    // Closes the Responsive Menu on Menu Item Click
	    jQuery('.navbar-collapse ul li a').click(function(){ 
	            jQuery('.navbar-toggle:visible').click();
	    });

	    // Offset for Main Navigation
	    jQuery('#mainNav').affix({
	        offset: {
	            top: 100
	        }
	    });
	}; // addAction
	
}; // toastHubPublicLayout




