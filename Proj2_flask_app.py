import pandas as pd
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func ,inspect,Table, Column, ForeignKey
from flask import Flask, jsonify, render_template
from flask_cors import CORS
import geojson

#Read data files
#=======================================================
obesity_df = pd.read_csv('data/data_proj2.csv')
obesity_df = obesity_df.dropna()
obesity_df =pd.DataFrame(obesity_df)
#=======================================================
cdc_data_df = pd.read_csv('data/cdc_data_clean.csv')
cdc_data_df = cdc_data_df.dropna()
cdc_data_df =pd.DataFrame(cdc_data_df)
#=======================================================
#=======================================================
census_df = pd.read_csv('data/population_df_clean.csv')
census_df =pd.DataFrame(census_df)
#print (census_df)
#=======================================================

#Connect to Database
psql_conn_str = "postgres:postgres@localhost:5432/Proj2_db"
engine = create_engine(f'postgresql://{psql_conn_str}')
#https://github.com/cid-harvard/pandas-to-postgres/issues/8
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

obesity = Base.metadata.tables['obesity_study']
cdc_data= Base.metadata.tables['cdc_data']
census_data = Base.metadata.tables['census_data']
session = Session(engine)

#write df to database
obesity_df.to_sql(name='obesity_study',con=engine, if_exists='replace',index=False)
cdc_data_df.to_sql(name='cdc_data',con=engine, if_exists='replace',index=False)
census_df.to_sql(name='census_data',con=engine, if_exists='replace',index=True)

#https://geoffboeing.com/2015/10/exporting-python-data-geojson/
def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
    geojson = {'type':'FeatureCollection', 'features':[]}
    for _, row in df.iterrows():
        feature = {'type':'Feature',
                   'properties':{},
                   'geometry':{'type':'Point',
                               'coordinates':[]}}
        feature['geometry']['coordinates'] = [row[lon],row[lat]]
        for prop in properties:
            feature['properties'][prop] = row[prop]
        geojson['features'].append(feature)
    return geojson


#======================================================
# Flask app
#======================================================
app = Flask(__name__)
# cors = CORS(app)

@app.route("/")
def main():
    print("Server received request for 'Home' page...")
    return("<div ><p><h1> Welcome to Obesity Study Api!</h1></p>"
  "<li><strong> View HTML index Page:</strong><font color='orange'> /app</font></li>"
  "<li><strong> View Heat Map:</strong><font color='orange'> /heatmap</font></li>"
  "</ol><li><strong font color ='blue'>Obesity study for 500 cities in the US: </strong><font color='orange'> /api/v1.0/over45percent</font></li>"
  "<li><strong> 2014 population Estimate:</strong><font color='orange'> /api/v1.0/population</font></li>"
  "<li><strong>Gender Specific percentages:</strong><font color='orange'> /api/v1.0/bygender</font></li></ol></div>")


#===================================================
@app.route("/api/v1.0/over45percent")
def citymain():
    obesity_query =session.query(obesity)
    obesity_query = pd.read_sql(obesity_query.statement, obesity_query.session.bind)
    obesity_query = pd.DataFrame(obesity_query.loc[obesity_query["obesitypercentage"] >=30, :]) 
    cols = obesity_query.columns
    #print(cols)
    #obesity_query = obesity_query.to_dict()
    geojson = df_to_geojson(obesity_query,cols)
   
    return  geojson#jsonify(obesity_query)
# #++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

@app.route("/api/v1.0/bygender")
def cdcmain():
    cdc_data_query =session.query(cdc_data)
    cdc_data_query = pd.read_sql(cdc_data_query.statement, cdc_data_query.session.bind)
    #obesity_query = pd.DataFrame(obesity_query.loc[obesity_query["obesitypercentage"] >=45, :]) 
    cdc_data_query = cdc_data_query.to_dict()
    return jsonify(cdc_data_query)
# #===================================================
@app.route("/api/v1.0/population")
def population():
    states_census = session.query(census_data)
    states_census = pd.read_sql('select * from census_data', con=engine)
    states_census = pd.DataFrame(states_census, columns=['state', 'population_est_2014'])
    states_census = states_census.to_dict()
    return jsonify(states_census)

@app.route("/app")
def home():
    return render_template("index.html")
@app.route("/heatmap")
def heatmap():
    return render_template("heatmap.html")

#++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
if __name__ == "__main__":
    app.run(debug=True)
