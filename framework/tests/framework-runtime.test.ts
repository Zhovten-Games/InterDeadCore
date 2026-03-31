import { describe, expect, it } from "vitest";
import { JSDOM } from "jsdom";
import { createInterdeadFramework } from "../src/core/framework-runtime.js";

function bindDomGlobals(dom: JSDOM): void {
  (globalThis as unknown as { HTMLElement: typeof HTMLElement }).HTMLElement =
    dom.window.HTMLElement;
  (
    globalThis as unknown as { MutationObserver: typeof MutationObserver }
  ).MutationObserver = dom.window.MutationObserver;
}

describe("FrameworkRuntime", () => {
  it("ignores repeated boot calls", () => {
    const dom = new JSDOM(
      '<!doctype html><html lang="en"><head></head><body><h1 data-decorative-title>InterDead</h1></body></html>',
      { pretendToBeVisual: true },
    );

    bindDomGlobals(dom);

    const runtime = createInterdeadFramework(
      {
        enabledFeatures: { decorativeTitle: true },
        featureOptions: {
          decorativeTitle: {
            selectors: ["[data-decorative-title]"],
          },
        },
      },
      {
        windowRef: dom.window as unknown as Window,
        documentRef: dom.window.document,
      },
    );

    runtime.boot();
    runtime.boot();

    expect(
      dom.window.document.querySelectorAll("#idf-decorative-title-style"),
    ).toHaveLength(1);
    expect(
      dom.window.document.querySelectorAll(".idf-decorative-title"),
    ).toHaveLength(1);

    runtime.destroy();
  });
});
