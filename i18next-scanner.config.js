module.exports = {
  input: [
    'src/**/*.{js,html,ts}',
    '!src/**/*.spec.ts',
    '!src/assets/**',
    '!src/environments/**'
  ],
  output: './src/assets/i18n/',
  options: {
    debug: true,
    sort: true,
    removeUnused: false, // No eliminar claves no usadas por seguridad
    keySeparator: '.',
    nsSeparator: false,
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    },
    // Patrones para extraer claves de traducción
    patterns: {
      // Patrón para pipe de traducción en templates
      html: {
        pattern: /(?:translate|'translate')\s*:\s*['"`]([^'"`]+)['"`]|(?:\{\{\s*(?:'|"|`)?([^'}"`]*)(?:'|"|`)?\s*\|\s*translate(?:\s*:\s*\{[^}]*\})?\s*\}\}|(?:['"`]([^'"`]+)['"`]\s*\|\s*translate))/g,
        matchIndex: 1
      },
      // Patrón para translate.get y translate.instant en TypeScript
      typescript: {
        pattern: /(?:translate\.(?:get|instant)\(\s*['"`]([^'"`]+)['"`]|AppModule\.translate\(\s*['"`]([^'"`]+)['"`]\))/g,
        matchIndex: 1
      }
    }
  }
};

