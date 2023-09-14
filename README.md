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

## 
