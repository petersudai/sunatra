import type { ITrack } from "@/types";

/**
 * Inline script for the shareable track page.
 *
 * Problem: the play buttons are plain server-rendered HTML until React
 * hydrates. On a slow phone connection, a tap in that window does nothing.
 * People arriving from an IG story tap play straight away.
 *
 * Fix: this script runs as soon as the browser parses it (before any bundle
 * has loaded). It owns an <audio> element and starts it inside the tap, which
 * also satisfies mobile autoplay rules. Once the site's PlayerProvider mounts
 * it adopts this same element (see PlayerContext) so playback continues
 * uninterrupted and the bottom player takes over.
 */

/** Serialise a value for safe embedding inside an inline <script>.
 *  "<" becomes the text backslash-u003c so "</script>" can never appear, and
 *  the two JS line separators (which break older parsers) are dropped.
 *  Built from char codes so no escape sequences are needed in this file. */
function jsonForScript(value: unknown): string {
  const BACKSLASH = String.fromCharCode(92);
  return JSON.stringify(value)
    .split("<").join(BACKSLASH + "u003c")
    .split(String.fromCharCode(0x2028)).join("")
    .split(String.fromCharCode(0x2029)).join("");
}

export function earlyPlayScript(track: ITrack): string {
  const json = jsonForScript(track);

  return `(function(){try{
var w=window;if(w.__sunatraEarly)return;
var t=${json};if(!t||!t.audioUrl)return;
var a=new Audio();a.preload="none";
var s=w.__sunatraEarly={audio:a,track:t,started:false,hydrated:false,counted:false};
function paint(st){var g=document.querySelectorAll("[data-early-play] .pg");for(var i=0;i<g.length;i++)g[i].setAttribute("data-state",st);}
a.addEventListener("playing",function(){if(!s.hydrated)paint("playing");});
a.addEventListener("waiting",function(){if(!s.hydrated&&!a.paused)paint("loading");});
a.addEventListener("pause",function(){if(!s.hydrated)paint("idle");});
a.addEventListener("ended",function(){if(!s.hydrated)paint("idle");});
a.addEventListener("error",function(){if(!s.hydrated)paint("idle");});
document.addEventListener("click",function(e){
if(s.hydrated)return;
var el=e.target;var b=el&&el.closest?el.closest("[data-early-play]"):null;
if(!b||b.getAttribute("data-track-id")!==t.id)return;
e.preventDefault();
if(!a.src)a.src=t.audioUrl;
if(!a.paused){a.pause();return;}
s.started=true;paint("loading");
var p=a.play();if(p&&p.catch)p.catch(function(){if(!s.hydrated)paint("idle");});
if(!s.counted){s.counted=true;try{fetch("/api/tracks/"+t.id+"/play",{method:"POST",keepalive:true});}catch(x){}}
},true);
}catch(x){}})();`;
}

/** Shape of the handoff object, shared with PlayerContext. */
export interface EarlyPlayState {
  audio: HTMLAudioElement;
  track: ITrack;
  started: boolean;
  hydrated: boolean;
  counted: boolean;
}
