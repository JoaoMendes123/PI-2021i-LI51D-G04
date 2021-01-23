const { dbGroup,dbError, } = require("../COVIDA/resources");
const cov_db = require('../COVIDA/cov_db.js');
const { timeout } = require("frisby");
var testing_group;

/**Weird shit happening
 *  -async function giving me headache
 *  -help c:
*/
test('Gives back created Group',async ()=>{
    const group = await cov_db.createGroup("Group Name","Group Description", "/test")
    await expect(group).toStrictEqual(new dbGroup(0,"Group Name","Group Description",[]))
});
test('Returns an Error, no name found ',async ()=>{
    expect.assertions(1);
    try {
        await cov_db.createGroup("","Group Description", "/test")
    }catch (e){
        await expect(e).toEqual(new dbError(`No group name given`, 404));
    }
});
test("Returns error, no group found with given index",async ()=>{
    expect.assertions(1);
    try {
        await cov_db.deleteGroup(1, "/test")
    }catch (e){
        await expect(e).toEqual(new dbError(`There is no group with id: 1`,404));
    }
});
test("Removes previously added group, returns removed group",async ()=>{
    const group = await cov_db.deleteGroup(0, "/test")
    await expect(group).toStrict(new dbGroup(0,"Group Name","Group Description",[]))
});
test("Returns error, no group in DB",async ()=>{
    expect.assertions(1);
    try {
        await cov_db.deleteGroup(9999, "/test")
    }catch (e){
        await expect(e).toEqual(new dbError(`There are no groups in DB`,404));
    }
});


