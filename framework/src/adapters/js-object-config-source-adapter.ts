import type { FrameworkConfig } from "../contracts/framework-config.js";
import type { ConfigSourcePort } from "../ports/config-source-port.js";

export class JsObjectConfigSourceAdapter implements ConfigSourcePort {
  constructor(private readonly config: FrameworkConfig = {}) {}

  load(): FrameworkConfig {
    return this.config;
  }
}
