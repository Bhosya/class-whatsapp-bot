const { Client, LocalAuth } = require("whatsapp-web.js");
const moment = require("moment");
const { addAssignment, infoAssignment, deleteAssignment, deleteExpiredAssignments } = require("./functions");

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "session",
  }),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();

client.on("message", async (msg) => {
  if (msg.body.startsWith(".")) {
    const sender = msg.author || msg.from;
    const contact = await msg.getContact();
    const username = contact.pushname || contact.number || sender;
    console.log(`@${username} used: ${msg.body}`);
  }

  // Run deleteExpiredAssignments to clean up old assignments
  deleteExpiredAssignments();

  if (msg.body === ".help") {
    client.sendMessage(msg.from, "Command yang tersedia:\n\n.tugasbaru <matkul> <deadline> <detail tugas>\n.detailtugas <matkul>\n.listtugas\n.hapustugas <matkul>");
  } else if (msg.body === "@everyone") {
    const chat = await msg.getChat();
    let text = "";
    let mentions = [];

    for (let participant of chat.participants) {
      mentions.push(`${participant.id.user}@c.us`);
      text += `@${participant.id.user} `;
    }

    await chat.sendMessage(text, { mentions });
  } 
  
  
  
  else if (msg.body.startsWith(".tugasbaru ")) {
    const [_, title, deadline, ...detailArr] = msg.body.split(" ");
    const detail = detailArr.join(" ");

    if (moment(deadline, "DD-MM-YYYY", true).isValid() && title && detail) {
      addAssignment(title, deadline, detail);
      client.sendMessage(msg.from, `Tugas "${title}" dengan deadline "${deadline}" dan detail berhasil ditambahkan.`);
    } else {
      client.sendMessage(msg.from, "Format salah. Gunakan: .tugasbaru <judul tugas> <deadline (dd-mm-yyyy)> <detail>");
    }
  } else if (msg.body.startsWith(".detailtugas ")) {
    const [_, title] = msg.body.split(" ", 2);
    const data = infoAssignment();

    const assignment = data.find((item) => item.title === title);
    if (assignment) {
      client.sendMessage(msg.from, `Detail tugas "${title}":\n\n${assignment.detail}`);
    } else {
      client.sendMessage(msg.from, "Tugas tidak ditemukan atau gagal mengambil detail.");
    }
  } else if (msg.body.startsWith(".hapustugas ")) {
    const [_, title] = msg.body.split(" ", 2);

    if (title) {
      deleteAssignment(title);
      client.sendMessage(msg.from, `Tugas "${title}" telah dihapus.`);
    } else {
      client.sendMessage(msg.from, "Format salah. Gunakan: .hapustugas <judul tugas>");
    }
  } else if (msg.body === ".infotugas") {
    const assignments = infoAssignment();
    if (assignments.length === 0) {
      client.sendMessage(msg.from, "Tidak ada tugas.");
    } else {
      let assignmentsList = "Daftar Tugas:\n";
      assignments.forEach((item, index) => {
        assignmentsList += `${index + 1}. ${item.title} - Deadline: ${item.deadline}\n`;
      });
      client.sendMessage(msg.from, assignmentsList);
    }
  }



  else if (msg.body.startsWith(".ujianbaru ")) {
    const [_, title, deadline, ...detailArr] = msg.body.split(" ");
    const detail = detailArr.join(" ");

    if (moment(deadline, "DD-MM-YYYY", true).isValid() && title && detail) {
      addAssignment(title, deadline, detail);
      client.sendMessage(msg.from, `Ujian "${title}" dengan deadline "${deadline}" dan detail berhasil ditambahkan.`);
    } else {
      client.sendMessage(msg.from, "Format salah. Gunakan: .ujianbaru <judul ujian> <deadline (dd-mm-yyyy)> <detail>");
    }
  } else if (msg.body.startsWith(".detailujian ")) {
    const [_, title] = msg.body.split(" ", 2);
    const data = infoAssignment();

    const assignment = data.find((item) => item.title === title);
    if (assignment) {
      client.sendMessage(msg.from, `Detail ujian "${title}":\n\n${assignment.detail}`);
    } else {
      client.sendMessage(msg.from, "Ujian tidak ditemukan atau gagal mengambil detail.");
    }
  } else if (msg.body.startsWith(".hapusujian ")) {
    const [_, title] = msg.body.split(" ", 2);

    if (title) {
      deleteAssignment(title);
      client.sendMessage(msg.from, `Ujian "${title}" telah dihapus.`);
    } else {
      client.sendMessage(msg.from, "Format salah. Gunakan: .hapusujian <judul ujian>");
    }
  } else if (msg.body === ".infoujian") {
    const assignments = infoAssignment();
    if (assignments.length === 0) {
      client.sendMessage(msg.from, "Tidak ada ujian.");
    } else {
      let assignmentsList = "Daftar Ujian:\n";
      assignments.forEach((item, index) => {
        assignmentsList += `${index + 1}. ${item.title} - Deadline: ${item.deadline}\n`;
      });
      client.sendMessage(msg.from, assignmentsList);
    }
  }
});
