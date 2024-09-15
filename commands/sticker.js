const { sticker } = require('@whiskeysockets/baileys'); // Baileys supports stickers

async function stickerCommand(sock, chatId, message) {
    const mediaMessage = message.message?.imageMessage || message.message?.videoMessage;
    
    if (!mediaMessage) {
        await sock.sendMessage(chatId, { text: 'Please send an image or video to create a sticker.' });
        return;
    }

    const media = await sock.downloadMediaMessage(message); // Download the image or video

    if (media) {
        await sock.sendMessage(chatId, {
            sticker: media, 
            mimetype: 'image/webp'
        });
    } else {
        await sock.sendMessage(chatId, { text: 'Failed to create the sticker.' });
    }
}

module.exports = stickerCommand;
