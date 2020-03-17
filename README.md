# Ext Video Web Component

An attempt at making a better video element that can play HLS and Dash videos.

https://smithaf.github.io/ext-video/index.html


## How to use

Import the module through JavaScript or HTML.

```js
import 'ext-video'
```

```html
<script src="ext-video"></script>
```

Doing this will register the web component.


Then to use it, set the `is` attribute on a video element

```html
<video is="ext-video" src="file.m3u8">
```