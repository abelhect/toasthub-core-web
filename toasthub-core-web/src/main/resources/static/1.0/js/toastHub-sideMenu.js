/**
 * 
 */

var ToastHubSideMenu = function() {	
		
	this.render = function(params) {
		var scroll = document.createElement("DIV");
		scroll.className = "left_col scroll-view";
		params.container.appendChild(scroll);
		
		var nav = document.createElement("DIV");
		nav.className = "navbar nav_title";
		nav.style = "border: 0;";
		scroll.appendChild(nav);
		
		var href = document.createElement("A");
		href.className = "site_title";
		href.href = "index.html";
		href.innerHTML = "<i class='fa fa-paw'></i> <span>Toasty</span>";
		nav.appendChild(href);
		
		var clear = document.createElement("DIV");
		clear.className = "clearfix";
		scroll.appendChild(clear);
		
		params.container = scroll;
		this.sideMenu(params);
	}; // render
   
	this.intro = function(params) {
		var profile = document.createElement("DIV");
		profile.className = "profile clearfix";
		params.container.appendChild(profile);
		
		var pic = document.createElement("DIV");
		pic.className = "profile_pic";
		pic.innerHTML = "<img src='images/img.jpg' alt='...' class='img-circle profile_img'>";
		profile.appendChild(pic);
		
		var info = document.createElement("DIV");
		info.className = "profile_info";
		info.innerHTML = "<span>Welcome,</span><h2>John Doe</h2>";
		params.container.appendChild(info);
		
		var br = document.createElement("BR");
		params.container.appendChild(br);
		
	
	}; // intro

		
	this.sideMenu = function(params) {	
		var side = document.createElement("DIV");
		side.id = "sidebar-menu";
		side.className = "main_menu_side hidden-print main_menu";
		params.container.appendChild(side);

		var sectionParams = {container:side,sectionName:"General"};
		var generalContainer = this.menuSection(sectionParams);
		
		var menuParams = {container:generalContainer,menu:params.menu};
		this.menuItems(menuParams);
		
	}; // SideMenu
	
	this.menuSection = function(params) {
		
		var section = document.createElement("DIV");
		section.className = "menu_section";
		params.container.appendChild(section);
		
		var title = document.createElement("H3");
		title.innerHTML = params.sectionName;
		section.appendChild(title);

		return section;
		
	}; // menuSection
	
	this.menuItems = function(params) {
	
		var ul = document.createElement("UL");
		ul.className = "nav side-menu";
		params.container.appendChild(ul);
		
		var items = params.menu;
		for (var i in items){
			if (items.hasOwnProperty(i)){
				var li = document.createElement("LI");
				li.setAttribute("data-toggle","collapse");
				li.setAttribute("data-target","#"+items[i].values[0].id);
				ul.appendChild(li);
				var href = document.createElement("A");
				href.innerHTML = "<i class='fa fa-home'></i>"+items[i].values[0].value+"<span class='fa fa-chevron-down'></span>";
				li.appendChild(href);
				
				// check for children
				if (items[i].children != null){
					var myParams = {container:li,items:items[i].children,parentId:items[i].values[0].id};
					this.childItem(myParams);
				}
			}
		}
	
	}; // menuItems
	
	this.childItem = function(params) {
		var ul = document.createElement("UL");
		ul.id = params.parentId;
		ul.className = "nav menu_img collapse";
		params.container.appendChild(ul);
	
		var items = params.items;
		for (var i in items){
			if (items.hasOwnProperty(i)){
				var li = document.createElement("LI");
				ul.appendChild(li);
				var href = document.createElement("A");
				href.href = items[i].values[0].href;
				href.innerHTML = items[i].values[0].value;
				li.appendChild(href);

			}
		}
	}; // childItem
		
}; // SideMenu
	
	
	