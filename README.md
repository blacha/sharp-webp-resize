# fastShrinkOnLoad imagery artifacts

When greatly resizing images eg 512x512 down to 32x32 fastShrinkOnLoad produces edge artifacts with sharp borders

![](./output/32_default@8.png)

Turning off fastShrinkOnLoad reduces the artifacts but introduces new ones

![](./output/32_shrink_false@8.png)


Switching to Mitchell kernel reduces the white of lanczos

![](./output/32_shrink_false_mitchell@8.png)

Filling in the background with a consistent color also fixes the shrink on load

![](./output/background@8.png)