/* TENKEN Service Worker（オフライン起動。FR-304, FR-305, OFF-01, OFF-07, SEC-07）
 *
 * - アプリ本体（HTML・JS・CSS・アイコン・点検表の定義を含むコード）を事前にキャッシュし、通信なしで起動できるようにする。
 * - 点検記録・写真はキャッシュしない（localStorage・IndexedDB にだけある。SEC-07）。
 * - 新しい版が届いても skipWaiting しない。点検中に版が切り替わって画面が読み直されることを防ぐ（OFF-07）。
 *   新しい版は、アプリを一度すべて閉じて、次に開いたときに使われる。
 *
 * このファイルは scripts/build-sw.mjs がビルド後に out/sw.js として書き出す（版・置き場所・事前キャッシュの一覧を埋め込む）。
 */
const VERSION = "90f39779c66e"
const BASE = "/tenken"
const PRECACHE = ["/tenken/","/tenken/404.html","/tenken/404/","/tenken/_next/static/chunks/11390db7.c696782f2ce29acd.js","/tenken/_next/static/chunks/1189-87fae5dc292c101d.js","/tenken/_next/static/chunks/1255-cc9bc7d1277c414d.js","/tenken/_next/static/chunks/1347-7d6f44261f25c971.js","/tenken/_next/static/chunks/1646.a93085a0445ba909.js","/tenken/_next/static/chunks/2400.2e0ff856ac1c0d14.js","/tenken/_next/static/chunks/254-43b5718db3579722.js","/tenken/_next/static/chunks/2602-8b9dbc2de573173c.js","/tenken/_next/static/chunks/2619-04bc32f026a0d946.js","/tenken/_next/static/chunks/2702-a34be188b2bdc9ed.js","/tenken/_next/static/chunks/2769.5b75c7bddf7ca30a.js","/tenken/_next/static/chunks/285.486ffd689e307ef0.js","/tenken/_next/static/chunks/3723-493c6214b30091a4.js","/tenken/_next/static/chunks/426.f908076804dcd8f3.js","/tenken/_next/static/chunks/4296-9a60065c116afc75.js","/tenken/_next/static/chunks/4586-85f77a6c79d03182.js","/tenken/_next/static/chunks/4876-f6e5ca0670d74334.js","/tenken/_next/static/chunks/4927-48017b6306eee350.js","/tenken/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js","/tenken/_next/static/chunks/5139.e4ff9cc3669129ed.js","/tenken/_next/static/chunks/5263-c4d12e83d4f03fbd.js","/tenken/_next/static/chunks/5485-b15cde79ec2cf833.js","/tenken/_next/static/chunks/5740-2bb3c03d4300ccb1.js","/tenken/_next/static/chunks/5862-d83bd3f70bbd2951.js","/tenken/_next/static/chunks/6068-ae5c292218d5b769.js","/tenken/_next/static/chunks/6133-e58a995bf91542e3.js","/tenken/_next/static/chunks/6375-02328a9ce0cc1c36.js","/tenken/_next/static/chunks/6627.15d63202ad2be10d.js","/tenken/_next/static/chunks/668-a4810151d8a5fbf0.js","/tenken/_next/static/chunks/7060.0dacc4b9c65949cc.js","/tenken/_next/static/chunks/7087-b6b137cb032bfaa0.js","/tenken/_next/static/chunks/749-c53ff2a0a3b60bc6.js","/tenken/_next/static/chunks/7632-8d93bb31bb6c08b7.js","/tenken/_next/static/chunks/8303-a97ada094345f7b8.js","/tenken/_next/static/chunks/8495.308bae82654d4d7d.js","/tenken/_next/static/chunks/864b0550.09fa19657f4075d0.js","/tenken/_next/static/chunks/874-cf0b3832da7c1bc9.js","/tenken/_next/static/chunks/8955-deb424aa90ff21aa.js","/tenken/_next/static/chunks/9254.05e8eaed3ed9c3ad.js","/tenken/_next/static/chunks/9267-e14595fc13b214ce.js","/tenken/_next/static/chunks/9349.d24ab9cbb6f1228e.js","/tenken/_next/static/chunks/9551-7fdaa0e184ef68f8.js","/tenken/_next/static/chunks/app/_not-found/page-e118451ead67f6c9.js","/tenken/_next/static/chunks/app/admin/analytics/duration/page-6ce88b2bd6bebaf5.js","/tenken/_next/static/chunks/app/admin/analytics/lead-time/page-46e545169e837024.js","/tenken/_next/static/chunks/app/admin/analytics/ng/page-b3cf9b2756ea4973.js","/tenken/_next/static/chunks/app/admin/equipments/page-72434e9092a746a5.js","/tenken/_next/static/chunks/app/admin/equipments/qr/page-d89a302b7e7e94f1.js","/tenken/_next/static/chunks/app/admin/export/csv/page-7312163c339610dd.js","/tenken/_next/static/chunks/app/admin/export/pdf/page-e76fc9482bd19789.js","/tenken/_next/static/chunks/app/admin/logs/page-31198894b90edb26.js","/tenken/_next/static/chunks/app/admin/members/page-36aa4b25f9c39b8b.js","/tenken/_next/static/chunks/app/admin/page-b544c1cec6902472.js","/tenken/_next/static/chunks/app/admin/schedule/page-35636c892c282751.js","/tenken/_next/static/chunks/app/admin/settings/page-48c11017dc6fcf3c.js","/tenken/_next/static/chunks/app/admin/sheets/edit/page-163d51d5345c5ab4.js","/tenken/_next/static/chunks/app/admin/sheets/layout/page-6658d7cea88b89ec.js","/tenken/_next/static/chunks/app/admin/sheets/page-1eb919a4a24003b6.js","/tenken/_next/static/chunks/app/corrections/do/page-f5ee82ae753632c2.js","/tenken/_next/static/chunks/app/corrections/mine/page-d1b7c7d3aeaa02c8.js","/tenken/_next/static/chunks/app/corrections/page-e367a81f3b6ddc44.js","/tenken/_next/static/chunks/app/corrections/recurring/page-22a00b5a960638d7.js","/tenken/_next/static/chunks/app/corrections/review/page-09993a990cbd1cfa.js","/tenken/_next/static/chunks/app/dev/components/page-eb7875aced008dd8.js","/tenken/_next/static/chunks/app/equipments/history/page-8ebbae36d408c382.js","/tenken/_next/static/chunks/app/history/page-a4802051a4ba1d3c.js","/tenken/_next/static/chunks/app/inspect/page-21572eac1bc1fe30.js","/tenken/_next/static/chunks/app/inspect/run/page-22833b7ce15ba438.js","/tenken/_next/static/chunks/app/inspect/sheets/page-c9dd12cfb49331a4.js","/tenken/_next/static/chunks/app/layout-f43115ac65a8e8a8.js","/tenken/_next/static/chunks/app/not-found-d1307bea4adc79a6.js","/tenken/_next/static/chunks/app/notifications/page-dd3d1abf72f5f0d2.js","/tenken/_next/static/chunks/app/page-bb5635dcb421d6b5.js","/tenken/_next/static/chunks/app/records/detail/page-c8f61e421f2cd624.js","/tenken/_next/static/chunks/app/records/page-2f9335150fdb773e.js","/tenken/_next/static/chunks/app/records/revise/page-def61464d17dc53b.js","/tenken/_next/static/chunks/app/status/page-5981fe0eb1d63827.js","/tenken/_next/static/chunks/d78ee677.63a7e0215e64cc50.js","/tenken/_next/static/chunks/main-78a4f3737dafbef9.js","/tenken/_next/static/chunks/main-app-6b1f7bd580c44ee7.js","/tenken/_next/static/chunks/pages/_app-e8b861c87f6f033c.js","/tenken/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js","/tenken/_next/static/chunks/polyfills-42372ed130431b0a.js","/tenken/_next/static/chunks/webpack-5a53130ae1bf1e16.js","/tenken/_next/static/css/4fd707af95e1eddd.css","/tenken/_next/static/css/dd77aa98295486fe.css","/tenken/_next/static/ewK17ZDM5m5jRrBi_g-g9/_buildManifest.js","/tenken/_next/static/ewK17ZDM5m5jRrBi_g-g9/_ssgManifest.js","/tenken/_next/static/media/sRGB_IEC61966_2_1.e4e4f415.icc","/tenken/admin/","/tenken/admin/analytics/duration/","/tenken/admin/analytics/duration/index.txt","/tenken/admin/analytics/lead-time/","/tenken/admin/analytics/lead-time/index.txt","/tenken/admin/analytics/ng/","/tenken/admin/analytics/ng/index.txt","/tenken/admin/equipments/","/tenken/admin/equipments/index.txt","/tenken/admin/equipments/qr/","/tenken/admin/equipments/qr/index.txt","/tenken/admin/export/csv/","/tenken/admin/export/csv/index.txt","/tenken/admin/export/pdf/","/tenken/admin/export/pdf/index.txt","/tenken/admin/index.txt","/tenken/admin/logs/","/tenken/admin/logs/index.txt","/tenken/admin/members/","/tenken/admin/members/index.txt","/tenken/admin/schedule/","/tenken/admin/schedule/index.txt","/tenken/admin/settings/","/tenken/admin/settings/index.txt","/tenken/admin/sheets/","/tenken/admin/sheets/edit/","/tenken/admin/sheets/edit/index.txt","/tenken/admin/sheets/index.txt","/tenken/admin/sheets/layout/","/tenken/admin/sheets/layout/index.txt","/tenken/apple-touch-icon.png","/tenken/corrections/","/tenken/corrections/do/","/tenken/corrections/do/index.txt","/tenken/corrections/index.txt","/tenken/corrections/mine/","/tenken/corrections/mine/index.txt","/tenken/corrections/recurring/","/tenken/corrections/recurring/index.txt","/tenken/corrections/review/","/tenken/corrections/review/index.txt","/tenken/dev/components/","/tenken/dev/components/index.txt","/tenken/equipments/history/","/tenken/equipments/history/index.txt","/tenken/fonts/OFL.txt","/tenken/history/","/tenken/history/index.txt","/tenken/icon-192.png","/tenken/icon-512.png","/tenken/icon-maskable-512.png","/tenken/icon.svg","/tenken/index.txt","/tenken/inspect/","/tenken/inspect/index.txt","/tenken/inspect/run/","/tenken/inspect/run/index.txt","/tenken/inspect/sheets/","/tenken/inspect/sheets/index.txt","/tenken/manifest.webmanifest","/tenken/notifications/","/tenken/notifications/index.txt","/tenken/records/","/tenken/records/detail/","/tenken/records/detail/index.txt","/tenken/records/index.txt","/tenken/records/revise/","/tenken/records/revise/index.txt","/tenken/status/","/tenken/status/index.txt"]
const APP_CACHE = `tenken-app-${VERSION}`
const RUNTIME_CACHE = `tenken-runtime-${VERSION}`

let firstInstall = false

self.addEventListener('install', (event) => {
  firstInstall = !self.registration.active
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE)
      // ブラウザに残っている古い HTML を拾わないよう、必ずサーバーから取り直す（cache: 'reload'）。
      // 拾うと、新しい版の中に古い画面が入り、古い部品を探して開けなくなる（GitHub Pages は HTML を10分ほど覚えさせる）
      const fresh = (urls) => urls.map((u) => new Request(u, { cache: 'reload' }))
      // 1つでも取れないと全体が失敗するため、少しずつ入れる
      for (let i = 0; i < PRECACHE.length; i += 20) await cache.addAll(fresh(PRECACHE.slice(i, i + 20)))
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) if (key.startsWith('tenken-') && key !== APP_CACHE && key !== RUNTIME_CACHE) await caches.delete(key)
      // 初めて入ったときだけ、開いているページを受け持つ（版の切り替えではしない）
      if (firstInstall) await self.clients.claim()
    })(),
  )
})

function shellFor(pathname) {
  // /inspect/run/ → /inspect/run/index.html のように、クエリを除いたページの本体を探す
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`
  return p
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (!url.pathname.startsWith(BASE || '/')) return

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(APP_CACHE)
        const hit = (await cache.match(shellFor(url.pathname), { ignoreSearch: true })) || (await cache.match(req, { ignoreSearch: true }))
        if (hit) return hit
        try {
          return await fetch(req)
        } catch {
          return (await cache.match(`${BASE}/`)) || new Response('オフラインです。一度オンラインで開いてください。', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
        }
      })(),
    )
    return
  }

  event.respondWith(
    (async () => {
      const app = await caches.open(APP_CACHE)
      const hit = await app.match(req, { ignoreSearch: true })
      if (hit) return hit
      const runtime = await caches.open(RUNTIME_CACHE)
      const rhit = await runtime.match(req)
      if (rhit) return rhit
      const res = await fetch(req)
      // 文字（フォント）など、あとから読み込まれる本体の部品だけを保存する（帳票用の日本語フォントも含む）
      if (res.ok && /\/_next\/static\/|\/fonts\//.test(url.pathname)) await runtime.put(req, res.clone())
      return res
    })(),
  )
})
