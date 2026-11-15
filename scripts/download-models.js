import fs from 'fs';
import path from 'path';

const models = [
  {
    name: 'earth.glb',
    url: 'https://solarsystem.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBaTBSIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7c1183d35fdc9e4b5143c8601376552b89b5d99f/Earth_1_12756.glb'
  },
  {
    name: 'moon.glb',
    url: 'https://solarsystem.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBcllRIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--7d626e5badbf2157a4fa43b9e891ab22ca767f3e/Moon_1_3474.glb'
  },
  {
    name: 'mars.glb',
    url: 'https://solarsystem.nasa.gov/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdEFRIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--9ddbf780bb3c564b8e561bb238a2f6713d445c42/Mars_1_6792.glb'
  },
  {
    name: 'apollo-lunar-module.glb',
    url: 'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/apollo-lunar-module/Apollo%20Lunar%20Module.glb'
  },
  {
    name: 'pioneer-10.glb',
    url: 'https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/pioneer-10/Pioneer%2010.glb'
  }
];

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function download() {
  for (const m of models) {
    const dest = path.join(publicDir, m.name);
    console.log(`Fetching ${m.name} from NASA...`);
    try {
      const res = await fetch(m.url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved ${m.name} (${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`);
    } catch (err) {
      console.error(`Failed ${m.name}:`, err.message);
    }
  }
}

download();
