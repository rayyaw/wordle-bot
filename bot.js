/**
 * Wordle Discord Bot made by Riley (https://twitch.tv/rrileytas)
 * This bot allows you to play Wordle on Discord
 * with randomly generated words, anytime you want.
 * 
 * For more info, see the README.
 * 
 * All content is licensed under CC-BY SA (Noncommercial) 4.0
 * You are free to modify or reuse any part of this work for
 * noncommercial purposes only, as long as you cite the source.
 * 
 */
 const {Client, Intents, User} = require('discord.js');
 const token = require('./auth-main.json');
 const config = require('./package.json');
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 
 const http = new XMLHttpRequest();
 
 const fs = require('fs');
 
 const client = new Client({ intents: [Intents.FLAGS.GUILDS,
                                       Intents.FLAGS.GUILD_MESSAGES,
                                       Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
 
 // Load list of ~8,000 most common words of english (all are at least 5 letters long)
 // Word list taken from https://github.com/first20hours/google-10000-english
 // (Some data cleaning was required, such as removing words not in the dictionary)
 var words_list = [];
 
 function loadWords () {
     fs.readFile("words.txt", 'utf8' , (err, data) => {
         var records = data.split("\n");
 
         for (var i = 0; i < records.length; i++) {
             words_list.push(records[i]);
         }
 
       });
 }
 
 // Emote codes to use when responding
 var gray_codes = {
     "q": "<:q_gray:946872127510958101>",
     "w": "<:w_gray:946872127968141312>",
     "e": "<:e_gray:946872127716474890>",
     "r": "<:r_gray:946872127842287676>",
     "t": "<:t_gray:946872128064606289>",
     "y": "<:y_gray:946872127913623602>",
     "u": "<:u_gray:946872127913619556>",
     "i": "<:i_gray:946872127930392647>",
     "o": "<:o_gray:946872128219783208>",
     "p": "<:p_gray:946872127976509440>",
     "a": "<:a_gray:946872127687131176>",
     "s": "<:s_gray:946872130384068668>",
     "d": "<:d_gray:946872127804567593>",
     "f": "<:f_gray:946872127775203468>",
     "g": "<:g_gray:946872127909400627>",
     "h": "<:h_gray:946872127754227752>",
     "j": "<:j_gray:946872127880056852>",
     "k": "<:k_gray:946872127917797386>",
     "l": "<:l_gray:946872127737446531>",
     "z": "<:z_gray:946872127859089538>",
     "x": "<:x_gray:946872127875862538>",
     "c": "<:c_gray:946872127355748413>",
     "v": "<:v_gray:946872127875854376>",
     "b": "<:b_gray:946872127657746432>",
     "n": "<:n_gray:946872127896838264>",
     "m": "<:m_gray:946872127603228794>"
 }
 
 var yellow_codes = {
     "q": "<:q_yellow:946872302291800106>",
     "w": "<:w_yellow:946872302337945690>",
     "e": "<:e_yellow:946872302228889700>",
     "r": "<:r_yellow:946872302321143838>",
     "t": "<:t_yellow:946872302325350503>",
     "y": "<:y_yellow:946872302451191818>",
     "u": "<:u_yellow:946872302472134786>",
     "i": "<:i_yellow:946872302254043146>",
     "o": "<:o_yellow:946872302275022888>",
     "p": "<:p_yellow:946872302346317854>",
     "a": "<:a_yellow:946872302157590568>",
     "s": "<:s_yellow:946872302522494996>",
     "d": "<:d_yellow:946872302191128616>",
     "f": "<:f_yellow:946872302233075722>",
     "g": "<:g_yellow:946872302094676060>",
     "h": "<:h_yellow:946872302266617856>",
     "j": "<:j_yellow:946872302258237450>",
     "k": "<:k_yellow:946872302354702436>",
     "l": "<:l_yellow:946872302249844817>",
     "z": "<:z_yellow:946872302597967982>",
     "x": "<:x_yellow:946872302291787816>",
     "c": "<:c_yellow:946872302291779684>",
     "v": "<:v_yellow:946872302467952702>",
     "b": "<:b_yellow:946872302010773575>",
     "n": "<:n_yellow:946872302237253742>",
     "m": "<:m_yellow:946872302358917240>"
 }
 
 var green_codes = {
     "q": "<:q_green:946872394033819758>",
     "w": "<:w_green:946872393723437057>",
     "e": "<:e_green:946872393907974175>",
     "r": "<:r_green:946872394021228594>",
     "t": "<:t_green:946872394201567272>",
     "y": "<:y_green:946872394037993562>",
     "u": "<:u_green:946872394021216286>",
     "i": "<:i_green:946872393547255860>",
     "o": "<:o_green:946872393740214333>",
     "p": "<:p_green:946872394021208139>",
     "a": "<:a_green:946872394012848248>",
     "s": "<:s_green:946872394067357736>",
     "d": "<:d_green:946872393907970068>",
     "f": "<:f_green:946872393928953876>",
     "g": "<:g_green:946872393933152296>",
     "h": "<:h_green:946872393933131916>",
     "j": "<:j_green:946872393983492186>",
     "k": "<:k_green:946872394088341504>",
     "l": "<:l_green:946872393740218419>",
     "z": "<:z_green:946872394084147240>",
     "x": "<:x_green:946872394172219392>",
     "c": "<:c_green:946872393656316005>",
     "v": "<:v_green:946872394029596682>",
     "b": "<:b_green:946872393945722960>",
     "n": "<:n_green:946872393966694420>",
     "m": "<:m_green:946872393702445057>"
 }
 
 /** Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  * Gets a random int in the range [min, max).
  * 
  * @param {*} min The minimum number that can be picked (inclusive)
  * @param {*} max The maximum number that can be picked (exclusive)
  * @returns A random number between min and max
  */ 
 function getRandomInt (min, max) {
     min = Math.ceil(min);
     max = Math.floor(max);
     return Math.floor(Math.random() * (max - min) + min);
 }
 
 // Dict (user id, ongoing game) to keep track of games
 var ongoing_games = {};
 
 // This class handles a single game of Wordle
 class WordleGame {
     constructor () {
         this.newPuzzle();
     }
 
     newPuzzle () {
         // Select a random word to use
         var idx = getRandomInt(0, words_list.length);
         this.actual = words_list[idx];
 
         this.letters = {}
 
         for (var i = 0; i < this.actual.length; i++) {
             if (!(this.actual.charAt(i) in this.letters)) {
                 this.letters[this.actual.charAt(i)] = 1;
             } else {
                 this.letters[this.actual.charAt(i)] += 1;
             }
         }
 
         // Reset guesses and solved status
         this.guesses = [];
         this.solved = false;
     }
 
     isSolved () {
         return this.solved;
     }
 
     getWordLength () {
         return this.actual.length;
     }
 
     outputGuess(idx) {
         var guess = this.guesses[idx];
         var output = "";
         var letters_cp = {...this.letters};
 
         var greens = "";
 
         // Check greens separately first
         for (var i = 0; i < guess.length; i++) {
             if (guess.charAt(i) === this.actual.charAt(i)) {
                 greens += "A";
                 letters_cp[guess.charAt(i)] -= 1;
             } else {
                 greens += "_";
             }
         }
 
         for (var i = 0; i < guess.length; i++) {
             if (greens.charAt(i) === "A") {
                 // If input = correct, green
                 output += green_codes[guess.charAt(i)];
             } else if (guess.charAt(i) in letters_cp && letters_cp[guess.charAt(i)] > 0) {
                 // If input is wrong (but still in the word), yellow
                 output += yellow_codes[guess.charAt(i)];
                 letters_cp[guess.charAt(i)] -= 1
             } else {
                 // Otherwise, gray output
                 output += gray_codes[guess.charAt(i)];
             }
         }
 
         return output;
     }
 
     guess (guess_str) {
         guess_str = guess_str.toLowerCase();
 
         // Enforce correct formatting
         if (guess_str.length != this.actual.length) {
             return "Incorrect word length provided - actual length is " + this.actual.length;
         } else if (this.guesses.length >= 20) {
             var curr = this.actual
             this.newPuzzle();
             return "Too many guesses - puzzle has been reset. New length is " + this.getWordLength() +". Previous answer was "+ curr;
         } else if (!guess_str.match(/^[a-z]+$/)) {
             return "Message contains invalid characters";
         } else {
             // Use DictionaryAPI to check if the word is valid
             const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + guess_str;
 
             // Wait until the request is satisfied
             http.open("GET", url, false);
             http.send();
 
             // Enforce that the word is valid
             if (http.responseText.startsWith("{\"title\":\"No Definitions Found\"")) {
                 return "That is not a valid word";
             }
 
             // If the guess is valid, check if it's correct.
             // Output the score.
             this.guesses.push(guess_str);
 
             if (guess_str === this.actual) {
                 this.solved = true;
             }
 
             return this.outputGuess(this.guesses.length - 1);
         }
     }
 
     // Show score for every single guess (greens and yellows)
     showScore () {
         var output = [""];
         for (var i = 0; i < this.guesses.length; i++) {
             if (i % 4 === 0 && i != 0) output.push("");
             output[output.length - 1] += this.outputGuess(i) + '\n';
         }
 
         return output;
     }
 }
 
 // Once the bot is on, load all the data into memory
 client.once ('ready', () => {
     loadWords();
 });
 
 // Called whenever a Discord user sends a message
 client.on ('messageCreate', message => {
     if (message.author.bot) return;
 
     // Initialize a new game of Wordle, and output the word length.
     if (message.content === ".wordle init") {
         var author = message.guild.members.cache.get(message.author.id);
         
         ongoing_games[author] = new WordleGame();
 
         message.channel.send("New game started. The new word has " + ongoing_games[author].getWordLength() + " letters");
 
     }
 
     // Process a user's guess, and output the result
     else if (message.content.startsWith(".wordle guess ")) {
         var author = message.guild.members.cache.get(message.author.id);
 
         // If you haven't started a game, send an error
         if (!(author in ongoing_games)) {
             message.channel.send("No games found. Please start a new one with `.wordle init`.");
             return;
         }
         
         var game = ongoing_games[author];
 
         // If the game is solved, you can't guess anymore
         if (game.isSolved()) {
             message.channel.send("You have already solved this game, start a new one with `.wordle init`");
             return;
         }
 
         var out = game.guess(message.content.substring(14));
 
         message.channel.send(out);
 
         // If you solve the puzzle on this move, output congratulations and move count
         if (game.isSolved()) message.channel.send(
             "Congrats " + message.author.username + "! You solved the word " + game.actual + " in " + game.guesses.length + " attempts!"
         );
 
     }
 
     // Check the score on the current puzzle.
     else if (message.content === ".wordle score") {
         var author = message.guild.members.cache.get(message.author.id);
 
         // Check for existing games, and fail if none is found.
         if (!(author in ongoing_games)) {
             message.channel.send("No games found for user " + message.author.username);
             return;
         }
         
         var game = ongoing_games[author];
         var score = game.showScore();
 
         // This check prevents a crash (can't send "" as a discord message)
         if (score.length === 1 && score[0] === "") message.channel.send("You haven't guessed yet.");
         else {
             for (var i = 0; i < score.length; i++) message.channel.send(score[i]);
         }
 
     }
 
     // Output helpful information about how to use the bot
     else if (message.content === ".help") {
         output = "`.wordle init` - Start a new game of Wordle\n";
         output += "`.wordle guess` - Make a guess on the current word\n";
         output += "`.wordle score` - Display the score for this game";
 
         message.channel.send(output);
     }
 });
 
 // If you decide to use this code yourself, you should provide your own API key in auth-main.json
 client.login(token.token);