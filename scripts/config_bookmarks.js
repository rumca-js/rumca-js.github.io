let worker = null;
let db = null;
let object_list_data = null;   // all objects lists
let system_initialized = false;
let user_age = 1;

let view_display_type = "search-engine";
let view_show_icons = false;
let view_small_icons = false;
let show_pure_links = false;
let highlight_bookmarks = false;
let sort_function = "-date_published"; // page_rating_votes, date_published
let default_page_size = 200;

let entries_visit_alpha=1.0;
let entries_dead_alpha=0.5;


function getDefaultFileName() {
    return "bookmarks.zip";
}


function getFileList() {
    return ["top.zip",
	    "bookmarks.zip",
	    "music.zip",
	    "internet.db.zip",
    ];
}


function getDefaultFileLocation() {
    return "/data/";
}


function getFileVersion() {
    /* Forces refresh of the file */
    return "70";
}


function getSystemVersion() {
    return "1.0";
}


function getInitialSearchSuggestsions() {
    return [
        "tag=jeffrey epstein",
        "tag=privacy",
        "tag=survaillance",
        "tag=censorship",
        "tag=technofeudalism",
        "tag=climate change",
        "tag=covid",
        "tag=facebook",
        "tag=google",
        "tag=inequality",
    ];
}
