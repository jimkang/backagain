// Scope/ctor. Call it, get a Reporter object, call init when you're ready to 
// set up reporting.
function createReporter() {

var Reporter = {
  url: null
};

function respondToPageVisit(historyItem) {
  Reporter.url = historyItem.url;
  report();
}

function report() {
  if (Reporter.url && Reporter.url.length > 0) {
    // chrome.history.search will return HistoryItems that include at least one 
    // visit within the specified date range but also visits outside of the 
    // date range. So, we're using getVisits here.
    chrome.history.getVisits({
      url: Reporter.url
    },
    reportOnVisitItems);
  }
};

function reportOnVisitItems(visitItems) {
  if (visitItems && visitItems.length) {
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    var startOfDayEpoch = startOfDay.getTime();
    var endOfDayEpoch = startOfDayEpoch + 24 * 60 * 60 * 1000 - 1;

    var lastDayVisitItems = visitItems.filter(
      function isInLastDay(item) {
        return (item.visitTime >= startOfDayEpoch &&
          item.visitTime < endOfDayEpoch);
      }
    );

    // TODO: Set color with scale based on number of visits.
    chrome.browserAction.setBadgeText({
      text: lastDayVisitItems.length.toString()
    });
  }
};

function respondToTabActivation(activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function gotTab(tab) {
    Reporter.url = tab.url;
    report();
  });
};

Reporter.init = function init() {
  chrome.history.onVisited.addListener(respondToPageVisit);
  chrome.tabs.onActivated.addListener(respondToTabActivation);
};

return Reporter;
}
