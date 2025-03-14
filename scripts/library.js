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
let sort_function = "-page_rating_votes"; // page_rating_votes, date_published
let default_page_size = 200;


function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}


function getFileVersion() {
    return "1";
}


function escapeHtml(unsafe)
{
    if (unsafe == null)
        return "";

    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
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
                <a href="?page=1&${paginationArgs}" data-page="1" class="btnNavigation page-link">|&lt;</a>
            </li>
        `;
    }
    if (currentPage > 2) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${currentPage - 1}&${paginationArgs}" data-page="${currentPage - 1}" class="btnNavigation page-link">&lt;</a>
            </li>
        `;
    }

    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        paginationText += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a href="?page=${i}&${paginationArgs}" data-page="${i}" class="btnNavigation page-link">${i}</a>
            </li>
        `;
    }

    if (currentPage + 1 < totalPages) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${currentPage + 1}&${paginationArgs}" data-page="${currentPage + 1}" class="btnNavigation page-link">&gt;</a>
            </li>
        `;
    }
    if (currentPage + 1 < totalPages) {
        paginationText += `
            <li class="page-item">
                <a href="?page=${totalPages}&${paginationArgs}" data-page="${totalPages}" class="btnNavigation page-link">&gt;|</a>
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


/** functions **/


function getVotesBadge(page_rating_votes, overflow=false) {
    let style = "font-size: 0.8rem;"
    if (overflow) {
        style = "position: absolute; top: 5px; right: 30px;" + style;
    }

    let badge_text = page_rating_votes > 0 ? `
        <span class="badge text-bg-warning" style="${style}">
            ${page_rating_votes}
        </span>` : '';

    return badge_text;
}


function getBookmarkBadge(entry, overflow=false) {
    let style = "font-size: 0.8rem;"
    if (overflow) {
        style = "position: absolute; top: 5px; right: 5px;" + style;
    }

    let badge_star = entry.bookmarked ? `
        <span class="badge text-bg-warning" style="${style}">
            ★
        </span>` : '';
    return badge_star;
}


function getAgeBadge(entry, overflow=false) {
    let style = "font-size: 0.8rem;"
    if (overflow) {
        style = "position: absolute; top: 30px; right: 5px;" + style;
    }

    let badge_text = entry.age > 0 ? `
        <span class="badge text-bg-warning" style="${style}">
            A
        </span>` : '';
    return badge_text;
}


function getDeadBadge(entry, overflow=false) {
    let style = "font-size: 0.8rem;"
    if (overflow) {
        style = "position: absolute; top: 30px; right: 30px;" + style;
    }

    let badge_text = entry.date_dead_since ? `
        <span class="badge text-bg-warning" style="${style}">
            D
        </span>` : '';
    return badge_text;
}


function getEntryTags(entry) {
    let tags_text = "";
    if (entry.tags && entry.tags.length > 0) {
        tags_text = entry.tags.map(tag => `#${tag}`).join(",");
    }
    return tags_text;
}


function isEntryValid(entry) {
    if (entry.is_valid === false || entry.date_dead_since) {
        return false;
    }
    return true;
}



function setLightMode() {
    view_display_style = "style-light";

    // const linkElement = document.querySelector('link[rel="stylesheet"][href*="styles.css_style-"]');
    // if (linkElement) {
    //     // TODO replace rsshistory with something else
    //     //linkElement.href = "/django/rsshistory/css/styles.css_style-light.css";
    // }

    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-bs-theme", "light");

    // const navbar = document.getElementById('navbar');
    // navbar.classList.remove('navbar-light', 'bg-dark');
    // navbar.classList.add('navbar-dark', 'bg-light');
}


function setDarkMode() {
    view_display_style = "style-dark";

    // const linkElement = document.querySelector('link[rel="stylesheet"][href*="styles.css_style-"]');
    // if (linkElement) {
    //     //linkElement.href = "/django/rsshistory/css/styles.css_style-dark.css";
    // }

    const htmlElement = document.documentElement;
    htmlElement.setAttribute("data-bs-theme", "dark");

    // const navbar = document.getElementById('navbar');
    // navbar.classList.remove('navbar-light', 'bg-light');
    // navbar.classList.add('navbar-dark', 'bg-dark');
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
   const progressBarElement = document.getElementById('progressBarElement');
   progressBarElement.innerHTML = '';

    // Add progress bar to the progressBarElement div
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
    progressBarElement.innerHTML = progressBarHTML;

    const progressBar = progressBarElement.querySelector('.progress-bar');
    const statusText = progressBarElement.querySelector('.status-text');

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
        progressBarElement.textContent = "Error processing ZIP file. Check console for details.";
    }
}


let preparingData = false;
async function requestFile(attempt = 1) {
    preparingData = true;

    $("#progressBarElement").html(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading data...`);

    let file_name = getQueryParam('file') || "top";
    let url = "data/" + file_name + ".zip";
    url = url + "?i="+getFileVersion();

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

                $("#progressBarElement").html(`
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

        // Prepare progress bar and output
        const progressBarElement = document.getElementById('progressBarElement');
        progressBarElement.innerHTML = '';

        preparingData = false;
    } catch (error) {
        preparingData = false;
        console.error("Error in requestFile:", error);
    }
}
