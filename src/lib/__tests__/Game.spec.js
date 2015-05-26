import Game from '../Game.js';


describe('Game', function () {
  it('exists', function () {
    expect(new Game()).to.be.ok;
  });

  it('has a static test prop', function () {
    expect(Game.test).to.eq('testaaa');
  });
});
