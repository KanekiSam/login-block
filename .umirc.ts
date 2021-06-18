import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/login', component: '@/pages/login' }],
  fastRefresh: {},
  theme: {
    /**
     * 自定义主题配置
     */
    'brand-primary': '#4D98FF',
  },
  hash: true,
  history: { type: 'hash' },
  dynamicImport: {},
  publicPath: './',
  ignoreMomentLocale: true,
  mock: false,
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd-mobile',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
});
