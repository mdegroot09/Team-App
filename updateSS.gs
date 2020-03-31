function updateStage(data){
  var url = data.url
  var row = data.row
  var oldTab = data.oldTab
  var newTab = data.newTab
  var stage = data.stage
  var status = data.status
  var ssOld = SpreadsheetApp.openByUrl(url).getSheetByName(oldTab)
  
  // update stage cell
  ssOld.getRange('G' + row).setValue(stage)
  
  // update last updated cell
  ssOld.getRange('AF' + row).setValue('=NOW()')
  ssOld.getRange('AF' + row).setNumberFormat('m"/"d"/"yy')
  var date = ssOld.getRange('AF' + row).getValue()
  ssOld.getRange('AF' + row).setValue(date)
    
  // quit if stage name is different than expected
  if (!newTab){
    return {error: true, message: 'Something went wrong. Please refresh the page.'}
  }
  
  // move buyer to new tab if applicable
  if (newTab != oldTab && status != 'Lost'){
    changeTab(url, row, oldTab, newTab)
    row = 4
  }
  
  return {
    error: false, 
    message: 'Success. Stage updated',
    url: url,
    newTab: newTab,
    row: row,
    status: status
  }
}

function changeTab(url, row, oldTab, newTab){
  var ssOld = SpreadsheetApp.openByUrl(url).getSheetByName(oldTab)
  var ssNew = SpreadsheetApp.openByUrl(url).getSheetByName(newTab)
  
  // copy values to new tab then delete old tab
  var vals = ssOld.getRange(row + ':' + row).getValues()
  ssNew.insertRowsBefore(4, 1);
  ssNew.getRange('4:4').setValues(vals)
  ssOld.deleteRows(row, 1)
}

function updateStatus(data){
  var url = data.url
  var oldTab = data.tab
  var row = data.row
  var status = data.status
  var ssOld = SpreadsheetApp.openByUrl(url).getSheetByName(oldTab)
  
  // update status cell
  ssOld.getRange('L' + row).setValue(stage)
  
  // update last updated cell
  ssOld.getRange('AF' + row).setValue('=NOW()')
  ssOld.getRange('AF' + row).setNumberFormat('m"/"d" "h":"mma/p')
  var date = ssOld.getRange('AF' + row).getValue()
  ssOld.getRange('AF' + row).setValue(date)
}