-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/RdSnk2
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "Obesity_study" (
    "id" int   NOT NULL,
    "year" date   NOT NULL,
    "stateabbr" varchar(30)   NOT NULL,
    "statename" varchar(30)   NOT NULL,
    "cityname" varchar(30)   NOT NULL,
    "population2010" varchar(30)   NOT NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    CONSTRAINT "pk_Obesity_study" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "cdc_data" (
    "id" int   NOT NULL,
    "stateid" VARCHAR   NOT NULL,
    "percentage_obese" FLOAT   NOT NULL,
    "gender" VARCHAR   NOT NULL,
    CONSTRAINT "pk_cdc_data" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "census_data" (
    "id" int   NOT NULL,
    "state" VARCHAR   NOT NULL,
    "totalpopulation_census_2010" INTEGER   NOT NULL,
    "population_est_2014" INTEGER   NOT NULL,
    CONSTRAINT "pk_census_data" PRIMARY KEY (
        "id"
     )
);

