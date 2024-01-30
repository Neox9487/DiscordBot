const { SlashCommandBuilder } = require('discord.js');
const pixiv = require('../utils/pixiv.js');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('add_user')
        .setDescription('It will add painter to your user list.')
        .addStringOption(option =>  
            option
                .setName('id')                          
                .setDescription('Add this user ID to your user list.') 
                .setRequired(true)                       
        ),

    async execute(interaction) {
        await pixiv.pixiv_addUser(interaction);
    }
    
}