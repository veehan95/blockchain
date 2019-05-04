const Blockchain = require('./blockchain')
const { validationResult } = require('express-validator/check')

class Chiccocoin {
  constructor () {
    this.blockchain = new Blockchain()
    this.getChain = this.getChain.bind(this)
    this.addNode = this.addNode.bind(this)
    this.mine = this.mine.bind(this)
    this.newTransaction = this.newTransaction.bind(this)
  }

  updateChain(id,val) {
    this.blockchain.updateChain(id,val)
  }

  getChain (req, res, next) {
    req.responseValue = {
      message: 'Get Chain',
      chain: this.blockchain.chain
    }
    return next()
  }
  getChainData (req, res, next) {
    return this.blockchain.chain
  }

  mine (req, res, next) {
    const lastBlock = this.blockchain.lastBlock()
    const lastProof = lastBlock.proof
    const proof = this.blockchain.proofOfWork(lastProof)

    // Create a new transaction with from 0 (this node) to our node (NODE_NAME) of 1 Chiccocoin
    this.blockchain.newTransaction(req.body)

    // Forge the new Block by adding it to the chain
    const previousHash = this.blockchain.hash(lastProof)
    const newBlock = this.blockchain.newBlock(proof, previousHash)

    res.redirect('/chain/viewAll')
  }

  mineDefault (data) {
    const lastBlock = this.blockchain.lastBlock()
    const lastProof = lastBlock.proof
    const proof = this.blockchain.proofOfWork(lastProof)
    this.blockchain.newTransaction(data)
    const previousHash = this.blockchain.hash(lastProof)
    const newBlock = this.blockchain.newBlock(proof, previousHash)
  }

  newTransaction (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }
    const trans = req.body
    const index = this.blockchain.newTransaction(trans['sender'], trans['recipient'], trans['amount'])
    const responseValue = {
      message: `Transaction will be added to Block ${index}`
    }
    req.responseValue = responseValue
    return next()
  }

  addNode (req, res, next) {
    const nodes = this.blockchain.registerNode(req.body.node)
    req.responseValue = {
      message: `New node have been added`,
      nodes: nodes
    }
    return next()
  }
}

module.exports = new Chiccocoin()
