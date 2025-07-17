""" 
This script captures datasets: Coastal Infrastructures DOT-18 (Points), DOT-19 (Lines) and DOT-20 (Polygons) from DataWA's WFS API. 

DOT-18 (Points) - The Points feature class contains DoT Service Assets (water distribution, drainage, sewerage, electrical distribution etc), overbeach launches, boat mooring piles, DoT Signs and point representation of maintained (dredged) areas of deep water (channels and harbours).
DOT-19 (Lines) - The Lines feature class currently contains only DoT maintained roads. Roads included in this dataset are limited to those identified in the DoT asset management database
DOT-20 (Polygons) - The Polygons feature class contains coastal protection structures (seawalls, groynes, breakwaters).
"""

import geopandas as gpd

# Set up WFS requests for annual shorelines & rates of change points
deacl_annualshorelines_wfs = f'https://geoserver.dea.ga.gov.au/geoserver/wfs?' \
                       f'service=WFS&version=1.1.0&request=GetFeature' \
                       f'&typeName=dea:shorelines_annual&maxFeatures=1000' \
                       f'&bbox={ymin},{xmin},{ymax},{xmax},' \
                       f'urn:ogc:def:crs:EPSG:4326'
deacl_ratesofchange_wfs = f'https://geoserver.dea.ga.gov.au/geoserver/wfs?' \
                       f'service=WFS&version=1.1.0&request=GetFeature' \
                       f'&typeName=dea:rates_of_change&maxFeatures=1000' \
                       f'&bbox={ymin},{xmin},{ymax},{xmax},' \
                       f'urn:ogc:def:crs:EPSG:4326'

# Load DEA Coastlines data from WFS using geopandas
deacl_annualshorelines_gdf = gpd.read_file(deacl_annualshorelines_wfs)
deacl_ratesofchange_gdf = gpd.read_file(deacl_ratesofchange_wfs)

# Ensure CRSs are set correctly
deacl_annualshorelines_gdf.crs = 'EPSG:3577'
deacl_ratesofchange_gdf.crs = 'EPSG:3577'