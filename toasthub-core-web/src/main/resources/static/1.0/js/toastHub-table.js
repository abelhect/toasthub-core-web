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

var ToastHubTable = function() {
	this.rows = null;
	this.selectedId = null;
	this.selectedIds = new Array();
	this.saveCallBack = null;
	
	this.render = function(params){
		if (params.saveCallBack != null){
			this.saveCallBack = params.saveCallBack;
		}
		var table = document.createElement("TABLE");
		table.className = "table table-striped";
		params.container.appendChild(table);
		
		var thead = document.createElement("THEAD");
		table.appendChild(thead);
		
		var trhead = document.createElement("TR");
		thead.appendChild(trhead);
		
		var columns = params.table.columns;
		for (i = 0; i < columns.length; i++) { 
			var th = document.createElement("TH");
			th.innerHTML = columns[i];
			trhead.appendChild(th);
		}
		
		var tbody = document.createElement("TBODY");
		table.appendChild(tbody);
		
		this.rows = params.table.rows;
		for (i = 0; i < this.rows.length; i++) { 
			var trbody = document.createElement("TR");
			tbody.appendChild(trbody);
		
			for (j = 0; j < columns.length; j++) { 
				var td = document.createElement("TD");
				if (this.rows[i][j] instanceof Object) {
					if (this.rows[i][j].type == "checkbox") {
						var checkWrapper = document.createElement("DIV");
						//checkWrapper.className = "checkbox";
						td.appendChild(checkWrapper);
						var checkInput = document.createElement("INPUT");
						checkInput.type = "checkbox";
						if (this.rows[i][j].id != null){
							checkInput.id = this.rows[i][j].id;
						} else {
							checkInput.id = "checkbox"+i;
						}
						if(this.rows[i][j].status == "checked"){
							checkInput.checked = "checked";
						}
						if (params.fieldType == "MDLSNG"){
							checkInput.onclick = (function(params) { return function(){params.parent.singleSelect(params);}})({row:this.rows[i][j].id,parent:this});
						} else {
							checkInput.onclick = (function(params) { return function(){params.parent.toggleSelected(params);}})({row:this.rows[i][j].id,parent:this});
						}
						checkWrapper.appendChild(checkInput);
						
					} else {
						td.appendChild(this.rows[i][j].item);
					}
				} else {
					td.innerHTML = this.rows[i][j];
				}
				trbody.appendChild(td);
			}
		}
	}; // render

	this.singleSelect = function(params){
		toastHub.logSystem.log("DEBUG","toastHub-table::toastHubTable::singleSelect::"+params.row);
		 this.selectedId = params.row;
		 for (i = 0; i < this.rows.length; i++) { 
			 var checkbox = document.getElementById(this.rows[i][0].id);
			 if (params.row != this.rows[i][0].id){
				 checkbox.checked = "";
			 }
		 }
	}
	
	this.toggleSelected = function(params) {
		toastHub.logSystem.log("DEBUG","toastHub-table::toastHubTable::toggleSelect::"+params.row);
		var cbox = document.getElementById(params.row);
		var id = params.row.split("-");
		if (this.saveCallBack) {
			var op = "delete";
			if (cbox.checked) {
				op = "save";
			}
			this.saveCallBack({op:op,id:id[1]});
		} else {
			// check if it exists
			var exists = false;
			var existsId = null;
			for (i = 0; i < this.selectedIds.length; i++){
				if (this.selectedIds[i] == id[1]){
					exists = true;
					existsId = i;
					break;
				}
			}
			if (cbox.checked) {
				// add checked if it does not exist
				if (!exists) {			
					this.selectedIds.push(id[1]);
				}
			} else {
				if (exists && existsId != null) {
					this.selectedIds.splice(existsId,1);
				}
			}
		}
	};
	
}; // Table