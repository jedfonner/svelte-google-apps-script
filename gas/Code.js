function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Svelte Google Apps Script')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setFaviconUrl('https://developers.google.com/static/site-assets/developers_64dp.png')
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function testInvokationFromClient(arg1, arg2) {
  Logger.log('testInvokationFromClient called with args: ' + arg1 + ', ' + arg2);
  return 'Success from testInvokationFromClient on server - received: ' + arg1 + ', ' + arg2;
}

function testInvokationFromClient2(arg1, arg2) {
  Logger.log('testInvokationFromClient2 called with args: ' + arg1 + ', ' + arg2);
  return 'Success from testInvokationFromClient2 on server - received: ' + arg1 + ', ' + arg2;
}