import { useEffect, useRef, useState } from "react";
import styles from "./GraspLinkCanvas.module.css";

const MANIFEST_URL = "/GraspLink/embed/manifest.json";
const COI_SERVICE_WORKER = "/Portfolio/coi-serviceworker.min.js";
const RELOAD_KEY = "grasplink-direct-embed-isolation-reload";

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("웹 시뮬레이터 모듈을 불러오지 못했습니다."));
    document.body.appendChild(script);
  });
}

export default function GraspLinkCanvas({ fallbackUrl, title }) {
  const canvasRef = useRef(null);
  const mountedRef = useRef(true);
  const startedRef = useRef(false);
  const [stage, setStage] = useState("idle");
  const [error, setError] = useState("");
  const [revision, setRevision] = useState("");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Temporary protection: no complete native Emscripten teardown is available.
      // A full document reload prevents an orphaned runtime after React unmount.
      if (startedRef.current) window.location.reload();
    };
  }, []);

  const start = async () => {
    if (stage === "loading" || stage === "running") return;
    setStage("loading");
    setError("");
    try {
      if (!window.isSecureContext || !("serviceWorker" in navigator)) {
        throw new Error("공유 메모리 실행에 필요한 보안 기능이 없습니다.");
      }
      if (!window.crossOriginIsolated || typeof SharedArrayBuffer !== "function") {
        if (sessionStorage.getItem(RELOAD_KEY) === "attempted") {
          throw new Error("교차 출처 격리를 활성화하지 못했습니다. 브라우저를 확인해 주세요.");
        }
        await navigator.serviceWorker.register(COI_SERVICE_WORKER, { scope: "/Portfolio/" });
        await navigator.serviceWorker.ready;
        sessionStorage.setItem(RELOAD_KEY, "attempted");
        window.location.reload();
        return;
      }
      sessionStorage.removeItem(RELOAD_KEY);

      // Same-origin sibling Pages: no copying build outputs into Portfolio.
      const response = await fetch(MANIFEST_URL + "?revisionCheck=" + Date.now(), { cache: "no-store" });
      if (!response.ok) throw new Error("원본 GraspLink 임베딩 빌드가 아직 배포되지 않았습니다.");
      const manifest = await response.json();
      if (!manifest.revision || !manifest.bundle) throw new Error("배포 매니페스트가 올바르지 않습니다.");
      const bundleUrl = new URL(manifest.bundle, location.origin);
      if (bundleUrl.origin !== location.origin || !bundleUrl.pathname.startsWith("/GraspLink/embed/")) {
        throw new Error("예상하지 못한 모듈 주소입니다.");
      }
      bundleUrl.searchParams.set("rev", manifest.revision);
      await loadScript(bundleUrl.toString());
      if (!mountedRef.current || !canvasRef.current) return;
      if (typeof window.createGraspLink !== "function") {
        throw new Error("createGraspLink 모듈 함수를 찾지 못했습니다.");
      }
      startedRef.current = true;
      setRevision(manifest.revision.slice(0, 8));
      await window.createGraspLink({
        canvas: canvasRef.current,
        locateFile: (file) => new URL(file, bundleUrl).toString(),
        printErr: (message) => console.error("[GraspLink]", message),
      });
      if (mountedRef.current) setStage("running");
    } catch (reason) {
      if (mountedRef.current) {
        setError(reason instanceof Error ? reason.message : String(reason));
        setStage("error");
      }
    }
  };

  return (
    <div className={styles.demo}>
      <div className={styles.heading}>
        <div>
          <p className={styles.subtitle}>멀티스레드 Canvas 실험 기능</p>
          <h3>{title} 직접 실행</h3>
        </div>
        <a href={fallbackUrl} target="_blank" rel="noreferrer">독립 실행 페이지 ↗</a>
      </div>
      <div className={styles.viewport}>
        <canvas ref={canvasRef} id="canvas" tabIndex={0} aria-label="GraspLink 시뮬레이터" />
        {stage !== "running" && (
          <div className={styles.overlay} role="status">
            {stage === "idle" && <p>원본 GraspLink Pages의 최신 WebAssembly를 직접 사용합니다.</p>}
            {stage === "loading" && <p>브라우저 격리 및 모듈을 확인하고 있습니다.</p>}
            {stage === "error" && <p className={styles.error}>{error}</p>}
            {stage !== "loading" && <button type="button" onClick={start}>시뮬레이터 시작</button>}
          </div>
        )}
      </div>
      <p className={styles.note}>iframe 없이 실행합니다. 배포 버전: {revision || "실행 전"}. 네이티브 런타임의 안전한 종료가 구현되기 전까지 페이지를 벗어나면 새로고침합니다.</p>
    </div>
  );
}
