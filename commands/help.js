const settings = require('../settings');
const fs = require('fs');

async function helpCommand(sock, chatId) {
    const helpMessage = `
*${settings.botName || 'WhatsApp Bot'}* - Version ${settings.version || '1.0.0'}
_Bot by ${settings.botOwner || 'Unknown Owner'}_

Available commands:

*General Commands:*
.help or .menu
.tts <text>
.sticker or .s
.owner
.joke
.quote
.fact
.weather <city>
.news
.meme

*Admin Commands:*
.ban @user
.promote @user
.demote @user
.mute <minutes>
.unmute
.delete or .del
.kick @user
.warnings @user
.warn @user
.antilink

*Game Commands:*
.tictactoe @user
.move <position>

*Group Management:*
.tagall
.tag <message>

*Other:*
.topmembers

@KnightBot 2024 v1.0.0
`;

    try {
        // Path to image
        const imagePath = './assets/bot_image.jpg';
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            // Send the message with the image
            await sock.sendMessage(chatId, { 
                image: imageBuffer, 
                caption: helpMessage 
            });
        } else {
            // Fallback: Send just the text message if the image is not found
            await sock.sendMessage(chatId, { text: helpMessage });
        }
    } catch (error) {
        console.error('Error sending help message:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while sending the help message. Please try again later.' });
    }
}

module.exports = helpCommand;
