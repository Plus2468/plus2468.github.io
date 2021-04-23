const INDEX = 
[
	{
		"groupName": "Home",
		"name": "Plus's Github page",
		"single": true,
		"path": "/",
		"type": "site",
		"url": "index"
	},

	{
		"noItem": true, // hiding it until I find any purpose for it

		"groupName": "News",
		"name": "News and stuff",
		"single": true,
		"path": "news/",
		"type": "blog",
		"url": 7,
		"max": 5
	},


	{
		"noItem": "true",
		"path": "bugs/eosd_bugs/",
		"type": "blog",
		"url": 4, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/pcb_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/in_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/pofv_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/mof_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/sa_bugs/",
		"type": "blog",
		"url": 4, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/ufo_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/td_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/ddc_bugs/",
		"type": "blog",
		"url": 7, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/lolk_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/hsifs_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},

	{
		"noItem": "true",
		"path": "bugs/wbawc_bugs/",
		"type": "blog",
		"url": 3, // max page number
		"max": 1,
		"reverse": true
	},


	{
		"groupName": "Bugs",
		"path": "bugs/",
		"content": [
			/*{
				"name": "Overview",
				"type": "site",
				"url": "credits"
			},*/
			/*{
				"name": "PC-98 games",
				"type": "subgroup",
				"children": [
					{
						"name": "HRtP",
						"type": "href",
						"url": "#b=ecl-tutorial/&p=1"
					},
					{
						"name": "SoEW",
						"type": "site",
						"url": "ins"
					},
					{
						"name": "PoDD",
						"type": "site",
						"url": "vars"
					},
					{
						"name": "LLS",
						"type": "site",
						"url": "flags"
					},
					{
						"name": "MS",
						"type": "href",
						"newTab": true,
						"url": "https://github.com/Priw8/eclmap"
					}
				]
			},*/
			{
				"name": "Windows Main games",
				"type": "subgroup",
				"children": [
					{
						"name": "EoSD",
						"type": "site",
						"url": "eosd"
					},
					{
						"name": "PCB",
						"type": "site",
						"url": "pcb"
					},
					{
						"name": "IN",
						"type": "site",
						"url": "in"
					},
					{
						"name": "PoFV",
						"type": "site",
						"url": "pofv"
					},
					{
						"name": "MoF",
						"type": "site",
						"url": "mof"
					},
					{
						"name": "SA",
						"type": "site",
						"url": "sa"
					},
					{
						"name": "UFO",
						"type": "site",
						"url": "ufo"
					},
					{
						"name": "TD",
						"type": "site",
						"url": "td"
					},
					{
						"name": "DDC",
						"type": "site",
						"url": "ddc"
					},
					{
						"name": "LoLK",
						"type": "site",
						"url": "lolk"
					},
					{
						"name": "HSiFS",
						"type": "site",
						"url": "hsifs"
					},
					{
						"name": "WBaWC",
						"type": "site",
						"url": "wbawc"
					}
				]
			},

			{
				"name": "Other games",
				"type": "subgroup",
				"children": [
					{
						"name": "StB",
						"type": "site",
						"url": "/MERLIN/doc/index"
					},
					{
						"name": "DS",
						"type": "site",
						"url": "/MERLIN/doc/index"
					},
					{
						"name": "FW",
						"type": "site",
						"url": "/MERLIN/doc/index"
					},
					{
						"name": "ISC",
						"type": "site",
						"url": "/MERLIN/doc/index"
					},
					{
						"name": "VD",
						"type": "site",
						"url": "/MERLIN/doc/index"
					}
				]
			},
		]
	},


	/*{
		"groupName": "Patches",
		"path": "patches/",
		"content": [
			{
				"name": "MoF",
				"type": "subgroup",
				"children": [
					{
						"name": "Rank patch",
						"type": "site",
						"url": "mof_rank"
					},
					{
						"name": "Mountain of Motion Sickness",
						"type": "site",
						"url": "mof_sickness"
					}
				]
			},
			{
				"name": "DDC",
				"type": "subgroup",
				"children": [
					{
						"name": "DDDDDDDDDDD",
						"type": "site",
						"url": "ddddddddddd"
					}
				]
			},
			{
				"name": "LoLK",
				"type": "subgroup",
				"children": [
					{
						"name": "Legacy of Double Dealing Kingdom",
						"type": "site",
						"url": "loddk"
					}		
				]
			},
			{
				"name": "HSiFS",
				"type": "subgroup",
				"children": [
					{
						"name": "Nonspell practice",
						"type": "site",
						"url": "hsifs_nonprac"
					},
					{
						"name": "Undefined Fantastic Four Seasons",
						"type": "site",
						"url": "uffs"
					},
					{
						"name": "GFW freeze",
						"type": "site",
						"url": "th16ice"
					}
				]
			},
			{
				"name": "WBaWC",
				"type": "subgroup",
				"children": [
					{
						"name": "Practice patch",
						"type": "site",
						"url": "prac"
					},
					{
						"name": "Mystia's Adventure",
						"type": "site",
						"url": "wbawc_mystia"
					}
				]
			},
		]
	},/*

	/*{
		"groupName": "Guides",
		"path": null,
		"content": [
			{
				"name": "ZUNcode Discord",
				"type": "href",
				"newTab": true,
				"url": "https://discord.gg/fvPJvHJ"
			},
			{
				"name": "My Youtube",
				"type": "href",
				"newTab": true,
				"url": "https://www.youtube.com/channel/UCI1HPxKRky4Zm_mrRUH415Q"
			},
			{
				"name": "Priw8's site",
				"type": "href",
				"newTab": true,
				"url": "https://priw8.github.io/"
			},
			{
				"name": "ExpHP's site",
				"type": "href",
				"url": "https://exphp.github.io/thpages/"
			},
			{
				"name": "Maribel's site",
				"type": "href",
				"newTab": true,
				"url": "https://maribelhearn.com/"
			}
		]
	},*/

	{
		"groupName": "Links",
		"path": null,
		"content": [
			{
				"name": "ZUNcode Discord",
				"type": "href",
				"newTab": true,
				"url": "https://discord.gg/fvPJvHJ"
			},
			{
				"name": "My Youtube",
				"type": "href",
				"newTab": true,
				"url": "https://www.youtube.com/channel/UCI1HPxKRky4Zm_mrRUH415Q"
			},
			{
				"name": "Priw8's site",
				"type": "href",
				"newTab": true,
				"url": "https://priw8.github.io/"
			},
			{
				"name": "ExpHP's site",
				"type": "href",
				"url": "https://exphp.github.io/thpages/"
			},
			{
				"name": "Maribel's site",
				"type": "href",
				"newTab": true,
				"url": "https://maribelhearn.com/"
			}
		]
	}
]

const DEFAULT = "default";

const ERROR = `
# An error has occured when loading the page.
Try reloading using **CTRL+F5**, or **clearing browser cache** of this site.  
If the problem persists, contact me on Discord: **Priw8#9873**.
`;

const BLOG_ERROR = `
### An error has occured when loading this content.
If the problem persists, contact me on Discord: **Priw8#9873**.
`;

const EMBED_LOAD_ERROR = `
Failed to load embedded content.  
HTTP status code: %code%
`;
