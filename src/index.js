import Hls from 'hls.js';
import Dash from 'dashjs';
const video = document.createElement('video');
export class ExtVideo extends HTMLElement {
  static get observedAttributes() {
    return [
      'autoplay',
      'autoPictureInPicture',
      'buffered',
      'controls',
      'controlslist',
      'crossorigin',
      'currentTime',
      'disablePictureInPicture',
      'disableRemotePlayback',
      'duration',
      'height',
      'intrinsicsize',
      'loop',
      'muted',
      'playsinline',
      'poster',
      'preload',
      'src',
      'width',
      'style',
      'hls-src'
    ];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).append(video.cloneNode(true));
  }

  set src(source) {
    this.loadVideo(source);
  }

  get src() {
    return this.video.src;
  }
  set hlsSrc(source) {
    this.loadHlsVideo(source);
  }
  set dashSrc(source) {
    this.loadDashVideo(source);
  }

  get hlsSrc() {
    return this.video.src;
  }

  get dashSrc() {
    return this.video.src;
  }

  /**
   *
   *
   * @readonly
   * @returns {HTMLVideoElement} video element
   * @memberof ExtVideo
   */
  get video() {
    // @ts-ignore
    return this.shadowRoot.firstChild;
  }

  clean() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = void 0;
    }

    if (this.dash) {
      const autoplay = this.video.hasAttribute('autoplay');
      this.dash.reset();
      if (autoplay) {
        this.video.setAttribute('autoplay', void 0);
      }
      this.dash = void 0;
    }
    this.video.src = '';
  }

  hlsInit(source) {
    this.hls = new Hls();
    this.hls.attachMedia(this.video);
    this.hls.loadSource(source);
  }

  loadVideo(source) {
    if (!source) return;
    if (0 < source.toLowerCase().indexOf('.m3u8')) {
      this.loadHlsVideo(source);
      return;
    }
    if (0 < source.toLowerCase().indexOf('.mpd')) {
      this.loadDashVideo(source);
      return;
    }
    this.clean();
    this.removeAttribute('hls-src');
    this.removeAttribute('dash-src');
    this.video.src = source;
  }

  loadHlsVideo(source) {
    if (!source) return;
    this.clean();
    this.removeAttribute('src');
    this.removeAttribute('dash-src');
    this.hlsInit(source);
  }

  addEventListener(type, listener) {
    this.video.addEventListener(type, listener);
  }

  removeEventListener(type, listener) {
    this.video.removeEventListener(type, listener);
  }

  loadDashVideo(source) {
    if (!source) return;
    this.clean();
    this.removeAttribute('hls-src');
    this.removeAttribute('src');
    this.dash = Dash.MediaPlayer().create();
    this.dash.initialize(this.video, source);
  }

  setAttribute(qualifiedName, value) {
    super.setAttribute(qualifiedName, value);
    this.video.setAttribute(qualifiedName, value);
  }

  removeAttribute(qualifiedName) {
    super.removeAttribute(qualifiedName);
    this.video.removeAttribute(qualifiedName);
  }

  /**
   * Is called whenever a observed attribute changes
   *
   * @param {string} atb the attribute that changed
   * @param {string} current the current attribute value
   * @param {string} newValue the new attribute value
   * @memberof HLSPlayer
   */
  attributeChangedCallback(atb, current, newValue) {
    console.log('atb');
    switch (atb) {
      case 'src':
        this.loadVideo(newValue);
        break;
      case 'hls-src':
        this.loadHlsVideo(newValue);
        break;
      case 'dash-src':
        this.loadDashVideo(newValue);
        break;
      default:
        this.video.setAttribute(atb, newValue);
        break;
    }
  }
}

window.customElements.define('ext-video', ExtVideo);
