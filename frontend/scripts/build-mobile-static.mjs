import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDir = path.resolve(__dirname, "..");
const projectRoot = path.resolve(frontendDir, "..");
const outputDir = path.join(frontendDir, "dist-mobile");
const envFile = path.join(frontendDir, ".env.mobile");
const capacitorCoreSource = path.join(frontendDir, "node_modules", "@capacitor", "core", "dist", "capacitor.js");

const htmlFiles = [
  "index.html",
  "quiz.html",
  "competition.html",
  "login.html",
  "register.html",
  "profile.html",
  "settings.html",
  "admin.html"
];

const assetDirs = ["css", "js", "favicon", "images"];

function parseEnvFile(raw) {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((env, line) => {
      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        return env;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, "");
      env[key] = value;
      return env;
    }, {});
}

function injectMobileMeta(html) {
  const withViewport = html.replace(
    /<meta name="viewport" content="([^"]*)"\s*\/?>/i,
    (_match, content) => {
      const normalized = content.includes("viewport-fit=cover")
        ? content
        : `${content}, viewport-fit=cover`;
      return `<meta name="viewport" content="${normalized}">`;
    }
  );

  if (withViewport.includes('name="theme-color"')) {
    return withViewport;
  }

  return withViewport.replace(
    /<meta name="viewport" content="[^"]*"\s*\/?>/i,
    (match) => `${match}\n  <meta name="theme-color" content="#0a0a0f">`
  );
}

function injectRuntimeScripts(html) {
  if (html.includes("mobile-config.js")) {
    return html;
  }

  const runtimeScripts = [
    '  <script src="./js/mobile-config.js"></script>',
    '  <script src="./js/capacitor-core.js"></script>'
  ].join("\n");

  return html.replace(
    '<script src="./js/api.js"></script>',
    `${runtimeScripts}\n<script src="./js/api.js"></script>`
  );
}

async function pathExists(target) {
  try {
    await access(target);
    return true;
  } catch (_error) {
    return false;
  }
}

async function copyStaticAssets() {
  for (const dir of assetDirs) {
    const source = path.join(projectRoot, dir);
    if (!(await pathExists(source))) {
      continue;
    }

    await cp(source, path.join(outputDir, dir), { recursive: true });
  }
}

async function copyHtmlFiles() {
  for (const filename of htmlFiles) {
    const source = path.join(projectRoot, filename);
    const raw = await readFile(source, "utf8");
    const mobileHtml = injectRuntimeScripts(injectMobileMeta(raw));
    await writeFile(path.join(outputDir, filename), mobileHtml, "utf8");
  }
}

async function writeMobileConfig() {
  const env = (await pathExists(envFile))
    ? parseEnvFile(await readFile(envFile, "utf8"))
    : {};
  const apiBaseUrl = (env.QUIZARENA_API_BASE_URL || env.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
  const content = [
    "window.__QUIZARENA_CONFIG__ = Object.assign({}, window.__QUIZARENA_CONFIG__, {",
    `  apiBaseUrl: ${JSON.stringify(apiBaseUrl)}`,
    "});",
    ""
  ].join("\n");

  await writeFile(path.join(outputDir, "js", "mobile-config.js"), content, "utf8");
}

async function copyCapacitorCore() {
  if (!(await pathExists(capacitorCoreSource))) {
    throw new Error(
      "Capacitor core runtime was not found. Run `npm install` inside /frontend before building the mobile bundle."
    );
  }

  await cp(capacitorCoreSource, path.join(outputDir, "js", "capacitor-core.js"));
}

async function main() {
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  await copyStaticAssets();
  await copyHtmlFiles();
  await copyCapacitorCore();
  await writeMobileConfig();

  console.log(`Built static mobile bundle in ${outputDir}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
