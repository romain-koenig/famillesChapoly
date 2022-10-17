(async () => {

	// This API Key is READONLY, on public data, this is under control	
	const API_KEY = 'keygc919YSkuyLBXY';
	const BASE_ID = 'appJLByrgwxjO9ADR';
	const VILLES_TABLE_ID = 'tblZs4HsbaPdXLVvK';

	const GENERAL_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	const FRENCH_LAYER = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';

	//Map initialization
	// TODO : to be changed by a variable in AIRTABLE
	var map = L.map('map').setView([45.8148, 4.7907], 11);

	// TODO : maybe the choice can be made in Airtable ???
	// Choosing a layer (general layer or french layer) and general options
	L.tileLayer(GENERAL_LAYER, {
		minZoom: 10,
		maxZoom: 13,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	//Chapoly ICON & tooltip
	// TODO : to be stored in Airtable ?

	const iconsize = 40;

	var chapolyIcon = L.icon({
		iconUrl: './pics/cropped-logo-sanstypo.png',
		iconSize: [iconsize, iconsize], // size of the icon
		iconAnchor: [iconsize / 2, iconsize / 2], // point of the icon which will correspond to marker's location
		popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
	});

	var marker = L.marker([45.76963, 4.74082], { icon: chapolyIcon }).bindPopup('École du Chapoly').addTo(map);


	// Building town layers, computed from JS

	const headers = new Headers();

	headers.append('Content-Type', 'application/json');
	headers.append('Authorization', `Bearer ${API_KEY}`);

	var Airtable = require('airtable');

	var base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

	const villes = [];


	async function getData() {
		console.log("GETTING DATA FROM THE DATABASE");
		const cities = await base(VILLES_TABLE_ID).select().all();

		cities.forEach(async function (city) {

			console.log('Retrieved with GetData', city.get('Ville'));

			let new_ville = {};

			new_ville.ID = city.get('ID');
			new_ville.Label = city.get('Ville');

			const url = city.get('GEOJSON')[0].url;
			console.log(url);

			new_ville.GEOJSON = await fetch(url, {
				method: 'GET',
			}).then(response => response.json());

			new_ville.Familles = city.get('Familles');

			villes.push(new_ville);
		});

		return villes;
	}

	getData()
		.then((res) => console.log("DONE: ", res))
		.catch((err) => { console.log("ERR: ", err) });




	console.log(`Nombre de villes : ${villes.length}`);

	console.log(villes);

	console.log("2");

	villes.forEach(ville => {
		console.log(ville);
	});

	console.log("3");

	for (const ville in villes) {

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




	// for (const ville in Familles) {
	// 	if (Object.hasOwnProperty.call(Familles, ville)) {
	// 		const nb_familles = Familles[ville];
	// 		L.geoJSON(eval(ville),
	// 			{
	// 				color: 'black',
	// 				fillColor: Couleurs[nb_familles],
	// 				fillOpacity: 0.5
	// 			})
	// 			.bindPopup(`${ville} - ${nb_familles} famille${nb_familles > 1 ? "s" : ""}`)
	// 			.addTo(map);
	// 	}
	// }


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


})();


