function sendEmail(buyerAgent, details){
  var remoteStatus = details.remoteStatus
  var bodySubject = getBodySubject(buyerAgent, details)
  var subject = bodySubject.subject
  var htmlBody = bodySubject.htmlBody
  
  // send remote email if necessary
  if (remoteStatus){
    return sendRemoteEmail(buyerAgent, details)
  }
  
  // set up email recipients
  var emailTo = 'leads@homie.com'
  if (buyerAgent && buyerAgent.email != emailTo){
    emailTo += ', ' + buyerAgent.email
  }
  // emailTo = 'mike.degroot@homie.com'
  
  // add link button to CMS if sent to just leads
  var linkBtn = ''
  if (!buyerAgent){
    linkBtn = getLinkBtn(details)
  }
  
  MailApp.sendEmail({
    to: emailTo,
    subject: subject, 
    htmlBody: 
      'AUTOMATED EMAIL<br>' +
      '<br>' + 
      htmlBody +
      linkBtn
  }) 
}

function getBodySubject(buyerAgent, details){
  var openingName, openingRemarks, htmlBody, closingRemarks
  
  var phrases = getPhrases(buyerAgent, details)
  var subject = phrases.subject
  var locationDetails = phrases.locationDetails
  var sourceDetails = phrases.sourceDetails
  
  if (buyerAgent){
    var buyerDetails = phrases.buyerDetails
    // var type = phrases.type
    var buyerAgentFirstName = buyerAgent.name.split(' ')[0]
    openingRemarks = (
      buyerAgentFirstName + ', <br>' + 
      '<br>' +
      buyerDetails + 
      'This lead was sent in by ' + details.referringName + ' and automatically assigned to you as the Buyer Agent.'
    )
    closingRemarks = (
      '<br>' + 
      'Reach out to ' + details.referringName + ' if you have any questions regarding the lead. ' +
      'If you\'re unable to take this lead, email us immediately at leads@homie.com.<br>'
    )
  }
  
  else {
    openingRemarks = (
      'This is a new ' + details.type + ' lead sent in by ' + details.referringName + '.<br>' + 
      '<br>' +
      'This lead is potentially outside the team\'s area and HAS NOT been assigned yet. <br>' + 
      '<br>' +
      '<span style="color: red">Assign this lead to an agent ASAP.</span>'
    )
    closingRemarks = ''
  }
  
  htmlBody = (
    openingRemarks + '<br>' +
    '<br>' +
    '<b>Details:</b><br>' + 
    'Buyer: ' + details.buyerName + '<br>' +
    'Phone: ' + details.buyerPhone + '<br>' +
    'Email: ' + details.buyerEmail + '<br>' +
    locationDetails + '<br>' + 
    'Lead sent by: ' + details.referringName + '<br>' +
    'Type: ' + details.type + '<br>' +
    sourceDetails + 
    'Notes: ' + details.notes + '<br>' +
    closingRemarks +
    '<br>' + 
    'Thanks,<br>' +
    'The Leads Team <br>'
  )
  
  return {htmlBody: htmlBody, subject: subject}
}

function getPhrases(buyerAgent, details){
  var subject, buyerDetails, locationDetails, sourceDetails
  //, type
  
  // create subject and type section
  if (details.type == 'Homie Seller'){
    buyerDetails = '"' + details.buyerName + '" is a new SELLER-TO-BUYER lead. '
    subject = 'New Lead (SELLER > BUYER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** ' + subject
    }
  }
  else if (details.type == 'Unrepped Buyer') {
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
    subject = 'New Lead (UNREPPED BUYER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** ' + subject
    }
  }
  else if (details.type == 'SOI'){
    buyerDetails = '"' + details.buyerName + '" is a new lead from ' + details.referringName + '\'s SOI. '
    subject = 'New Lead (SOI): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** ' + subject
    }
  }
  else {
    buyerDetails = '"' + details.buyerName + '" is a new unrepped buyer lead. '
    subject = 'New Lead (OTHER): ' + details.buyerName
    if (!buyerAgent){
      subject = '**UNASSIGNED** ' + subject
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
  
  // create source section if applicable
  if (details.source){
    sourceDetails = 'Source: ' + details.source + '<br>'
  }
  else {
    sourceDetails = '' 
  }
  
  return {
    subject: subject,
    buyerDetails: buyerDetails,
    locationDetails: locationDetails,
    sourceDetails: sourceDetails
  }
}

function getLinkBtn(details){
  return (
    '<div style="padding: 0 calc(50% - 100px); margin: 30px 0">' +
      '<a href="https://script.google.com/a/homie.com/macros/s/AKfycbw2oSiUqkYbD5Tr0IOiZZqCgACRXjJu6t6mtLZAjus/exec" style="text-decoration: none;">' + 
        '<div style="background: #00dec0; border-radius: 5px; color: white; cursor: pointer; padding: 10px;">' +
          '<div style="font-size: 20px; text-align: center;">' +
            'Open CMS' + 
          '</div>' + 
        '</div>' +
      '</a>' +
    '</div>'
  )
}

function sendErrorEmail(errData){
  var linkBtn = getLinkBtn('')
  
  MailApp.sendEmail({
    to: 'mike.degroot@homie.com',
    subject: errData.subj, 
    htmlBody: (
      'AUTOMATED EMAIL<br>' +
      '<br>' + 
      '<div style="color: red">' +
      errData.err + 
      '</div>' +
      '<br><br>' +
      linkBtn + '<br>'
    )
  }) 
}

function sendExistingBuyerEmail(buyerAgentName, details){
  var allBAs = getAllBAs()
  var buyerAgent = {name: '', email: ''}
  allBAs.forEach(function(a){
    if (a.name == buyerAgentName){
      return (buyerAgent = a)
    }
  })
  
  // if assigned agent is not with Black Ops, quit function
  if (!buyerAgent.name || !buyerAgent.email){
    return
  }
  
  var location = details.city + ', UT'
  if (details.street){
    location = details.street + ', ' + location
  }
  
  // create source section if applicable
  var sourceDetails = ''
  if (details.source){
    sourceDetails = 'Source: ' + details.source
  }
  
  MailApp.sendEmail({
    // to: 'mike.degroot@homie.com',
    to: 'leads@homie.com, ' + buyerAgent.email,
    subject: 'New Tour: ' + details.buyerName, 
    htmlBody: (
      'AUTOMATED EMAIL<br>' +
      '<br>' +
      buyerAgent.name.split(' ')[0] + ', <br>' +
      '<br>' + 
      details.buyerName + ' is an existing lead of yours who requested another tour: <br>' +
      '<br>' +
      'Buyer: ' + details.buyerName + '<br>' +
      'Phone: ' + details.buyerPhone + '<br>' +
      'Email: ' + details.buyerEmail + '<br>' +
      'Location: ' + location + '<br>' + 
      'Lead sent by: ' + details.referringName + '<br>' +
      'Type: ' + details.type + '<br>' +
      sourceDetails + '<br>' +
      'Notes: ' + details.notes + '<br>' +
      '<br>' +
      'If there is an issue with this tour request, please email us back immediately at leads@homie.com. <br>' + 
      '<br>' +
      'Thanks, <br>' +
      'The Leads Team <br>'
    )
  })
}

function sendRemoteEmail(buyerAgent, details){
  var remoteStatus = details.remoteStatus
  var address = details.city + ', UT ' + details.zip
  if (details.street){
    address = details.street + ', ' + address
  }
  var subject = "New Remote Buyer - " + details.buyerName
  var htmlBody = (
    'Team Leads,<br>' + 
    '<br>' + 
    details.buyerName + ' is a new remote lead. Here are details provided by ' + details.referringName + ': <br>' +
    '<br>' +
    'Buyer: ' + details.buyerName + '<br>' +
    'Phone: ' + details.buyerPhone + '<br>' +
    'Email: ' + details.buyerEmail + '<br>' +
    'Location: ' + address + '<br>' + 
    'Lead sent by: ' + details.referringName + '<br>' +
    'Type: ' + details.type + '<br>' +
    'Notes: ' + details.notes + '<br>' +
    '<br>'
  )
  
  // set up email recipients
  var emailTo = 'leads@homie.com, buyteamleads@homie.com'
  emailTo = 'mike.degroot@homie.com'
  
  MailApp.sendEmail({
    to: emailTo,
    subject: subject, 
    htmlBody: 
      'AUTOMATED EMAIL<br>' +
      '<br>' + 
      htmlBody 
  }) 
}