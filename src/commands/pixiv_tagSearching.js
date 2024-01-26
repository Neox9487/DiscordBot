const { SlashCommandBuilder } = require('discord.js');
const pixiv = require('../utils/pixiv');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('Search ')
        .addStringOption(option =>  
            option
                .setName('tag')                          
                .setDescription('Search tags for pixiv picture.') 
                .setRequired(true)                       
        ),
    
    async execute(interaction) {
        await pixiv.pixiv_tagSearching(interaction);
    }
} 