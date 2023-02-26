/* 
Game Begins:
  * user presses start game button
    *2 players fall from top of screen
    * the logs and rocks start to fall fall
  
Game play, on each new frame:
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

class Player {
  constructor() {
    this.logCount = 7;
    this.hasRock = false;
    this.position = [];
  }
  addLog() {
    this.logCount++;
    return this.logCount;
  }
  removeLog() {
    this.logCount--;
    return this.logCount;
  }
}

const redPlayerData = new Player();
const bluePlayerData = new Player();

///////////
/// Kaboom
//////////

////////////////////////////////
//// background + platform ////

let bgLoad = await loadSprite("background", "images/SUPERFINALBACKGROUND.png");
let background = add([
  sprite("background"),
  pos(width() / 2, height() / 2),
  origin("center"),
  scale(1),
  // Allow the background to be scaled
  // Keep the background position fixed even when the camera moves
  fixed(),
]);
background.scaleTo(
  Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
);

const platform = add([
  rect(width(), 50),
  pos(0, height()),
  outline(4),
  area(),
  solid(),
]);

////
/////////////////////////

/////////////////////////
//// loading and spawning in players and logs

loop(1, () => {
  loadSprite("log", "./images/log.png");
  add([
    sprite("log"),
    pos(rand(0, width()), 0),
    scale(0.25),
    area(),
    move(DOWN, 200),
    cleanup(),
    "log",
  ]);
});

loadSprite("redGuy", "./images/FINALredguy.ong.png");
const redPlayer = add([
  sprite("redGuy"),
  scale(0.15),
  origin("center"),
  area({ scale: 0.8 }),
  pos(width() / 3, 0),
  body(),
  {
    speed: 1200,
    jumpspeed: 1000,
  },
  "player",
  "red",
]);

loadSprite("blueGuy", "./images/FINALblueguyRotated.png");
const bluePlayer = add([
  sprite("blueGuy"),
  scale(0.15),
  origin("center"),
  area({ scale: 0.8 }),
  pos(2 * (width() / 3), 0),
  body(),
  {
    speed: 1200,
    jumpspeed: 1000,
  },
  "player",
  "blue",
]);

//////////////////////////

//////////////////////////
//// player movement

onKeyPress("i", () => {
  if (bluePlayer.isGrounded()) {
    bluePlayer.jump();
  }
});

onKeyDown("j", () => {
  bluePlayer.move(-bluePlayer.speed, 0);
});
onKeyDown("l", () => {
  bluePlayer.move(bluePlayer.speed, 0);
});

onKeyPress("w", () => {
  if (redPlayer.isGrounded()) {
    redPlayer.jump();
  }
});
onKeyDown("a", () => {
  redPlayer.move(-redPlayer.speed, 0);
});
onKeyDown("d", () => {
  redPlayer.move(redPlayer.speed, 0);
});

///making the two pass each other

//layers(["normal", "obj", "ui"], "normal");

// collides("red", "blue", () => {
//   let redPos = redPlayer.pos
//   redPlayer.pos = bluePlayer.pos


// });

////
/////////////////////

//////////////  SCORES  /////////////////
/// creating the score numbers visually
const redScore = add([
  text(redPlayerData.logCount, {
    size: 175,
  }),
  color(255, 0, 0),
  pos(width() / 9, height() / 2),
]);

const blueScore = add([
  text(bluePlayerData.logCount, {
    size: 175,
  }),
  color(0, 0, 255),
  pos(7 * (width() / 8), height() / 2),
]);

/// and changing their values on log collision
redPlayer.onCollide("log", (log) => {
  if (redPlayerData.logCount < 9) {
    redScore.text = redPlayerData.addLog();
    destroy(log);
  } else if (redPlayerData.logCount == 9) {
    redPlayerData.addLog();
    destroy(log);
    redScore.hidden = true;
    escape("red");
  }
});

bluePlayer.onCollide("log", (log) => {
  if (bluePlayerData.logCount < 9) {
    blueScore.text = bluePlayerData.addLog();
    destroy(log);
  } else if (bluePlayerData.logCount == 9) {
    bluePlayerData.addLog();
    destroy(log);
    blueScore.hidden = true;
    escape("blue");
  }
});

///
////////////////////////////////////////////////

////////////////////  ESCAPING   ////////////////
///conditions met for starting escape, makes the text appear
//on the screen and stops adding logs to the players log count
let redEscape = null;
let blueEscape = null;
function escape(player) {
  if (player == "red") {
    redEscape = add([
      text("get to a \n cliff!", {
        size: 50,
      }),
      color(255, 0, 0),
      pos(width() / 11, height() / 2),
    ]);

    loop(0.5, () => {
      redEscape.hidden = !redEscape.hidden;
    });
  } else {
    blueEscape = add([
      text("get to a \n cliff!", {
        size: 50,
      }),
      color(0, 0, 255),
      pos(6 * (width() / 7), height() / 2),
    ]);
    loop(0.5, () => {
      blueEscape.hidden = !blueEscape.hidden;
    });
  }
}

////////////////////////////////////////////////
