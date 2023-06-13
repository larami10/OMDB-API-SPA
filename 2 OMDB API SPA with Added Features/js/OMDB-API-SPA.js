// apikey
var key = "bfad932e";

// array to hold title breadcrumbs
var titleBreadcrumbs = [];

// array to hold id breadcrumbs
var idBreadcrumbs = [];

// boolean to check for invalid input
var invalidInput = false;

// global vars used for bookmarks
var localStorageTitle = "";
var bookmarkLabelId = "";
var bookmarkId = "";

/* clear the session storage and all fields to starting position
 * at new session/page refresh/
 */
window.onunload = () => {
  // reset title fields
  document.getElementById("t").value = "";
  document.getElementById("y").value = "";
  document.getElementById("title-plot").value = "";
  document.getElementById("title-response").value = "";

  // reset id fields
  document.getElementById("i").value = "";
  document.getElementById("id-plot").value = "";
  document.getElementById("id-response").value = "";

  // clear session storage
  window.sessionStorage.clear();
};

/* goBack() will set all title or id fields to the selected breadcrumb removing
 * any breadcrumbs that came after the selected breadcrumb in the process.
 */
function goBack(element, type) {
  // if title breadcrumb is selected
  if (type === "title") {
    // set title field values to selected breadcrumb
    document.getElementById("t").value = titleBreadcrumbs[element][0];
    document.getElementById("y").value = titleBreadcrumbs[element][1];
    document.getElementById("title-plot").value = titleBreadcrumbs[element][2];
    document.getElementById("title-response").value =
      titleBreadcrumbs[element][3];

    // call getTitle() to populate the searched movie information
    getTitle();

    // traverse backwards through breadcrumbs array deleting all elements up to selected
    for (let i = titleBreadcrumbs.length - 1; i >= element; i--) {
      if (document.getElementById("titleBreadcrumbs" + i) !== null) {
        document.getElementById("titleBreadcrumbs" + i).remove();
      }
    }
    // else if id breadcrumb is selected
  } else {
    // set id field values to selected breadcrumb
    document.getElementById("i").value = idBreadcrumbs[element][0];
    document.getElementById("id-plot").value = idBreadcrumbs[element][1];
    document.getElementById("id-response").value = idBreadcrumbs[element][2];

    // call getId() to populate the searched movie information
    getId();

    // traverse backwards through breadcrumbs array deleting all elements up to selected
    for (let i = idBreadcrumbs.length - 1; i >= element; i--) {
      if (document.getElementById("idBreadcrumbs" + i) !== null) {
        document.getElementById("idBreadcrumbs" + i).remove();
      }
    }
  }
}

/* getTitle() is called when the search button is clicked when the
 * client searches by Title. getTitle() will try to retrieve a title,
 * a year, a plot type, and a response type. If a title and year are
 * not provided or if the client provides a year without a title,
 * getTitle() will respond with an appropriate error message depending
 * on the response type. Populate breadcrumbs and bookmark options for
 * title.
 */
async function getTitle() {
  // if there are title breadcrumbs and there is no invalidInput
  if (
    sessionStorage.getItem("titleBreadcrumbs") !== null &&
    invalidInput === false
  ) {
    // create a button breadcrumb for the last successful search
    var p = document.createElement("p" + titleBreadcrumbs.length);
    p.innerHTML =
      `<button id="titleBreadcrumbs` +
      (titleBreadcrumbs.length - 1) +
      `" onclick="goBack(` +
      (titleBreadcrumbs.length - 1) +
      `, 'title')">Searched: ` +
      titleBreadcrumbs[titleBreadcrumbs.length - 1][0] +
      `</button>`;

    document.getElementById("titleBreadcrumbs").append(p);
  }

  // set bookmarkId and bookmarkLabelId for title
  bookmarkId = "title-bookmark-id";
  bookmarkLabelId = "title-bookmark-label";

  // if title bookmark options are displayed
  if (document.getElementById(bookmarkId) !== null) {
    // set initial value to " "
    document.getElementById(bookmarkId).value = " ";
  }

  // retrieve the year, plot type, and response type
  var year = document.getElementById("y").value;
  var plot = document.getElementById("title-plot").value;
  var response = document.getElementById("title-response").value;

  // retrieve the title replacing spaces with "+"
  var title = "";
  for (let i = 0; i < document.getElementById("t").value.length; i++) {
    if (document.getElementById("t").value[i] === " ") {
      title += "+";
    } else {
      title += document.getElementById("t").value[i];
    }
  }

  // begin url call
  var url = "http://www.omdbapi.com/?";

  // if a title is given, add title query to url
  if (title !== "") {
    url += "t=" + title;
  }

  // if a year is given, add year query to url
  if (year !== "") {
    // logic for when to add & to query
    if (title !== "") {
      url += "&";
    }
    url += "y=" + year;
  }

  // if a plot type is given, add plot query to url
  if (plot !== "") {
    // logic for when to add & to query
    if (title !== "" || year !== "") {
      url += "&";
    }
    url += "plot=" + plot;
  }

  // if a response type is given, add response query to url
  if (response !== "") {
    // logic for when to add & to query
    if (title !== "" || year !== "" || plot !== "") {
      url += "&";
    }
    url += "r=" + response;
  }

  // Add html to display Request: url
  document.getElementById("search-by-title-request").innerHTML =
    "Request: " + url;

  if (response !== "xml") {
    document.getElementById("search-by-title-request").innerHTML += "<br><br>";
  }

  // add apikey to url
  url += "&apikey=" + key;

  // Add html to begin displaying Response:
  document.getElementById("search-by-title-response").innerHTML = "Response:";

  // call respond to add JSON/XML response
  respond(title, year, null, url, response, "search-by-title-response");
}

/* getId() is called when the search button is clicked when the
 * client searches by ID. getId() will try to retrieve an ID,
 * a plot type, and a response type. If an ID is not provided,
 * getId() will respond with an appropriate error message depending
 * on the response type. Populate breadcrumbs and bookmark options
 * for id.
 */
async function getId() {
  // if there are title breadcrumbs and there is no invalidInput
  if (
    sessionStorage.getItem("idBreadcrumbs") !== null &&
    invalidInput === false
  ) {
    // create a button breadcrumb for the last successful search
    var p = document.createElement("p" + idBreadcrumbs.length);
    p.innerHTML =
      `<button id="idBreadcrumbs` +
      (idBreadcrumbs.length - 1) +
      `" onclick="goBack(` +
      (idBreadcrumbs.length - 1) +
      `, 'id')">Searched: ` +
      idBreadcrumbs[idBreadcrumbs.length - 1][0] +
      `</button>`;

    document.getElementById("idBreadcrumbs").append(p);
  }

  // set bookmarkId and bookmarkLabelId for id
  bookmarkId = "id-bookmark-id";
  bookmarkLabelId = "id-bookmark-label";

  // if id bookmark options are displayed
  if (document.getElementById(bookmarkId) !== null) {
    // set inital value to " "
    document.getElementById(bookmarkId).value = " ";
  }

  // retrieve id, plot type, and response type
  var id = document.getElementById("i").value;
  var plot = document.getElementById("id-plot").value;
  var response = document.getElementById("id-response").value;

  // begin url call
  var url = "http://www.omdbapi.com/?";

  // if an ID is given, add id query to url
  if (id !== "") {
    url += "i=" + id;
  }

  // if a plot type is given, add plot query to url
  if (plot !== "") {
    // logic for when to add & to query
    if (id !== "") {
      url += "&";
    }
    url += "plot=" + plot;
  }

  // if a response type is given, add response query to url
  if (response !== "") {
    // logic for when to add & to query
    if (id !== "" || plot !== "") {
      url += "&";
    }
    url += "r=" + response;
  }

  // Add html to display Request: url
  document.getElementById("search-by-id-request").innerHTML = "Request: " + url;

  if (response !== "xml") {
    document.getElementById("search-by-id-request").innerHTML += "<br><br>";
  }

  // add apikey to url
  url += "&apikey=" + key;

  // Add html to begin displaying Response:
  document.getElementById("search-by-id-response").innerHTML = "Response:";

  // call respond to add JSON/XML response
  respond(null, null, id, url, response, "search-by-id-response");
}

/* respond() uses client provided information (title and year, or an id),
 * the url, response, and an html id element to provide the client with
 * an appropriate JSON or XML response depending on what the client selects.
 */
function respond(title, year, id, url, response, idElement) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    // Request finished and response is ready and Status is "OK"
    if (this.readyState == 4 && this.status == 200) {
      // start with blank output
      var output = "";

      // create an empty array for recommendations
      var recommendations = [];

      // set starting url used to retrieve recommendations
      var recommendationsURL = "http://www.omdbapi.com/?apikey=bfad932e";

      // plot variable used to get current plot to fetch recommendations
      var plot;

      // err variable used to validate whether or not there's an invalid input
      var err = true;

      // if response is xml
      if (response === "xml") {
        // if title, year, or id are blank
        if (
          (title === "" && year === "") ||
          title === "" ||
          id === "" ||
          this.responseXML.getElementsByTagName("root")[0].attributes[0]
            .nodeValue === "False"
        ) {
          // modify the error message
          this.responseXML.getElementsByTagName(
            "error"
          )[0].childNodes[0].nodeValue = "Something went wrong.";

          // prepare output for xml response
          output =
            "<xmp>" + this.responseXML.activeElement.outerHTML + "</xmp>";

          // format the XML response for readability
          output = formatXML(output, "");

          // set err to false
          err = false;
        } else {
          // prepare output for xml response
          output =
            "<xmp>" + this.responseXML.activeElement.outerHTML + "</xmp>";

          // format the XML response for readability
          output = formatXML(output, "");

          // convert xml response to html table
          // output = respondXML(
          //   this.responseXML.activeElement.firstChild.attributes
          // );
          // // find xml plot value
          // plot =
          //   this.responseXML.activeElement.firstChild.attributes[9].nodeValue.split(
          //     " "
          //   );

          // set LocalStorageTitle to retrieved XML movie title
          localStorageTitle =
            this.responseXML.activeElement.firstChild.attributes[0].nodeValue;
        }
        // else if response is "" (json)
      } else {
        // if title, year, or id are blank
        if (
          (title === "" && year === "") ||
          title === "" ||
          id === "" ||
          JSON.parse(this.response).Response === "False"
        ) {
          // set output to parsed this.response
          output = JSON.parse(this.response);

          // modify the error message
          output.Error = "Something went wrong.";

          // stringify output
          output = JSON.stringify(output, null, 2);

          // set err to false
          err = false;
          // else leave this.response as is
        } else {
          // convert JSON response to html table
          output = respondJSON(JSON.parse(this.response));

          // find JSON plot value
          plot = JSON.parse(this.response)["Plot"].split(" ");

          // set localStorageTitle to retrieved JSON movie title
          localStorageTitle = JSON.parse(this.response)["Title"];
        }
      }
      // set the innerHTML of idElement to output
      document.getElementById(idElement).innerHTML = output;

      // if there wasn't an invalid input
      if (err === true) {
        // set invalidInput to false
        invalidInput = false;

        // create an empty search array to hold searched values
        var search = [];

        // if running a title search
        if (id === null) {
          // add title search values to search array
          search.push(document.getElementById("t").value);
          search.push(document.getElementById("y").value);
          search.push(document.getElementById("title-plot").value);
          search.push(document.getElementById("title-response").value);

          // add search array to titleBreadcrumbs array
          titleBreadcrumbs.push(search);

          // add titleBreadcrumbs to sessionStorage
          sessionStorage.setItem("titleBreadcrumbs", titleBreadcrumbs);

          // call bookmark() for title variant
          bookmark("title");
          // else running an id search
        } else {
          // add id search values to search array
          search.push(document.getElementById("i").value);
          search.push(document.getElementById("id-plot").value);
          search.push(document.getElementById("id-response").value);

          // add search array to idBreadcrumbs array
          idBreadcrumbs.push(search);

          // add idBreadcrumbs to sessionStorage
          sessionStorage.setItem("idBreadcrumbs", idBreadcrumbs);

          // call bookmark() for id variant
          bookmark("id");
        }

        // add recommendations to html
        recommend(plot, recommendations, recommendationsURL, idElement);
        // else there was an invalidInput
      } else {
        // set invalidInput to true
        invalidInput = true;

        // if bookmarks were being displayed on successful search
        if (document.getElementById(bookmarkId) !== null) {
          // remove the bookmark label and options on invalid search
          document.getElementById(bookmarkLabelId).remove();
          document.getElementById(bookmarkId).remove();
        }
      }
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

/* respondXML() traverses through the XML response to create and
 * return each nodeName and nodeValue into a table.
 */
function respondXML(response) {
  var output = `<table>`;

  // traverse through xml attributes
  for (let i = 0; i < response.length; i++) {
    // grab each nodeName and set first character to uppercase
    var nodeName =
      response[i].nodeName.charAt(0).toUpperCase() +
      response[i].nodeName.slice(1);

    // if there's an http link
    if (response[i].nodeValue.includes("http")) {
      // give that link a hyperlink
      output +=
        `<tr>
                        <td>` +
        nodeName +
        `</td>
                        <td><a href="` +
        response[i].nodeValue +
        `">` +
        response[i].nodeValue +
        `</a></td>
                       </tr>`;
      // else
    } else {
      // add each nodeName and nodeValue to table
      output +=
        `<tr>
                        <td>` +
        nodeName +
        `</td>
                        <td>` +
        response[i].nodeValue +
        `</td>
                       </tr>`;
    }
  }
  // close the html table
  output += `</table>`;
  return output;
}

/* respondJSON() traverses through the JSON response to create and
 * return each key and value into a table.
 */
function respondJSON(response) {
  output = `<table>`;

  // traverse through each JSON object
  for (var key in response) {
    // if Ratings is a key
    if (key === "Ratings") {
      // add each rating to a list for table
      output += `<tr><td>Ratings</td><td><ul>`;
      for (var key1 in response[key]) {
        output +=
          `<li>` +
          response[key][key1].Source +
          `: ` +
          response[key][key1].Value +
          `</li>`;
      }
      output += `</ul></td></tr>`;
      // else if a link exists, add hyperlink
    } else if (response[key].includes("http")) {
      output +=
        `<tr>
                        <td>` +
        key +
        `</td>
                        <td><a href="` +
        response[key] +
        `">` +
        response[key] +
        `</a></td>
                       </tr>`;
      // else add to table
    } else {
      output +=
        `<tr>
                        <td>` +
        key +
        `</td>
                        <td>` +
        response[key] +
        `</td>
                       </tr>`;
    }
  }
  // close output table
  output += `</table>`;
  return output;
}

/* recommend() will use words from the plot summary to fetch movie titles and
 * add up to 5 movies titles to a recommendations array if the movie titles
 * exist. Once the plot summary has been fully traverse, an unordered list
 * will be added to the html to show the list of recommended movie titles.
 */
async function recommend(plot, recommendations, recommendationsURL, idElement) {
  // traverse plot summary
  for (let i = 0; i < plot.length; i++) {
    // if the recommendations array still does not hold 5 values
    if (recommendations.length < 5) {
      // fetch movie data using words listed in the plot
      var data = await fetch(recommendationsURL + "&t=" + plot[i])
        .then((response) => response.json())
        .then((data) => {
          // if fetch finds a match
          if (data.Response === "True") {
            // return the movie title only
            return data.Title;
          }
        });
      // add the movie title to recommendations array
      recommendations.push(data);
    }
  }

  // begin recommendations html list
  document.getElementById(idElement).innerHTML +=
    "<br><br>You may also like:<br><ul>";

  // traverse the recommendations array to display recommended movie titles
  for (let i = 0; i < recommendations.length; i++) {
    document.getElementById(idElement).innerHTML +=
      "<li>" + recommendations[i] + "</li>";
  }

  // close html unordered list
  document.getElementById(idElement).innerHTML += "</ul>";
}

/* reset() takes a variable so that the method knows if it was the
 * title's or id's reset button that the client clicked. Once reset()
 * is called, all html elements will be reset to starting positions.
 */
function reset(type) {
  if (type === "title") {
    document.getElementById("t").value = "";
    document.getElementById("y").value = "";
    document.getElementById("title-plot").value = "";
    document.getElementById("title-response").value = "";
    document.getElementById("search-by-title-request").innerHTML = "";
    document.getElementById("search-by-title-response").innerHTML = "";
  } else if (type === "id") {
    document.getElementById("i").value = "";
    document.getElementById("id-plot").value = "";
    document.getElementById("id-response").value = "";
    document.getElementById("search-by-id-request").innerHTML = "";
    document.getElementById("search-by-id-response").innerHTML = "";
  }

  // if bookmarks were being displayed on successful search
  if (document.getElementById(bookmarkId) !== null) {
    // remove the bookmark label and options on invalid search
    document.getElementById(bookmarkLabelId).remove();
    document.getElementById(bookmarkId).remove();
  }
}

/* bookmark() will create the bookmark label/options and add them to
 * the html to be displayed to the client responding to either the
 * title or id search dependent on what the type of search the client
 * has performed. Each bookmark options is assigned to operate the
 * bookmarkLocalStorage() to add the current search to localStorage.
 * bookmark() will also redisplay a bookmark value if the current
 * title or id was already assigned a bookmark rating.
 */
function bookmark(type) {
  // if bookmark is not already displayed
  if (document.getElementById(bookmarkId) === null) {
    // create bookmark
    var label = document.createElement("label");
    label.innerHTML =
      `<label id="` +
      bookmarkLabelId +
      `">Bookmark: </label>
        <select id="` +
      bookmarkId +
      `" name="bookmark">
            <option value="0" onclick="bookmarkLocalstorage()">0</option>
            <option value="1" onclick="bookmarkLocalstorage()">1</option>
            <option value="2" onclick="bookmarkLocalstorage()">2</option>
            <option value="3" onclick="bookmarkLocalstorage()">3</option>
            <option value="4" onclick="bookmarkLocalstorage()">4</option>
            <option value="5" onclick="bookmarkLocalstorage()">5</option>
        </select>`;

    // if title search, add bookmark options to title section
    if (type === "title") {
      document.getElementById("title-bookmark").append(label);
      // else add bookmark options to id section
    } else if (type === "id") {
      document.getElementById("id-bookmark").append(label);
    }

    // set initial bookmark value to " "
    document.getElementById(bookmarkId).value = " ";
  }

  // if current movie title is in localStorage
  if (localStorage.getItem(localStorageTitle) !== null) {
    // redisplay the assigned bookmark rating
    document.getElementById(bookmarkId).value =
      localStorage.getItem(localStorageTitle);
  }
}

/* bookmarkLocalStorage() will take the movie title assigned to
 * localStorageTitle and add it as the key to localStorage with
 * the selected bookmark rating as it's value pair.
 */
function bookmarkLocalstorage() {
  localStorage.setItem(
    localStorageTitle,
    document.getElementById(bookmarkId).value
  );
}

/* formatXML takes the XML objext and an indent character to format the
 * XML object into a more readable object.
 */
function formatXML(input, indent) {
  // set/define other indent or just tab
  indent = indent || "\t";

  // Add \n where necessary
  xmlString = input.replace(/^\s+|\s+$/g, "");

  xmlString = input
    // add \n after tag if not followed by the closing tag of pair or text node
    .replace(/(<([a-zA-Z]+\b)[^>]*>)(?!<\/\2>|[\w\s])/g, "$1\n")

    // add \n after closing tag
    .replace(/(<\/[a-zA-Z]+[^>]*>)/g, "$1\n")

    // add \n between sets of angled brackets and text node between them
    .replace(/>\s+(.+?)\s+<(?!\/)/g, ">\n$1\n<")

    // add \n between angled brackets and text node between them
    .replace(/>(.+?)<([a-zA-Z])/g, ">\n$1\n<$2")

    // detect a header of XML
    .replace(/\?></, "?>\n<");

  // split it into an array to analyze each line separately
  xmlArr = xmlString.split("\n");

  var tabs = ""; // store the current indentation
  var start = 0; // starting line

  // if the first line is a header, ignore it
  if (/^<[?]xml/.test(xmlArr[0])) {
    start++;
  }

  // for each line
  for (var i = start; i < xmlArr.length; i++) {
    var line = xmlArr[i].replace(/^\s+|\s+$/g, "");

    // if the line is a closing tag
    if (/^<[/]/.test(line)) {
      // remove one indent from the store
      tabs = tabs.replace(indent, "");

      // add the tabs at the beginning of the line
      xmlArr[i] = tabs + line;

      // else if the line contains an entire node
    } else if (/<.*>.*<\/.*>|<.*[^>]\/>/.test(line)) {
      // add a tab to the beginning
      xmlArr[i] = tabs;

      // if there's no error tag
      if (!line.includes("<error>")) {
        // break the text node by character
        for (j = 0; j < line.length; j++) {
          // if the current character is a space and has a quote in front of it
          if (
            j !== 0 &&
            j < line.length - 1 &&
            line[j - 1] === '"' &&
            line[j] === " "
          ) {
            // replace the space character with a new line and 2 tabs for readability
            xmlArr[i] += line[j].replace(" ", "\n\t\t");

            // else add the character to the current line
          } else {
            xmlArr[i] += line[j];
          }
        }
        // if there's an error tag, print entire text node on one line
      } else {
        xmlArr[i] += line;
      }

      // else if the line starts with an opening tag and does not contain an entire node
    } else if (/<.*>/.test(line) && !xmlArr[i].includes("root")) {
      // add the tabs at the beginning of the line
      xmlArr[i] = tabs + line;

      // add one indent to the store
      tabs += indent;
    }
  }

  // return formatted string and rejoin the array to a string and return it
  return xmlArr.join("\n");
}
