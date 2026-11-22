#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repository_dir="$(cd -- "${script_dir}/.." && pwd)"
minimum_node_version="22.13.0"

node_meets_requirement() {
  command -v node >/dev/null 2>&1 && node -e '
    const current = process.versions.node.split(".").map(Number);
    const required = process.argv[1].split(".").map(Number);
    const comparison = current.findIndex((part, index) => part !== required[index]);
    process.exit(comparison === -1 || current[comparison] > required[comparison] ? 0 : 1);
  ' "${minimum_node_version}"
}

if ! node_meets_requirement; then
  nvm_script="${NVM_DIR:-${HOME}/.nvm}/nvm.sh"
  if [[ ! -s "${nvm_script}" ]]; then
    echo "Se requiere Node ${minimum_node_version} o una versión posterior." >&2
    exit 1
  fi

  # shellcheck source=/dev/null
  source "${nvm_script}"
  nvm use --silent >/dev/null
fi

if ! node_meets_requirement; then
  echo "La versión activa de Node no cumple el mínimo ${minimum_node_version}." >&2
  exit 1
fi

cd "${repository_dir}"

echo "Verificando pruebas con un máximo de dos workers..."
npm test -- --maxWorkers=2

echo "Verificando ESLint..."
npm run lint

echo "Verificando la compilación de producción..."
npm run build

echo "Verificación del frontend completada."
