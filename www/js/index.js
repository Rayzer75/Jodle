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
//storage.clear();
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
            $('#content').empty().html(code);
            $("#param").bind("click", showParam);
        },
        error: function (code, statut) {
            $('#content').empty().html(code);
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
        success: function (code, statut) {
            window.location.href = 'registerVal.html';
        },
        error: function (code, statut) {
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
    $('#inputFileToLoad').change(function () {
        var filesSelected = document.getElementById("inputFileToLoad").files;
        if (filesSelected.length > 0) {
            var fileToLoad = filesSelected[0];
            var fileReader = new FileReader();
            fileReader.onload = function (fileLoadedEvent) {
                var srcData = fileLoadedEvent.target.result; // <--- data: base64
                var typeMedia;
                switch (fileToLoad.type.split('/')[0]) {
                    case 'image':
                        typeMedia = 'image';
                        break;
                    case 'audio':
                        typeMedia = 'audio';
                        break;
                    case 'video':
                        typeMedia = 'video';
                        break;
                    default:
                        alert("Fichier non pris en charge !");
                        break;
                }
                socket.emit('chat message', {sender: $('#myPseudo').text(),
                    type: typeMedia,
                    data: srcData
                }
                );
            };
            fileReader.readAsDataURL(fileToLoad);
        }
    });
    $('#chat').submit(function () {
        socket.emit('chat message', {sender: $('#myPseudo').text(), type: 'text', data: $('#m').val()});
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        var message = buildMessage(msg.sender, msg.type, msg.data);
        lastKey++;
        storage.setItem(lastKey, msg.sender + '-' + msg.type + '-' + msg.data);
        $('#messages').append(message);
        $('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
    });
}

function getPreviousMessages() {
    for (var i = 1; i <= lastKey; i++) {
        var array = storage.getItem(i).split('-');
        var sender = array[0];
        var type = array[1];
        var data = array[2];
        $('#messages').append(buildMessage(sender, type, data));
    }
}

function buildMessage(sender, type, data) {
    var message = $('<li class="table-view-cell">').text(sender + ' : ');
    var media;
    switch (type) {
        case 'text':
            message.text(sender + ' : ' + data);
            break;
        case 'image':
            media = document.createElement('img');
            media.src = data;
            message.append(media);
            break;
        case 'audio':
            media = document.createElement('audio');
            media.src = data;
            media.controls = 'controls';
            message.append(media);
            break;
        case 'video':
            media = document.createElement('video');
            media.src = data;
            media.controls = 'video';
            message.append(media);
            break;
    }
    return message;
}


$("document").ready(function () {
    getPreviousMessages();
    enableChat();
    $("#action_add").bind("submit", inscription);
    $("#redirec_register").bind("click", redirecRegister);
    $("#contacts_list").bind("click", onSuccessContactsList);
    $("#connect").bind("submit", connection);
//    $("#inputFileToLoad").bind("change", encodeImageFileAsURL);
    $("#connect_page").bind("click", redirectConnect);
    $("#redirec_reg").bind("click", redirecRegister);
    $("#redirect_con").bind("click", redirectConnect);
    $("#param").bind("click", showParam);
    $("#contacts_list").bind("click", getContactsList);
});


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


function encodeImageFileAsURL() {
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
        var fileToLoad = filesSelected[0];
        console.log(fileToLoad.type.split('/')[0]);
        var fileReader = new FileReader();

        fileReader.onload = function (fileLoadedEvent) {
            var srcData = fileLoadedEvent.target.result; // <--- data: base64

//        var newImage = document.createElement('img');
//        newImage.src = srcData;
            var newSound = document.createElement('audio');
            newSound.src = srcData;
            newSound.controls = 'controls';
//            var newVideo = document.createElement('video');
//            newVideo.src = srcData;
//            newVideo.controls = 'controls';

//        document.getElementById("imgTest").innerHTML = newImage.outerHTML;
            document.getElementById("imgTest").innerHTML = newSound.outerHTML;
//            document.getElementById("imgTest").innerHTML = newVideo.outerHTML;
            console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
        };
        fileReader.readAsDataURL(fileToLoad);
    }
}

function showParam(){
    $.ajax({
        url: serverUrl + 'api/parameters/',
        type: 'GET',
        success: function (code, statut) {
            $('#content').empty().html(code);
        },
        error: function(code, statut) {
            console.log(code);
        }
    });

}

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    
    onDeviceReady: function () {
        console.log("console.log works well");
        // action_add (id pour s'inscrire avec le formulaire) (soumission)
        $("#action_add").bind("submit", inscription);
        // Redirection vers la page d'inscription
        $("#redirec_register").bind("click", redirecRegister);
        $("#redirec_reg").bind("click", redirecRegister);
        //Bouton connexion
        $("#connect").bind("submit", connection);
        // Rediriger vers la page de connexion
        $("#connect_page").bind("click", redirectConnect);
        $("#redirect_con").bind("click", redirectConnect);
        // Retourner a la page de connexion apres creation de compte
        $("#redirect_regis").bind("click", redirectConnect);
        $("#contacts_list").bind("click", getContactsList);
        //getPreviousMessages();
        //enableChat();
        // Retourner la page des paramètres
        //$("#param").bind("click", showParam);
        // Boutton de deconnexion
        $("#deconnect").bind("click",redirectConnect);
    }

};
app.initialize();
