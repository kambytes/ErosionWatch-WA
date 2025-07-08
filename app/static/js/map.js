var map = L.map('map').setView([-25.238442912749033, 121.65841803737963], 4.9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/*
1. fetch request to pull datat from /app/data/processed/coastal_erosion_geojson.geojson
2. The function will .then (if successful ... continue the map portion)
3. else .then (unsucessful... error message)
4. 
*/

fetch("/app/data/processed/erosion_hotspots_geojson.geojson")
    .then(response => {
        if(!response.ok){
            throw new Error("Unable to fetch resource");
        }
        return response.json();
    }
    .then(data => {
        L.geoJSON(data, {
            style: layerStyle.default
        }).addTo(map)

    })
    .catch(error => console.log(error));

var layerStyle = {
    'default': {
        'color': 'green',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'highlighted': {
        'color': 'blue',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'selection': {
        'color': 'brown',
        'fillOpacity': 0.4,
        'weight': 2
    }
}