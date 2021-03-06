let MD = new showdown.Converter({
	extensions: [ext],
	tables: true,
	strikethrough: true
});
let $content = document.querySelector(".content-wrapper");
let $scriptContent = document.querySelector(".script-wrapper");
let cache = {};
let blog = [];
let active = "";
let activePage = "";
let $tip = null;
let $activeTipTarget = null;
let contentLoadListeners = [];

function contentLoaded() {
	for (let i=0; i<contentLoadListeners.length; ++i) 
		contentLoadListeners[i]();
	contentLoadListeners.splice(0, contentLoadListeners.length);
}

function onContentLoad(clb) {
	contentLoadListeners.push(clb);
}

function initNavigation() {
	let $nav = document.querySelector(".header-navigation");
	let html = getNavigation(INDEX);
	$nav.innerHTML = html;
	$nav.addEventListener("click", handleNavigation);
	window.addEventListener("hashchange", initContent, false);
}

function getNavigation(data) {
	let html = "";
	for (let i=0; i<data.length; i++) {
		if (!data[i].noItem) html += getNavigationEntry(data[i]);
	}
	return html;
}

function getNavigationEntry(data) {
	let html;
	html = "<div class='navigation-entry'  data-path='"+data.path+"'>";
	if (!data.single) {
		html += "<div class='navigation-entry-name' onclick='openNav"+data.groupName+"()'>"+data.groupName+"</div>";
		html += "<div class='navigation-entry-list' style='width: 0px;' id='sideNavBar"+data.groupName+"'>"; //side navbar
		html += "<a href='javascript:void(0)' class='closebtn' onclick='closeNav()'>&times;</a>"; //close button
		html += getNavigationEntryList(data)
		html += "</div>";
	} else {
		html += "<a " + getNavEntryHref(data, data.path) + " ><div class='navigation-entry-name' "+getNavEntryDatasetString(data, data.path)+">"+data.name+"</div></a>";
	};
	html += "</div>";
	return html;
}

function getNavigationEntryList(data) {
	let html = "";
	for (let i=0; i<data.content.length; i++) {
		let item = data.content[i];
		if (item.type == "subgroup") {
			html += "<div class='navigation-entry-list-item subgroup-parent' onclick='openNavGames("+whiteSpaceRemove(item.name)+")'>";
			html += "<span>" + item.name + "</span></div>";
			html += "<div class='color-rectangle' style='background-color:"+item.color+";'></div>";
			html += "<div id='"+whiteSpaceRemove(item.name)+"' class='navigation-entry-list' style='width: 0px;'>" + getNavigationEntryList({
				path: data.path,
				content: item.children
			}) + "<a href='javascript:void(0)' class='closebtn' onclick='closeNav()'>&times;</a></div>";
		} else {
			html += "<a " + getNavEntryHref(item, data.path) + " ><div class='"+getNavTopName(item)+" navigation-entry-list-item' "+getNavEntryDatasetString(item, data.path) + ">"+item.name+"</div><div class='color-rectangle' style='background-color:"+item.color+";'></div></a>";
		}
	}
	return html;
}

function whiteSpaceRemove(data) {
	let dataNew = data.replace(/ /g, "").replace(/"/g, "").replace(/'/g, "").replace(/\(|\)/g, "").replace(/-/g, '').replace(/[^\x00-\x7F]/g, ""); //removes space , quotation marks", quotation marks', parantheses(), and hyphen-, non-unicode like jp/emojis
	
	return dataNew;
}

function getNavTopName(item) {
	if (item.type == "nolink") {
		return "top-text";
	} else return;

}

function getNavEntryDatasetString(item, path) {
	return "data-type='"+item.type+"' data-url='"+item.url+"' data-path='"+path+"' data-newtab='"+item.newTab+"'";
}

function getNavEntryHref(item, path) {
	return `href='${
		item.type == "href" //if
			? item.url //then
			: item.type == "blog" //if
				? "#b=" + path + "&p=1" //then
				: item.type == "bugsite" //if
					? "#b=" + path + item.url //then
					: "#s=" + path + item.url //else
	}'`;
}

function handleNavigation(e) {
	if (typeof e.target.dataset.type != "undefined") {
		navigate(e.target.dataset);
		e.preventDefault();
	}
}

function navigate(data) {
	let path = data.path, url = data.url;
	if (url.charAt(0) == "/") {
		const li = url.lastIndexOf("/");
		path = url.substring(1, li);
		url = url.substring(li);
	}

	if (data.type == "href") {
		if (data.newtab == "true") {
			window.open(url);
		} else {
			window.location.replace(url);
		}
	} else if (data.type == "site") {
		loadContent(path, url);
	} else if (data.type == "bugsite") {
		window.location.replace(url);
	} else if (data.type == "blog") {
		let group = getGroupByPath(path);
		loadBlog(path, url, 1, group.max, group.reverse);
	};
}

function loadBlog(path, index, page, max, reverse) {
	if (active && active == path && activePage == page) return;
	active = path;
	activePage = page;
	index = parseInt(index);
	let start, end;
	if (!reverse) {
		start = Math.max(index - page*max, 0);
		end = index - (page-1)*max;
	} else {
		start = (page-1)*max;
		end = Math.min(page*max, index);
	}
	setupBlogContent(index, page, start, end, max);
	for (let i=start; i<end; i++) {
		let index = i;
		getContent(path, index, function(txt) {
			loadOneBlogEntry(txt, index, max > 1);
		}, function() {
			loadOneBlogEntry(BLOG_ERROR, index, false);
		});
	}
	let query = buildQuery({
		"b": path,
		"p": page
	});
	location.hash = query;
	setActiveNavigation(path, "");
	setWindowTitle(path, "");
	resetScroll();
}

function loadOneBlogEntry(txt, index, standaloneLink) {
	let html = MD.makeHtml(txt);
	if (standaloneLink) html += "<a class='blog-entry-link' data-blogindex='"+index+"'>Standalone page</a>";
	blog[index].$.innerHTML = html;
	blog[index].loaded = true;
	blog[index].$.style.opacity = "1.0";
	blog[index].$.addEventListener("click", blogEntryLinkHandler);
}

function blogEntryLinkHandler(e) {
	let $targ = e.target;
	if ($targ.dataset["blogindex"]) loadContent(active, $targ.dataset["blogindex"]);
}

function setupBlogContent(index, page, start, end, max) {
	blog = blog.splice(0, blog.length);
	let $div = document.createElement("div");
	$div.classList.add("content");
	$div.style.opacity = "0.0";
	$scriptContent.innerHTML = "";
	$content.innerHTML = "";
	for (let i=index; i>=0; i--) {
		blog[i] = {
			$: $div.cloneNode(),
			loaded: false
		}
	}
	for (let i=end-1; i>=start; i--) {
		$content.appendChild(blog[i].$);
	}
	let $pageNav = createBlogNavigation(index, parseInt(page), max);
	$content.appendChild($pageNav);
	contentLoaded();
}

function createBlogNavigation(index, page, max) {
	let pages = Math.ceil(index/max);
	let html = "";
	for (let i=page-2; i<page+3; i++) {
		if (i < 1 || i > pages) continue;
		let active = i == page ? "active" : "";
		html += "<div class='blog-navigation-entry "+active+"' data-page='"+i+"'>"+i+"</div>";
	};
	if (page - 2 > 1) html = "<div class='blog-navigation-entry' data-page='1'>1</div>..." + html;
	if (page +2 < pages) html += "...<div class='blog-navigation-entry' data-page='"+pages+"'>"+pages+"</div>";
	let $div = document.createElement("div");
	$div.classList.add("blog-navigation-wrapper");
	let $nav = document.createElement("div");
	$nav.classList.add("blog-navigation");
	$div.appendChild($nav);
	$nav.innerHTML = html;
	$nav.addEventListener("click", blogNavigationHandler);
	return $div;
}

function blogNavigationHandler(e) {
	let $targ = e.target;
	if ($targ.dataset.page && !$targ.classList.contains("active")) {
		let query = parseQuery();
		let group = getGroupByPath(query.b);
		loadBlog(group.path, group.url, $targ.dataset.page, group.max, group.reverse);
	}
}

function getContent(path, file, clb, err, forceDelay) {
	let realPath = path+file;
	if (cache[realPath]) {
		if (!forceDelay) {
			return clb(cache[realPath]);
		} else {
			setTimeout(() => clb(cache[realPath]), 1);
		}
	};
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "content/"+realPath+".md");
	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				clb(this.responseText);
				cache[realPath] = this.responseText;
			} else {
				err.apply(this, arguments);
			};
		}
	};
	xhr.send();
}

function getInclude(realPath, id) {
	// getIncludeTarget can't be here, because include target doesn't exist yet when this function is called
	getContent(realPath, "", function(txt) {
		let $target = getIncludeTarget(id);
		$target.innerHTML = MD.makeHtml(txt);
	}, function() {
		let $target = getIncludeTarget(id);
		$target.innerHTML = EMBED_LOAD_ERROR.replace("%code%", this.status);
	}, true);
}

function getIncludeTarget(id) {
	return document.querySelector("#included-content-"+id);
}

function loadContent(path, file, writeQuery=true) {
	if (active && active == file) return;
	const group = getGroupByPath(path);
	if (group != null && group.type == "redirect") {
		return loadContent(group.url, file);
	}
	active = file;
	getContent(path, file, function(txt) {
		loadMd(txt, path, file);
	}, function() {
		loadMd(getErrorString(path, file), path, file);
		active = "";
	});
	if (writeQuery) {
		let query = buildQuery({
			"s": path+file
		});
		location.hash = query;
	}
}

function getErrorString(path, file) {
	let str = ERROR;
	str += "  \n  \n  **Requested path**: `"+path+"`";
	str += "  \n  **Requested file**: `"+file+".md`";

	let group = getGroupByPath(path);
	if (group) {
		if (group.type == "blog") {
			str += "  \n  \n  You're trying to access a 'blog' type page by loading it as a 'site' page instead. Use [this link](#b="+group.path+"&p=1) to load it correctly.";
		} else {
			str += "  \n  \n  You might be looking for one of the following pages:  \n"
			let list = group.single ? [group] : group.content;
			str += getErrorStringFromList(group, list);
		};
	};
	return str;
}

function getErrorStringFromList(group, list) {
	let str = "";
	for (let i=0; i<list.length; i++) {
		let entry = list[i];
		if (entry.type == "subgroup") {
			str += "#### " + entry.name + "\n";
			str += getErrorStringFromList(group, entry.children);
		} else if (entry.type == "site") {
			const path = (entry.url[0] != "/" ? group.path : "") + entry.url;
			let url = "#"+buildQuery({s: path});
			str += "- `" + path + ".md` - ["+entry.name+"]("+url+")  \n";
		} else {
			let url = entry.url;
			str += "- `"+entry.url+"` - ["+entry.name+"]("+url+")  \n";	
		}
	}
	return str;
}

function getGroupByPath(path) {
	for (let i=0; i<INDEX.length; i++) {
		if (INDEX[i].path == path) return INDEX[i];
	};
	return null;
}

function loadMd(txt, path, file) {
	setWindowTitle(path, file);
	$scriptContent.innerHTML = "";
	let html = MD.makeHtml(txt);
	$content.innerHTML = "<div class='content'>"+ html + "</div>";
	setActiveNavigation(path, file);
	resetScroll();
	contentLoaded();
}

function resetScroll() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

function setWindowTitle(path, file) {
	let group;
	for (let i=0; i<INDEX.length; i++) {
		group = INDEX[i];
		if (group.path == path) break;
	}
	if (group.single) document.head.querySelector("title").innerText = group.name;
	else {
		setWindowTitleGroup(file, group.content);
	}
}

function setWindowTitleGroup(file, group) {
	for (let i=0; i<group.length; i++) {
		let item = group[i];
		if (item.type == "subgroup") setWindowTitleGroup(file, item.children);
		else if (item.url == file) document.head.querySelector("title").innerText = item.name;
	}
}

function setWindowTitleDirect(str) {
	document.head.querySelector("title").innerText = str;
}

function setActiveNavigation(path, file) {
	let $active, $activeItem;

	$active = document.querySelector(".navigation-entry.active");
	if ($active != null) {
		$active.classList.remove("active");
		$activeItem = $active.querySelector(".active");
		if ($activeItem != null) $activeItem.classList.remove("active");
	};

	$active = document.querySelector(".navigation-entry[data-path='"+path+"']");
	if ($active != null) {
		$active.classList.add("active");
		$activeItem = $active.querySelector("[data-url='"+file+"']");
		if ($activeItem != null) $activeItem.classList.add("active");
	};
}

function initContent() {
	let query = parseQuery();
	if (query.s) {
		let spl = query.s.split("/");
		let file = spl.pop();
		let path = spl.join("/") + "/";
		loadContent(path, file, false);
	} else if (query.b) {
		let group = getGroupByPath(query.b);
		loadBlog(group.path, group.url, query.p, group.max, group.reverse);
	} else loadContent("/", "index");
};

function parseQuery() {
	let ret = {};
	let s = location.hash;
	s = s.substring(1);
	let spl = s.split("&");
	for (let i=0; i<spl.length; i++) {
		let tmp = spl[i].split("=");
		ret[tmp[0]] = tmp[1];
	};
	return ret;
};

function buildQuery(query) {
	let str = "";
	let first = true;
	for (let key in query) {
		if (first) first = false;
		else str += "&";
		str += key + "=" + query[key];
	};
	return str;
}

function highlightCode(content) {
	return hljs.fixMarkup(hljs.highlight("cpp", content, true, false).value).replace(/_/g, "\\_").replace(/\*/g, "\\*");
}

function resize() {
	if (screen.width < 540) {
		document.querySelector("#viewport").setAttribute("content", "width=540px, user-scalable=no");
	} else {
		// make it actually usable with horizontal orientation
		let w = "device-width";
		if (screen.height < 450) w = "900px";
		document.querySelector("#viewport").setAttribute("content", "width="+w+", user-scalable=no");
	};
};

function initResize() {
	window.onresize = resize;
	resize();
};

function getElementData($elem, key) {
	do {
		if (typeof $elem.dataset[key] != "undefined")
			return [$elem.dataset[key], $elem];
	} while ($elem = $elem.parentElement);
	return ["", null];
}

function initTips() {
	$tip = document.querySelector(".tip");
	document.body.addEventListener("mouseover", tipIn);
	document.body.addEventListener("mouseout", tipOut);
}

function tipIn(e) {
	let [tip, $targ] = getTip(e.target);
	if (tip) showTip(tip, $targ, e.target);
}

function showTip(tip, $targ, $realTarg) {
	$activeTipTarget = $realTarg;
	$tip.style.display = "block";
	$tip.innerHTML = tip;
	let tipRect = $tip.getBoundingClientRect();
	let rect = $targ.getBoundingClientRect();
	let top = rect.top - /*rect.height/2 -*/ tipRect.height + window.scrollY;
	let left = rect.left + rect.width/2 - tipRect.width/2;
	if (left < 0) left = 0;
	let max = document.body.offsetWidth - tipRect.width;
	if (left > max) left = max;
	$tip.style.top = top + "px";
	$tip.style.left = left + "px";
}

function tipOut(e) {
	if (e.target == $activeTipTarget) {
		$tip.style.display = "none";
		$activeTipTarget = null;
	}
}

function getTip($targ) {
	return getElementData($targ, "tip");
}

function initEmbeds() {
	document.addEventListener("click", e => {
		let [url, $elem] = getElementData(e.target, "video");
		if ($elem != null) {
			$elem = $elem.firstChild; // the wrapper consists of 2 elements
			$elem.removeChild($elem.firstChild);
			let $video = document.createElement("video");
			$video.setAttribute("controls", "");
			let $source = document.createElement("source");
			$source.setAttribute("src", url);
			$video.appendChild($source);
			$elem.appendChild($video);
		}
		[url, $elem] = getElementData(e.target, "yt");
		if ($elem != null) {
			$elem = $elem.firstChild;
			$elem.removeChild($elem.firstChild);
			let $iframe = document.createElement("iframe");
			$iframe.src = "https://www.youtube.com/embed/"+url;
			$elem.appendChild($iframe);
		}
	});
}

function openNavBugs() {
	document.getElementById("sideNavBarBugs").style.width = "100%";
}

function openNavLinks() {
	document.getElementById("sideNavBarLinks").style.width = "200px";
}

var names = ['sideNavBarBugs', 'sideNavBarLinks', 'theEmbodimentofScarletDevil', 'PerfectCherryBlossom', 'ImperishableNight', 'PhantasmagoriaofFlowerView', 'ShoottheBullet', 'MountainofFaith', 'SubterraneanAnimism', 'UndefinedFantasticObject', 'DoubleSpoiler', 'FairyWars', 'TenDesires', 'DoubleDealingCharacter', 'ImpossibleSpellCard', 'LegacyofLunaticKingdom', 'HiddenStarinFourSeasons', 'VioletDetector', 'WilyBeastandWeakestCreature', 'UnconnectedMarketeers'];

function closeNav() {
	for(var i = 0; i < names.length; ++i) {
		document.getElementById(names[i]).style.width = "0px";
	}
}

window.addEventListener('mouseup', function(event) {
	for(var i = 0; i < names.length; ++i) {
		var pol = document.getElementById(names[i]);
		if (event.target != pol && event.target.parentNode != pol) {
			pol.style.width = '0px';
		}
	}
	// for after dinner: try using some for loop + an array - edit wow i can actually do js !
})

function openNavGames(idk) {
	var i = names.indexOf(idk.id, 2); //if PerfectCherryBlossom return 1 (index of PCB) + 2 (i think idk man)
	var name = document.getElementById(names[i]);
		if (name.style.width === "0px") {	
			name.style.width = "100%";
		} else {
			name.style.width = "0px";
		}
}

function getGameFromURL() {
	let url = window.location.hash; // #b=bugs/ddc_bugs/&p=1
	let gameName;
	if (url.slice(0, 8) == "#b=bugs/") { // prevents page from not loading stuff if it is not true
		gameName = /\#b\=bugs\/(.*?)\_bugs\//i.exec(url)[1]; // ddc
	}
	return gameName;
}

function initScrollBar() {
    // Create the <style>
    var style = document.createElement("style");
    var css = "::-webkit-scrollbar {width: 5px;}  ::-webkit-scrollbar-track {box-shadow: inset 0 0 3px grey; }::-webkit-scrollbar-thumb {background: " + colorHex(); +"";
	css += "; border-radius: 1px;}::-webkit-scrollbar-thumb:hover {background: " +colorRGB();+ "";
	css += "; }";

    // WebKit hack :(
    style.appendChild(document.createTextNode(css));

    // Add the <style> element to the page
    document.body.appendChild(style);
    return style.sheet;
}

function colorHex() {
	let games = ['hrtp', 'soew', 'podd', 'lls', 'ms', 'eosd', 'pcb', 'in', 'pofv', 'stb', 'mof', 'sa', 'ufo', 'ds', 'fw', 'ts', 'ddc', 'isc', 'lolk', 'hsifs', 'vd', 'wbawc', 'um'];
	let colors = ['#888888', '#888888', '#888888', '#888888', '#888888', '#FF0000', '#FF8ED2', '#333399', '#058060', '#009973', '#96B300', '#591400', '#4169E1', '#7D3884', '#00C8C8', '#4A808C', '#AA7777', '#B6423C', '#6A47BE', '#176E0E', '#AE11D5', '#190E0E', '#1DD294'];
	let gameName = getGameFromURL(); // ddc
	let posGames = games.indexOf(gameName); // 16
	let scrollBarColor;
	if (posGames == "-1") {
		scrollBarColor = "#888888";
	} else {
		scrollBarColor = colors[posGames]; // #AA7777
	}
	
	return scrollBarColor;
}

function colorRGB() {
	const add = 32;
	let colourHex = colorHex();
	let rHex = "0x" + colourHex.substring(1, 3); // 0xAB
	let gHex = "0x" + colourHex.substring(3, 5); // 0xCD
	let bHex = "0x" + colourHex.substring(5, 7); // 0xEF

	let rDec = parseInt(rHex) + add;
	let gDec = parseInt(gHex) + add;
	let bDec = parseInt(bHex) + add;

	if (rDec > 255) {rDec = 255;}
	if (gDec > 255) {gDec = 255;}
	if (bDec > 255) {bDec = 255;}

	let output = "rgba("+rDec+", "+gDec+ ", "+bDec+", 1.0)"
	//console.log(output);
	return output;
}


  
window.addEventListener('hashchange', initScrollBar, false); // if page is reloaded then execute initScrollBar

function init() {
	initScrollBar();
	initNavigation();
	initContent();
	initResize();
	initTips();
	initEmbeds();
	hljs.configure({
		useBR: true
	});
}



init();
