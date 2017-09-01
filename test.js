// const productBasename = require(__dirname + "/../../.env")["productPath"];
// const productPath = __dirname + "/../../" + productBasename;

class Mod {
  constructor(path, base) {
    // let productBasename;
    // let productPath;
    // const cp = require("child_process");
    this.productBasename =
      base || require(__dirname + "/../../.env")["productPath"];
    this.productPath =
      path || `${__dirname + "/../../" + this.productBasename}`;
  }

  //seeds the categories
  getCategories(callback) {
    const cp = require("child_process");
    let dirs = new Promise((resolve, reject) => {
      cp.exec(`ls ${this.productPath}`, (err, out, stdErr) => {
        //ignore all the .txt files
        //reject if empty or includes '.'
        const c = out.split("\n").filter(item => {
          return !(item.includes(".") || !item);
        });
        resolve(c);
      });
    })
      .then(data => {
        console.log(`dirs = ${data}`);
        callback(data);
        return data;
      })
      .catch(e => {
        throw e;
        callback();
      });
  }
}
module.exports = Mod;

let getUrls = async function() {
  const cp = require("child_process");
  const fs = require("fs");
  let productHash = {};
  const productBasename = require(__dirname + "/.env")["productPath"];
  const productPath = __dirname + "/" + productBasename;
  console.log(`productPath = ${productPath}`);
  let p = new Promise((resolve, reject) => {
    fs.readdir(productPath, (err, file) => {
      let folders = file.filter(f => {
        return !f.includes(".");
      });
      resolve(folders);
    });
    // cp.exec(`ls -R ${productPath}`, (err, out, stdErr) => {
    //   //grab all the categories
    //   console.log(`out = ${out}`);
    //   //store them all in a hash
    //   //return the hash for seeding
    //   let strArr = out.split("\n");
    //   const c = strArr.filter(item => {
    //     return !(item.includes(".") || !item || item.includes(":"));
    //   });
    //
    //   resolve(c);
    // });
  });
  await p;
  let promises;
  p.then(folders => {
    promises = folders.map(folder => {
      return new Promise(resolve => {
        fs.readdir(productPath, (err, file) => {
          let folders = file.filter(f => {
            return !f.includes(".");
          });
          resolve(folders);
        });
      });
    });
  });
  // Promise.all(promises).then(things => {
  //   return things;
  // });
  return promises;
};
// function resolveAfter2Seconds(x) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(x);
//     }, 2000);
//   });
// }
//
// async function add1(x) {
//   var a = resolveAfter2Seconds(20);
//   var b = resolveAfter2Seconds(30);
//   return x + (await a) + (await b);
// }
//
// add1(10).then(v => {
//   console.log(v); // prints 60 after 2 seconds.
// });

let c = ["armor", "helmets", "shields", "weapons"];
let p = [
  "DB-icon-armor-Nordic_Shield.png",
  "falkreath_shield.jpg",
  "shield.jpg",
  "steel_shield.jpg"
];

let results = getUrls();
Promise.all(results).then(things => {
  console.log(things);
});
// results.then(data => {
//   console.log(data);
//   console.log(`answer = ${c}\nresults[shields] = ${data}`);
//   //console.log(`answer = ${p}\nresults[shields] = ${data[2]}`);
// });

// [HoratioFox]: project_mimirs_market$ ls -R public/images
// armor       helmets     shields     weapons
// armor.txt   helmets.txt shields.txt weapons.txt
//
// public/images/armor:
// DB-icon-armor-Nordic_Carved_Armor.png
// DB-icon-armor-Nordic_Carved_Boots.png
// DB-icon-armor-Nordic_Carved_Gauntlets.png
// DB-icon-armor-Nordic_Carved_Helmet.png
//
// public/images/helmets:
// guard_helmet.jpg helmet.jpg
//
// public/images/shields:
// DB-icon-armor-Nordic_Shield.png shield.jpg
// falkreath_shield.jpg            steel_shield.jpg
//
// public/images/weapons:
// DB-icon-weapon-Nordic_Bow.png        DB-icon-weapon-Nordic_Sword.png
// DB-icon-weapon-Nordic_Dagger.png     DB-icon-weapon-Nordic_War_Axe.png
// DB-icon-weapon-Nordic_Greatsword.png dwarven_sword.jpg
// DB-icon-weapon-Nordic_Mace.png       war_axe.jpg
