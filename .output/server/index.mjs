globalThis.__nitro_main__ = import.meta.url;
import { b as NodeResponse, s as serve } from "./_libs/srvx.mjs";
import { d as defineHandler, H as HTTPError, t as toEventHandler, a as defineLazyEventHandler, b as H3Core } from "./_libs/h3.mjs";
import { d as decodePath, w as withLeadingSlash, a as withoutTrailingSlash, j as joinURL } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "node:http";
import "node:stream";
import "node:stream/promises";
import "node:https";
import "node:http2";
import "./_libs/rou3.mjs";
function lazyService(loader) {
  let promise, mod;
  return {
    fetch(req) {
      if (mod) {
        return mod.fetch(req);
      }
      if (!promise) {
        promise = loader().then((_mod) => mod = _mod.default || _mod);
      }
      return promise.then((mod2) => mod2.fetch(req));
    }
  };
}
const services = {
  ["ssr"]: lazyService(() => import("./_ssr/index.mjs"))
};
globalThis.__nitro_vite_envs__ = services;
const headers = ((m) => function headersRouteRule(event) {
  for (const [key2, value] of Object.entries(m.options || {})) {
    event.res.headers.set(key2, value);
  }
});
const assets = {
  "/assets/add-CRzFC65N.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"458c-Vk/pfZ2gdaz0LjhTUUFN+iAPMbg"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 17804,
    "path": "../public/assets/add-CRzFC65N.js"
  },
  "/assets/chevron-right-sPv31CVj.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"83-L2HFtWyJ0bb67cWKMwKyeVyDelg"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 131,
    "path": "../public/assets/chevron-right-sPv31CVj.js"
  },
  "/assets/CartesianGrid-C1L4l6pD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1a75-uYD7ZCONTn8QwmeA5iHsgF0h3OY"',
    "mtime": "2026-08-31T04:38:46.751Z",
    "size": 6773,
    "path": "../public/assets/CartesianGrid-C1L4l6pD.js"
  },
  "/assets/check-zjRxPQ_E.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"78-YP31+fBo+50gzRJR5HrbK4Qg8M4"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 120,
    "path": "../public/assets/check-zjRxPQ_E.js"
  },
  "/assets/date-4g0C9NxQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"f2-DlauVRZ/uzuc173SoVPF5LAEXcY"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 242,
    "path": "../public/assets/date-4g0C9NxQ.js"
  },
  "/assets/index-CrmUCwE_.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b78-ayuiMjVb3RotjrLMO9PYNf9L6jk"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 2936,
    "path": "../public/assets/index-CrmUCwE_.js"
  },
  "/assets/days-CjMVCChJ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1407a-NF3zKO32myQ3ELT57YgeWMXk/lk"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 82042,
    "path": "../public/assets/days-CjMVCChJ.js"
  },
  "/assets/index-D9vNTJiA.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5cb9-LyP/cPXCoDLfF1pCVmOZM4ytvYo"',
    "mtime": "2026-08-31T04:38:46.747Z",
    "size": 23737,
    "path": "../public/assets/index-D9vNTJiA.js"
  },
  "/assets/nutrition-BDNLnZ3m.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3f0-RM4dL0xkP7p8DqXxOqR2GZNrZ+s"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 1008,
    "path": "../public/assets/nutrition-BDNLnZ3m.js"
  },
  "/assets/profile-D_Sx-tu-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"1e08-e3IvztherIj4v9jBvbxl341Ejy8"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 7688,
    "path": "../public/assets/profile-D_Sx-tu-.js"
  },
  "/assets/progress-BSxi85RD.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"16e8-xMwqsRKBZgF6LtXDXYF8Ic+nwfA"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 5864,
    "path": "../public/assets/progress-BSxi85RD.js"
  },
  "/assets/search-DakO_ks-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"aa-Xb5Lar8F3ZioHwjRkLnGvrJrOgM"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 170,
    "path": "../public/assets/search-DakO_ks-.js"
  },
  "/assets/storage-D2BxJSXX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"72c7-NrOG+WQjUqlNJgYkpmkLx/4vhNY"',
    "mtime": "2026-08-31T04:38:46.792Z",
    "size": 29383,
    "path": "../public/assets/storage-D2BxJSXX.js"
  },
  "/assets/trending-down-Dvm8tIgf.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b3-BI5jER4GtzgIEEIZmwub9MG4UhM"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 179,
    "path": "../public/assets/trending-down-Dvm8tIgf.js"
  },
  "/assets/trending-up-CcZrc53p.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"b0-oHaBQldroC6woa/4vTGF45uZ0nU"',
    "mtime": "2026-08-31T04:38:46.751Z",
    "size": 176,
    "path": "../public/assets/trending-up-CcZrc53p.js"
  },
  "/assets/index-DgCzG9WO.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"6341e-50o+2ennpoggMiBk3GJraeGLk2E"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 406558,
    "path": "../public/assets/index-DgCzG9WO.js"
  },
  "/assets/LineChart-DJdjAbZK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"5e4c5-cwjQ//Nk/JGf3r2cIctoWdnZZrs"',
    "mtime": "2026-08-31T04:38:46.751Z",
    "size": 386245,
    "path": "../public/assets/LineChart-DJdjAbZK.js"
  },
  "/assets/workout-Bksk3It1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"3a4-swS+eJXWMwEDazoP3UHraOn8US0"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 932,
    "path": "../public/assets/workout-Bksk3It1.js"
  },
  "/assets/workout-CiYdUalk.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"a887-acMQPxkHJS+fKV135g6s+hUiP2o"',
    "mtime": "2026-08-31T04:38:46.750Z",
    "size": 43143,
    "path": "../public/assets/workout-CiYdUalk.js"
  },
  "/assets/zap-ClFJBMUg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": '"107-bM3Cz49nTQmSD0YnWHh2CwQPgC0"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 263,
    "path": "../public/assets/zap-ClFJBMUg.js"
  },
  "/assets/styles-Cnp7MTl0.css": {
    "type": "text/css; charset=utf-8",
    "etag": '"13a6e-qCidb81PFzzV2/WtEO+D5S2twtg"',
    "mtime": "2026-08-31T04:38:46.749Z",
    "size": 80494,
    "path": "../public/assets/styles-Cnp7MTl0.css"
  }
};
function readAsset(id) {
  const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
  return promises.readFile(resolve(serverDir, assets[id].path));
}
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
  if (assets[id]) {
    return true;
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) {
      return true;
    }
  }
  return false;
}
function getAsset(id) {
  return assets[id];
}
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
  gzip: ".gz",
  br: ".br",
  zstd: ".zst"
};
const _guinac = defineHandler((event) => {
  if (event.req.method && !METHODS.has(event.req.method)) {
    return;
  }
  let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
  let asset;
  const encodingHeader = event.req.headers.get("accept-encoding") || "";
  const encodings = [...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.res.headers.delete("Cache-Control");
      throw new HTTPError({ status: 404 });
    }
    return;
  }
  if (encodings.length > 1) {
    event.res.headers.append("Vary", "Accept-Encoding");
  }
  const ifNotMatch = event.req.headers.get("if-none-match") === asset.etag;
  if (ifNotMatch) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  const ifModifiedSinceH = event.req.headers.get("if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    event.res.status = 304;
    event.res.statusText = "Not Modified";
    return "";
  }
  if (asset.type) {
    event.res.headers.set("Content-Type", asset.type);
  }
  if (asset.etag && !event.res.headers.has("ETag")) {
    event.res.headers.set("ETag", asset.etag);
  }
  if (asset.mtime && !event.res.headers.has("Last-Modified")) {
    event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.res.headers.has("Content-Encoding")) {
    event.res.headers.set("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.res.headers.has("Content-Length")) {
    event.res.headers.set("Content-Length", asset.size.toString());
  }
  return readAsset(id);
});
const findRouteRules = /* @__PURE__ */ (() => {
  const $0 = [{ name: "headers", route: "/assets/**", handler: headers, options: { "cache-control": "public, max-age=31536000, immutable" } }];
  return (m, p) => {
    let r = [];
    if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
    let s = p.split("/"), l = s.length;
    if (l > 1) {
      if (s[1] === "assets") {
        r.unshift({ data: $0, params: { "_": s.slice(2).join("/") } });
      }
    }
    return r;
  };
})();
const _lazy_ZPz_qH = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
const findRoute = /* @__PURE__ */ (() => {
  const data = { route: "/**", handler: _lazy_ZPz_qH };
  return ((_m, p) => {
    return { data, params: { "_": p.slice(1) } };
  });
})();
const globalMiddleware = [
  toEventHandler(_guinac)
].filter(Boolean);
const errorHandler$1 = (error, event) => {
  const res = defaultHandler(error, event);
  return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
  const unhandled = error.unhandled ?? !HTTPError.isError(error);
  const { status = 500, statusText = "" } = unhandled ? {} : error;
  if (status === 404) {
    const url = event.url || new URL(event.req.url);
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      return {
        status: 302,
        headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
      };
    }
  }
  const headers2 = new Headers(unhandled ? {} : error.headers);
  headers2.set("content-type", "application/json; charset=utf-8");
  const jsonBody = unhandled ? {
    status,
    unhandled: true
  } : typeof error.toJSON === "function" ? error.toJSON() : {
    status,
    statusText,
    message: error.message
  };
  return {
    status,
    statusText,
    headers: headers2,
    body: {
      error: true,
      ...jsonBody
    }
  };
}
const errorHandlers = [errorHandler$1];
async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      const response = await handler(error, event, { defaultHandler });
      if (response) {
        return response;
      }
    } catch (error2) {
      console.error(error2);
    }
  }
}
function createNitroApp() {
  const captureError = (error, errorCtx) => {
    if (errorCtx?.event) {
      const errors = errorCtx.event.req.context?.nitro?.errors;
      if (errors) {
        errors.push({ error, context: errorCtx });
      }
    }
  };
  const h3App = createH3App({
    onError(error, event) {
      return errorHandler(error, event);
    }
  });
  let appHandler = (req) => {
    req.context ||= {};
    req.context.nitro = req.context.nitro || { errors: [] };
    return h3App.fetch(req);
  };
  return {
    fetch: appHandler,
    h3: h3App,
    hooks: void 0,
    captureError
  };
}
function createH3App(config) {
  const h3App = new H3Core(config);
  h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
  h3App["~middleware"].push(...globalMiddleware);
  h3App["~getMiddleware"] = (event, route) => {
    const pathname = event.url.pathname;
    const method = event.req.method;
    const middleware = [];
    const routeRules = getRouteRules(method, pathname);
    event.context.routeRules = routeRules?.routeRules;
    if (routeRules?.routeRuleMiddleware.length) {
      middleware.push(...routeRules.routeRuleMiddleware);
    }
    middleware.push(...h3App["~middleware"]);
    if (route?.data?.middleware?.length) {
      middleware.push(...route.data.middleware);
    }
    return middleware;
  };
  return h3App;
}
const APP_ID = "default";
function useNitroApp() {
  let instance = useNitroApp._instance;
  if (instance) {
    return instance;
  }
  instance = useNitroApp._instance = createNitroApp();
  globalThis.__nitro__ = globalThis.__nitro__ || {};
  globalThis.__nitro__[APP_ID] = instance;
  return instance;
}
function getRouteRules(method, pathname) {
  const m = findRouteRules(method, pathname);
  if (!m?.length) {
    return { routeRuleMiddleware: [] };
  }
  const routeRules = {};
  for (const layer of m) {
    for (const rule of layer.data) {
      const currentRule = routeRules[rule.name];
      if (currentRule) {
        if (rule.options === false) {
          delete routeRules[rule.name];
          continue;
        }
        if (typeof currentRule.options === "object" && typeof rule.options === "object") {
          currentRule.options = {
            ...currentRule.options,
            ...rule.options
          };
        } else {
          currentRule.options = rule.options;
        }
        currentRule.route = rule.route;
        currentRule.params = {
          ...currentRule.params,
          ...layer.params
        };
      } else if (rule.options !== false) {
        routeRules[rule.name] = {
          ...rule,
          params: layer.params
        };
      }
    }
  }
  const middleware = [];
  const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
  for (const rule of orderedRules) {
    if (rule.options === false || !rule.handler) {
      continue;
    }
    middleware.push(rule.handler(rule));
  }
  return {
    routeRules,
    routeRuleMiddleware: middleware
  };
}
function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
  process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
  process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
const tracingSrvxPlugins = [];
const _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
const port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
const host = process.env.NITRO_HOST || process.env.HOST;
const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const nitroApp = useNitroApp();
serve({
  port,
  hostname: host,
  tls: cert && key ? {
    cert,
    key
  } : void 0,
  fetch: nitroApp.fetch,
  plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
const nodeServer = {};
export {
  nodeServer as default
};
