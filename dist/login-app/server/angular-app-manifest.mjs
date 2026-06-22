
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
    "route": "/login"
  },
  {
    "renderMode": 2,
    "route": "/admin"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 24637, hash: 'ef2261883048ca3b091ec3186110a8e15bf41355f641c200eb67549302e05a9e', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17153, hash: '11d1bd674f2a8a6cf6f7ac923b3a932bb660d8a60dd3187ab9d24b22074fe570', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'admin/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/admin_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 30569, hash: '969a2295946bc4fa30ae07faeb647cd7af21aa4fdba965154c38ceafdc4d7fd3', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 27953, hash: '3ff4c6f59b31492e0264591223dc37ead5260aa8b8a253321c2fb766c8a31053', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'styles-OPUTW5UJ.css': {size: 8043, hash: 'i68XcmjPijU', text: () => import('./assets-chunks/styles-OPUTW5UJ_css.mjs').then(m => m.default)}
  },
};
