var express = require("express");
var exphbs = require("express-handlebars");
var hbs = require("handlebars");
var description =
  "Emily is a multidisciplinary designer and developer based in San Francisco. Currently at MongoDB and previously at Vox Media and Salesforce.";

hbs.registerHelper("ifCond", function (v1, operator, v2, options) {
  switch (operator) {
    case "==":
      return v1 == v2 ? options.fn(this) : options.inverse(this);
    case "===":
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    case "!=":
      return v1 != v2 ? options.fn(this) : options.inverse(this);
    case "!==":
      return v1 !== v2 ? options.fn(this) : options.inverse(this);
    case "<":
      return v1 < v2 ? options.fn(this) : options.inverse(this);
    case "<=":
      return v1 <= v2 ? options.fn(this) : options.inverse(this);
    case ">":
      return v1 > v2 ? options.fn(this) : options.inverse(this);
    case ">=":
      return v1 >= v2 ? options.fn(this) : options.inverse(this);
    case "&&":
      return v1 && v2 ? options.fn(this) : options.inverse(this);
    case "||":
      return v1 || v2 ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

hbs.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

hbs.registerHelper("if_eq", function (a, b, opts) {
  if (a == b) return opts.fn(this);
  else return opts.inverse(this);
});
hbs.registerHelper("if_not_eq", function (a, b, opts) {
  if (a != b) return opts.fn(this);
  else return opts.inverse(this);
});
hbs.registerHelper("if_mod", function (a, b, opts) {
  var index = opts.data.index;

  if (index % a === b) return opts.fn(this);
  else return opts.inverse(this);
});

hbs.registerHelper("get_darker", function (a, b, opts) {
  var color1 = a;
  var color2 = b;

  function getLightness(hex) {
    // If 3 digits, convert to 6
    if (hex.length === 4) {
      hex += hex.substring(1, 4);
    }

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    (r /= 255), (g /= 255), (b /= 255);
    var max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    var h,
      s,
      l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);

    var colorInHSL = "hsl(" + h + ", " + s + "%, " + l + "%)";

    return l;
  }

  // Return color with lower lightness
  return getLightness(color1) < getLightness(color2) ? color1 : color2;
});

hbs.registerHelper("lower_opacity", function (a, opts) {
  var color = a;

  function getRGBA(hex) {
    // If 3 digits, convert to 6
    if (hex.length === 4) {
      hex += hex.substring(1, 4);
    }

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    var a = 0.75;

    var rgba = "rgba(" + r + ", " + g + ", " + b + ", " + a + ")";
    return rgba;
  }

  return getRGBA(color);
});

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/src"));

var projects = require("./src/projects.json");
var dev = require("./src/data/dev.json");
var memes = require("./src/data/memes.json");

/*
app.get("/", function (req, res) {
  res.render("home", {
    title: "Emily Nguyen",
    url: "",
    path: "",
    description: description,
    noFooter: true,
    memes,
  });
});
*/
app.get("/", function (req, res) {
  // Filter out private and archived projects
  var gallery = [];
  var projectArray = projects.projects;
  gallery = projectArray;
  var i;
  /*
  for (i = 0; i < projectArray.length; i++) {
    if (!projectArray[i].archive && !projectArray[i].private) {
      gallery.push(projectArray[i]);
    }
  } */
  res.render("work", {
    showBio: true,
    gallery,
    dev,
    title: "Emily Nguyen",
    url: "",
    path: "",
    description: description,
    memes,
  });
});

/*
app.get("/dev", function (req, res) {
  res.render("dev", {
    dev,
    title: "Dev | Emily Nguyen",
    url: "dev",
    path: "dev",
    description: description,
    memes,
  });
});
*/

app.get("/about", function (req, res) {
  res.render("about", {
    title: "About | Emily Nguyen",
    url: "about",
    path: "about",
    description: description,
    memes,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    showBio: true,
    projects,
    title: "Contact | Emily Nguyen",
    url: "contact",
    path: "contact",
    description: description,
    memes,
  });
});

/*
app.get("/archive", function(req, res) {
  // Filter out private and unarchived projects
  var archive = [];
  var projectArray = projects.projects;
  var i;
  for (i = 0; i < projectArray.length; i++) {
    if (projectArray[i].archive && !projectArray[i].private) {
      archive.push(projectArray[i]);
    }
  }

  res.render("archive", {
    archive,
    title: "Archive | Emily Nguyen",
    url: "archive",
    description: ""
  });
});
*/
app.get("/resume", function (req, res) {
  res.redirect(
    "https://drive.google.com/file/d/0B6dEoGhrXuYId0g0Nm5BR1ZYbTg/view"
  );
});

app.get("/:project", function (req, res) {
  var inputTitle = req.params.project;

  var projectArray = projects.projects;
  // Remove hidden projects
  var visibleProjects = [];
  for (var i = 0; i < projectArray.length; i++) {
    if (!projectArray[i].hide && !projectArray[i].unlisted) {
      visibleProjects.push(projectArray[i]);
    }
  }
  projectArray = visibleProjects;

  // Check if valid project url
  for (var i = 0; i < projectArray.length; i++) {
    var currProject = projectArray[i];
    var prevProject =
      projectArray[(i + projectArray.length - 1) % projectArray.length];
    var nextProject = projectArray[(i + 1) % projectArray.length];

    // Render project page if input title matches a project
    if (inputTitle == currProject.url) {
      var path = currProject.dev ? "dev" : "design";
      res.render("project", {
        darkMode: true,
        projectPage: true,
        projects,
        currProject,
        prevProject,
        nextProject,
        title: currProject.title + " | Emily Nguyen",
        url: currProject.url,
        path: path,
        description: currProject.description,
        col1: "desk--one-half",
        col2: "desk--one-half",
        memes,
      });
      return;
    }
  }

  // Otherwise, show 404
  res.render("404", {
    title: "404 | Emily Nguyen",
    showBio: true,
    noHeader: true,
    noFooter: true,
  });
});

app.get("/*", function (req, res) {
  res.render("404", {
    title: "404 | Emily Nguyen",
    showBio: true,
    noHeader: true,
    noFooter: true,
  });
});

var listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Express server started on port %s", listener.address().port);
});
