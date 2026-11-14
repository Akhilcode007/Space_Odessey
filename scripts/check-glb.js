import fs from 'fs';
import path from 'path';

for (const file of ['earth.glb', 'moon.glb', 'mars.glb']) {
  const p = path.resolve('public', file);
  const buf = fs.readFileSync(p);
  // In GLB:
  // 0-11: header (magic 4, version 4, length 4)
  // 12-19: chunk 0 (chunkLength 4, chunkType 4: 0x4E4F534A JSON)
  const jsonChunkLen = buf.readUInt32LE(12);
  const jsonChunkType = buf.toString('utf8', 16, 20);
  const jsonText = buf.toString('utf8', 20, 20 + jsonChunkLen);
  const json = JSON.parse(jsonText);
  console.log(`\n=== ${file} ===`);
  console.log('Nodes:', json.nodes?.map(n => n.name));
  console.log('Meshes count:', json.meshes?.length);
  if (json.accessors) {
    const posAccessors = json.accessors.filter(a => a.type === 'VEC3' && a.min && a.max);
    if (posAccessors.length > 0) {
      console.log('Bounds min/max of first pos accessor:');
      console.log('  min:', posAccessors[0].min);
      console.log('  max:', posAccessors[0].max);
    }
  }
}
