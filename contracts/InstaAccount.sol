pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract InstaAccount{

	string public u_name;
	address public u_addr;
	address[] public followers;
	address[] public following;
	
	address admin;
	
	struct Post{
	    uint id;
	    string tag;
	    string hash;
	    address[] likes;
	}
	
	mapping(uint=>Post) posts;
	uint public p_count;
	
	modifier adminCheck(){
	    require(msg.sender==admin, 'UNAUTHORIZED');
	    _;
	}
	
	modifier hasPost(uint id){
	    require(bytes(posts[id].tag).length!=0 || bytes(posts[id].hash).length!=0, 'UNAUTHORIZED');
	    _;
	}
	
	constructor(string memory n, address a) public {
	    u_addr=a;
	    u_name=n;
	    admin=msg.sender;
	}
	
	function getDetails() public view adminCheck() returns(string memory){
	    return u_name;
	}
	
	function post(string memory tag, string memory hash) public adminCheck() returns(uint){
	    p_count+=1;
	    Post storage p = posts[p_count];
	    p.id=p_count;
	    p.tag=tag;
	    p.hash=hash;
	    return p.id;
	}
	
	function getPost(uint id) public view adminCheck() returns(string memory, string memory, address[] memory){
	    return (posts[id].tag,posts[id].hash,posts[id].likes);
	}
	
// 	function like(address addr, uint id) public adminCheck() hasPost(id){
// 	    posts[id].likes.push(addr);
// 	}

	function toggleLike(address addr, uint id) public adminCheck() hasPost(id){
		bool flag=false;
		address[] storage likes=posts[id].likes;
		for(uint x=0;x<likes.length;x++){
			if(likes[x]==addr)
				{flag=true;continue;}
			if(flag)
				likes[x-1]=posts[id].likes[x];
		}
		if(flag)
	        likes.length--;
	    else
	        likes.push(addr);
	}
	
	function editTag(uint id, string memory tag) public adminCheck() hasPost(id) {
	    posts[id].tag=tag;
	}
	
	function deletePost(uint id) public adminCheck() hasPost(id) {
	    delete posts[id];
	}
	
	function addfollower(address addr) public adminCheck(){
	    require(addr!=u_addr, 'CANNOT FOLLOW USERSELF');
	    followers.push(addr);
	}
	
	function remfollower(address addr) public adminCheck(){
		bool flag=false;
		for(uint x=0;x<followers.length;x++){
			if(followers[x]==addr)
				{flag=true;continue;}
			if(flag)
				followers[x-1]=followers[x];
		}
		if(flag)
		    followers.length--;
	}

	function remfollowing(address addr) public adminCheck(){
		bool flag=false;
		for(uint x=0;x<following.length;x++){
			if(following[x]==addr)
				{flag=true;continue;}
			if(flag)
				following[x-1]=following[x];
		}
		following.length--;
	}

	function getfollowers() public view adminCheck() returns(address[] memory){
	    return followers;
	}
	
	function addfollowing(address addr) public adminCheck() {
	    require(addr!=u_addr, 'CANNOT FOLLOW USERSELF');
	    following.push(addr);
	}
	
	function getfollowing() public view adminCheck() returns(address[] memory){
	    return following;
	}
	
	function getAllPost()public view adminCheck() returns(string[] memory, string[] memory){
	    string[] memory tag = new string[](p_count+1);
	    string[] memory hash = new string[](p_count+1);
	    for(uint id=p_count;id>0;--id){
	        if(bytes(posts[id].tag).length==0 && bytes(posts[id].hash).length==0)
	            continue;
	        tag[id] = posts[id].tag;
	        hash[id] = posts[id].hash;
	    }
	    return (tag, hash);
	}
}