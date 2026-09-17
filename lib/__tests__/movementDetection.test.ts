import { describe, it, expect } from "vitest";
import { MovementStateMachine } from "../movementDetection";

const CONFIG = {
  startDeltaDeg: 6,
  startFrames: 3,
  peakStableFrames: 3,
  peakStableToleranceDeg: 2,
  returnToNeutralDeg: 10,
};

describe("MovementStateMachine", () => {
  it("permanece IDLE até ser armada", () => {
    const machine = new MovementStateMachine(CONFIG);
    expect(machine.update(50).phase).toBe("IDLE");
  });

  it("detecta início, pico e retorno de um movimento completo", () => {
    const machine = new MovementStateMachine(CONFIG);
    machine.arm(0);
    expect(machine.getPhase()).toBe("READY");

    // ruído pequeno não deve iniciar o movimento
    machine.update(1);
    machine.update(2);
    expect(machine.getPhase()).toBe("READY");

    // subida consistente
    const r1 = machine.update(10);
    const r2 = machine.update(20);
    const r3 = machine.update(30);
    expect(r3.justStarted).toBe(true);
    expect(machine.getPhase()).toBe("ASCENDING");

    machine.update(60);
    machine.update(90);
    machine.update(120);
    machine.update(121);
    // pequenas oscilações perto do pico, dentro da tolerância configurada
    const p1 = machine.update(120.5);
    const p2 = machine.update(120.8);
    const p3 = machine.update(120.6);
    expect(p1.justReachedPeak || p2.justReachedPeak || p3.justReachedPeak).toBe(true);
    expect(machine.getPeakAngle()).toBeGreaterThanOrEqual(120);

    // desce de volta
    machine.update(90);
    machine.update(50);
    const completed = machine.update(5);
    expect(completed.justCompleted).toBe(true);
    expect(machine.getPhase()).toBe("COMPLETED");
  });

  it("pode ser re-armada para uma nova repetição", () => {
    const machine = new MovementStateMachine(CONFIG);
    machine.arm(0);
    machine.update(10);
    machine.update(20);
    machine.update(30);
    expect(machine.getPhase()).toBe("ASCENDING");

    machine.arm(0);
    expect(machine.getPhase()).toBe("READY");
  });
});
