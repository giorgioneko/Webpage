const { Jimp } = require('jimp');

async function main() {
    try {
        const image = await Jimp.read('9.jpg');

        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Use the top-left pixel as the background color
        const bgR = image.bitmap.data[0];
        const bgG = image.bitmap.data[1];
        const bgB = image.bitmap.data[2];

        const threshold = 55; // Tolerance

        const visited = new Uint8Array(width * height);
        const queue = [];

        // Start flood fill from the borders to catch all outer background
        // (Top and Bottom borders)
        for (let x = 0; x < width; x++) {
            queue.push({ x: x, y: 0 });
            queue.push({ x: x, y: height - 1 });
            visited[x] = 1;
            visited[(height - 1) * width + x] = 1;
        }
        // (Left and Right borders)
        for (let y = 0; y < height; y++) {
            if (visited[y * width] === 0) {
                queue.push({ x: 0, y: y });
                visited[y * width] = 1;
            }
            if (visited[y * width + (width - 1)] === 0) {
                queue.push({ x: width - 1, y: y });
                visited[y * width + (width - 1)] = 1;
            }
        }

        let head = 0;
        while (head < queue.length) {
            const { x, y } = queue[head++];
            const idx = (y * width + x) * 4;

            const r = image.bitmap.data[idx];
            const g = image.bitmap.data[idx + 1];
            const b = image.bitmap.data[idx + 2];

            const distance = Math.sqrt(
                Math.pow(r - bgR, 2) +
                Math.pow(g - bgG, 2) +
                Math.pow(b - bgB, 2)
            );

            if (distance < threshold) {
                // Set transparent
                image.bitmap.data[idx + 3] = 0;

                const neighbors = [
                    { x: x + 1, y: y },
                    { x: x - 1, y: y },
                    { x: x, y: y + 1 },
                    { x: x, y: y - 1 }
                ];

                for (const n of neighbors) {
                    if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
                        const nIdx = n.y * width + n.x;
                        if (visited[nIdx] === 0) {
                            visited[nIdx] = 1;
                            queue.push(n);
                        }
                    }
                }
            }
        }

        image.autocrop();

        await image.write('9_transparent.png');
        console.log('Successfully created solid flood-filled transparent cookie image.');
    } catch (err) {
        console.error('Error processing image:', err);
    }
}

main();
