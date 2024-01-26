const fs = require("node:fs");
const path = require("node:path"); 
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js"); 
const dotenv = require('dotenv')

dotenv.config()
TOKEN = process.env.TOKEN

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();

const commands = [];

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
console.log(commandFiles)

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[警告] ${filePath} 中的指令缺少必要的 "data" 或 "execute" 屬性。`);
	}

	commands.push(command.data.toJSON());
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`找不到指令 ${interaction.commandName}。`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		if (interaction.replied || interaction.deferred) {
			console.log(error)
			await interaction.followUp({
				content: "執行指令時發生錯誤！",
				ephemeral: true,
			});
		} else {
			console.log(error)
			await interaction.reply({
				content: "執行指令時發生錯誤！",
				ephemeral: true,
			});
		}
	}
});

const registerCommands = async (client) => {
	try {
		if (client.application) {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
			const data = await client.application.commands.set(commands);
			console.log(`Successfully reloaded ${data.size} application (/) commands.`);
		}
	} catch(e) {
		console.error(e);
	}
}

client.once(Events.ClientReady, async (client) => {
	console.log(`已就緒！已登入帳號：${client.user.tag}`);
	await registerCommands(client);
});

client.login(TOKEN);