function getEntryTags(entry) {
    let tags_text = "";
    if (entry.tags && entry.tags.length > 0) {
        tags_text = entry.tags.map(tag => `#${tag}`).join(",");
        tags_text = `<div class="text-reset mx-2">` + tags_text + `</div>`;
    }
    return tags_text;
}


function isEntryValid(entry) {
    if (!entry.is_valid === false || entry.date_dead_since) {
        return false;
    }
    return true;
}


/** templates **/


function entryStandardTemplate(entry, show_icons = true, small_icons = false) {
    let page_rating_votes = entry.page_rating_votes;

    let badge_text = getVotesBadge(page_rating_votes);
    let badge_star = getBookmarkBadge(entry);
    let badge_age = getAgeBadge(entry);

    let bookmark_class = entry.bookmarked ? `list-group-item-primary` : '';
    let invalid_style = isEntryValid(entry) ? `` : `style="opacity: 0.5"`;

    let img_text = '';
    if (show_icons) {
        const iconClass = small_icons ? 'icon-small' : 'icon-normal';
        img_text = `<img src="{thumbnail}" class="rounded ${iconClass}" />`;
    }
    
    let thumbnail_text = '';
    if (img_text) {
        thumbnail_text = `
            <div style="position: relative; display: inline-block;">
                ${img_text}
            </div>`;
    }

    let tags_text = getEntryTags(entry);

    return `
        <a 
            href="{entry_link}"
            title="{title}"
            ${invalid_style}
            class="my-1 p-1 list-group-item list-group-item-action ${bookmark_class}"
        >
            <div class="d-flex">
                ${thumbnail_text}
                <div class="mx-2">
                    <span style="font-weight:bold" class="text-reset">{title_safe}</span>
                    <div class="text-reset">
                        {source__title} {date_published}
                    </div>
                    ${tags_text}
                </div>
            </div>

            ${badge_text}
            ${badge_star}
            ${badge_age}
        </a>
    `;
}


function entrySearchEngineTemplate(entry, show_icons = true, small_icons = false) {
    let page_rating_votes = entry.page_rating_votes;

    let badge_text = getVotesBadge(page_rating_votes);
    let badge_star = highlight_bookmarks ? getBookmarkBadge(entry) : "";
    let badge_age = getAgeBadge(entry);
   
    let invalid_style = isEntryValid(entry) ? `` : `style="opacity: 0.5"`;
    let bookmark_class = (entry.bookmarked && highlight_bookmarks) ? `list-group-item-primary` : '';

    let thumbnail_text = '';
    if (show_icons) {
        const iconClass = small_icons ? 'icon-small' : 'icon-normal';
        thumbnail_text = `
            <div style="position: relative; display: inline-block;">
                <img src="{thumbnail}" class="rounded ${iconClass}"/>
            </div>`;
    }

    let tags_text = getEntryTags(entry);

    return `
        <a 
            href="{entry_link}"
            title="{title}"
            ${invalid_style}
            class="my-1 p-1 list-group-item list-group-item-action ${bookmark_class}"
        >
            <div class="d-flex">
               ${thumbnail_text}
               <div class="mx-2">
                  <span style="font-weight:bold" class="text-reset">{title_safe}</span>
                  <div class="text-reset text-decoration-underline">@ {link}</div>
                  ${tags_text}
                  ${badge_text}
                  ${badge_star}
                  ${badge_age}
               </div>
            </div>
        </a>
    `;
}


function entryGalleryTemplate(entry, show_icons = true, small_icons = false) {
    if (isMobile()) {
        return entryGalleryTemplateMobile(entry, show_icons, small_icons);
    }
    else {
        return entryGalleryTemplateDesktop(entry, show_icons, small_icons);
    }
}


function entryGalleryTemplateDesktop(entry, show_icons = true, small_icons = false) {
    let page_rating_votes = entry.page_rating_votes;
    
    let badge_text = getVotesBadge(page_rating_votes);
    let badge_star = getBookmarkBadge(entry);
    let badge_age = getAgeBadge(entry);

    let invalid_style = isEntryValid(entry) ? `` : `style="opacity: 0.5"`;

    let thumbnail = entry.thumbnail;
    let thumbnail_text = `
        <img src="${thumbnail}" style="width:100%;max-height:100%;aspect-ratio:3/4;object-fit:cover;"/>
        ${badge_text}
        ${badge_star}
        ${badge_age}
    `;

    let tags_text = getEntryTags(entry);

    return `
        <a 
            href="{entry_link}"
            title="{title}"
            ${invalid_style}
            style="max-width: 18%; min-width: 18%; width: auto; aspect-ratio:1/1;"
            class="list-group-item list-group-item-action m-1"
        >
            <div style="display: flex; flex-direction:column; align-content:normal; height:100%">
                <div style="flex: 0 0 70%; flex-shrink: 0;flex-grow:0;max-height:70%">
                    ${thumbnail_text}
                </div>
                <div style="flex: 0 0 30%; flex-shrink: 0;flex-grow:0;max-height:30%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    <span style="font-weight: bold" class="text-primary">{title_safe}</span>
                    <div class="link-list-item-description">{source__title}</div>
                    ${tags_text}
                </div>
            </div>
        </a>
    `;
}


function entryGalleryTemplateMobile(entry, show_icons = true, small_icons = false) {
    let page_rating_votes = entry.page_rating_votes;
    
    let badge_text = getVotesBadge(page_rating_votes);
    let badge_star = getBookmarkBadge(entry);
    let badge_age = getAgeBadge(entry);

    let invalid_style = isEntryValid(entry) ? `` : `style="opacity: 0.5"`;

    let thumbnail = entry.thumbnail;
    let thumbnail_text = `
        <img src="${thumbnail}" style="width:100%; max-height:100%; object-fit:cover"/>
        ${badge_text}
        ${badge_star}
        ${badge_age}
    `;

    let tags_text = getEntryTags(entry);

    return `
        <a 
            href="{entry_link}"
            title="{title}"
            ${invalid_style}
            class="list-group-item list-group-item-action"
        >
            <div style="display: flex; flex-direction:column; align-content:normal; height:100%">
                <div style="flex: 0 0 70%; flex-shrink: 0;flex-grow:0;max-height:70%">
                    ${thumbnail_text}
                </div>
                <div style="flex: 0 0 30%; flex-shrink: 0;flex-grow:0;max-height:30%">
                    <span style="font-weight: bold" class="text-primary">{title_safe}</span>
                    <div class="link-list-item-description">{source__title}</div>
                    ${tags_text}
                </div>
            </div>
        </a>
    `;
}


/** fill functions **/


function fillOneEntry(entry) {
    if (entry.link) {
       return fillOneEntryLink(entry);
    }
    if (entry.url) {
       return fillOneEntrySource(entry);
    }
}


function getEntryListText(entries, startIndex = 0, endIndex = 1000) {
    let htmlOutput = '';

    if (view_display_type == "gallery") {
        htmlOutput = `<span class="d-flex flex-wrap">`;
    } else {
        htmlOutput = `<span class="container list-group">`;
    }

    if (entries && entries.length > 0) {
        entries.slice(startIndex, endIndex).forEach((entry, i) => {
            const listItem = fillOneEntry(entry);

            if (listItem) {
                htmlOutput += listItem;
            }
        });
    } else {
        htmlOutput = '<li class="list-group-item">No entries found</li>';
    }

    htmlOutput += `</span>`;

    return htmlOutput;
}


function fillListDataInternal(entries) {
    $('#statusLine').html("Sorting links");

    if (sort_function == "page_rating_votes") {
        entries = entries.sort((a, b) => {
            return b.page_rating_votes - a.page_rating_votes;
        });
    }
    else if (sort_function == "-page_rating_votes") {
        entries = entries.sort((a, b) => {
            return a.page_rating_votes - b.page_rating_votes;
        });
    }
    else if (sort_function == "date_published") {
        entries = entries.sort((a, b) => {
            if (a.date_published === null && b.date_published === null) {
                return 0;
            }
            if (a.date_published === null) {
                return 1;
            }
            if (b.date_published === null) {
                return -1;
            }
            return new Date(b.date_published) - new Date(a.date_published);
        });
    }
    else if (sort_function == "-date_published") {
        entries = entries.sort((a, b) => {
            if (a.date_published === null && b.date_published === null) {
                return 0;
            }
            if (a.date_published === null) {
                return -1;
            }
            if (b.date_published === null) {
                return 1;
            }
            return new Date(a.date_published) - new Date(b.date_published);
        });
    }

    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;
    let countElements = entries.length;

    let start_index = (page_num-1) * page_size;
    let end_index = page_num * page_size;

    var finished_text = getEntryListText(entries, start_index, end_index);

    $('#listData').html(finished_text);
    $('#pagination').html(GetPaginationNav(page_num, countElements/page_size, countElements));
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
    let filteredEntries = entries.filter(entry =>
        isEntrySearchHit(entry, searchText)
    );

    if (filteredEntries.length === 0) {
        $('#statusLine').html("No matching entries found.");
        $('#listData').html("");
        $('#pagination').html("");
        return;
    }

    fillListDataInternal(filteredEntries);
    $('#statusLine').html("")
}


function updateListData(jsonData) {
    if (!object_list_data) {
        object_list_data = { entries: [] };
    }
    if (!object_list_data.entries) {
        object_list_data.entries = [];
    }

    if (jsonData && Array.isArray(jsonData.entries)) {
        object_list_data.entries.push(...jsonData.entries);
    } else {
        if (jsonData && Array.isArray(jsonData))
        {
            object_list_data.entries.push(...jsonData);
        }
        else {
            console.error("jsonData.entries is either not defined or not an array.");
        }
    }
}


async function unPackFile(file) {
    // Prepare progress bar and output
    const listData = document.getElementById('listData');

    listData.innerHTML = '';

    // Add progress bar to the listData div
    let percentComplete = 0;
    const progressBarHTML = `
        <div class="progress">
            <div class="progress-bar" role="progressbar" style="width: ${percentComplete}%" 
                aria-valuenow="${percentComplete}" aria-valuemin="0" aria-valuemax="100">
                ${percentComplete}%
            </div>
        </div>
        <span class="status-text">Loading blob file...</span>
    `;
    listData.innerHTML = progressBarHTML;

    const progressBar = listData.querySelector('.progress-bar');
    const statusText = listData.querySelector('.status-text');

    try {
        const JSZip = window.JSZip;

        const zip = await JSZip.loadAsync(file);

        const fileNames = Object.keys(zip.files);
        const totalFiles = fileNames.length;
        let processedFiles = 0;

        for (const fileName of fileNames) {
            statusText.innerText = `Reading: ${fileName}`;
            processedFiles++;
            percentComplete = Math.round((processedFiles / totalFiles) * 100);

            progressBar.style.width = `${percentComplete}%`;
            progressBar.setAttribute('aria-valuenow', `${percentComplete}`);
            progressBar.innerText = `${percentComplete}%`;

            if (fileName.endsWith('.json')) {
                const jsonFile = await zip.files[fileName].async('string');
                const jsonData = JSON.parse(jsonFile);

                updateListData(jsonData);
            }
        }

        fillListData();
        statusText.innerText = "All files processed!";
    } catch (error) {
        console.error("Error reading ZIP file:", error);
        listData.textContent = "Error processing ZIP file. Check console for details.";
    }
}


let preparingData = false;
async function requestFile(attempt = 1) {
    preparingData = true;

    $("#listData").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading data...`);

    let file_name = getQueryParam('file') || "permanent";
    let url = "data/" + file_name + ".zip";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${url}, status:${response.statusText}`);
        }

        const contentLength = response.headers.get("Content-Length");
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let receivedBytes = 0;

        const chunks = [];
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            if (value) {
                receivedBytes += value.length;
                const percentComplete = ((receivedBytes / totalSize) * 100).toFixed(2);

                $("#listData").html(`
                  <div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${percentComplete}%" aria-valuenow="${percentComplete}" aria-valuemin="0" aria-valuemax="100">
                      ${percentComplete}%
                    </div>
                  </div>
                `);

                chunks.push(value);
            }
        }

        const blob = new Blob(chunks);

        unPackFile(blob);

        preparingData = false;
    } catch (error) {
        preparingData = false;
        console.error("Error in requestFile:", error);
    }
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
    if (preparingData) {
        $("#statusLine").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Reading data...`);
        return;
    }


    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', 1);
    window.history.pushState({}, '', currentUrl);

    fillListData();
}


//-----------------------------------------------
$(document).on('click', '.btnFilterTrigger', function(e) {
    e.preventDefault();

    const currentPage = $(this).data('page');
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.set('page', currentPage);

    window.history.pushState({}, '', currentUrl);

    fillListData();
});


//-----------------------------------------------
$(document).on('click', '#searchButton', function(e) {
    searchInputFunction();
});


//-----------------------------------------------
$(document).on('click', '#helpButton', function(e) {
    $("#helpPlace").toggle();
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
    if (sort_function == "page_rating_votes")
    {
        sort_function = "-page_rating_votes";
    }
    else
    {
        sort_function = "page_rating_votes";
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


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');

    if (isMobile()) {
        searchInput.style.width = '100%';
    }

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
        searchInput.value = searchParam;
    }

    requestFile();
});


window.addEventListener("beforeunload", (event) => {
    if (preparingData) {
        // Custom message shown in some browsers
        event.preventDefault();
        event.returnValue = ''; // This will trigger the default confirmation dialog
    }
});
