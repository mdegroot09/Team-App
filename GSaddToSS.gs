function addToSS(buyerAgent, details) {
  // set id to the id of buyerAgent spreadsheet,
  var url, showNewStage
  if (buyerAgent){
    url = buyerAgent.url
    blackOpsAgent = true
  }
  
  // if no buyerAgent, set to 'Other' agents' spreadsheet id
  else {
    url = 'https://docs.google.com/spreadsheets/d/1HHuqqbnmW1ihOJDkQW7tfppNovoeELtifjrhSm-Yf1U/edit?usp=sharing'
    showNewStage = false
  }
    
  // paste lead in Raw Data tab in Master sheet
  var masterURL = 'https://docs.google.com/spreadsheets/d/1jHTJbt4FM4WGbHSy0nGF8OEpArik44Qmj0Ba7GfMOnE/edit?usp=sharing'
  var ss = SpreadsheetApp.openByUrl(masterURL).getSheetByName('Raw Data')
  pasteData(buyerAgent, details, ss, showNewStage, true)
  
  // paste lead into Agent spreadsheet
  ss = SpreadsheetApp.openByUrl(url).getSheetByName('New/Warm Leads')
  pasteData(buyerAgent, details, ss, showNewStage, false)
}

function pasteData(buyerAgent, details, ss, showNewStage, rawData){  
  // add details to the New/Warm Leads tab
  ss.insertRowsBefore(ss.getRange('4:4').getRow(), 1);  
  ss.getRange('A4').setValue(details.buyerName)
  
  // only add formula if in 'Raw Data' tab in master
  if (rawData){
    ss.getRange('B4').setValue('=IFS(IFERROR(VLOOKUP(K4,Setting!C:C,1,FALSE),"OTHER TEAM") = "OTHER TEAM", "OTHER TEAM",IFERROR(VLOOKUP(A4,\'All Data\'!A:A,1,FALSE),"MISSING") = "MISSING", "MISSING",VLOOKUP(A4,\'All Data\'!A:A,1,FALSE) <> "", "")')
  }
  
  //  ss.getRange('C4').setValue()
  ss.getRange('D4').setValue(details.buyerPhone)
  ss.getRange('E4').setValue(details.buyerEmail)
  
  // Set dropdown for the Listing Agent
  ss.getRange('F4').setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(true)
    .requireValueInRange(ss.getRange('Setting!$A$4:$A'), true).build());
  ss.getRange('F4').setValue(details.referringName)
  
  // Set dropdown for the Stage
  ss.getRange('G4').setDataValidation(SpreadsheetApp.newDataValidation().setAllowInvalid(true)
    .requireValueInRange(ss.getRange('Setting!$E$4:$E'), true).build());
  
  var stage = 'New Lead'
  
  // If agent sheet id is for "Other Agents", say "Warm Lead"; Otherwise, say "New Lead"
  if (!showNewStage){
    stage = 'Warm Lead'
  }
  
  ss.getRange('G4').setValue(stage)
  
  if (details.referringName){
    ss.getRange('H4').setValue(600)
  }
  ss.getRange('I4').setValue(details.type)
  ss.getRange('J4').setValue('=IF(Z4 <> "", Z4, Y4)')
  ss.getRange('K4').setValue(buyerAgent.name)
  ss.getRange('L4').setValue('Open')
  ss.getRange('O4').setFormula('=IF(A4="","",VLOOKUP(F4,Setting!A:B,2,false))')
  ss.getRange('P4').setValue(details.source)
  ss.getRange('Q4').setFormula('=IF(J4="","",IFS(J4="TBD","TBD",MONTH(J4)=1,"January",MONTH(J4)=2,"February",MONTH(J4)=3,"March",MONTH(J4)=4,"April",MONTH(J4)=5,"May",MONTH(J4)=6,"June",MONTH(J4)=7,"July",MONTH(J4)=8,"August",MONTH(J4)=9,"September",MONTH(J4)=10,"October",MONTH(J4)=11,"November",MONTH(J4)=12,"December"))');
  ss.getRange('R4').setFormula('=IF(J4="","",IF(J4="TBD","TBD",year(J4)))');
  ss.getRange('S4').setFormula('=IFS(N4="TBD","TBD",N4="","",N4>0,O4&" "&N4)');
  ss.getRange('AA4').setValue('=NOW()')
  ss.getRange('AA4').setNumberFormat('m"/"d" "h":"mma/p')
  var date = ss.getRange('AA4').getValue()
  ss.getRange('AA4').setValue(date)
  ss.getRange('AB4').setValue(details.notes)
}