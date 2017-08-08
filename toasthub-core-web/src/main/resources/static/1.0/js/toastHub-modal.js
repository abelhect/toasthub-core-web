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

var ToastHubModal = function() {
	
	this.render = function(params){
		
		// remove old acknowledge modals
		var oldModal = document.getElementById(params.id);
		if (oldModal != null) {
			oldModal.parentNode.removeChild(oldModal);
		}
		
		var modalWrapper = document.createElement("DIV");
		modalWrapper.className = "modal fade";
		modalWrapper.id = params.id;
		modalWrapper.tabindex = "-1";
		modalWrapper.setAttribute("role","dialog");
		modalWrapper.setAttribute("aria-labelledby","basicModal");
		params.container.appendChild(modalWrapper);

		var modalDialog = document.createElement("DIV");
		modalDialog.className = "modal-dialog";
		modalWrapper.appendChild(modalDialog);
		
		var modalContent = document.createElement("DIV");
		modalContent.className = "modal-content";
		modalDialog.appendChild(modalContent);
		
		var modalHeader = document.createElement("DIV");
		modalHeader.id = "modalHeader-"+params.id;
		modalHeader.className = "modal-header";
		modalContent.appendChild(modalHeader);
		
		var closeButton = document.createElement("BUTTON");
		closeButton.type = "button";
		closeButton.className = "close";
		closeButton.setAttribute("data-dismiss","modal");
		closeButton.setAttribute("aria-hidden","true");
		closeButton.innerHTML = "<i class='fa fa-close'></i>";
		modalHeader.appendChild(closeButton);
		
		var headerTitle = document.createElement("H4");
		headerTitle.className = "modal-title";
		headerTitle.id = "modalTitle-"+params.id;
		if (params.headerTitle != null) {
			headerTitle.innerHTML = params.headerTitle;
		} else {
			headerTitle.innerHTML = "Modal Title";
		}
		modalHeader.appendChild(headerTitle);
		
		var modalBody = document.createElement("DIV");
		modalBody.id = "modalBody-"+params.id;
		modalBody.className = "modal-body";
		modalContent.appendChild(modalBody);
		
		if (params.body != null) {
			modalBody.appendChild(params.body);
		} else {
			var body = document.createElement("H3");
			body.innerHTML = "Modal Body <i class='fa fa-cog fa-spin fa-3x fa-fw' style='font-size:24px'></i>";
			modalBody.appendChild(body);
			var link = document.createElement("A");
			link.href = "#";
			link.setAttribute("data-toggle","modal");
			link.setAttribute("data-target","#userModal");
			link.innerHTML = "User Modal";
			modalBody.appendChild(link);
		}
		
		var modalFooter = document.createElement("DIV");
		modalFooter.id = "modalFooter-"+params.id;
		modalFooter.className = "modal-footer";
		modalContent.appendChild(modalFooter);
		
		if (params.buttons != null) {
			modalFooter.appendChild(params.buttons);
		} else {
			params.container = modalFooter;
			if (params.acceptLabel == null) {
				params.acceptLabel = "Ok";
			}
			if (params.declineLabel == null) {
				params.declineLabel = "Cancel";
			}
			this.acceptButtonDraw(params);
			this.declineButtonDraw(params);
			
		}
		return modalBody;
	};
	
	this.acceptButtonDraw = function(params) {
		if (params.acceptClick != null){
			var buttonAccept = document.createElement("BUTTON");
			buttonAccept.id = "modalButtonAccept-"+params.id;
			buttonAccept.type = "button";
			buttonAccept.className = "btn btn-primary";
			buttonAccept.innerHTML = params.acceptLabel;
			buttonAccept.onclick = params.acceptClick;
			params.container.appendChild(buttonAccept);
		}
	}; // acceptButtonDraw
	
	this.declineButtonDraw = function(params) {
		var buttonDecline = document.createElement("BUTTON");
		buttonDecline.id = "modalButtonDecline-"+params.id;
		buttonDecline.type = "button";
		buttonDecline.className = "btn btn-default";
		buttonDecline.innerHTML = params.declineLabel;
		if (params.declineClick != null) {
			buttonDecline.onclick = params.declineClick;
		}
		params.container.appendChild(buttonDecline);
	}; // declineButtonDraw
	
	this.createButtons = function(params) {
		var buttons = params.modal.buttons;
		for(var i = 0; i < buttons.length; i++){
			var button = document.createElement("BUTTON");
			//button.id = "modalButton-"params.id;
			button.type = "button";
			button.className = "btn " + buttons[i].className;
			button.innerHTML = buttons[i].text;
			button.onClick = buttons[i].create;
			params.container.appendChild(button);
		}
	};
	
}; // Modal