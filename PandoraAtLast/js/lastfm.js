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

function LastFM()
{
	var API_KEY = "API_KEY";
	var API_SECRET = "API_SECRET";
	var API_URL = "http://ws.audioscrobbler.com/2.0/";

	var sessionKey;

	this.getSessionKey = function()
	{
		return sessionKey;
	}

	this.setSessionKey = function(value)
	{
		sessionKey = value;
	}

	this.session = function(params)
	{
		var authToken = MD5(params.username + MD5(params.password));

		params =
		{
			username  : params.username,
			api_key   : API_KEY,
			authToken : authToken,
			method    : "auth.getMobileSession"
		};

		var http = new XMLHttpRequest();
		var timeout = setTimeout(
						function ()
						{
							http.abort();
							return;
						},
					3000);
		http.open("GET", getURL(params), false);
		http.onreadystatechange = function ()
		{
			if (http.readyState == 4 && http.status == 200)
			{
				if (http.responseXML.getElementsByTagName('lfm')[0].attributes.getNamedItem("status").value == "ok")
				{
					sessionKey = http.responseXML.getElementsByTagName('key')[0].firstChild.nodeValue;
				}
			}
		}
		http.send();
	};

	this.scrobble = function(params)
	{
		params.api_key = API_KEY;
		params.method  = "track.scrobble";
		params.sk      = sessionKey;

		var http = new XMLHttpRequest();
		var timeout = setTimeout(
						function ()
						{
							http.abort();
							return;
						},
					3000);
		http.open("POST", getURL(params), false);
		http.onreadystatechange = function ()
		{
			if (http.readyState == 4 && http.status == 200)
			{
				// empty
			}
			localStorage.removeItem("running");
		}
		http.send();
	};

	var getURL = function(params)
	{
		var keys   = [];
		var str = '';

		for(var key in params)
		{
			keys.push(key);
		}
		keys.sort();

		for(var index in keys)
		{
			var key = keys[index];

			str += key + params[key];
		}
		str += API_SECRET;

		params.api_sig = MD5(str);

		var url = API_URL + "?";

		var isFirst = true;

		for(var key in params)
		{
			if (!isFirst)
			{
				url += '&';
			}
		
			url += key + '=' + params[key];

			isFirst = false;
		}

		return url;
	};
}

