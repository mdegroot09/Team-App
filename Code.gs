function doGet(request) {
  return HtmlService.createTemplateFromFile('HTML').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData(user){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  
  var buyerNamesAll = ss.getSheetByName('Data').getRange('A4:A').getValues() // get every value from A4 down
  
  // Remove empty values
  var buyerNames = buyerNamesAll.filter(function(value){
    return value != ''
  })
  
  var count = buyerNames.length
  var buyersAll = ss.getSheetByName('Data').getRange('A4:AG' + (count + 3)).getValues()
  
  var buyerData = buyersAll.map(function(buyer){
    return ({
      buyerName: buyer[0],
      dynamicsLink: buyer[1],
      toolsLink: buyer[2],
      phone: buyer[3],
      email: buyer[4],
      listingAgent: buyer[5],
      stage: buyer[6],
      commission: buyer[7],
      source: buyer[8],
      expectedClose: Date.parse(buyer[9]).toString(),  
      buyerAgent: buyer[10],
      status: buyer[11],
      lossReason: buyer[12],
      // commissionDate: buyer[13],
      listingAgentManager: buyer[14],
      tags: buyer[15],
      month: buyer[16],
      year: buyer[17],
      monthYear: buyer[18],
      address: buyer[19],
      listedPrice: buyer[20],
      underContractDate: buyer[21],
      dueDiligenceDate: Date.parse(buyer[22]).toString(),
      financingDate: Date.parse(buyer[23]).toString(),
      settlementDate: Date.parse(buyer[24]).toString(),
      closedDate: Date.parse(buyer[25]).toString(),
      dateCreated: Date.parse(buyer[26]).toString(),
      notes: Date.parse(buyer[27]).toString(),
      lastUpdated: Date.parse(buyer[31]).toString(),
      commissionDate: Date.parse(buyer[32]).toString()
    })
  })
  
  // if userType is Listing Agent, filter for only their stuff
  if (user.userType == 'Listing Agent'){
    var buyerDataPerLA = buyerData.filter(function(buyer){
      return buyer.listingAgent == user.userName
    })
    
    return buyerDataPerLA
  }
  
  // if userType is Admin, send everything
  else if (user.userType == 'Admin'){
    return buyerData
  }
  
  else {
    return {} 
  }
}

function getUserInfo(){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  var userEmail = Session.getActiveUser().getEmail()
  var row = -1
    
  var emailsAll = ss.getSheetByName('Users').getRange('B:B').getValues()
  var emailsArr = emailsAll.filter(function(e,i){
    if (e == userEmail){
      row = i + 1
    }
    return e == userEmail
  })
  
  var userName = ss.getSheetByName('Users').getRange(row, 1).getValue()
  var userType = ss.getSheetByName('Users').getRange(row, 3).getValue()
  
  return {
    userName: userName,
    userType: userType,
    userEmail: userEmail
  }
}