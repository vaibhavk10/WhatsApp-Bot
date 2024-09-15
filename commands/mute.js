async function muteCommand(sock, chatId, durationInMinutes) {
    if (!durationInMinutes || isNaN(durationInMinutes)) {
        await sock.sendMessage(chatId, { text: 'Please specify a valid number of minutes to mute the group.' });
        return;
    }

    const durationInMilliseconds = durationInMinutes * 60 * 1000;
    
    await sock.groupSettingUpdate(chatId, 'announcement'); // Mute the group
    await sock.sendMessage(chatId, { text: `The group has been muted for ${durationInMinutes} minutes.` });

    setTimeout(async () => {
        await sock.groupSettingUpdate(chatId, 'not_announcement'); // Unmute after the duration
        await sock.sendMessage(chatId, { text: 'The group has been unmuted.' });
    }, durationInMilliseconds);
}

module.exports = muteCommand;
