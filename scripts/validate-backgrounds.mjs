import {readdir, readFile, stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const backgroundsRoot = path.join(projectRoot, 'public', 'backgrounds');
const manifestPath = path.join(backgroundsRoot, 'manifest.json');
const errors = [];

/** 记录背景资源校验错误。 */
const addError = message => errors.push(message);

/** 判断入口是否为 backgrounds 目录中的安全相对路径。 */
const resolveEntry = entry => {
  if (typeof entry !== 'string' || !entry || entry.includes('\\')) return undefined;
  if (path.posix.isAbsolute(entry) || entry.includes(':')) return undefined;
  if (entry.split('/').some(part => part === '..' || part === '')) return undefined;

  const resolvedPath = path.resolve(backgroundsRoot, ...entry.split('/'));
  const relativePath = path.relative(backgroundsRoot, resolvedPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) return undefined;
  return resolvedPath;
};

/** 递归获取指定目录中的 JavaScript 文件。 */
const getJavaScriptFiles = async directory => {
  const result = [];
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await getJavaScriptFiles(entryPath));
    else if (entry.name.endsWith('.js')) result.push(entryPath);
  }
  return result;
};

let manifest;
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  addError(`无法读取 manifest.json：${error instanceof Error ? error.message : String(error)}`);
}

const itemMap = new Map();
if (!manifest || !Number.isInteger(manifest.version) || !Array.isArray(manifest.items)) {
  addError('manifest.json 必须包含整数 version 和 items 数组');
} else {
  for (const [index, item] of manifest.items.entries()) {
    const label = `items[${index}]`;
    if (!item || typeof item !== 'object') {
      addError(`${label} 必须是对象`);
      continue;
    }

    const expectedPattern = item.kind === 'css'
      ? /^css:\/\/[a-z0-9]+(?:-[a-z0-9]+)*$/
      : /^js:\/\/[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!['css', 'js'].includes(item.kind)) addError(`${label}.kind 只能是 css 或 js`);
    if (typeof item.source !== 'string' || !expectedPattern.test(item.source)) {
      addError(`${label}.source 与 kind 不匹配或格式错误`);
    } else if (itemMap.has(item.source)) {
      addError(`背景 source 重复：${item.source}`);
    } else {
      itemMap.set(item.source, item);
    }

    for (const field of ['name', 'description']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) addError(`${label}.${field} 不能为空`);
    }
    if (!['light', 'dark'].includes(item.tone)) addError(`${label}.tone 只能是 light 或 dark`);
    if (!['string', 'number'].includes(typeof item.version) || String(item.version).length === 0) {
      addError(`${label}.version 不能为空`);
    }

    const entryPath = resolveEntry(item.entry);
    if (!entryPath) {
      addError(`${label}.entry 不是安全的相对路径`);
    } else {
      try {
        if (!(await stat(entryPath)).isFile()) addError(`${label}.entry 不是文件：${item.entry}`);
      } catch {
        addError(`${label}.entry 文件不存在：${item.entry}`);
      }
      if (item.kind === 'css' && !item.entry.endsWith('.css')) addError(`${label}.entry 必须是 CSS 文件`);
      if (item.kind === 'js' && !item.entry.endsWith('.js')) addError(`${label}.entry 必须是 JS 文件`);
    }

    if (item.kind === 'css' && (!Number.isInteger(item.layers) || item.layers < 0 || item.layers > 20)) {
      addError(`${label}.layers 必须是 0 到 20 的整数`);
    }
    if (item.kind === 'js' && typeof item.fallback !== 'string') {
      addError(`${label}.fallback 必须指向 CSS 背景`);
    }
  }

  for (const item of manifest.items) {
    if (item?.kind !== 'js') continue;
    const fallback = itemMap.get(item.fallback);
    if (!fallback || fallback.kind !== 'css') addError(`${item.source} 的 fallback 不存在或不是 CSS 背景`);
  }
}

for (const requiredFile of [
  'vendor/three-0.185.1.module.min.js',
  'vendor/three.core.min.js',
  'vendor/three-LICENSE.txt',
]) {
  try {
    if (!(await stat(path.join(backgroundsRoot, requiredFile))).isFile()) addError(`缺少文件：${requiredFile}`);
  } catch {
    addError(`缺少文件：${requiredFile}`);
  }
}

try {
  const javaScriptFiles = await getJavaScriptFiles(path.join(backgroundsRoot, 'js'));
  for (const file of javaScriptFiles) {
    const result = spawnSync(process.execPath, ['--check', file], {stdio: 'inherit'});
    if (result.status !== 0) addError(`JavaScript 语法检查失败：${path.relative(projectRoot, file)}`);
  }
} catch (error) {
  addError(`无法检查背景 JavaScript：${error instanceof Error ? error.message : String(error)}`);
}

if (errors.length) {
  console.error('\n动态背景校验失败：');
  errors.forEach(error => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`动态背景校验通过，共 ${itemMap.size} 个背景。`);
