#!/usr/bin/env node
const { Command } = require("commander");
const photoCollage = require("./photocollage");
const program = new Command();

program
  .name("mkcollage")
  .version(require("../package.json").version)
  .description(
    "Create a photo collage. See https://github.com/tjanczuk/mkcollage for documentation."
  )
  .argument("<string>", "image directory or manifest file")
  .option(
    "-m, --manifestFile <string>",
    "create a manifest file from image directory without creating the collage"
  )
  .option("-w, --width <number>", "width of the collage in pixels", 1024)
  .option(
    "--minheight <number>",
    "minimum total height of the collage in pixels",
    0
  )
  .option(
    "--centercollage",
    "centers the collage rows if --minheight is specified; otherwise rows are distributed vertically"
  )
  .option(
    "-r, --maxRowHeight <number>",
    "maximum height in pixels of a single row of images in the collage",
    256
  )
  .option("-p, --padding <number>", "padding between images in pixels", 3)
  .option("-b, --border <number>", "border around collage in pixels", 0)
  .option(
    "-d, --description <string>",
    "add a description under an image with a JavaScript expression using image's metadata (including EXIF)"
  )
  .option(
    "-f, --font <string>",
    "font for the image descriptions (see https://developer.mozilla.org/en-US/docs/Web/CSS/font)",
    "caption"
  )
  .option(
    "--style <string>",
    "extra CSS styles to add to the top level element"
  )
  .option(
    "-e, --extensions <string...>",
    "list of image file extensions to include from the image directory",
    ["jpg", "png", "jpeg"]
  )
  .option(
    "-s, --sort <string>",
    "property to order images by (check generated metadata for available properties)",
    "stat.birthtime"
  )
  .option("--reverse", "reverse the sort order (default is ascending)")
  .option(
    "--filter <string>",
    "filter images with a JavaScript expression using image's metadata, including EXIF"
  )
  .option(
    "-o, --output <string>",
    "Collage HTML file name to create",
    "collage.html"
  )
  .action(photoCollage);

program.parse();
