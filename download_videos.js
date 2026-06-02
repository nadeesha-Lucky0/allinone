const https = require('https');
const fs = require('fs');
const path = require('path');

const videos = [
  {
    name: 'celebration.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-champagne-glasses-toast-at-a-celebration-42257-large.mp4'
  },
  {
    name: 'wedding.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-happy-wedding-couple-40994-large.mp4'
  },
  {
    name: 'birthday.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-party-crowd-with-confetti-and-lights-42250-large.mp4'
  },
  {
    name: 'corporate.mp4',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-people-in-a-corporate-business-environment-42284-large.mp4'
  }
];

const targetDir = path.join(__dirname, 'frontend', 'public');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(options, (response) => {
      // Handle redirects if any
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: status code ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded to ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Starting video downloads to public folder with User-Agent spoofing...');
  for (const video of videos) {
    const destPath = path.join(targetDir, video.name);
    try {
      await downloadFile(video.url, destPath);
    } catch (err) {
      console.error(`Error downloading ${video.name}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();
