import sharp from "sharp";


export async function validate_creative_image(assetUrl: string): Promise<void>{
    const base64 = assetUrl.includes(",") ? assetUrl.split(",")[1] : assetUrl;
    const buffer = Buffer.from(base64, "base64");

    const metadata = await sharp(buffer).metadata();
    if(metadata.width !== 320 || metadata.height !== 480){
        throw new Error("Creative image must be 320 pixels wide and 480 pixels high")
    }
}