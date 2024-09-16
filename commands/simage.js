const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Temporary folder to store the sticker
const tempDir = './temp';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

async function convertStickerToImage(sock, quotedMessage, chatId) {
    try {
        const stickerMessage = quotedMessage.stickerMessage;

        if (!stickerMessage) {
            await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.' });
            return;
        }

        // Generate unique file names for each sticker to avoid conflicts
        const stickerFileName = `sticker_${Date.now()}.webp`;
        const outputImageFileName = `converted_image_${Date.now()}.png`;

        const stickerFilePath = path.join(tempDir, stickerFileName);
        const outputImagePath = path.join(tempDir, outputImageFileName);

        // Download sticker as a stream
        const stream = await downloadContentFromMessage(stickerMessage, 'sticker');
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        // Save the sticker to a temp file
        fs.writeFileSync(stickerFilePath, buffer);

        // Convert WebP (sticker) to PNG
        await sharp(stickerFilePath).toFormat('png').toFile(outputImagePath);

        // Send back the converted image
        const imageBuffer = fs.readFileSync(outputImagePath);
        await sock.sendMessage(chatId, { image: imageBuffer, caption: 'Here is the converted image!' });

        // Clean up the temporary files asynchronously after sending the image
        setTimeout(() => {
            try {
                fs.unlinkSync(stickerFilePath);
                fs.unlinkSync(outputImagePath);
            } catch (err) {
                console.error('Error cleaning up files:', err);
            }
        }, 1000); // Delay of 1 second before cleaning up files
    } catch (error) {
        console.error('Error converting sticker to image:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while converting the sticker to an image.' });
    }
}

module.exports = convertStickerToImage;
