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

*Admin Commands:*
.ban @user
.promote @user
.demote @user
.mute <minutes>
.unmute
.delete or .del

*Game Commands:*
.tictactoe @user
.move <position>

*Group Management:*
.tagall

*Other:*
.topmembers
.antilink
.meme
`;

    try {
        const imagePath = './assets/bot_image.jpg';
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(chatId, { 
                image: imageBuffer, 
                caption: helpMessage 
            });
        } else {
            await sock.sendMessage(chatId, { text: helpMessage });
        }
    } catch (error) {
        console.error('Error sending help message:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while sending the help message. Please try again later.' });
    }
}

module.exports = helpCommand;
