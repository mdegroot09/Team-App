function submitReferral(details) {
  var buyerAgent = getBuyerAgent(details.city, details.zip)
  
  sendEmail(buyerAgent, details)
  
  return {buyerAgent: 'Agent A'}
}

function sendEmail(buyerAgent, details){
  var subject, sourceDetails, buyerDetails, locationDetails, referralType
  
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
  
  MailApp.sendEmail({
    // to: email + "," + 'mdegroot09@gmail.com',
    to: buyerAgent.email,
    subject: subject, 
    htmlBody: 
      buyerAgent.name + ', <br>' + 
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
  
function getBuyerAgent(city, zip){
  var buyerAgentName = 'Mike De Groot'
  
  return {
    name: buyerAgentName.split(' ')[0],
    email: 'mike.degroot@homie.com'
  }
}