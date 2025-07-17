var map = L.map('map').setView([-25.0, 122.0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

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
                const props = feature.properties;
                layer.bindPopup(props.HOTSPOTS_NA);
                layer.on('click', function(){
                    this.setStyle(layerStyle.selection)
                    this.openPopup();
                })
                layer.on('mouseover', function(){
                    this.setStyle(layerStyle.highlighted)
                })
                layer.on('mouseout', function(){
                    this.setStyle(layerStyle.default)
                })
            }
        }).addTo(map)
        
    } catch (error) {
        console.log("There was an error loading GeoJSON:", error);
    };
}

async function fetchInfrasDOT18Data() {
    try {
        const response = await fetch("/app/data/processed/coastal_infrastructure_DOT_018.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DOT-018");
        }
        
        const data = await response.json();

        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, infraStyles.dot018.default);
            },
            onEachFeature: function(feature, layer) {
                const props = feature.properties;
                const name = props?.ASSET_NAME || "Unknown asset";
                layer.bindPopup(`<strong>DOT-018</strong><br>${name}`);
            }
        }).addTo(map);
    } catch (err) {
        console.error("Error loading DOT-018:", err);
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