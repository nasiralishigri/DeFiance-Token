pragma solidity ^0.5.0;

contract DeFiance {
    string  public name = "DeFiance";
    string  public symbol = "DFN";
    uint8 public decimals = 18;

    uint256 public totalSupply = 100000 * (uint256(10) ** decimals); // 1 million tokens

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(address _owner) public {
        balanceOf[msg.sender] = totalSupply;
        balanceOf[_owner] = totalSupply;
    }
event AddressIS(address _from);
    function transfer(address _to, uint256 _value) public returns (bool success) {
        emit AddressIS(msg.sender);
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        emit AddressIS(msg.sender);
        require(_value <= balanceOf[_from]);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

     /**
     * @dev Function to check the amount of tokens that an owner allowed to a spender.
     * @param owner address The address which owns the funds.
     * @param spender address The address which will spend the funds.
     * @return A uint256 specifying the amount of tokens still available for the spender.
     */
    function allowed(address owner, address spender) public view returns (uint256) {
        return allowance[owner][spender];
    }

}