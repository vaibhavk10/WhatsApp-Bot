const settings = require('./settings');
const chalk = require('chalk');
global.packname = settings.packname;
global.author = settings.author;

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const P = require('pino');

// Commands
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
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, tictactoeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');

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
            userMessage = userMessage.replace(/\.\s+/g, '.').trim();
            const isGroup = chatId.endsWith('@g.us');

            if (!isGroup && (userMessage === 'hi' || userMessage === 'hello')) {
                await sock.sendMessage(chatId, { 
                    text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.' 
                });
                return; // Stop further processing if a private chat says "hi" or "hello"
            }
            
            if (!userMessage.startsWith('.')) return;

            let isSenderAdmin = false;
            let isBotAdmin = false;

            if (isGroup) {
                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.' });
                    return;
                }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.' });
                    return;
                }
            }

            // Handle promote and demote
            if (userMessage.startsWith('.promote')) {
                const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidList);
            } else if (userMessage.startsWith('.demote')) {
                const mentionedJidList = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidList);
            }
        }

        if (!message.key.fromMe) {
            incrementMessageCount(chatId, senderId);
        }

        // Handle commands based on user message
        switch (true) {

            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const replyMessageKick = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;

                if (mentionedJidListKick.length > 0 || replyMessageKick) {
                    await kickCommand(sock, chatId, senderId, mentionedJidListKick, message.message?.extendedTextMessage?.contextInfo);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a user or mention a user to kick.' });
                }
                break;

            case userMessage.startsWith('.mute'):
                const muteDuration = parseInt(userMessage.split(' ')[1]);
                if (isNaN(muteDuration)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes.' });
                } else {
                    await muteCommand(sock, chatId, senderId, muteDuration);
                }
                break;

            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;

            case userMessage.startsWith('.ban'):
                try {
                    const mentionedJidListBan = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    if (mentionedJidListBan.length > 0) {
                        await banCommand(sock, chatId, senderId, mentionedJidListBan);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Please mention users to ban.' });
                    }
                } catch (error) {
                    console.error('Error banning users:', error);
                }
                break;

            case userMessage === '.help' || userMessage === '.menu':
                await helpCommand(sock, chatId);
                break;

            case userMessage.startsWith('.sticker') || userMessage.startsWith('.s'):
                await stickerCommand(sock, chatId, message);
                break;

            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;

            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn);
                break;

            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text);
                break;

            case userMessage === '.delete' || userMessage === '.del':
                await deleteCommand(sock, chatId, message, senderId);
                break;

            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;

            case userMessage === '.tagall':
                if (isSenderAdmin || message.key.fromMe) {
                    await tagAllCommand(sock, chatId, senderId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use the .tagall command.' });
                }
                break;

            case userMessage.startsWith('.tag'):
                const messageText = userMessage.slice(4).trim();
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage);
                break;

            case userMessage.startsWith('.antilink'):
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin);
                break;

            case userMessage === '.meme':
                await memeCommand(sock, chatId);
                break;

            case userMessage === '.joke':
                await jokeCommand(sock, chatId);
                break;

            case userMessage === '.quote':
                await quoteCommand(sock, chatId);
                break;

            case userMessage === '.fact':
                await factCommand(sock, chatId);
                break;

            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London' });
                }
                break;

            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;

            case userMessage.startsWith('.tictactoe'):
                const mentions = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentions.length === 1) {
                    const playerX = senderId;
                    const playerO = mentions[0];
                    tictactoeCommand(sock, chatId, playerX, playerO);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please mention one player to start a game of Tic-Tac-Toe.' });
                }
                break;

            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.' });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;

            case userMessage === '.topmembers':
                topMembers(sock, chatId);
                break;

            default:
                await handleLinkDetection(sock, chatId, message, userMessage, senderId);
                break;
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
                console.log('Logged out from WhatsApp. Please restart the bot and scan the QR code again.');
            }
        } else if (connection === 'open') {
            console.log(chalk.green('Connected to WhatsApp!'));
        }
    });
}

startBot();