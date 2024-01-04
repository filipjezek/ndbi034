import { InjectionToken } from '@angular/core';
import WebAudioTinySynth from 'webaudio-tinysynth';

export const WEBAUDIO_SYNTH = new InjectionToken<WebAudioTinySynth>(
  'WebAudioSynth',
  {
    factory: () => {
      const synth = new WebAudioTinySynth();
      synth.setProgram(0, 20);
      return synth;
    },
    providedIn: 'root',
  }
);

export const noteNames = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export function getNoteNumber(note: string): number {
  const octave = +note.slice(-1);
  const noteName = note.slice(0, -1);
  return 12 + octave * 12 + noteNames.indexOf(noteName);
}
