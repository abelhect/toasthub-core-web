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

toastHubAcquaintance.prototype = Object.create(toastHubBase.prototype);
toastHubAcquaintance.prototype.constructor = toastHubAcquaintance;

function toastHubAcquaintance(instanceName,parent){
	toastHubBase.call(this,instanceName,this);
	this.ajaxFunc = "member";
	this.service = "ACQUAINTANCE_SVC";
	this.mainContainer = null;
	this.panel = new ToastHubPanel();
	this.dashBoard2 = new ToastHubDashBoard2();
	this.chooseCallBack = null;
	this.tabIndex = new Object();
	this.tabArray = new Array();
	var self = parent;
	
	this.initCustom = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-acquaintance::toastHubAcquaintance::initCustom",params);
		params.action = "INIT";
		params.appForms = ["SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM"];
		params.appLabels = ["SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM"];
		params.appTexts = ["GLOBAL_PAGE"];

	}; // initCustom
	
	this.initContent = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-acquaintance::toastHubAcquaintance::initContent",params);
		self.pageFormFields = params.appPageFormFields;
		self.pageLabels = params.appPageLabels;
		self.pageTexts = params.appPageTexts;
		self.mainContainer = params.container;
	
		// create dashboard of user metrics
		var dashboard = new ToastHubDashboard();
		var totalCount = params.itemCount ? null : 0;
		var params2 = {container:self.mainContainer,stats:[{icon:"<i class='fa fa-Users'></i>",title:"Total",count:"4",percent:"<i class='green'><i class='fa fa-sort-asc'></i>50% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-inbox'></i>",title:"Pending Invites",count:"45",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From yesterday"},
		                                {icon:"<i class='fa fa-ambulance'></i>",title:"Help requests",count:"200",percent:"<i class='green'><i class='fa fa-sort-asc'></i>15% </i>",percentTitle:"From last week"},
		                                {icon:"<i class='fa fa-user'></i>",title:"Login Failures",percent:"<i class='green'><i class='fa fa-sort-asc'></i>10% </i>",percentTitle:"From last week",count:"30"},
		           						{icon:"<i class='fa fa-clock-o'></i>",title:"Average Time",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"3000"},
		           						{icon:"<i class='fa fa-phone'></i>",title:"Leads",percent:"<i class='green'><i class='fa fa-sort-asc'></i>4% </i>",percentTitle:"From last week",count:"52"}]};
		dashboard.listStats(params2);
		
		// create panel to hold list
		var dashBoard2Container = self.panel.drawLargePanel({container:self.mainContainer,contentId:"content-area",header:true});
		// self.dashBoard2.render({container:dashBoard2Container,title:"Product summary"})
		var test = document.createElement("H2");
		test.innerHTML = "Under construction";
		dashBoard2Container.appendChild(test);
		
	}; // initContent
	
	this.processList = function(JSONData) {
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance::toastHubAcquaintance::processList ",params);
		this.sysPageFormFields = JSONData.params.sysPageFormFields;
		this.sysPageLabels = JSONData.params.sysPageLabels;
		this.sysPageTexts = JSONData.params.sysPageTexts;
		this.tabIndex.id = this.instanceName+"tabs-1";
		this.tabIndex.name = "MEMBERS";
		var wrapper = document.createElement('DIV');
		var divTabs = document.createElement("DIV");
		divTabs.id = this.instanceName+"tabs";
		wrapper.appendChild(divTabs);
		var tabsUL = document.createElement("UL");
		divTabs.appendChild(tabsUL);
		var tabItem1 = document.createElement("LI");
		tabItem1.innerHTML = "<a href='#"+this.instanceName+"tabs-1'>"+this.sysPageTexts.SOCIAL_ACQUAINTANCE_MAIN_TAB_AQUAINTANCES.value+"</a>";
		tabsUL.appendChild(tabItem1);
		var tabItem2 = document.createElement("LI");
		tabItem2.innerHTML = "<a href='#"+this.instanceName+"tabs-2'>"+this.sysPageTexts.SOCIAL_ACQUAINTANCE_MAIN_TAB_INVITES.value+"(<span id='invitesCount'>"+JSONData.params.inviteCount+"</span>)</a>";
		tabsUL.appendChild(tabItem2);
		
		var tab1 = document.createElement("DIV");
		tab1.id = this.instanceName+'tabs-1';
		divTabs.appendChild(tab1);
		this.tabArray[this.instanceName+"tabs-1"] = "MEMBERS";
		
		var tab2 = document.createElement("DIV");
		tab2.id = this.instanceName+'tabs-2';
		divTabs.appendChild(tab2);
		//this.fillTab(tab2,"INVITES");
		this.tabArray[this.instanceName+"tabs-2"] = "INVITES";
		
		var editForm = document.createElement('div');
		editForm.id = this.instanceName+"Form";
		editForm.title = "Form";
		wrapper.appendChild(editForm);	
			
		if (this.modal != null && this.modal == true){
			jQuery("#Modal"+this.instanceName).dialog('open');
			var modalDiv = document.getElementById("Modal"+this.instanceName);
			modalDiv.innerHTML = "";
			modalDiv.appendChild(wrapper);
		} else {
			toastHub.containerContentObj.innerHTML = "";
			toastHub.containerContentObj.appendChild(wrapper);
		}	
		jQuery("#"+this.instanceName+"tabs").tabs({
			beforeActivate: function(event, ui) { 
				var id = ui.newPanel.attr('id');
				self.tabIndex.id = id;
				var myTab = id.split("-");
				switch(parseInt(myTab[1])){
				case 1:
					self.tabIndex.name = "MEMBERS";
					self.fillTab();
					break;
				case 2:
					self.tabIndex.name = "INVITES";
					self.loadInvittoastHubAcquaintanceTab();
					break;
				}
		    }
		});
		this.fillTab();
		jQuery("#"+this.instanceName+"Form").dialog({ autoOpen: false, modal:true, minWidth: 320, width:800 });
	}; // processInit
	
	this.fillTab = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:fillTab ");
		var tab = document.getElementById(this.tabIndex.id);
		tab.innerHTML = "";
		var header = document.createElement("DIV");
		header.className = "ui-title";
		tab.appendChild(header);
		var headerRight = document.createElement("SPAN");
		headerRight.className = "ui-title-right-area";
		header.appendChild(headerRight);
		var emailButton = document.createElement("INPUT");
		emailButton.type = "button";
		emailButton.value = "Invite";
		emailButton.onclick = function(){self.emailInviteForm();};
		headerRight.appendChild(emailButton);
			
			
		var memberArea = document.createElement("DIV");
		memberArea.className = "ui-boxColumn30";
		tab.appendChild(memberArea);
		var title = document.createElement("DIV");
		title.className = "ui-boxHeader";
		title.innerHTML = "Member ";
		memberArea.appendChild(title);
		var searchWrapper = document.createElement("DIV");
		searchWrapper.className = "searchwrapper";
		memberArea.appendChild(searchWrapper);
		var inputField = document.createElement("INPUT");
		inputField.type = "text";
		inputField.className = "searchfield";
		inputField.id = "member-searchString";
		inputField.name = "member-searchString";
		inputField.onblur = function(){if (this.value == "") {this.value = "Search...";} };
		inputField.onfocus = function(){if (this.value == "Search...") {this.value = "";} };
		inputField.value = "Search...";
		searchWrapper.appendChild(inputField);
		var inputButton = document.createElement("INPUT");
		inputButton.className = "searchbutton";
		inputButton.type = "button";
		inputButton.id = "member-search-button";
		inputButton.value = "Go";
		inputButton.onclick = function(){self.searchMembers();};
		searchWrapper.appendChild(inputButton);
		var memberList = document.createElement("DIV");
		memberList.id = "member-list";
		memberList.className = "ui-boxContent";
		memberArea.appendChild(memberList);
		
		var acquaintanceArea = document.createElement("DIV");
		acquaintanceArea.className = "ui-boxColumn30";
		tab.appendChild(acquaintanceArea);
		var title = document.createElement("DIV");
		title.className = "ui-boxHeader";
		title.innerHTML = "My Acquaintances(<span id='acquaintanceCount'></span>)";
		acquaintanceArea.appendChild(title);
		var searchWrapper = document.createElement("DIV");
		searchWrapper.className = "searchwrapper";
		acquaintanceArea.appendChild(searchWrapper);
		var inputField = document.createElement("INPUT");
		inputField.type = "text";
		inputField.className = "searchfield";
		inputField.id = "acquaintance-searchString";
		inputField.name = "acquaintance-searchString";
		inputField.onblur = function(){if (this.value == "") {this.value = "Search...";} };
		inputField.onfocus = function(){if (this.value == "Search...") {this.value = "";} };
		inputField.value = "Search...";
		searchWrapper.appendChild(inputField);
		var inputButton = document.createElement("INPUT");
		inputButton.className = "searchbutton";
		inputButton.type = "button";
		inputButton.id = "acquaintance-search-button";
		inputButton.value = "Go";
		inputButton.onclick = function(){self.searchAcquaintances();};
		searchWrapper.appendChild(inputButton);
		var acquaintanceList = document.createElement("DIV");
		acquaintanceList.id = "acquaintance-list";
		acquaintanceList.className = "ui-boxContent";
		acquaintanceArea.appendChild(acquaintanceList);
		
		var acquaintanceDetail = document.createElement("DIV");
		acquaintanceDetail.id = "acquaintance-detail";
		acquaintanceDetail.className = "ui-boxColumn30";
		tab.appendChild(acquaintanceDetail);
		var title = document.createElement("DIV");
		title.className = "ui-boxHeader";
		title.innerHTML = "Detail";
		acquaintanceDetail.appendChild(title);
		var content = document.createElement("DIV");
		content.className = "ui-boxContent";
		acquaintanceDetail.appendChild(content);
		
		var clear = document.createElement("DIV");
		clear.className = "ui-clear";
		tab.appendChild(clear);

		this.getList({pageStart:0,type:"ACQUAINTANCES"});
		//this.processSearchAcquaintances(JSONData);
	}; // fillTab
	
	this.processList = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processList ");
		var container = null;
		//if (JSONData.type == "ACQUAINTANCES"){
			container = document.getElementById("acquaintance-list");
			container.innerHTML = "";
		//}
		var rows = JSONData.params.acquaintances;
		if (rows != null) {
			var listUL = document.createElement("UL");
			listUL.className = "ui-list";
			container.appendChild(listUL);
			for ( var r = 0; r < rows.length; r++) {
				var row = rows[r];
				var listLI = document.createElement("LI");
				listUL.appendChild(listLI);
				listLI.appendChild(document.createTextNode(row.firstname+" "+row.lastname));
				var button = document.createElement("BUTTON");
				button.type = "button";
				button.title = "deleteAcquaintance";
				button.onclick = (function(id){ return function(){self.deleteAcquaintance(id);}; })(rows[r].id);
				button.innerHTML = "Delete";
				listLI.appendChild(button);
			}
		} else {
			var noResults = document.createElement("DIV");
			noResults.innerHTML = "No acquaintances";
			container.appendChild(noResults);
		}
	}; // processList	
	
	this.makeAcquaintance = function(memberId){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:makeAcquaintance ");
		var userInput = new Object();
		userInput.SOCIAL_ACQUAINTANCE_INVITE_FORM_RECEIVER_ID = memberId +"";
		userInput.SOCIAL_ACQUAINTANCE_INVITE_FORM_MESSAGE = "Invite from the web";
    	var params = toastHub.initParams();
		params.action = "INVITE_SEND";
		params.userInput = userInput;
    	params.callBack = function(JSONData){self.processMakeAcquaintanceStatus(JSONData);};
		this.callService(params);
	}; // makeAcquaintance
	
	this.processMakeAcquaintanceStatus = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processMakeAcquaintanceStatus ");
		alert("Request Sent");
	}; // makeAcquaintance
	
	this.openChooseAcquaintanceForm = function(container,callBack){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:openChooseAcquaintanceForm ");
		this.chooseContainer = container;
		this.chooseCallBack = callBack;
		var params = toastHub.initParams();
		params.action = "LIST";
		params.callBack = function(JSONData){self.processOpenChooseAcquaintanceForm(JSONData);};
		this.callService(params);
	}; //openSearchAcquaintanceModal
	
	this.processOpenChooseAcquaintanceForm = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processOpenChooseAcquaintanceForm ");
		var container = document.getElementById(this.chooseContainer);
		container.innerHTML = "";
		var searchWrapper = document.createElement("DIV");
		searchWrapper.id = this.chooseAcquaintanceContainer+"-mysearch";
		searchWrapper.className = 'ui-boxColumn30';
		container.appendChild(searchWrapper);
		var searchHeader = document.createElement("DIV");
		searchHeader.className = 'ui-boxHeader';
		searchWrapper.appendChild(searchHeader);
		var searchInput = document.createElement("INPUT");
		searchInput.type = "text";
		searchInput.id = this.chooseContainer+"-searchString";
		searchInput.name = this.chooseContainer+"-searchString";
		searchInput.size = 10;
		searchHeader.appendChild(searchInput);
		var searchButton = document.createElement("INPUT");
		searchButton.type = "button";
		searchButton.id = this.chooseContainer+"-search-button";
		searchButton.value = "Search";
		searchButton.onclick = function(){self.searchAcquaintances();};
		searchHeader.appendChild(searchButton);
		var searchResult = document.createElement("DIV");
		searchResult.id = this.chooseContainer+"-list";
		searchResult.className = 'ui-boxContent';
		searchWrapper.appendChild(searchResult);

		var detailWrapper = document.createElement("DIV");
		detailWrapper.id = this.chooseContainer+"-mydetail";
		detailWrapper.className = 'ui-boxColumn30';
		container.appendChild(detailWrapper);
		var detailHeader = document.createElement("DIV");
		detailHeader.className = 'ui-boxHeader';
		detailHeader.appendChild(document.createTextNode("Detail"));
		detailWrapper.appendChild(detailHeader);
		var detailContent = document.createElement("DIV");
		detailContent.id = this.chooseContainer+"-detail";
		detailContent.className = 'ui-boxContent';
		detailWrapper.appendChild(detailContent);
		
		var clearFloat = document.createElement("DIV");
		clearFloat.className = 'ui-clear';
		container.appendChild(clearFloat);

		jQuery("#"+this.chooseContainer).dialog("open");
		this.processSelectAcquaintances(JSONData);
	}; //processOpenSearchAcquaintanceForm
	
	this.processSelectAcquaintances = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processSelectAcquaintances ");
		var container = document.getElementById(this.chooseContainer+"-list");
		container.innerHTML = "";
		var rows = JSONData.params.acquaintances;
		var list = document.createElement("UL");
		list.className = 'ui-list-menu';
		container.appendChild(list);
		for ( var r = 0; r < rows.length; r++) {
			var row = rows[r];
			var listItem = document.createElement("LI");
			listItem.onclick = function(id,name){ return function(){
				jQuery("#"+self.chooseContainer).dialog("close");
				self.chooseCallBack(id,name);
					 }; }(row.id,row.firstname+" "+row.lastname);
			listItem.appendChild(document.createTextNode(row.firstname+" "+row.lastname));
			list.appendChild(listItem);
		}

	}; // processSearchAcquaintances
	
	this.searchAcquaintances = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:searchAcquaintances ");
		var searchString = document.getElementById("acquaintance-searchString").value;
		if (searchString.length < 2){
			return;
		}
    	var params = toastHub.initParams();
		params.action = "LIST";
		params.searchString = searchString;
    	params.callBack = function(JSONData){self.processSearchAcquaintances(JSONData);};
		this.callService(params);
	}; // searchAcquaintances
	
	this.processSearchAcquaintances = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processSearchAcquaintances ");
		var rows = JSONData.acquaintances;
		var iHTML = "";
		iHTML += "<ul class='ui-list'>";
		for ( var r = 0; r < rows.length; r++) {
			var row = rows[r];
			iHTML += "<li>"+row.firstname+" "+row.lastname+"<button type='button' title='deleteAcquaintance' onclick='toastHub.getController(\"acquaintance\").deleteAcquaintance("+row.id+");return false;'>Delete</button></li>";
		}
		iHTML += "</ul>";
		document.getElementById("acquaintance-list").innerHTML = iHTML;
	}; // processSearchAcquaintances
	
	this.searchMembers = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:searchMembers ");
		var searchString = document.getElementById("member-searchString").value;
		if (searchString.length < 2){
			return;
		}
    	var params = toastHub.initParams();
		params.action = "MEMBER_LIST";
		params.searchString = searchString;
    	params.callBack = function(JSONData){self.processSearchMembers(JSONData);};
		this.callService(params);
	}; // searchMembers
	
	this.processSearchMembers = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processSearchMembers ");
		var div = document.getElementById("member-list");
		var params = JSONData.params;
		if (params != null){
			var members = params.members;
			if (members != null){
				var iHTML = "";
				iHTML += "<ul class='ui-list'>";
				for ( var m = 0; m < members.length; m++) {
					var member = members[m];
					iHTML += "<li id='member-"+member.id+"'>"+member.firstname+" "+member.lastname+"<button id='makeAcquaintance' title='Invite' value='Invite' onclick='toastHub.getController(\"acquaintance\").makeAcquaintance("+member.id+");return false;'>Invite</button></li>";
				}
				iHTML += "</ul>";
				div.innerHTML = iHTML;
			}
		}
	}; // processSearchMembers
	
	//////////////////////////////////////////////////////////////////////////// Invites
	
	this.loadInvittoastHubAcquaintanceTab = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:loadInvittoastHubAcquaintanceTab ");
    	var params = toastHub.initParams();
		params.action = "INVITE_LIST";
    	params.callBack = function(JSONData){self.processInvittoastHubAcquaintanceTab(JSONData);};
		this.callService(params);
	}; // loadInvittoastHubAcquaintanceTab
	
	this.processInvittoastHubAcquaintanceTab = function(JSONData){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:processInvittoastHubAcquaintanceTab ");
		var tab = document.getElementById(this.instanceName+"tabs-2");
		var invitesReceived = JSONData.params.invitesReceived;
		var invitesSent = JSONData.params.invitesSent;
		var evitesSent = JSONData.params.evitesSent;
		var receivedCount = invitesReceived.length;
		document.getElementById("invitesCount").innerHTML = receivedCount;
		var iHTML = "";
		iHTML += "<div>Invites</div><hr>";
		iHTML += "<div id='acquaintance-inviteReceived' class='ui-boxColumn30'><div class='ui-boxHeader'>Received("+receivedCount+")</div>";
		iHTML += "<ul id='member-list' class='ui-list'>";
		for ( var i = 0; i < invitesReceived.length; i++) {
			var invite = invitesReceived[i];
			iHTML += "<li id='inviteReceived-"+invite.id+"'>"+invite.sender.firstname+" "+invite.sender.lastname;
			iHTML += "<button type='button' id='acceptInvite' title='acceptInvite' onclick='toastHub.getController(\"acquaintance\").acceptInvite("+invite.id+");return false;'>Accept</button><button type='button' id='denyInvite' title='denyInvite' value='Deny' onclick='toastHub.getController(\"acquaintance\").denyInvite("+invite.id+");return false;'>Deny</button>";
			iHTML += "</li>";
		}
		iHTML += "</ul></div><div id='acquaintance-inviteSent' class='ui-boxColumn30'><div class='ui-boxHeader'>Sent("+invitesSent.length+")</div><ul id='inviteSent-list' class='ui-list'>";
		for ( var i = 0; i < invitesSent.length; i++) {
			var invite = invitesSent[i];
			iHTML += "<li id='inviteSent-"+invite.id+"'><div>"+invite.receiver.firstname+" "+invite.receiver.lastname+"</div><div>";
			if (invite.status == "ACPT"){
				iHTML += "<span class='ui-text-green'>Accepted</span><button type='button' id='deleteInvite' title='deleteInvite' onclick='toastHub.getController(\"acquaintance\").deleteInvite("+invite.id+");return false;'>Delete</button>";
			} else if(invite.status == "DENY"){
				iHTML += "<span class='ui-text-red'>Denied</span><button type='button' id='deleteInvite' title='deleteInvite' onclick='toastHub.getController(\"acquaintance\").deleteInvite("+invite.id+");return false;'>Delete</button>";
			} else {
				iHTML += "<button type='button' id='cancelInvite' title='cancelInvite' onclick='toastHub.getController(\"acquaintance\").deleteInvite("+invite.id+");return false;'>Cancel</button>";
			}
			iHTML += "</div></li>";
		}
		iHTML += "</ul></div><div id='acquaintance-eviteSent' class='ui-boxColumn30'><div class='ui-boxHeader'>Evite Sent("+evitesSent.length+")</div><ul id='eviteSent-list' class='ui-list'>";
		for ( var i = 0; i < evitesSent.length; i++) {
			var evite = evitesSent[i];
			iHTML += "<li id='eviteSent-"+evite.id+"'><div>"+evite.receiverEmail+"</div>";
			iHTML += "<div>Status: "+evite.status+"</div>" ;
			iHTML += "</li>";
		}
		iHTML += "</ul></div><div class='ui-clear'></div>";
		tab.innerHTML = iHTML;
	}; // processInvittoastHubAcquaintanceTab
	
	this.acceptInvite = function(inviteId){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:acceptInvite ");
    	var params = toastHub.initParams();
		params.action = "INVITE_ACCEPT";
		params.inviteId = inviteId + "";
    	params.callBack = function(JSONData){self.loadInvittoastHubAcquaintanceTab(JSONData);};
		this.callService(params);
	}; // acceptInvite
	
	this.denyInvite = function(inviteId){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:denyInvite ");
    	var params = toastHub.initParams();
		params.action = "INVITE_DENY";
		params.inviteId = inviteId + "";
    	params.callBack = function(JSONData){self.loadInvittoastHubAcquaintanceTab(JSONData);};
		this.callService(params);
	}; // denyInvite
	
	this.deleteInvite = function(inviteId){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:deleteInvite ");
    	var params = toastHub.initParams();
		params.action = "INVITE_DELETE";
		params.inviteId = inviteId + "";
    	params.callBack = function(JSONData){self.loadInvittoastHubAcquaintanceTab(JSONData);};
		this.callService(params);
	}; // deleteInvite
	
	this.deleteAcquaintance = function(acquaintanceId){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:deleteAcquaintance ");
    	var params = toastHub.initParams();
		params.action = "DELETE";
		params.acquaintanceId = acquaintanceId;
    	params.callBack = function(JSONData){self.loadAcquaintancesTab(JSONData);};
		this.callService(params);
	}; // deleteAcquaintance
	
	
	this.uploadImage = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:uploadImage ");
		 var fileStream = jQuery("#fileToSend").val();
		 var callUrl = toastHub.utils.restUrl + "media/image/uploadImage";
			//toastHub.utils.callService(url,esProjectObj.processMenu,toastHub.utils.errorMessage,"type=mobile");
			jQuery.ajax({ type: "POST",
				url: callUrl,
				data: { name: 'gotpic.png', image: fileStream},
				dataType: "json",
				success: function(JSONData){
					alert("image uploade");
					//closeStatusDialog();
				},
				error: toastHub.utils.errorMessage
			});
	}; // uploadImage
	
	this.emailInviteForm = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:emailInviteForm ");
		var formWrapper = document.createElement("div");
		formWrapper.className = "th-form-wrapper";
		var container = document.getElementById(this.instanceName+"Form");
		container.innerHTML = "";
		container.appendChild(formWrapper);
		var eviteParams = new Object();
		eviteParams.container = formWrapper;
		eviteParams.sysPageFormName = "SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM";
		eviteParams.sysPageTextName = "SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM";
		eviteParams.sysPageLabelName = "SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM";
		eviteParams.formOnKeyPress = function() {var key=event.keyCode || event.which;if (key==13){toastHub.getController("acquaintance").validateEmailInvite();}};
		eviteParams.group = 'MAIN';
		eviteParams.buttonDirection = "HORIZONTAL";
		eviteParams.SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM_SUBMIT_BUTTON_onclick = function() { self.validateEmailInvite(); };
		eviteParams.formFields = this.sysPageFormFields.SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM;
		eviteParams.buttons = this.sysPageLabels.SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM;
		toastHub.utils.simpleFormRenderer(eviteParams);
		
		
	/*	
		
		var iHTML = "";
		iHTML += "<div class='form_wrapper'>";
		iHTML += "<form onkeypress='var key=event.keyCode || event.which;if (key==13){toastHub.getController(\"acquaintance\").validateEmailInvite();}'>";
		iHTML += "<fieldset>";
		
		iHTML += "</fieldset></form></div>";
		
		document.getElementById(this.instanceName+"Form").innerHTML = iHTML;
		*/
		jQuery("#"+this.instanceName+"Form").dialog("open");
	}; // emailInviteForm
	
	this.validateEmailInvite = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:validateEmailInvite ");
		this.sendEmailInvite();
	}; // validateEmailInvite
	
	this.sendEmailInvite = function(){
		toastHub.logSystem.log("DEBUG","toasthub-acquaintance:toastHubAcquaintance:sendEmailInvite ");
		var formFields = this.sysPageFormFields.SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM;
		var userInput = new Object();
		for (var f = 0; formFields.length > f; f++){
			var field = formFields[f];
			if (field.rendered && (field.pageFormFieldName.fieldType == "TXT" || field.pageFormFieldName.fieldType == "TXTA" ) && field.validation != null && field.validation != ""){
				var inputField = document.getElementById(field.pageFormFieldName.name);
				var regExp = new RegExp(inputField.validation);
				if (regExp.exec(inputField.value)){
					alert("error "+ field.pageFormFieldName.name);
				}
			}
			var item = jQuery("#SOCIAL_ACQUAINTANCE_EMAIL_INVITE_FORM-"+field.pageFormFieldName.name);
			userInput[field.pageFormFieldName.name] = item.val().toString();
		}
		
    	var params = toastHub.initParams();
		params.action = "INVITE_EMAIL_SEND";
		params.userInput = userInput;
    	params.callBack = function(JSONData){self.processSendEmailInvite(JSONData);};
		this.callService(params);
		jQuery("#"+this.instanceName+"Form").dialog("close");
	}; // sendEmailInvite
	
	this.processSendEmailInvite = function(JSONData){
		
	}
}// Acquaintance
