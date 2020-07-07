 function submit(details) {
  var error, message, zip, loadTime
  var startTime = new Date()
  var buyerAgentName = checkReferrals(details)
  
  // if buyer was already assigned to Homie agent
  if (buyerAgentName){
    error = true
    message = (
      'This referral, ' + details.buyerName + ', was already submitted and is being worked by ' + buyerAgentName + '. ' + 
      'An email was just sent to ' + buyerAgentName.split(' ')[0] + ' with the details you provided. \n' + 
      '\n' + 
      'Thanks for submitting!'
    )
    sendExistingBuyerEmail(buyerAgentName, details)
    loadTime = getLoadTime(startTime, new Date())
    return {error: error, message: message, loadTime: loadTime}
  }
  
  // check for valid zip
  if (details.zip){
    var location = validateZip(details.zip)
    zip = location.zip
    if (zip){
      details.city = location.city
    }
  }
  
  // if zip is invalid and no city provided, return error
  if (!zip && !details.city){
    error = true
    message = 'Error. Check the city spelling and/or zip code and and try again.'
    loadTime = getLoadTime(startTime, new Date())
    return {error: error, message: message, loadTime: loadTime}
  }
  
  // if zip is falsey, update zip based on city
  if (!zip){
    zip = getZipFromCity(details.city)
    
    // if zipBuyer is still falsey, return error
    if (!zip){
      error = true
      message = 'Error. Check the city spelling and/or zip code and and try again.'
      loadTime = getLoadTime(startTime, new Date())
      return {error: error, message: message, loadTime: loadTime}
    }
  }
  
  var buyerAgent = details.buyerAgent

  // check for valid buyer agent
  if (!buyerAgent.name || !buyerAgent.email){
    buyerAgent = getBuyerAgent(details.city, zip)
    if (!buyerAgent){
      error = false
      message = 'Success. This lead is located outside our team\'s area, but we will still reach out.'
      sendEmail('', details)
    }
  }
  
  // if buyerAgent is valid, send different success message
  else {
    error = false
    message = 'Success. Your referral has been sent to ' + buyerAgent.name + '.'
    
    // only send email if requested
    if (details.sendEmail){
      sendEmail(buyerAgent, details)
    }
    
    addToSS(buyerAgent, details)
  }
  
  loadTime = getLoadTime(startTime, new Date())
  
  return {
    name: buyerAgent.name, 
    email: buyerAgent.email, 
    error: error, 
    message: message, 
    loadTime: loadTime
  }
}

function checkReferrals(details){
  var referralURL = 'https://docs.google.com/spreadsheets/d/1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(referralURL)
  
  var buyerNamesAll = ss.getSheetByName('Data').getRange('A4:A').getValues() // get every value from A4 down
  
  // Remove empty values
  var buyerNames = buyerNamesAll.filter(function(value){
    return value != ''
  })
  
  var detailsPhone = simplifyPhone(details.buyerPhone)
  var count = buyerNames.length
  var buyersAll = ss.getSheetByName('Data').getRange('A4:AG' + (count + 3)).getValues()
  
  var buyerData = buyersAll.filter(function(buyer){
    var buyerName = buyer[0].trim()
    var phone = simplifyPhone(buyer[3])
    var email = String(buyer[4])
    return ((phone == detailsPhone && phone) || (email && email == details.buyerEmail && email.includes('@')))
  })
  
  // if referral was already sent in, return Buyer Agent name
  if (buyerData.length > 0){
    return (buyerData[0][10])
  }
  else {
    return false
  }
}

function simplifyPhone(phone){
  var num = String(phone).trim().split('').filter(function(digit, i){
    if (i == 0 && digit == '1'){
      return false
    }
    return ((Number(digit) || Number(digit) == 0) && digit != ' ')
  }).slice(0,10).join('')
  return num 
}

function getLoadTime(startTime, endTime){
  var loadTime = String((endTime - startTime) / 1000).split('.')[0] + '.' + String((endTime - startTime) / 1000).split('.')[1][0] + String((endTime - startTime) / 1000).split('.')[1][1]
  return loadTime
}

function validateZip(zip){
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Utah Zip Codes')
  var allZips = ss.getRange('B2:B').getValues()
  var row = -1
  
  // Take only first 5 digits of entered zip
  zip = Number(String(zip).split('').slice(0,5).join(''))
  
  if (zip == ''){
    return '' 
  }
  
  // look for zip in array
  allZips.forEach(function(zipCheck, i){
    if (zipCheck == zip){
      row = i + 2
      return
    }
  })
  
  // check for updated row number, then return the row's zip and city name
  if (row > 0){
    return {
      zip: ss.getRange('B' + row).getValue(), 
      city: ss.getRange('A' + row).getValue()
    }
  }
  
  // return error if zip not found
  else {
    return {zip: '', city: ''} 
  }
}

function getZipFromCity(city){
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Utah Zip Codes')
  var allCities = ss.getRange('A2:A').getValues()
  var row = -1
  
  var cities = allCities.filter(function(cityName, i){
    if (cityName == city){
      row = i + 2
    }
    return cityName == city
  })
  
  // check for updated row number, then return the row's zip
  if (row > 0){
    return ss.getRange('B' + row).getValue()
  }
  
  // return error if city name not found
  else {
    return '' 
  }
}