// --- src/workers/bpmWorker.js (Ajustado) ---
// Importe os módulos principais do essentia.js
import { EssentiaWASM } from './node_modules/essentia.js/dist/essentia-wasm.module.js';
import Essentia from './node_modules/essentia.js/dist/essentia.js-core.es.js';

let essentia;
let isWasmLoading = false; // Flag para evitar inicialização dupla
let messageQueue = []; // Fila para segurar mensagens que chegam antes da inicialização

// Função de inicialização assíncrona
async function initializeEssentia() {
    if (essentia || isWasmLoading) return;
    isWasmLoading = true;
    try {
        // EssentiaWASM é o módulo que inicializa o WASM
        const essentiaWasmModule = await EssentiaWASM();
        // Essentia é a classe principal que usa o módulo WASM
        essentia = new Essentia(essentiaWasmModule);
        isWasmLoading = false;
        
        // Processa mensagens que chegaram durante o carregamento
        while (messageQueue.length > 0) {
            const message = messageQueue.shift();
            processMessage(message);
        }
    } catch (e) {
        console.error("Falha ao inicializar Essentia.js WASM:", e);
        isWasmLoading = false;
    }
}

// O Web Worker agora sempre inicializa o Essentia na primeira mensagem
self.onmessage = (event) => {
    if (!essentia && !isWasmLoading) {
        // Inicia a inicialização e coloca a mensagem na fila
        initializeEssentia();
        messageQueue.push(event);
    } else if (isWasmLoading) {
        // Essentia está carregando, coloca a mensagem na fila
        messageQueue.push(event);
    } else {
        // Essentia já está pronto, processa imediatamente
        processMessage(event);
    }
};

async function processMessage(event) {
    const { audioFile } = event.data;

    try {
        // Use OfflineAudioContext para processamento fora do tempo real
        const OfflineAudioContext = self.OfflineAudioContext || self.webkitOfflineAudioContext;
        // O tamanho e taxa do contexto não importam muito, pois decodificaremos um buffer existente
        const audioContext = new OfflineAudioContext(1, 1, 44100); 

        // Ler o ArrayBuffer do arquivo
        const arrayBuffer = await audioFile.arrayBuffer(); 
        
        // Decodificação do Áudio
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Essentia funciona melhor com dados mono (primeiro canal)
        const audioData = audioBuffer.getChannelData(0); 

        // Conversão para Vector (formato Essentia)
        const audioVector = essentia.arrayToVector(audioData);

        // EXTRAÇÃO DO BPM
        // 'PercivalBpmEstimator' é uma boa escolha.
        const bpmResult = essentia.PercivalBpmEstimator(audioVector);
        const bpm = Math.round(bpmResult.bpm);

        // Enviar resultado
        self.postMessage({ status: 'done', bpm: bpm });

    } catch (error) {
        console.error("Erro no worker:", error);
        self.postMessage({ status: 'error', message: error.message });
    }
}


{/**
    import Essentia from './node_modules/essentia.js/dist/essentia.js-core.es.js';

// A variável global EssentiaWASM agora está disponível.
// Você também precisará da classe Essentia, que é exposta pelo script.

// Variáveis para manter a instância do Essentia e o módulo WASM prontos
let essentia;
let essentiaWASM;

// 1. Inicialização Assíncrona (Importante!)
// Como o Essentia.js WASM é carregado e inicializado de forma assíncrona,
// precisamos aguardar sua prontidão antes de processar mensagens.
self.onmessage = async function(event) {
    // Se ainda não inicializou, faça isso agora
    if (!essentia) {
        // EssentiaWASM é o módulo (a função de inicialização que importScripts expôs)
        essentiaWASM = await EssentiaWASM(); 
        // Essentia é a classe principal
        essentia = new Essentia(essentiaWASM); 
    }

    const { audioFile } = event.data;

    try {
        // O Worker pode usar AudioContext/OfflineAudioContext
        // OfflineAudioContext é geralmente mais robusto para processamento em background.
        const OfflineAudioContext = self.OfflineAudioContext || self.webkitOfflineAudioContext;
        
        // Exemplo de como decodificar sem precisar definir a duração do contexto
        const audioContext = new OfflineAudioContext(1, 1, 44100); 

        // Ler o ArrayBuffer do arquivo
        const arrayBuffer = await audioFile.arrayBuffer(); 
        
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // Pegar os dados de áudio em float32array (Essentia prefere mono)
        const audioData = audioBuffer.getChannelData(0); 

        // 2. Conversão para Vector (formato Essentia)
        const audioVector = essentia.arrayToVector(audioData);

        // 3. EXTRAÇÃO DO BPM (O trabalho pesado)
        // Note: RhythmDescriptors é um algoritmo mais antigo. 
        // Para BPM robusto, 'PercivalBpmEstimator' ou 'BeatTrackerMultiFeature' são melhores.
        // Vou usar um algoritmo comum e eficaz aqui:
        const bpmResult = essentia.PercivalBpmEstimator(audioVector);
        const bpm = Math.round(bpmResult.bpm);

        // 4. Enviar o resultado de volta para o componente React
        self.postMessage({ status: 'done', bpm: bpm });

    } catch (error) {
        console.error("Erro no worker:", error);
        self.postMessage({ status: 'error', message: error.message });
    }
}; */}