$(document).ready(function() {
  // Parse page number table cells.
  var pageCells = {};

  $("tr td:last-child").not("[colspan]").each(function(i) {
    let id = `td_${i}`;
    $(this).attr("id", id);

    pageCells[id] = $(this).text()
                           .replace(/\s/g, "")
                           .split(",");
  });

  // Parse page conversions object.
  var chaptersMax = {};
  for (let chapter in pageConversions["chapters"]) {
    chaptersMax[pageConversions["chapters"][chapter].flpRange[1]] = parseInt(chapter);
  }

  var chaptersMaxKeys = Object.keys(chaptersMax);

  var convertButton = $("#convert");
  convertButton.on("click", function() {
    for (let id in pageCells) {
      let cellPageNumbers = pageCells[id];
      let convertedCellPageNumbers = [];

      for (let i = 0; i < cellPageNumbers.length; i++) {
        let page =  parseInt(cellPageNumbers[i]);
        let chapterMaxKey;

        for (let j = 0; j < chaptersMaxKeys.length; j++) {
          if (parseInt(chaptersMaxKeys[j]) >= page)
          {
            chapterMaxKey = chaptersMaxKeys[j];
            break;
          }
        }

        if (typeof chapterMaxKey === "undefined") {
          continue;
        }

        let chapter = chaptersMax[chapterMaxKey];
        if (typeof pageConversions["chapters"][chapter]["conversions"][page] === "undefined") {
          continue;
        }

        convertedCellPageNumbers = convertedCellPageNumbers.concat(pageConversions["chapters"][chapter]["conversions"][page]);
      }

      convertedCellPageNumbers = jQuery.unique(convertedCellPageNumbers);
      $(`#${id}`).html(convertedCellPageNumbers.join(", "));
    }

    // Update button.
    convertButton.unbind("click");
    convertButton.html("Convert to Foreign Language Press Edition");
    convertButton.on("click", function() { location.reload(); });

    // Update info text.
    $("#info p").html(`
      Page numbers are based on the University of California Press edition translation (two volumes).
      <br />
      ISBN 978-0-520-22478-0 (Part one) and ISBN 978-0-520-22503-9 (Part two)`);

    // Remove yellow highlight text.
    $("#pageNumberColumn").html("Page Numbers")
  });
});
