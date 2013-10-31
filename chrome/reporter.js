// Scope/ctor. Call it, get a Reporter object, call init when you're ready to 
// set up reporting.
function createReporter() {

var Reporter = {
  url: null,
  colorDesignator: createColorDesignator(25, 130, 40, 80, 0.2, 1.0),
  activeTabId: null
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
}

function reportOnVisitItems(visitItems) {
  if (visitItems && visitItems.length) {
    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startOfDayEpoch = startOfDay.getTime();
    var endOfDayEpoch = startOfDayEpoch + 24 * 60 * 60 * 1000 - 1;

    var lastDayVisitItems = visitItems.filter(
      function isInLastDay(item) {
        return (item.visitTime >= startOfDayEpoch &&
          item.visitTime < endOfDayEpoch);
      }
    );

    var visits = lastDayVisitItems.length;
    var designator = Reporter.colorDesignator;

    chrome.browserAction.setIcon({
      imageData: makeIcon(visits.toString(),
        (visits < 25) ? '#333' : '#fff', 
        Reporter.colorDesignator.getHSLAForVisitCount(visits)
      ),
      tabId: Reporter.activeTabId
    });

    chrome.browserAction.setTitle({
      title: visits + ' visits today; ' + visitItems.length + ' all-time visits.',
      tabId: Reporter.activeTabId
    });    
  }
}

function reportOnTab(tab) {
  Reporter.url = tab.url;
  report();
}

function respondToTabActivation(activeInfo) {
  Reporter.activeTabId = activeInfo.tabId;
  chrome.tabs.get(activeInfo.tabId, reportOnTab);
}

function respondToWindowFocus(windowId) {
  chrome.windows.get(windowId, {populate: true}, function gotWindow(window) {
    for (var i = 0; i < window.tabs.length; ++i) {
      var tab = window.tabs[i];
      if (tab.active) {
        Reporter.activeTabId = tab.id;
        reportOnTab(tab);
        break;
      }
    }
  });
}

Reporter.init = function init() {
  chrome.history.onVisited.addListener(respondToPageVisit);
  chrome.tabs.onActivated.addListener(respondToTabActivation);
  chrome.windows.onFocusChanged.addListener(respondToWindowFocus);
};

return Reporter;
}
