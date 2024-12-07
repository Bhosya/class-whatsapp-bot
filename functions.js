const fs = require("fs");
const moment = require("moment");

const assignmentFilePath = "./assignment.json";
const examsFilePath = "./exams.json";
const cashFilePath = "./cash.json";

function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return [];
  }
}

function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function addItem(filePath, title, deadline, detail) {
  const data = readData(filePath);
  data.push({ title, deadline, detail });
  saveData(filePath, data);
}

function getValidItems(filePath) {
  return readData(filePath).filter(item => moment(item.deadline, "DD-MM-YYYY").isAfter(moment()));
}

function deleteItem(filePath, title) {
  const data = readData(filePath).filter(item => item.title.toLowerCase() !== title.toLowerCase());
  saveData(filePath, data);
}

function deleteExpiredItems() {
  [assignmentFilePath, examsFilePath].forEach(filePath => {
    const updatedData = readData(filePath).filter(item => moment(item.deadline, "DD-MM-YYYY").isSameOrAfter(moment()));
    saveData(filePath, updatedData);
  });
}

function deductWeeklyCash() {
  const data = readData(cashFilePath);
  if (data.length > 0 && data[0].members) {
    for (let member in data[0].members) {
      data[0].members[member] -= 1;
    }
    saveData(cashFilePath, data);
  }
}
function addCash(memberName, amount) {
  const data = readData(cashFilePath);
  if (data.length > 0 && data[0].members && data[0].members[memberName] !== undefined) {
    data[0].members[memberName] += amount;
    saveData(cashFilePath, data);
    return `${memberName}: ${data[0].members[memberName]}`;
  } else {
    return `Mahasiswa ${memberName} tidak ada.`;
  }
}
function incrementAllCash(amount) {
  const cashData = readData(cashFilePath);
  const members = cashData[0].members;

  for (const member in members) {
    members[member] += amount;
  }

  saveData(cashFilePath, cashData);
}


module.exports = { readData, addItem, getValidItems, deleteItem, deleteExpiredItems, deductWeeklyCash, addCash, incrementAllCash };
