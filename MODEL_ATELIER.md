# Model Atelier — Perchance Edition

Model Atelier is the provider-neutral Perchance version of the image workspace. It keeps Perchance’s default text-to-image generation path in place while adding a responsive custom interface, Catbox gallery tools, and an optional external image-model connection.

## Files to paste into Perchance

Use `model-atelier.perchance` in the **main generator/source pane**. It contains the imports, settings, image options, user inputs, and the `onFinish(result) => processGeneration(result)` callback used by Perchance’s default image model.

Use `model-atelier.html` in the **HTML pane**. It is the single-file interface containing the CSS and browser JavaScript for the Model Atelier layout, result handling, Catbox gallery controls, and third-party model dialog.

## External model contract

The optional external path expects an OpenAI-compatible `POST /images/generations` endpoint. Users can provide a proxy URL, API key, one or more model IDs, image size, frame count, and custom JSON headers. The settings are stored in local browser storage. A shared deployment should use a server-side proxy so API keys are not exposed to other users.

## Catbox behavior

The gallery keeps album-based Catbox workflows and supports direct image URLs. A Catbox user hash is useful for authenticated upload and deletion operations, but it should not be treated as an account-wide file enumeration API.

## Branch

This version lives on the `model-atelier` branch of `Sexlovr/perchance`.
