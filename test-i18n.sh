#!/bin/bash
# test-i18n.sh
# Script para validar la internacionalización de la aplicación Angular/Ionic

echo "===== Pruebas de Internacionalización Automatizadas ====="

# 1. Extraer claves de traducción del código
echo "Extrayendo claves de traducción..."
npm run extract-i18n

# 2. Validar que todas las claves están presentes en los archivos de traducción
echo "Validando completitud de traducciones..."
npm run validate-i18n

# 3. Verificar formato de archivos de traducción
echo "Verificando formato de archivos JSON..."
for file in src/assets/i18n/*.json; do
  if jq empty "$file" 2>/dev/null; then
    echo "✓ $file: Formato JSON válido"
  else
    echo "❌ $file: Formato JSON inválido"
    exit 1
  fi
done

# 4. Verificar que ambos idiomas soportados tienen las mismas claves
echo "Verificando equivalencia de claves entre idiomas..."
ES_KEYS=$(jq -r 'paths | join(".")' src/assets/i18n/es.json | sort)
EN_KEYS=$(jq -r 'paths | join(".")' src/assets/i18n/en.json | sort)

if diff <(echo "$ES_KEYS") <(echo "$EN_KEYS") >/dev/null; then
  echo "✓ Las claves son equivalentes en ambos idiomas"
else
  echo "❌ Hay diferencias en las claves entre idiomas:"
  diff <(echo "$ES_KEYS") <(echo "$EN_KEYS")
  exit 1
fi

# 5. Verificar el soporte de idiomas configurados
echo "Verificando soporte de idiomas..."
LANGS=$(grep -o "addLangs\(\[[^\]]*\]\)" src/app/app.module.ts | grep -o "'[^']*'" | tr -d "'")
echo "Idiomas configurados: $LANGS"



echo "===== Pruebas de internacionalización completadas ====="
