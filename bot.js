// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
require('dotenv').config();
const axios = require('axios').default;

// https://acnhapi.com/v1a/

// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

// When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
  // console.log(villagers);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) {
    // do nothing
    return;
  }

  if (message.content === '|s' || message.content === '|species') {
    message.reply({
      content: "Species List: Alligator, Anteater, Bear, Bird, Bull, Cat, Chicken, Cow, Cub, Deer, Dog, Duck, Eagle, Elephant, Frog, Goat, Gorilla, Hamster, Hippo, Horse, Kangaroo, Koala, Lion, Monkey, Mouse, Octopus, Ostrich, Penguin, Pig, Rabbit, Rhino, Sheep, Squirrel, Tiger, Wolf \n \n \n SYNTAX: '|s <SpeciesName>' OR '|species <SpeciesName>'",
    })
  }

  // start search for list of things
  if (message.content.includes('|s') || message.content.includes('|species')) {
    let villagers;
    axios.get('https://acnhapi.com/v1a/villagers')
      .then(function (response) {
        // console.log(response)
        villagers = response;
        console.log('API is ready');
        const myMessage = message.content;
        const messageArray = myMessage.split(' ');
        const species = messageArray[1].charAt(0).toUpperCase() + messageArray[1].slice(1); // this is the type of animal


        // to find names villagers.data[0].name['name-USen']
        // to find species villagers.data[0].species
        // to find image villagers.data[0].image_uri
        // console.log(villagers.data.length)

        let villagerSpeciesList = [];
        const messageEmbed = new MessageEmbed()
          .setColor('AQUA')
          .setTitle('List of Villagers')
        
        
        for (var i = 0; i < villagers.data.length; i++) {
          if (villagers.data[i].species == species) {

            const villager = {
              name: villagers.data[i].name['name-USen'],
              image: villagers.data[i].image_uri,
            }

            messageEmbed.addField(`${villager.name}`, `${villager.image}`)
            villagerSpeciesList.push(villager);
          }
        }

        message.reply({
          embeds: [messageEmbed],
        });
      })
      .catch(function (err) {
        console.log(err);
      })
  }
  // end |s / |species command

  // start search by name
  if (message.content.includes('|n') || message.content.includes('|name')) {
    const myMessage = message.content;
    const messageArray = myMessage.split(' ');
    const name = messageArray[1].charAt(0).toUpperCase() + messageArray[1].slice(1); // this is the name of the villager

    axios.get('https://acnhapi.com/v1a/villagers')
      .then(function (response) {
        // console.log(response)
        let villagers = response;

        const messageEmbed = new MessageEmbed()
          .setColor('DARK_BLUE')
          .setTitle('Villager Search')

        for (var i = 0; i < villagers.data.length; i++) {
          if (villagers.data[i].name['name-USen'] === name) {
            const villager = {
              name: villagers.data[i].name['name-USen'],
              personality: villagers.data[i].personality,
              birthday: villagers.data[i].birthday,
              species: villagers.data[i].species,
              image: villagers.data[i].image_uri,
            }

            messageEmbed.addFields(
              { name: 'Name', value: villager.name },
              { name: 'Personality', value: villager.personality },
              { name: 'Birthday', value: villager.birthday + '    DAY/MONTH' },
              { name: 'Species', value: villager.species },
            )

            messageEmbed.setImage(villager.image)
          }
        }
        message.reply({
          embeds: [messageEmbed],
        })
    })
      .catch((err) => {
        console.log(err)
    })
  }
  // end search by name


});



// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);
