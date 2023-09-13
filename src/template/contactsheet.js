const { runInNewContext } = require("vm");
const { readFileSync } = require("fs");

const escapeHtml = (str) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const createDescription = (image, options) =>
  options.description
    ? `<div style="width: ${image.exif.imageSize.collageWidth};">${escapeHtml(
        runInNewContext(options.description, image) || ""
      )}</div>`
    : "";

const createImage = (image, isLastRow, options, output) =>
  output.write(`<div style="${
    isLastRow ? `margin-right: ${options.padding * 2}` : ""
  }">
      <img loading="eager" src="data:image/jpeg;base64,${readFileSync(
        image.fullName
      ).toString("base64")}" alt="${image.name}" style="width: ${
    image.exif.imageSize.collageWidth
  }; height: ${image.exif.imageSize.collageHeight}">
  ${createDescription(image, options)}</div>`);

const createRow = (rows, row, rowIndex, options, output) => {
  output.write(
    `<div style="padding: ${options.padding}; display: flex; ${
      rowIndex === rows.length - 1 ? "" : "justify-content: space-between;"
    } width: 100%" data-row="${rowIndex}">`
  );
  row.forEach((image) =>
    createImage(image, rowIndex === rows.length - 1, options, output)
  );
  output.write(`</div>`);
};

const createRows = (rows, options, output) =>
  rows.forEach((row, rowIndex) =>
    createRow(rows, row, rowIndex, options, output)
  );

function downloadCollage(imageType) {
  document.getElementById("controls").style.display = "none";
  document.getElementById("downloading").style.display = "block";
  setTimeout(() => {
    html2canvas(document.querySelector("#collage")).then((canvas) => {
      let canvasUrl = canvas.toDataURL(`image/${imageType}`);
      const createEl = document.createElement("a");
      createEl.href = canvasUrl;
      const width = document.getElementById("collage").offsetWidth;
      const height = document.getElementById("collage").offsetHeight;
      createEl.download = `collage-${width}x${height}`;
      createEl.click();
      createEl.remove();
      document.getElementById("controls").style.display = "block";
      document.getElementById("downloading").style.display = "none";
    });
  }, 10);
}

const createHtml = (rows, options, output) => {
  output.write(`<html>
<head>
    <title>Photo Collage</title>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script>
        ${downloadCollage.toString()}    
    </script>
</head>
<body style="font: caption; margin: 10">
    <p>Documentation: <a href="https://github.com/tjanczuk/mkcollage" target="_blank">https://github.com/tjanczuk/mkcollage</a></p>
    <div id="controls" style="display:none; height: 5rem">
        <span id="size"></span>
        <button onclick="downloadCollage('jpeg')">Download JPEG</button>
        <button onclick="downloadCollage('png')">Download PNG</button>
        <button onclick="downloadCollage('webp')">Download WEBP</button>
    </div>
    <div id="downloading" style="display:none; height: 5rem">Preparing download... This may take a while depending on the number and size of images in the collage.</div>
    <div id="loading" style="display:block; height: 5rem">Loading images...</div>
    <div id="collage" style="font: ${escapeHtml(options.font)}; width: ${
    options.width
  }; display: flex; flex-wrap: wrap; padding: ${options.padding};${
    options.style || ""
  }">`);
  createRows(rows, options, output);
  output.write(`</div>
    <script>
        document.getElementById("size").innerText = "Size: " + document.getElementById("collage").offsetWidth + "x" + document.getElementById("collage").offsetHeight;
        document.getElementById("controls").style.display = "block";
        document.getElementById("loading").style.display = "none";  
    </script>
</body>
</html>`);
};

const createCollage = (manifest, options, output) => {
  let startIndex = 0;
  let rowNumber = 0;
  let rows = [];
  while (startIndex < manifest.length) {
    // calculate how many images will fit in the next row
    let endIndex = startIndex;
    let pictureWidth = 0;
    let paddingWidth = 0;
    let rowWidth = 0;
    while (true) {
      pictureWidth = manifest
        .slice(startIndex, endIndex + 1)
        .reduce(
          (sum, image) =>
            sum +
            image.exif.imageSize.width *
              Math.min(1, options.maxRowHeight / image.exif.imageSize.height),
          0
        );
      paddingWidth = (endIndex - startIndex + 2) * options.padding * 2;
      rowWidth = pictureWidth + paddingWidth;
      if (rowWidth >= options.width || endIndex === manifest.length - 1) {
        break;
      }
      endIndex++;
    }
    // calculate the actual row height to fit selected images exactly within target collage width
    const scalingFactor = Math.min(
      1,
      (options.width - paddingWidth) / pictureWidth
    );
    const rowHeight = Math.round(options.maxRowHeight * scalingFactor);
    // annotate each image with its row height
    const row = manifest.slice(startIndex, endIndex + 1);
    row.forEach((image) => {
      image.exif.imageSize.collageHeight = rowHeight;
      image.exif.imageSize.collageWidth = Math.round(
        image.exif.imageSize.width *
          Math.min(1, rowHeight / image.exif.imageSize.height)
      );
      image.exif.imageSize.collageRow = rowNumber;
    });
    rows.push(row);
    // continue to next row
    startIndex = endIndex + 1;
    rowNumber++;
  }
  // generate html
  createHtml(rows, options, output);
};

module.exports = createCollage;
