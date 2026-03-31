import { describe, expect, it, vi } from "vitest";
import { JSDOM } from "jsdom";
import { DecorativeTitleFeature } from "../src/features/decorative-title/decorative-title-feature.js";

function createDom(markup: string): JSDOM {
  return new JSDOM(markup, { pretendToBeVisual: true });
}

function bindDomGlobals(dom: JSDOM): void {
  (globalThis as unknown as { HTMLElement: typeof HTMLElement }).HTMLElement =
    dom.window.HTMLElement;
  (
    globalThis as unknown as { MutationObserver: typeof MutationObserver }
  ).MutationObserver = dom.window.MutationObserver;
}

describe("DecorativeTitleFeature", () => {
  it("mounts decorative svg title into opt-in heading", () => {
    const dom = createDom(
      '<!doctype html><html lang="en"><head></head><body><h1 data-decorative-title>InterDead</h1></body></html>',
    );

    bindDomGlobals(dom);

    const feature = new DecorativeTitleFeature(dom.window, dom.window.document);
    feature.updateConfig({
      featureOptions: {
        decorativeTitle: {
          selectors: ["[data-decorative-title]"],
        },
      },
    });

    feature.mount();

    const heading = dom.window.document.querySelector("h1") as HTMLElement;
    expect(
      heading.querySelector(".idf-decorative-title__source")?.textContent,
    ).toBe("InterDead");
    expect(heading.querySelector(".idf-decorative-title__svg")).not.toBeNull();

    feature.destroy();
  });

  it("rebuilds structure when external code replaces heading content", async () => {
    const dom = createDom(
      '<!doctype html><html lang="en"><head></head><body><h1 data-decorative-title>InterDead</h1></body></html>',
    );

    bindDomGlobals(dom);

    const feature = new DecorativeTitleFeature(dom.window, dom.window.document);
    feature.updateConfig({
      featureOptions: {
        decorativeTitle: {
          selectors: ["[data-decorative-title]"],
        },
      },
    });

    feature.mount();

    const heading = dom.window.document.querySelector("h1") as HTMLElement;
    heading.textContent = "New Signal";
    await new Promise((resolve) => dom.window.setTimeout(resolve, 0));

    expect(
      heading.querySelector(".idf-decorative-title__source")?.textContent,
    ).toBe("New Signal");
    expect(heading.querySelector(".idf-decorative-title__svg")).not.toBeNull();

    feature.destroy();
  });

  it("applies and removes pulse class on membrane event", () => {
    vi.useFakeTimers();

    const dom = createDom(
      '<!doctype html><html lang="en"><head></head><body><h1 data-decorative-title>InterDead</h1></body></html>',
    );

    bindDomGlobals(dom);

    const feature = new DecorativeTitleFeature(dom.window, dom.window.document);
    feature.updateConfig({
      featureOptions: {
        decorativeTitle: {
          selectors: ["[data-decorative-title]"],
          pulseHighlightDurationMs: 180,
        },
      },
    });

    feature.mount();

    dom.window.dispatchEvent(
      new dom.window.CustomEvent("interdead:membrane-pulse", {
        detail: { xRatio: 0.2, yRatio: 0.8 },
      }),
    );

    const title = dom.window.document.querySelector(
      ".idf-decorative-title",
    ) as HTMLElement;
    expect(title.classList.contains("idf-decorative-title--pulse")).toBe(true);
    expect(title.style.getPropertyValue("--idf-pulse-x")).toBe("20%");
    expect(title.style.getPropertyValue("--idf-pulse-y")).toBe("80%");

    vi.advanceTimersByTime(200);
    expect(title.classList.contains("idf-decorative-title--pulse")).toBe(false);

    feature.destroy();
    vi.useRealTimers();
  });

  it("restores semantic heading text on destroy", () => {
    const dom = createDom(
      '<!doctype html><html lang="en"><head></head><body><h1 data-decorative-title>InterDead</h1></body></html>',
    );

    bindDomGlobals(dom);

    const feature = new DecorativeTitleFeature(dom.window, dom.window.document);
    feature.updateConfig({
      featureOptions: {
        decorativeTitle: {
          selectors: ["[data-decorative-title]"],
        },
      },
    });

    feature.mount();
    feature.destroy();

    const heading = dom.window.document.querySelector("h1") as HTMLElement;
    expect(heading.textContent).toBe("InterDead");
    expect(heading.querySelector(".idf-decorative-title")).toBeNull();
  });
});
