# Projet de Cartographie des Familles du Chapoly

Lieu de résidence des familles

[![Netlify Status](https://api.netlify.com/api/v1/badges/f671bebb-8efa-460f-be30-7ae4c1a512de/deploy-status)](https://app.netlify.com/sites/chapoly/deploys)

Getting the Data through Airtable.
Read with a readonly API (aka the key is not leaked)

## Annexes

Pour référence ultérieure

Récupération des données Géographique Openstreetmap via Overpass
Clé = identifiant Wikidata des villes

On va sur <https://overpass-turbo.eu/>

On lance la requête

```
[out:json][timeout:25];
rel[wikidata="QXXXXX"];
out geom;
```

en remplacant QXXXXX par l'identifiant Wikidata de la ville

On télécharge le GEOJSON et on le met dans Airtable

Brignais - Q1647506
Bully - Q582184
Cailloux-sur-Fontaines - Q1469681
Chazay d'Azergues - Q1364520
Sarcey - Q1151735
Sourcieux-les-Mines - Q817685
Saint-Genis-Laval - Q1617150
Sainte-Foy-lès-Lyon - Q854364
Villefranche-sur-Saône - Q8365
Chaponost - Q273748
La Tour-de-Salvagny - Q4054
Pollionnay - Q581290
Saint-Pierre-la-Palud - Q1617494
Craponne - Q654273
Dardilly - Q456
Lentilly - Q1388941
Marcilly-d'Azergues - Q1388871
Charbonnières-les-Bains - Q1388635
Écully - Q1388603
Francheville - Q910089
Saint-Genis-les-Ollières - Q684659
Sainte-Consorce - Q1388829
Vaugneray - Q1445095
Grézieu-la-Varenne - Q387460
Tassin-la-Demi-Lune - Q840152
Lyon - Q208770
Saint-Didier-au-Mont-d'Or - Q1617501

Personal reminder: async await doesn't work in ForEach loops

<https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop>
