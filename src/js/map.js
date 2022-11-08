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

	// const AirtableAPIURL = `https://api.airtable.com/v0/${BASE_ID}/${VILLES_TABLE_ID}?maxRecords=100&view=WEB`;

	const raw_Local_data = await (fetch('./data/villes.json')
	).then(response => response.json());

	console.log(raw_Local_data);

	getData(raw_Local_data)
		.then(async (villes) => {
			console.log(villes);
			const Couleurs = await getCouleurs();
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

		console.log(ville.GEOJSON)

		L.geoJSON(JSON.parse(ville.GEOJSON),
			{
				color: 'black',
				fillColor: couleur,
				fillOpacity: 0.5
			})
			.bindPopup(`${ville.Label} - ${nb_familles} enfant${nb_familles > 1 ? "s" : ""} scolarisé${nb_familles > 1 ? "s" : ""} à l'École du Chapoly`)
			.addTo(map);

	}
}

async function getData(jsonData) {

	const villes = [];

	jsonData.records.forEach(function (city) {
		// console.log('Retrieved with GetData', city.get('Ville'));

		let new_ville = {};

		new_ville.ID = city.fields.ID;
		new_ville.Label = city.fields.Ville;

		new_ville.GEOJSON = city.fields.GEOJSON;

		new_ville.Familles = city.fields.Familles;

		villes.push(new_ville);
	});

	return villes.filter(ville => ville.Familles > 0);
}

async function getCouleurs(base) {

	const Couleurs = [
		"#000000",
		"#E3E3C8",
		"#C2CFA1",
		"#95BB7A",
		"#5DA753",
		"#5C9D4B",
		"#5B9343",
		"#59883B",
		"#577D34",
		"#54712D",
		"#506627",
	];

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

	const totalFamilles = res.reduce((prev, current) => {
		return prev + current.Familles;
	}, 0);

	document.getElementById("tableFooter").innerHTML = `
	<tr>
		<td>Total</td>
		<td>${totalFamilles}</td>
	</tr>
`;

	return res;
}
