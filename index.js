const fs = require('fs');
const sharp = require('sharp');

//removing old icons
if (fs.existsSync('./icons')) fs.rmSync('./icons', { recursive: true });
fs.mkdirSync('./icons');

let allColorSets = [];
const inputFiles = fs.readdirSync('./inputs');

for (let i = 0; i < inputFiles.length; i++) {
  const inputFile = inputFiles[i];

  const inputFileContent = JSON.parse(fs.readFileSync(`./inputs/${inputFile}`, { encoding: 'utf8' }));

  allColorSets.push(...inputFileContent)
}

//all white borders cuz why not
//allColorSets = allColorSets.map((colorSet) => `${colorSet.split('_')[0].slice(0, 6)}_FFFFFF`)

allColorSets = [...new Set(allColorSets.map(n => n.toUpperCase()).sort())]

//template svg
const iconTemplate = fs.readFileSync('./template.svg', 'utf8');

let allIconFiles = [];

allColorSets.forEach((colorSet) => {
  const iconFilled = iconTemplate.replaceAll("FILL", `#${colorSet.split('_')[0].slice(0, 6)}`).replaceAll("STROKE", `#${colorSet.split('_')[1].slice(0, 6)}`);
  const iconBuffer = Buffer.from(iconFilled, 'utf8');

  sharp(iconBuffer)
    .resize(120, 120)
    .png()
    .toFile(`./icons/${colorSet.split('_')[0].slice(0, 6)}_${colorSet.split('_')[1].slice(0, 6)}.png`, (err, info) => {
      if (err) throw err;
    });

    allIconFiles.push(`${colorSet.split('_')[0].slice(0, 6)}_${colorSet.split('_')[1].slice(0, 6)}`)
})

fs.writeFileSync('./allIconFiles.json', JSON.stringify(allIconFiles));