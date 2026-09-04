// Roda depois do `npm run build`. Confirma que a pasta configurada em
// capacitor.config.ts realmente existe e tem um index.html; se não existir
// (ex: o Nitro publicou em outro caminho nessa versão), procura a pasta certa
// automaticamente e corrige o capacitor.config.ts antes do `cap sync`.
import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CONFIG_PATH = "capacitor.config.ts";
const CURRENT_WEBDIR = ".output/public";

function hasIndexHtml(dir) {
  return existsSync(join(dir, "index.html"));
}

function findClientDir(root, depth = 0) {
  if (depth > 4) return null;
  if (!existsSync(root)) return null;
  if (hasIndexHtml(root)) return root;

  let entries;
  try {
    entries = readdirSync(root);
  } catch {
    return null;
  }

  for (const entry of entries) {
    if (entry === "node_modules" || entry.startsWith(".git")) continue;
    const full = join(root, entry);
    if (statSync(full).isDirectory()) {
      const found = findClientDir(full, depth + 1);
      if (found) return found;
    }
  }
  return null;
}

if (hasIndexHtml(CURRENT_WEBDIR)) {
  console.log(`✅ webDir "${CURRENT_WEBDIR}" está correto (tem index.html).`);
  process.exit(0);
}

console.log(`⚠️  "${CURRENT_WEBDIR}" não tem index.html. Procurando a pasta certa...`);

const candidates = ["dist", ".output", "build", "out", ".vinxi", ".nitro", ".vercel", "public"];
let found = null;
for (const c of candidates) {
  found = findClientDir(c);
  if (found) break;
}

if (!found) {
  console.error(
    "❌ Não encontrei nenhuma pasta de build com index.html nos candidatos conhecidos.",
  );
  console.error("📂 Estrutura da raiz do projeto após o build (excluindo node_modules):");
  function printTree(dir, prefix = "", depth = 0) {
    if (depth > 3) return;
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry === "node_modules" || entry === ".git") continue;
      const full = join(dir, entry);
      const isDir = statSync(full).isDirectory();
      console.error(`${prefix}${entry}${isDir ? "/" : ""}`);
      if (isDir) printTree(full, prefix + "  ", depth + 1);
    }
  }
  printTree(".");
  process.exit(1);
}

console.log(`✅ Encontrado: "${found}". Atualizando capacitor.config.ts...`);

const configSrc = readFileSync(CONFIG_PATH, "utf8");
const updated = configSrc.replace(/webDir:\s*["'`][^"'`]+["'`]/, `webDir: "${found}"`);
writeFileSync(CONFIG_PATH, updated);

console.log("✅ capacitor.config.ts atualizado.");
