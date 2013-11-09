function createPopupReporter(url) {

var PopupReporter = {
  url: url,
  graph: createGraph(),
  filter: createHistoryFilter()
};

PopupReporter.reportLastWeek = function reportLastWeek() {
  chrome.history.getVisits({
    url: this.url
  },
  function useVisits(visits) {
    this.graphLastWeekVisitItems(visits);
  }
  .bind(this));
};

PopupReporter.graphLastWeekVisitItems = 
function graphLastWeekVisitItems(visitItems) {
  var lastWeekVisits = this.filter.visitsInLastNDays(visitItems, 7);
  var visitsByDay = _.groupBy(lastWeekVisits, function getDay(visit) {
    var date = new Date(visit.visitTime);
    var day = date.getDate();
    return day;
  });

  var dailyVisits = _.map(visitsByDay, function makeDayVisitsObj(visitItems) {
    var date = null;
    if (visitItems.length > 0) {
      var representativeTime = new Date(visitItems[0].visitTime);
      date = new Date(representativeTime.getFullYear(), 
        representativeTime.getMonth(), representativeTime.getDate());
    }
    return {
      date: date,
      visitCount: visitItems.length
    };
  });

  console.log(dailyVisits);

  this.graph.render(document.body, 'weekGraph', dailyVisits);
};

return PopupReporter;
}

debugger;
var bg = chrome.extension.getBackgroundPage();
var popupReporter = createPopupReporter(bg.reporter.url);
popupReporter.reportLastWeek();

