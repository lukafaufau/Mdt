# Crowbot - Discord Anti-Raid Bot

A specialized Discord bot designed to detect and mitigate raid attacks on your server. This bot focuses solely on anti-raid protection with no additional features.

## Features

- Detects message spam (multiple messages in a short time period)
- Identifies content spam (excessive mentions, emojis, or links)
- Monitors for suspicious member join patterns
- Automatically mutes offending users
- Cleans up spam messages
- Sends detailed alerts to a designated mod-log channel
- Provides a manual unmute command for moderators

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/crowbot.git
   cd crowbot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file with your Discord bot token, mod-log channel ID, and admin IDs.

5. Start the bot:
   ```
   npm start
   ```

## Configuration

The bot's behavior can be customized by editing the `config/config.js` file. Key configuration options include:

### Message Raid Detection

```javascript
messageThresholds: {
  count: 5,         // Number of messages
  timeWindow: 3000, // Time window in milliseconds (3 seconds)
  mentionLimit: 3,  // Max mentions per message before flagging
  emojiLimit: 10,   // Max emojis per message before flagging
  linkLimit: 2      // Max links per message before flagging
}
```

### Member Join Raid Detection

```javascript
joinThresholds: {
  count: 5,         // Number of new members
  timeWindow: 10000 // Time window in milliseconds (10 seconds)
}
```

### Auto-moderation Settings

```javascript
moderation: {
  deleteMutedMessages: true, // Whether to delete messages from muted users
  messageDeleteCount: 10,    // How many messages to delete when raid detected
  muteDuration: 300000       // Mute duration in milliseconds (5 minutes)
}
```

## Commands

The bot provides a minimal set of commands:

- `!unmute @user` - Unmutes a user who was automatically muted by the anti-raid system

## Required Permissions

The bot requires the following permissions:

- Read Messages
- Send Messages
- Manage Messages (for deleting spam)
- Timeout Members (for muting users)

## License

MIT