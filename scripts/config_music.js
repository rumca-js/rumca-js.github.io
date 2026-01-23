let worker = null;
let db = null;
let object_list_data = null;   // all objects lists
let system_initialized = false;

let view_display_type = "gallery";
let view_display_style = "style-light";
let view_show_icons = true;
let view_small_icons = false;
let user_age = 1;
let debug_mode = false;

let entries_direct_links = false;
let highlight_bookmarks = false;
let sort_function = "-page_rating_votes"; // page_rating_votes, date_published
let default_page_size = 200;

let entries_visit_alpha=1.0;
let entries_dead_alpha=0.5;


function getDefaultFileName() {
    return "music.zip";
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
    return "71";
}


function getSystemVersion() {
    return "1.0.3";
}


function getInitialSearchSuggestsions() {
    return [
        "tag = full album",
        "tag = youtube mix",
        "tag = hip-hop",
        "tag = metal",
        "tag = reggae",
        "tag = big beat",
        "tag = trance",
        "tag = foreign",
        "tag = chiptune",
        "tag = keygen",
        "language = fr",
        "language = mn",
        "language = pl",
        "link = youtube.com",
    ];
}


function getViewStyles() {
    return [
        "standard",
        "gallery",
        "search-engine",
        "content-centric",
        "accordion",
        "links-only",
    ];
}


function getOrderPossibilities() {
    return [
        ['page_rating_votes', "Votes ASC"],
        ['-page_rating_votes', "Votes DESC"],
        ['view_count', "Views ASC"],
        ['-view_count', "Views DESC"],
        ['date_published', "Date published ASC"],
        ['-date_published', "Date published DESC"],
        ['followers_count', "Followers ASC"],
        ['-followers_count', "Followers DESC"],
        ['stars', "Stars ASC"],
        ['-stars', "Stars DESC"],
    ];
}
