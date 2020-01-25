function doGet(request) {
  return HtmlService.createTemplateFromFile('HTML').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData(){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  
  var buyerNamesAll = ss.getSheetByName('Data').getRange('A4:A').getValues() // get every value from A4 down
  var buyerAgentsAll = ss.getSheetByName('Data').getRange('K4:K').getValues() // get every value from K4 down
  var stagesAll = ss.getSheetByName('Data').getRange('G4:G').getValues() // get every value from G4 down
  var listingAgentsAll = ss.getSheetByName('Data').getRange('F4:F').getValues() // get every value from G4 down
  
  // Remove empty values
  var buyerNames = buyerNamesAll.filter(function(value){
    return value != ''
  })
  
  var count = buyerNames.length
  var buyerAgents = buyerAgentsAll.slice(0,count)
  var stages = stagesAll.slice(0,count)
  var listingAgents = listingAgentsAll.slice(0,count)
  
  var buyerData = {
    buyerNames: buyerNames,
    buyerAgents: buyerAgents,
    stages: stages,
    listingAgents: listingAgents
  }
  
  return buyerData
}

function getUserInfo(){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  var email = Session.getActiveUser().getEmail()
  var row = -1
    
  var emailsAll = ss.getSheetByName('Users').getRange('B:B').getValues()
  var emailsArr = emailsAll.filter(function(e,i){
    if (e == email){
      row = i + 1
    }
    return e == email
  })
  
  var userType = ss.getSheetByName('Users').getRange(row, 3).getValue()
  
  return {
    userType: userType,
    email: email
  }
}