import geopandas as gpd

# Specify bounding box. Entire WA coastal bounding box approx
ymax, xmin = -13.5, 112.0
ymin, xmax = -35.0, 129.0

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

# Load your DEA GeoDataFrames
deacl_annualshorelines_gdf = gpd.read_file(deacl_annualshorelines_wfs)
deacl_ratesofchange_gdf = gpd.read_file(deacl_ratesofchange_wfs)

# 1. Set CRS to EPSG:3577 if it's missing or not set properly
deacl_annualshorelines_gdf = deacl_annualshorelines_gdf.set_crs("EPSG:3577", allow_override=True)
deacl_ratesofchange_gdf = deacl_ratesofchange_gdf.set_crs("EPSG:3577", allow_override=True)

# 2. Reproject both to EPSG:4326 for web maps
deacl_annualshorelines_gdf = deacl_annualshorelines_gdf.to_crs("EPSG:4326")
deacl_ratesofchange_gdf = deacl_ratesofchange_gdf.to_crs("EPSG:4326")

# 3. (Optional) Filter rates data for good certainty and significance
deacl_ratesofchange_gdf = deacl_ratesofchange_gdf.query(
    "(sig_time <= 0.01) & (certainty == 'good')"
)

# 4. Save the GeoJSON files (NOW in lon/lat degrees!)
deacl_annualshorelines_gdf.to_file("../data/processed/dea_coastlines_shorelines.geojson", driver="GeoJSON")
deacl_ratesofchange_gdf.to_file("../data/processed/dea_coastlines_rates.geojson", driver="GeoJSON")