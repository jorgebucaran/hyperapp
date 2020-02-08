# Hyperapp official website developer guide

[Live website](https://hyperapp.dev/)

## 🚀 Quick start:

Run these commands to get a local copy running:

```console
# Clone hyperapp repo
git clone https://github.com/jorgebucaran/hyperapp.git

# Go to in the docs directory
cd docs

npm i           # Install dependencies
npm start       # Dev server + live reload
```

```console
npm run build   # Build site
```

You can also run `npm run build-site` from the the root of the hyperapp repo to build the site.

## Project files

A quick look at the project's folders and files

    .
    ├── src/                      # Site source code
    │   ├── assets/               # Shared assets that will bundled by parcel
    │   ├── components/           # Hyperapp components (global to the site)
    │   ├── lib/                  # External libs
    │   ├── pages/                # Page components
    │   ├── styleguide/           # Copy of the hyperapp styleguide
    │   ├── actions.js            # Global actions
    │   ├── effects.js            # Global effects
    │   ├── global.css            # Global CSS
    │   ├── index.html            # HTML skeletton
    │   ├── index.js              # App initialization
    │   ├── manifest.webmanifest  # Site manifest (fancy metadata)
    │   ├── subscriptions.js      # Global subscriptions
    │   └── utils.js              # Misc utils
    ├── static/                   # Static files to be copied "as is" in the builds



