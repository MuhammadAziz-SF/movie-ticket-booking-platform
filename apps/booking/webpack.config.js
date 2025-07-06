const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/booking'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: join(__dirname, '../../proto'),
          to: 'assets/proto',
          globOptions: {
            ignore: ['**/.gitkeep'],
          },
        },
      ],
    }),
  ],
};
