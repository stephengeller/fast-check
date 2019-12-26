import fc from 'fast-check';
import { MusicPlayerModel } from './model-based/MusicPlayerModel.js';
import { MusicPlayerCommands, TrackNameArb } from './model-based/MusicPlayerCommands.js';
import { MusicPlayerImplem } from './src/MusicPlayer.js';

describe('MusicPlayer', () => {
  it('should detect potential issues with the MusicPlayer', () =>
    fc.assert(
      fc.property(fc.set(TrackNameArb, 1, 10), MusicPlayerCommands, (initialTracks, commands) => {
        // const real = new MusicPlayerImplem(initialTracks, true); // with bugs
        const real = new MusicPlayerImplem(initialTracks);
        const model = new MusicPlayerModel();
        model.numTracks = initialTracks.length;
        for (const t of initialTracks) {
          model.tracksAlreadySeen[t] = true;
        }
        fc.modelRun(() => ({ model, real }), commands);
      })
    ));
});
