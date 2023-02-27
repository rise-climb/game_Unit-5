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

const browserWidth = window.innerWidth;
const browserHeight = window.innerHeight;

import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
kaboom({
  width: browserWidth,
  height: browserHeight,
});

///////////
/// Variables
//////////

class Player {
  constructor() {
    this.logCount = 0;
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

//loading the background image
let bgLoad = await loadSprite("background", "images/SUPERFINALBACKGROUND.png");

//for escaping
let redEscape = null;
let blueEscape = null;

///////////
/// loadings assets
//////////

loadSprite("log", "./images/log.png");
loadSprite("redGuy", "./images/FINALredguy.ong.png");
loadSprite("blueGuy", "./images/FINALblueguyRotated.png");

//////// gamePlay scene
scene("gamePlay", () => {
  ///// make background
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(), // PUTTING A PIN
    // Allow the background to be scaled
    // Keep the background position fixed even when the camera moves
    fixed(),
  ]);
  background.scaleTo(
    Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
    //Math.max(width() / browserWidth, height() / browserHeight)
  );
  ////make platforms
  const platform = add([
    rect(width(), 50),
    pos(0, height()),
    outline(4),
    area(),
    solid(),
  ]);
  const leftPlatform = add([
    rect(1, height()),
    pos(width() / 6, 0),
    area(),
    solid(),
    opacity(0),
  ]);
  const rightPlatform = add([
    rect(1, height()),
    pos(5 * (width() / 6), 0),
    area(),
    solid(),
    opacity(0),
  ]);

  /////////////////////////
  //// loading and spawning in players and logs

  //loadSprite("redGuy", "./images/FINALredguy.ong.png");
  const redPlayer = add([
    sprite("redGuy"),
    scale(0.15),
    origin("center"),
    area({ scale: 0.8 }),
    pos(width() / 3, 0),
    body(),
    {
      speed: 1200,
      jumpspeed: 2500,
    },
  ]);

  const bluePlayer = add([
    sprite("blueGuy"),
    scale(0.15),
    origin("center"),
    area({ scale: 0.8 }),
    pos(2 * (width() / 3), 0),
    body(),
    {
      speed: 1200,
      jumpspeed: 2500,
    },
  ]);

  wait(2, () => {
    loop(1.5, () => {
      console.log("log loaded");
      add([
        sprite("log"),
        pos(rand(width() / 4, 3 * (width() / 4)), 0),
        scale(0.3),
        area(),
        move(DOWN, 200),
        cleanup(),
        "log",
      ]);
    });
  });

  onUpdate("log", (log) => {
    log.pos.y += 3;
    let newP;
    if (log.isColliding(bluePlayer)) {
      if (bluePlayerData.logCount + 1 == 20) {
        if (bluePlayerData.logCount == 19) {
          bluePlayerData.addLog();
        }
        blueScore.hidden = true;
        escape("blue");
      } else {
        blueScore.text = bluePlayerData.addLog();
        let mainX = bluePlayer.pos.x;
        let mainY = bluePlayer.pos.y - 30;
        destroy(log);
        newP = add([
          sprite("log"),
          pos(mainX, mainY - 30),
          area(),
          origin("center"),
          follow(bluePlayer, -10), // * i),
          scale(0.3),
        ]);
      }
    } else if (log.isColliding(redPlayer)) {
      if (redPlayerData.logCount + 1 == 20) {
        if (redPlayerData.logCount == 19) {
          redPlayerData.addLog();
        }
        redScore.hidden = true;
        escape("red");
      } else {
        redScore.text = redPlayerData.addLog();
        let mainX = redPlayer.pos.x;
        let mainY = redPlayer.pos.y - 30;
        destroy(log);
        newP = add([
          sprite("log"),
          pos(mainX, mainY - 30),
          area(),
          origin("center"),
          follow(redPlayer, -10), // * i),
          scale(0.3),
        ]);
      }
    }
    // if (log.pos.y > height() - 30) {
    //   log.pos.y = 1;
    //   log.pos.x = rand(10, width());
    // }
  });

  //////////////////////////

  //////////////////////////
  //// player movement
  onKeyPress("i", () => {
    if (bluePlayer.isGrounded()) {
      bluePlayer.jump(750);
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
      redPlayer.jump(750);
    }
  });
  onKeyDown("a", () => {
    redPlayer.move(-redPlayer.speed, 0);
  });
  onKeyDown("d", () => {
    redPlayer.move(redPlayer.speed, 0);
  });

  //// player going up on logs
  function climbUpLog(player) {
    // then have player go up on the logs (image from google)
    // don't want the user to go up just have the computer do that
  }

  /////////////////////

  /////////////////////////////// SCORES
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
});

////////////////////////////////////LOG STACKING
// for (let i = 0; i < 3; i++) {
//   // pos(rand(width() / 4, 3 * (width() / 4)), 0),
//   const x = rand(width() / 4, 3 * (width() / 4));
//   const y = rand(0, height());

//   let log = add([
//     sprite("log"), // sprite() component makes it render as a sprite
//     pos(x, y),
//     area(), // pos() component gives it position, also enables movement        // rotate() component gives it rotation
//     origin("center"),
//     scale(0.3),
//     // origin() component defines the pivot point (defaults to "top left")
//   ]);

// log.onUpdate(() => {
//   log.pos.y += 3;
//   let newP;
//   if (log.isColliding(bluePlayer)) {
//     let mainX = bluePlayer.pos.x;
//     let mainY = bluePlayer.pos.y - 30;
//     destroy(log);
//     newP = add([
//       sprite("log"), // sprite() component makes it render as a sprite
//       pos(mainX, mainY - 30),
//       area(), // pos() component gives it position, also enables movement        // rotate() component gives it rotation
//       origin("center"),
//       follow(bluePlayer, -10 * i),
//       scale(0.3),
//     ]);
//   } else if (log.isColliding(redPlayer)) {
//     let mainX = redPlayer.pos.x;
//     let mainY = redPlayer.pos.y - 30;
//     destroy(log);
//     newP = add([
//       sprite("log"), // sprite() component makes it render as a sprite
//       pos(mainX, mainY - 30),
//       area(), // pos() component gives it position, also enables movement        // rotate() component gives it rotation
//       origin("center"),
//       follow(redPlayer, -10 * i),
//       scale(0.3),
//     ]);
//       }

//       // if (log.pos.y > height() - 30) {
//       //   log.pos.y = 1;
//       //   log.pos.x = rand(10, width());
//       // }
//     });
//   }
// });

/////////////////////////////////////////////////ESCAPING
///conditions met for starting escape, makes the text appear
//on the screen and stops adding logs to the players log count
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

///////////////////////////////// TITLE SCREEN
scene("titleScreen", () => {
  ///// make background
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(), // PUTTING A PIN
    // Allow the background to be scaled
    // Keep the background position fixed even when the camera moves
    fixed(),
  ]);
  background.scaleTo(
    Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
  );

  //// add buttons to go to the other scenes
  const instructButton = add([
    rect(500, 100),
    color(0, 0, 0),
    area(),
    origin("center"),
    pos(width() / 2, 6 * (height() / 7)),
    "howTo",
  ]);

  add([
    text("[How To Play].wavy", {
      size: 60,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    area(),
    origin("center"),
    pos(instructButton.pos),
    "howTo",
  ]);

  onClick("howTo", () => {
    go("instructions");
  });

  add([
    text("[Press enter to start].wavy", {
      size: 60,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    origin("center"),
    pos(width() / 2, height() / 7),
    color(255, 255, 255),
  ]);

  onKeyRelease("enter", () => {
    go("gamePlay");
  });
});

///////////////////////////////// INSTRUCTIONS SCREEN
scene("instructions", () => {
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(), // PUTTING A PIN
    // Allow the background to be scaled
    // Keep the background position fixed even when the camera moves
    fixed(),
  ]);
  background.scaleTo(
    Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
  );

  add([
    text("[Press enter to start].wavy", {
      size: 60,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    origin("center"),
    pos(width() / 2, height() / 7),
    color(255, 255, 255),
  ]);

  onKeyRelease("enter", () => {
    go("gamePlay");
  });
});

/////////////////////////////////// STARTING THE GAME
function startGame() {
  go("titleScreen");
}
startGame();

////// climbing up tree

// const tree = add([
//   sprite("tree"),
//   pos(200, 0),
// ]);

// // Define the movement function for the character sprite
// function climb() {
//   bluePlayer.move(0, -100);
// }

// // Set up collision detection between the character sprite and the tree object
// bluePlayer.collides("tree", () => {
//   // Stop the character's movement and remove the collision detection
//   bluePlayer.pause();
//   bluePlayer.collides("tree", null);

//   // Climb the tree
//   climb();
// });

// Start the game loop
// start();
