var map = L.map('map').setView([45.8148, 4.7907], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



//Chapoly
var marker = L.marker([45.76963, 4.74082]).addTo(map);

for (const ville in Familles) {
	if (Object.hasOwnProperty.call(Familles, ville)) {
		const couleur = Familles[ville];
		L.geoJSON(eval(ville),
			{
				color: 'black',
				fillColor: Couleurs[couleur],
				fillOpacity: 0.5
			}).addTo(map);
	}
}


let legende = "";

for (const valeur in Couleurs) {
	if (Object.hasOwnProperty.call(Couleurs, valeur)) {
		const element = Couleurs[valeur];

		console.log(element);
		legende += "<li>" + valeur.toString() + " - " + element + "</li>";

	}
}
legende = "<ul>" + legende + "</ul>";
console.log(legende);
document.getElementById("legende").innerHTML = legende
