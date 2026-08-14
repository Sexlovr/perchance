# Prism Forge — Perchance Edition

Prism Forge is a provider-neutral Perchance image workspace rebuilt around a small standalone HTML runtime. It uses Perchance’s public direct text-to-image plugin when the user chooses the default generation path, while keeping the interface independent from the old t2i framework and hidden theme drawer.

## Files to paste into Perchance

Use `prism-forge.perchance` in the **main generator/source pane**. It imports the direct `text-to-image-plugin`, `comments-plugin`, `lolmao-bro-artstyle`, and optional `t2i-styles` lists. Its visible `artStyle` list keeps **No style** first, then imports the requested lolmao styles and optional Perchance styles.

Use `prism-forge.html` in the **HTML pane**. It is the standalone interface containing visible theme buttons, direct Perchance generation, Catbox gallery controls, one comments section below the gallery, and the third-party model dialog. There is no legacy settings drawer, floating workspace action, or t2i-framework layout dependency.

## External model contract

The optional external path expects an OpenAI-compatible `POST /images/generations` endpoint. Users can create as many saved profiles as they need, then provide a proxy URL, API key, one or more model IDs, image size, an arbitrary positive image count, and custom JSON headers for each profile. The prompt is sent as entered; Prism Forge does not append an aesthetic or force a style. The settings are stored in local browser storage. A shared deployment should use a server-side proxy so API keys are not exposed to other users.

The HTML uses the public `image(options)` call from `text-to-image-plugin` and normalizes returned URLs/data URLs into the visible result area. The user’s selected style is only appended when they explicitly choose a style; **No style** sends the prompt unchanged. Unsafe or obsolete example content and anti-fork behavior are intentionally not restored.

## Catbox behavior

The gallery keeps album-based Catbox workflows and supports direct image URLs. A Catbox user hash is useful for authenticated upload and deletion operations, but it should not be treated as an account-wide file enumeration API.

## Branch

This version lives on the `model-atelier` branch of `Sexlovr/perchance`.
