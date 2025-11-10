
// --- Seu arquivo principal (app.js ou main.ts) ---

// Certifique-se de que o caminho para o seu worker esteja correto
const bpmWorker = new Worker('../workers/bpmWorker.ts', { type: 'module' });

// Escuta mensagens que vêm do Worker
bpmWorker.onmessage = function(event) {
    if (event.data.status === 'completed') {
        const { bpm, beats } = event.data.result;
        console.log(`[Main Thread] BPM final detectado: ${bpm}`);
        console.log(`[Main Thread] Beats:`, beats);
    } else if (event.data.status === 'error') {
        console.error("[Main Thread] Erro recebido do Worker:", event.data.message);
    }
};

async function startProcessingAudio(audioUrl: string) {
    // 1. A thread principal cria o AudioContext e decodifica o áudio
    const audioContext = new window.AudioContext();

    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 2. Prepara os dados para enviar para o worker
    // A essentia.js tem um helper para isso que pode ser usado aqui se importado
    // (ou você pode fazer manualmente pegando o canal 0 e convertendo para Float32Array)
    const audioSignal = audioBuffer.getChannelData(0); // Pega o primeiro canal

    // 3. Envia os dados para o Web Worker para processamento pesado
    // Transferable objects são eficientes
    bpmWorker.postMessage({
        audioSignal: audioSignal,
        sampleRate: audioContext.sampleRate
    }, [audioSignal.buffer]); // Transferir o buffer em vez de copiar

    console.log("[Main Thread] Dados enviados para o worker.");
}

// Chame esta função com o URL HTTP (caminhos de arquivo C:/ não funcionam em navegadores)
startProcessingAudio('./Trocos_Xuxu_Bower_x_Masta.m4a');