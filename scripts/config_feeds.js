let worker = null;
let db = null;
let object_list_data = null;   // all objects lists
let system_initialized = false;

let view_display_type = "search-engine";
let view_display_style = "style-light";
let view_show_icons = true;
let view_small_icons = true;
let user_age = 1;
let debug_mode = false;

let entries_direct_links = true;
let highlight_bookmarks = false;
let perform_auto_search = true;
let click_behavior_modal_window = true;
let initialization_mode = "api"; // database, json
let sort_function = "-page_rating_votes"; // page_rating_votes, date_published
let default_page_size = 200;

let entries_visit_alpha=1.0;
let entries_dead_alpha=0.5;


function getFileVersion() {
    /* Forces refresh of the file */
    return "71";
}


function getSystemVersion() {
    return "1.0.4";
}


function getDefaultFileName() {
    return "feeds.db.zip";
}


function getDefaultFileLocation() {
    return "/data/";
}


function getFileList() {
    return [
    ];
}


function getEntryAPI() {
       return;
}


function getEntryLocalLink(entry) {
    return `?entry_id=${entry.id}`;
}


function getHomeLocation() {
    return "#";
}


function getInitialSearchSuggestsions() {
    return [
        "t.tag LIKE '%artificial intelligence%'",
        "t.tag LIKE '%artificial intelligence bot%'",
        "t.tag LIKE '%search engine%'",
        "t.tag LIKE '%operating system%'",
        "t.tag LIKE '%technology%'",
        "t.tag LIKE '%science%'",
        "t.tag LIKE '%news%'",
        "t.tag LIKE '%music artist%'",
        "t.tag LIKE '%music band%'",
        "t.tag LIKE '%web browser%'",
        "t.tag LIKE '%video game%'",
        "t.tag LIKE '%video games%'",
        "t.tag LIKE '%personal%'",
        "t.tag LIKE '%personal sites%'",
        "t.tag LIKE '%interesting%'",
        "t.tag LIKE '%interesting page design%'",
        "t.tag LIKE '%interesting page contents%'",
        "t.tag LIKE '%anime%'",
        "t.tag LIKE '%self-host%'",
        "t.tag LIKE '%programming%'",
        "t.tag LIKE '%programming language%'",
        "t.tag LIKE '%open source%'",
        "t.tag LIKE '%wtf%'",
        "t.tag LIKE '%funny%'",
        "l.language LIKE '%pl%'",
        "l.link LIKE '%youtube.com%'",
        "l.link LIKE '%github.com%'",
        "l.link LIKE '%reddit.com%'",
    ];
}


function debug(text) {
    if (true) {
      console.log(text);
    }
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


function getEntryLocalLink(entry) {
    return `?entry_id=${entry.id}`;
}
