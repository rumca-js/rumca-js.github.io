
function fillOneEntryLink(entry) {
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

    let entry_link = `/preview.html?entry_id=${entry.id}`;
    file = getQueryParam("file") || "top";
    entry_link += `&file=${file}`;

    title = escapeHtml(entry.title)

    let title_safe = "";
    if (entry.title_safe) {
       title_safe = escapeHtml(entry.title_safe)
    }
    else
    {
       title_safe = escapeHtml(entry.title)
    }
    let tags_text = getEntryTags(entry);
    let hover_title = title_safe + " " + tags_text;

    let source__title = "";
    if (entry.source__title) {
       source__title = escapeHtml(entry.source__title)
    }

    // Replace all occurrences of the placeholders using a global regular expression
    let listItem = template_text
        .replace(/{link_absolute}/g, entry.link_absolute)
        .replace(/{link}/g, entry.link)
        .replace(/{entry_link}/g, entry_link)
        .replace(/{hover_title}/g, hover_title)
        .replace(/{thumbnail}/g, entry.thumbnail)
        .replace(/{title_safe}/g, title_safe)
        .replace(/{tags_text}/g, tags_text)
        .replace(/{page_rating_votes}/g, entry.page_rating_votes)
        .replace(/{page_rating_contents}/g, entry.page_rating_contents)
        .replace(/{page_rating}/g, entry.page_rating)
        .replace(/{source__title}/g, source__title)
        .replace(/{age}/g, entry.age)
        .replace(/{date_published}/g, datePublished.toLocaleString());

    return listItem;
}




function isEntrySearchHit(entry, searchText) {
    if (entry.link) {
        return isEntrySearchHitEntry(entry, searchText);
    }
    if (entry.url) {
        return isEntrySearchHitSource(entry, searchText);
    }
}


function isEntrySearchHitEntry(entry, searchText) {
    if (!entry)
        return false;

    if (searchText.includes("=")) {
        return isEntrySearchHitAdvanced(entry, searchText);
    }
    else {
        return isEntrySearchHitGeneric(entry, searchText);
    }
}


function isEntrySearchHitGeneric(entry, searchText) {
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

    return false;
}


function isEntrySearchHitAdvanced(entry, searchText) {
    let operator_0 = null;
    let operator_1 = null;
    let operator_2 = null;

    if (searchText.includes("==")) {
        const result = searchText.split("==");
        operator_0 = result[0].trim();
        operator_1 = "==";
        operator_2 = result[1].trim();
    }
    else {
        const result = searchText.split("=");
        operator_0 = result[0].trim();
        operator_1 = "=";
        operator_2 = result[1].trim();
    }

    if (operator_0 == "title")
    {
        if (operator_1 == "=" && entry.title && entry.title.toLowerCase().includes(operator_2.toLowerCase()))
            return true;
        if (operator_1 == "==" && entry.title && entry.title.toLowerCase() == operator_2.toLowerCase())
            return true;
    }
    if (operator_0 == "link")
    {
        if (operator_1 == "=" && entry.link && entry.link.toLowerCase().includes(operator_2.toLowerCase()))
            return true;
        if (operator_1 == "==" && entry.link && entry.link.toLowerCase() == operator_2.toLowerCase())
            return true;
    }
    if (operator_0 == "description")
    {
        if (operator_1 == "=" && entry.description && entry.description.toLowerCase().includes(operator_2.toLowerCase()))
            return true;
        if (operator_1 == "==" && entry.description && entry.description.toLowerCase() == operator_2.toLowerCase())
            return true;
    }
    if (operator_0 == "tag")
    {
        if (entry.tags && Array.isArray(entry.tags)) {
            if (operator_1 == "=") {
                const tagMatch = entry.tags.some(tag =>
                    tag.toLowerCase().includes(operator_2.toLowerCase())
                );
                if (tagMatch) return true;
            }
            if (operator_1 == "==") {
                const tagMatch = entry.tags.some(tag =>
                    tag.toLowerCase() == operator_2.toLowerCase()
                );
                if (tagMatch) return true;
            }
        }
    }
}



function getEntryAuthorText(entry) {
    if (entry.author && entry.album)
    {
        return entry.author + " / " + entry.album;
    }
    else if (entry.author) {
        return entry.author;
    }
    else if (entry.album) {
        return entry.album;
    }
    return "";
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
    let tags = `<div class="text-reset mx-2">{tags_text}</div>`;

    return `
        <a 
            href="{entry_link}"
            title="{hover_title}"
            ${invalid_style}
            class="my-1 p-1 list-group-item list-group-item-action ${bookmark_class} border rounded"
        >
            <div class="d-flex">
                ${thumbnail_text}
                <div class="mx-2">
                    <span style="font-weight:bold" class="text-reset">{title_safe}</span>
                    <div class="text-reset">
                        {source__title} {date_published}
                    </div>
                    ${tags}
                </div>

                <div class="mx-2 ms-auto">
                  ${badge_text}
                  ${badge_star}
                  ${badge_age}
                </div>
            </div>
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
    let tags = `<div class="text-reset mx-2">{tags_text}</div>`;

    return `
        <a 
            href="{entry_link}"
            title="{hover_title}"
            ${invalid_style}
            class="my-1 p-1 list-group-item list-group-item-action ${bookmark_class} border rounded"
        >
            <div class="d-flex">
               ${thumbnail_text}
               <div class="mx-2">
                  <span style="font-weight:bold" class="text-reset">{title_safe}</span>
                  <div class="text-reset text-decoration-underline">@ {link}</div>
                  ${tags}
               </div>

               <div class="mx-2 ms-auto">
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
    
    let badge_text = getVotesBadge(page_rating_votes, true);
    let badge_star = getBookmarkBadge(entry, true);
    let badge_age = getAgeBadge(entry, true);

    let invalid_style = isEntryValid(entry) ? `` : `opacity: 0.5`;

    let thumbnail = entry.thumbnail;
    let thumbnail_text = `
        <img src="${thumbnail}" style="width:100%;max-height:100%;aspect-ratio:3/4;object-fit:cover;"/>
        <div class="ms-auto">
            ${badge_text}
            ${badge_star}
            ${badge_age}
        </div>
    `;

    let tags = `<div class="text-reset mx-2">{tags_text}</div>`;

    return `
        <a 
            href="{entry_link}"
            title="{hover_title}"
            class="list-group-item list-group-item-action m-1 border rounded p-2"
            style="text-overflow: ellipsis; max-width: 18%; min-width: 18%; width: auto; aspect-ratio: 1 / 1; text-decoration: none; display:flex; flex-direction:column; ${invalid_style}"
        >
            <div style="display: flex; flex-direction:column; align-content:normal; height:100%">
                <div style="flex: 0 0 70%; flex-shrink: 0;flex-grow:0;max-height:70%">
                    ${thumbnail_text}
                </div>
                <div style="flex: 0 0 30%; flex-shrink: 0;flex-grow:0;max-height:30%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                    <span style="font-weight: bold" class="text-primary">{title_safe}</span>
                    <div class="link-list-item-description">{source__title}</div>
                    ${tags}
                </div>
            </div>
        </a>
    `;
}


function entryGalleryTemplateMobile(entry, show_icons = true, small_icons = false) {
    let page_rating_votes = entry.page_rating_votes;
    
    let badge_text = getVotesBadge(page_rating_votes, true);
    let badge_star = getBookmarkBadge(entry, true);
    let badge_age = getAgeBadge(entry, true);

    let invalid_style = isEntryValid(entry) ? `` : `opacity: 0.5`;

    let thumbnail = entry.thumbnail;
    let thumbnail_text = `
        <img src="${thumbnail}" style="width:100%; max-height:100%; object-fit:cover"/>
        ${badge_text}
        ${badge_star}
        ${badge_age}
    `;

    let tags = `<div class="text-reset mx-2">{tags_text}</div>`;

    return `
        <a 
            href="{entry_link}"
            title="{hover_title}"
            class="list-group-item list-group-item-action border rounded p-2"
            style="text-overflow: ellipsis; max-width: 100%; min-width: 100%; width: auto; aspect-ratio: 1 / 1; text-decoration: none; display:flex; flex-direction:column; ${invalid_style}"
        >
            <div style="display: flex; flex-direction:column; align-content:normal; height:100%">
                <div style="flex: 0 0 70%; flex-shrink: 0;flex-grow:0;max-height:70%">
                    ${thumbnail_text}
                </div>
                <div style="flex: 0 0 30%; flex-shrink: 0;flex-grow:0;max-height:30%">
                    <span style="font-weight: bold" class="text-primary">{title_safe}</span>
                    <div class="link-list-item-description">{source__title}</div>
                    ${tags}
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

    htmlOutput = `  <span class="container list-group">`;

    if (view_display_type == "gallery")
    {
        htmlOutput += `  <span class="d-flex flex-wrap">`;
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

    if (view_display_type == "gallery")
    {
        htmlOutput += `</span>`;
    }

    htmlOutput += `</span>`;

    return htmlOutput;
}


function fillListDataInternal(entries) {
    $('#statusLine').html("Sorting links");

    if (sort_function == "page_rating_votes") {
        entries = entries.sort((a, b) => {
            return a.page_rating_votes - b.page_rating_votes;
        });
    }
    else if (sort_function == "-page_rating_votes") {
        entries = entries.sort((a, b) => {
            return b.page_rating_votes - a.page_rating_votes;
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
