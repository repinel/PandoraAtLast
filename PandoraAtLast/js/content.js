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

function timeChecker()
{
	setTimeout("checkUpdate()", 3000);
}

function checkUpdate()
{
	var parameters = {
		song: $("a.playerBarSong").text(),
		album: $("a.playerBarAlbum").text(),
		artist: $("a.playerBarArtist").text()
	};

	chrome.extension.sendRequest(parameters, function(response) {});

	timeChecker();
}

$(document).ready(function()
{
	timeChecker();
});

