
const assert = require('assert');
const library = require('../scripts/library.js');


console.log('---------library test---------');


function testUrlLocation() {
  const loc = new library.UrlLocation("https://google.com");
  const protocol_less = loc.getProtocolless();

  assert.strictEqual(protocol_less, "google.com");
  console.log('OK');
}


function testSanitizeLink_Normal() {
  const loc = library.sanitizeLink("https://google.com");

  assert.strictEqual(loc, "https://google.com");
  console.log('OK');
}


function testSanitizeLink_WhitespaceBefore() {
  const loc = library.sanitizeLink(" https://google.com");

  assert.strictEqual(loc, "https://google.com");
  console.log('OK');
}


function testSanitizeLink_WhitespaceAfter() {
  const loc = library.sanitizeLink("https://google.com ");

  assert.strictEqual(loc, "https://google.com");
  console.log('OK');
}


function testSanitizeLink_WhitespaceBeforeAfter() {
  const loc = library.sanitizeLink(" https://google.com ");

  assert.strictEqual(loc, "https://google.com");
  console.log('OK');
}


function testSanitizeLink_Backslash() {
  const loc = library.sanitizeLink("https://google.com/");

  assert.strictEqual(loc, "https://google.com");
  console.log('OK');
}


function testFixStupidGoogleRedirects_google1() {
  const loc = library.sanitizeLink("https://www.google.com/url?q=https://forum.ddopl.com/&sa=Udupa");

  assert.strictEqual(loc, "https://forum.ddopl.com");
  console.log('OK');
}


function testFixStupidGoogleRedirects_google2() {
  const loc = library.sanitizeLink("https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://worldofwarcraft.blizzard.com/&ved=2ahUKEwjtx56Pn5WFAxU2DhAIHYR1CckQFnoECCkQAQ&usg=AOvVaw1pDkx5K7B5loKccvg_079-");

  assert.strictEqual(loc, "https://worldofwarcraft.blizzard.com");
  console.log('OK');
}


function testFixStupidGoogleRedirects_youtube() {
  const loc = library.sanitizeLink("https://www.youtube.com/redirect?event=lorum&redir_token=ipsum&q=https%3A%2F%2Fcorridordigital.com%2F&v=LeB9DcFT810");

  assert.strictEqual(loc, "https://corridordigital.com");
  console.log('OK');
}



testUrlLocation();
testSanitizeLink_Normal();
testSanitizeLink_WhitespaceBefore();
testSanitizeLink_WhitespaceAfter();
testSanitizeLink_WhitespaceBeforeAfter();
testSanitizeLink_Backslash();

testFixStupidGoogleRedirects_google1();
testFixStupidGoogleRedirects_google2();
testFixStupidGoogleRedirects_youtube();
