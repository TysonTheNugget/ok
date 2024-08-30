export function drawSprite(ctx, img, frameX, canvasX, canvasY, flipH) {
    ctx.save();

    if (flipH) {
        ctx.scale(-1, 1);
        ctx.drawImage(img, frameX * 32, 0, 32, 32, -canvasX - 128, canvasY, 128, 128);
    } else {
        ctx.drawImage(img, frameX * 32, 0, 32, 32, canvasX, canvasY, 128, 128);
    }

    ctx.restore();
}
