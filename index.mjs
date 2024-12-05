import { readFileSync, writeFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const sourceBytes = readFileSync('./source/source-9-497-324.tiff.webp');

async function composite(pipelineName, pipe) {
    await mkdir('./output', { recursive: true })
    const obj = await pipe.raw().toBuffer({ resolveWithObject: true })

    const img = sharp({ create: { channels: 4, background: { r: 0xff, g: 0, b: 0xff }, width: obj.info.width, height: obj.info.width } })
    img.composite([{ input: obj.data, raw: { width: obj.info.width, height: obj.info.height, channels: obj.info.channels } }])
    await img.png().toFile(`./output/${pipelineName}.png`)

    const resizeUp = 8;
    const img4x = sharp({ create: { channels: 4, background: { r: 0xff, g: 0, b: 0xff }, width: obj.info.width * resizeUp, height: obj.info.width * resizeUp } })
    const buf4x = await sharp(Buffer.from(obj.data), { raw: { width: obj.info.width, height: obj.info.height, channels: obj.info.channels } }).resize({ width: resizeUp * obj.info.width, kernel: 'nearest' }).raw().toBuffer({ resolveWithObject: true })
    img4x.composite([{ input: buf4x.data, raw: { width: buf4x.info.width, height: buf4x.info.height, channels: buf4x.info.channels } }])
    await img4x.png().toFile(`./output/${pipelineName}@${resizeUp}.png`)
}

async function forceBackground(r,g,b) {
    console.time('buffer')
    const obj = await sharp(sourceBytes).raw().toBuffer({ resolveWithObject: true })
    for (let i = 0; i < obj.data.byteLength; i += 4) {
        const alpha = obj.data[i + 3];
        if (alpha == 0) {
            obj.data[i] = r;
            obj.data[i + 1] = g;
            obj.data[i + 2] = b;
            obj.data[i + 3] = 0xff
        };
    }
    console.timeEnd('buffer')
    const webpLossless = await sharp(Buffer.from(obj.data), { raw: { width: obj.info.width, height: obj.info.height, channels: obj.info.channels } }).webp({ lossless: true}).toBuffer()
    writeFileSync('./source/source-background.webp', webpLossless)
    return composite('background', sharp(webpLossless).resize({ width: 32 }))
}

await Promise.all([
    forceBackground(0xd1, 0xe7, 0xf5),

    // composite('32_shrink_false', sharp(sourceBytes).resize({ width: 32, fastShrinkOnLoad: false })),
    // composite('32_default', sharp(sourceBytes).resize({ width: 32 })),
    // composite('32_shrink_false_mitchell', sharp(sourceBytes).resize({ width: 32, fastShrinkOnLoad: false, kernel: 'mitchell' })),

]).catch(e => console.log(e));

