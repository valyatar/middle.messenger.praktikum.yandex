import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist-test");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && full.endsWith(".js")) files.push(full);
  }
  return files;
}

function hasExt(spec) {
  return /\.[a-zA-Z0-9]+$/.test(spec);
}

function resolveCandidate(fileDir, spec) {
  const abs = path.resolve(fileDir, spec);

  if (fs.existsSync(abs + ".js")) return spec + ".js";

  if (fs.existsSync(path.join(abs, "index.js"))) return spec + "/index.js";

  return null;
}

const files = walk(DIST);

for (const file of files) {
  const dir = path.dirname(file);
  let code = fs.readFileSync(file, "utf8");
  let changed = false;

  code = code.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (m, p1, spec, p3) => {
      if (hasExt(spec)) return m;
      const fixed = resolveCandidate(dir, spec);
      if (!fixed) return m;
      changed = true;
      return `${p1}${fixed}${p3}`;
    }
  );

  code = code.replace(
    /(export\s+[^'"]*\sfrom\s+['"])(\.{1,2}\/[^'"]+)(['"])/g,
    (m, p1, spec, p3) => {
      if (hasExt(spec)) return m;
      const fixed = resolveCandidate(dir, spec);
      if (!fixed) return m;
      changed = true;
      return `${p1}${fixed}${p3}`;
    }
  );

  if (changed) {
    fs.writeFileSync(file, code, "utf8");
  }
}

console.log("fix-test-imports: done");
