function updateStage(data){
  var url = data.url
  var tab = data.tab
  var row = data.row
  var stage = data.stage
  var ss = SpreadsheetApp.openByUrl(url).getSheetByName(tab)
  
  // update stage cell
  ss.getRange('G' + row).setValue(stage)
  
  // update last updated cell
  ss.getRange('AF' + row).setValue('=NOW()')
  ss.getRange('AF' + row).setNumberFormat('m"/"d" "h":"mma/p')
  var date = ss.getRange('AF' + row).getValue()
  ss.getRange('AF' + row).setValue(date)
}

function updateStatus(data){
  var url = data.url
  var tab = data.tab
  var row = data.row
  var stage = data.stage
  var ss = SpreadsheetApp.openByUrl(url).getSheetByName(tab)
  
  // update status cell
  ss.getRange('L' + row).setValue(stage)
  
  // update last updated cell
  ss.getRange('AF' + row).setValue('=NOW()')
  ss.getRange('AF' + row).setNumberFormat('m"/"d" "h":"mma/p')
  var date = ss.getRange('AF' + row).getValue()
  ss.getRange('AF' + row).setValue(date)
}