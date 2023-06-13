# OMDB API SPA

This version of the OMDB API SPA utilizes the OMDB API and features:

1. DOM manipulation is used to display the OMDB API request and response.
2. Fetch is used to handle the Search button functionality.
3. A Reset button is used to reset the form fields.
4. The Request shows the request made to the OMDB API. The apiKey will not be shown to the user, but is used in the js file.
5. The Response will show movie information in JSON or XML format depending on user selection.
   1. The JSON response will now be shown in HTML while the XML response is still shown in XML
6. User is able to search based on a title string or imdbID.
7. User can select to display a short plot or long plot.
8. User can select to display the response in JSON or XML.
9. User will be shown an error message if an invalid title string or imdbID.
10. At the very bottom of the Response, the user will be given 5 movie recommendations based on the searched title's plot.
11. After the second search, path-based breadcrumbs:
    1. will be displayed by DOM manipulation at the top of the form.
    2. can be used to go back to a previous search.
12. After a search is made, a Bookmark drop down will be added to the top of the form that allows the user to:
    1. rate the current movie being displayed.
    2. modify the rating if one already exists.

> **_NOTE:_** An easy way to test the imdbID search is to get the imdbID from a title search.

## How to use the Project

You can clone the repository and cd into the project folder:

```
cd OMDB-API-SPA with Added Features
```

From the OMDB-API-SPA with Added Features folder, open the OMDB-API-SPA.html file in a browser and begin using the project.
