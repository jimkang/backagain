// chrome.browserAction.setBadgeBackgroundColor({color:[240, 16, 8, 255]});
// chrome.browserAction.setBadgeText({text: '200'});


var reporter = createReporter();
reporter.init();

chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
});

