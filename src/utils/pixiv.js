const { PythonShell } = require('python-shell');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

class Pixiv{
    
    async pixiv_recommend(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'recommend'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/python',
        };

        let json = null;
        let pyshell = new PythonShell('pixiv_recommend.py',options);
        const image_path = "./src/assets/images/";

        pyshell.send(null)
        pyshell.on('message', function (message) {
            json = JSON.parse(message);
        });
        pyshell.end(function (err,data) {
            if (err) throw err;
            let file = new AttachmentBuilder(image_path+`${json['png_id']}.png`);

            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                .setTitle(json["title"])
                .setDescription(json["description"])
                .setImage(`attachment://${json["png_id"]}.png`)
                .setFooter({text:`ID : ${json["png_id"]}`});
                
            interaction.deleteReply();
            interaction.followUp({ embeds: [embed], files: [file]});

          });

        return;

    }
    
    async pixiv_tagSearching(interaction){

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});
        console.log(interaction.user.username+" used command 'tag'.");

        const options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './src/python',
        }

        let tag = interaction.options.getString('tag').trim();
        let json = null;
        let pyshell = new PythonShell('pixiv_tagSearching.py',options);
        const image_path = "./src/assets/images/";

        pyshell.send(String(tag))
        pyshell.on('message', function (message){
            json = JSON.parse(message);
        });
        pyshell.end(function (err,data) {
            if (err) throw err;
            let file = new AttachmentBuilder(image_path+`${json['png_id']}.png`);

            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                .setTitle(json["title"])
                .setDescription(json["description"])
                .setImage(`attachment://${json["png_id"]}.png`)
                .setFooter({text:`ID : ${json["png_id"]}`});
                
            interaction.deleteReply();
            interaction.followUp({ embeds: [embed], files: [file]});

          });
        
        return;

    }

}

module.exports = new Pixiv();