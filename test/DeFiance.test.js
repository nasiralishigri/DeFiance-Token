var DeFiance = artifacts.require("./DeFiance.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('DeFiance',([deployer, investor1, user1, user2,user3,investor2, investor3]) => {
  beforeEach(async function(){
    this.name = "DeFiance";
     this.symbol = "DFN";
     this.decimals = 18;
     this.totalSupply = 100000 * (10 ** this.decimals); // 1 million tokens  * (uint256(10) ** decimals)

      this.token = await DeFiance.new(deployer);
  })

  it('initializes the contract with the correct values', function() {
    it('has the correct name', async function () {
        const name = await this.token.name();
        name.should.equal(this.name);
    });

    it('has the correct symbol', async function () {
        const symbol = await this.token.symbol();
        symbol.should.equal(this.symbol);
    });

    it('has the correct decimals', async function () {
        const decimals = await this.token.decimals();
        assert.equal(decimals.toString(), this.decimals.toString());
    });
    it('it has total supply', async function(){
        const totalSupply = await this.token.totalSupply();
        assert.equal(totalSupply.toString(), this.totalSupply.toString());

    })
  })

  it('allocates the initial supply upon deployment', async function() {
    
    
      var adminBalance= await this.token.balanceOf(deployer);
    
      assert.equal(adminBalance.toNumber(), this.totalSupply, 'it allocates the initial supply to the admin account');

  });

  it('transfers token ownership',async function() {
      // Test `require` statement first by transferring something larger than the sender's balance
       await this.token.transfer(investor1, 90000000000).should.be.rejectedWith('revert');
   
       await this.token.transfer(investor1, 25000, { from: deployer });
   
      const balance = await this.token.balanceOf(investor1);
   
      assert.equal(balance.toNumber(), 25000, 'adds the amount to the receiving account');
      const balance1 = await this.token.balanceOf(deployer);
    
      assert.equal(balance1.toNumber(), this.totalSupply -balance, 'deducts the amount from the sending account');
  });

  it('approves tokens for delegated transfer', async function() {
    
    //   await this.token.approve(accounts[1], 100);
    
      await this.token.approve(investor1, 100, { from: deployer });
      const allowance = await this.token.allowed(deployer,investor1);
    
      assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
  });

  it('handles delegated token transfers', async function() {

   const fromAccount = investor1 ;
    const toAccount = user1;
    const  spendingAccount = user2;
    // Transfer some tokens to fromAccount
    await this.token.transfer(fromAccount, 100, { from: deployer });
    // Approve spendingAccount to spend 10 tokens form fromAccount
    await this.token.approve(spendingAccount, 10, { from: fromAccount });
    // Try transferring something larger than the sender's balance
    await this.token.transferFrom(fromAccount, toAccount, 9999, { from: spendingAccount }).should.be.rejectedWith('revert');
  
    // Try transferring something larger than the approved amount
    await this.token.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount }).should.be.rejectedWith('revert');
 
    // await this.token.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
    await this.token.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });
 
    const balance = await this.token.balanceOf(fromAccount);
    assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');

    const balance1 = await this.token.balanceOf(toAccount);
    assert.equal(balance1.toNumber(), 10, 'adds the amount from the receiving account');

    var allowance = await this.token.allowance(fromAccount, spendingAccount);
    assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
  });

//   })
// })
});