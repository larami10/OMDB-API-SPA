// apikey
var key = "bfad932e";

// clear all fields to starting position at new session/page refresh
window.onunload = () => {
  document.getElementById("t").value = "";
  document.getElementById("y").value = "";
  document.getElementById("title-plot").value = "";
  document.getElementById("title-response").value = "";

  document.getElementById("i").value = "";
  document.getElementById("id-plot").value = "";
  document.getElementById("id-response").value = "";
};

/* getTitle() is called when the search button is clicked when the
 * client searches by Title. getTitle() will try to retrieve a title,
 * a year, a plot type, and a response type. If a title and year are
 * not provided or if the client provides a year without a title,
 * getTitle() will respond with an appropriate error message depending
 * on the response type.
 */
async function getTitle() {
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

  // add apikey to url
  url += "&apikey=" + key;

  // Add html to begin displaying Response:
  document.getElementById("search-by-title-response").innerHTML =
    "Response:<br>";

  if (response !== "xml") {
    document.getElementById("search-by-title-response").innerHTML += "<br>";
  }

  // call respond to add JSON/XML response
  respond(title, year, null, url, response, "search-by-title-response");
}

/* getId() is called when the search button is clicked when the
 * client searches by ID. getId() will try to retrieve an ID,
 * a plot type, and a response type. If an ID is not provided,
 * getId() will respond with an appropriate error message depending
 * on the response type.
 */
async function getId() {
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

  // add apikey to url
  url += "&apikey=" + key;

  // Add html to begin displaying Response:
  document.getElementById("search-by-id-response").innerHTML = "Response:<br>";

  if (response !== "xml") {
    document.getElementById("search-by-title-response").innerHTML += "<br>";
  }

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
        }
        // prepare output for xml response
        output = "<xmp>" + this.responseXML.activeElement.outerHTML + "</xmp>";

        // format the XML response for readability
        output = formatXML(output, "");
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
          // else leave this.response as is
        } else {
          output = JSON.parse(this.response);
          output = JSON.stringify(output, null, 2);
        }
      }
      // set the innerHTML of idElement to output
      document.getElementById(idElement).innerHTML += output;
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
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
