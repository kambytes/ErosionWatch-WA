import geopandas as gpd

# Specify bounding box. Entire WA coastal bounding box approx
ymax, xmin = -33.65, 115.28
ymin, xmax = -33.66, 115.30

# Set up WFS requests for annual shorelines & rates of change points
deacl_annualshorelines_wfs = (
    f"https://nonprod.geoserver.dea.ga.gov.au/geoserver/dea/wfs?"
    f"service=WFS&version=1.1.0&request=GetFeature"
    f"&typeName=dea:shorelines_annual&maxFeatures=1000"
    f"&bbox={ymin},{xmin},{ymax},{xmax},"
    f"urn:ogc:def:crs:EPSG:4326"
)
deacl_ratesofchange_wfs = (
    f"https://nonprod.geoserver.dea.ga.gov.au/geoserver/dea/wfs?"
    f"service=WFS&version=1.1.0&request=GetFeature"
    f"&typeName=dea:rates_of_change&maxFeatures=1000"
    f"&bbox={ymin},{xmin},{ymax},{xmax},"
    f"urn:ogc:def:crs:EPSG:4326"
)

# Load DEA Coastlines data from WFS using geopandas
deacl_annualshorelines_gdf = gpd.read_file(deacl_annualshorelines_wfs)
deacl_ratesofchange_gdf = gpd.read_file(deacl_ratesofchange_wfs)

# Ensure CRSs are set correctly
deacl_annualshorelines_gdf.crs = "EPSG:3577"
deacl_ratesofchange_gdf.crs = "EPSG:3577"

# Optional: Keep only statistically significant (p <= 0.01) rates of change points
# with "good" certainty (i.e. no poor quality flags)
deacl_ratesofchange_gdf = deacl_ratesofchange_gdf.query(
    "(sig_time <= 0.01) & (certainty == 'good')"
)

deacl_annualshorelines_gdf.to_file("../data/processed/shorelines.geojson", driver="GeoJSON")
deacl_ratesofchange_gdf.to_file("../data/processed/rates.geojson", driver="GeoJSON")