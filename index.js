var express = require("express");
var exphbs = require("express-handlebars");

var hbs = require("handlebars");
hbs.registerHelper("if_eq", function(a, b, opts) {
  if (a == b) return opts.fn(this);
  else return opts.inverse(this);
});

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

var projects = require("./public/projects.json");

app.get("/", function(req, res) {
  res.render("home", {
    projects,
    title: "Emily Nguyen | Designer + Developer",
    url: "",
    description:
      "Designer + developer + HCI student that loves crafting visual experiences and seeing them through to implementation."
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    projects,
    title: "About | Emily Nguyen",
    url: "about",
    description:
      "Designer + developer + HCI student that loves crafting visual experiences and seeing them through to implementation."
  });
});

app.get("/archive", function(req, res) {
  res.render("archive", {
    projects,
    title: "Archive | Emily Nguyen",
    url: "archive",
    description: ""
  });
});

app.get("/resume", function(req, res) {
  res.redirect(
    "https://drive.google.com/file/d/0B6dEoGhrXuYId0g0Nm5BR1ZYbTg/view"
  );
});

app.get("/:project", function(req, res) {
  var inputTitle = req.params.project;

  // Check if valid project url
  var projectArray = projects.projects;

  for (var i = 0; i < projectArray.length; i++) {
    var currProject = projectArray[i];

    // Render project page if input title matches a project
    if (inputTitle == currProject.url) {
      // Redirect to archive if necessary
      if (currProject.archive) {
        res.redirect("/archive/" + currProject.url);
        return;
      }

      res.render("project", {
        projects,
        currProject,
        title: currProject.title + " | Emily Nguyen",
        description: currProject.description,
        text: currProject.text,
        bg: currProject.bg
      });
      return;
    }
  }

  // Otherwise, show 404
  res.render("404", {
    title: "Page Not Found | Emily Nguyen"
  });
});

app.get("/archive/:project", function*(req, res) {
  var inputTitle = req.params.project;

  // Check if valid project url
  var projectArray = projects.projects;

  for (var i = 0; i < projectArray.length; i++) {
    var currProject = projectArray[i];

    // Render project page if input title matches a project
    if (inputTitle == currProject.url) {
      // Redirect to index if necessary
      if (!currProject.archive) {
        res.redirect("/" + currProject.url);
        return;
      }

      res.render("project", {
        projects,
        currProject,
        title: currProject.title + " | Emily Nguyen",
        description: currProject.description
      });
      return;
    }
  }

  // Otherwise, show 404
  res.render("404", {
    title: "Page Not Found | Emily Nguyen"
  });
});

var listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Express server started on port %s", listener.address().port);
});
