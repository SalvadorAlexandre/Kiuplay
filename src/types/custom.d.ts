// src/types/custom.d.ts (ou similar)

// src/types/custom.d.ts

// Declara um módulo curinga para qualquer importação que use worker-loader
declare module '!!worker-loader?*' {
  const WorkerConstructor: {
    new (): Worker;
  };
  export default WorkerConstructor;
}

// Opcional: Se você usa caminhos de alias como '@/public/workers/...'
declare module '@/public/workers/*' {
    const WorkerConstructor: {
        new (): Worker;
    };
    export default WorkerConstructor;
}
