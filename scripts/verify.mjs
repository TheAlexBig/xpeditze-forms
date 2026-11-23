import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const stages = [
  { name: 'ESLint autofix', command: 'npm', args: ['run', 'lint:fix'] },
  {
    name: 'Pruebas',
    command: 'npm',
    args: ['test', '--', '--maxWorkers=2'],
  },
  { name: 'ESLint', command: 'npm', args: ['run', 'lint'] },
  { name: 'Build', command: 'npm', args: ['run', 'build'] },
];

for (const stage of stages) {
  const startedAt = performance.now();
  const result = spawnSync(stage.command, stage.args, {
    cwd: repository,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  const seconds = ((performance.now() - startedAt) / 1000).toFixed(1);

  if (result.status !== 0) {
    const processFailure = result.error
      ? `No se pudo ejecutar ${stage.command}: ${result.error.message}`
      : result.signal
        ? `El proceso terminó por la señal ${result.signal}.`
        : '';
    const output = [result.stdout, result.stderr, processFailure]
      .filter(Boolean)
      .join('\n');
    const log = path.join(
      os.tmpdir(),
      `xpeditze-forms-${stage.name.toLowerCase()}-fallo.log`
    );
    writeFileSync(log, output);
    console.error(`FALLÓ: ${stage.name} (${seconds} s)`);
    console.error(output.trimEnd().split('\n').slice(-25).join('\n'));
    console.error(`Registro completo: ${log}`);
    process.exit(result.status ?? 1);
  }

  console.log(`OK: ${stage.name} (${seconds} s)`);
}

console.log('OK: verificación del frontend completada.');
