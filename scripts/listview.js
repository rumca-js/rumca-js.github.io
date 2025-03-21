

function getFileName() {
    let file_name = getQueryParam('file') || getDefaultFileName();

    let adir = getDefaultFileLocation();

    if (file_name.indexOf(".zip") === -1 && file_name.indexOf(".db") === -1)
        file_name = file_name + ".zip";

    if (file_name.indexOf(adir) === -1)
        file_name = adir + file_name

    return file_name;
}


function animateToTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}


function fillEntireListData() {
    let data = object_list_data;

    $('#listData').html("");

    let entries = data.entries;

    if (!entries || entries.length == 0) {
        $('#statusLine').html("No entries found");
        $('#listData').html("");
        $('#pagination').html("");
        return;
    }

    fillListDataInternal(entries);
    $('#statusLine').html("")
}


function fillListDataInternal(entries) {
    entries = sortEntries(entries);

    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;
    let countElements = entries.length;

    let start_index = (page_num-1) * page_size;
    let end_index = page_num * page_size;

    let filtered_entries = entries.slice(start_index, end_index);

    var finished_text = getEntriesList(filtered_entries);

    $('#listData').html(finished_text);
    console.log("Setting up pagination");
    $('#pagination').html(GetPaginationNav(page_num, countElements/page_size, countElements));
}


function filterEntries(entries, searchText) {
    let filteredEntries = entries.filter(entry =>
        isEntrySearchHit(entry, searchText)
    );

    return filteredEntries;
}


function fillSearchListData(searchText) {
    let data = object_list_data;

    $('#listData').html("");

    let entries = data.entries;

    if (!entries || entries.length == 0) {
        $('#statusLine').html("No entries found");
        $('#listData').html("");
        $('#pagination').html("");
        return;
    }

    $('#statusLine').html("Filtering links");
    let filteredEntries = filterEntries(entries, searchText);

    if (filteredEntries.length === 0) {
        $('#statusLine').html("No matching entries found.");
        $('#listData').html("");
        $('#pagination').html("");
        return;
    }

    fillListDataInternal(filteredEntries);
    $('#statusLine').html("")
}


function fillListData() {
    const userInput = $("#searchInput").val();
    let file_name = getQueryParam('file') || "permanent";

    if (userInput.trim() != "") {
        document.title = file_name + " / " + userInput;

        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('search', userInput);
        window.history.pushState({}, '', currentUrl);

        fillSearchListData(userInput);
    }
    else
    {
        document.title = file_name;
        fillEntireListData();
    }
}


function searchInputFunction() {
    if (system_initialized) {
        $("#statusLine").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Reading data...`);
        return;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', 1);
    window.history.pushState({}, '', currentUrl);

    fillListData();
}


function setEntryAsListData(entry_id) {
    let entry = getEntry(entry_id);
    if (entry) {
       let entry_detail_text = getEntryDetailText(entry);
       let data = `<a href="" class="btn btn-primary go-back-button m-1">Go back</a>`;
       data += `<a href="" class="btn btn-primary copy-link m-1">Copy Link</a>`;
       data += entry_detail_text;
       $("#listData").html(data);
       $('#pagination').html("");

       document.title = entry.title;
    }
    else {
       $("#statusLine").html("Invalid entry");
    }
}


async function Initialize() {
    system_initialized = false;
    let spinner_text_1 = getSpinnerText("Initializing - reading file");
    $("#statusLine").html(spinner_text_1);
    let fileBlob = requestFileChunks(getFileName());
    let spinner_text_2 = getSpinnerText("Loading zip");
    $("#statusLine").html(spinner_text_2);
    const zip = await JSZip.loadAsync(fileBlob);
    let spinner_text_3 = getSpinnerText("Unpacking zip");
    $("#statusLine").html(spinner_text_3);
    await unPackFileJSONS(zip);
    $("#statusLine").html("");
    system_initialized = false;

    let entry_id = getQueryParam("entry_id");
    if (entry_id) {
       setEntryAsListData(entry_id);
    }
    else {
       fillListData();
    }
}


//-----------------------------------------------
$(document).on('click', '.btnNavigation', function(e) {
    e.preventDefault();

    const currentPage = $(this).data('page');

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', currentPage);
    window.history.pushState({}, '', currentUrl);

    animateToTop();

    fillListData();
});


//-----------------------------------------------
$(document).on('click', '.entry-list', function(e) {
    e.preventDefault();

    let entryNumber = $(this).attr('entry');
    console.log("Entry list:" + entryNumber);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('entry_id', entryNumber);
    window.history.pushState({}, '', currentUrl);

    setEntryAsListData(entryNumber);
});


//-----------------------------------------------
$(document).on('click', '.go-back-button', function(e) {
    e.preventDefault();

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('entry_id')
    window.history.pushState({}, '', currentUrl);

    fillListData();
});


//-----------------------------------------------
$(document).on('click', '.copy-link', function(e) {
    e.preventDefault();
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
       $(this).html("Copied");
    }).catch((err) => {
       console.error("Error copying URL: ", err);
    });
});


//-----------------------------------------------
$(document).on('click', '.entry-detail', function(e) {
    e.preventDefault();

    let entryNumber = $(this).attr('entry');
    console.log("Entry detail:" + entryNumber);

    let entry = getEntry(entryNumber);
    if (entry) {
       let entry_detail_text = getEntryListText(entry);
       $(this).html(entry_detail_text);
    }
    else {
       $("#statusLine").html("Invalid entry");
    }
});


//-----------------------------------------------
$(document).on('click', '#searchButton', function(e) {
    searchInputFunction();
});


//-----------------------------------------------
$(document).on('click', '#helpButton', function(e) {
    $("#helpPlace").toggle();
});

$(document).on('click', '#homeButton', function(e) {
    let file_name = getQueryParam('file') || "permanent";

    const searchInput = document.getElementById('searchInput');
    searchInput.value = "";
    searchInput.focus();

    $('#listData').html("");
    $('#pagination').html("");

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('page')
    currentUrl.searchParams.delete('search')
    window.history.pushState({}, '', currentUrl);
});


//-----------------------------------------------
$(document).on('keydown', "#searchInput", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        searchInputFunction();
    }
});


//-----------------------------------------------
$(document).on('click', '#orderByVotes', function(e) {
    if (sort_function == "-page_rating_votes")
    {
        sort_function = "page_rating_votes";
    }
    else
    {
        sort_function = "-page_rating_votes";
    }

    if (sort_function != "-page_rating_votes") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('order', sort_function);
        window.history.pushState({}, '', currentUrl);
    }
    else {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('order'); // Remove the 'order' parameter
        window.history.pushState({}, '', currentUrl);
    }

    fillListData();
});


//-----------------------------------------------
$(document).on('click', '#orderByDatePublished', function(e) {
    if (sort_function == "date_published")
    {
        sort_function = "-date_published";
    }
    else
    {
        sort_function = "date_published";
    }

    if (sort_function != "-page_rating_votes") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('order', sort_function);
        window.history.pushState({}, '', currentUrl);
    }
    else {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete('order'); // Remove the 'order' parameter
        window.history.pushState({}, '', currentUrl);
    }

    fillListData();
});


//-----------------------------------------------
$(document).on('click', '#viewStandard', function(e) {
    view_display_type = "standard";
    fillListData();
});


//-----------------------------------------------
$(document).on('click', '#viewGallery', function(e) {
    view_display_type = "gallery";
    fillListData();
});


//-----------------------------------------------
$(document).on('click', '#viewSearchEngine', function(e) {
    view_display_type = "search-engine";
    fillListData();
});


$(document).on("click", '#displayLight', function(e) {
    setLightMode();

    fillListData();
});


$(document).on("click", '#displayDark', function(e) {
    setDarkMode();

    fillListData();
});


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    if (isMobile()) {
        searchInput.style.width = '100%';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (urlParams.has("view_show_icons")) {
        view_show_icons = urlParams.get("view_show_icons");
    }
    if (urlParams.has("view_display_type")) {
        view_display_type = urlParams.get("view_display_type");
    }
    if (urlParams.has("order")) {
        sort_function = urlParams.get('order');
    }

    if (urlParams.has("default_page_size")) {
        default_page_size = parseInt(urlParams.get('default_page_size'), 10);
    }

    if (searchParam) {
        searchInput.value = searchParam;
    }

    if (!object_list_data) {
        try {
            Initialize();
        }
        catch {
            $("#statusLine").html("error");
        }
    }
});
