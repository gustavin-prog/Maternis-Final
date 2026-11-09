/* Maternis - Service Worker
   Cache dos arquivos estáticos do app para funcionamento offline e instalação. */
'use strict';

const CACHE_VERSION = 'maternis-v1';
const PRECACHE = `maternis-precache-${CACHE_VERSION}`;
const RUNTIME = `maternis-runtime-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  './',
  './index.html',
  './menu.html',
  './gestacao.html',
  './bebe.html',
  './vacinas.html',
  './consultas.html',
  './dicas.html',
  './diario.html',
  './manifest.json',
  './css/maternis-theme.css',
  './css/maternis-ui.css',
  './css/valdenia.css',
  './js/theme.js',
  './js/valdenia.js',
  './js/pwa.js',
  './img/bebe.jpg',
  './img/bebe-mao.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PRECACHE)
      .then((cache) =>
        Promise.all(
          PRECACHE_URLS.map((url) =>
            cache.add(url).catch(() => {
              // Um arquivo ausente não deve impedir a instalação do app.
              return null;
            })
          )
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== PRECACHE && key !== RUNTIME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navegação: tenta a rede primeiro e usa o cache quando estiver offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(RUNTIME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('./index.html'))
            .then(
              (cached) =>
                cached ||
                new Response(
                  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Maternis offline</title></head><body style="font-family: sans-serif; padding: 40px; text-align: center;"><h1>Você está offline</h1><p>Abra o Maternis novamente quando tiver conexão para carregar esta página.</p></body></html>',
                  { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                )
            )
        )
    );
    return;
  }

  // Recursos do próprio app: cache primeiro (rápido e offline).
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(RUNTIME).then((cache) => cache.put(request, copy));
            }
            return response;
          })
          .catch(
            () =>
              cached ||
              new Response('', { status: 504, statusText: 'Offline' })
          );
      })
    );
    return;
  }

  // Recursos externos (CDNs de fontes, ícones e scripts): rede com
  // armazenamento em cache para que o app continue bonito offline.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(RUNTIME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches
          .match(request)
          .then((cached) => cached || new Response('', { status: 504, statusText: 'Offline' }))
      )
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
