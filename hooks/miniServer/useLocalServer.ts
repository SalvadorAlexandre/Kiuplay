//hooks/useLocalServer.tsx
import { useCallback, useEffect, useState } from "react";

// Tipos principais
export type FolderEntry = {
  id: string;
  name: string;
  type: "folder" | "file";
  children?: FolderEntry[];
};

export type ServerResult = {
  root: string;
  folders: FolderEntry[];
};

type UseLocalServerProps = {
  port?: number;
  manualHost?: string | null; // se o usuário quiser definir manualmente o IP
  timeoutMs?: number;
};

// Hook principal
export default function useLocalServer({
  port = 5500,
  manualHost = null,
  timeoutMs = 2500,
}: UseLocalServerProps = {}) {
  const [host, setHost] = useState<string | null>(manualHost);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [result, setResult] = useState<ServerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Define possíveis endereços do servidor
  const getCandidates = useCallback(() => {
    if (manualHost) return [manualHost];

    const hostname = typeof window !== "undefined" ? window.location.hostname : "localhost";

    const hosts = [
      `http://localhost:${port}`,
      `http://127.0.0.1:${port}`,
    ];

    // Se o app for acessado via IP local (por exemplo 192.168.x.x)
    if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1") {
      hosts.push(`http://${hostname}:${port}`);
    }

    return hosts;
  }, [manualHost, port]);

  // Testa se um endereço está ativo
  const probe = useCallback(
    async (baseUrl: string): Promise<{ ok: boolean; baseUrl: string; json?: ServerResult }> => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const resp = await fetch(`${baseUrl}/api/folders`, { signal: controller.signal });
        clearTimeout(id);

        if (!resp.ok) {
          throw new Error(`HTTP ${resp.status}`);
        }

        const json = (await resp.json()) as ServerResult;
        return { ok: true, baseUrl, json };
      } catch (err) {
        clearTimeout(id);
        return { ok: false, baseUrl };
      }
    },
    [timeoutMs]
  );

  // Checa automaticamente se o servidor está ativo
  const checkServer = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    setResult(null);
    setIsAvailable(null);

    const candidates = getCandidates();

    for (const candidate of candidates) {
      // eslint-disable-next-line no-await-in-loop
      const r = await probe(candidate);
      if (r.ok && r.json) {
        setHost(candidate);
        setIsAvailable(true);
        setResult(r.json);
        setIsChecking(false);
        return;
      }
    }

    // Nenhum servidor encontrado
    setIsAvailable(false);
    setError("⚠️ Mini-servidor local não encontrado. Inicie o servidor e recarregue o Kiuplay.");
    setIsChecking(false);
  }, [getCandidates, probe]);

  useEffect(() => {
    checkServer();
  }, [checkServer]);

  // Função manual para atualizar os dados
  const fetchFolders = useCallback(
    async (overrideHost?: string) => {
      const base = overrideHost || host;
      if (!base) throw new Error("Host não definido");
      const resp = await fetch(`${base}/api/folders`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = (await resp.json()) as ServerResult;
      setResult(json);
      return json;
    },
    [host]
  );

  return {
    host,
    setHost,
    isChecking,
    isAvailable,
    result,
    error,
    checkServer,
    fetchFolders,
  };
}