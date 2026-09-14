import { describe, it, expect } from "vitest";
import { decideRateLimit, GITHUB_RATE_LIMITS } from "./rate-limit";
import { MAX_REPOS_PER_ANALYSIS } from "@/services/github-engine/evidence-keys";

const rule = { limit: 3, windowMs: 1000 };

describe("decideRateLimit", () => {
  it("abre una ventana nueva en la primera petición", () => {
    expect(decideRateLimit(undefined, rule, 5000)).toEqual({
      allowed: true,
      state: { windowStart: 5000, count: 1 },
      retryAfterMs: 0,
    });
  });

  it("cuenta dentro de la ventana y bloquea al llegar al límite", () => {
    const second = decideRateLimit({ windowStart: 5000, count: 1 }, rule, 5100);
    expect(second.allowed).toBe(true);
    expect(second.state.count).toBe(2);

    const blocked = decideRateLimit({ windowStart: 5000, count: 3 }, rule, 5400);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(600);
    // Una petición rechazada no avanza el contador.
    expect(blocked.state).toEqual({ windowStart: 5000, count: 3 });
  });

  it("reinicia el contador cuando la ventana caduca", () => {
    const next = decideRateLimit({ windowStart: 5000, count: 3 }, rule, 6000);
    expect(next.allowed).toBe(true);
    expect(next.state).toEqual({ windowStart: 6000, count: 1 });
  });

  it("no se deja bloquear por un estado corrupto o con fecha futura", () => {
    expect(decideRateLimit({ windowStart: Number.NaN, count: 99 }, rule, 5000).allowed).toBe(true);
    expect(decideRateLimit({ windowStart: 9000, count: 99 }, rule, 5000).allowed).toBe(true);
  });

  it("el presupuesto de evaluate cubre un análisis completo con reintentos", () => {
    expect(GITHUB_RATE_LIMITS.evaluate.limit).toBeGreaterThan(MAX_REPOS_PER_ANALYSIS);
  });
});
