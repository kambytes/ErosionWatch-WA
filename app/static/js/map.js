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

function erosion_hotspots_overlay() {
    
}