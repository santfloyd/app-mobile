


//solo ejecutable en node.js (local)
//const piexifjs = require('piexif');
//const fs = require('fs');

var lat;
var lng;
//** variables para renderizar el mapa */
var locationOptions = {
	enableHighAccuracy: true,
	timeout: 6000 //6 segundos en milisegndos

}

var currentLayer = "OSM";

// Base map layer

//var map = L.map("map") //variable map must be global

//online tile-based map from OpenStreetMap
var osmURL = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";

//atribution (credits)
var osmAtt = "&copy; <a>https://openstreetmap.org/copyright</a> contributors";

//leaflet layer
var osm = L.tileLayer(osmURL, {maxZoom: 20, attribution: osmAtt});

// create map

var map = L.map("map", {
    center: [0, 0],
    zoom: 1,
    zoomControl: false,
    layers: [osm]
});

//base maps

var baseMaps = {
    "OSM": osm
}

//show map
map.setView([0.0,0.0], 1); // center =[0,0] zoom = 1 
map.addLayer(osm);

//** funciones de geolocalizacion del dispositivo */
function onDeviceReady(){
    alert("onDeviceReady()");

    //click events
    
    /*document.getElementById("coordinate-calculator").addEventListener("click", imageCoordsCalculator, false);*/
    getLocation();
}


function getLocation() {
	// alert("getLocation()");
	
	// HTML5 Geolocation
	
	// Check browser supports geolocation
	if (navigator.geolocation) {
		// alert("We have geolocation");
		
		navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
		
	} else {
		alert("Geolocation not supported");
	}
}

//esta funcion viene desde getlocation, el sistema sabe locationsuccess es generada del navegaor de arriba
function locationSuccess(position) {
	var pointLatitude = position.coords.latitude;
	var pointLongitude = position.coords.longitude;
	var pointAccuracy = position.coords.accuracy;
	
	console.log(pointLatitude + "," + pointLongitude + "," + pointAccuracy);

	map.setView([pointLatitude, pointLongitude], 16);

}

function locationError(error) {
	switch(error.code) {
		case error.PERMISSION_DENIED:
			alert("Geolocation request denied");
			break;
		case error.POSITION_UNAVAILABLE:
			alert("Position unavailable");
			break;
		case error.TIMEOUT:
			alert("Geolocation request timed out");
			break;
		case error.UNKNOWN_ERROR:
			alert("Unknown geolocation error");
			break;
	}
}


//funciones de extraccion EXIF

(function () {
      
    document.getElementById("image-button").onchange = function(el) {
        readURL(this)
            EXIF.getData(el.target.files[0], function() {
             
               EXIF.getData(this,()=>{
                   console.log(this)
                   
                   
                   
                if(Object.keys(this.exifdata).length > 0){
                    
                //display camera details    
                  camera_details(this.exifdata)
                  //display image details
                generate_lat_lang(this)

                //este bloque es el que se ejecuta
                //las funciones se llaman desde aqui
                console.log(lat, lng);
                markPoint(lat,lng);
            
          
            }else{
                 noDataAvailable()
                }

                });

            });
        }
        var image = document.getElementsByClassName('DisplayImage');
    for (var i = 0; i < image.length; i++) {
        image[i].addEventListener('click', function(){
            EXIF.getData(this,()=>{
        if(Object.keys(this.exifdata).length > 0){
                 //display camera details    
                  camera_details(this.exifdata)
                  //display image details
                generate_lat_lang(this)
                
        }else{
          noDataAvailable()
           
        }
    });
        });
    }

  
})();



function readURL(input) {
    ///reading the Uploading file
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
        document.getElementById("preview").src=  e.target.result
    }
    
    reader.readAsDataURL(input.files[0]);
  }
}

function noDataAvailable(){
    
    document.getElementById("Lati").innerText = "N/A"
    document.getElementById("Long").innerText = "N/A"
    document.getElementById("cmm").innerText = "N/A"
    document.getElementById("resolution").innerText = "N/A"
    document.getElementById("datetime").innerText = "N/A"
    document.getElementById("iso").innerText = "N/A"
    document.getElementById("stp").innerText = "N/A"
    alert("No GPS Data Available")
}

//detalles de camara
function camera_details(exifData=''){
                    var cmm = "N/A"
                    var company = "N/A"
                    if(exifData.Model){
                       cmm =  exifData.Model;
                    }
                     if(exifData.Make){
                       company =  exifData.Make;
                    }
    
    //Camera Model
    document.getElementById("cmm").innerText = cmm+'-'+company
    //Image Resolution
    document.getElementById("resolution").innerText = (exifData.ImageHeight) ? exifData.ImageHeight : "N/A" +' '+ (exifData.ImageWidth) ? exifData.ImageWidth : "N/A"
    //Image taken time
    document.getElementById("datetime").innerText = (exifData.DateTimeOriginal) ? exifData.DateTimeOriginal : "N/A"
    //Iso speed
    document.getElementById("iso").innerText = (exifData.ISOSpeedRatings) ? exifData.ISOSpeedRatings : "N/A"
    //lense shutter speed
    document.getElementById("stp").innerText = (exifData.ShutterSpeedValue) ? exifData.ShutterSpeedValue : "N/A"
    
        }


//** funcion para conversion de coordenadas

function ConvertDMSToDD(degrees, minutes, seconds, direction) {   
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}

function generate_lat_lang(imageData=''){
   
//latitud
var latDegree = imageData.exifdata.GPSLatitude[0].numerator;
var latMinute = imageData.exifdata.GPSLatitude[1].numerator;
var latSecond = imageData.exifdata.GPSLatitude[2].numerator/imageData.exifdata.GPSLatitude[2].denominator;
var latDireection = imageData.exifdata.GPSLatitudeRef

lat = ConvertDMSToDD(latDegree, latMinute, latSecond, latDireection);
    
document.getElementById("Lati").innerText = (lat).toFixed(8);;

//longitud
var lonDegree = imageData.exifdata.GPSLongitude[0].numerator;
var lonMinute = imageData.exifdata.GPSLongitude[1].numerator;
var lonSecond = imageData.exifdata.GPSLongitude[2].numerator/imageData.exifdata.GPSLongitude[2].denominator;
var lonDireection = imageData.exifdata.GPSLongitudeRef

lng = ConvertDMSToDD(lonDegree, lonMinute, lonSecond, lonDireection);

document.getElementById("Long").innerText = (lng).toFixed(8);


return lat, lng;


}

//** funcion de georeferenciacion de los datos exif */
function markPoint(lat,lng) {
    alert("Mark the point")
    var myIcon = L.icon({
        iconUrl: './icons/camara.png',
        iconSize: [45, 35],
        iconAnchor: [2, 4],
        popupAnchor: [-3, -76]       
    });
    var mark = L.marker([lat,lng], {icon: myIcon}).addTo(map);
    map.setView(new L.LatLng(lat,lng),15);
    markPopup = "latitud: " + lat + " longitud: " + lng;
	mark.bindPopup(markPopup);
	
    
}





