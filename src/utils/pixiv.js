const { PythonShell } = require('python-shell');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

class Pixiv{
    
    async pixiv_recommend(interaction){
        
        const assets_path = "./src/assets/recommends/"
        const py_path = './src/lib/pixiv_recommend.py'

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});

        console.log(interaction.user.username+" used command 'recommend'.")
        
        try{
            
            PythonShell.run(py_path, null, (err, data) => {
                if (err) console.log(err);
                const parsedString = JSON.parse(data);
                console.log(`name: ${parsedString.Name}, from: ${parsedString.From}`);
                res.json(parsedString);
            })

            .then(messages=>{

                var json = JSON.parse(fs.readFileSync(assets_path+'image_info.json', 'utf8'));

                const file = new AttachmentBuilder(assets_path+'image.png');

                const embed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                    .setTitle(json["title"])
                    .setDescription(json["description"])
                    .setImage('attachment://image.png')
                    .setFooter({text:`ID : ${json["png_id"]}`});
                    
                interaction.deleteReply();
                interaction.followUp({ embeds: [embed], files: [file]});

            });

            return;

        }

        catch(e){

            console.log(e);
            await interaction.reply("Something went wrong");
            return;

        }

    }
    
    async pixiv_tagSearching(interaction){

        const assets_path = "./src/assets/tagSearching/"
        const py_path = './src/lib/pixiv_tagSearching.py'

        await interaction.reply({content:'Wait a moment ......', ephemeral: true});

        let pyshell = new PythonShell(py_path)
        let tag = interaction.options.getString('tag').trim();

        console.log(interaction.user.username+" used command 'tag'.")

        try{
            
            pyshell.send(tag)
            pyshell.end(function(err){
        
               var json = JSON.parse(fs.readFileSync(assets_path+'image_info.json', 'utf8'));

               const file = new AttachmentBuilder(assets_path+'image.png');

               const embed = new EmbedBuilder()
                   .setColor(0x0099FF)
                   .setURL(`https://www.pixiv.net/artworks/${json["png_id"]}`)
                   .setTitle(json["title"])
                   .setDescription(json["description"])
                   .setImage('attachment://image.png')
                   .setFooter({text:`ID : ${json["png_id"]}`});

                   interaction.deleteReply();
                   interaction.followUp({ embeds: [embed], files: [file]});
        
            })

            return;

        }

        catch(e){

            console.log(e);
            await interaction.deferReply("Something went wrong");
            return;

        }

    }

}

module.exports = new Pixiv();