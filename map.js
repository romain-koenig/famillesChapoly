var map = L.map('map').setView([45.8148, 4.7907], 11);

L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const iconsize = 40;

var chapolyIcon = L.icon({
	iconUrl: './pics/cropped-logo-sanstypo.png',
	iconSize: [iconsize, iconsize], // size of the icon
	iconAnchor: [iconsize / 2, iconsize / 2], // point of the icon which will correspond to marker's location
	popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
});

console.log(chapolyIcon);


//Chapoly
var marker = L.marker([45.76963, 4.74082], { icon: chapolyIcon }).bindPopup('École du Chapoly').addTo(map);


for (const ville in Familles) {
	if (Object.hasOwnProperty.call(Familles, ville)) {
		const nb_familles = Familles[ville];
		L.geoJSON(eval(ville),
			{
				color: 'black',
				fillColor: Couleurs[nb_familles],
				fillOpacity: 0.5
			})
			.bindPopup(`${ville} - ${nb_familles}`)
			.addTo(map);
	}
}


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

console.log(tableContent);

document.getElementById("tableContent").innerHTML = tableContent
