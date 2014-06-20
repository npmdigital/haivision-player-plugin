havision_player_plugin
======================

jQuery plugin to make it super easy to drop in a haivision player on your site. Just call it like a typical jquery plugin - use the jQuery selector for the DOM element that should contain the player, then pass in the parameters described below. 

By default the player wraps the haivsion iframe embed in a responsive div.

Usage
-----
**Option 1**
If you know the Haivision Media ID (e.g. 3wDz6T35oJmC, NOT the guid), use this option:


	var playerArgs = { 
		playerId: 'Jodv123_sdj3Q', 
		feedId: 'LaOasdfj1af17', 
		debug: true,
		type: 'video',
		params: {
			form: 'html',
			affiliate: 'yourmove.is'
		}
	};

	$("#my-player").npm_hvplayer('3wDz6T35oJmC', playerArgs);

* Parmaters described Below

**Option 2**
If you only know the GUID (e.g. 64b6761a-f191-11e3-b115-991ec995921a), use this option:

	$("#my-player").npm_hvplayer_by_guid('64b6761a-f191-11e3-b115-991ec995921a', playerArgs);

**NOTE: This method makes an extra web service call to the Haivision feed, so it's preferred to use Option 1**

Parameters
-----
|Param		|Default		|Description	
|-----------|---------------|-----------
|accountId*	|*n/a* |Haivision Account Identifier
|playerId*	|*n/a* |The ID of the Haivision Player to use
|feedId*		|*n/a* |Only needed if using the by_guid method, Identifier for the Haivision feed to query for the media
|wrap		|true  |If true, the player embed will be wrapped in divs that attempt to maintain aspect ratio and make it responsive
|width		|100%  |By default, tries to fill the parent container
|height		|100%  |By default, tries to fill the parent container
|debug	    |false |Set to true to output debugging info
|type		|video |Used only when using by_guid - to specify which media to pull out of the feed response
|params		|{form:'html'}|Query string parameters to add on to the end of the player URL - affiliate helps with reporting, so typically that would be the URL of your site or some identifier

*required parameter

