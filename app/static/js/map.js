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
fetchErosionHotspotsData();
async function fetchErosionHotspotsData() {
    try {
        const response = await fetch("/app/data/processed/erosion_hotspots_geojson.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch resource");
        } 

        const data = await response.json();
        
        L.geoJSON(data, {
            style: layerStyle.default,
            onEachFeature: function(feature, layer) {
                layer.on('click', function(){
                    this.setStyle(layerStyle.highlighted)
                })
                layer.on('mouseover', function(){
                    this.setStyle(layerStyle.selection)
                })
                layer.on('mouseout', function(){
                    this.setStyle(layerStyle.default)
                })
            }
        }).addTo(map)
        
    }
    catch(error){
        console.error(error);
    }
}

var layerStyle = {
    'default': {
        'color': 'purple',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'highlighted': {
        'color': 'blue',
        'fillOpacity': 0.4,
        'weight': 2
    },
    'selection': {
        'color': 'yellow',
        'fillOpacity': 0.4,
        'weight': 2
    }
}