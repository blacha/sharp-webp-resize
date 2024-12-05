# fastShrinkOnLoad imagery artifacts

When greatly resizing image with `fastShrinkOnLoad:true` produces edge artifacts with sharp borders

given a source image 512x512 

![](./source/source-9-497-324.tiff.webp)

then resizing down to 32x32, then blowing the image back to 128x128 produces the following outputs:

![](./output/32_default@8.png)

Turning off fastShrinkOnLoad reduces the artifacts but introduces new ones

![](./output/32_shrink_false@8.png)

Switching to Mitchell kernel reduces the white of lanczos

![](./output/32_shrink_false_mitchell@8.png)

Filling in the background with a consistent color also fixes the shrink on load

![](./output/background@8.png)


### Usage


Install dependencies

```
npm install
```

generate the images

```
node index.mjs
```