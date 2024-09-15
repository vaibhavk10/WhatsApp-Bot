const settings = require('../settings');
const fs = require('fs');

async function helpCommand(sock, chatId) {
    const helpMessage = `
*${settings.botName || 'WhatsApp Bot'}* - Version ${settings.version || '1.0.0'}
_Bot by ${settings.botOwner || 'Unknown Owner'}_

Here are the available commands:

*General Commands:*
1. *.help* or *.menu* - Display this help message.
2. *.gpt <query>* - Ask any question or query to the bot using ChatGPT.
3. *.tagall* - Tag all members of a group (Admin only).
4. *.sticker* - Convert an image or video into a sticker.

*Admin Commands:*
5. *.ban @user* - Remove or ban a user from the group (Admin only).
6. *.promote @user* - Promote a user to admin (Admin only).
7. *.demote @user* - Demote an admin to a regular user (Admin only).
8. *.mute <minutes>* - Mute the group for a specified time (Admin only).
9. *.unmute* - Unmute the group, allowing members to send messages (Admin only).

*Group Management:*
10. Automated welcome and goodbye messages for new and leaving members.
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
