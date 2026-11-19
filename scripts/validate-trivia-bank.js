/**
 * Valida bancos de preguntas de trivia (src/data/trivia_extra/*.ts).
 *
 * Uso:  node scripts/validate-trivia-bank.js [archivo.ts ...]
 *       (sin argumentos valida todos los de src/data/trivia_extra)
 *
 * Comprueba: IDs únicos (también contra los bancos existentes), 4 opciones distintas,
 * correctIndex 0-3, difficulty 1-3, explanation y verseSupport presentes, y que cada
 * versículo citado EXISTE en los textos bíblicos del proyecto (Antiguo-/Nuevo-testamento/*.txt).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..');
const EXTRA_DIR = path.join(ROOT, 'src', 'data', 'trivia_extra');

const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

// ---------- Biblia local ----------
const bible = {}; // nombreNormalizado -> { chapter -> maxVerse }
for (const dir of ['Antiguo-testamento', 'Nuevo-testamento']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
        if (!f.endsWith('.txt')) continue;
        const name = norm(f.replace(/^\d+\s+/, '').replace(/\.txt$/, ''));
        const chapters = {};
        let ch = null;
        for (const line of fs.readFileSync(path.join(ROOT, dir, f), 'utf8').split(/\r?\n/)) {
            const c = line.match(/^CAP[IÍ]TULO\s+(\d+)/i);
            if (c) { ch = Number(c[1]); chapters[ch] = 0; continue; }
            const v = line.match(/^(\d+)\.\s/);
            if (v && ch !== null) chapters[ch] = Math.max(chapters[ch], Number(v[1]));
        }
        bible[name] = chapters;
    }
}
const ALIAS = { salmo: 'salmos', 'cantar de los cantares': 'cantares', apocalipsis: 'apocalipsis' };

function checkRef(ref) {
    const m = ref.trim().match(/^(.+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
    if (!m) return `formato inválido "${ref}"`;
    let book = norm(m[1]);
    book = ALIAS[book] || book;
    const chapters = bible[book];
    if (!chapters) return `libro desconocido "${m[1]}"`;
    const ch = Number(m[2]);
    if (!(ch in chapters)) return `capítulo inexistente "${ref}"`;
    if (m[3]) {
        const v1 = Number(m[3]);
        const v2 = m[4] ? Number(m[4]) : v1;
        if (v1 < 1 || v2 < v1 || v2 > chapters[ch]) return `versículo fuera de rango "${ref}" (el capítulo tiene ${chapters[ch]})`;
    }
    return null;
}

// ---------- Carga de TS ----------
function loadTs(file) {
    const out = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    const mod = { exports: {} };
    vm.runInNewContext(out, { module: mod, exports: mod.exports, require: () => ({}) });
    return mod.exports;
}

function existingIds() {
    const ids = new Set();
    const dirs = [path.join(ROOT, 'src', 'data'), path.join(ROOT, 'src', 'data', 'pentateuco')];
    for (const d of dirs) {
        for (const f of fs.readdirSync(d)) {
            if (!/^(trivia_|genesis|exodo|levitico|numeros|deuteronomio).*\.ts$/.test(f) && !d.endsWith('pentateuco')) continue;
            if (!f.endsWith('.ts')) continue;
            for (const m of fs.readFileSync(path.join(d, f), 'utf8').matchAll(/\bid:\s*['"]([^'"]+)['"]/g)) ids.add(m[1]);
        }
    }
    return ids;
}

const files = process.argv.length > 2
    ? process.argv.slice(2).map(f => path.resolve(f))
    : fs.existsSync(EXTRA_DIR) ? fs.readdirSync(EXTRA_DIR).filter(f => f.endsWith('.ts')).map(f => path.join(EXTRA_DIR, f)) : [];

const taken = existingIds();
const seenIds = new Set();
let problems = 0;
const summary = [];

for (const file of files) {
    const exp = loadTs(file);
    const arrays = Object.entries(exp).filter(([, v]) => Array.isArray(v));
    if (!arrays.length) { console.log(`✖ ${path.basename(file)}: no exporta ningún arreglo`); problems++; continue; }
    for (const [name, qs] of arrays) {
        const counts = { 1: 0, 2: 0, 3: 0 };
        const texts = new Set();
        qs.forEach((q, i) => {
            const tag = `${path.basename(file)}#${i + 1} (${q.id})`;
            const err = m => { console.log(`✖ ${tag}: ${m}`); problems++; };
            if (!q.id || typeof q.id !== 'string') return err('sin id');
            if (taken.has(q.id) || seenIds.has(q.id)) err('id duplicado');
            seenIds.add(q.id);
            if (!q.question || q.question.length < 15) err('pregunta vacía/corta');
            if (!Array.isArray(q.options) || q.options.length !== 4) err('debe tener 4 opciones');
            else {
                const set = new Set(q.options.map(o => norm(String(o))));
                if (set.size !== 4) err('opciones repetidas');
                if (q.options.some(o => !String(o).trim())) err('opción vacía');
            }
            if (![0, 1, 2, 3].includes(q.correctIndex)) err('correctIndex inválido');
            if (![1, 2, 3].includes(q.difficulty)) err('difficulty inválido'); else counts[q.difficulty]++;
            if (!q.explanation || q.explanation.length < 10) err('falta explanation');
            if (!q.verseSupport) err('falta verseSupport');
            else for (const ref of String(q.verseSupport).split(';')) {
                const e = checkRef(ref);
                if (e) err(`verseSupport: ${e}`);
            }
            const t = norm(q.question);
            if (texts.has(t)) err('enunciado repetido');
            texts.add(t);
        });
        const posCount = [0, 0, 0, 0];
        qs.forEach(q => { if (q.correctIndex >= 0 && q.correctIndex <= 3) posCount[q.correctIndex]++; });
        summary.push(`${path.basename(file)} → ${name}: total ${qs.length} | Semilla ${counts[1]} | Discípulo ${counts[2]} | Maestro ${counts[3]} | posición correcta [${posCount.join(',')}]`);
    }
}

console.log('\n' + summary.join('\n'));
console.log(problems ? `\n✖ ${problems} problema(s)` : '\n✔ Sin problemas');
process.exit(problems ? 1 : 0);
