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

var serverUrl = 'http://192.168.0.10:8080/';
var storage = window.localStorage;
var lastKey = storage.length;

function redirectConnect() {
    window.location.href = 'index.html';
}

function connection(e) {
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'GET',
        data: $(this).serialize(),
        contentType: 'application/x-www-form-urlencoded',
        success: function (code, statut) {
            //window.location.href = 'menu.html';
            $('#content').empty().html(code);
        },
        error: function (code_html, statut) {
            console.log(code_html);
            console.log(statut)
            //window.location.href = 'errorConnect.html';
            $('#content').empty().html(code_html);
        }
    });
    e.preventDefault();
}

function inscription(e) {
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'POST',
        data: $(this).serialize(),
        contentType: 'application/x-www-form-urlencoded',
        success: function (code_html, statut) {
            window.location.href = 'registerVal.html';
        },
        error: function (code_html, statut) {
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
    var socket = io.connect(serverUrl);
    $('#chat').submit(function () {
        socket.emit('chat message', $('#myPseudo').text() + ' : ' + $('#m').val()); // TODO : concatener le pseudo
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        var message = $('<li class="table-view-cell">').text(msg);
        $('#messages').append(message);
        lastKey++;
        storage.setItem(lastKey, msg);
        $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
    });
}

function getPreviousMessages() {
    for (var i = 1; i <= lastKey; i++) {
        $('#messages').append($('<li class="table-view-cell">').text(storage.getItem(i)));
    }
}

/*
$("document").ready(function () {
    getPreviousMessages();
    enableChat();
    $("#action_add").bind("submit", inscription);
    $("#redirec_register").bind("click", redirecRegister);
    $("#contacts_list").bind("click", onSuccessContactsList);
    $("#connect").bind("submit", connection);
});
*/

function onSuccessContactsList(contacts) {
//	for (var i = 0; i < contacts.length; i++) {
//		console.log("Nom = " + contacts[i].name.familyName +
//				"\n Prenom = " + contacts[i].name.givenName +
//				"\n Telephone = " + contacts[i].phoneNumbers[0].value);
//	}
    // TODO : requete AJAX
    //window.location.href = 'contact.html';
    $.get(serverUrl + 'api/contacts/', function (data) {
        $('#content').empty().html(data);
    });
    for (var i = 0; i < contacts.length; i++) {
        var phoneNumber = '\'' + phoneNumberParser(contacts[i].phoneNumbers[0].value) + '\'';
        console.log(phoneNumber);
        $.get(serverUrl + 'api/user/contacts/' + phoneNumber, function (data) {
            $('#contacts-dispo').after(data);
        });

    }
}

// permet d'éliminer le formattage américain des numéros de tel
function phoneNumberParser(originalPhoneNumber) {
    var phoneNumber = '';
    // supresssion des espaces
    var tmp = originalPhoneNumber.split(' ');
    for (var i = 0; i < tmp.length; i++) {
        phoneNumber += tmp[i];
    }
    // suppression des '-'
    tmp = phoneNumber.split('-');
    phoneNumber = '';
    for (var i = 0; i < tmp.length; i++) {
        phoneNumber += tmp[i];
    }
    return phoneNumber;
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
        $("#connect").bind("submit", connection);
        // Rediriger vers la page de connexion
        $("#connect_page").bind("click", redirectConnect);
        // Retourner a la page de connexion apres creation de compte
        $("#redirect_regis").bind("click", redirectConnect);
        $("#contacts_list").bind("click", getContactsList);
        //getPreviousMessages();
        //enableChat();
    }

};
app.initialize();
