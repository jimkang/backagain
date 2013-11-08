function createHistoryFilter() {

var filter = {};

filter.visitsInLastNDays = function visitsInLastNDays(visitItems, n) {
  var visitsInSpan = [];

  if (visitItems && visitItems.length) {
    var now = new Date();
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), 
      now.getDate() + 1);
    var endEpoch = tomorrow.getTime() - 1;
    var startEpoch = endEpoch - n * (24 * 60 * 60 * 1000) + 1;

    visitsInSpan = visitItems.filter(
      function isInspan(item) {
        return (item.visitTime >= startEpoch &&
          item.visitTime < endEpoch);
      }
    );
  }
  return visitsInSpan;
};

return filter;
}
