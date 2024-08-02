const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

client.on('message', msg => {
  const groupId = '120363234125929239@g.us'; // Ganti dengan ID grup Anda
  if (msg.from === groupId) {
    console.log(`Message from group: ${msg.body}`);
    // Lakukan sesuatu dengan pesan dari grup
  }
});

client.initialize();
