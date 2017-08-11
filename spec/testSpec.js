//absolutely horrible

const Mod = require("./../test");
describe("Img Grabber:", () => {
  let mod;
  let c = ["armor", "", "helmets", "shields", "weapons"];
  let productBasename = require(__dirname + "/../.env")["productPath"];
  let productPath = `${__dirname + "/../" + productBasename}`;
  beforeEach(function() {
    mod = new Mod(productPath, productBasename);
  });
  it("correctly grabs the categories", () => {
    mod.getCategories(result => {
      let c = ["armor", "", "helmets", "shields", "weapons"];
      expect(result).toEqual(c);
      done();
    });

    // expect(
    //   mod.getCategories(() => {
    //     done();
    //   })
    // ).toEqual(c);
  });
});
