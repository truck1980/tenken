/* TENKEN Service Worker（オフライン起動。FR-304, FR-305, OFF-01, OFF-07, SEC-07）
 *
 * - アプリ本体（HTML・JS・CSS・アイコン・点検表の定義を含むコード）を事前にキャッシュし、通信なしで起動できるようにする。
 * - 点検記録・写真はキャッシュしない（localStorage・IndexedDB にだけある。SEC-07）。
 * - 新しい版が届いても skipWaiting しない。点検中に版が切り替わって画面が読み直されることを防ぐ（OFF-07）。
 *   新しい版は、アプリを一度すべて閉じて、次に開いたときに使われる。
 *
 * このファイルは scripts/build-sw.mjs がビルド後に out/sw.js として書き出す（版・置き場所・事前キャッシュの一覧を埋め込む）。
 */
const VERSION = "993c4cd72bc4"
const BASE = "/tenken"
const PRECACHE = ["/tenken/","/tenken/404.html","/tenken/404/","/tenken/_next/static/chunks/11390db7.c696782f2ce29acd.js","/tenken/_next/static/chunks/1189-87fae5dc292c101d.js","/tenken/_next/static/chunks/1255-cc9bc7d1277c414d.js","/tenken/_next/static/chunks/1347-85f2aa5cbac24b81.js","/tenken/_next/static/chunks/1615-0b30ac99e47e407c.js","/tenken/_next/static/chunks/1646.a93085a0445ba909.js","/tenken/_next/static/chunks/2036-a235eded64c338bd.js","/tenken/_next/static/chunks/2400.2e0ff856ac1c0d14.js","/tenken/_next/static/chunks/254-43b5718db3579722.js","/tenken/_next/static/chunks/259-80ddba8dcc241a01.js","/tenken/_next/static/chunks/2595-1d20d7a4b968adc5.js","/tenken/_next/static/chunks/2619-04bc32f026a0d946.js","/tenken/_next/static/chunks/2702-a34be188b2bdc9ed.js","/tenken/_next/static/chunks/2769.5b75c7bddf7ca30a.js","/tenken/_next/static/chunks/285.486ffd689e307ef0.js","/tenken/_next/static/chunks/3723-8f7bd65207830c88.js","/tenken/_next/static/chunks/4198-380aebcf44a375c7.js","/tenken/_next/static/chunks/426.f908076804dcd8f3.js","/tenken/_next/static/chunks/4296-9a60065c116afc75.js","/tenken/_next/static/chunks/4586-85f77a6c79d03182.js","/tenken/_next/static/chunks/4927-48017b6306eee350.js","/tenken/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js","/tenken/_next/static/chunks/5139.e4ff9cc3669129ed.js","/tenken/_next/static/chunks/5263-c4d12e83d4f03fbd.js","/tenken/_next/static/chunks/5485-b15cde79ec2cf833.js","/tenken/_next/static/chunks/5855-a8f4feceb6092d74.js","/tenken/_next/static/chunks/5862-d83bd3f70bbd2951.js","/tenken/_next/static/chunks/6375-02328a9ce0cc1c36.js","/tenken/_next/static/chunks/6627.a67285ee115660cc.js","/tenken/_next/static/chunks/668-a4810151d8a5fbf0.js","/tenken/_next/static/chunks/6695-f70ca70b5e97eec3.js","/tenken/_next/static/chunks/7060.38b0d31adc7c40ea.js","/tenken/_next/static/chunks/7087-b6b137cb032bfaa0.js","/tenken/_next/static/chunks/8303-a97ada094345f7b8.js","/tenken/_next/static/chunks/8538.7e75d500ce4ac291.js","/tenken/_next/static/chunks/864b0550.09fa19657f4075d0.js","/tenken/_next/static/chunks/8771-ed9688e3bd6bd87a.js","/tenken/_next/static/chunks/8955-deb424aa90ff21aa.js","/tenken/_next/static/chunks/9254.05e8eaed3ed9c3ad.js","/tenken/_next/static/chunks/9267-e14595fc13b214ce.js","/tenken/_next/static/chunks/9349.d24ab9cbb6f1228e.js","/tenken/_next/static/chunks/app/_not-found/page-e118451ead67f6c9.js","/tenken/_next/static/chunks/app/admin/analytics/duration/page-e8cc6a27cb0af55b.js","/tenken/_next/static/chunks/app/admin/analytics/lead-time/page-eaaef2fb02d74d10.js","/tenken/_next/static/chunks/app/admin/analytics/ng/page-981cae5f41743c03.js","/tenken/_next/static/chunks/app/admin/equipments/page-2764d530319d22d1.js","/tenken/_next/static/chunks/app/admin/equipments/qr/page-5d3e0420767600fb.js","/tenken/_next/static/chunks/app/admin/export/csv/page-c3f492d4f4a6ddf3.js","/tenken/_next/static/chunks/app/admin/export/pdf/page-586e2a603ca2ee3f.js","/tenken/_next/static/chunks/app/admin/logs/page-21e8a2b270f425c0.js","/tenken/_next/static/chunks/app/admin/members/page-d423badae3fd1459.js","/tenken/_next/static/chunks/app/admin/page-9d7bcae3a5ac8b05.js","/tenken/_next/static/chunks/app/admin/schedule/page-2871ade78be18dfc.js","/tenken/_next/static/chunks/app/admin/settings/page-2cc8cf69510e5273.js","/tenken/_next/static/chunks/app/admin/sheets/edit/page-970f937d6430b114.js","/tenken/_next/static/chunks/app/admin/sheets/layout/page-45eaf5ae1f65f114.js","/tenken/_next/static/chunks/app/admin/sheets/page-d6247b33a8232cb6.js","/tenken/_next/static/chunks/app/corrections/do/page-2bb7f4edd3dc85ba.js","/tenken/_next/static/chunks/app/corrections/mine/page-ef06fa5834e5ec6f.js","/tenken/_next/static/chunks/app/corrections/page-5c87554cb7a9b1fd.js","/tenken/_next/static/chunks/app/corrections/recurring/page-3a95078b407b6d4f.js","/tenken/_next/static/chunks/app/corrections/review/page-64cd3bc51ff22d79.js","/tenken/_next/static/chunks/app/dev/components/page-5eb4ec02e8a0435f.js","/tenken/_next/static/chunks/app/equipments/history/page-114274f7eabef75d.js","/tenken/_next/static/chunks/app/history/page-96ab01336e14f814.js","/tenken/_next/static/chunks/app/inspect/page-3ccf60963c590bb6.js","/tenken/_next/static/chunks/app/inspect/run/page-e67b46f4b7d3ba1e.js","/tenken/_next/static/chunks/app/inspect/sheets/page-fcfc68bb2b20d5b0.js","/tenken/_next/static/chunks/app/layout-3dc9afe7887620f6.js","/tenken/_next/static/chunks/app/not-found-d1307bea4adc79a6.js","/tenken/_next/static/chunks/app/notifications/page-0bb9b5f2ada21287.js","/tenken/_next/static/chunks/app/page-01e728622a7465f5.js","/tenken/_next/static/chunks/app/records/detail/page-efab89a44999f198.js","/tenken/_next/static/chunks/app/records/page-ea87e2cbafdec3c3.js","/tenken/_next/static/chunks/app/records/revise/page-1258cf46dcd9d82c.js","/tenken/_next/static/chunks/app/status/page-3a2f841208db3626.js","/tenken/_next/static/chunks/d78ee677.63a7e0215e64cc50.js","/tenken/_next/static/chunks/main-78a4f3737dafbef9.js","/tenken/_next/static/chunks/main-app-6b1f7bd580c44ee7.js","/tenken/_next/static/chunks/pages/_app-e8b861c87f6f033c.js","/tenken/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js","/tenken/_next/static/chunks/polyfills-42372ed130431b0a.js","/tenken/_next/static/chunks/webpack-570cec2d0bef90be.js","/tenken/_next/static/css/4fd707af95e1eddd.css","/tenken/_next/static/css/dd77aa98295486fe.css","/tenken/_next/static/media/sRGB_IEC61966_2_1.e4e4f415.icc","/tenken/_next/static/oKj-psNv41xJW4mPn5YYl/_buildManifest.js","/tenken/_next/static/oKj-psNv41xJW4mPn5YYl/_ssgManifest.js","/tenken/admin/","/tenken/admin/analytics/duration/","/tenken/admin/analytics/duration/index.txt","/tenken/admin/analytics/lead-time/","/tenken/admin/analytics/lead-time/index.txt","/tenken/admin/analytics/ng/","/tenken/admin/analytics/ng/index.txt","/tenken/admin/equipments/","/tenken/admin/equipments/index.txt","/tenken/admin/equipments/qr/","/tenken/admin/equipments/qr/index.txt","/tenken/admin/export/csv/","/tenken/admin/export/csv/index.txt","/tenken/admin/export/pdf/","/tenken/admin/export/pdf/index.txt","/tenken/admin/index.txt","/tenken/admin/logs/","/tenken/admin/logs/index.txt","/tenken/admin/members/","/tenken/admin/members/index.txt","/tenken/admin/schedule/","/tenken/admin/schedule/index.txt","/tenken/admin/settings/","/tenken/admin/settings/index.txt","/tenken/admin/sheets/","/tenken/admin/sheets/edit/","/tenken/admin/sheets/edit/index.txt","/tenken/admin/sheets/index.txt","/tenken/admin/sheets/layout/","/tenken/admin/sheets/layout/index.txt","/tenken/apple-touch-icon.png","/tenken/corrections/","/tenken/corrections/do/","/tenken/corrections/do/index.txt","/tenken/corrections/index.txt","/tenken/corrections/mine/","/tenken/corrections/mine/index.txt","/tenken/corrections/recurring/","/tenken/corrections/recurring/index.txt","/tenken/corrections/review/","/tenken/corrections/review/index.txt","/tenken/dev/components/","/tenken/dev/components/index.txt","/tenken/equipments/history/","/tenken/equipments/history/index.txt","/tenken/fonts/OFL.txt","/tenken/history/","/tenken/history/index.txt","/tenken/icon-192.png","/tenken/icon-512.png","/tenken/icon-maskable-512.png","/tenken/icon.svg","/tenken/index.txt","/tenken/inspect/","/tenken/inspect/index.txt","/tenken/inspect/run/","/tenken/inspect/run/index.txt","/tenken/inspect/sheets/","/tenken/inspect/sheets/index.txt","/tenken/manifest.webmanifest","/tenken/notifications/","/tenken/notifications/index.txt","/tenken/records/","/tenken/records/detail/","/tenken/records/detail/index.txt","/tenken/records/index.txt","/tenken/records/revise/","/tenken/records/revise/index.txt","/tenken/status/","/tenken/status/index.txt"]
const APP_CACHE = `tenken-app-${VERSION}`
const RUNTIME_CACHE = `tenken-runtime-${VERSION}`

let firstInstall = false

self.addEventListener('install', (event) => {
  firstInstall = !self.registration.active
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE)
      // 1つでも取れないと全体が失敗するため、少しずつ入れる
      for (let i = 0; i < PRECACHE.length; i += 20) await cache.addAll(PRECACHE.slice(i, i + 20))
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
