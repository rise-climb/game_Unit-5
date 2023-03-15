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

import kaboom from "https://unpkg.com/kaboom@2000.2.10/dist/kaboom.mjs";

kaboom({
  width: browserWidth,
  height: browserHeight,
});

///////////
/// Variables
//////////

class Player {
  constructor(color) {
    this.logCount = 0;
    this.hasRock = false;
    this.position = [];
    this.canEscape = false;
    this.winner = "not yet";
    this.color = color;
    this.jumpSpeed = 750;
    this.threwRock = false;
  }
  addLog() {
    this.logCount++;
    return this.logCount;
  }
  removeLog() {
    if (this.logCount > 0) {
      this.logCount--;
    }
    return this.logCount;
  }
}

let redPlayerData = new Player("red");
let bluePlayerData = new Player("blue");
let bgLoad = await loadSprite("background", "images/SUPERFINALBACKGROUND.png");
let redEscape = null;
let blueEscape = null;

///Kaboom loading sprites
loadSprite("log", "./images/log.png");
loadSprite("redGuy", "./images/FINALredguy.ong.png");
loadSprite("blueGuy", "./images/FINALblueguyRotated.png");
loadSprite("tree", "./images/newertree.png");
loadSprite("blueClimbing", "./images/round-climbing-BlueGuy.png");
loadSprite("redClimbing", "./images/round-climbing-RedGuy.png");
loadSprite("rock", "./images/rock.png");

/// Game Play Scene
scene("gamePlay", () => {
  /// instantiating player data
  redPlayerData = new Player("red");
  bluePlayerData = new Player("blue");

  /// adding sprites and backgrounds
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(),
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

  const redPlayer = add([
    sprite("redGuy"),
    scale(0.15),
    origin("center"),
    area({ scale: 0.8 }),
    pos(width() / 3, 0),
    body(),
    { speed: 1200 },
  ]);

  const bluePlayer = add([
    sprite("blueGuy"),
    scale(0.15),
    origin("center"),
    area({ scale: 0.8 }),
    pos(2 * (width() / 3), 0),
    body(),
    { speed: 1200 },
  ]);

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

  /// falling logs and rocks
  wait(2, () => {
    loop(1.5, () => {
      add([
        sprite("log"),
        pos(rand(width() / 4, 3 * (width() / 4)), 0),
        scale(0.3),
        area(),
        move(DOWN, 170),
        cleanup(),
        "log",
      ]);
    });

    wait(5, () => {
      loop(4, () => {
        add([
          sprite("rock"),
          pos(rand(width() / 4, 3 * (width() / 4)), 0),
          scale(0.2),
          area(),
          move(DOWN, 150),
          cleanup(),
          "rock",
          {
            thrown: false,
          },
        ]);
      });
    });
  });

  /// carrying logs on player + scoring
  onUpdate("log", (log) => {
    log.pos.y += 3;
    let newP;
    if (
      log.isColliding(bluePlayer) &&
      bluePlayerData.winner == "not yet" &&
      redPlayerData.winner == "not yet"
    ) {
      if (bluePlayerData.logCount < 19) {
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
          "carriedLog",
        ]);
      } else if (bluePlayerData.logCount == 19) {
        bluePlayerData.addLog();
        blueScore.hidden = true;
        escape("blue");
      } else {
        return;
      }
    } else if (
      log.isColliding(redPlayer) &&
      bluePlayerData.winner == "not yet" &&
      redPlayerData.winner == "not yet"
    ) {
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
          "carriedLog",
        ]);
      }
    }
  });

  /// rock collisions
  redPlayer.onCollide("rock", (rockFalling) => {
    if (bluePlayerData.threwRock) {
      destroy(rockFalling);
      redScore.text = redPlayerData.removeLog();
      bluePlayerData.threwRock = false;
    } else {
      redPlayerData.threwRock = true;
      let mainX = redPlayer.pos.x;
      let mainY = redPlayer.pos.y - 30;
      destroy(rockFalling);
      add([
        sprite("rock"),
        pos(mainX, mainY - 30),
        area(),
        origin("center"),
        move(bluePlayer.pos.angle(redPlayer.pos), 1200),
        scale(0.18),
        cleanup(),
        "rock",
      ]);
    }
  });

  bluePlayer.onCollide("rock", (rockFalling) => {
    if (redPlayerData.threwRock) {
      destroy(rockFalling);
      blueScore.text = bluePlayerData.removeLog();
      redPlayerData.threwRock = false;
    } else {
      bluePlayerData.threwRock = true;
      let mainX = bluePlayer.pos.x;
      let mainY = bluePlayer.pos.y - 30;
      destroy(rockFalling);
      add([
        sprite("rock"),
        pos(mainX, mainY - 30),
        area(),
        origin("center"),
        move(redPlayer.pos.angle(bluePlayer.pos), 1200),
        scale(0.18),
        cleanup(),
        "rock",
      ]);
    }
  });

  /// wall collision
  redPlayer.onCollide("wall", (wall) => {
    if (redPlayerData.canEscape && redPlayerData.winner == "not yet") {
      bluePlayerData.winner = "too late :(";
      redEscape.hidden = true;
      if (blueEscape) {
        blueEscape.hidden = true;
      }
      climbToWin(
        redPlayer,
        redPlayerData,
        wall.pos,
        "redClimbing",
        bluePlayer,
        redScore,
        blueScore
      );
    }
  });

  bluePlayer.onCollide("wall", (wall) => {
    if (bluePlayerData.canEscape && bluePlayerData.winner == "not yet") {
      redPlayerData.winner = "too late :(";
      blueEscape.hidden = true;
      if (redEscape) {
        redEscape.hidden = true;
      }
      climbToWin(
        bluePlayer,
        bluePlayerData,
        wall.pos,
        "blueClimbing",
        redPlayer,
        redScore,
        blueScore
      );
    }
  });

  /// player movement
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
});

///// HELPER FUNCTIONS

/// escape - player has enough logs to try and escape
function escape(player) {
  if (player == "red") {
    redPlayerData.canEscape = true;
    redEscape = add([
      text("get to a \n cliff!", {
        size: 50,
      }),
      color(255, 0, 0),
      pos(width() / 11, height() / 2),
    ]);

    loop(0.5, () => {
      if (
        redPlayerData.winner != "too late :(" &&
        bluePlayerData.winner != "too late :("
      ) {
        redEscape.hidden = !redEscape.hidden;
      }
    });
  } else {
    bluePlayerData.canEscape = true;
    blueEscape = add([
      text("get to a \n cliff!", {
        size: 50,
      }),
      color(0, 0, 255),
      pos(6 * (width() / 7), height() / 2),
    ]);
    loop(0.5, () => {
      if (
        redPlayerData.winner != "too late :(" &&
        bluePlayerData.winner != "too late :("
      ) {
        blueEscape.hidden = !blueEscape.hidden;
      }
    });
  }
  const leftBarrier = add([
    rect(1, height()),
    pos(1.5 * (width() / 6), 0),
    area(),
    solid(),
    opacity(0),
  ]);

  const rightBarrier = add([
    rect(1, height()),
    pos(5.5 * (width() / 6), 0),
    area(),
    solid(),
    opacity(0),
  ]);
}

/// climb to win - player has already won, sets the stage to make them climb up the log and disables more game play
function climbToWin(
  player,
  playerData,
  treePos,
  playerClimbing,
  loser,
  redScore,
  blueScore
) {
  let side;
  let skyLine = add([
    rect(width(), 1),
    pos(0, 10),
    area(),
    solid(),
    opacity(0),
    "skyLine",
  ]);

  playerData.winner = true;
  destroyAll("carriedLog");
  treePos.y = height() - 25;
  if (treePos.x < width() / 2) {
    side = "left";
    treePos.x += 150;
  } else {
    side = "right";
    treePos.x -= 175;
  }
  add([sprite("tree"), scale(0.6, 0.95), origin("bot"), pos(treePos)]);
  wait(0.5, () => {
    add([
      sprite(playerClimbing),
      scale(0.3),
      origin("center"),
      pos(treePos.x, treePos.y - 35),
      area(),
      move(UP, 200),
      "winner",
    ]);
    destroy(player);
    skyLine.onCollide("winner", (winner) => {
      destroy(winner);
      celebrate(playerData, side, treePos.x, loser, redScore, blueScore);
      winScreen(playerData.color);
    });
  });
}

/// celebrate - makes them actually climb the log
function celebrate(playerData, side, treePosX, loser, redScore, blueScore) {
  redScore.text = "";
  blueScore.text = "";
  let celebratingPos = {};
  let winnerColor = "";
  let loserColor;
  if (side == "left") {
    celebratingPos.x = treePosX - 100;
  } else {
    celebratingPos.x = treePosX + 100;
  }
  celebratingPos.y = 100;
  if (playerData.color == "red") {
    winnerColor = "redGuy";
    loserColor = "blueGuy";
  } else {
    winnerColor = "blueGuy";
    loserColor = "redGuy";
  }
  console.log(winnerColor, celebratingPos);
  add([
    sprite(winnerColor),
    scale(0.15),
    origin("center"),
    pos(celebratingPos.x, celebratingPos.y),
  ]);
  let layingPosition = loser.pos;
  destroy(loser);
  add([
    sprite(loserColor),
    scale(0.15),
    origin("center"),
    rotate(90),
    pos(layingPosition.x, layingPosition.y),
  ]);
}

///// OTHER SCENES

scene("titleScreen", () => {
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(),
    fixed(),
  ]);
  background.scaleTo(
    Math.max(width() / bgLoad.tex.width, height() / bgLoad.tex.height)
  );

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
    text("[Rise & Climb].wavy", {
      size: 100,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    area(),
    pos(center()),
    origin("center"),
  ]);

  let startButton = add([
    rect(400, 100),
    color(0, 0, 0),
    area(),
    origin("center"),
    pos(width() / 2, height() / 7),
    "startButton",
  ]);

  add([
    text("[Start Game].wavy", {
      size: 60,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    area(),
    origin("center"),
    pos(startButton.pos),
    color(255, 255, 255),
    "startButton",
  ]);

  onClick("startButton", () => {
    go("gamePlay");
  });
});

scene("instructions", () => {
  let background = add([
    sprite("background"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(),
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

  add([
    origin("center"),
    pos(width() / 2, height() / 2),
    text(
      "How To Play: \n \n - pick your player \n - collect the logs \n - catch the rocks, and throw them at your opponent \n - once you collect 20 logs, run to the cliff and climb up your tree to win! \n \n[A].red  [-].white  [LEFT].white  [-].white  [J].blue \n[D].red  [-].white  [RIGHT].white  [-].white  [L].blue \n[W].red  [-].white  [JUMP].white  [-].white  [I].blue",
      {
        size: 40,
        width: 600,
        styles: {
          red: {
            color: rgb(255, 0, 0),
          },
          blue: {
            color: rgb(0, 0, 255),
          },
          white: {
            color: rgb(255, 255, 255),
          },
        },
      }
    ),
  ]);
});

function winScreen(playerColor) {
  const restartButton = add([
    rect(400, 100),
    color(0, 0, 0),
    area(),
    origin("center"),
    pos(width() / 2, 5 * (height() / 7)),
    "restart",
  ]);

  add([
    text("[press enter to go to title screen].wavy", {
      size: 30,
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
    go("titleScreen");
  });

  add([
    text("[Restart]", {
      size: 60,
      styles: {
        wavy: (idx, ch) => ({
          pos: vec2(0, wave(-4, 4, time() * 6 + idx * 0.5)),
        }),
      },
    }),
    area(),
    origin("center"),
    pos(restartButton.pos),
    "Restart",
  ]);

  add([
    text(`${playerColor} player wins!`),
    origin("bot"),
    pos(width() / 2, height() / 2),
  ]);

  onClick("restart", () => {
    go("gamePlay");
  });
}

function startGame() {
  go("titleScreen");
}
startGame();
