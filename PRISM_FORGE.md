# Prism Forge — Perchance Edition

Prism Forge is a provider-neutral Perchance image workspace whose visible UI is wrapped around `t2i-framework-plugin-v2`. The framework remains the backend for Perchance generation, the native generated-image gallery, and channel-aware comments; Prism Forge owns the layout, theme state, visible inputs, Catbox tools, and third-party profile UI.

## Files to paste into Perchance

Use `prism-forge.perchance` in the **main generator/source pane**. It imports `t2i-framework-plugin-v2`, `comments-plugin`, and optional `t2i-styles`. Its hidden framework bridge keeps **No style** first, then imports the requested `lolmao-bro-artstyle` styles and optional Perchance styles. The HTML wrapper synchronizes visible fields into those framework inputs.

Use `prism-forge.html` in the **HTML pane**. It contains the visible Prism Forge interface, theme buttons, framework-backed generate action, native Perchance gallery/comments wrapper, Catbox imports, and the third-party model dialog. It does not add a second custom comments plugin or rely on the old hidden settings drawer.

## External model contract

The optional external path expects an OpenAI-compatible `POST /images/generations` endpoint. Users can create as many saved profiles as they need, then provide a proxy URL, API key, one or more model IDs, image size, an arbitrary positive image count, and custom JSON headers for each profile. The prompt is sent as entered; Prism Forge does not append an aesthetic or force a style. The settings are stored in local browser storage. A shared deployment should use a server-side proxy so API keys are not exposed to other users.

The visible Generate button synchronizes prompt, negative prompt, canvas, guidance, seed, count, and style into the framework’s hidden inputs, then clicks the framework’s own native generate button. This preserves Perchance’s server-backed generation lifecycle and native gallery. The selected style is controlled by the visible UI; **No style** uses the explicit no-style option. Unsafe or obsolete example content and anti-fork behavior are intentionally not restored.

The header includes six persisted themes: **Graphite**, **Paper**, **Olive**, **Ocean**, **Sunset**, and **Mono**. Theme state is stored locally and applied to the full wrapper and framework output area rather than only to Prism Forge cards.

## Catbox behavior

The gallery keeps album-based Catbox workflows and supports direct image URLs. A Catbox user hash is useful for authenticated upload and deletion operations, but it should not be treated as an account-wide file enumeration API.

The Catbox panel now includes a browser-local **Catbox user hash** field, save/forget controls, local image-file upload, and buttons that can be added to native Perchance gallery images. Uploads use Catbox’s multipart API fields `reqtype=fileupload`, `userhash`, optional `album`, and `fileToUpload`. Upload responses are added to the Prism Forge Catbox import index when Catbox returns a direct file URL. The hash is never included in the repository or source pane.

## Branch

This version lives on the `model-atelier` branch of `Sexlovr/perchance`.
