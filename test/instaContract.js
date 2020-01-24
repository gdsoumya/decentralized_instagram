const truffleAssert = require('truffle-assertions');

const InstaContract = artifacts.require("./InstaContract.sol");


contract("InstaContract", accounts => {
  it("should throw inactive error", async () => {
    const instaContract = await InstaContract.deployed();

    // Set value of 89
    try{
    	const res = await instaContract.getUser();
    	assert(2==1);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

  it("Admin should Match", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	//await instaContract.admin();
    	const admin = await instaContract.admin();
    	assert.equal(admin,accounts[0]);
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

 it("should activate contract", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.activate();
    	const state = await instaContract.state();
    	assert(state['words'][0]===0);
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should throw unauth error", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.activate({from: accounts[1]});
    	const state = await instaContract.state();
    	assert(2==1);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

  it("should throw no account error for mag.sender", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	const user = await instaContract.getUser();
    	assert(2==1);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

  it("should register user", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.regUser("gdsoumya");
    	const user = await instaContract.getUser();
    	assert(user['1']==='gdsoumya' && user['2']===accounts[0])
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should make new post, emit post and retrieve it", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	const result = await instaContract.post("hello","hello hash");
    	let id;
    	truffleAssert.eventEmitted(result, 'NewPost', (ev) => {
    		id=ev.id;
		    return ev.author === accounts[0] && ev.id.toNumber() === 1;
		});
    	const post = await instaContract.getPost(accounts[0],id);
    	assert(post['0']==="hello" && post['1']==="hello hash");
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should get all posts of particular user", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	const result = await instaContract.post("hello1","hello hash1");
    	const post = await instaContract.getAllPost(accounts[0]);
    	//console.log(post,post['0'].length);
    	assert(post['0'].length===post['1'].length && post['1'].length===3);
    	assert(post['0'][1]==="hello" && post['1'][1]==="hello hash");
    	assert(post['0'][2]==="hello1" && post['1'][2]==="hello hash1");
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should like post and emit event", async () => {
	const instaContract = await InstaContract.deployed();
	try{
		await instaContract.regUser("akash",{from:accounts[1]});
		const res = await instaContract.like(accounts[0],1);
		const res1 = await instaContract.like(accounts[0],1,{from:accounts[1]});
		truffleAssert.eventEmitted(res, 'NewLike', (ev) => {
		    return ev.src===accounts[0] && ev.author === accounts[0] && ev.id.toNumber() === 1;
		});
		truffleAssert.eventEmitted(res1, 'NewLike', (ev) => {
		    return ev.src===accounts[1] && ev.author === accounts[0] && ev.id.toNumber() === 1;
		});
		const post = await instaContract.getPost(accounts[0],1);
		// console.log(post,accounts[0],accounts[1])
		//console.log(post,post['0'].length);
		assert(post['0']==="hello" && post['1']==="hello hash" && post['2'].length===2 && post['2'][0]==accounts[0] && post['2'][1]==accounts[1]);
	}
	catch(e){
		console.log(e)
		assert(2==1)
	}
  });

  it("should throw no post error", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	const post = await instaContract.getPost(accounts[0],3);
    	assert(2==1);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

  it("should edit post", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.editTag(1,"new tag");
    	const post = await instaContract.getPost(accounts[0],1);
    	assert(post['0']==="new tag" && post['1']==="hello hash")
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should delete post", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.deletePost(1);
    	const post = await instaContract.getPost(accounts[0],1);
    	assert(1==2);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

  it("should follow user, emit event and retrieve following and follower list", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	const res1 = await instaContract.follow(accounts[1]);
    	truffleAssert.eventEmitted(res1, 'NewFollower', (ev) => {
		    return ev.src===accounts[0] && ev.target===accounts[1];
		});
    	const following = await instaContract.getFollowing(accounts[0]);
    	const followers = await instaContract.getFollowers(accounts[1]);
    	//console.log(following,followers,accounts[0],accounts[1]);
    	assert(following.length==followers.length && following.length==1);
    	assert(following[0]===accounts[1] && followers[0]===accounts[0]);
    }
    catch(e){
    	console.log(e)
    	assert(2==1)
    }
  });

  it("should throw no account error for target user", async () => {
    const instaContract = await InstaContract.deployed();
    try{
    	await instaContract.follow(accounts[3]);
    	assert(2==1);
    }
    catch(e){
    	//console.log(e)
    	assert(1==1)
    }
  });

});