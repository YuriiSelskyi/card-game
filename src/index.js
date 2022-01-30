import Phaser from "phaser";
import CardsImg from "./assets/cards.png";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

ReactDOM.render(<App />, document.getElementById("root"));

let game;

// global object with game options
let gameOptions = {

    // card width, in pixels
    cardWidth: 334,

    // card height, in pixels
    cardHeight: 440,

    // card scale. 1 = original size, 0.5 half size and so on
    cardScale: 0.8
}

window.onload = function() {
  let gameConfig = {
      type: Phaser.AUTO,
      scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: "PlayGame",
          width: 750,
          height: 1334
      },
      scene: playGame
  }
  game = new Phaser.Game(gameConfig);
}

class playGame extends Phaser.Scene {
  constructor() {
      super("PlayGame");
  }
  preload() {
      // loading the sprite sheet with all cards
      this.load.spritesheet("cards", CardsImg, {
          frameWidth: gameOptions.cardWidth,
          frameHeight: gameOptions.cardHeight
      });
  }
  create() {
      this.deck = Phaser.Utils.Array.NumberArray(0, 51);

      // the two cards in game
      this.cardsInGame = [this.createCard(0), this.createCard(1)];

      // a tween to make first card enter into play
      this.tweens.add({
          targets: this.cardsInGame[0],
          x: game.config.width / 2,
          duration: 500,
          ease: "Cubic.easeOut"
      });
  }

  // method to create a card, given an index
  createCard(i) {

      // the card itself, a sprite created outside the stage, on the left
      let card = this.add.sprite(- gameOptions.cardWidth * gameOptions.cardScale, game.config.height / 2, "cards", this.deck[i]);

      // scale the sprite
      card.setScale(gameOptions.cardScale);

      // return the card
      return card;
  }

  // method to update cards position
  moveCards() {

      // moving the first card
      let cardToMove = this.nextCardIndex % 2;

      // tween the card outside of the stage to the right
      this.tweens.add({
          targets: this.cardsInGame[cardToMove],
          x: game.config.width + 2 * gameOptions.cardWidth * gameOptions.cardScale,
          duration: 500,
          ease: "Cubic.easeOut"
      });

      // moving the second card
      cardToMove = (this.nextCardIndex + 1) % 2;

      // tween the card to the center of the stage...
      this.tweens.add({
          targets: this.cardsInGame[cardToMove],
          y: game.config.height / 2,
          duration: 500,
          ease: "Cubic.easeOut",
          callbackScope: this,
          onComplete: function(){

              // ... then recycle the card which we moved outside the screen
              cardToMove = this.nextCardIndex % 2;
              this.cardsInGame[cardToMove].setFrame(this.deck[this.nextCardIndex]);
              this.nextCardIndex = (this.nextCardIndex + 1) % 52;
              this.cardsInGame[cardToMove].x = gameOptions.cardWidth * gameOptions.cardScale / -2;

              // now we can swipe again
              this.canSwipe = true;
          }
      });
  }
}