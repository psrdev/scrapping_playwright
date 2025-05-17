const axios = require('axios');
const fs = require('fs');
const path = require('path');
const data = require('./visa.json');


// folder to save images
const folderPath = path.join(__dirname, 'visa-card-images');
// create folder if not exists
if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
}
// download images from data 
const downloadImage = async (url, filename) => {
    const filepath = path.join(folderPath, filename);
    const response = await axios({
        method: 'get',
        url,
        responseType: 'stream'
    });
    return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filepath);
        response.data.pipe(writer);
        writer.on('finish', () => {
            console.log(`Downloaded: ${filepath}`);
            resolve();
        });
        writer.on('error', reject);
    });
}

// download all images
(async () => {
    for (const item of data) {
        const url = item.imageUrl;
        const filename = path.basename(url);
        await downloadImage(url, filename);
    }
    const transformedData = data.map(item => {
        const url = item.imageUrl;
        const filename = path.basename(url);
        return {
            ...item,
            imageUrl: filename
        };
    });

    fs.writeFileSync(
        path.join(__dirname, 'visa_transformed.json'),
        JSON.stringify(transformedData, null, 2),
        'utf-8'
    );
    console.log('Transformed visa.json written to visa_transformed.json');

})();


