import sharp from "sharp";

export async function create_test_image_data_url(
    width = 320,
    height = 480
): Promise<string> {
    const image = await sharp({
        create: {
            width,
            height,
            channels: 3,
            background: { r: 40, g: 120, b: 180 }
        }
    })
        .png()
        .toBuffer();

    return `data:image/png;base64,${image.toString("base64")}`;
}

export async function create_test_not_valid_image_data_url(
    width = 400,
    height =  500
): Promise<string> {
    const image = await sharp({
        create: {
            width,
            height,
            channels: 3,
            background: { r: 40, g: 120, b: 180 }
        }
    })
        .png()
        .toBuffer();

    return `data:image/png;base64,${image.toString("base64")}`;
}