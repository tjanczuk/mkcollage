const { statSync, writeFileSync, createWriteStream } = require("fs");
const createContactSheetCollage = require("./template/contactsheet");
const { createManifest, filterManifest } = require("./manifest");
const { join } = require("path");

const getFullPath = (path) =>
  path[0] === "/" ? path : join(process.cwd(), path);

module.exports = (manifestFileOrImageDirectory, options) => {
  // Read or create the manifest file
  const fullManifestFileOrImageDirectory = getFullPath(
    manifestFileOrImageDirectory
  );
  const stats = statSync(fullManifestFileOrImageDirectory);
  const manifest = stats.isFile()
    ? filterManifest(require(fullManifestFileOrImageDirectory), options)
    : createManifest(fullManifestFileOrImageDirectory, options);

  if (options.manifestFile) {
    // Write out the manifest file and exit
    writeFileSync(
      getFullPath(options.manifestFile),
      JSON.stringify(manifest, null, 2)
    );
    console.log(
      `${options.manifestFile} created with ${manifest.length} images.`
    );
    return;
  }

  // Create and write out the collage HTML file
  const output = createWriteStream(getFullPath(options.output));
  createContactSheetCollage(manifest, options, output);
  output.close();
  console.log(
    `${options.output} file created with ${manifest.length} images. Open it in the browser to view the collage and export it as an image.`
  );
};
