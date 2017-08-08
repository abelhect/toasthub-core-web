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

toastHubAdminLayout.prototype = Object.create(toastHubBase.prototype);
toastHubAdminLayout.prototype.constructor = toastHubAdminLayout;

function toastHubAdminLayout(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "admin";
	this.service = "ADMIN_SVC";
	this.mainContainer = null;
	this.leftSideMenuContainer = null;
	this.topRightMenuContainer = null;
	this.pageContentContainer = null;
	this.topNavObj = null;

	var self = parent;
	
	this.initPage = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::initPage");
		
		// setup layout
		this.layoutRenderer();
		
		// add menu
		this.navRenderer();
		
		// add content
		params.container = this.pageContentContainer;
		toastHub.getController(toastHub.pageName).initContent(params);
		
		// add footer
		this.footerRenderer(params);
		
		// this is needed for testing login 
		var test = document.createElement("DIV");
		test.id = "AdminArea";
		toastHub.body.appendChild(test);
		
		this.addAction();
	}; // initPage
	
	this.layoutRenderer = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::layoutRenderer");
		var containerBody = document.createElement("DIV");
		containerBody.className = "container body";
		toastHub.body.appendChild(containerBody);
		
		this.mainContainer = document.createElement("DIV");
		this.mainContainer.className = "main_container";
		containerBody.appendChild(this.mainContainer);
		
		var leftSideMenuContainer = document.createElement("DIV");
		leftSideMenuContainer.className = "col-md-3 left_col";
		this.mainContainer.appendChild(leftSideMenuContainer);
		this.leftSideMenuContainer = leftSideMenuContainer;
		
		var topRightMenuContainer = document.createElement("DIV");
		topRightMenuContainer.className = "top_nav";
		this.mainContainer.appendChild(topRightMenuContainer);
		this.topRightMenuContainer = topRightMenuContainer;
		
		var pageContentContainer = document.createElement("DIV");
		pageContentContainer.className = "right_col";
		pageContentContainer.setAttribute("role","main");
		this.mainContainer.appendChild(pageContentContainer);
		this.pageContentContainer = pageContentContainer;
		
		var footerContainer = document.createElement("FOOTER");
		this.mainContainer.appendChild(footerContainer);
		this.footerContainer = footerContainer;
	};
	
	this.navRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::navRenderer");
		
		var params = toastHub.initParams();
		params.action = "INIT_MENU";
		params.service = "ADMIN_SVC";
		params.menuNames = new Array("ADMIN_MENU_RIGHT","ADMIN_MENU_LEFT");
		params.callBack = function(JSONData){self.navRendererDraw(JSONData);};
		this.callService(params);
	}; // navRenderer
	
	this.navRendererDraw = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::navRendererDraw");
		// left menu
		var menuLeft = JSONData.params.MENUS.ADMIN_MENU_LEFT;
		var sideParams = {container:this.leftSideMenuContainer,menuName:"ADMIN_MENU_LEFT",menu:menuLeft};
		var sideMenu = new ToastHubSideMenu();
		sideMenu.render(sideParams);
		
		// right top menu
		var menuRight = JSONData.params.MENUS.ADMIN_MENU_RIGHT;
		var topParams = {container:this.topRightMenuContainer,menuName:"ADMIN_MENU_RIGHT",menu:menuRight,navToggle:true,menuToggle:function() {self.menuToggle();}};
		var topMenu = new ToastHubTopMenu();
		topMenu.render(topParams);
		
	};  // navRendererDraw
	
	this.menuToggle = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::menuToggle");
		if (toastHub.body.className == 'nav-md') {
			jQuery(this.leftSideMenuContainer).find('li.active ul').hide();
			jQuery(this.leftSideMenuContainer).find('li.active').addClass('active-sm').removeClass('active');
		} else {
			jQuery(this.leftSideMenuContainer).find('li.active-sm ul').show();
			jQuery(this.leftSideMenuContainer).find('li.active-sm').addClass('active').removeClass('active-sm');
	    }

	    jQuery(toastHub.body).toggleClass('nav-md nav-sm');

	};
	
	this.footerRenderer = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-adminLayout::toastHubAdminLayout::footerRenderer");
		
		var footerInfo = document.createElement("DIV");
		footerInfo.className = "pull-right";
		footerInfo.innerHTML = "Copyright &copy; CBorgtech 2017";
		this.footerContainer.appendChild(footerInfo);
		var clearFix = document.createElement("DIV");
		clearFix.className = "clearfix";
		this.footerContainer.appendChild(clearFix);

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
	
}; // toastHubMmeberLayout




