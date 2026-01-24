function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Svelte Google Apps Script')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function testInvokationFromClient(arg1, arg2) {
  Logger.log('testInvokationFromClient called with args: ' + arg1 + ', ' + arg2);
  return 'Success from server - received: ' + arg1 + ', ' + arg2;
}