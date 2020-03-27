function updateStage(data){
  var ss = SpreadsheetApp.openByUrl(data.url).getSheetByName(data.tab)
  ss.getRange('G' + data.row).setValue(data.stage)
}