# RahaUI.js

A lightweight, dependency-free JavaScript component manager for building web applications with reusable HTML components.

RahaUI.js provides a simple component system based on standard browser APIs. Components can have their own HTML, JavaScript, CSS, and state while remaining independent from external frameworks and build systems.

---

## Features

* Lightweight and dependency-free
* Component-based application structure
* Separate HTML, JavaScript, and CSS for each component
* Dynamic component loading with `fetch()`
* Component-specific state management
* ES module support
* Automatic component identification through CSS classes
* Component removal and cleanup
* No build step required
* PWA support

---

## Installation

RahaUI.js does not require npm or any external dependency.

Download `RahaUI.js` and include it in your HTML:

```html
<script src="./RahaUI.js"></script>
```

Then create a `ComponentManager`:

```js
const app = new ComponentManager();
```

---

# Components

A component consists of an HTML file and optionally one or more JavaScript and CSS files.

A typical project structure can look like this:

```text
my-app/
├── index.html
├── RahaUI.js
└── components/
    ├── todo/
    │   ├── todo.html
    │   ├── todo.js
    │   └── todo.css
    │
    ├── todo-item/
    │   ├── todo-item.html
    │   ├── todo-item.js
    │   └── todo-item.css
    │
    └── todo-form/
        ├── todo-form.html
        ├── todo-form.js
        └── todo-form.css
```

---

## Registering a Component

Components are registered using `addComponent()`:

```js
app.addComponent(
    "todo",
    "./components/todo/todo.html",
    [
        {
            src: "./components/todo/todo.js",
            isModule: false,
            inHead: false
        }
    ],
    [
        "./components/todo/todo.css"
    ]
);
```

### `addComponent()`

```text
addComponent(name, filePath, javascript, css)
```

| Parameter    | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `name`       | `string` | Unique component name                          |
| `filePath`   | `string` | Path or URL to the component HTML              |
| `javascript` | `Array`  | JavaScript files associated with the component |
| `css`        | `Array`  | CSS files associated with the component        |

### JavaScript configuration

Each JavaScript entry has the following structure:

```js
{
    src: "./component.js",
    isModule: false,
    inHead: false
}
```

| Property   | Type      | Description                                                   |
| ---------- | --------- | ------------------------------------------------------------- |
| `src`      | `string`  | JavaScript file path or URL                                   |
| `isModule` | `boolean` | Loads the script as an ES module when `true`                  |
| `inHead`   | `boolean` | Places the script in `<head>` when `true`; otherwise `<body>` |

---

# Rendering

After registering a component, render it into an existing DOM element:

```html
<div id="app"></div>
```

```js
app.render("todo", "#app");
```

RahaUI.js loads the component HTML using `fetch()`, parses it with `DOMParser`, and inserts its contents into the selected element.

All elements inside the component receive a class containing the component name.

For example, a component named `todo` will produce elements with:

```html
<div class="todo">
    ...
</div>
```

This allows component-specific styling and cleanup.

---

# Nested Components

Components can contain other components.

For example, a Todo application can be structured as:

```text
Todo
├── TodoForm
└── TodoList
    ├── TodoItem
    ├── TodoItem
    └── TodoItem
```

The parent component can render its child components into elements inside its own HTML.

### `todo.html`

```html
<section>
    <h1>Todo List</h1>

    <div id="todo-form"></div>
    <div id="todo-list"></div>
</section>
```

The components can then be registered:

```js
const app = new ComponentManager();

app.addComponent(
    "todo",
    "./components/todo/todo.html",
    [
        {
            src: "./components/todo/todo.js",
            isModule: true,
            inHead: false
        }
    ],
    [
        "./components/todo/todo.css"
    ]
);

app.addComponent(
    "todo-form",
    "./components/todo-form/todo-form.html",
    [
        {
            src: "./components/todo-form/todo-form.js",
            isModule: true,
            inHead: false
        }
    ],
    [
        "./components/todo-form/todo-form.css"
    ]
);

app.addComponent(
    "todo-list",
    "./components/todo-list/todo-list.html",
    [
        {
            src: "./components/todo-list/todo-list.js",
            isModule: true,
            inHead: false
        }
    ],
    [
        "./components/todo-list/todo-list.css"
    ]
);

app.render("todo", "#app");
```

The parent component can then render its children:

```js
app.render("todo-form", "#todo-form");
app.render("todo-list", "#todo-list");
```

---

# State Management

Each component has its own state object.

## Add State

```js
app.addToState("todo", "items", []);
```

## Get State

```js
const state = app.getState("todo");
```

## Get a Specific Value

```js
const items = app.getStateByKey("todo", "items");
```

## Change State

```js
app.changeStateByKey("todo", "items", newItems);
```

## Check for a State Key

```js
if (app.containsInState("todo", "items")) {
    console.log("Todo items exist.");
}
```

State management is intentionally simple and does not provide automatic rendering or reactivity.

---

# API Reference

## `ComponentManager`

Creates a new component manager.

```js
const app = new ComponentManager();
```

---

## `addComponent(name, filePath, javascript, css)`

Registers a component.

```js
app.addComponent(
    "button",
    "./components/button.html",
    [],
    ["./components/button.css"]
);
```

---

## `render(name, originQuery)`

Renders a registered component into the element selected by `originQuery`.

```js
app.render("button", "#container");
```

`originQuery` is passed to `document.querySelector()`.

If the component has already been rendered, calling `render()` again does nothing.

---

## `getState(name)`

Returns the complete state object of a component.

```js
const state = app.getState("todo");
```

---

## `addToState(name, key, value)`

Adds a value to a component's state.

```js
app.addToState("todo", "completed", false);
```

---

## `getStateByKey(name, key)`

Returns a specific state value.

```js
const completed = app.getStateByKey("todo", "completed");
```

---

## `changeStateByKey(name, key, value)`

Changes a state value.

```js
app.changeStateByKey("todo", "completed", true);
```

---

## `containsInState(name, key)`

Checks whether a state key exists.

```js
if (app.containsInState("todo", "completed")) {
    // ...
}
```

Returns a boolean value.

---

## `removeComponent(name)`

Removes a component from the application.

```js
app.removeComponent("todo");
```

This removes the component's rendered elements and the JavaScript/CSS elements created for it.

The component is also removed from the `ComponentManager`.

---

# Complete Example

The following example demonstrates a Todo application using multiple nested components.

```text
todo-app/
├── index.html
├── RahaUI.js
│
└── components/
    ├── todo/
    │   ├── todo.html
    │   ├── todo.js
    │   └── todo.css
    │
    ├── todo-form/
    │   ├── todo-form.html
    │   ├── todo-form.js
    │   └── todo-form.css
    │
    ├── todo-list/
    │   ├── todo-list.html
    │   ├── todo-list.js
    │   └── todo-list.css
    │
    └── todo-item/
        ├── todo-item.html
        ├── todo-item.js
        └── todo-item.css
```

The component hierarchy is:

```text
Todo
├── TodoForm
└── TodoList
    ├── TodoItem
    ├── TodoItem
    └── TodoItem
```

A minimal `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Todo App</title>
</head>

<body>

    <main id="app"></main>

    <script src="./RahaUI.js"></script>

    <script>
        const app = new ComponentManager();

        app.addComponent(
            "todo",
            "./components/todo/todo.html",
            [
                {
                    src: "./components/todo/todo.js",
                    isModule: true,
                    inHead: false
                }
            ],
            [
                "./components/todo/todo.css"
            ]
        );

        app.addComponent(
            "todo-form",
            "./components/todo-form/todo-form.html",
            [
                {
                    src: "./components/todo-form/todo-form.js",
                    isModule: true,
                    inHead: false
                }
            ],
            [
                "./components/todo-form/todo-form.css"
            ]
        );

        app.addComponent(
            "todo-list",
            "./components/todo-list/todo-list.html",
            [
                {
                    src: "./components/todo-list/todo-list.js",
                    isModule: true,
                    inHead: false
                }
            ],
            [
                "./components/todo-list/todo-list.css"
            ]
        );

        app.addComponent(
            "todo-item",
            "./components/todo-item/todo-item.html",
            [
                {
                    src: "./components/todo-item/todo-item.js",
                    isModule: true,
                    inHead: false
                }
            ],
            [
                "./components/todo-item/todo-item.css"
            ]
        );

        app.render("todo", "#app");
    </script>

</body>
</html>
```

---

# Progressive Web Apps

RahaUI.js can be used to build Progressive Web Apps.

A PWA requires a web app manifest. The manifest can be created manually or generated using the included `installer.html`.

## Manifest

A basic `manifest.json` can look like:

```json
{
    "name": "My App",
    "short_name": "App",
    "description": "My Progressive Web App",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#000000",
    "icons": [
        {
            "src": "/icons/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any maskable"
        },
        {
            "src": "/icons/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any maskable"
        }
    ]
}
```

Add the manifest to the HTML:

```html
<link rel="manifest" href="./manifest.json">
```

The included `installer.html` provides a form for generating the manifest based on the application's configuration.

---

## Service Worker

RahaUI.js does not require a service worker.

If offline support or caching is required, a service worker can be added manually.

Example:

```js
const CACHE_NAME = "my-app-v1";

const ASSETS = [
    "/",
    "/index.html",
    "/RahaUI.js",
    "/manifest.json"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
```

Register the service worker from your application:

```js
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
}
```

The service worker is independent from RahaUI.js and can be modified according to the application's requirements.

---

# Browser Compatibility

RahaUI.js relies on standard browser APIs, including:

* `fetch()`
* `DOMParser`
* DOM manipulation APIs
* Dynamic `<script>` elements
* Dynamic `<link>` elements
* ES modules when enabled

A modern browser is recommended.

Since components are loaded using `fetch()`, the application should normally be served through a web server or development server rather than opened directly using `file://`.

---

# License

RahaUI.js is released under the **MIT License**.

Copyright (c) 2026 Amir Hosseyn Moeini (RahaUI.js)

See [`LICENSE`](./LICENSE) for the complete license text.
