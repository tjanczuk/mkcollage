# mkcollage - create a contact sheet photo collage

You can use the *mkcollage* tool to create a contact sheet-style photo collage from photos on your disk. 

* Use image files from your local drive.
* Set the desired collage width and individual picture height. 
* Annotate images on the collage with custom descriptions or based on EXIF information in the image.
* Select images to include or order images based on image metadata, including EXIF information. 
* Export collage as PNG, JPEG, or WEBP.
* Support for very large collages and image numbers - create wall posters.
* Rich customization using CSS. 

The motivation for the tool was the desire to create a wall poster with the collage of the 500 best pictures I took during my recent [around-the-world travel](https://22.janczuk.org). I could not find a tool out there that did exactly what I wanted, and *mkcollage* is an attempt to fill this gap. 

![collage-1030x877](https://github.com/tjanczuk/mkcollage/assets/822369/bf411922-899b-462c-be0c-643a8bb4a82c)

## Quickstart

To create a simple collage from all the pictures in a directory on your disk using all the default settings, run the following: 

```bash
npx mkcollage {directory-with-pictures}
```

This will generate a *collage.html* file you need to open in the browser to preview the collage or download it in the JPEG, PNG, or WEBP formats: 

```bash
open collage.html
```

<img width="1075" alt="Default collage created by mkcollage" src="https://github.com/tjanczuk/mkcollage/assets/822369/3504eb03-f9bb-40fd-b989-228257967538">

Clicking the *Download JPEG/PNG/WEBP* buttons will generate the desired collage image and initiate its download to disk. 

**NOTE** This operation may take a moment depending on the number of images in the collage and their size. In extreme cases (500 images), the browser may show a "page unresponsive" message. It is OK to continue to wait for the page to complete. 

## Add image descriptions based on image file names

To add the name of the image file underneath each picture in the collage, generate the collage with:

```bash
npx mkcollage {directory-with-pictures} -d "name"
```

![collage-1030x366](https://github.com/tjanczuk/mkcollage/assets/822369/0c16c77a-f638-4f24-9b77-6db9d7c057e3)

## Add image descriptions based on EXIF metadata

You can create image descriptions using image metadata, including EXIF information. This is done by passing a JavaScript expression to the `-d` option which returns a string. The JavaScrpt expression can use image metadata that includes EXIF information from the image (the `this` property points to this object). For example, to create image descriptions based on the geographic coordinates where the picture was taken, you can create the collage with: 

```bash
npx mkcollage {directory-with-pictures} -d '`${Math.round(exif.tags.GPSLatitude * 1000) / 1000}, ${Math.round(exif.tags.GPSLongitude * 1000) / 1000}`'
```

![collage-1030x384](https://github.com/tjanczuk/mkcollage/assets/822369/56035ee1-0b3c-41f9-aef9-e133708e53ea)

In the example above some images did not have GPS coordinates in their EXIF metadata, and for those `NaN` is displayed. The presence of the EXIF metadata depends on many factors, including the camera that generated the image. You can construct more elaborate JavaScript expressions to provide a better fallback description if the metadata you are looking for is absent. 

To understand which EXIF properties are available in your specific images, you can tell *mkcollage* to only output image metadata without generating the actual collage - see next section. 

## Extract image metadata from images

You can ask *mkcollege* to extract image metadata from the directory of images instead of generating a collage. This is useful if you want to inspect what metadata is available in your images, including EXIF metadata, before generating a collage from those images. You can also manually edit the metadata before generating a collage to manually provide missing information or fix any issues. 

Running the following command will extract image metadata for all images in a directory without generating a collage, and save this metadata in the `metadata.json` file: 

```bash
npx mkcollage {directory-with-pictures} -m metadata.json
```

The `metadata.json` file contains a JSON array with objects representing metadata of individual images. You can view or edit this file in any text editor. 

After you have modified the `manifest.json` file, you can generate a collage from it by providing it as the first argument to *mkcollage* instead of the directory of images: 

```bash
npx mkcollage metadata.json
```

## Add custom image descriptions

You can add custom descriptions to images in your collage in three steps:

First, export the image metadata to the manifest.json file:

```bash
npx mkcollage {directory-with-images} -m metadata.json
```

Then, add a new property (e.g. `title` property) to every object in the manifest.json file using your usual text editor. 

Lastly, generate the collage from the manifest.json file indicating the image descriptions are to be taken from the property you added:

```bash
nxp mkcollage manifest.json -d "title"
```

## Control the size and layout of the collage

You can control the size and layour of the collage image and the layout of by providing three parameters:

* The width of the collage, specified with the `-w` option.
* The maximum height of a single row of images in the collage, specified with the `-r` option.
* The padding between images, specified with the `-p` option.

Based on these parameters, the width of the collage will be fixed, and the height will be set to accommodate all images. The actual height of every row of images in the collage will never exceed `-r`, but may be smaller depending on the actual sizes of the images placed in that row. 

```bash
npx mkcollage {directory-with-images} -r 100 -w 1000 -p 3
```
![collage-1006x308](https://github.com/tjanczuk/mkcollage/assets/822369/339d11ac-052d-46bc-b55d-ad6db5475427)

```bash
npx mkcollage {directory-with-images} -r 150 -w 800 -p 5
```
![collage-860x730](https://github.com/tjanczuk/mkcollage/assets/822369/84e6e292-d61a-44cc-b648-9845a10e68b3)

## Control the font of the image descriptions

You can customize the font used for image descriptions using the `-f` option. Provide it with any valid value of the [*font* CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/font), for example: 

```bash
npx mkcollage {directory-with-images} -d "name" -f 'italic bold 12px "Times New Roman"'
```

![collage-1030x304](https://github.com/tjanczuk/mkcollage/assets/822369/bf7fea74-3794-4aff-9bde-4a37084accc6)

## Advanced styling

You can control several aspects of the collage image by setting global CSS properties for the entire image using the `--style` option. 

For example, to set the background color to black and the description color to white, run the following: 

```bash
npx mkcollage {directory-with-images} -d "name" --style "background: black; color: white;"
```

![collage-1030x313](https://github.com/tjanczuk/mkcollage/assets/822369/5ae6d64c-47e2-438b-91c0-d6d707b78ff6)

## Selecting images to include 

You can select the images to include in the collage by providing a JavaScript expression that evaluates to true using the `--filter` option. The expression can use image metadata, including EXIF. 

To select only images taken with an iPhone: 

```bash
npx mkcollage {directory-with-images} --filter "exif.tags.Model.contains('iPhone')"
```

To select only images taken with F number greater than 14: 

```bash
npx mkcollage {directory-with-images} --filter "exif.tags.FNumber > 14"
```

To select only images taken south of the equator: 

```bash
npx mkcollage {directory-with-images} --filter "exif.tags.GPSLatitude < 0"
```

You get the idea.

## Sorting images

By default, images in the collage are sorted ascending using their creation date. You can change the property to sort images by using the `--s` option. 

For example, to sort the images using the GPS longitude, run:

```bash
npx mkcollage {directory-with-images} -s "exif.tags.GPSLongitude"
```

To reverse the order of the sort, specify the `--reverse` option. 

## Issues? Questions?

File new issues and ask questions [here](https://github.com/tjanczuk/mkcollage/issues).
