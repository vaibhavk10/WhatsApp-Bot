async function welcomeNewMembers(sock, chatId, newMembers) {
    let welcomeText = 'Welcome ';
    newMembers.forEach((member) => {
        welcomeText += `@${member.split('@')[0]} `;
    });
    welcomeText += 'to the group! 🎉';

    await sock.sendMessage(chatId, {
        text: welcomeText,
        mentions: newMembers
    });
}

module.exports = welcomeNewMembers;
