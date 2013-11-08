// Scope/ctor. Call it, get a Reporter object, call init when you're ready to 
// set up reporting.
function createReporter() {

var Reporter = {
  url: null,
  colorDesignator: createColorDesignator(25, 130, 40, 80, 0.2, 1.0),
  activeTabId: null,
  filter: createHistoryFilter()
};

function changeURL(url) {
  if (url && url.indexOf('chrome-') !== 0) {
    Reporter.url = url;
    report();    
  }  
}

function respondToPageVisit(historyItem) {
  changeURL(historyItem.url);
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
  var lastDayVisitItems = Reporter.filter.visitsInLastNDays(visitItems, 1);
  var visits = lastDayVisitItems.length;
  var designator = Reporter.colorDesignator;

  if (!Reporter.activeTabId) {
    debugger;
  }
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

function reportOnTab(tab) {
  changeURL(tab.url);
}

function respondToTabActivation(activeInfo) {
  Reporter.activeTabId = activeInfo.tabId;
  if (!activeInfo.tabId) {
    console.log('activeInfo.tabId', activeInfo.tabId);
  }
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
