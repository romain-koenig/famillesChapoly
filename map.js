// This API Key is READONLY, on public data, this is under control	
const API_KEY = 'keygc919YSkuyLBXY';
const BASE_ID = 'appJLByrgwxjO9ADR';
const VILLES_TABLE_ID = 'tblZs4HsbaPdXLVvK';
const COULEURS_TABLE_ID = 'tblqmZUsEImqeIl9D';

const GENERAL_LAYER = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const FRENCH_LAYER = 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png';

//Map initialization
// TODO : to be changed by a variable in AIRTABLE
var map = L.map('map').setView([45.8148, 4.7907], 11);


(async () => {

	// TODO : maybe the choice can be made in Airtable ???
	// Choosing a layer (general layer or french layer) and general options
	L.tileLayer(FRENCH_LAYER, {
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


	getData(base)
		.then(async (villes) => {
			return await getGEOJSONData(villes, map);
		})
		.then(async (villes) => {
			const Couleurs = await getCouleurs(base);
			addToMap(villes, Couleurs);
			return villes;
		})
		.then((villes) => {
			setTableauNbFamilles(villes);
			return villes;
		})
		.catch((err) => { console.log("ERR: ", err) });

})();


function addToMap(villes, Couleurs) {

	for (const ville_no in villes) {

		const ville = villes[ville_no];

		const nb_familles = ville.Familles;
		const couleur = Couleurs[nb_familles]

		L.geoJSON(ville.GEOJSON,
			{
				color: 'black',
				fillColor: couleur,
				fillOpacity: 0.5
			})
			.bindPopup(`${ville.Label} - ${nb_familles} famille${nb_familles > 1 ? "s" : ""}`)
			.addTo(map);

	}
}

async function getData(base) {

	const villes = [];

	// console.log("GETTING DATA FROM THE DATABASE");
	const cities = await base(VILLES_TABLE_ID).select().all();

	cities.forEach(function (city) {

		// console.log('Retrieved with GetData', city.get('Ville'));

		let new_ville = {};

		new_ville.ID = city.get('ID');
		new_ville.Label = city.get('Ville');

		new_ville.GEOJSONurl = city.get('GEOJSON')[0].url;

		new_ville.Familles = city.get('Familles');

		villes.push(new_ville);
	});

	return villes;
}

async function getCouleurs(base) {

	const Couleurs = [];

	const airtableColours = await base(COULEURS_TABLE_ID).select().all();

	airtableColours.forEach(function (colour) {

		let couleur = {};

		couleur.Key = colour.get('Key');
		couleur.Value = colour.get('Value');

		Couleurs[couleur.Key] = couleur.Value;

	});

	return Couleurs;
}


function setTableauNbFamilles(res) {
	let tableContent = "";

	for (const ville_no in res) {

		res = res.sort((a, b) => b.Familles - a.Familles);

		const ville = res[ville_no];

		tableContent = tableContent + `
						<tr>
							<td>${ville.Label}</td>
							<td>${ville.Familles}</td>
						</tr>
				`;

	}
	document.getElementById("tableContent").innerHTML = tableContent;
	return res;
}

async function getGEOJSONData(villes, map) {

	for await (const ville of villes) {

		//console.log("In the forEach", ville);
		const url = ville.GEOJSONurl;
		ville.GEOJSON = await fetch(url, {
			method: 'GET',
		}).then(response => response.json());
		//	console.log("End of the forEach", ville);

	}

	return villes;
}