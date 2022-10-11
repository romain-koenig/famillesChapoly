
//Map initialization
var map = L.map('map').setView([45.8148, 4.7907], 11);

// Choosing a layer (french layer) and general options
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	minZoom: 10,
	maxZoom: 13,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Chapoly ICON & tooltip

const iconsize = 40;

var chapolyIcon = L.icon({
	iconUrl: './pics/cropped-logo-sanstypo.png',
	iconSize: [iconsize, iconsize], // size of the icon
	iconAnchor: [iconsize / 2, iconsize / 2], // point of the icon which will correspond to marker's location
	popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

var marker = L.marker([45.76963, 4.74082], { icon: chapolyIcon }).bindPopup('École du Chapoly').addTo(map);


// Building town layers, computed from JS

for (const ville in Familles) {
	if (Object.hasOwnProperty.call(Familles, ville)) {
		const nb_familles = Familles[ville];
		L.geoJSON(eval(ville),
			{
				color: 'black',
				fillColor: Couleurs[nb_familles],
				fillOpacity: 0.5
			})
			.bindPopup(`${ville} - ${nb_familles} famille${nb_familles > 1 ? "s" : ""}`)
			.addTo(map);
	}
}


// Computing the table at the end
// Could be refactored / kept as is for readability

let tableContent = "";

for (const ville in Familles) {
	if (Object.hasOwnProperty.call(Familles, ville)) {
		const element = Familles[ville];

		tableContent = tableContent + `
				<tr>
					<td>${ville}</td>
					<td>${element}</td>
				</tr>
		`;

	}
}

document.getElementById("tableContent").innerHTML = tableContent
