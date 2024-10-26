const fs = require("fs");
const moment = require("moment");

const assignmentFilePath = "./assignment.json";
const examsFilePath = "./exams.json";

function readData(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}
function saveData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function addAssignment(title, deadline, detail) {
  const data = readData(assignmentFilePath);
  data.push({ title, deadline, detail });
  saveData(examsFilePath, data);
}
function infoAssignment() {
  const data = readData(assignmentFilePath);
  return data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isAfter(moment()));
}
function deleteAssignment(title) {
  const data = readData(assignmentFilePath);
  const updatedData = data.filter((item) => item.title !== title);
  saveData(examsFilePath, updatedData);
  console.log(`Assignment "${title}" deleted successfully.`);
}

function addExams(title, deadline, detail) {
  const data = readData(examsFilePath);
  data.push({ title, deadline, detail });
  saveData(examsFilePath, data);
}
function infoExams() {
  const data = readData(examsFilePath);
  return data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isAfter(moment()));
}
function deleteExams(title) {
  const data = readData(examsFilePath);
  const updatedData = data.filter((item) => item.title !== title);
  saveData(examsFilePath, updatedData);
  console.log(`Exams "${title}" deleted successfully.`);
}

function deleteExpiredAssignment() {
  const data = readData(assignmentFilePath);
  const currentDate = moment().format("DD-MM-YYYY");

  const updatedData = data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isSameOrAfter(moment(currentDate, "DD-MM-YYYY", true)));

  saveData(assignmentFilePath, updatedData);
  console.log("Expired assignment deleted successfully.");
}
function deleteExpiredExams() {
  const data = readData(examsFilePath);
  const currentDate = moment().format("DD-MM-YYYY");

  const updatedData = data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isSameOrAfter(moment(currentDate, "DD-MM-YYYY", true)));

  saveData(examsFilePath, updatedData);
  console.log("Expired exams deleted successfully.");
}

module.exports = {
  addAssignment,
  infoAssignment,
  deleteAssignment,
  addExams,
  infoExams,
  deleteExams,
  deleteExpiredAssignment,
  deleteExpiredExams,
};
