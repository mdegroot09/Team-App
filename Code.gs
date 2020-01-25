function doGet(request) {
  return HtmlService.createTemplateFromFile('HTML').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData(){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  
  var buyerNamesAll = ss.getRange('A4:A').getValues() // get every value from A4 down
  var buyerAgentsAll = ss.getRange('K4:K').getValues() // get every value from K4 down
  var stagesAll = ss.getRange('G4:G').getValues() // get every value from G4 down
  var listingAgentsAll = ss.getRange('F4:F').getValues() // get every value from G4 down
  
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

