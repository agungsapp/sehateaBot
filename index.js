const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const app = express();
const port = process.env.PORT || 3000;

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
  console.log('Client is ready!');
  const chats = await client.getChats();
  const groupChat = chats.find(chat => chat.isGroup && chat.name === 'boy');
  if (groupChat) {
    console.log(`Group ID: ${groupChat.id._serialized}`);
  } else {
    console.log('Group not found!');
  }
});

client.on('message', async msg => {
  const groupId = '120363318960118629@g.us'; // Ganti dengan ID grup Anda
  if (msg.from === groupId && msg.body.startsWith('/bot')) {
    const contact = await client.getContactById(msg.from);
    const contactName = contact.pushname || contact.notifyName || 'Brader';

    const lines = msg.body.split('\n');
    const header = lines[1];
    const salesData = lines.slice(2).join('\n');

    const formattedHeader = formatDate(header);
    const { summary, totalCups } = summarizeSales(salesData);

    const response = `halo, ${contactName}\n\n${formattedHeader}\n${summary}\n\ntotal cup terjual ${totalCups}`;
    await msg.reply(response);
  }
});

function summarizeSales(text) {
  const lines = text.split('\n');
  const itemCounter = {};

  const pattern = /\d+\.\s*(\d+)\s*(.+)/;

  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      const quantity = parseInt(match[1]);
      const item = match[2].trim().toLowerCase();
      itemCounter[item] = (itemCounter[item] || 0) + quantity;
    } else {
      console.log(`No match for line: ${line}`);
    }
  }

  let summary = '';
  let totalCups = 0;
  for (const [item, count] of Object.entries(itemCounter)) {
    summary += `${item} : ${count}\n`;
    totalCups += count;
  }

  return { summary: summary.trim(), totalCups };
}

function formatDate(header) {
  const datePattern = /(\d+ \w+ \d+)/;
  const match = header.match(datePattern);
  if (match) {
    return header.replace(match[0], `${match[1]} 2024`);
  }
  return header;
}

client.initialize();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
