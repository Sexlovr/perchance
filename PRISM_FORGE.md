# Prism Forge — Perchance Edition

Prism Forge is the provider-neutral Perchance version of the image workspace. It keeps Perchance’s default text-to-image generation path in place while adding a responsive custom interface, Catbox gallery tools, comments, optional style helpers, and external image-model profiles.

## Files to paste into Perchance

Use `prism-forge.perchance` in the **main generator/source pane**. It contains the imports, settings, image options, user inputs, and the `onFinish(result) => processGeneration(result)` callback used by Perchance’s default image model.

Use `prism-forge.html` in the **HTML pane**. It is the single-file interface containing the CSS and browser JavaScript for the Prism Forge layout, result handling, Catbox gallery controls, comments section, and third-party model dialog.

## External model contract

The optional external path expects an OpenAI-compatible `POST /images/generations` endpoint. Users can create as many saved profiles as they need, then provide a proxy URL, API key, one or more model IDs, image size, an arbitrary positive image count, and custom JSON headers for each profile. The prompt is sent as entered; Prism Forge does not append an aesthetic or force a style. The settings are stored in local browser storage. A shared deployment should use a server-side proxy so API keys are not exposed to other users.

The source pane also restores the useful framework imports for comments, selectable styles, uploads, fullscreen controls, prompt helpers, tabbed comments, and private media galleries. Unsafe or obsolete example content and anti-fork behavior are intentionally not restored.

## Catbox behavior

The gallery keeps album-based Catbox workflows and supports direct image URLs. A Catbox user hash is useful for authenticated upload and deletion operations, but it should not be treated as an account-wide file enumeration API.

## Branch

This version lives on the `model-atelier` branch of `Sexlovr/perchance`.
