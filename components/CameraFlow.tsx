"use client";

import { useEffect, useRef, useState } from "react";
import { useCamera } from "@/hooks/useCamera";
import { usePoseLandmarker } from "@/lib/pose/usePoseLandmarker";
import { useAssessmentStore, TEST_QUEUE } from "@/stores/assessmentStore";
import { FrameLandmarks, Movement, MovementAttempt, MovementFrame, Side } from "@/lib/types";
import { checkPositioning, PositioningCheck } from "@/lib/positioning";
import { calculateShoulderFlexionAngle, calculateAbductionAngle, calculateTrunkAngle } from "@/lib/angles";
import { midpoint } from "@/lib/geometry";
import { MovementStateMachine } from "@/lib/movementDetection";
import { MovingAverage } from "@/lib/smoothing";
import {
  calculateAngularVelocity,
  calculateMovementDuration,
} from "@/lib/movementMetrics";
import {
  calculateAngleBeforeCompensation,
  calculateMaxTrunkCompensation,
} from "@/lib/trunkCompensation";
import { drawPoseOverlay } from "./PoseOverlay";
import { BodyPositionGuide } from "./BodyPositionGuide";
import { Button } from "./ui/Button";
import { APP_CONFIG } from "@/config/app";
import { PainQuestionScreen } from "./screens/PainQuestionScreen";
import { useSpeech } from "@/lib/useSpeech";
import { SoundToggle } from "./shared/SoundToggle";

const MOVEMENT_TITLE: Record<Movement, string> = {
  flexion: "Flexão",
  abduction: "Elevação lateral",
};
const MOVEMENT_INSTRUCTION: Record<Movement, (side: string) => string> = {
  flexion: (side) => `Levante lentamente o braço ${side} para frente até onde conseguir confortavelmente. Não force.`,
  abduction: (side) => `Levante o braço ${side} lateralmente até onde conseguir confortavelmente.`,
};
const SIDE_LABEL: Record<Side, string> = { right: "direito", left: "esquerdo" };

const REPS = APP_CONFIG.protocol.repetitionsPerMovement;
const CALIBRATION_MS = APP_CONFIG.protocol.calibrationDurationMs;
const PEAK_HOLD_MS = APP_CONFIG.protocol.peakHoldMs;

export function CameraFlow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useCamera(videoRef);
  const speech = useSpeech();

  const screen = useAssessmentStore((s) => s.screen);
  const debugMode = useAssessmentStore((s) => s.debugMode);
  const toggleDebugMode = useAssessmentStore((s) => s.toggleDebugMode);
  const queueIndex = useAssessmentStore((s) => s.queueIndex);
  const calibration = useAssessmentStore((s) => s.calibration);

  const [positioning, setPositioning] = useState<PositioningCheck>({
    ok: false,
    key: "no_body",
    message: "Procurando você...",
  });
  const [calibrationProgress, setCalibrationProgress] = useState(0);
  const [testUi, setTestUi] = useState<{
    repIndex: number;
    angle: number | null;
    message: string;
    countdown: number | null;
    lost: boolean;
  }>({ repIndex: 0, angle: null, message: "", countdown: null, lost: false });

  // refs imperativos — não geram re-render a cada frame
  const holdStartRef = useRef<number | null>(null);
  const calibrationStartRef = useRef<number | null>(null);
  const calibrationSamplesRef = useRef<
    { trunkAngle: number; armRight: number; armLeft: number; shoulderWidth: number }[]
  >([]);

  const machineRef = useRef(new MovementStateMachine());
  const angleMaRef = useRef(new MovingAverage(5));
  const repIndexRef = useRef(0);
  const capturingRef = useRef(false);
  const framesBufferRef = useRef<MovementFrame[]>([]);
  const startTsRef = useRef(0);
  const peakTsRef = useRef(0);
  const lostCountRef = useRef(0);
  const armedRef = useRef(false);
  const reArmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastLandmarksRef = useRef<FrameLandmarks | null>(null);
  const calibrationSpokenRef = useRef(false);

  // inicia câmera assim que a tela "camera" é exibida
  useEffect(() => {
    if (screen === "camera") camera.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => {
    if (screen === "camera" && camera.status === "ready") {
      useAssessmentStore.getState().setScreen("positioning");
    }
  }, [screen, camera.status]);

  // (re)inicia bloco de teste (countdown + arma a máquina de estado) quando entramos em "test"
  useEffect(() => {
    if (screen !== "test") return;
    const item = TEST_QUEUE[queueIndex];
    const baseline = useAssessmentStore.getState().calibration;
    if (!item || !baseline) return;

    machineRef.current.reset();
    angleMaRef.current.reset();
    repIndexRef.current = 0;
    capturingRef.current = false;
    framesBufferRef.current = [];
    armedRef.current = false;

    let cancelled = false;
    let count = APP_CONFIG.protocol.countdownSeconds;
    setTestUi({ repIndex: 0, angle: null, message: "", countdown: count, lost: false });

    const tick = () => {
      if (cancelled) return;
      count -= 1;
      if (count > 0) {
        setTestUi((u) => ({ ...u, countdown: count }));
        setTimeout(tick, 1000);
      } else {
        setTestUi((u) => ({ ...u, countdown: null }));
        const neutral = item.side === "right" ? baseline.neutralArmAngleRight : baseline.neutralArmAngleLeft;
        machineRef.current.arm(neutral);
        armedRef.current = true;
        speech.speak("Pode começar.", { force: true });
      }
    };
    const initialTimer = setTimeout(tick, 1000);

    return () => {
      cancelled = true;
      clearTimeout(initialTimer);
      if (reArmTimerRef.current) clearTimeout(reArmTimerRef.current);
    };
  }, [screen, queueIndex]);

  const handleFrame = (landmarks: FrameLandmarks | null) => {
    lastLandmarksRef.current = landmarks;
    const timestamp = performance.now();
    const currentScreen = useAssessmentStore.getState().screen;

    drawFrame(landmarks, currentScreen);

    if (currentScreen === "positioning") {
      const check = checkPositioning(landmarks, 1);
      setPositioning(check);
      speech.speak(check.message);
      if (check.ok) {
        if (holdStartRef.current === null) holdStartRef.current = timestamp;
        if (timestamp - holdStartRef.current >= 1000) {
          holdStartRef.current = null;
          useAssessmentStore.getState().setScreen("calibration");
        }
      } else {
        holdStartRef.current = null;
      }
      return;
    }

    if (currentScreen === "calibration") {
      if (!landmarks) {
        calibrationStartRef.current = null;
        calibrationSamplesRef.current = [];
        setCalibrationProgress(0);
        return;
      }
      if (calibrationStartRef.current === null) calibrationStartRef.current = timestamp;
      if (!calibrationSpokenRef.current) {
        calibrationSpokenRef.current = true;
        speech.speak("Fique parado por um instante.", { force: true });
      }

      const trunkAngle = calculateTrunkAngle(
        landmarks.leftShoulder,
        landmarks.rightShoulder,
        landmarks.leftHip,
        landmarks.rightHip
      );
      const armRight = calculateShoulderFlexionAngle(landmarks.rightShoulder, landmarks.rightElbow, landmarks.rightHip);
      const armLeft = calculateShoulderFlexionAngle(landmarks.leftShoulder, landmarks.leftElbow, landmarks.leftHip);
      const shoulderW = Math.hypot(
        landmarks.leftShoulder.x - landmarks.rightShoulder.x,
        landmarks.leftShoulder.y - landmarks.rightShoulder.y
      );
      calibrationSamplesRef.current.push({ trunkAngle, armRight, armLeft, shoulderWidth: shoulderW });

      const elapsed = timestamp - calibrationStartRef.current;
      const progress = Math.min(1, elapsed / CALIBRATION_MS);
      setCalibrationProgress(progress);

      if (progress >= 1) {
        const samples = calibrationSamplesRef.current;
        const avg = (key: keyof (typeof samples)[number]) =>
          samples.reduce((sum, s) => sum + s[key], 0) / samples.length;

        useAssessmentStore.getState().setCalibration({
          shoulderWidthPx: avg("shoulderWidth"),
          hipMidpoint: midpoint(landmarks.leftHip, landmarks.rightHip),
          shoulderMidpoint: midpoint(landmarks.leftShoulder, landmarks.rightShoulder),
          neutralTrunkAngle: avg("trunkAngle"),
          neutralArmAngleRight: avg("armRight"),
          neutralArmAngleLeft: avg("armLeft"),
          capturedAt: Date.now(),
        });
        calibrationStartRef.current = null;
        calibrationSamplesRef.current = [];
        calibrationSpokenRef.current = false;
        useAssessmentStore.getState().setScreen("test");
      }
      return;
    }

    if (currentScreen === "test") {
      handleTestFrame(landmarks, timestamp);
      return;
    }
  };

  const handleTestFrame = (landmarks: FrameLandmarks | null, timestamp: number) => {
    if (!armedRef.current) return;
    const item = TEST_QUEUE[queueIndex];
    const baseline = calibration;
    if (!item || !baseline) return;

    const requiredOk =
      !!landmarks &&
      landmarks.rightShoulder.visibility !== 0 &&
      landmarks.leftShoulder.visibility !== 0;

    if (!requiredOk) {
      lostCountRef.current += 1;
      if (lostCountRef.current > 8 && !testUi.lost) {
        const lostMessage = "Perdi a referência do seu braço. Volte à posição indicada.";
        setTestUi((u) => ({ ...u, lost: true, message: lostMessage }));
        speech.speak(lostMessage, { force: true });
        // reinicia a repetição atual para não misturar dados incompletos
        machineRef.current.reset();
        framesBufferRef.current = [];
        capturingRef.current = false;
      }
      return;
    }

    if (testUi.lost) {
      setTestUi((u) => ({ ...u, lost: false, message: "" }));
      const neutral = item.side === "right" ? baseline.neutralArmAngleRight : baseline.neutralArmAngleLeft;
      machineRef.current.arm(neutral);
    }
    lostCountRef.current = 0;

    const shoulder = item.side === "right" ? landmarks!.rightShoulder : landmarks!.leftShoulder;
    const elbow = item.side === "right" ? landmarks!.rightElbow : landmarks!.leftElbow;
    const hip = item.side === "right" ? landmarks!.rightHip : landmarks!.leftHip;

    const rawAngle =
      item.movement === "flexion"
        ? calculateShoulderFlexionAngle(shoulder, elbow, hip)
        : calculateAbductionAngle(shoulder, elbow, hip);
    const angle = angleMaRef.current.push(rawAngle);
    const trunkAngle = calculateTrunkAngle(
      landmarks!.leftShoulder,
      landmarks!.rightShoulder,
      landmarks!.leftHip,
      landmarks!.rightHip
    );

    const detection = machineRef.current.update(angle);

    if (detection.justStarted) {
      startTsRef.current = timestamp;
      capturingRef.current = true;
      framesBufferRef.current = [];
    }

    if (capturingRef.current) {
      framesBufferRef.current.push({
        timestamp,
        shoulder,
        elbow,
        wrist: item.side === "right" ? landmarks!.rightWrist : landmarks!.leftWrist,
        hip,
        trunkAngle,
        armAngle: angle,
      });
    }

    if (detection.justReachedPeak) {
      peakTsRef.current = timestamp;
      speech.speak("Pode voltar.", { force: true });
    }

    if (detection.justCompleted) {
      capturingRef.current = false;
      const maxAngle = machineRef.current.getPeakAngle();
      const neutral = item.side === "right" ? baseline.neutralArmAngleRight : baseline.neutralArmAngleLeft;
      const duration = calculateMovementDuration(startTsRef.current, peakTsRef.current || timestamp);
      const attempt: MovementAttempt = {
        side: item.side,
        movement: item.movement,
        repetitionIndex: repIndexRef.current + 1,
        frames: framesBufferRef.current,
        maxAngle,
        startTimestamp: startTsRef.current,
        peakTimestamp: peakTsRef.current || timestamp,
        endTimestamp: timestamp,
        duration,
        averageAngularVelocity: calculateAngularVelocity(Math.max(0, maxAngle - neutral), duration),
        maxTrunkCompensation: calculateMaxTrunkCompensation(framesBufferRef.current, baseline.neutralTrunkAngle),
        angleBeforeCompensation: calculateAngleBeforeCompensation(framesBufferRef.current, baseline.neutralTrunkAngle),
      };
      useAssessmentStore.getState().addAttempt(attempt);
      repIndexRef.current += 1;
      framesBufferRef.current = [];

      if (repIndexRef.current >= REPS) {
        armedRef.current = false;
        useAssessmentStore.getState().setScreen("painQuestion");
        setTestUi((u) => ({ ...u, repIndex: repIndexRef.current, message: "Bloco concluído." }));
      } else {
        armedRef.current = false;
        setTestUi((u) => ({ ...u, repIndex: repIndexRef.current, message: "Muito bem. Volte à posição inicial." }));
        speech.speak("Muito bem.", { force: true });
        reArmTimerRef.current = setTimeout(() => {
          machineRef.current.arm(neutral);
          armedRef.current = true;
          setTestUi((u) => ({ ...u, message: "" }));
        }, 1600);
      }
    } else {
      setTestUi((u) => (u.angle === Math.round(angle) ? u : { ...u, angle: Math.round(angle) }));
    }
  };

  const drawFrame = (landmarks: FrameLandmarks | null, currentScreen: string) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video || !video.videoWidth) return;
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!landmarks) return;

    const item = TEST_QUEUE[queueIndex];
    const highlightSide = currentScreen === "test" ? item?.side ?? null : null;

    drawPoseOverlay(ctx, landmarks, canvas.width, canvas.height, {
      highlightSide,
      angle: highlightSide ? testUi.angle : null,
    });
  };

  usePoseLandmarker(videoRef, (lm) => handleFrame(lm), camera.status === "ready");

  const item = TEST_QUEUE[queueIndex];

  return (
    <div className="relative flex min-h-dvh w-full flex-col bg-black">
      <div
        className="relative mx-auto w-full flex-1 overflow-hidden bg-black"
        style={{
          aspectRatio: "9 / 16",
          maxHeight: "100dvh",
        }}
      >
        <video
          ref={videoRef}
          playsInline
          muted
          className="absolute inset-0 h-full w-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {(screen === "camera" || screen === "positioning") && (
          <>
            <BodyPositionGuide ok={positioning.ok} />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10 text-center">
              <p className="text-lg font-semibold text-white">
                {camera.status === "requesting" && "Solicitando acesso à câmera..."}
                {camera.status === "denied" && "Permita o acesso à câmera para continuar."}
                {camera.status === "unavailable" && "Nenhuma câmera encontrada neste dispositivo."}
                {camera.status === "ready" && positioning.message}
              </p>
            </div>
          </>
        )}

        {screen === "calibration" && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10 text-center">
            <p className="text-lg font-semibold text-white">Fique parado por um instante.</p>
            <p className="mt-1 text-sm text-white/80">Estamos ajustando a medição ao seu corpo.</p>
            <div className="mx-auto mt-4 h-2 w-48 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-moveo-primary transition-all"
                style={{ width: `${calibrationProgress * 100}%` }}
              />
            </div>
          </div>
        )}

        {screen === "test" && item && (
          <>
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-5 pt-8 text-center">
              <p className="text-sm font-medium text-white/70">
                {MOVEMENT_TITLE[item.movement]} do ombro {SIDE_LABEL[item.side]}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Rep {Math.min(repIndexRef.current + 1, REPS)} de {REPS}
              </p>
            </div>

            {testUi.countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <span className="text-7xl font-bold text-white">{testUi.countdown}</span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-10 text-center">
              {testUi.angle !== null && testUi.countdown === null && !testUi.lost && (
                <p className="mb-2 text-4xl font-bold text-white">{testUi.angle}°</p>
              )}
              <p className="text-base font-medium text-white">
                {testUi.lost
                  ? testUi.message
                  : testUi.message || MOVEMENT_INSTRUCTION[item.movement](SIDE_LABEL[item.side])}
              </p>
            </div>
          </>
        )}

        {screen === "painQuestion" && (
          <div className="absolute inset-0 flex items-center bg-moveo-bg">
            <PainQuestionScreen />
          </div>
        )}

        {debugMode && (
          <div className="absolute left-2 top-2 rounded bg-black/60 p-2 font-mono text-[10px] text-lime-300">
            <div>screen: {screen}</div>
            <div>phase: {machineRef.current.getPhase()}</div>
            <div>rep: {repIndexRef.current}</div>
            <div>angle: {testUi.angle}</div>
            <div>landmarks: {lastLandmarksRef.current ? "sim" : "não"}</div>
          </div>
        )}

        <button
          onClick={toggleDebugMode}
          className="absolute right-2 top-2 rounded bg-black/40 px-2 py-1 text-[10px] text-white/70"
        >
          debug
        </button>
        {speech.supported && <SoundToggle enabled={speech.enabled} onToggle={speech.toggle} />}
      </div>

      {(camera.status === "denied" || camera.status === "unavailable") && (
        <div className="bg-moveo-bg p-5">
          <Button onClick={() => useAssessmentStore.getState().loadDemoResult()} variant="secondary">
            Continuar em modo demonstração
          </Button>
        </div>
      )}
    </div>
  );
}
