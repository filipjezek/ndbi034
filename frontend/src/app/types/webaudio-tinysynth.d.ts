declare module 'webaudio-tinysynth' {
  /**
   * [channel, note, velocity]
   */
  export type MIDIMessage = [number, number, number];

  export default class WebAudioTinySynth {
    constructor(options?: {
      quality?: 0 | 1;
      voices?: number;
      useReverb?: boolean;
    });

    getAudioContext(): AudioContext;
    setAudioContext(
      audioContext: AudioContext,
      destinationNode: AudioDestinationNode
    ): void;

    /**
     * get name of normal channel voice program
     */
    getTimbreName(m: 0, program: number): string;
    /**
     * get name of drum track note
     */
    getTimbreName(m: 1, note: number): string;

    setQuality(quality: 0 | 1): void;

    setMasterVol(volume: number): void;

    setReverbLev(lev: number): void;

    setLoop(f: boolean): void;

    setVoices(voices: number): void;

    loadMIDI(mididata: ArrayBuffer): void;

    loadMIDIUrl(url: string): void;

    playMIDI(): void;

    stopMIDI(): void;

    locateMIDI(tick: number): void;

    getPlayStatus(): {
      play: boolean;
      curTick: number;
      maxTick: number;
    };

    /**
   * Set time stamp mode that is used in send() or Channel message functions.
If mode=0 timestamp is a time of in-use audioContext's currentTime timeline. If mode=1 timestamp is HighResolutionTime timeline.
   */
    setTsMode(mode: number): void;

    setTimbre(m: 0, program: number, timbre: any): void;
    setTimbre(m: 1, note: number, timbre: any): void;

    reset(): void;

    send(data: MIDIMessage, t?: number): void;

    setProgram(channel: number, program: number): void;

    noteOn(channel: number, note: number, velocity: number, t?: number): void;

    noteOff(channel: number, note: number, t?: number): void;
  }
}
