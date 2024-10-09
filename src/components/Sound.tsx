import * as Tone from 'tone';

let player: Tone.Player | null = null;

export const playPopSound = async (): Promise<void> => {
  if (!player) {
    await Tone.start();
    const reverb = new Tone.Reverb({
      decay: 0.5,
      wet: 0.75,
    }).toDestination();

    player = new Tone.Player('/pop.wav').connect(reverb);
  }

  player.start();
};
