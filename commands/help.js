const settings = require('../settings');
const fs = require('fs'); // To read the image file

async function helpCommand(sock, chatId) {
    const helpMessage = `
*${settings.botName || 'WhatsApp Bot'}* - Version ${settings.version || '1.0.0'}
_Bot by ${settings.botOwner || 'Unknown Owner'}_

Here are the available commands:

*General Commands:*

1. *.help* or *.menu* - Display this help message.
2. *.gpt <query>* - Ask any question or query to the bot using ChatGPT.
3. *.tagall* - Tag all members of a group (Admin only).

*Admin Commands:*

4. *.ban @user* - Remove or ban a user from the group (Admin only).
5. *.promote @user* - Promote a user to admin (Admin only).
6. *.demote @user* - Demote an admin to a regular user (Admin only).
7. *.mute <minutes>* - Mute the group for a specified time (Admin only).
8. *.unmute* - Unmute the group, allowing members to send messages (Admin only).

*Group Management:*

9. Group welcome and goodbye messages for new and leaving members are automated.
`;

    // Load the bot image from the assets folder
    const imageBuffer = fs.readFileSync('./assets/bot_image.jpg');

    // Send the image with the help message
    await sock.sendMessage(chatId, { 
        image: imageBuffer, 
        caption: helpMessage 
    });
}

module.exports = helpCommand;
