const isAdmin = require('../helpers/isAdmin'); // Ensure this helper is imported to check admin status

async function muteCommand(sock, chatId, senderId, durationInMinutes) {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(sock, chatId, senderId);

    if (!isBotAdmin) {
        await sock.sendMessage(chatId, { text: 'Please make the bot an admin first.' });
        return;
    }

    if (!isSenderAdmin) {
        await sock.sendMessage(chatId, { text: 'Only group admins can use the mute command.' });
        return;
    }

    if (!durationInMinutes || isNaN(durationInMinutes)) {
        await sock.sendMessage(chatId, { text: 'Please specify a valid number of minutes to mute the group.' });
        return;
    }

    const durationInMilliseconds = durationInMinutes * 60 * 1000;

    try {
        await sock.groupSettingUpdate(chatId, 'announcement'); // Mute the group
        await sock.sendMessage(chatId, { text: `The group has been muted for ${durationInMinutes} minutes.` });

        setTimeout(async () => {
            await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute after the duration
            await sock.sendMessage(chatId, { text: 'The group has been unmuted.' });
        }, durationInMilliseconds);
    } catch (error) {
        console.error('Error muting/unmuting the group:', error);
        await sock.sendMessage(chatId, { text: 'An error occurred while muting/unmuting the group. Please try again.' });
    }
}

module.exports = muteCommand;
