// src/aubio/aubioBpm.ts
import aubio from 'aubiojs';

export async function analyzeBpm(file: File | Blob): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

    const channelData =
      audioBuffer.numberOfChannels > 0
        ? audioBuffer.getChannelData(0)
        : new Float32Array();

    const aubioModule = await aubio();

    // Configurações seguras
    const bufferSize = 2048;
    const hopSize = 1024;
    const sampleRate = audioCtx.sampleRate;

    const tempoDetector = new aubioModule.Tempo(bufferSize, hopSize, sampleRate);

    let beatTimes: number[] = [];

    for (let i = 0; i < channelData.length; i += hopSize) {
      const slice = channelData.subarray(i, i + hopSize);

      // 🧠 Garante que o slice é válido
      if (!(slice instanceof Float32Array)) continue;
      if (slice.length === 0 || isNaN(slice[0])) continue;

      try {
        const onset = tempoDetector.do(slice);
        if (onset) beatTimes.push(i / sampleRate);
      } catch (err) {
        // ignora erros de blocos vazios
        continue;
      }
    }

    let bpm = tempoDetector.getBpm();
    console.log('BPM detetado:', bpm)

    // Caso Aubio não consiga calcular BPM automaticamente
    if (!bpm || isNaN(bpm)) {
      bpm = calcularBpmFallback(beatTimes);
    }

    if (!bpm || isNaN(bpm)) {
      throw new Error('BPM não pôde ser detectado.');
    }

    return Math.round(bpm);
  } catch (error) {
    console.error('Erro ao calcular BPM com Aubio:', error);
    throw new Error('Falha na análise de BPM');
  }
}

/** 
 * Fallback: estima BPM manualmente a partir dos tempos detectados
 */
function calcularBpmFallback(beatTimes: number[]): number {
  if (beatTimes.length < 2) return 0;

  const intervals: number[] = [];
  for (let i = 1; i < beatTimes.length; i++) {
    intervals.push(beatTimes[i] - beatTimes[i - 1]);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  return 60 / avgInterval;
}
