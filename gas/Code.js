function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Svelte Google Apps Script')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function onEdit() {
  Logger.log('Clearing properties cache of data');
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteProperty('roadmapData');
}

const SHEET_NAME = 'Roadmap';
function getRoadmapData() {
  Logger.log('Getting roadmap data from sheets');
  const documentProperties = PropertiesService.getDocumentProperties();
  const propData = documentProperties.getProperty('roadmapData');
  if (propData) return JSON.parse(propData);

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found: ' + SHEET_NAME);
    DocumentApp.getUi().alert('Sheet not found: ' + SHEET_NAME);
    return [];
  }

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  const dataRows = values.slice(1);

  const idCol = headers.indexOf('ID');
  const titleCol = headers.indexOf('Title');
  const ownerCol = headers.indexOf('Owner');
  const startPiCol = headers.indexOf('StartPI');
  const endPiCol = headers.indexOf('EndPI');
  const parentIdCol = headers.indexOf('ParentId');
  const statusCol = headers.indexOf('Status');

  // Convert the 2D array from the shee tinto an array of objects
  const data = dataRows.map((row) => ({
    id: row[idCol].toString(),
    title: row[titleCol].toString(),
    owner: row[ownerCol].toString(),
    startPi: row[startPiCol].toString(),
    endPi: row[endPiCol].toString(),
    parentId: row[parentIdCol].toString(),
    status: row[statusCol].toString(),
  }));

  // Build the tree representation
  const itemMap = new Map();
  const tree = [];

  // Step 1: create map of all items by id and initialize children array for each item
  data.forEach((item) => {
    item.children = [];
    itemMap.set(item.id, item);
  });

  // Step 2: link children to parents
  data.forEach((item) => {
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId).children.push(item);
    } else {
      tree.push(item);
    }
  });

  Logger.log('Returning data' + JSON.stringify(tree));
  documentProperties.setProperty('roadmapData', JSON.stringify(tree));
  return tree;
}