const assert = require('assert');
const entries = require('../scripts/entries_library.js');


console.log('---------Entries test---------');


global.getQueryParam = (param) => {
  if (param === 'test') {
    return 'mocked_value';
  }
  return null;
};

global.getDefaultFileName = () => {
  return 'mocked_value';
};

global.escapeHtml = (string) => {
  return 'mocked_value';
};

global.isMobile = () => {
  return false;
};

global.parseDate = (param) => {
  return "2015";
};

global.getChannelUrl = (param) => {
  return "2015";
};

global.getYouTubeVideoId = (param) => {
  return "2015";
};

global.InputContent = class {
  constructor(param) {
    this.param = param;
  }

  htmlify() {
    return '2015';
  }
};

global.UrlLocation = class {
  constructor(param) {
    this.param = param;
  }

  getProtocolless() {
    return '2015';
  }
}


global.view_display_type = "search-engine";
global.view_show_icons = true;
global.view_small_icons = true;
global.highlight_bookmarks = true;
global.show_pure_links = false;


function testGetEntryTagsEmpty() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description"
    // no 'tags' field
  };

  const tags = entries.getEntryTags(entry);

  assert.strictEqual(tags, "");
  console.log('OK');
}


function testGetEntryTagsNotEmpty() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
  };

  const tags = entries.getEntryTags(entry);

  assert.strictEqual(tags, "#something,#else");
  console.log('OK');
}


function testGetEntryListTestStandard() {
  global.view_display_type = "standard";
  global.view_show_icons = true;
  global.view_small_icons = true;

  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
  };

  const text = entries.getEntryListText(entry);

  assert.ok(typeof text === 'string' && text.length > 0);
  console.log('OK');
}


function testGetEntryListTestGallery() {
  global.view_display_type = "gallery";
  global.view_show_icons = true;
  global.view_small_icons = true;

  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
  };

  const text = entries.getEntryListText(entry);

  assert.ok(typeof text === 'string' && text.length > 0);
  console.log('OK');
}


function testGetEntryListTestSearchEngine() {

  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
  };

  const text = entries.getEntryListText(entry);

  assert.ok(typeof text === 'string' && text.length > 0);
  console.log('OK');
}


function testIsStatusCodeValid_Unknown() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
    status_code: 0,
  };

  const valid = entries.isStatusCodeValid(entry);

  assert.ok(valid);
  console.log('OK');
}


function testIsStatusCodeValid_OK() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
    status_code: 200,
  };

  const valid = entries.isStatusCodeValid(entry);

  assert.ok(valid);
  console.log('OK');
}


function testIsStatusCodeValid_Redir() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
    status_code: 300,
  };

  const valid = entries.isStatusCodeValid(entry);

  assert.ok(valid);
  console.log('OK');
}


function testIsStatusCodeValid_Invalid() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
    status_code: 400,
  };

  const valid = entries.isStatusCodeValid(entry);

  assert.ok(!valid);
  console.log('OK');
}


function testIsStatusCodeValid_UserAgent() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    tags: ["something", "else"],
    status_code: 403,
  };

  const valid = entries.isStatusCodeValid(entry);

  assert.ok(valid);
  console.log('OK');
}


function testGetEntryAuthorText() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    tags: ["something", "else"],
    status_code: 403,
  };

  const text = entries.getEntryAuthorText(entry);

  assert.strictEqual(text, "Author / Album");
  console.log('OK');
}


function testGetEntryVotesBadge() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    tags: ["something", "else"],
    status_code: 403,
  };

  const text = entries.getEntryVotesBadge(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryBookmarkBadge_NonBookmarked() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    bookmarked: false,
    tags: ["something", "else"],
    status_code: 403,
  };

  const text = entries.getEntryBookmarkBadge(entry);

  assert.equal(text, '');
  console.log('OK');
}


function testGetEntryBookmarkBadge_Bookmarked() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 403,
  };

  const text = entries.getEntryBookmarkBadge(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryAgeBadge() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    age: 10,
    page_rating_votes: 50,
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 403,
  };

  const text = entries.getEntryAgeBadge(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryDeadBadge() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    date_dead_since: "2015",
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 404,
  };

  const text = entries.getEntryDeadBadge(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryParameters() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    date_dead_since: "2015",
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 404,
  };

  const text = entries.getEntryParameters(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryFullTextStandard() {
  const entry = {
    link: "https://youtube.com/else",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    date_dead_since: "2015",
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 404,
  };

  const text = entries.getEntryFullTextStandard(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryFullTextYouTube() {
  const entry = {
    link: "https://youtube.com/watch?v=1234",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    date_dead_since: "2015",
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 404,
  };

  const text = entries.getEntryFullTextYouTube(entry);

  assert.ok(text);
  console.log('OK');
}


function testGetEntryDetailText() {
  const entry = {
    link: "https://youtube.com/watch?v=1234",
    title: "title",
    description: "description",
    author: "Author",
    album: "Album",
    page_rating_votes: 50,
    date_dead_since: "2015",
    bookmarked: true,
    tags: ["something", "else"],
    status_code: 404,
  };

  const text = entries.getEntryDetailText(entry);

  assert.ok(text);
  console.log('OK');
}


testGetEntryTagsEmpty();
testGetEntryTagsNotEmpty();
testGetEntryListTestStandard();
testGetEntryListTestGallery();
testGetEntryListTestSearchEngine();

testIsStatusCodeValid_Unknown();
testIsStatusCodeValid_OK();
testIsStatusCodeValid_Redir();
testIsStatusCodeValid_Invalid();
testIsStatusCodeValid_UserAgent();

testGetEntryAuthorText();

testGetEntryVotesBadge();
testGetEntryBookmarkBadge_NonBookmarked();
testGetEntryBookmarkBadge_Bookmarked();
testGetEntryAgeBadge();
testGetEntryDeadBadge();

testGetEntryParameters();

testGetEntryFullTextStandard();
testGetEntryFullTextYouTube();

testGetEntryDetailText();
