/**
 * fetch-covers.mjs — re-fetch jacket images and rewrite MDX files.
 * All 3 tracks are dated 2026-03-15 so they appear as "MARCH 2026" picks.
 */

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const IMG_DIR    = path.join(ROOT, 'public', 'images');
const ISSUES_DIR = path.join(ROOT, 'src', 'content', 'issues');

await mkdir(IMG_DIR, { recursive: true });

const ISSUES = [
  {
    file:             '001-stfu.mdx',
    issueNumber:      1,
    trackName:        'STFU',
    artist:           'Pixl Girl',
    spotifyCanonical: 'https://open.spotify.com/track/1RtOV5HTGBKiSpIOU8qU1b',
    embedType:        'track',
    embedId:          '1RtOV5HTGBKiSpIOU8qU1b',
    theme:            'Electronic / Club',
    date:             '2026-03-15',
    description:      'Pixl Girlによる精緻なクラブトラック。フロアを揺らすビートと緻密なサウンドデザインが同居する一曲。',
    tags:             ['electronic', 'club', 'pixl girl'],
    imgFile:          'cover-001.jpg',
  },
  {
    file:             '002-radio-ddr.mdx',
    issueNumber:      2,
    trackName:        'Radio DDR',
    artist:           'Sharp Pins',
    spotifyCanonical: 'https://open.spotify.com/album/2rMHZAlbmZuIsr8iWR7oZX',
    embedType:        'album',
    embedId:          '2rMHZAlbmZuIsr8iWR7oZX',
    theme:            'Post-Punk / Indie',
    date:             '2026-03-15',
    description:      'Sharp Pinsのアルバム「Radio DDR」。東ドイツへのオマージュとポストパンクの緊張感が渦巻く作品。',
    tags:             ['post-punk', 'indie', 'sharp pins'],
    imgFile:          'cover-002.jpg',
  },
  {
    file:             '003-forever.mdx',
    issueNumber:      3,
    trackName:        'Forever',
    artist:           'Bassvictim',
    spotifyCanonical: 'https://open.spotify.com/album/2ViY56KtJVHYZ55jZvmt4n',
    embedType:        'album',
    embedId:          '2ViY56KtJVHYZ55jZvmt4n',
    theme:            'EBM / Industrial',
    date:             '2026-03-15',
    description:      'BassvictimのアルバムForever。EBMとインダストリアルが融合した、クールでダークな電子音楽の世界。',
    tags:             ['ebm', 'industrial', 'bassvictim'],
    imgFile:          'cover-003.jpg',
  },
];

async function fetchThumbnail(canonicalUrl) {
  const apiUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(canonicalUrl)}`;
  console.log(`  oEmbed → ${apiUrl}`);
  const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`oEmbed HTTP ${res.status}`);
  const data = await res.json();
  if (!data.thumbnail_url) throw new Error('No thumbnail_url');
  return data.thumbnail_url;
}

async function downloadImage(imageUrl, destPath) {
  console.log(`  Image  → ${imageUrl}`);
  const res = await fetch(imageUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`Download HTTP ${res.status}`);
  await writeFile(destPath, Buffer.from(await res.arrayBuffer()));
  console.log(`  Saved  → public/images/${path.basename(destPath)}`);
}

function buildMdx(issue, coverPath) {
  const embedUrl = `https://open.spotify.com/embed/${issue.embedType}/${issue.embedId}?utm_source=generator&theme=0`;

  return `---
title: "${issue.trackName} / ${issue.artist}"
trackName: "${issue.trackName}"
artist: "${issue.artist}"
issueNumber: ${issue.issueNumber}
date: ${issue.date}
theme: "${issue.theme}"
description: "${issue.description}"
coverImage: "${coverPath}"
spotifyEmbedUrl: "${embedUrl}"
tags: [${issue.tags.map(t => `"${t}"`).join(', ')}]
draft: false
---

import SpotifyEmbed from '../../components/SpotifyEmbed.astro';

## ${issue.trackName} — ${issue.artist}

ここに解説が入ります。アーティストの背景、このリリースが持つ意味、サウンドの特徴について書くことができます。

ここに解説が入ります。制作背景やレーベル情報、関連するムーブメントとのつながりなどを掘り下げることができます。

## 聴く

<SpotifyEmbed url="${embedUrl}" label="${issue.trackName} — ${issue.artist}" />

## ライナーノーツ

ここに解説が入ります。具体的なトラックへの言及、プロデューサーや共演者への言及、あるいはこの音楽が自分にとってどんな意味を持つかを記述します。

ここに解説が入ります。サウンドデザイン、リズムパターン、歌詞やボーカルの質感について書くことができます。

> ここに引用やステートメントが入ります。アーティストの言葉、あるいはこの音楽に似合うフレーズを。

## 今月の一言

ここに解説が入ります。読者へのメッセージ、次号の予告、あるいはこの音楽と一緒に過ごしてほしい時間や場所についての提案。

---

*次号もお楽しみに。*
`;
}

// ── Delete old MDX files first ─────────────────────────
import { readdir, unlink } from 'fs/promises';
const oldFiles = (await readdir(ISSUES_DIR)).filter(f => f.endsWith('.mdx'));
for (const f of oldFiles) {
  await unlink(path.join(ISSUES_DIR, f));
  console.log(`Deleted old file: ${f}`);
}

// ── Fetch + write ──────────────────────────────────────
for (const issue of ISSUES) {
  console.log(`\n── ${issue.trackName} / ${issue.artist}`);
  const destPath = path.join(IMG_DIR, issue.imgFile);
  let coverPath  = `/images/${issue.imgFile}`;

  try {
    const thumb = await fetchThumbnail(issue.spotifyCanonical);
    await downloadImage(thumb, destPath);
  } catch (err) {
    console.warn(`  ⚠ Image failed: ${err.message}`);
    coverPath = '';
  }

  const mdxPath = path.join(ISSUES_DIR, issue.file);
  await writeFile(mdxPath, buildMdx(issue, coverPath), 'utf8');
  console.log(`  MDX   → src/content/issues/${issue.file}`);
}

console.log('\n✓ Done.');
