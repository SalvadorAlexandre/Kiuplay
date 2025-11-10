// --- public/workers/bpmWorker.js ---

// Importe EssentiaJS do core ES module DENTRO da pasta dist
import Essentia from '../essentia.js/dist/essentia.js-core.es.js'; 
// Importe o objeto WASM DENTRO da pasta dist
import { EssentiaWASM } from '../essentia.js/dist/essentia-wasm.es.js';


const essentia = new Essentia(EssentiaWASM);

/**
 * Função auxiliar para extrair BPM (sem tipos TypeScript)
 * @param audioSignal O sinal de áudio mono (Float32Array)
 * @param sampleRate A taxa de amostragem (number)
 */
function extractBpm(audioSignal, sampleRate) {
  // essentia.js lida com os tipos internamente
  const bpmResult = essentia.RhythmExtractor2013(audioSignal, sampleRate);
  const beatsArray = essentia.vectorToArray(bpmResult.ticks);
  return { 
      bpm: bpmResult.bpm, 
      beats: beatsArray
  };
}

// Escuta mensagens da thread principal
self.addEventListener('message', async (event) => {
    // Agora esperamos receber um 'audioFile' que é um Blob
    const audioBlob = event.data.audioFile;

    if (audioBlob) {
        console.log("[Worker] Blob recebido. Iniciando decodificação e extração de BPM...");
        try {
            // Decodificar o Blob DENTRO do worker
            const arrayBuffer = await audioBlob.arrayBuffer();
            
            // Em workers modernos, você pode criar um novo AudioContext *dentro* do worker
            const OfflineAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            
            // Definimos uma taxa de amostragem padrão se necessário, 44100 Hz é comum
            const sampleRate = 44100; 
            // O segundo argumento é o tamanho do buffer (frames). Usamos um valor grande.
            const offlineCtx = new OfflineAudioContext(1, sampleRate * 300, sampleRate); // 300 segundos de buffer

            // Decodifica os dados brutos do buffer
            const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
            
            // Converte para o formato Essentia (mono Float32Array)
            const audioSignal = essentia.audioBufferToMonoSignal(audioBuffer);

            // Agora, chame a função de extração
            const result = extractBpm(audioSignal, sampleRate);
            
            self.postMessage({ status: 'completed', result: result });

        } catch (error) {
            console.error("[Worker] Erro na decodificação ou extração:", error);
            // Garantimos que a mensagem de erro seja uma string simples
            const errorMessage = String(error); 
            self.postMessage({ status: 'error', message: "Erro interno do worker: " + errorMessage });
        }
    } else {
        self.postMessage({ status: 'error', message: 'Nenhum Blob de áudio recebido.' });
    }
});
