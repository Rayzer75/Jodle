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

var serverUrl = 'http://129.88.242.123:8080/';
var storage = window.localStorage;
//storage.clear();
var lastKey = storage.length;
//var socket = io.connect(serverUrl);
var socket;
// On conserve en variable globale le telephone et la position de l'utilisateur qui
// se connecte
var telephoneGlob;
var longitudeGlob;
var latitudeGlob;
var USER_INFO;
var DISTANCE = null;

/**
 * Permet de rediriger vers la page de connexion si celle-ci echoue. Nous avons choisi
 * de na pas utiliser mustache avant la connexion.
 */
function redirectConnect() {
	window.location.href = 'index.html';
}

/**
 * Fonction qui gère la connection à un compte utilisateur. Lors de la connexion, 
 * Un appel est fait pour afficher le menu et mettre à jour la postion de l'utilisateur
 * qui se connecte.
 * @param {type} e
 */
function connection(e) {
    // Garde le numero de telephone pour supprimer
    telephoneGlob = e.target.telephone.value;
    USER_INFO = $(this).serialize();
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'GET',
        data: $(this).serialize(),
        contentType: 'application/x-www-form-urlencoded',
        success: function (code, statut) {
            showMenu(); // Affiche le menu si la connexion reussie
            // cherche et met à jour dans la base de données la position de l'utilisateur,
            // qui se connecte
            navigator.geolocation.getCurrentPosition(sendLocation, errorLocation,
            {timeout: 10000}, {enableHighAccuracy: true});
        },
        error: function (code, statut) {
            // Renvoie les pages d'erreurs si la connexion echoue
            $('#content').empty().html(code); // content permet de vider et de modifier
            // les pages html avec les mustaches.
            $("#connect_page").bind("click", redirectConnect);
        }
    });
    e.preventDefault();
}

/**
 * Cette fonction affiche le menu qui sera afficher quand l(utilisateur se connecte.
 */
function showMenu() {
    $.get(serverUrl + 'api/user/', USER_INFO, function (code, statut) {
        $('#content').empty().html(code);
        $("#connect_page").bind("click", redirectConnect);
        // contient les boutons du menu
        bindButton();
        // Lorsqu'on affiche le menu, on affiche aussi la liste des contacts selon
        // leur disponibilité
        getContactsList();
    });

}

// https://www.dataiku.com/learn/guide/other/geo/convert-coordinates-with-PostGIS.html
// http://www.postgis.org/docs/ST_Distance.html
/**
 * Fonction pour obtenir la latitude et la longitude de la personne
 * @param {type} position
 */ 
function sendLocation(position) {
	latitudeGlob = position.coords.latitude;
	longitudeGlob = position.coords.longitude;
	
    // Met a jour sa position à chaque connexion à l'application
    updatePosition();

}

/**
 * 2. position unavailable
 *  3. time out
 * Fonction qui renvoie le type d'erreur de la recherche de position
 * @param {type} error
 */
function errorLocation(error) {
    if (error.code == error.PERMISSION_DENIED) {
        console.log("you denied me :-(");
    } else {
        console.log(error.code);
    }
}

/**
 * Met à jour dans la base de données la position de l'utilisateur qui se connecte.?
 */
function updatePosition() {
	console.log(telephoneGlob);
	console.log(longitudeGlob);
	$.ajax({
		url: serverUrl + 'api/user/pos/',
		type: 'PUT',
		data: {
			"telephoneG": telephoneGlob,
			"longitudeG": longitudeGlob,
			"latitudeG": latitudeGlob
		},
		success: function (code, statut) {
			console.log(code);
		},
		error: function (code, statut) {
			console.log(code);
		}
	});
}


/**
 * Fonction qui fait une requête ajax pour inscrire un nouvel utilisateur.
 */
function inscription() {
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'POST',
        data: $(this).serialize(),
        contentType: 'application/x-www-form-urlencoded',
        success: function (code, statut) {
            // Redirige vers la page de confirmation
            window.location.href = 'registerVal.html';
        },
        error: function (code, statut) {
            // Envoie une erreur si l'inscription n'est pas possible
            window.location.href = 'errorPseudo.html';
        }
    });

}

/**
 * Cherche les contacts de l'utilisateur dans son telephone. La fonction onSuccess comparera
 * avec la base de données pour afficher ses contacts dans l'application
 */
function getContactsList() {
	var options = new ContactFindOptions();
	options.filter = "";
	options.multiple = true;
	options.hasPhoneNumber = true;
	filter = ["name", "phoneNumbers"];
	navigator.contacts.find(filter, onSuccessContactsList, onErrorContactsList, options);
}

/**
 * Redirige vers la page d'inscription
 */
function redirecRegister() {
	window.location.href = 'register.html';
}

/**
 * Active le chat
 */
function enableChat() {
	socket = io.connect(serverUrl);
	var emit = telephoneGlob;
	var dest = $('#dest').text();
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
					data: srcData,
					emit: emit,
					dest: dest,
					room: getRoom(emit, dest)
				}
				);
			};
			fileReader.readAsDataURL(fileToLoad);
		}
	});
	$('#chat').submit(function (e) {
		e.preventDefault();
		socket.emit('chat message', {sender: $('#myPseudo').text(),
			type: 'text',
			data: $('#m').val(),
			emit: $('#emit').text(),
			dest: $('#dest').text(),
			room: getRoom($('#dest').text(), $('#emit').text())
		});
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
	socket.on('server message', function (msg) {
		var message = buildMessage(msg.sender, msg.type, msg.data);
		$('#messages').append(message);
		$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
	});
	socket.emit('room', getRoom(emit, dest));
	// le destinataire a-t-il émis des messages ?
	socket.emit('is connected', {emit: $('#dest').text(), dest: $('#emit').text(), sender: $('#otherPseudo').text(), room: getRoom(emit, dest)});
	socket.on('new message', function (msg) {
		var message = buildMessage(msg.sender, msg.type, msg.data);
		lastKey++;
		storage.setItem(lastKey, msg.sender + '-' + msg.type + '-' + msg.data);
		$('#messages').append(message);
		$('#messages').animate({scrollTop: $('#messages').prop("scrollHeight")}, 500);
	});
}

// le nom d'une room est de la forme 'TEL1-TEL2' où TEL1 < TEL2
function getRoom(dest, emit) {
	var room;
	if (dest < emit) {
		room = dest + '-' + emit;
	} else {
		room = emit + '-' + dest;
	}
	return room;
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
			media.style.maxWidth = '100%';
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
			media.style.maxWidth = '100%';
			message.append(media);
			break;
	}
	return message;
}

/**
 * Permet juste de faire des tests sur chrome, le laisser activer avec l'emulateur
 * peut creer des redondances
 */
 $("document").ready(function () {
//    getPreviousMessages();
//    enableChat();
//    $("#action_add").bind("submit", inscription);
//    $("#redirec_register").bind("click", redirecRegister);
//    $("#contacts_list").bind("click", onSuccessContactsList);
//    $("#connect").bind("submit", connection);
//    $("#connect_page").bind("click", redirectConnect);
//    $("#redirec_reg").bind("click", redirecRegister);
    $("#redirect_con").bind("click", redirectConnect);
//    $("#param").bind("click", showParam);
//    $("#delete").bind("click", delete_account);
//    $("#deconnecter").bind("click", redirectConnect);
//    $("#redirect_regis").bind("click", redirectConnect);
//    $("#profil").bind("click", showProfil);
//	$("#contacts_list").bind("click", showMenu);
 });


/**
 * Permet de comparer les contacts du telephone et la base de données. Puis affiche
 * selon la distance les contacts de l'utilisateurs
 * @param {type} contacts
 */
function onSuccessContactsList(contacts) {
//	for (var i = 0; i < contacts.length; i++) {
	for (var i = contacts.length-1; i > contacts.length-5; i--) { // pour les besoins de la démo
		var phoneNumber = phoneNumberParser(contacts[i].phoneNumbers[0].value);
		console.log(phoneNumber);
		// Calcule la distance entre l'utilisateur et ses contacts
		$.when(
//                getPosition(phoneNumber)
//                ).then(
				$.get(serverUrl + 'api/user/contacts/' + phoneNumber, function (data) {

					$('#contacts-dispo').after(data);

				})
				).then(
				$.get(serverUrl + 'api/user/' + phoneNumber, function (data) {
					var room = getRoom(telephoneGlob, data.telephone);
					$('#' + room).click(data, showChat);
				}));
	}
}

/**
 * Fonction qui permet d'afficher le chat
 * @param {type} e
 */
function showChat(e) {
	data = e.data;
	console.log("chat data : " + data.telephone);
	console.log("chat data : " + data.pseudo);
	$.get(serverUrl + 'api/chat/', data, function (data) {
		$('#content').empty().html(data);
		enableChat();
		getPreviousMessages();
		$("#contacts_list").bind("click", showMenu);
	});
}

/**
 * permet d'éliminer le formattage américain des numéros de tel
 * @param {type} telephone
 * @returns {undefined}
 * 
 */
function phoneNumberParser(originalPhoneNumber) {
	var phoneNumber = originalPhoneNumber;
	// supprime tous les ' ', '-', '(', ')'
	phoneNumber = phoneNumber.replace(/ /g, '');
	phoneNumber = phoneNumber.replace(/-/g, '');
	phoneNumber = phoneNumber.replace('(', '');
	phoneNumber = phoneNumber.replace(')', '');
	return phoneNumber;
}

// onError: Failed to get the contacts
function onErrorContactsList(contactError) {
	alert('onError!');
}

/**
 * Fait une requête ajax pour supprimer un compte
 * @param {type} e
 */
function delete_account(e) {
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'DELETE',
        data: {
            "telephone": telephoneGlob
        },
        success: function (code, statut) {
            redirectConnect();
        },
        error: function (code, statut) {
            console.log(code);
        }
    });
    e.preventDefault();
}

/**
 * Permet de mettre à jour le compte de l'utilisateur
 */
function update_account() {
    $.ajax({
        url: serverUrl + 'api/user/',
        type: 'PUT',
        data: {
            "ancien_tel": telephoneGlob,
            "telephone": e.target.telephone.value,
            "pseudo": e.target.pseudo.value,
            "mdp": e.target.mdp.value
        },
        success: function (code, statut) {
            redirectConnect();
        },
        error: function (code, statut) {
            console.log(code);
        }
    });
}

/**
 * Permet d'afficher les parametres du compte de l'utilisateur
 */
function showParam() {
	$.ajax({
		url: serverUrl + 'api/parameters/',
		type: 'GET',
		success: function (code, statut) {
			$('#content').empty().html(code);
			// Bouton de deconnexion
			$("#deconnecter").bind("click", redirectConnect);
			// Supprimer Compter
			$("#delete").bind("click", delete_account);
			// Mettre à jour le compte
			$("#update").bind("submit", update_account);
			bindButton();
		},
		error: function (code, statut) {
			console.log(code);

		}
	});

}

/**
 * Affiche le menu
 */
function showIndex() {
	$.ajax({
		url: serverUrl + 'api/menu/',
		type: 'GET',
		success: function (code, statut) {
			$('#content').empty().html(code);
			bindButton();
		},
		error: function (code, statut) {
			console.log(code);
		}
	});
}

/**
 * Affiche le profil de l'utilisateur
 */
function showProfil() {
    $.ajax({
        url: serverUrl + 'api/profil/',
        type: 'GET',
        data: {
            "telephone": telephoneGlob
        },
        success: function (code, statut) {
            // TODO : faire une présentation html
            $('#content').empty().html(code);
            bindButton();
        },
        error: function (code, statut) {
            console.log(code);
        }
    });
}

/**
 * Retourne la position : la longitude et la latitude d'une personne
 * La position fait appel à getDIstance
 * @param {type} telephone
 */
function getPosition(telephone) {
	var longitude;
	var latitude;
	$.when(
			$.ajax({
				url: serverUrl + 'api/user/pos/' + telephone,
				type: 'GET',
				success: function (code, statut) {
					// return latitude et longitude

					longitude = code.longitude;
					latitude = code.latitude;
					console.log(code);
//            getDistance(longitudeGlob, latitudeGlob, code.longitude, code.latitude);
				},
				error: function (code, statut) {
					console.log(code);
				}
			})
			).then(
			getDistance(longitudeGlob, latitudeGlob, longitude, latitude)
			)
}

/**
 * Fonction qui retourne la distance entre l'utilisateur et un de ses contacts
 * @param {type} longitude de l'utilisateur
 * @param {type} latitude de l'utilisatuer
 */
function getDistance(longitude, latitude, longitudeContact, latitudeContact) {
	console.log("RENTRE");
	$.ajax({
		url: serverUrl + 'api/user/pos/',
		type: 'GET',
		data: {
			"longitude": longitude,
			"latitude": latitude,
			"longitudeContact": longitudeContact,
			"latitudeContact": latitudeContact
		},
		success: function (code, statut) {
			// la distance entre 2 utilisateurs
			console.log(code.dist);
			DISTANCE = code.dist;
		},
		error: function (code, statut) {
			console.log(code);
		}
	});
}

// Avoir les boutons du menu fonctionnel (A appeler)
function bindButton() {
	$("#param").bind("click", showParam);
	$("#accueil").bind("click", showMenu);
	$("#profil").bind("click", showProfil);

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
//        getPreviousMessages();
//        enableChat();
		// Retourner la page des paramètres
		//$("#param").bind("click", showParam);
		// Boutton de deconnexion
		$("#deconnect").bind("click", redirectConnect);
	}

};
app.initialize();
