const fileDB = require('./file');
const recordUtils = require('./record');
const vaultEvents = require('../events');
const fs = require('fs');
const path = require('path');

// ------------------------
// 🔹 Backup Setup
// ------------------------
const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) fs.mkdirSync(backupsDir);

function createBackup(data) {
  const timestamp = new Date().toISOString().replace(/:/g, '-'); // safe for filenames
  const backupFile = path.join(backupsDir, `backup_${timestamp}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(data, null, 2));
  console.log(`💾 Backup created successfully: ${backupFile}`);
}

// ------------------------
// 🔹 CRUD Functions
// ------------------------
function addRecord({ name, value }) {
  recordUtils.validateRecord({ name, value });
  const data = fileDB.readDB();
  const createdAt = new Date(); // store creation time

  // Include createdAt in the new record
  const newRecord = { id: recordUtils.generateId(), name, value, createdAt };
  data.push(newRecord);
  fileDB.writeDB(data);
  vaultEvents.emit('recordAdded', newRecord);

  // Create backup after adding
  createBackup(data);
  return newRecord;
}

function listRecords() {
  return fileDB.readDB();
}

function updateRecord(id, newName, newValue) {
  const data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  record.name = newName;
  record.value = newValue;
  fileDB.writeDB(data);
  vaultEvents.emit('recordUpdated', record);
  return record;
}

function deleteRecord(id) {
  let data = fileDB.readDB();
  const record = data.find(r => r.id === id);
  if (!record) return null;
  data = data.filter(r => r.id !== id);
  fileDB.writeDB(data);
  vaultEvents.emit('recordDeleted', record);

  // Create backup after deleting
  createBackup(data);
  return record;
}

module.exports = { addRecord, listRecords, updateRecord, deleteRecord };

