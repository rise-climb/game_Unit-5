/* 
Game Begins:
  * Score for both players is 0
  * Both paddles at the center of the screen vertically, on opposite sides horizontally
  * paddles begin stationary
  * ball starts in the middle horizontally and vertically
  * starting velocity is non-0
Game Ends when one player has 11 points
  * Show who won the game 
  * Control over paddles stops
  * Ball stops moving
  * +Give an option to restart the game
  * +maybe change the background
  * ++faster for the next round
Gameplay, on each new frame:
  * the players should move
  * the logs and rocks should fall
  * check to see if top player log stack collides with log, add to stack
      * if player has 6+ logs, increase amount of rocks falling
      * if player has 10 logs, tell them to go to cliff
      *   if they have 10 logs and are at a cliff, climb stack and player wins
  *check to see it player body collides with falling rock, send in direction of other player
 
  * check if it collides with the top/bottom wall, bounce
  * check if it collides with the left/right wall, score a point
  * +if collision occurs, increase velocity 
  * +pause/resume feature
User Inputs:
  * separate keyboard controls for each paddle
  * +control paddle with mouse?
Bonus Features:
  * Versus AI (mouse control)
  * single player mode, mouse controls both sides
Visual Elements
  * The arena (static)
  * Two players (animated)
  * Falling Rocks (animated)
  * Falling Logs
  * +Score Board (static, but modified in the game)
  * ++Middle Line (static)
JavaScript Data:
  * x position of the players
  * x,y position of the falling objects
  * speed of the falling objects
  * log count for both players
  * width,height of players, objects, pit
  * x position of the cliffs
*/
