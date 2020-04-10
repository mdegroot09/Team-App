function zipIt(zip1, zip2) {
  var lat1, lon1, lat2, lon2
  
  // zip codes 84009 and 84129 are not recognized by api.zippopotam.us
  if(zip1 === 84009){
    zip1 = 84095 
  } else if (zip1 === 84129){
    zip1 = 84123
  } 
  
  if (zip2 === 84009){
    zip2 = 84095
  } else if (zip2 === 84129){
    zip2 = 84123
  }
  
  // 1st Zip Code API call
  
  // Get lat and lon of zip from zippopotam.us API
//  var response = UrlFetchApp.fetch("http://api.zippopotam.us/US/" + zip1, {muteHttpExceptions: true});
  
  var response1 = UrlFetchApp.fetch("http://api.zippopotam.us/US/" + zip1, {muteHttpExceptions: true})
  
  if (String(response1.getResponseCode())[0] === '4'){
    return "Zip code not found"
  }
  
  var a = JSON.parse(response1.getContentText());
  lat1 = a.places[0].latitude 
  lon1 = a.places[0].longitude
  
  if (lat1 && lon1 && lat2 && lon2){
    return calcDist(lat1, lon1, lat2, lon2)
  }
  
  
  // 2nd Zip Code API call
  
  // Get lat and lon of zip from zippopotam.us API
//  var response = UrlFetchApp.fetch("http://api.zippopotam.us/US/" + zip2, {muteHttpExceptions: true});
  
  var response2 = UrlFetchApp.fetch("http://api.zippopotam.us/US/" + zip2, {muteHttpExceptions: true})
  
  if (String(response2.getResponseCode())[0] === '4'){
    return "Zip code not found"
  }
  
  var b = JSON.parse(response2.getContentText());
  lat2 = b.places[0].latitude 
  lon2 = b.places[0].longitude
  
  if (lat1 && lon1 && lat2 && lon2){
    return calcDist(lat1, lon1, lat2, lon2)
  }
}

// takes in latitude and longitude of two location and returns the straight-line distance (in km)
function calcDist(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;  
  return d
}

// Converts numeric degrees to radians
function toRad(Value) 
{
  return (Value * Math.PI / 180) * 0.621371;
}