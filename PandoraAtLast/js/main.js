// Copyright 2011 Roque Pinel.
//
// This file is part of Pandora At Last.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var imageType = false;
var imageCounter = 5;

function updateIcon()
{
	if (!localStorage["running"])
	{
		imageCounter--;
	}

	if (imageCounter > 0)
	{
		if (imageType)
			chrome.browserAction.setIcon({path: "img/PandoraAtLast_19.png"});
		else
			chrome.browserAction.setIcon({path: "img/PandoraAtLast_19_alt.png"});

		imageType = !imageType;

		setTimeout(updateIcon, 400);
	}
	else
	{
		chrome.browserAction.setIcon({path: "img/PandoraAtLast_19.png"});
		imageType = false;
		imageCounter = 3;
	}
}

function addMusic(track, album, artist)
{
	console.log("Track: " + track);
	console.log("Album: " + album);
	console.log("Artist: " + artist);

	var lastFM_SessionKey = localStorage["lastFM_SessionKey"];

	// verify if the user is logged in at LastFM
	if (lastFM_SessionKey)
	{
		localStorage["running"] = true;
		updateIcon();

		console.log("Last.FM, starting scrobble.");

		var lastfm = new LastFM();

		lastfm.setSessionKey(lastFM_SessionKey);

		var timestamp = Math.round(new Date().getTime() / 1000);

		lastfm.scrobble({track: track, album: album, artist: artist, timestamp : timestamp});
	}
	else
	{
		console.log("Could not scrobble. User not logged in Last.FM.");
	}
}

// saving the last listened music
var lastSong;
var lastAlbum;
var lastArtist;

function onRequest(request, sender, sendResponse)
{
	if (request.song && request.album && request.artist)
	{
		if (!lastSong || !lastAlbum || !lastArtist ||
			(lastSong != request.song
				&& lastAlbum != request.album
				&& lastArtist != request.artist))
		{
			lastSong = request.song;
			lastAlbum = request.album;
			lastArtist = request.artist;

			addMusic(request.song, request.album, request.artist);
		}
	}

	// Return nothing to let the connection be cleaned up.
	sendResponse({});
}

/* START */

console.log("Starting Pandora at Last");

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

