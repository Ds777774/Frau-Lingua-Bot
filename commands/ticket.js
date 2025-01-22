const { EmbedBuilder } = require('discord.js');

// Create Ticket Command
module.exports.createTicket = async (message) => {
    const user = message.author;
    const guild = message.guild;

    // Check if a ticket channel already exists for the user
    const existingTicketChannel = guild.channels.cache.find(
        (channel) => channel.name === `ticket-${user.id}`
    );

    if (existingTicketChannel) {
        return message.channel.send('You already have an open ticket!');
    }

    try {
        // Create a new text channel for the ticket
        const ticketChannel = await guild.channels.create({
            name: `ticket-${user.id}`,
            type: 'GUILD_TEXT',
            topic: `Ticket for ${user.tag}`,
            parent: 'YOUR_CATEGORY_ID', // Set a category ID where tickets should go
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: user.id,
                    allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory'],
                },
            ],
        });

        // Send a welcome message in the new ticket channel
        const embed = new EmbedBuilder()
            .setTitle('Ticket Created')
            .setDescription(`Hello ${user.tag}, your ticket has been created.\nPlease describe your issue or request.`)
            .setColor('#1cd86c')
            .setFooter({ text: 'Ticket System' });

        await ticketChannel.send({ embeds: [embed] });
        message.channel.send(`Your ticket has been created! Go to ${ticketChannel} to provide more details.`);
    } catch (error) {
        console.error('Error creating ticket:', error);
        message.channel.send('There was an error creating your ticket. Please try again later.');
    }
};

// Close Ticket Command
module.exports.closeTicket = async (message) => {
    const user = message.author;
    const guild = message.guild;

    // Find the ticket channel for the user
    const ticketChannel = guild.channels.cache.find(
        (channel) => channel.name === `ticket-${user.id}`
    );

    if (!ticketChannel) {
        return message.channel.send('You do not have any open tickets.');
    }

    try {
        // Close the ticket by deleting the channel
        await ticketChannel.delete();
        message.channel.send(`The ticket has been closed. Thank you for reaching out, ${user.tag}.`);
    } catch (error) {
        console.error('Error closing ticket:', error);
        message.channel.send('There was an error closing your ticket. Please try again later.');
    }
};