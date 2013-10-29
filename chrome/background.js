chrome.browserAction.setBadgeBackgroundColor({color:[240, 16, 8, 255]});
chrome.browserAction.setBadgeText({text: '200'});

chrome.history.onVisited.addListener(respondToPageVisit);
chrome.tabs.onActivated.addListener(respondToTabActivation);

function respondToPageVisit(historyItem) {
  console.log('hey');
  reportOnURL(historyItem.url);
}

function reportOnURL(url) {
  var now = new Date();
  var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  var startOfDayEpoch = startOfDay.getTime();
  var endOfDayEpoch = startOfDayEpoch + 24 * 60 * 60 * 1000 - 1; 

  // TODO: Handle hash.
  chrome.history.search({
    text: url,
    startTime: startOfDayEpoch,
    endTime: endOfDayEpoch    
  }, 
  reportVisits);  
}

function reportVisits(visits) {
  if (visits && visits.length) {
    // TODO: Add up visit counts.
    // TODO: Distinguish between visits to the domain and visits to that 
    // exact url.
    // TODO: Set color with scale based on number of visits.
    chrome.browserAction.setBadgeText({text: visits.length.toString()});
  }
}

function respondToTabActivation(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function gotTab(tab) {
    reportOnURL(tab.url);
  });
}

chrome.browserAction.onClicked.addListener(function respondToClick(tab) {
});

