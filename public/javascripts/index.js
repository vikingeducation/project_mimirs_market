$(document).ready(() => {
  //Variables from cookies
  const selectedSort = /selectedSortOption=(.+[SC]);*/.exec(document.cookie)[1];
  const searchValue = /searchValue=([^;]+);*/.exec(document.cookie)[1];
  // const filterOptionCategory = /filterOptionCategory=([^;]+);*/.exec(
  //   document.cookie
  // )[1];
  // const filterOptionMinPrice = /filterOptionMinPrice=([^;]+);*/.exec(
  //   document.cookie
  // )[1];
  // const filterOptionMaxPrice = /filterOptionMaxPrice=([^;]+);*/.exec(
  //   document.cookie
  // )[1];

  //Variables from page
  const search = $("#search");
  const sortDisplay = $(`#${selectedSort}`).html();

  //Page-load form setters

  //set sort option from cookie
  $(`#${selectedSort}`).attr("selected", "selected");

  //set search placeholder from cookie
  search.attr("placeholder", searchValue);

  //Listeners

  //indicate the selected sort option for req.body retrieval on server
  $("#sort-options").on("change", e => {
    $("#sort-options option").removeAttr("selected");
    let value = $(e.target).val();
    $(`#${value}`).attr("selected", "selected");
  });

  //update search placeholder
  search.on("keyup", e => {
    let value = search.val();
    value === "" ? (value = "search") : (value = value);
    search.attr("placeholder", value);

    //Search parameter displays

    //sorted by:
    if (sortDisplay) {
      $("#sortOptionDisplay").html(`Sorted by: ${sortDisplay}`);
    }

    //searched for:
    if (searchValue !== "search") {
      $("#searchValueDisplay").html(`Search Results for: "${searchValue}"`);
    }

    // let filterOptionCategory = document.cookie
    //   .split(" ")
    //   .filter(el => /^selectedSortOption=.+[A|D]$/.test(el))
    //   .join("")
    //   .split("=")[1];
    // /;$/.test(selectedSort)
    //   ? (selectedSort = selectedSort.split(";")[0])
    //   : selectedSort;
    // $(`#${selectedSort}`).attr("selected", "selected");
    // let sortDisplay = $(`#${selectedSort}`).html();
    // sortDisplay
    //   ? $("#sortOptionDisplay").html(`Sorted by: ${sortDisplay}`)
    //   : selectedSort;
    //
    // let filterOptionMinPrice = document.cookie
    //   .split(" ")
    //   .filter(el => /^selectedSortOption=.+[A|D]$/.test(el))
    //   .join("")
    //   .split("=")[1];
    // /;$/.test(selectedSort)
    //   ? (selectedSort = selectedSort.split(";")[0])
    //   : selectedSort;
    // $(`#${selectedSort}`).attr("selected", "selected");
    // let sortDisplay = $(`#${selectedSort}`).html();
    // sortDisplay
    //   ? $("#sortOptionDisplay").html(`Sorted by: ${sortDisplay}`)
    //   : selectedSort;
    //
    // let filterOptionMaxPrice = document.cookie
    //   .split(" ")
    //   .filter(el => /^selectedSortOption=.+[A|D]$/.test(el))
    //   .join("")
    //   .split("=")[1];
    // /;$/.test(selectedSort)
    //   ? (selectedSort = selectedSort.split(";")[0])
    //   : selectedSort;
    // $(`#${selectedSort}`).attr("selected", "selected");
    // let sortDisplay = $(`#${selectedSort}`).html();
    // sortDisplay
    //   ? $("#sortOptionDisplay").html(`Sorted by: ${sortDisplay}`)
    //   : selectedSort;
  });
});
