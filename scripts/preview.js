
function getEntryText(entry) {
    let text = `
    <a href="${entry.link}"><h1>${entry.title}</h1></a>
    <div><a href="${entry.link}">${entry.link}</a></div>
    <div><b>Publish date:</b>${entry.date_published}</div>
    `;

    let tagString = getEntryTags(entry);
    
    text += `
        <div>Tags: ${tagString}</div>
    `;

    text += `
    <div>${entry.description.replace(/\n/g, '<br>')}</div>
    `;

    text += `
    <h3>Parameters</h3>
    <div>Language: ${entry.language}</div>
    <div>Points: ${entry.page_rating}|${entry.page_rating_votes}|${entry.page_rating_contents}</div>
    `;

    if (entry.date_dead_since)
        text += `<div>Dead since:${entry.date_dead_since}</div>`;

    text += `
    <div>Author: ${entry.author}</div>
    <div>Album: ${entry.album}</div>
    <div>Status code: ${entry.status_code}</div>
    <div>Manual status code: ${entry.manual_status_code}</div>
    <div>Permanent: ${entry.permanent}</div>
    <div>Age: ${entry.age}</div>
    `;

    return text;
}


function fillListDataInternalStandard(entry) {
    let text = `
    <div><img src="${entry.thumbnail}" style="max-width:100%;"/></div>
    `;

    text += getEntryText(entry);

    $('#detailData').html(text);
}


function fillListDataInternalYouTube(entry) {
    // Extract the video ID from the YouTube link
    const urlParams = new URL(entry.link).searchParams;
    const videoId = urlParams.get("v");

    // Construct the embed URL
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : "";

    // Build the HTML content
    let text = "";

    // Add the embedded YouTube player if a valid video ID exists
    if (videoId) {
        text += `
        <div>
        <div class="youtube_player_container">
            <iframe src="${embedUrl}" frameborder="0" allowfullscreen class="youtube_player_frame" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
        </div>
        `;
    }

    text += getEntryText(entry);

    $('#detailData').html(text);
}


function fillListDataInternalOdysee(entry) {
    // Extract the video ID from the YouTube link
    const url = new URL(entry.link);
    const videoId = url.pathname.split('/').pop();

    // Construct the embed URL
    const embedUrl = videoId ? `https://odysee.com/$/embed/${videoId}` : "";

    // Build the HTML content
    let text = "";

    // Add the embedded YouTube player if a valid video ID exists
    if (videoId) {
        text += `
        <div>
        <div class="youtube_player_container">
            <iframe style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;" width="100%" height="100%" src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"></iframe>
        </div>
        </div>
        `;
    }

    text += getEntryText(entry);

    $('#detailData').html(text);
}


function fillListDataInternal(entry) {
    document.title = entry.title;

    let text = "";

    if (entry.link.startsWith("https://www.youtube.com/watch?v="))
        text += fillListDataInternalYouTube(entry);
    else if (entry.link.startsWith("https://odysee.com/"))
        text += fillListDataInternalOdysee(entry);
    else
        text += fillListDataInternalStandard(entry);

    return text;
}


function fillListDataInternalMultiple(entries) {
    if (entries.length > 0)
        return fillListDataInternal(entries[0]);
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


document.addEventListener('DOMContentLoaded', () => {
    if (!object_list_data) {
       requestFile();
    }
});
