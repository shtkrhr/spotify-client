export enum Key {
  C = 0,
  Db,
  D,
  Eb,
  E,
  F,
  Gb,
  G,
  Ab,
  A,
  Bb,
  B,
}

export const keyName = (key: Key) => {
  switch (key) {
  case Key.C: return 'C';
  case Key.Db: return 'C♯/D♭';
  case Key.D: return 'D';
  case Key.Eb: return 'D♯/E♭';
  case Key.E: return 'E';
  case Key.F: return 'F';
  case Key.Gb: return 'F♯/G♭';
  case Key.G: return 'G';
  case Key.Ab: return 'G♯/A♭';
  case Key.A: return 'A';
  case Key.Bb: return 'A♯/B♭';
  case Key.B: return 'B';
  default:
    const _: never = key;
  }
};
