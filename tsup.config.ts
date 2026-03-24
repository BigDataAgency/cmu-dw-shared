import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'api-client/index': 'src/api-client/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
})
