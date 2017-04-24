/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
function redirectConnect() {
    window.location.href = 'index.html';
}

function connection(e) {
    $.ajax({
       url : 'http://129.88.241.142:8080/api/user/',
       type : 'GET',
       success : function(code,statut){
           window.location.href = 'menu.html';
           console.log(code);
       },
       error : function(code_html,statut){
           window.location.href = 'errorConnect.html';
       }
    });
    e.preventDefault();
}

function inscription(e) {
	$.ajax({
       url : 'http://129.88.241.142:8080/api/user/',
       type : 'POST',
       data : $(this).serialize(),
       contentType : 'application/x-www-form-urlencoded',
       success : function(code_html,statut){
           window.location.href = 'registerVal.html';
       },
       error : function(code_html,statut){
           window.location.href = 'errorPseudo.html';
       }
    });
    e.preventDefault();
}

function getContactsList() {
	var options = new ContactFindOptions();
	options.filter = "";
	options.multiple = true;
	options.hasPhoneNumber = true;
	filter = ["name", "phoneNumbers"];
	navigator.contacts.find(filter, onSuccessContactsList, onErrorContactsList, options);
}

function redirecRegister() {
	window.location.href = 'register.html';
}

function enableChat() {
	var socket = io.connect('http://129.88.242.138:8080');
	$('#chat').submit(function () {
		socket.emit('chat message', $('#m').val()); // TODO : concatener le pseudo
		$('#m').val('');
		return false;
	});
	socket.on('chat message', function (msg) {
		$('#messages').append($('<li class="table-view-cell">').text(msg));
		console.log("append");
		window.scrollTo(0, document.body.scrollHeight);
	});
}

/*
 $("document").ready(function () {
 enableChat();
 $("#action_add").bind("submit", inscription);
 $("#redirec_register").bind("click", redirecRegister);
 });
 */

function onSuccessContactsList(contacts) {
//	for (var i = 0; i < contacts.length; i++) {
//		console.log("Nom = " + contacts[i].name.familyName +
//				"\n Prenom = " + contacts[i].name.givenName +
//				"\n Telephone = " + contacts[i].phoneNumbers[0].value);
//	}
	// TODO : requete AJAX
}

// onError: Failed to get the contacts
function onErrorContactsList(contactError) {
	alert('onError!');
}

var app = {
	// Application Constructor
	initialize: function () {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},
	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function () {
        console.log("console.log works well");
        // action_add (id pour s'inscrire avec le formulaire) (soumission)
        // inscription
        $("#action_add").bind("submit", inscription);
        // Redirection vers la page d'inscription
        $("#redirec_register").bind("click", redirecRegister);
        //Bouton connexion
        $("#connect").bind("submit",connection);
        // Rediriger vers la page de connexion
        $("#connect_page").bind("click", redirectConnect);
        // Retourner a la page de connexion apres creation de compte
        $("#redirect_regis").bind("click", redirectConnect);
        
        enableChat();
    }

};
app.initialize();
