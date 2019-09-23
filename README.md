userscripts
==================

These are some userscripts I made over the years,
some of which used to be up on userscripts.org

Most of them help with downloading manga/comic chapters from online readers,
as I prefer offline readers like [MComix](http://sourceforge.net/projects/mcomix/).


Contents
-----
 * [update-metablocks](#update-metablocks)
 * [Mangadex Fullscreen Reader](#mangadex-fullscreen-reader)
 * [Mangadex Toggle Tags](#mangadex-toggle-tags)
 * [Youtube Hide Watched](#youtube-hide-watched)
 * [Foolslide Download Links](#foolslide-download-links)
 * [Patreon Creator Activity Only](#patreon-creator-activity-only) (probably out of date)
 * [MangaStream Torrent Links](#mangastream-torrent-links) (out of date)
 * [MyAnimeList Hover Info](#myanimelist-hover-info) (out of date)
 * ~~Batoto Download Links~~ (decaprecated)
 * ~~Casanova Download Links~~ (decaprecated)
 * ~~whyfalala~~ (decaprecated)



<h2 id="update-metablocks">
	<a href="update-metablocks">update-metablocks</a>
</h2>

update-metablocks is a small shell script that takes the
```javascript
      ==Userscript==
      ...
      ==/Userscript==
```
metablocks from userscript files, and copies them into *.meta.js files.

It's features inclede automatic @date updating and insertion.

For examples run `./update-metablocks --help` for documentation
or `./update-metablocks */*.user.js` to do a dry run on all user.js files.

<h2 id="mangadex-fullscreen-reader">Mangadex Fullscreen Reader</h2>

A Proof of Concept script I created for a [feature suggestion](https://mangadex.org/thread/68879) I made.

It has a lot of issues, chief of which is that vertical scrolling with the keys does not seem to work, so I haven't re-worked it as an installable userscript but it could serve as the basis of one.

<h2 id="mangadex-toggle-tags">Mangadex Toggle Tags</h2>

A script I made as a client-side implementation for [this feature request](https://mangadex.org/thread/172646).

It toggles the visibility of tags on title pages to avoid possible spoilers, with an option to show them.



<h2 id="foolslide-download-links">
        <a href="foolslide-download-links/foolslide-download-links.user.js">FoOlslide Download Links</a>
</h2>

Adds Download Links to Foolslide reader links on a (front) page.

Is only set to work for [Akashi Scans](http://akashiscans.com/) by default,
but should work for any page you know contains links to a [FoOlslide](https://foolcode.github.io/FoOlSlide/) reader.

<div class="screenshots" style="max-wdith: 80%" align="center">
	<h5>Screenshots:</h5>
    <img src="http://i.imgur.com/0UpEihx.png" alt="Download links" />
    <br />
    <img src="http://i.imgur.com/f0GgH1D.png" width="75%" alt="Multiple Download Links" />
</div>



<h2 id="mangastream-torrent-links">
	<a href="mangastream-torrent-links/mangastream_torrent_link.user.js">Mangastream Torrent Links</a>
</h2>

Provides direct image and external download links for the the [MangaStream](http://mangastream.com/) Reader.

 <div class="screenshots" style="max-width: 80%" align="center">
	<h5>Screenshots:</h5>
    <img src="http://i.imgur.com/ieHxlwd.png" alt="Navigation Menu" />
    <img src="http://i.imgur.com/474MQmC.png" width="33%" alt="Direct Links" />
    <img src="http://i.imgur.com/mWIIKGy.png" width="33%" alt="Torrent Links" />
</div>

<h2 id="myanimelist-hover-info">
	<a href="myanimelist-hover-info/myanimelist-hover-info.user.js">MyAnimeList Hover Info</a>
</h2>

Adds hovering info boxes to links on [MyAnimeList](http://myanimelist.net)
similar to the ones on Top Anime/Manga pages, to normal links.

**Note**: This is a very dirty hack; it doesn't work great, and it never will.

<div class="screenshots" style="max-width: 80%" align="center">
	<h5>Screenshots:</h5>
    <img src="http://i.imgur.com/7FWhhrR.png" width="45%"alt="On shared lists" />
	<img src="http://i.imgur.com/GWoKkvR.png" width="45%"alt="On profiles" />
</div>


<h2 id="patreon-creator-activity-only">
	<a href="patreon-creator-activity-only/Patreon_Creator_Activity_Only.user.js">Patreon Creator Activity Only</a>
</h2>

Hides non-creator posts on [Patreon](https://www.patreon.com/)
from a projects Activity page.

<div class="screenshots" style="max-width: 80%" align="center">
	<h5>Screenshots:</h5>
    <img src="http://i.imgur.com/F21HAI5.png" width="45%" alt="Hide comments off" />
    <img src="http://i.imgur.com/J3KBBWo.png" width="45%" alt="Hide comments on"  />
</div>


<h2 id="youtube-hide-watched">
	<a href="youtube-hide-watched/youtube-hide-watched.user.js">Youtube Hide Watched</a>
</h2>

A no-nonsense userscript that hides watched videos from your subscription inbox on [Youtube](https://www.youtube.com/feed/subscriptions).


<div class="screenshots" style="max-width: 80%" align="center">
	<h5>Screenshots:</h5>
    <img src="http://i.imgur.com/1i1P5bI.png" width="90%" alt="Navigation Menu" />
    <img src="http://i.imgur.com/4Y9AsDi.png" width="45%" alt="Hide Videos off" />
    <img src="http://i.imgur.com/4EuPN1x.png" width="45%" alt="Hide videos on"  />
</div>