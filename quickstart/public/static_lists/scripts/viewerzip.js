// library code

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

let view_display_type = "search-engine";
let view_show_icons = false;
let view_small_icons = false;
let show_pure_links = true;
let highlight_bookmarks = false;
let object_list_data = null;

let default_page_size = 200;

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}


function GetPaginationNav(currentPage, totalPages, count) {
    totalPages = Math.ceil(totalPages);

    if (totalPages <= 1) {
        return '';
    }

    let paginationText = `
        <nav aria-label="Page navigation">
            <ul class="pagination">
    `;

    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('page');
    const paginationArgs = `${currentUrl.searchParams.toString()}`;

    if (currentPage > 2) {
        paginationText += `
            <li class="page-item">
                <a href="?page=1&${paginationArgs}" data-page="1" class="btnFilterTrigger page-link">|&lt;</a>
            </li>
        `;
    }
    if (currentPage > 2) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${currentPage - 1}&${paginationArgs}" data-page="${currentPage - 1}" class="btnFilterTrigger page-link">&lt;</a>
            </li>
        `;
    }

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        paginationText += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a href="?page=${i}&${paginationArgs}" data-page="${i}" class="btnFilterTrigger page-link">${i}</a>
            </li>
        `;
    }

    if (currentPage + 1 < totalPages) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${currentPage + 1}&${paginationArgs}" data-page="${currentPage + 1}" class="btnFilterTrigger page-link">&gt;</a>
            </li>
        `;
    }
    if (currentPage + 1 < totalPages) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${totalPages}&${paginationArgs}" data-page="${totalPages}" class="btnFilterTrigger page-link">&gt;|</a>
            </li>
        `;
    }

    paginationText += `
            </ul>
            ${currentPage} / ${totalPages} @ ${count} records.
        </nav>
    `;

    return paginationText;
}


// entry code


function getVotesBadge(page_rating_votes) {
    let badge_text = page_rating_votes > 0 ? `
        <span class="badge text-bg-warning" style="position: absolute; top: 5px; right: 30px; font-size: 0.8rem;">
            ${page_rating_votes}
        </span>` : '';

    return badge_text;
}


function getBookmarkBadge(entry) {
    let badge_star = entry.bookmarked ? `
        <span class="badge text-bg-warning" style="position: absolute; top: 5px; right: 5px; font-size: 0.8rem;">
            ★
        </span>` : '';
    return badge_star;
}


function getAgeBadge(entry) {
    let badge_text = entry.age > 0 ? `
        <span class="badge text-bg-warning" style="position: absolute; top: 30px; right: 5px; font-size: 0.8rem;">
            A
        </span>` : '';
    return badge_text;
}


function getDeadBadge(entry) {
    let badge_text = entry.date_dead_since ? `
        <span class="badge text-bg-warning" style="position: absolute; top: 30px; right: 30px; font-size: 0.8rem;">
            D
        </span>` : '';
    return badge_text;
}


function getEntryTags(entry) {
    let tags_text = "";
    if (entry.tags && entry.tags.length > 0) {
        tags_text = entry.tags.map(tag => `#${tag}`).join(",");
        tags_text = `<div class="text-reset mx-2">` + tags_text + `</div>`;
    }
    return tags_text;
}

function isEntryValid(entry) {
    if (entry.is_valid || entry.date_dead_since) {
        return false;
    }
    return true;
}


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

    let entry_link = show_pure_links ? "${link_absolute}" : "${link_absolute}";

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
            class="element_${view_display_type} list-group-item list-group-item-action"
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


function fillOneEntry(entry) {
   let datePublished = new Date(entry.date_published);
   if (isNaN(datePublished)) {
       datePublished = new Date();
   }

   const templateMap = {
       "standard": entryStandardTemplate,
       "gallery": entryGalleryTemplate,
       "search-engine": entrySearchEngineTemplate
   };

   const templateFunc = templateMap[view_display_type];
   if (!templateFunc) {
       return;
   }
   var template_text = templateFunc(entry, view_show_icons, view_small_icons);

   let thumbnail = entry.thumbnail;
   let page_rating_votes = entry.page_rating_votes;
   let page_rating_contents = entry.page_rating_contents;

   let entry_link = show_pure_links ? entry.link : entry.link_absolute;

   let title_safe = entry.title;
   if (entry.title_safe) {
       title_safe = entry.title_safe;
   }

   // Replace all occurrences of the placeholders using a global regular expression
   let listItem = template_text
       .replace(/{link_absolute}/g, entry.link_absolute)
       .replace(/{link}/g, entry.link)
       .replace(/{entry_link}/g, entry_link)
       .replace(/{title}/g, entry.title)
       .replace(/{thumbnail}/g, entry.thumbnail)
       .replace(/{title_safe}/g, title_safe)
       .replace(/{page_rating_votes}/g, entry.page_rating_votes)
       .replace(/{page_rating_contents}/g, entry.page_rating_contents)
       .replace(/{page_rating}/g, entry.page_rating)
       .replace(/{source__title}/g, entry.source__title)
       .replace(/{age}/g, entry.age)
       .replace(/{date_published}/g, datePublished.toLocaleString());

   return listItem;
}


function fillEntryList(entries, startIndex = 0, endIndex = 1000) {
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


function fillListData() {
    let data = object_list_data;

    $('#listData').html("");

    let entries = data.entries;

    if (!entries || entries.length == 0) {
        $('#listData').html("No entries found");
        $('#pagination').html("");
        return;
    }

    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;
    let countElements = data.entries.length;

    let start_index = (page_num-1) * page_size;
    let end_index = page_num * page_size;

    var finished_text = fillEntryList(entries, start_index, end_index);
    $('#listData').html(finished_text);
    $('#pagination').html(GetPaginationNav(page_num, countElements/page_size, countElements));
}


function isEntrySearchHit(entry, searchText) {
   if (!entry)
        return false;

   if (entry.link && entry.link.toLowerCase().includes(searchText.toLowerCase()))
        return true;

   if (entry.title && entry.title.toLowerCase().includes(searchText.toLowerCase()))
        return true;

   if (entry.description && entry.description.toLowerCase().includes(searchText.toLowerCase()))
        return true;

   if (entry.tags && Array.isArray(entry.tags)) {
       const tagMatch = entry.tags.some(tag =>
           tag.toLowerCase().includes(searchText.toLowerCase())
       );
       if (tagMatch) return true;
   }
}


function fillSearchListData(searchText) {
    let data = object_list_data;

    $('#listData').html("");

    let entries = data.entries;

    if (!entries || entries.length == 0) {
        $('#listData').html("No entries found");
        $('#pagination').html("");
        return;
    }

    let filteredEntries = entries.filter(entry =>
        isEntrySearchHit(entry, searchText)
    );

    if (filteredEntries.length === 0) {
        $('#listData').html("No matching entries found.");
        $('#pagination').html("");
        return;
    }

    filteredEntries = filteredEntries.sort((a, b) => {
        return b.page_rating_votes - a.page_rating_votes; // Sort in descending order
    });

    let page_num = parseInt(getQueryParam("page")) || 1;
    let page_size = default_page_size;
    let countElements = filteredEntries.length;

    let start_index = (page_num-1) * page_size;
    let end_index = page_num * page_size;

    var finished_text = fillEntryList(filteredEntries, start_index, end_index);
    $('#listData').html(finished_text);
    $('#pagination').html(GetPaginationNav(page_num, countElements/page_size, countElements));
}


function updateListData(jsonData) {
    if (!object_list_data) {
        object_list_data = { entries: [] };
    }
    if (!object_list_data.entries) {
        object_list_data.entries = [];
    }

    if (jsonData && Array.isArray(jsonData.entries)) {
        console.log("Entries to merge:", jsonData.entries);
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


async function unPack(file) {
    const output = document.getElementById('listData');
    try {
        const JSZip = window.JSZip;
        const zip = await JSZip.loadAsync(file);

        for (const fileName of Object.keys(zip.files)) {
            $("#listData").html(`Reading:${fileName}`);

            if (fileName.endsWith('.json')) {
                const jsonFile = await zip.files[fileName].async('string');
                const jsonData = JSON.parse(jsonFile);

                updateListData(jsonData);
            }
        }

        fillListData();
    } catch (error) {
        console.error("Error reading ZIP file:", error);
        output.textContent = "Error processing ZIP file. Check console for details.";
    }
}


let preparingData = false;
async function requestData(attempt = 1) {
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
        unPack(blob);
        preparingData = false;
    } catch (error) {
        preparingData = false;
        console.error("Error in requestData:", error);
    }
}


function searchInputFunction() {
    if (preparingData) {
        $("#listData").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Reading data...`);
        return;
    }


    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', 1);
    window.history.pushState({}, '', currentUrl);

    const userInput = $("#searchInput").val();
    if (userInput.trim() != "") {
        document.title = userInput;
        fillSearchListData(userInput);
    }
    else
    {
        document.title = "Link viewer";
        fillListData();
    }
}


//-----------------------------------------------
$(document).on('click', '.btnFilterTrigger', function(e) {
    e.preventDefault();

    const currentPage = $(this).data('page');
    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.set('page', currentPage);

    window.history.pushState({}, '', currentUrl);

    const userInput = $("#searchInput").val();
    if (userInput.trim() != "") {
        fillSearchListData(userInput);
    }
    else {
        fillListData();
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


//-----------------------------------------------
$(document).on('keydown', "#searchInput", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();

        searchInputFunction();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (isMobile()) {
        const searchInput = document.getElementById('searchInput');
        searchInput.style.width = '100%';
    }

    requestData();
});

window.addEventListener("beforeunload", (event) => {
    if (preparingData) {
        // Custom message shown in some browsers
        event.preventDefault();
        event.returnValue = ''; // This will trigger the default confirmation dialog
    }
});
