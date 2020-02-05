function doGet(request) {
  return HtmlService.createTemplateFromFile('HTML').evaluate();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}