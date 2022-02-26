# Wordle Discord Bot

Welcome to Riley's Wordle bot, built for Discord!

How to add this to your discord? Just click this link!

 https://discord.com/oauth2/authorize?client_id=946833570742280233&permissions3307520&scope=bot%20applications.commands

## Important Notes for moderators

This bot is programmed by default to respond to users in any channel. If you have a bot channel, you should probably restrict WordleBot from typing outside of those channels.

WordleBot requires the following permissions to work:

- Read Messages
- Read Message History
- Send Messages
- Use External Emojis

## How to use

This bot stores one puzzle per user, regardless of what servers it's in. The commands are as follows:

- `.wordle init` - Initializes a new Wordle puzzle. This picks from over 8,000 words, having 5 or more letters.
- `.wordle guess [word]` - Guess `word` for the puzzle solution. You get 20 guesses before the puzzle will reset. This will show which letters are in the word and in the correct place in green, and which letters are in the word, but not the correct place in yellow. If a letter is not in the word, it is shown in gray.
- `.wordle score` - Displays all of your guesses for the current puzzle.

Note that letters may be used multiple times. I have attempted to remove all controversial content, locations other than country names, person names, and brand names from the database, but I may have missed some. If you find one please message me on Discord at RileyTAS#9909.

## Attributions

This bot was made by Riley. Since I intend to remain anonymous, but may need to claim credit for this work, anyone capable of producing x such that

SHA256(x) = d2b57bba7bfa40176a62f0513ded10e1daaea379487ab65de7775bcb8b7bba25

may claim credit for this work.

All code is licensed under CC-BY SA (NC) 4.0. You may share, copy or modify any portion of this work for noncommercial purposes, as long as you cite the original source and share alike.