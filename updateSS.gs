function updateStage(data){
  var url = data.url
  var tab = data.tab
  var row = data.row
  var stage = data.stage
  var ss = SpreadsheetApp.openByUrl(url).getSheetByName(tab)
  
  // update stage cell
  ss.getRange('G' + row).setValue(stage)
  
  // update last updated cell
  ss.getRange('AA' + row).setValue('=NOW()')
  ss.getRange('AA' + row).setNumberFormat('m"/"d" "h":"mma/p')
}