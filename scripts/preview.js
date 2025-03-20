let worker = null;
let db = null;
let object_list_data = null;
let db_ready = false;

let view_display_type = "search-engine";
let view_show_icons = false;
let view_small_icons = false;
let show_pure_links = true;
let highlight_bookmarks = false;
let sort_function = "-page_rating_votes"; // page_rating_votes, date_published
let default_page_size = 200;


function getFileName() {
    let file_name = getQueryParam('file') || getDefaultFileName();

    let adir = getDefaultFileLocation();

    if (file_name.indexOf(".zip") === -1 && file_name.indexOf(".db") === -1)
        file_name = file_name + ".zip";

    if (file_name.indexOf(adir) === -1)
        file_name = adir + file_name

    return file_name;
}


function fillDataInternal(entry) {
    document.title = entry.title;

    let text = getEntryDetailText(entry);

    $('#detailData').html(text);
}


function fillListDataInternalMultiple(entries) {
    if (entries.length > 0)
        return fillDataInternal(entries[0]);
    else
    {
        $('#detailData').html("Could not find such entry");
        $('#statusLine').html("No entries found");
    }
}


function isEntryIdHit(entry, entry_id) {
    return entry.id == entry_id;
}


function fillSearchListData(entry_id) {
    let data = object_list_data;

    $('#listData').html("");

    let entries = data.entries;

    if (!entries || entries.length == 0) {
        $('#statusLine').html("No entries found");
        $('#detailData').html("");
        return;
    }

    $('#statusLine').html("Filtering links");
    let filteredEntries = entries.filter(entry =>
        isEntryIdHit(entry, entry_id)
    );

    if (filteredEntries.length === 0) {
        $('#statusLine').html("No matching entries found.");
        $('#detailData').html("");
        return;
    }

    fillListDataInternalMultiple(filteredEntries);
    $('#statusLine').html("")
}


function fillListData() {
    const urlParams = new URLSearchParams(window.location.search);
    const entry_id = urlParams.get('entry_id');

    fillSearchListData(entry_id);
}


async function Initialize() {
    let spinner_text_1 = getSpinnerText("Initializing - reading file");
    $("#statusLine").html(spinner_text_1);
    let fileBlob = requestFileChunks(getFileName());
    let spinner_text_2 = getSpinnerText("Loading zip");
    $("#statusLine").html(spinner_text_2);
    const zip = await JSZip.loadAsync(fileBlob);
    let spinner_text_3 = getSpinnerText("Unpacking zip");
    $("#statusLine").html(spinner_text_3);
    await unPackFileJSONS(zip);
    $("#statusLine").html("Initialized successfully");

    fillListData();
}


document.addEventListener('DOMContentLoaded', () => {
    if (!object_list_data) {
        Initialize();
    }
});
