function doGet(request) {
  return HtmlService.createTemplateFromFile('HTML').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getData(){
  var ss = SpreadsheetApp.openById('1YENd2ZBjwcIGR3fJSla8Av4WFLddDiCuKqdZAyVNMJA')
  var val = []
  var row = 1
  var data = ''
  
  while (ss.getSheetByName('Data').getRange('A' + row).getValue()) {
    var cellVal = ss.getSheetByName('Data').getRange('A' + row).getValue()
    val.push(cellVal)
    row += 1
  }
  
  return val
}