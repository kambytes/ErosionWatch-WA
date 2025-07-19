var map = L.map('map').setView([-25.0, 122.0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var erosionHotspotsLayer = L.layerGroup();
var coastalInfraDOT18Layer = L.layerGroup();
var coastalInfraDOT19Layer = L.layerGroup();
var coastalInfraDOT20Layer = L.layerGroup();

var overlayMaps = {
    "Coastal Erosion Hotspots": erosionHotspotsLayer,
    "Coastal Infrastructures (DOT-18)": coastalInfraDOT18Layer,
    /* "Coastal Infrastructures (DOT-19)": coastalInfraDOT19Layer,*/
    "Coastal Infrastructures (DOT-20)":coastalInfraDOT20Layer
};

var layerControl = L.control.layers(null, overlayMaps).addTo(map);

// A tracker to prevent duplicate fetching
let erosionHotspotsLoaded = false;
let coastalInfraDOT18Loaded = false;
/* let coastalInfraDOT19Loaded = false; */
let coastalInfraDOT20Loaded = false;

map.addEventListener('overlayadd', function(event) {
    if (event.name === "Coastal Erosion Hotspots" && !erosionHotspotsLoaded) {
        fetchErosionHotspotsData();
    }
    if (event.name === "Coastal Infrastructures (DOT-18)" && !coastalInfraDOT18Loaded) {
        fetchInfrasDOT18Data();
    }
    if (event.name === "Coastal Infrastructures (DOT-20)" && !coastalInfraDOT20Loaded) {
        fetchInfraDOT20Data();
    }
});

async function fetchErosionHotspotsData() {
    try {
        const response = await fetch("/app/data/processed/erosion_hotspots_geojson.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch Erosion Hotspots");
        } 

        const data = await response.json();
        
        const geoLayer = L.geoJSON(data, {
            style: layerStyle.default,
            onEachFeature: function(feature, layer) {
                const props = feature.properties || {};

                // Determine color based on priority
                let priorityColor = 'grey';
                if (props.MANAG_IMPO === "High") priorityColor = 'red';
                else if (props.MANAG_IMPO === "Medium") priorityColor = 'orange';
                else if (props.MANAG_IMPO === "Low") priorityColor = 'green';

                // Construct popup content
                const popupContent = `
                    <strong>${props.HOTSPOT_NA || "Unnamed Hotspot"}</strong><br>
                    <strong>Local Council:</strong> ${props.LOCAL_COAS || "Unknown"}<br>
                    <strong>Priority:</strong> 
                    <span style="color:${priorityColor}; font-weight:600">${props.MANAG_IMPO || "N/A"}</span>
                `;

                layer.bindPopup(popupContent);

                // Interactivity
                layer.on('click', function () {
                    this.setStyle(layerStyle.selection);
                    this.openPopup();
                });
                layer.on('mouseover', function () {
                    this.setStyle(layerStyle.highlighted);
                });
                layer.on('mouseout', function () {
                    this.setStyle(layerStyle.default);
                });
            }
        });


        erosionHotspotsLayer.addLayer(geoLayer);
        erosionHotspotsLoaded = true;

        console.log("Erosion Hotspots polygons added")
    } catch (error) {
        console.log("Error loading Erosion Hotspots:", error);
    };
}

async function fetchInfrasDOT18Data() {
    try {
        const response = await fetch("/app/data/processed/coastal_infrastructure_DOT_018.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DOT-018");
        }

        const data = await response.json();

        const geoLayer = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                return L.circleMarker(latlng, layerStyle.dot18);
            },
            onEachFeature: function(feature, layer) {
                const props = feature.properties || {};
                const desc = props.assetdesc || "No description";
                const lga = props.lga || "Unknown area";

                layer.bindPopup(`<strong>Asset:</strong> ${desc}<br><strong>LGA:</strong> ${lga}`);
            }
        });

        coastalInfraDOT18Layer.addLayer(geoLayer);
        coastalInfraDOT18Loaded = true;

        console.log("DOT-018 polygons added")
    } catch (error) {
        console.error("Error loading DOT-018:", error);
    }
}

async function fetchInfraDOT20Data() {
    try {
        const response = await fetch("/app/data/processed/coastal_infrastructure_DOT-020.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DOT-020");
        }

        const data = await response.json();

        const geoLayer = L.geoJSON(data, {
            style: function(feature) {
                const group = feature.properties.assetgroup || "OTHER";
                return {
                color: getAssetGroupColor(group),
                weight: 2,
                opacity: 1,
                fillOpacity: 0.5
                };
            },
            onEachFeature: function(feature, layer) {
                const props = feature.properties || {};
                const structype = props.structype || "Unknown";
                const assetgroup = props.assetgroup || "N/A";
                const editDate = props.EditDate_txt || "No date";

                layer.bindPopup(
                `<strong>Structure Type:</strong> ${structype}<br>` +
                `<strong>Asset Group:</strong> ${assetgroup}<br>` +
                `<strong>Edit Date:</strong> ${editDate}`
                );
            }
        });

        coastalInfraDOT20Layer.addLayer(geoLayer);
        coastalInfraDOT20Loaded = true;

        console.log("DOT-020 polygons added");
    } catch (error) {
        console.error("Error loading DOT-020:", error);
    }
}

async function fetchDEACoastlinesShorelinesData() {
    try {
        const response = await fetch("/app/data/processed/dea_coastlines_shorelines.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DEA Shorelines");
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
        console.log("Error loading DEA Shorelines:", error);
    };
}

async function fetchDEACoastlinesRatesData() {
    try {
        const response = await fetch("/app/data/processed/dea_coastlines_rates.geojson");
        if (!response.ok) {
            throw new Error("Unable to fetch DEA Rates of Change");
        } 

        const data = await response.json();
        
    L.geoJSON(data, {
      style: layerStyle.default,
      onEachFeature: function(feature, layer) {
        const props = feature.properties;
        // Popup fallback
        const popupText = props.HOTSPOTS_NA || `Rate: ${props.rate_time || 'N/A'}`;
        layer.bindPopup(popupText);

        layer.on('click', function() {
          this.setStyle(layerStyle.selection);
          this.openPopup();
        });
        layer.on('mouseover', function() {
          this.setStyle(layerStyle.highlighted);
        });
        layer.on('mouseout', function() {
          this.setStyle(layerStyle.default);
        });
      }
    }).addTo(map);
        
    } catch (error) {
        console.log("Error loading DEA Rates of Change:", error);
    };
}

const layerStyle = {
  default: {
    color: "#2c6bed",       // Your main theme blue
    fillOpacity: 0.4,
    weight: 2
  },
  highlighted: {
    color: "#ffaa00",       // Warm highlight (golden sand tone)
    fillOpacity: 0.5,
    weight: 3
  },
  selection: {
    color: "#ffcc00",       // Bright yellow for clicked
    fillOpacity: 0.6,
    weight: 3
  },
  dot18: {
    radius: 6,
    fillColor: "orange",
    color: "darkorange",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
};

function getAssetGroupColor(group) {
  const colors = {
    "LD": "#f4a259",   // Sandy orange – Land-based
    "BL": "#7b9acc",   // Steel blue – Buildings
    "CS": "#2c6bed",   // Your theme – Coastal structures
    "MS": "#76c893",   // Aqua green – Maritime
    "LF": "#ffe156",   // Yellow – Launch Facilities
    "MR": "#915c83",   // Mauve – Marinas
    "SV": "#aaaaaa",   // Grey – Services
    "SWL": "#60a3bc",  // Teal – Seawalls
    "OTHER": "#cccccc"
  };
  return colors[group] || colors["OTHER"];
}