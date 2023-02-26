/* 
Game Begins:
  * user presses start game button
    *2 players fall from top of screen
    * the logs and rocks start to fall fall
  
Gameplay, on each new frame:
  * the players should move
  * check to see if top player log stack collides with log, add to stack
      * if player has 6+ logs, increase amount of rocks falling
      * if player has 10 logs, tell them to go to cliff
      *   if they have 10 logs and are at a cliff, climb stack and player wins
  *check to see it player body collides with falling rock, send in direction of other player
 
Game Ends when one player has 11 points
  * player has 10 logs
 `  * has to walk to a cliff
    * log stack drops next to cliff
    * player climbs log stack & goes on top of cliff

  * other player collapses
 
User Inputs:
  * two keys for each player, moves left and right
  * pressing start, title screen, all those

Bonus Features:
  * jumping
  * extra materials falling

Visual Elements
  * The arena (static)
  * Two players (animated)
  * Falling Rocks (animated)
  * Falling Logs
  * log counts for each player towards the sides (static, but modified in the game)
  
JavaScript Data:
  * x position of the players
  * x,y position of the falling objects
  * speed of the falling objects
  * log count for both players
  * width,height of players, objects, pit
  * x position of the cliffs
*/

///////////
/// Initializing Kaboom
//////////

import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
kaboom();

///////////
/// Variables
//////////

const background = document.querySelector(".background");
const titleScreenSection = document.querySelector(".titleScreenSection");
const infoScreenSection = document.querySelector(".infoScreenSection");
const endScreenSection = document.querySelector(".endScreenSection");
const gameSpace = document.querySelector(".gameSpace");
const scoreBoards = document.querySelector(".scoreboard");

const startButton = document.querySelector(".start");
const infoButton = document.querySelector("#info");
const titleScreenButton = document.querySelector(".titleScreen");

class Player {
  constructor() {
    this.logCount = 0;
    this.hasRock = false;
    this.position = [];
  }
  // .addLog()
  // .removeLog()
}

const redPlayer = new Player();
const bluePlayer = new Player();


///////////
/// Variables
//////////