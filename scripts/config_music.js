let worker = null;
let db = null;
let object_list_data = null;   // all objects lists
let system_initialized = false;
let user_age = 1;

let view_display_type = "gallery";
let view_show_icons = false;
let view_small_icons = false;
let show_pure_links = false;
let highlight_bookmarks = false;
let sort_function = "-page_rating_votes"; // page_rating_votes, date_published
let default_page_size = 200;


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
    return "69";
}


function getSystemVersion() {
    return "0.9";
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
