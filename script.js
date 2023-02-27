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
  scale(), // PUTTING A PIN
  // Allow the background to be scaled
  // Keep the background position fixed even when the camera moves
  fixed(),
]);
background.scaleTo(
  Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
  //Math.max(width() / browserWidth, height() / browserHeight)
);

const platform = add([
  rect(width(), 50),
  pos(0, height()),
  outline(4),
  area(),
  solid(),
]);
const leftPlatform = add([
  rect(1, height()),
  pos(0, 0),
  outline(4),
  area(),
  solid(),
]);
const rightPlatform = add([
  rect(1, height()),
  pos(width(), 0),
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
    pos(rand(width() / 4, 3 * (width() / 4)), 0),
    scale(0.3),
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
    jumpspeed: 2500,
  },
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
    jumpspeed: 2500,
  },
]);

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

redPlayer.onCollide("log", () => {
  redPlayerData.logCount++;
  console.log("red player log count: ", redPlayerData.logCount);
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

// child.pos = vec2(50, 50); // set child position relative to parent
// parent.addChild(child);

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

/////

// Create parent sprite
// const parent = add([sprite("parent"), pos(100, 100)]);

// // Create child sprite
// const child = add([
//   sprite("child"),
//   pos(20, 20), // set initial position relative to parent
// ]);

// // Attach child to parent
// child.pos = vec2(50, 50); // set child position relative to parent
// parent.addChild(child);

// child.pos = vec2(50, 50); // set child position relative to parent
// child.parent = parent; // set parent of child sprite
<<<<<<< HEAD
// >>>>>>> 347e28c07663fb53d49cdca794df5b1d138c2e96


for (let i = 0; i < 3; i++) {

  // pos(rand(width() / 4, 3 * (width() / 4)), 0),
  const x = rand(width() / 4, 3 * (width() / 4))
  const y = rand(0, height())

  let log = add([
      sprite("log"),   // sprite() component makes it render as a sprite
      pos(x, y), 
      area(),// pos() component gives it position, also enables movement        // rotate() component gives it rotation
      origin("center"),
      scale(0.3)
  // origin() component defines the pivot point (defaults to "topleft")
    ])
  
  log.onUpdate(() => {
    log.pos.y += 3
    let mainX = bluePlayer.pos.x
    let mainY = bluePlayer.pos.y - 30
    let newP;
    if (log.isColliding(bluePlayer)){
      destroy(log)
      newP = add([
      sprite("log"),   // sprite() component makes it render as a sprite
      pos(mainX,mainY -30), 
      area(),// pos() component gives it position, also enables movement        // rotate() component gives it rotation
      origin("center"),
      follow(bluePlayer, -10* i ),
      scale(0.3)
    ])	
      
    }

    
    if(log.pos.y > height() -30){
      log.pos.y = 1
      log.pos.x = rand(10, width())
    }

  })


}



////// redGuy







=======
>>>>>>> f6240a802249cd50097159ecd0d0eca368eb4e62
