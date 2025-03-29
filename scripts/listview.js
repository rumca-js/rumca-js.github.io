
let all_entries = null;
let entries_length = 0;


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


function isWorkerNeeded(fileName) {
    if (fileName.indexOf("db") != -1 || fileName.indexOf("db.zip") != -1) {
        return true;
    }
    return false;
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
    var finished_text = getEntriesList(entries);

    $('#listData').html(finished_text);
}


function filterEntries(entries, searchText) {
    let filteredEntries = entries.filter(entry =>
        isEntrySearchHit(entry, searchText)
    );

    return filteredEntries;
}


function fillListData() {
   fillEntireListData();
}



function getPaginationText() {
    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;
    let countElements = entries_length;

    return GetPaginationNav(page_num, countElements/page_size, countElements);
}


function sortAndFilter() {
    const search_text = $("#searchInput").val();

    let entries = all_entries.entries;

    entries = sortEntries(entries);

    if (search_text != "") {
       entries = filterEntries(entries, search_text);
    }

    entries_length = entries.length;

    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;

    let start_index = (page_num-1) * page_size;
    let end_index = page_num * page_size;

    object_list_data.entries = entries.slice(start_index, end_index);
}


function searchInputFunctionJSON() {
    if (!system_initialized) {
        $("#statusLine").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Reading data...`);
        return;
    }

    let entry_id = getQueryParam("entry_id");

    if (entry_id) {
       setEntryIdAsListData(entry_id);
    }
    else {
       sortAndFilter();

       fillListData();

       $('#pagination').html(getPaginationText());
    }
}


function searchInputFunctionDb() {
    if (!worker) {
        $('#statusLine').html("Worker problem");
        return;
    }
    if (!system_initialized) {
        $('#statusLine').html("Cannot make query - database is not ready");
    }

    let spinner_text = getSpinnerText("Searching");
    $('#statusLine').html(spinner_text);

    let query = getQueryText();
    worker.postMessage({ query });
    console.log("Sent message: " + query);
}


function searchInputFunction() {
    const userInput = $("#searchInput").val();
    let file_name = getFileName();

    if (userInput.trim() != "") {
        document.title = userInput;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('search', userInput);
    window.history.pushState({}, '', currentUrl);

    if (isWorkerNeeded(file_name)) {
       return searchInputFunctionDb();
    }
    else {
       return searchInputFunctionJSON();
    }
}


function setEntryIdAsListData(entry_id) {
    let entry = getEntry(entry_id);
    setEntryAsListData(entry);
}


function getProjectListText() {
    let files = getFileList();
    
    let html = `
        <div id="projectList">
            <h3>Projects</h3>
    `;
    
    files.forEach(file => {
        //let projectName = file.replace(".zip", "");
        let projectName = file;
        html += `<a class="btn btn-secondary projectButton" href="/${projectName}">${projectName}</a>`;
    });
    
    html += `</div>`;
    
    return html;
}


function setEntryAsListData(entry) {
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


async function InitializeForDb() {
  if (!object_list_data) {
    if (!worker) {
       initWorker();
    }
  }
}


async function InitializeForJSON() {
   let file_name = getFileName();
   system_initialized = false;
   let spinner_text_1 = getSpinnerText("Initializing - reading file");
   console.log("Initializing - reading file");
   $("#statusLine").html(spinner_text_1);
   let chunks = await getFilePartsList(file_name);
   if (!chunks || chunks.length == 0)
   {
       $("#statusLine").html("Cannot find files...");
       return false;
   }

   console.log("Requesting file list");
   let fileBlob = await requestFileChunksFromList(chunks);
   if (!fileBlob)
   {
       $("#statusLine").html("Cannot find file contents...");
       return false;
   }
   let spinner_text_2 = getSpinnerText("Loading zip");
   console.log("Loading zip");
   $("#statusLine").html(spinner_text_2);
   const zip = await JSZip.loadAsync(fileBlob);
   let spinner_text_3 = getSpinnerText("Unpacking zip");
   console.log("Unpacking zip");
   $("#statusLine").html(spinner_text_3);
   await unPackFileJSONS(zip);
   $("#statusLine").html("");

   console.log("Sorting links");

   all_entries = { ...object_list_data };
   sortAndFilter();

   console.log("On system ready");
   onSystemReady();

   let entry_id = getQueryParam("entry_id");
   if (!entry_id) {
      fillListData();

      $('#pagination').html(getPaginationText());
   }
}


function onSystemReady() {
    system_initialized = true;
    $('#searchInput').prop('disabled', false);

   let entry_id = getQueryParam("entry_id");
   if (entry_id) {
      searchInputFunction();
   }
   else {
      $('#statusLine').html("System is ready! You can perform search now");
   }
}


function workerFunction(e) {
    const { success, message_type, result, error } = e.data;
    if (success) {
        if (message_type == "entries") {
             let entry_id = getQueryParam("entry_id");

             if (!entry_id) {
                object_list_data = result;
                fillListData();
	     }
             else {
                object_list_data = result;
		if (object_list_data.entries.length > 0) {
                     setEntryAsListData(object_list_data.entries[0]);
		}
	     }
        }
        else if (message_type == "pagination") {
             let total_rows = result;

             entries_length = total_rows;

             let nav_text = getPaginationText();

             $('#pagination').html(nav_text);
             $('#statusLine').html("");
        }
        else if (message_type == "message") {
             if (result == "Creating database DONE") {
                onSystemReady();
             }
             else {
                let new_spinner_text = getSpinnerText(result);
                $('#statusLine').html(new_spinner_text);
             }
        }
    } else {
        $('#statusLine').html('Worker error: '+ error);
        console.error('Worker error:', error);
    }
}


async function initWorker() {
    console.log("Init worker");
    let spinner_text = getSpinnerText("Initializing worker");
    $('#statusLine').html(spinner_text);

    worker = new Worker('scripts/dbworker.js?i=' + getSystemVersion());

    let file_name = getFileName();

    worker.postMessage({ fileName:  file_name});

    worker.onmessage = workerFunction;
    console.log("Init worker done");
    $('#statusLine').html("");
}


async function Initialize() {
    let file_name = getFileName();

    $('#searchInput').prop('disabled', true);

    if (isWorkerNeeded(file_name)) {
       return await InitializeForDb();
    }
    else {
       return await InitializeForJSON();
    }
}


function resetParams() {
   const currentUrl = new URL(window.location.href);
   currentUrl.searchParams.delete('page')
   currentUrl.searchParams.delete('search')
   currentUrl.searchParams.delete('entry_id')
   window.history.pushState({}, '', currentUrl);
}


//-----------------------------------------------
$(document).on('click', '.btnNavigation', function(e) {
    e.preventDefault();

    const currentPage = $(this).data('page');

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', currentPage);
    window.history.pushState({}, '', currentUrl);

    animateToTop();

    searchInputFunction();
});


//-----------------------------------------------
$(document).on('click', '.entry-list', function(e) {
    if (e.ctrlKey) {
        return;
    }

    e.preventDefault();

    let entryNumber = $(this).attr('entry');
    console.log("Entry list:" + entryNumber);

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('entry_id', entryNumber);
    window.history.pushState({}, '', currentUrl);

    setEntryIdAsListData(entryNumber);

    animateToTop();
});


//-----------------------------------------------
$(document).on('click', '.go-back-button', function(e) {
    e.preventDefault();

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('entry_id')
    window.history.pushState({}, '', currentUrl);

    fillListData();
    $('#pagination').html(getPaginationText());
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
$(document).on('click', '.projectButton', function(e) {
    e.preventDefault();

    let fileName = $(this).text();

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('file', fileName);
    window.history.pushState({}, '', currentUrl);

    object_list_data = null;
    $('#listData').html("");

    Initialize();
});


//-----------------------------------------------
$(document).on('click', '#searchButton', function(e) {
    resetParams();

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

    resetParams();
});


//-----------------------------------------------
$(document).on('keydown', "#searchInput", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        resetParams();

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

    searchInputFunction();
});


//-----------------------------------------------
$(document).on('click', '#orderByDatePublished', function(e) {
    if (sort_function == "-date_published")
    {
        sort_function = "date_published";
    }
    else
    {
        sort_function = "-date_published";
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

    searchInputFunction();
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

    $("#projectList").html(getProjectListText());
});
