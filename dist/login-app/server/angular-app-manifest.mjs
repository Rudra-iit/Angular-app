
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "route": "/admin"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24637, hash: '4f73bcace3234fd6d74cf6315cf4a3f6aac65f07514fc9fa43284a26c3eba62a', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17153, hash: '57e922dcc9067419b3ff794712e3cba8172815cdd2ab6f21b6b82b31b3ae85cd', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'admin/index.html': {size: 31972, hash: '935033e2bfc83e5791b8f23876c8d761201c74164ef8254a87df83735e617504', text: () => import('./assets-chunks/admin_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 26892, hash: '8d88261644bdc76acfdf86fd4ba0edec6628df56e3e37bb791369c859be08fe0', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-OPUTW5UJ.css': {size: 8043, hash: 'i68XcmjPijU', text: () => import('./assets-chunks/styles-OPUTW5UJ_css.mjs').then(m => m.default)}
  },
};
