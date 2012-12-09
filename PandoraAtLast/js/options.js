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

$(document).ready(function()
{
	//$('#status').hide();
	$('#btn_logout').hide();

	var lastFM_Username = localStorage["lastFM_Username"];

	if (lastFM_Username)
	{
		$('#lastFM_Username').val(lastFM_Username);
		$('#btn_logout').show();
	}

	$("#btn_logout").click(function ()
	{
		// removing items from local storage
		localStorage.removeItem("lastFM_Username");
		localStorage.removeItem("lastFM_SessionKey");

		show_message("Successfully logged out.");
		console.log("User logged out of LastFM");

		$('#lastFM_Username').val("");
		$('#lastFM_Password').val("");
		$('#btn_logout').hide();
	});
	$("#btn_save").click(function ()
	{
		var lastFM_Username;
		var lastFM_Password;

		if ($('#lastFM_Username').val())
		{
			lastFM_Username = jQuery.trim($('#lastFM_Username').val());
		}
		if ($('#lastFM_Password').val())
		{
			lastFM_Password = jQuery.trim($('#lastFM_Password').val());
		}

		if (!lastFM_Username && !lastFM_Password)
		{
			show_error_message("The Last.FM username and password are required.");
		}
		else if (!lastFM_Username)
		{
			show_error_message("The Last.FM username is required.");
		}
		else if (!lastFM_Password)
		{
			show_error_message("The Last.FM  password is required.");
		}
		else
		{
			var lastfm = new LastFM();

			lastfm.session({username: lastFM_Username, password: lastFM_Password});

			localStorage["lastFM_Username"] = lastFM_Username;
			localStorage["lastFM_SessionKey"] = lastfm.getSessionKey();

			show_message("Successfully logged in.");
			console.log("User logged in Last.FM: " + lastFM_Username);

			$('#lastFM_Password').val("");
			$('#btn_logout').show();
		}
	});
});

function show_error_message (text)
{
	update_status("red", text);
}

function show_message (text)
{
	update_status("green", text);
}

function update_status(color, text)
{
	$('#status').css({color: color});
	$('#status').text(text);
	$('#status').show();

	setTimeout(function()
	{
		$("#status").fadeOut("slow", function ()
		{
			$("#status").hide();
		});

	}, 2000);
}

