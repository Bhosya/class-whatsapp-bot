const fs = require("fs");
const moment = require("moment");

const filePath = "./database.json"; // Ensure this is correctly set

function readData() {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

function saveData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function addAssignment(title, deadline, detail) {
  const data = readData();
  data.push({ title, deadline, detail });
  saveData(data);
}

function infoAssignments() {
  const data = readData();
  return data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isAfter(moment()));
}

function deleteAssignment(title) {
  const data = readData();
  const updatedData = data.filter((item) => item.title !== title);
  saveData(updatedData);
  console.log(`Assignment "${title}" deleted successfully.`);
}

function deleteExpiredAssignments() {
  const data = readData();
  const currentDate = moment().format("DD-MM-YYYY");

  const updatedData = data.filter((item) => moment(item.deadline, "DD-MM-YYYY", true).isSameOrAfter(moment(currentDate, "DD-MM-YYYY", true)));

  saveData(updatedData);
  console.log("Expired assignments deleted successfully.");
}

module.exports = {
  addAssignment,
  infoAssignments,
  deleteAssignment,
  deleteExpiredAssignments,
};
