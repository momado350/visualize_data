
const pop_url = "http://127.0.0.1:5000/api/v1.0/population";

const gender_url="http://127.0.0.1:5000/api/v1.0/bygender";


const dataPromise = Promise.all([gender_url,pop_url])

var selector = d3.selectAll("#selDataset");
const loaddata = d3.json(pop_url);

init();

function returndata(){ 
  console.log("infunction")
  
  loaddata.then(function(info_data) {
      for ( var i=0; i <(Object.keys(info_data.state)).length; i++){
        var options = selector.append("option");
        options.text(info_data.state[i])
      };
      console.log(info_data.population_est_2014[0])
      var pop_info =info_data.population_est_2014[0];
      var div_info = d3.select("#state-data").append("ul").attr("class","list-group");
      //Object.entries(pop_info).forEach(([key, value]) => {
        var li = div_info.append("li").attr("class" , "list-group-item");
        li.text('Population: '+ info_data.population_est_2014[0]);
        var li2 = div_info.append("li").attr("class" , "list-group-item");
        li2.text('State: '+ info_data.state[0]);
    // });
  
        
    });
        
  };

function init(){
//d3.json(gender_url).then(function(error, data) { 
  d3.json(gender_url).then(function(data){
    //if (error) throw error;
    console.log(data)
    var stateid=[]
    var percentage_Male=[]
    var percentage_Female=[]
    for (var i =0; i < Object.keys(data.gender).length; i++){
          stateid.push(data.stateid[i]);
        
          if (data.gender[i]=="Male") {  
            percentage_Male.push(data.percentage_obese[i]);}
          else 
            percentage_Female.push(data.percentage_obese[i]);

      }
  console.log("string")
  console.log(stateid)


  var trace1 = {
    x: stateid,
    y: percentage_Male,
    name: 'Male Percentage',
    type: "bar"
  };
  var trace2 = {
    x: stateid,
    y: percentage_Female,
    name: 'Female Percentage',
    type: "bar"
  };
  // 6. Create the data array for our plot
  var data = [trace1, trace2];
  
  // 7. Define our plot layout
  var layout = {
    title: "Obesity Percentages of Male and Female in US States",
    xaxis: { title: "State" },
    yaxis: { title: "Percentage Rate of Obesity"},
    height: 600,
    width: 800
  };
  
  var config = {responsive: true}
  // 8. Plot the chart to a div tag with id "plot"
  Plotly.newPlot("plot", data, layout,config);

//info page
//Dropdown state id
returndata(pop_url);

})
};


const reloaddata = d3.json(pop_url);
function checkforindex(id){
reloaddata.then(function(results) {
 var id_val = results.state; 
 for (var i=0; i<(Object.keys(results.state)).length; i++){ 
    if( id_val[i] ===id){
    var clearul = d3.selectAll("#state-data");;
    clearul.html("");

       var pop_info =results.population_est_2014[i];
       var div_info = d3.select("#state-data").append("ul").attr("class","list-group");
       //Object.entries(pop_info).forEach(([key, value]) => {
         var li = div_info.append("li").attr("class" , "list-group-item");
         li.text('Population: '+ results.population_est_2014[i]);
         var li2 = div_info.append("li").attr("class" , "list-group-item");
         li2.text('State: '+ results.state[i]);

         updateplot(id)
   }
 }
})};

const replotdata = d3.json(gender_url);
function updateplot(id){
  replotdata.then(function(data){
    //if (error) throw error;
    console.log(data)
    var stateid=[]
    var percentage_Male=[]
    var percentage_Female=[]
    for (var i =0; i < Object.keys(data.gender).length; i++){
      if(data.stateid[i]==id){
          stateid.push(data.stateid[i]);
        
          if (data.gender[i]=="Male") {  
            percentage_Male.push(data.percentage_obese[i]);}
          else 
            percentage_Female.push(data.percentage_obese[i]);
          }

      }
      var trace1 = {
        x: stateid,
        y: percentage_Male
       
      };
      var trace2 = {
        x: stateid,
        y: percentage_Female
      };
      var data = [trace1, trace2];
      console.log("female first")
      console.log(percentage_Female)
      console.log(percentage_Male)
      var config = {responsive: true}
    //Plotly.restyle("plot", data);
     Plotly.restyle("plot", "x", [stateid,stateid]);
     Plotly.restyle("plot", "y", [percentage_Male,percentage_Female]);
    // Plotly.restyle("plot",'yaxis.range', [0,60.5])
  })};


function optionChanged(id){ 
  checkforindex(id)
 }
