pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './InstaAccount.sol';

contract InstaContract{
		
	mapping(address => address) accounts;
	mapping(string => address) public userMap;
    
    string[] username;

    address public admin;

    enum STATE{
        ACTIVE, INACTIVE
    }
    
    STATE public state;

    event NewPost( address indexed author, uint id);
    event NewLike( address src, address indexed author, uint id);
    event NewFollower( address src, address indexed target);

    modifier hasAcc(){
        require(accounts[msg.sender]!=address(0), "no account");
        _;
    }
    
    modifier adminOnly(){
        require(msg.sender==admin, 'UNAUTHORIZED');
        _;
    }
    
    modifier activeOnly(){
        //require(state==STATE.ACTIVE, 'CONTRACT INACTIVE');
        _;
    }
    
    constructor() public{
        admin = msg.sender;
        state=STATE.INACTIVE;
    }
    
    function activate() external adminOnly(){
        state=STATE.ACTIVE;
    }
    
    function deactivate() external adminOnly(){
        state=STATE.INACTIVE;
    }
    
    function getUsers() external view activeOnly() hasAcc() returns(string[] memory){
        return username;
    }

    function regUser(string calldata uname) external activeOnly(){
        require(accounts[msg.sender]==address(0), "already exists");
        userMap[uname]=msg.sender;
        username.push(uname);
        InstaAccount acc =  new InstaAccount(uname, address(msg.sender));
        accounts[msg.sender] = address(acc);
    }
    
    function getUser(address addr) external view activeOnly() hasAcc() returns(address, string memory, address){
    	address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
        return (addr, acc.u_name(), acc.u_addr());
    }
    
    function post(string calldata tag, string calldata hash) external activeOnly() hasAcc() returns(uint){
        InstaAccount acc = InstaAccount(accounts[msg.sender]);
        emit NewPost(msg.sender,acc.post(tag,hash));
    }
    
    function getPost(address addr, uint id)external view activeOnly() hasAcc() returns(string memory, string memory, address[] memory){
        address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
        return acc.getPost(id);
    }
    
    function editTag(uint id, string calldata tag) external activeOnly() hasAcc() {
        InstaAccount acc = InstaAccount(accounts[msg.sender]);
	    acc.editTag(id, tag);
	}
	
	function deletePost(uint id) external activeOnly() hasAcc() {
	    InstaAccount acc = InstaAccount(accounts[msg.sender]);
	    acc.deletePost(id);
	}
    
//     function like(address addr, uint id) external activeOnly() hasAcc(){
//         address a = accounts[addr];
//         require(a!=address(0),'no account');
//         InstaAccount acc = InstaAccount(a);
// 	    acc.like(msg.sender,id);
// 	    emit NewLike(msg.sender, addr, id);
// 	}

    function toggleLike(address addr, uint id) external activeOnly() hasAcc(){
        address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
	    acc.toggleLike(msg.sender,id);
    }
    
    function follow(address addr) external activeOnly() hasAcc(){
	    address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount follow_acc = InstaAccount(a);
	    InstaAccount my_acc = InstaAccount(accounts[msg.sender]);
	    my_acc.addfollowing(addr);
	    follow_acc.addfollower(msg.sender);
	    emit NewFollower(msg.sender, addr);
	}
	
    function unFollow(address addr) external activeOnly() hasAcc(){
	    address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount follow_acc = InstaAccount(a);
	    InstaAccount my_acc = InstaAccount(accounts[msg.sender]);
	    my_acc.remfollowing(addr);
	    follow_acc.remfollower(msg.sender);
	}

	function getAllPost(address addr)external view activeOnly() hasAcc() returns(string[] memory, string[] memory){
	    address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
	    return acc.getAllPost();
	}
	
	function getFollowers(address addr)external view activeOnly() hasAcc() returns(address[] memory){
	    address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
	    return acc.getfollowers();
	}
	
	function getFollowing(address addr)external view activeOnly() hasAcc() returns(address[] memory){
	    address a = accounts[addr];
        require(a!=address(0),'no account');
        InstaAccount acc = InstaAccount(a);
	    return acc.getfollowing();
	}
}