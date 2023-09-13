const { readdirSync, readFileSync, statSync } = require("fs");
const exifParser = require("exif-parser");
const { join } = require("path");

const includeImage = (image, options) =>
  !!runInNewContext(options.filter, image);

const filterManifest = (manifest, options) =>
  options.filter
    ? manifest.filter((image) => includeImage(image, options))
    : manifest;

const createManifest = (directory, options) => {
  const sortProperties = options.sort.split(".");
  const getSortValue = (object) => {
    for (const property of sortProperties) {
      object = object[property];
      if (object === undefined) {
        return undefined;
      }
    }
    return object;
  };
  const fullDirectory =
    directory[0] === "/" ? directory : join(process.cwd(), directory);
  options.extensions = options.extensions.map((ext) => ext.toLowerCase());
  const files = readdirSync(fullDirectory, {
    encoding: "utf8",
    withFileTypes: true,
  })
    .filter((dirent, i) => {
      return (
        dirent.isFile() &&
        options.extensions.includes(dirent.name.split(".").pop().toLowerCase())
      );
    })
    .map((dirent) => ({
      name: dirent.name,
      fullName: join(fullDirectory, dirent.name),
      title: "",
      stat: statSync(join(fullDirectory, dirent.name)),
      exif:
        (dirent.name
          .split(".")
          .pop()
          .toLocaleLowerCase()
          .match(/^jpe?g$/) &&
          exifParser
            .create(readFileSync(join(fullDirectory, dirent.name)))
            .parse()) ||
        {},
    }))
    .filter((image) => !options.filter || includeImage(image, options))
    .sort((a, b) => {
      const aValue = getSortValue(a);
      const bValue = getSortValue(b);
      if (aValue === undefined) {
        return 1;
      }
      if (bValue === undefined) {
        return -1;
      }
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });
  // Normalize EXIF data for orientation
  files.forEach((file) => {
    if (file.exif.tags.Orientation === 6 || file.exif.tags.Orientation === 8) {
      const width = file.exif.imageSize.width;
      const height = file.exif.imageSize.height;
      file.exif.imageSize.width = height;
      file.exif.imageSize.height = width;
    }
  });
  return files;
};

module.exports = { createManifest, filterManifest };
