const fs = require('fs');
const html = fs.readFileSync('requerimientos.html', 'utf-8');

// Extract images
let imgCount = 0;
const htmlWithoutImages = html.replace(/<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"[^>]*>/g, (match, ext, base64) => {
    imgCount++;
    const filename = `requerimiento_img_${imgCount}.${ext}`;
    fs.writeFileSync(filename, Buffer.from(base64, 'base64'));
    return `\n[IMAGEN: ${filename}]\n`;
});

// Convert <p> and <br /> to newlines
let text = htmlWithoutImages
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<[^>]+>/g, '');

fs.writeFileSync('requerimientos.md', text);
console.log(`Extracted ${imgCount} images and saved text to requerimientos.md`);
