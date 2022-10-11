var map = L.map('map').setView([45.76938, 4.74056], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var marker = L.marker([45.76963, 4.74082]).addTo(map);

for (const ville in Familles) {
	if (Object.hasOwnProperty.call(Familles, ville)) {

		console.log(ville);

		const element = Familles[ville];
		console.log(element);

		L.geoJSON(eval(ville),
			{
				color: Couleurs[element],
				fillOpacity: 0.5
			}).addTo(map);
	}
}



L.geoJSON(Bully,
	{
		color: Couleurs[Familles.Bully],
		fillOpacity: 0.5
	}).addTo(map);

L.geoJSON(Cailloux_sur_Fontaines,
	{
		color: Couleurs[Familles.Cailloux_sur_Fontaines],
		fillOpacity: 0.5
	}).addTo(map);
