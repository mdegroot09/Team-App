function sendEmail(buyerAgent, details){
  var bodySubject = getBodySubject(buyerAgent, details)
  var subject = bodySubject.subject
  var htmlBody = bodySubject.htmlBody
  
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
    'The Leads Team'
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
  
  // add referrer's type if not an admin
  //  if (details.referringType != 'Admin'){
  //    type = ' (' + details.referringType + ') ' 
  //  }
  //  else {
  //    type = ' ' 
  //  }
  
  return {
    subject: subject,
    buyerDetails: buyerDetails,
    locationDetails: locationDetails,
    sourceDetails: sourceDetails
    // , type: type
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
//    '<script>' +
//      'function openPage(){' +
//        'location.href = "www.google.com"' +
//      '}' +
//    '</script>'
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