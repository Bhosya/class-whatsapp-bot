const moment = require("moment");
const { readData, addItem, getValidItems, deleteItem, addCash, incrementAllCash } = require("./functions");

const roles = {
  owner: ["6281882870773@c.us", "6285701376874@c.us"],
  sekretaris: ["6285647122833@c.us", "6282229961790@c.us"],
  bendahara: ["6282141562425@c.us", "628895412074@c.us"],
};

function hasPermission(sender, role) {
  return role == "sekretaris" ? roles.sekretaris.includes(sender) || roles.owner.includes(sender) : roles.bendahara.includes(sender) || roles.owner.includes(sender);
}

const assignmentFilePath = "./assignment.json";
const examsFilePath = "./exams.json";
const cashFilePath = "./cash.json";

// 120363311807199707@g.us - Kelas
// 120363336312875175@g.us - Testing

async function handleCommand(client, msg) {
  const [command, ...args] = msg.body.slice(1).split(" ");
  const sender = msg.author || msg.from;
  const title = args[0] && args[0].toLowerCase();

  if (!hasPermission(sender, "sekretaris") && ["tugasbaru", "hapustugas", "ujianbaru", "hapusujian"].includes(command)) {
    return client.sendMessage(msg.from, "Ehhh kamu gabisa pake perintah itu.");
  } else if (!hasPermission(sender, "bendahara") && ["kas", "kassemua"].includes(command)) {
    return client.sendMessage(msg.from, "Mau ngapain kamu.");
  }

  switch (command) {
    case "help":
      client.sendMessage(
        msg.from,
        "*Perintah yang tersedia*:\n\nSekretaris:\n.tugasbaru <matkul> <deadline> <detail>\n.hapustugas <matkul>\n.ujianbaru <matkul> <deadline> <detail>\n.hapusujian <matkul>\n\nBendahara:\n.kas <nama>\n.tambahkas <nama>\n\nMahasiswa:\n.infotugas\n.detailtugas <matkul>\n.infoujian\n.detailujian <matkul>\n.infokas"
      );
      break;

    case "tugasbaru":
    case "ujianbaru":
      const [deadline, ...detailArr] = args.slice(1);
      if (!moment(deadline, "DD-MM-YYYY").isValid()) {
        return client.sendMessage(msg.from, "Format tanggal salah. Harusnya DD-MM-YYYY.");
      }
      addItem(command === "tugasbaru" ? assignmentFilePath : examsFilePath, title, deadline, detailArr.join(" "));
      client.sendMessage(msg.from, `${command === "tugasbaru" ? "Tugas" : "Ujian"} ${title} ditambahkan.`);
      break;

    case "hapustugas":
    case "hapusujian":
      deleteItem(command === "hapustugas" ? assignmentFilePath : examsFilePath, title);
      client.sendMessage(msg.from, `${command === "hapustugas" ? "Tugas" : "Ujian"} ${title} dihapus.`);
      break;

    case "infotugas":
      const assignments = getValidItems(assignmentFilePath);
      client.sendMessage(msg.from, assignments.length ? "*Daftar tugas IK-1B*:\n\n"+assignments.map((a, i) => `${i + 1}. ${a.title} - ${a.deadline}`).join("\n") : "Tidak ada tugas 😔");
      break;
    case "detailtugas":
      const assignment = getValidItems(assignmentFilePath).find((item) => item.title === title);
      msg.reply(assignment ? `*Detail tugas ${assignment.title}*: \n\n${assignment.detail}` : "Gada tugas dengan nama itu.");
      break;

    case "infoujian":
      const exams = getValidItems(examsFilePath);
      client.sendMessage(msg.from, exams.length ? "*Daftar ujian IK-1B*:\n\n"+exams.map((a, i) => `${i + 1}. ${a.title} - ${a.deadline}`).join("\n") : "Tidak ada ujian 😔");
      break;
    case "detailujian":
      const exam = getValidItems(examsFilePath).find((item) => item.title === title);
      msg.reply(exam ? `*Detail ujian ${exam.title}*: \n\n${exam.detail}` : "Gada ujian dengan nama itu.");
      break;

    case "kas":
      const name = args[0]?.toLowerCase();
      const amount = parseInt(args[1]) || 1;
      if (name) {
        addCash(name, amount);
        client.sendMessage(msg.from, `${name} bayar kas untuk ${amount} minggu.`);
      } else {
        client.sendMessage(msg.from, "Format salah. Gunakan: .kas <nama> [jumlah]");
      }
      break;
    case "infokas":
      const cashData = readData(cashFilePath);
      const members = cashData[0].members;
      const cashInfo = Object.entries(members)
        .map(([name, balance], i) => {
          if (balance === 0) {
            return `${i + 1}. sudah lunas - ${name.toUpperCase()}`;
          } else if (balance > 0) {
            return `${i + 1}. lebih ${balance} minggu - ${name.toUpperCase()}`;
          } else {
            return `${i + 1}. kurang ${Math.abs(balance)} minggu - ${name.toUpperCase()}`;
          }
        })
        .join("\n");

      client.sendMessage(msg.from, `*Info Kas Kelas*:\n\n${cashInfo}`);
      break;
    case "kassemua":
      const amounts = parseInt(args[0]);
      if (amounts) {
        incrementAllCash(amounts);
        client.sendMessage(msg.from, `Tidak ada kas selama ${amounts} minggu.`);
        break;
      } else {
        client.sendMessage(msg.from, "Format salah. Gunakan: .kassemua <jumlah>");
      }

    case "infopoyok":
      msg.reply("Zaki - 50k permasukan\nAdli - 5k perisapan\nAzka - 1k pertusukan");
  }
}

module.exports = handleCommand;
