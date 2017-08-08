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

function ToastHubContacts() {
	var self = this;
	
	this.renderContacts = function(params) {
		var col = document.createElement("DIV");
		col.className = "col-md-12";
		params.container.appendChild(col);
		var panel = document.createElement("DIV");
		panel.className = "x_panel";
		col.appendChild(panel);
		var content = document.createElement("DIV");
		content.className = "x_content";
		panel.appendChild(content);

		params.container = content;
		this.contactList(params);
	};
	
	this.renderUsers = function(params) {
	/*	var col = document.createElement("DIV");
		col.className = "col-md-12";
		params.container.appendChild(col);
		var panel = document.createElement("DIV");
		panel.className = "x_panel";
		col.appendChild(panel);
		var content = document.createElement("DIV");
		content.className = "x_content";
		panel.appendChild(content);

		params.container = content;*/
		this.userList(params);
	};
	
	
	this.headerWithSearchRenderer = function(params) {
		var wrapper = document.createElement("DIV");
		wrapper.className = "page-title";
		params.container.appendChild(wrapper);
	
		var title = document.createElement("DIV");
		title.className = "title_left";
		title.innerHTML = "<h3>"+params.title+"</h3>";
		wrapper.appendChild(title);
		
		var searchWrapper = document.createElement("DIV");
		searchWrapper.className = "title_right";
		wrapper.appendChild(searchWrapper);
		
		var col = document.createElement("DIV");
		col.className = "col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search";
		searchWrapper.appendChild(col);
		
		var inputWrapper = document.createElement("DIV");
		inputWrapper.className = "input-group";
		col.appendChild(inputWrapper);
		
		var input = document.createElement("INPUT");
		input.type = "text";
		input.className = "form-control";
		input.setAttribute("placeholder","Search for...");
		inputWrapper.appendChild(input);
		
		var buttonWrapper = document.createElement("SPAN");
		buttonWrapper.className = "input-group-btn";
		inputWrapper.appendChild(buttonWrapper);
		
		var button = document.createElement("BUTTON");
		button.className = "btn btn-default";
		button.type = "button";
		button.innerHTML = "Go!";
		//button.onclick = params.buttonCallback;
		buttonWrapper.appendChild(button);
		
	};
	
	
	this.contactList = function(params) {
		
		var row = document.createElement("DIV");
		row.className = "row";
		params.container.appendChild(row);
		
		var items = params.contacts;
		for(var i = 0; i < items.length; i++) {
			this.cardRenderer({container:row,contact:items[i],infoFunc:function(params){self.contactInfoDetail(params);} ,buttonFunc:function(params){self.contactButtonDetail(params);}} );
		}
	
	};
	
	this.userList = function(params) {
		var row = document.createElement("DIV");
		row.className = "row";
		params.container.appendChild(row);
		
		var items = params.items;
		for(var i = 0; i < items.length; i++) {
			this.cardRenderer({container:row,user:items[i],infoFunc:function(params){self.userInfoDetail(params);} ,buttonFunc:function(params){self.userButtonDetail(params);}} );
		}
	
	};
	
	this.cardRenderer = function(params) {
	
		var wrapper = document.createElement("DIV");
		wrapper.className = "col-md-4 col-sm-4 col-xs-12 profile_details";
		params.container.appendChild(wrapper);
		
		var view = document.createElement("DIV");
		view.className = "well profile_view";
		wrapper.appendChild(view);
		
		var infoArea = document.createElement("DIV");
		infoArea.className = "col-sm-12";
		view.appendChild(infoArea);
		
		params.container = infoArea;
		params.infoFunc(params);
		
		var bottomArea = document.createElement("DIV");
		bottomArea.className = "col-xs-12 bottom text-center";
		view.appendChild(bottomArea);
		
		params.container = bottomArea;
		params.buttonFunc(params);
		
		
	};
	
	this.contactInfoDetail = function(params) {
	
		var infoCol = document.createElement("DIV");
		infoCol.className = "left col-xs-7";
		params.container.appendChild(infoCol);
		
		var name = document.createElement("H2");
		name.innerHTML = params.contact.firstname + " " + params.contact.lastname;
		infoCol.appendChild(name);
		
		var about = document.createElement("P");
		about.innerHTML = "<strong>Username: </strong> "+params.contact.username;
		infoCol.appendChild(about);

		var addressWrap = document.createElement("UL");
		addressWrap.className = "list-unstyled";
		infoCol.appendChild(addressWrap);
		
		if (params.contact.address != null) {
			var address = document.createElement("LI");
			address.innerHTML = "<i class='fa fa-building'></i> Address: "+params.contact.address;
			addressWrap.appendChild(address);
		}
		if (params.contact.phone != null) {
			var phone = document.createElement("LI");
			phone.innerHTML = "<i class='fa fa-phone'></i> Phone #: "+params.contact.phone;
			addressWrap.appendChild(phone);
		}
		var picCol = document.createElement("DIV");
		picCol.className = "right col-xs-5 text-center";
		picCol.innerHTML = "<img src='/toasthubweb/img/user.png' alt='' class='img-circle img-responsive'>";
		params.container.appendChild(picCol);
	};
	
	this.userInfoDetail = function(params) {
	
		var infoCol = document.createElement("DIV");
		infoCol.className = "left col-xs-7";
		params.container.appendChild(infoCol);
		
		var name = document.createElement("H2");
		name.innerHTML = params.user.firstname + " " + params.user.lastname;
		infoCol.appendChild(name);
		
		var username = document.createElement("P");
		username.innerHTML = "<strong>Username: </strong> "+params.user.username;
		infoCol.appendChild(username);
		
		var statusValue = "Disabled";
		if (params.user.active){
			statusValue = "Active"
		}
		var status = document.createElement("P");
		status.innerHTML = "<strong>Status: </strong> "+statusValue;
		infoCol.appendChild(status);

		var lockValue = "Open";
		if (params.user.locked){
			lockValue = "Locked"
		}
		var lock = document.createElement("P");
		lock.innerHTML = "<strong>Account: </strong> "+lockValue;
		infoCol.appendChild(lock);
		
		var addressWrap = document.createElement("UL");
		addressWrap.className = "list-unstyled";
		infoCol.appendChild(addressWrap);
		
		var address = document.createElement("LI");
		address.innerHTML = "<i class='fa fa-clock-o'></i> Created: "+ new Date(params.user.created);
		addressWrap.appendChild(address);
		
		var address = document.createElement("LI");
		address.innerHTML = "<i class='fa fa-building'></i> Address: "+params.user.address;
		addressWrap.appendChild(address);
		
		var phone = document.createElement("LI");
		phone.innerHTML = "<i class='fa fa-phone'></i> Phone #: "+params.user.phone;
		addressWrap.appendChild(phone);
		
		var picCol = document.createElement("DIV");
		picCol.className = "right col-xs-5 text-center";
		picCol.innerHTML = "<img src='/toasthubweb/1.0/img/user.png' alt='' class='img-circle img-responsive'>";
		params.container.appendChild(picCol);

	};
	
	this.contactButtonDetail = function(params) {
	
		var buttonArea = document.createElement("DIV");
		buttonArea.className = "col-xs-12 col-sm-6 emphasis";
		params.container.appendChild(buttonArea);
		
		var buttonComment = document.createElement("BUTTON");
		buttonComment.type = "button";
		buttonComment.className = "btn btn-success btn-xs";
		buttonComment.innerHTML = "<i class='fa fa-user'></i> <i class='fa fa-comments-o'></i>";
		buttonArea.appendChild(buttonComment);
		
		var buttonDetail = document.createElement("DIV");
		buttonDetail.type = "button";
		buttonDetail.className = "btn btn-primary btn-xs";
		buttonDetail.innerHTML = "<i class='fa fa-user'> </i> View Profile";
		//buttonDetail.onclick = self.contactDetail();
		buttonArea.appendChild(buttonDetail);
		
	};
	
	this.userButtonDetail = function(params) {
	
		var buttonArea = document.createElement("DIV");
		buttonArea.className = "col-xs-12 col-sm-12 emphasis";
		params.container.appendChild(buttonArea);
		
		var buttonStats = document.createElement("DIV");
		buttonStats.type = "button";
		buttonStats.className = "btn btn-primary btn-xs";
		buttonStats.innerHTML = "<i class='fa fa-bar-chart'> </i> Stats";
		//buttonDetail.onclick = self.contactDetail();
		buttonArea.appendChild(buttonStats);
		
		var buttonComment = document.createElement("BUTTON");
		buttonComment.type = "button";
		buttonComment.className = "btn btn-primary btn-xs";
		buttonComment.innerHTML = "<i class='fa fa-group'></i> Roles";
		buttonArea.appendChild(buttonComment);
		
		var buttonDetail = document.createElement("DIV");
		buttonDetail.type = "button";
		buttonDetail.className = "btn btn-primary btn-xs";
		buttonDetail.innerHTML = "<i class='fa fa-edit'> </i> Edit";
		//buttonDetail.onclick = self.contactDetail();
		buttonArea.appendChild(buttonDetail);
		
		
	
	};
	
	this.contactDetail = function(params) {
	
	
	
	};



};