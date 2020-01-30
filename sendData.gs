function submitReferral(details) {
  var error, message, zip
  
  // check for valid zip
  if (zip){
    zip = validateZip(details.zip)
  }
  
  // if zip is invalid and no city provided, return error
  if (!zip && !details.city){
    error = true
    message = 'Referral failed due to city and/or zip code. Check the location and try again.'
    return {error: error, message: message}
  }
  
  // if zip is falsey, update zip based on city
  if (!zip){
    zip = getZipFromCity(details.city)
    
    // if zipBuyer is still falsey, return error
    if (!zip){
      error = true
      message = 'Referral failed due to city and/or zip code. Check the location and try again.'
      return {error: error, message: message}
    }
  }
  
  // check for valid buyer
  var buyerAgent = getBuyerAgent(details.city, zip)
  if (!buyerAgent){
    error = false
    message = 'Success. This lead is located outside our team\'s area, but we will still reach out.'
  }
  
  // if buyerAgent is valid, send different success message
  else {
    error = false
    message = 'Success. Your referral has been sent to ' + buyerAgent.name + '.'
  }
  
  sendEmail(buyerAgent, details)
//  updateAgentSS(buyerAgent, details)
  
  return {name: buyerAgent.name, email: buyerAgent.email, error: error, message: message}
}

function sendEmail(buyerAgent, details){
  var bodySubject = getBodySubject(buyerAgent, details)
  var subject = bodySubject.subject
  var htmlBody = bodySubject.htmlBody
  
  MailApp.sendEmail({
    to: 'mike.degroot@homie.com',
//    to: buyerAgent.email,
    subject: subject, 
    htmlBody: 
      '*** AUTOMATED EMAIL *** <br>' +
      '<br>' + 
      htmlBody
  }) 
}

function getBodySubject(buyerAgent, details){
  var htmlBody
  var phrases = getPhrases(buyerAgent, details)
  var subject = phrases.subject
  var locationDetails = phrases.locationDetails
  var sourceDetails = phrases.sourceDetails
  
  if (buyerAgent){
    
    var buyerDetails = phrases.buyerDetails
    var referralType = phrases.referralType
    var buyerAgentFirstName = buyerAgent.name.split(' ')[0]
    
    htmlBody = 
      buyerAgentFirstName + ', <br>' + 
      '<br>' +
      buyerDetails + 
      'This lead was sent in by ' + details.referringName + referralType + 'and automatically assigned to you as the Buyer Agent. ' + 
      sourceDetails + '<br>' + 
      '<br>' +
      '<b>Details:</b><br>' + 
      'Buyer: ' + details.buyerName + '<br>' +
      'Phone: ' + details.buyerPhone + '<br>' +
      'Email: ' + details.buyerEmail + '<br>' +
      locationDetails + '<br>' + 
      'Notes: "' + details.notes + '"<br>' + 
      '<br>' +
      'Reach out to ' + details.referringName + ' if you have any questions regarding the lead. ' +
      'If you\'re unable to take this lead, email us immediately at leads@homie.com.<br>' + 
      '<br>' + 
      'Thanks,<br>' +
      'The Leads Team'
  }
  
  else {
    htmlBody = 
      'This is a new ' + details.type + ' lead sent in by ' + details.referringName + ' ' + sourceDetails + '.<br>' + 
      '<br>' +
      'This lead HAS NOT been assigned yet. It\'s potentially outside the team\'s area and needs to be manually assigned. <br>' + 
      '<br>' +
      '<b>Details:</b><br>' + 
      'Buyer: ' + details.buyerName + '<br>' +
      'Phone: ' + details.buyerPhone + '<br>' +
      'Email: ' + details.buyerEmail + '<br>' +
      locationDetails + '<br>' + 
      'Type: ' + details.type + '<br>' +
      sourceDetails +
      'Notes: "' + details.notes + '"<br>' + 
      '<br>' + 
      '<span style="color: red">Assign this lead to someone ASAP.</span> <br>' +
      '<br>' + 
      'Thanks,<br>' +
      'Homie'
  }
  
  return {htmlBody: htmlBody, subject: subject}
}

function getPhrases(buyerAgent, details){
  var subject, buyerDetails, locationDetails, sourceDetails, referralType
  
  // create subject and type section
  if (details.type == 'Homie Seller'){
    buyerDetails = '"' + details.buyerName + '" is a new SELLER-TO-BUYER lead. '
    subject = 'New Lead (SELLER > BUYER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** New Lead (SELLER > BUYER): ' + details.buyerName
    }
  }
  else if (details.type == 'Unrepped Buyer') {
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
    subject = 'New Lead (UNREPPED BUYER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** New Lead (UNREPPED BUYER): ' + details.buyerName
    }
  }
  else if (details.type == 'SOI'){
    buyerDetails = '"' + details.buyerName + '" is a new lead from ' + details.referringName + '\'s SOI. '
    subject = 'New Lead (SOI): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** New Lead (SOI): ' + details.buyerName
    }
  }
  else {
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
    subject = 'New Lead (OTHER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** New Lead (OTHER): ' + details.buyerName
    }
  }
  
  // create location section
  if (details.street){
    locationDetails = 'Interested in: ' + details.street + ', ' + details.city + ', UT'
    if (details.zip){
      locationDetails += ' ' + details.zip 
    }
  }
  else {
    locationDetails = 'Interested in looking in: ' + details.city + ', UT' 
  }
  
  // create source section
  if (details.source){
    sourceDetails = 'This lead was received via ' + details.source + '.'
  }
  else {
    sourceDetails = '' 
  }
  
  if (details.referringType != 'Admin'){
    referralType = ' (' + details.referringType + ') ' 
  }
  else {
    referralType = ' ' 
  }
  
  return {
    subject: subject,
    buyerDetails: buyerDetails,
    locationDetails: locationDetails,
    sourceDetails: sourceDetails,
    referralType: referralType
  }
}

function validateZip(zip){
  var ss = SpreadsheetApp.openById('1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE').getSheetByName('Utah Zip Codes')
  var allZips = ss.getRange('B2:B').getValues()
  var row = -1
  
  if (zip == ''){
    return '' 
  }
  
  // look for zip in list
  allZips.forEach(function(zipCheck, i){
    if (zipCheck == zip){
      row = i + 2
      return
    }
  })
  
  // check for updated row number, then return the row's zip
  if (row > 0){
    return ss.getRange('B' + row).getValue()
  }
  
  // return error if zip not found
  else {
    return '' 
  }
}

function getBuyerAgent(city, zipBuyer){
  var radius = 20
  
  var ss = SpreadsheetApp.openById('1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE').getSheetByName('Agent Data')
  var name, email, city, zip, lastReceived, sevenDayTotal, thirtyDayTotal, available
  var buyerAgentsAll = []
  var agentsCount = ss.getRange('A2:A').getValues().filter(function(cell){
    return cell != ''
  }).length
  
  for (var i = 2; i < agentsCount + 2; i++){
    name = ss.getRange('A' + i).getValue()
    email = ss.getRange('B' + i).getValue()
    city = ss.getRange('C' + i).getValue()
    zip = ss.getRange('D' + i).getValue()
    lastReceived = ss.getRange('E' + i).getValue()
    sevenDayTotal = ss.getRange('F' + i).getValue()
    thirtyDayTotal = ss.getRange('G' + i).getValue()
    available = true
    
    // assign as unavailable if applicable
    if (ss.getRange('A' + i).getBackground() == '#f4cccc'){
      available = false
    }
    
    buyerAgentsAll.push({
      name: name,
      email: email,
      city: city,
      zip: zip,
      lastReceived: (new Date(lastReceived)),
      sevenDayTotal: sevenDayTotal,
      thirtyDayTotal: thirtyDayTotal,
      available: available
    })
  }
  
  var agents = filterSortAgents(buyerAgentsAll, zipBuyer, radius)
  
  // if no agents found, send error
  if (!agents[0]){
    return '' 
  }
  
  // otherwise send agent info
  else {
    return {
      name: agents[0].name,
      email: agents[0].email
    }
  }
}

function getZipFromCity(city){
  var ss = SpreadsheetApp.openById('1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE').getSheetByName('Utah Zip Codes')
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

function filterSortAgents(buyerAgentsAll, zipBuyer, radius){
  // remove agents who are unavailable 
  var buyerAgents = buyerAgentsAll.filter(function(agent){
    return agent.available
  })
  
  // get distance from zipBuyer for each agent
  for (var i = 0; i < buyerAgents.length; i++){
    buyerAgents[i].distance = zipIt(zipBuyer, buyerAgents[i].zip)
  }
  
  // remove agents outside the radius
  buyerAgents = buyerAgents.filter(function(agent){
    return agent.distance <= radius
  })
  
  // sort first by lastReceived then by 30-day total
  buyerAgents.sort(compareDate)
  buyerAgents.sort(compareTotal)
  
  return buyerAgents
}

function compareDate(a, b) {
  // sort based on distance
  var distA = a.lastReceived
  var distB = b.lastReceived

  var comparison = 0;
  if (distA > distB) {
    comparison = 1;
  } else if (distA < distB) {
    comparison = -1;
  }
  return comparison;
}

function compareTotal(a, b) {
  // sort based on distance
  var distA = a.thirtyDayTotal
  var distB = b.thirtyDayTotal

  var comparison = 0;
  if (distA > distB) {
    comparison = 1;
  } else if (distA < distB) {
    comparison = -1;
  }
  return comparison;
}