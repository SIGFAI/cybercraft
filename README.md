# CyberCraft

Minecraft inside Cyberpunk 2077: walk, build, break, fight and set off TNT by Minecraft's rules in Night City (RED4ext plugin + SkyCraft's Fabric mod).

**CyberCraft is made by [Keel62155](https://github.com/Keel62155).** All credit for the mod goes to them. It is built on [chasmlol/SkyCraft](https://github.com/chasmlol/SkyCraft) by chasmlol.

- Original project: https://github.com/Keel62155/Minecraft-X-Games
- Report bugs and ask questions there: https://github.com/Keel62155/Minecraft-X-Games/issues
- Upstream release packaged here: [1.0.0-CyberCraft](https://github.com/Keel62155/Minecraft-X-Games/releases/tag/1.0.0-CyberCraft) (commit [`5af7fd2`](https://github.com/Keel62155/Minecraft-X-Games/tree/5af7fd206d4dc048077792b5deed8d4982ff799d))

> **Beta.** Nobody at SIGF has played this build yet, and the author describes it as early work. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Cyberpunk 2077** ([Steam](https://store.steampowered.com/app/1091500/)): patch 2.31 only.
- **Minecraft**: Java Edition 26.3.
- Windows and the [SIGF app](https://sigf.ai). The app installs red4ext 1.30.0, fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **CyberCraft** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256, and the files come from the release [`v1.0.0`](../../releases/tag/v1.0.0) and, for `CyberCraft.zip`, from the author's own release.

### Good to know

- Cyberpunk 2077 on PC at patch 2.31 (Steam, GOG or Epic) and Minecraft: Java Edition. After a game update, wait for a RED4ext that supports it: until then the game runs without the mod.
- Switch off DLSS Frame Generation and FSR Frame Generation (Settings > Graphics): with either on, Minecraft's picture flickers.
- Press Play: Minecraft starts first as the app's own Prism instance "sigf-cybercraft" (SkyCraft's Fabric mod, Minecraft 26.3, Java 25), then Cyberpunk. You do not need SkyCraft or Skyrim. Minecraft's window stays visible until Cyberpunk links up; load a save and Minecraft's hotbar appears after a few seconds.
- RED4ext 1.30.0 and CyberCraft are installed into the game folder, CyberCraft downloaded from the author's own release; Restore removes both.
- Run one "Minecraft X" mod at a time: they share the same link. F10 gives V back to Cyberpunk. Log: %LOCALAPPDATA%\CyberCraft\cybercraft.log.
- Prototype played on one PC. Known gaps: blocks are drawn over everything, NPCs cannot hurt you, vehicle explosions do not work. Report bugs to the author on the upstream issue tracker.

## What this repository holds

CyberCraft has no license, so this repository holds **only SIGF's own files**, never the author's:

1. This README, `THIRD-PARTY.md`, `sigf/` (the script that built the release assets, for reference) and `mashup.json` (the SIGF app recipe).
2. Not here: `CyberCraft.zip` (sha256 `339715508db7996a66a195e311008a7582d252705919e3f10fdd3159ef4c91cb`). The app downloads it on the player's demand from the author's release, as released: https://github.com/Keel62155/Minecraft-X-Games/releases/download/1.0.0-CyberCraft/CyberCraft.zip
3. The release `v1.0.0`:

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `red4ext-1.30.0.zip` | 575834 B | `3a72225c9d2c46c99f4a4159d952b9d24366357c2423eb7ea255c84e9e11c0b0` | RED4ext 1.30.0, the official release file, unchanged (MIT, see THIRD-PARTY.md); unpacked into the Cyberpunk 2077 folder. |
| `cybercraft.mrpack` | 235698 B | `c554455058a6e02a2f6689700cad6bc60e61e56ad8a07f896ce5eaae9db280b0` | the Minecraft side, which is SkyCraft's (chasmlol, MIT): `skycraft-fabric-0.1.2.jar` unchanged with SkyCraft's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 and e4mc are Modrinth download links, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| CyberCraft (`CyberCraft.zip`, the author's release file) | no license: all rights reserved by Keel62155. Not stored here; the app downloads it from the author's release | https://github.com/Keel62155/Minecraft-X-Games |
| RED4ext 1.30.0 (release asset) | MIT | `THIRD-PARTY.md` |
| SkyCraft's Fabric mod (in `cybercraft.mrpack`) | MIT, Copyright chasmlol | `THIRD-PARTY.md` |
| Fabric API, e4mc (downloaded from Modrinth by the app, not stored here) | Apache-2.0, MIT | https://modrinth.com/mod/fabric-api, https://modrinth.com/mod/e4mc |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes CyberCraft installable in one click, credited to Keel62155. If you are the author and want anything changed or taken down, open an issue here.
