const { EmbedBuilder } = require('discord.js');

// Function to handle member joins
const handleMemberJoin = async (member) => {
    const guild = member.guild;
    const memberCount = guild.memberCount;

    // Get the user's profile picture (small, rectangular size for "strip" effect)
    const profilePicture = member.user.displayAvatarURL({ dynamic: true, size: 128 }); // Size 128px, should be rectangular

    // Send a message in the "general" channel mentioning the user and showing their profile picture
    const channel = guild.channels.cache.find(ch => ch.name === 'general');
    if (channel) {
        await channel.send(`Hello <@${member.id}>, welcome to the server! You are member **#${memberCount}**!`);
        await channel.send({ content: '', files: [profilePicture] }); // Profile picture sent after the message
    } else {
        console.error("Channel not found: 'general'");
    }
};

// Function to handle member leaves
const handleMemberLeave = async (member) => {
    const guild = member.guild;
    const memberCount = guild.memberCount;

    // Send a leave message mentioning the user and showing the updated member count
    const channel = guild.channels.cache.find(ch => ch.name === 'general');
    if (channel) {
        await channel.send(`${member.user.username} has left the server. We now have **${memberCount}** members.`);
    } else {
        console.error("Channel not found: 'general'");
    }
};

module.exports = {
    handleMemberJoin,
    handleMemberLeave
};