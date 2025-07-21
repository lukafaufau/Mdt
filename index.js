require('dotenv').config();
const { Client, GatewayIntentBits, Events } = require('discord.js');
const config = require('./config/config');
const eventHandler = require('./handlers/eventHandler');

// Initialize client with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
});

// Register events
eventHandler.registerEvents(client);

// Log in to Discord with the token
client.login(process.env.TOKEN)
  .then(() => console.log('Crowbot is online and monitoring for raids'))
  .catch(error => {
    console.error('Error logging in to Discord:', error);
    process.exit(1);
  });

// Handle process termination
process.on('SIGINT', () => {
  console.log('Crowbot is shutting down...');
  client.destroy();
  process.exit(0);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});