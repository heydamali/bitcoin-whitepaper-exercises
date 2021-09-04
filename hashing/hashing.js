"use strict";

var crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
var poem = [
	"The power of a gun can kill",
	"and the power of fire can burn",
	"the power of wind can chill",
	"and the power of a mind can learn",
	"the power of anger can rage",
	"inside until it tears u apart",
	"but the power of a smile",
	"especially yours can heal a frozen heart",
];

var Blockchain = {
	blocks: [],
};

// Genesis block
Blockchain.blocks.push({
	index: 0,
	hash: "000000",
	data: "",
	timestamp: Date.now(),
});

// Insert each line into blockchain
	poem.forEach((line, index) => Blockchain.blocks.push(createBlock(line, index)))

	console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

/********** HELPER FUNCTIONS ************/
/**
 * 
 * @param {String} text 
 * @param {Number} index 
 * @returns Object 
 */
function createBlock(text, index){
  const prevHash = Blockchain.blocks[index].hash
  const timestamp = Date.now();
	
  const block =  {
    index: index + 1, // Because we already pre-filled the genesis block at index 0
    prevHash: prevHash,
    data: text,
    timestamp: timestamp,
  }

	block.hash = blockHash(block)
  return block
}

/**
 * 
 * @param {Object} blockchain 
 * @returns Boolean
 */
function verifyChain(blockchain) {
	// hack for genesis block
	if(blockchain.blocks[0].hash !== "000000"){
		return false
	}

	// verify the rest of the blocks
  for(let i = 1; i < blockchain.blocks.length; i++){
    const validBlock = verifyBlock(blockchain.blocks[i], blockchain.blocks[i - 1].hash)
    if(!validBlock) {
      return false
    }
  }
	return true
}

/**
 * 
 * @param {Object} block 
 * @param {String} prevBlockHash 
 * @returns Boolean
 */
function verifyBlock(block, prevBlockHash){
	// to recompute hash, we need to exclude the block.hash prop to ensure the same object as used in createBlock
	const { hash, ...blockWithoutHashKey } = block
  const recomputedHash = blockHash(blockWithoutHashKey)

   if (block.index < 0 || !block.data || !block.prevHash || recomputedHash !==  block.hash || block.prevHash !== prevBlockHash){
    return false
  }

  return true
}

/**
 * 
 * @param {Object} block 
 * @returns String
 */
function blockHash(block) {
	return crypto.createHash("sha256").update(JSON.stringify(block)).digest("hex");
}
