function createPopupReporter(url) {

var PopupReporter = {
  url: url,
  graph: null,
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

  var sevenDaysOfVisits = padDayVisitArrayForSpan(dailyVisits, 7);

  // console.log(sevenDaysOfVisits);
  this.graph = createGraph('Visits to ' + this.getReadableURL() + ' this week.');
  this.graph.render(document.body, 'weekGraph', sevenDaysOfVisits);
};

PopupReporter.getReadableURL = function getReadableURL() {
  var readable = this.url;
  var pieces = this.url.split('//');
  if (pieces.length > 1) {
    readable = pieces[1];
    if (readable.substr(-1) === '/') {
      readable = readable.substr(0, readable.length - 1);
    }
  }

  return readable;
};

function padDayVisitArrayForSpan(
  dailyVisits, spanInDays) {

  var paddedArray = [];
  var today = new Date();

  for (var i = 0; i < spanInDays; ++i) {
    var date = new Date(today.getFullYear(), today.getMonth(), 
      today.getDate() - i);
    var existingEntries = dailyVisits.filter(function matchDate(entry) {
      return (entry.date.getTime() === date.getTime());
    });
    if (existingEntries.length === 1) {
      paddedArray[i] =  existingEntries[0];
    }
    else {
      paddedArray[i] = {date: date, visitCount: 0};
    }
  }
  return paddedArray;
}

return PopupReporter;
}

debugger;
var bg = chrome.extension.getBackgroundPage();
var popupReporter = createPopupReporter(bg.reporter.url);
popupReporter.reportLastWeek();

