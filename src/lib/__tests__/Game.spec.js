import Game from '../Game.js';

describe('Game', function () {
  let game;

  beforeEach(function () {
    game = new Game();
  });

  it('exists', function () {
    expect(game).to.be.ok;
  });

  it('goes to the next round', function () {
    expect(game.round).to.eq(0);
    game.nextRound();
    game.nextRound();
    game.nextRound();
    expect(game.round).to.eq(3);
  });
});
