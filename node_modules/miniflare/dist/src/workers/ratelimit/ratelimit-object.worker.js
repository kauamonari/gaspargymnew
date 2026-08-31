var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  for (var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target, i = decorators.length - 1, decorator; i >= 0; i--)
    (decorator = decorators[i]) && (result = (kind ? decorator(target, key, result) : decorator(result)) || result);
  return kind && result && __defProp(target, key, result), result;
};

// src/workers/ratelimit/ratelimit-object.worker.ts
import { MiniflareDurableObject, POST } from "miniflare:shared";
var RateLimiterObject = class extends MiniflareDurableObject {
  #buckets = /* @__PURE__ */ new Map();
  #epoch = 0;
  limit = async (req) => {
    let { key, limit, period } = await req.json(), epoch = Math.floor(Date.now() / (period * 1e3));
    epoch !== this.#epoch && (this.#epoch = epoch, this.#buckets.clear());
    let value = this.#buckets.get(key) ?? 0;
    return value >= limit ? Response.json({ success: !1 }) : (this.#buckets.set(key, value + 1), Response.json({ success: !0 }));
  };
};
__decorateClass([
  POST("/limit")
], RateLimiterObject.prototype, "limit", 2);
export {
  RateLimiterObject
};
//# sourceMappingURL=ratelimit-object.worker.js.map
