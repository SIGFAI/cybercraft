// CyberCraft (Keel62155, no license): Minecraft inside Cyberpunk 2077, a RED4ext plugin that plays the part of
// SkyCraft's Skyrim plugin and drives SkyCraft's Fabric mod over the same shared memory (Local\SkyCraft_v1).
// No license, so upstream fetch (PLATFORM-SPEC section 4, "Upstream fetch"): CyberCraft.zip is downloaded by the app
// from the author's release as released, never rehosted. SIGFAI/cybercraft hosts the recipe, our .mrpack (SkyCraft's
// Minecraft side, MIT, the exact pack orchestrator/scripts/package-fusion.mjs builds for SkyCraft) and the official
// RED4ext 1.30.0 zip (MIT, unchanged).
//
// The plugin starts Minecraft itself only as %LOCALAPPDATA%\SkyCraft\Prism\prismlauncher.exe --launch SkyCraft
// (src/CyberCraft.cpp:155-174, hardcoded, no ini), and only when the mutex Local\SkyCraft_v1_minecraft is free. The
// SkyCraft jar holds that mutex for as long as it runs (SkyLink.announceRunning), so the app starts its own Minecraft
// instance first and the plugin uses it. Nothing to patch, no SkyCraft install needed.
//
// The upstream zip's root is CyberCraft/, so the DLL is at CyberCraft/red4ext/plugins/CyberCraft/CyberCraft.dll, and
// RED4ext only loads plugins/<dir>/<x>.dll (depth <= 1, PluginSystem.cpp). The install file's `root`
// (PLATFORM-SPEC section 4, install[].files[]) places only CyberCraft/red4ext/ of the zip, as released, into
// {game}/red4ext; `contents` still lists and checks every entry.
//   node library/cybercraft/build.mjs [--fixture]       (outputs: library/lib.mjs)
import { FUSIONS, buildFusion, instanceName } from '../../orchestrator/scripts/package-fusion.mjs';
import { CACHE, asset, card, dl, emit, pinned, renamePack } from '../lib.mjs';

const UP = {
  repo: 'https://github.com/Keel62155/Minecraft-X-Games', tag: '1.0.0-CyberCraft', commit: '5af7fd206d4dc048077792b5deed8d4982ff799d',
  authors: ['Keel62155'],
  zip: { file: 'CyberCraft.zip', sha256: '339715508db7996a66a195e311008a7582d252705919e3f10fdd3159ef4c91cb' }, // = GitHub digest
};
const RED4EXT = {
  id: 'red4ext', version: '1.30.0', file: 'red4ext-1.30.0.zip', repo: 'https://github.com/wopss/RED4ext', license: 'MIT',
  url: 'https://github.com/wopss/RED4ext/releases/download/v1.30.0/red4ext-1.30.0.zip',
  sha256: '3a72225c9d2c46c99f4a4159d952b9d24366357c2423eb7ea255c84e9e11c0b0', // = GitHub digest
};
const SKY = FUSIONS.skycraft;
const ID = 'cybercraft', VERSION = '1.0.0', NAME = 'CyberCraft';
const TAGLINE = 'Minecraft inside Cyberpunk 2077: walk, build, break, fight and set off TNT by Minecraft\'s rules in Night City (RED4ext plugin + SkyCraft\'s Fabric mod).';

const upUrl = `${UP.repo}/releases/download/${UP.tag}/${UP.zip.file}`;
const plugin = asset(UP.zip.file, await pinned(upUrl, UP.zip.sha256), { zipped: true, upstream: upUrl });
const red4ext = asset(RED4EXT.file, await pinned(RED4EXT.url, RED4EXT.sha256), { zipped: true });
// SkyCraft's Minecraft side, built by package-fusion.mjs from its pinned release (its Skyrim zip is not used).
const pack = async (offline) => {
  const { packAsset } = await buildFusion(SKY, { cache: CACHE, offline });
  return asset(`${ID}.mrpack`, renamePack(packAsset.data, { name: `${NAME} (SkyCraft's Minecraft side)`, summary: TAGLINE, versionId: VERSION }));
};
const assets = [red4ext, plugin, await pack(false)];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  const offline = set !== assets;
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: TAGLINE,
    kind: 'passthrough',
    games: [
      { game: 'cyberpunk', role: 'host', label: 'Cyberpunk 2077', engine: 'Cyberpunk 2077 (REDengine 4) + RED4ext plugin (C++)', apps: { steam: '1091500', gog: '1423049311' }, runtime: 'patch 2.31 only' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', mc: SKY.mc.mc, loader: `fabric@${SKY.mc.loader}`, java: SKY.mc.java },
    ],
    requires: [
      { id: RED4EXT.id, version: RED4EXT.version, license: `${RED4EXT.license}, shipped unchanged`, page: `${RED4EXT.repo}/releases/tag/v${RED4EXT.version}`,
        note: 'the build for patch 2.31; installed into the game folder by the app', source: { url: urls[red4ext.name], sha256: red4ext.sha256 } },
      { id: 'fabric-loader', version: SKY.mc.loader },
      { id: 'fabric-api', version: SKY.mc.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'cyberpunk', strategy: 'game-dir-snapshot', loader: 'red4ext', files: [
        { src: red4ext.name, dst: '{game}', unpack: true, contents: red4ext.contents, ...dl(red4ext, urls) },
        // Upstream file as released. root: only CyberCraft/red4ext/ is placed, into {game}/red4ext, which is upstream's
        // own install step ("copy the red4ext folder from this zip"). README and source zip are checked, not written.
        { src: plugin.name, dst: '{game}/red4ext', root: 'CyberCraft/red4ext', unpack: true, contents: plugin.contents, ...dl(plugin, urls) },
      ] },
      { game: 'minecraft', strategy: 'mrpack', pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first: the plugin sees it running (mutex) and links over shared memory instead of starting its own.
    // Cyberpunk through its store: RED4ext loads through bin/x64/winmm.dll, no loader exe.
    launch: [{ game: 'minecraft' }, { game: 'cyberpunk', args: [] }],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'No license (upstream download) + MIT', upstream_license: null, fetch: 'upstream', tag: UP.tag, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`, based_on: SKY.upstream.repo,
      bundled: [
        { name: 'RED4ext', version: RED4EXT.version, repo: RED4EXT.repo, license: RED4EXT.license },
        { name: 'SkyCraft (Fabric mod)', version: SKY.version, repo: SKY.upstream.repo, commit: SKY.upstream.commit, license: SKY.upstream.license },
      ],
    },
    media: {},
    built_by: { author: UP.authors[0], authors: [...UP.authors, ...SKY.upstream.authors], packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-05T00:00:00.000Z',
    ...card(UP.repo),
    notes: [
      'Cyberpunk 2077 on PC at patch 2.31 (Steam, GOG or Epic) and Minecraft: Java Edition. After a game update, wait for a RED4ext that supports it: until then the game runs without the mod.',
      'Switch off DLSS Frame Generation and FSR Frame Generation (Settings > Graphics): with either on, Minecraft\'s picture flickers.',
      `Press Play: Minecraft starts first as the app's own Prism instance "${instanceName(`sigf/${ID}`)}" (SkyCraft's Fabric mod, Minecraft ${SKY.mc.mc}, Java ${SKY.mc.java}), then Cyberpunk. You do not need SkyCraft or Skyrim. Minecraft's window stays visible until Cyberpunk links up; load a save and Minecraft's hotbar appears after a few seconds.`,
      'RED4ext 1.30.0 and CyberCraft are installed into the game folder, CyberCraft downloaded from the author\'s own release; Restore removes both.',
      'Run one "Minecraft X" mod at a time: they share the same link. F10 gives V back to Cyberpunk. Log: %LOCALAPPDATA%\\CyberCraft\\cybercraft.log.',
      'Prototype played on one PC. Known gaps: blocks are drawn over everything, NPCs cannot hurt you, vehicle explosions do not work. Report bugs to the author on the upstream issue tracker.',
      ...(offline ? [`Offline fixture: Fabric API ${SKY.mc.fabricApi} and e4mc not in the pack.`] : []),
    ],
  };
};

// No app fixture: it would commit the author's unlicensed zip into our repo (app/src-tauri/tests/recipes.rs builds a
// zip of the same shape instead).
emit({ slug: ID, version: VERSION, assets, fixtureAssets: null, make });
