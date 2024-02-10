
const { Client, GatewayIntentBits, EmbedBuilder, WebhookClient, Embed, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const discord = "This bot is powered by discord.gg/nC7PtBzE23"
const rolename = 'Buyer';
const terminalSize = process.stdout.columns;

function centerText(text, width, char = ' ') {
    const padding = Math.max(0, Math.floor((width - text.length) / 2));
    return char.repeat(padding) + text + char.repeat(padding);
}

const border = "━".repeat(terminalSize);
console.log(centerText(border, terminalSize));
console.log(centerText("____                 _____     _                 _   ", terminalSize))
console.log(centerText("|    \\ ___ ___ _ _   |   | |___| |_ _ _ _ ___ ___| |_ ", terminalSize))
console.log(centerText("|  |  |  _| -_|_'_|  | | | | -_|  _| | | | . |  _| '_|", terminalSize))
console.log(centerText("|____/|_| |___|_,_|  |_|___|___|_| |_____|___|_| |_,_|", terminalSize))
console.log("\n")
console.log(centerText(border, terminalSize));                                             
                   
client.once('ready', () => {
    console.log(`\nLogged in as ${client.user.displayName}/${client.user.tag}, ${client.user.id}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith('.')) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'gen') {
      if (!message.member.roles.cache.some(role => role.name === 'ADMIN')) {
        const noPermissionEmbed = new EmbedBuilder()
            .setColor(0xa93cbe)
            .setAuthor({ name: 'Error: Wrong Role?' })
            .setDescription("You dont have the role 'ADMIN'! ")
            .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
        message.channel.send({ embeds: [noPermissionEmbed] });
        return;
    }
        const amount = args[0];
        const keyArray = Array.from({ length: parseInt(amount) }, () => uuidv4());

        const showKey = keyArray.join('\n');
        fs.appendFileSync(__dirname+'/keys.txt', showKey + '\n');

        if (showKey.length === 37) {
            const formattedKey = showKey.replace(/\n/g, '');
            const embed = new EmbedBuilder()
            .setColor(0xa93cbe)
            .setAuthor({ name: 'Gen Keys' })
            .setDescription(`${amount} keys was made successfully have fun!`)
            .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
            message.channel.send({ embeds: [embed] });
        } else if (showKey.length > 37) {
          const embed = new EmbedBuilder()
          .setColor(0xa93cbe)
          .setAuthor({ name: 'Gen Keys' })
          .setDescription("Keys was Created ("+amount+ " Keys)")
          .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send('Something is wrong');
        }
    } else if (command === 'redeem') {
      const key = args[0];

      if (key.length === 36) {
          const usedKeys = fs.readFileSync(__dirname+'/used keys.txt', 'utf8');

          if (usedKeys.includes(key)) {
              const embed = new EmbedBuilder()
                  .setColor(0xa93cbe)
                  .setAuthor({name :'Error: This key has been used!'})
                  .setDescription("You have tried to redeem a valid key. If you have bought this key, make a ticket. If someone else has bought it, tell them to create a ticket.")
                  .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
              message.channel.send({ embeds: [embed] });
              return;
          }

          const keys = fs.readFileSync(__dirname+'/keys.txt', 'utf8');
          if (keys.includes(key)) {
              const role = message.guild.roles.cache.find(role => role.name === rolename);

              if (role && !message.member.roles.cache.has(role.id)) {
                  await message.member.roles.add(role);

                  const successEmbed = new EmbedBuilder()
                      .setColor(0xa93cbe)
                      .setAuthor({ name: 'Success: The key you entered is valid!'})
                      .setDescription("The key you used was valid. Have fun with your tools!")
                      .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
                  message.channel.send({ embeds: [successEmbed] });

                  const updatedKeys = keys.replace(key, '').trim();
                  fs.writeFileSync(__dirname+"/keys.txt", updatedKeys);

                  fs.appendFileSync(__dirname+'/used keys.txt', `${message.author.id} ${key} - ${message.author.displayName} \n`);
              } else {
                  const alreadyHaveRoleEmbed = new EmbedBuilder()
                      .setColor(0xa93cbe)
                      .setAuthor({name:'Error: You already have the role!'})
                      .setDescription("You already have the role associated with this key.")
                      .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
                  message.channel.send({ embeds: [alreadyHaveRoleEmbed] });
              }
          } else {
              const invalidKeyEmbed = new EmbedBuilder()
                  .setColor(0xa93cbe)
                  .setAuthor({name:'Error: This key does not exist!'})
                  .setDescription("The key you have tried to enter was invalid. Are you sure this was your key? If you have bought this key, make a ticket. If someone else has bought it, tell them to create a ticket.")
                  .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
              message.channel.send({ embeds: [invalidKeyEmbed] });
          }
      } else {
          const invalidKeyEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({name:'Error: Invalid Key Format!'})
              .setDescription("The key you have entered is not in the correct format.")
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [invalidKeyEmbed] });
      }
    } 
    
    
    else if (command === 'help') {
      const embed = new EmbedBuilder()
          .setColor(0xa93cbe)
          .setAuthor({ name: 'Help page!' })
          .setDescription("All my commands!\n.gen {number}\n.redeem {code}")
          .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [embed] });

      } 
      
      
      else if (command === 'clearkeys') {
        if (!message.member.roles.cache.some(role => role.name === 'ADMIN')) {
          const noPermissionEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({ name: 'Error: Wrong Role?' })
              .setDescription("You do not have the role 'ADMIN'!")
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [noPermissionEmbed] });
          return;
      }
        fs.writeFileSync(__dirname+'/keys.txt', '');

        const successEmbed = new EmbedBuilder()
            .setColor(0xa93cbe)
            .setAuthor({name:'Success: All keys have been cleared!'})
            .setDescription("All keys have been removed from the keys.txt file.")
            .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
        message.channel.send({ embeds: [successEmbed] });
    }  else if (command === 'remove') {
      if (!message.member.roles.cache.some(role => role.name === 'ADMIN')) {
        const noPermissionEmbed = new EmbedBuilder()
            .setColor(0xa93cbe)
            .setAuthor({ name: 'Error: Wrong Role?' })
            .setDescription("You do not have the role 'ADMIN'!")
            .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
        message.channel.send({ embeds: [noPermissionEmbed] });
        return;
    }
      const userId = args[0];

      if (!userId) {
          const missingUserIdEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({ name: 'Error: Missing User ID'})
              .setDescription("Please provide a user ID to remove the role and clear from used keys.")
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [missingUserIdEmbed] });
          return;
      }


      const user = await message.guild.members.fetch(userId).catch(() => null);

      if (!user) {
          const userNotFoundEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({ name: 'Error: User Not Found'})
              .setDescription("The specified user was not found.")
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [userNotFoundEmbed] });
          return;
      }

      const role = message.guild.roles.cache.find(role => role.name === rolename);

      if (role && user.roles.cache.has(role.id)) {
          await user.roles.remove(role);


          const usedKeysPath = __dirname+'/used keys.txt';
          const usedKeys = fs.readFileSync(usedKeysPath, 'utf8');
          
          const userKey = usedKeys.split('\n').find(line => line.startsWith(userId));
          if (userKey) {
            const updatedUsedKeys = usedKeys.replace(userKey + '\n', '').trim();
            fs.writeFileSync(usedKeysPath, updatedUsedKeys);
          }

          const successEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({name:'Success: Role and Used Key Removed'})
              .setDescription(`Role and used key for user ${userId} have been successfully removed.`)
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [successEmbed] });
      } else {
          const userMissingRoleEmbed = new EmbedBuilder()
              .setColor(0xa93cbe)
              .setAuthor({ name:'Error: User Missing Role'})
              .setDescription(`@<${userId}> does not have the role ${rolename}.`)
              .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [userMissingRoleEmbed] });
      }
  }  else if (command === 'create') {
    if (!message.member.roles.cache.some(role => role.name === 'ADMIN')) {
      const noPermissionEmbed = new EmbedBuilder()
          .setColor(0xa93cbe)
          .setAuthor({ name: 'Error: Wrong Role?' })
          .setDescription("You dont have the role 'ADMIN'! ")
          .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
      message.channel.send({ embeds: [noPermissionEmbed] });
      return;
  }
      const keyArray = Array.from({ length: parseInt(1) }, () => uuidv4());

      const showKey = keyArray.join('\n');
      fs.appendFileSync(__dirname+'/keys.txt', showKey + '\n');

          const formattedKey = showKey.replace(/\n/g, '');
          const embedmainshit = "`"
          const embed = new EmbedBuilder()
          .setColor(0xa93cbe)
          .setAuthor({ name: 'Gen Keys' })
          .setDescription(`Here is your key! ${embedmainshit}${formattedKey}${embedmainshit}`)
          .setFooter({ text: discord, iconURL: 'https://cdn.discordapp.com/attachments/1197674199301505146/1198744692871934106/0246af440a06c487c68ce1a381b9f3c2.jpg?ex=65c004fe&is=65ad8ffe&hm=f22c96dfc3a9ff3f3362306131b351542b1ca8eb5bbbb4c380e2c3b54a507a32&' });
          message.channel.send({ embeds: [embed] });
  }
    }
)

client.login('TOKEN');
