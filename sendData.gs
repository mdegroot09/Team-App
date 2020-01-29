function submitReferral(details) {
  var buyerAgent = getBuyerAgent(details.city, details.zip)
  
  sendEmail(buyerAgent, details)
  
  return buyerAgent.name
}

function sendEmail(buyerAgent, details){
  var phrases = getPhrases(details)
  
  var subject = phrases.subject
  var buyerDetails = phrases.buyerDetails
  var sourceDetails = phrases.sourceDetails
  var locationDetails = phrases.locationDetails
  var referralType = phrases.referralType
  var buyerAgentFirstName = buyerAgent.name.split(' ')[0]
  
  MailApp.sendEmail({
    // to: email + "," + 'mdegroot09@gmail.com',
    to: buyerAgent.email,
    subject: subject, 
    htmlBody: 
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
  }) 
}

function getPhrases(details){
  var subject, buyerDetails, locationDetails, sourceDetails, referralType
  
  // create subject and type section
  if (details.type == 'Homie Seller'){
    subject = 'New Lead (SELLER > BUYER): ' + details.buyerName
    buyerDetails = '"' + details.buyerName + '" is a new SELLER-TO-BUYER lead. '
  }
  else if (details.type == 'Unrepped Buyer') {
    subject = 'New Lead (UNREPPED BUYER): ' + details.buyerName
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
  }
  else if (details.type == 'SOI'){
    subject = 'New Lead (SOI): ' + details.buyerName
    buyerDetails = '"' + details.buyerName + '" is a new lead from ' + details.referringName + '\'s SOI. '
  }
  else {
    subject = 'New Lead (UNREPPED BUYER): ' + details.buyerName
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
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
  
function getBuyerAgent(city, zip){
  var buyerAgentName = 'Mike De Groot'
  
  return {
    name: buyerAgentName,
    email: 'mike.degroot@homie.com'
  }
}

function getDistance(){
  var zip = 84043
  var radius = 15
  
  var buyerAgents = [
    {name: 'Mike De Groot', email: 'mike.degroot@homie.com', zip: 84042, lastReceived: (new Date('1/29/20'))},
    {name: 'JoAnn Ortega-Petty', email: 'joann.ortegapetty@homie.com', zip: 84129, lastReceived: (new Date('1/30/20'))},
    {name: 'Cole Wagstaff', email: 'cole.wagstaff@homie.com', zip: 84093, lastReceived: (new Date('1/28/20'))}
  ]
  
  for (var i = 0; i < buyerAgents.length; i++){
    buyerAgents[i].distance = zipIt(zip, buyerAgents[i].zip)
  }
  
  buyerAgents = buyerAgents.filter(function(agent){
    return agent.distance <= radius
  })
  
  buyerAgents.sort(compareDate)
  
  var display = ''
  
  for (var i = 0; i < buyerAgents.length; i++){
    display += buyerAgents[i].name + ': ' + buyerAgents[i].lastReceived + ', ' + buyerAgents[i].distance + '\n'
  }

//  var mikeDist = zipIt(84042,84057)
//  var coleDist = zipIt(84093,84057)
  SpreadsheetApp.getUi().alert(display)
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