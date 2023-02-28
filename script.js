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
  constructor(color) {
    this.logCount = 17;
    this.hasRock = false;
    this.position = [];
    this.canEscape = false;
    this.winner = false;
    this.color = color;
    this.jumpSpeed = 750;
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

const redPlayerData = new Player("red");
const bluePlayerData = new Player("blue");

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
    "wall",
  ]);
  const rightPlatform = add([
    rect(1, height()),
    pos(5 * (width() / 6), 0),
    area(),
    solid(),
    opacity(0),
    "wall",
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
    { speed: 1200 },
  ]);
  console.log(redPlayer);
  console.log(redPlayer.speed);
  // redPlayer.speed = 0
  console.log(redPlayer.speed);

  const bluePlayer = add([
    sprite("blueGuy"),
    scale(0.15),
    origin("center"),
    area({ scale: 0.8 }),
    pos(2 * (width() / 3), 0),
    body(),
    { speed: 1200 },
  ]);

  wait(2, () => {
    loop(1.5, () => {
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
      //if they collide with less than 19 logs
      if (bluePlayerData.logCount < 19) {
        console.log(
          "blue collision with <19, log count at: ",
          bluePlayerData.logCount
        );
        //add the log and update the counter
        blueScore.text = bluePlayerData.addLog();
        //stacking the log on red
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
        //if they collide and they have 19 logs
      } else if (bluePlayerData.logCount == 19) {
        console.log("collision with 19");
        //add the 20th log to their data
        bluePlayerData.addLog();
        //hide their score
        blueScore.hidden = true;
        //and run the "escape" function
        escape("blue");
      } else {
        console.log("else statement??");
        return;
      }
    } else if (log.isColliding(redPlayer)) {
      if (redPlayerData.logCount + 1 == 20) {
        console.log(
          "red collision with <19, log count at: ",
          redPlayerData.logCount
        );
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

  redPlayer.onCollide("wall", () => {
    if (redPlayerData.canEscape && !redPlayerData.winner) {
      climbToWin(redPlayer, redPlayerData);
    }
  });

  bluePlayer.onCollide("wall", () => {
    if (bluePlayerData.canEscape && !bluePlayerData.winner) {
      climbToWin(bluePlayer, bluePlayerData);
    }
  });

  // function bluePlayerGameLogic(log) {
  //   if (log.isColliding(bluePlayer)) {
  //     if (bluePlayerData.logCount < 20) {
  //       blueScore.text = bluePlayerData.addLog();
  //     } else if (bluePlayerData.logCount == 19) {
  //       bluePlayerData.addLog();
  //       blueScore.hidden = true;
  //       escape("blue");
  //     }
  //   }
  // }

  // function redPlayerGameLogic(log) {
  //   if(log.isColliding(redPlayer)) {
  //     if (redPlayerData.logCount < 20) {
  //       redScore.text = redPlayerData.addLog();
  //     } else if (redPlayerData.logCount == 19) {
  //       redPlayerData.addLog();
  //       redScore.hidden = true;
  //       escape("red");
  //     }
  //   }
  // }

  // onUpdate("log", (log) => {
  //     log.pos.y += 3;
  //     redPlayerGameLogic(log);
  //     bluePlayerGameLogic(log);
  //   });

  //////////////////////////

  //////////////////////////
  //// player movement
  const blueJump = onKeyPress("i", () => {
    if (bluePlayer.isGrounded()) {
      bluePlayer.jump(bluePlayerData.jumpSpeed);
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
      redPlayer.jump(redPlayerData.jumpSpeed);
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

  // redPlayer.onCollide("log", () => {
  //   redPlayerData.logCount++;
  //   console.log("red player log count: ", redPlayerData.logCount);
  // });
});

/////////////////////////////////////////////////ESCAPING
///conditions met for starting escape, makes the text appear
//on the screen and stops adding logs to the players log count
function escape(player) {
  if (player == "red") {
    console.log("red escape function went off");
    redPlayerData.canEscape = true;
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
    console.log("blue escape function went off");
    bluePlayerData.canEscape = true;
    blueEscape = add([
      text("get to a \n cliff!", {
        size: 50,
      }),
      color(0, 0, 255),
      pos(6 * (width() / 7), height() / 2),
    ]);
    console.log("blue escape added");
    loop(0.5, () => {
      blueEscape.hidden = !blueEscape.hidden;
    });
    console.log("blue loop started");
  }
}

//when the player is at the cliff (already collided)
function climbToWin(player, playerData) {
  playerData.winner = true;
  console.log(playerData.color);
  //stop character movement
  player.speed = 0;
  playerData.jumpSpeed = 0;
  //place the log
  //make the character move up the log
  let stop = height() / 5;
  //console.log(yPos);
  console.log(player.pos.y);
  console.log(stop);
  player.moveTo(vec2(100, 100), 2);
  // do something after the sprite has reached its target position
  //and on to the cliff
  //and celebrate
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

  // add how to information
  add([
    origin("center"),
    pos(width() / 2, height() / 2),
    text("How To Play: \n \n - pick your player \n - collect the logs \n - escape the rocks \n - once you collect 20 logs, run to the cliff and climb up your tree to win! \n \n[A].red  [-].white  [LEFT].white  [-].white  [J].blue \n[D].red  [-].white  [RIGHT].white  [-].white  [L].blue \n[W].red  [-].white  [JUMP].white  [-].white  [I].blue", {
        size: 36,
        width: 600,
        font: "sinko",
        styles : {
          "red": {
            color: rgb (255, 0, 0),
          },
          "blue": {
            color: rgb (0, 0, 255)
          },
          "white": {
            color: rgb (255,255,255)
          }
        }
    }),
    color(255, 255, 255)
  ])
  //
});

///////////////////////////////// WIN GAME SCREEN/FUNCTION
function winScreen(player) {}

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
