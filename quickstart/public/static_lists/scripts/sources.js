
function fillOneEntrySource(entry) {
    let datePublished = null;

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
    let entry_link = entry.url;
    let link = entry.url;
    let link_absolute = entry.url;

    title = escapeHtml(entry.title)

    let title_safe = null;
    if (entry.title) {
       title_safe = escapeHtml(entry.title)
    }

    // Replace all occurrences of the placeholders using a global regular expression
    let listItem = template_text
        .replace(/{link_absolute}/g, entry.url)
        .replace(/{link}/g, entry.url)
        .replace(/{entry_link}/g, entry_link)
        .replace(/{title}/g, title)
        .replace(/{thumbnail}/g, entry.thumbnail)
        .replace(/{title_safe}/g, title_safe)
        .replace(/{age}/g, entry.age)

    return listItem;
}


function isEntrySearchHitSource(entry, searchText) {
    if (!entry)
        return false;

    if (searchText.includes("=")) {
        return isEntrySearchHitAdvancedSource(entry, searchText);
    }
    else {
        return isEntrySearchHitGenericSource(entry, searchText);
    }
}


function isEntrySearchHitGenericSource(entry, searchText) {
    if (entry.url && entry.url.toLowerCase().includes(searchText.toLowerCase()))
        return true;

    if (entry.title && entry.title.toLowerCase().includes(searchText.toLowerCase()))
        return true;

    if (entry.description && entry.description.toLowerCase().includes(searchText.toLowerCase()))
        return true;

    return false;
}


function isEntrySearchHitAdvancedSource(entry, searchText) {
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
    if (operator_0 == "url")
    {
        if (operator_1 == "=" && entry.url && entry.url.toLowerCase().includes(operator_2.toLowerCase()))
            return true;
        if (operator_1 == "==" && entry.url && entry.url.toLowerCase() == operator_2.toLowerCase())
            return true;
    }
    if (operator_0 == "description")
    {
        if (operator_1 == "=" && entry.description && entry.description.toLowerCase().includes(operator_2.toLowerCase()))
            return true;
        if (operator_1 == "==" && entry.description && entry.description.toLowerCase() == operator_2.toLowerCase())
            return true;
    }
}
