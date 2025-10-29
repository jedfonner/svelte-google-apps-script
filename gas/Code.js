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

  Logger.log('Returning data' + JSON.stringify(data));
  documentProperties.setProperty('roadmapData', JSON.stringify(data));
  return data;
}

function updateSpreadsheet(updatedItem) {
  Logger.log('Updating spreadsheet with item: ' + JSON.stringify(updatedItem));
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found: ' + SHEET_NAME);
    return;
  }
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const headers = values[0];
  const idCol = headers.indexOf('ID');

  for (let rowIndex = 1; rowIndex < values.length; rowIndex++) {
    if (values[rowIndex][idCol].toString() === updatedItem.id) {
      const titleCol = headers.indexOf('Title');
      const ownerCol = headers.indexOf('Owner');
      const startPiCol = headers.indexOf('StartPI');
      const endPiCol = headers.indexOf('EndPI');
      const parentIdCol = headers.indexOf('ParentId');
      const statusCol = headers.indexOf('Status');
      sheet.getRange(rowIndex + 1, titleCol + 1).setValue(updatedItem.title);
      sheet.getRange(rowIndex + 1, ownerCol + 1).setValue(updatedItem.owner);
      sheet.getRange(rowIndex + 1, startPiCol + 1).setValue(updatedItem.startPi);
      sheet.getRange(rowIndex + 1, endPiCol + 1).setValue(updatedItem.endPi);
      sheet.getRange(rowIndex + 1, parentIdCol + 1).setValue(updatedItem.parentId);
      sheet.getRange(rowIndex + 1, statusCol + 1).setValue(updatedItem.status);

      Logger.log('Updated row ' + (rowIndex + 1) + ' with new data');

      // Clear the cached data
      const documentProperties = PropertiesService.getDocumentProperties();
      documentProperties.deleteProperty('roadmapData');
      return true;
    }
  }
  Logger.log('Item with ID ' + updatedItem.id + ' not found in sheet.');
  return false;
}

function addRoadmapItem(newItem, index) {
  const rowIndex = index + 2; // to account for header row and 0-based index
  Logger.log('Adding new roadmap item: ' + JSON.stringify(newItem) + ' at index ' + rowIndex);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found: ' + SHEET_NAME);
    return false;
  }

  sheet.insertRowBefore(rowIndex);

  const headers = sheet.getDataRange().getValues()[0];
  const idCol = headers.indexOf('ID');
  const titleCol = headers.indexOf('Title');
  const ownerCol = headers.indexOf('Owner');
  const startPiCol = headers.indexOf('StartPI');
  const endPiCol = headers.indexOf('EndPI');
  const parentIdCol = headers.indexOf('ParentId');
  const statusCol = headers.indexOf('Status');

  sheet.getRange(rowIndex, idCol + 1).setValue(newItem.id);
  sheet.getRange(rowIndex, titleCol + 1).setValue(newItem.title);
  sheet.getRange(rowIndex, ownerCol + 1).setValue(newItem.owner);
  sheet.getRange(rowIndex, startPiCol + 1).setValue(newItem.startPi);
  sheet.getRange(rowIndex, endPiCol + 1).setValue(newItem.endPi);
  sheet.getRange(rowIndex, parentIdCol + 1).setValue(newItem.parentId);
  sheet.getRange(rowIndex, statusCol + 1).setValue(newItem.status);

  // Clear the cached data
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteProperty('roadmapData');

  Logger.log('New roadmap item added.');
  return true;
}

function removeRoadmapItem(index) {
  const rowIndex = index + 2; // to account for header row and 0-based index

  Logger.log('Removing roadmap item at index: ' + rowIndex);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet not found: ' + SHEET_NAME);
    return false;
  }

  sheet.deleteRow(rowIndex);
  // Clear the cached data
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.deleteProperty('roadmapData');

  Logger.log('Roadmap item removed.');
  return true;
}