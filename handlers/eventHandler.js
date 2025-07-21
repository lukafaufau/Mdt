const messageHandler = require('./messageHandler');
const memberHandler = require('./memberHandler');
const commandHandler = require('./commandHandler');
const { Events } = require('discord.js');

/**
 * Registers all event handlers for the Discord client
 * @param {Client} client - Discord.js client
 */
function registerEvents(client) {
  // Message events
  client.on(Events.MessageCreate, message => {
    // Ignore bot messages
    if (message.author.bot) return;
    
    // Check if message is a command
    if (commandHandler.isCommand(message)) {
      commandHandler.handleCommand(message);
      return;
    }
    
    // Check message for raid behavior
    messageHandler.processMessage(message);
  });
  
  // Member join events
  client.on(Events.GuildMemberAdd, member => {
    memberHandler.processMemberJoin(member);
  });
  
  // Ready event
  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log('Crowbot is now monitoring for raid activity');
  });
}

module.exports = { registerEvents };