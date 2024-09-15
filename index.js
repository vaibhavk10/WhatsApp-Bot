const settings = require('./settings');
const chalk = require('chalk');
global.packname = settings.packname;
global.author = settings.author;

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const welcomeNewMembers = require('./commands/welcome');
const sayGoodbye = require('./commands/goodbye');
const banCommand = require('./commands/ban');
const promoteCommand = require('./commands/promote');
const demoteCommand = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./helpers/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: P({ level: 'warn' })
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (messageUpdate) => {
        const message = messageUpdate.messages[0];
        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;

        if (!message.message) return;

        let userMessage = '';
        if (message.message?.conversation) {
            userMessage = message.message.conversation.trim().toLowerCase();
        } else if (message.message?.extendedTextMessage?.text) {
            userMessage = message.message.extendedTextMessage.text.trim().toLowerCase();
        }

        if (!userMessage.startsWith('.')) return;

        const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.' });
            return;
        }

        if (userMessage === '.mute' || userMessage === '.unmute' || userMessage.startsWith('.ban') || userMessage.startsWith('.promote') || userMessage.startsWith('.demote')) {
            if (!isSenderAdmin && !message.key.fromMe) {
                await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.' });
                return;
            }
        }

    

        if (userMessage === '.help' || userMessage === '.menu') {
            await helpCommand(sock, chatId);
        } else if (userMessage === '.tagall' && chatId.endsWith('@g.us')) {
            if (isSenderAdmin || message.key.fromMe) {
                await tagAllCommand(sock, chatId, senderId);
            } else {
                await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use the .tagall command.' });
            }
        } else if (userMessage.startsWith('.ban')) {
            const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await banCommand(sock, chatId, mentionedJidList);
        } else if (userMessage.startsWith('.promote')) {
            const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await promoteCommand(sock, chatId, mentionedJidList);
        } else if (userMessage.startsWith('.demote')) {
            const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await demoteCommand(sock, chatId, mentionedJidList);
        } else if (userMessage.startsWith('.mute')) {
            const duration = parseInt(userMessage.split(' ')[1]);
            await muteCommand(sock, chatId, senderId, duration);
        } else if (userMessage === '.unmute') {
            await unmuteCommand(sock, chatId);
        } else if (userMessage.startsWith('.sticker')) {  // Add the sticker command
            await stickerCommand(sock, chatId, message);
        } else if (userMessage.startsWith('.warn')) {
            const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await warnCommand(sock, chatId, senderId, mentionedJidList);
        } else if (userMessage.startsWith('.warnings')) {
            const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            await warningsCommand(sock, chatId, mentionedJidList);
        }
    });

    sock.ev.on('group-participants.update', async (update) => {
        const chatId = update.id;

        try {
            if (update.action === 'add') {
                const newMembers = update.participants;
                if (newMembers.length > 0) {
                    await welcomeNewMembers(sock, chatId, newMembers);
                }
            } else if (update.action === 'remove') {
                const removedMembers = update.participants;
                if (removedMembers.length > 0) {
                    await sayGoodbye(sock, chatId, removedMembers);
                }
            }
        } catch (error) {
            console.error('Error handling group participant update:', error);
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('Connection closed, reason:', lastDisconnect.error));
            if (shouldReconnect) {
                startBot();
            } else {
                console.log("Logged out from WhatsApp. Please restart the bot and scan the QR code again.");
            }
        } else if (connection === 'open') {
            console.log(chalk.green('Connected to WhatsApp!'));
        }
    });
}

startBot();
