import { MediaPlayer } from 'dashjs';
import Hls from 'hls.js';

/**
 * Extended video element with HLS and Dash support
 *
 * @export
 * @class ExtVideo
 * @extends {HTMLVideoElement}
 */
export class ExtVideo extends HTMLVideoElement {
  static get observedAttributes() {
    return ['src'];
  }


  /**
   * @see {HTMLVideoElement.src}
   * Extends src to handle clearing of HLS and DASH content when required
   *
   * @memberof ExtVideo
   */
  set src(source) {
    if (this.isVideo(source)) this.clean();
    super.src = source;
  }


  /**
   * @see {HTMLVideoElement.setAttribute}
   * Extends setAttribute to handle clearing of HLS and DASH content when required
   *
   * @param {*} qualifiedName
   * @param {*} value
   * @memberof ExtVideo
   */
  setAttribute(qualifiedName, value) {
    if (qualifiedName === 'src' && this.isVideo(value)) this.clean();
    super.setAttribute(qualifiedName, value);
  }

  /**
   * Handles cleans up of dash and hls playback
   *
   * @memberof ExtVideo
   */
  clean() {
    if (this.dash) {
      const autoplay = this.hasAttribute('autoplay');
      this.dash.reset();
      if (autoplay) {
        this.setAttribute('autoplay', void 0);
      }
      this.dash = void 0;
    }
    if (this.hls) {
      this.hls.destroy();
      this.hls = void 0;
    }
  }

  /**
   * short hand way for searching source strings for patterns
   *
   * @param {string} source source string to be test
   * @param {string} is string partial being search for
   * @returns
   * @memberof ExtVideo
   */
  is(source, is) {
    return 0 < source.toLowerCase().indexOf(is);
  }

  /**
   *
   *
   * @param {string} source source url attempting to be used
   * @returns {boolean}
   * @memberof ExtVideo
   */
  isBlob(source) {
    return this.is(source, 'blob:http');
  }
  /**
   *
   *
   * @param {string} source source url attempting to be used
   * @returns {boolean}
   * @memberof ExtVideo
   */
  isM3u8(source) {
    return this.is(source, '.m3u8');
  }
  /**
   *
   *
   * @param {string} source source url attempting to be used
   * @returns {boolean}
   * @memberof ExtVideo
   */
  isMpd(source) {
    return this.is(source, '.mpd');
  }
  /**
   *
   *
   * @param {string} source source url attempting to be used
   * @returns {boolean}
   * @memberof ExtVideo
   */
  isMp4(source) {
    return this.is(source, '.mp4');
  }

  /**
   *
   *
   * @param {string} source source url attempting to be used
   * @returns {boolean}
   * @memberof ExtVideo
   */
  isVideo(source) {
    return this.isM3u8(source) || this.isMpd(source) || this.isMp4(source);
  }

  /**
   * Initialize HLS video
   *
   * @param {string} source
   * @memberof ExtVideo
   */
  hlsInit(source) {
    this.hls = new Hls();
    this.hls.attachMedia(this);
    this.hls.loadSource(source);
  }

  /**
   * Handles loading of non-standard browser video formats. Falls back to default browser behavior
   *
   * @param {string} source
   * @returns
   * @memberof ExtVideo
   */
  loadVideo(source) {
    if (!source) return;
    else if (this.isM3u8(source)) return void this.loadHlsVideo(source);
    else if (this.isMpd(source)) return void this.loadDashVideo(source);
  }

  /**
   * Readies player for HLS playback
   *
   * @param {string} source
   * @returns
   * @memberof ExtVideo
   */
  loadHlsVideo(source) {
    if (!source) return;
    this.clean();
    this.hlsInit(source);
  }

  /**
   * Readies player for Dash playback
   *
   * @param {*} source
   * @returns
   * @memberof ExtVideo
   */
  loadDashVideo(source) {
    if (!source) return;
    this.clean();
    this.dash = MediaPlayer().create();
    this.dash.initialize(this, source, this.hasAttribute('autoplay'));
  }

  /**
   * Is called whenever a observed attribute changes
   *
   * @param {string} atb the attribute that changed
   * @param {string} _ the current attribute value
   * @param {string} newValue the new attribute value
   * @memberof HLSPlayer
   */
  attributeChangedCallback(atb, _, newValue) {
    switch (atb) {
      case 'src':
        if (typeof newValue !== 'string' || this.isBlob(newValue)) return;
        this.loadVideo(newValue);
        break;
    }
  }
}
export default ExtVideo;
window.customElements.define('ext-video', ExtVideo, { extends: 'video' });
