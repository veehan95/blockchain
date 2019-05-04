const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
var cors = require('cors')

const Chiccocoin = require('../middleware/chiccocoin')
const _json = require('../defaultMed.json')

const responseMiddleware = (req, res, next) => {
  return res.json(req.responseValue)
}
_json.med.forEach(med => Chiccocoin.mineDefault(med))
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Chicco Coin' })
})

router.use(cors());
router.post('/transactions/new', [
  check('sender', 'Sender must be a String').exists(),
  check('recipient', 'Sender must be a String').exists(),
  check('amount', 'Sender must be a Int Value').isInt().exists()
], Chiccocoin.newTransaction, responseMiddleware)

router.get('/mine', Chiccocoin.mine, responseMiddleware)

router.get('/chain', Chiccocoin.getChain, responseMiddleware)

router.get('/chain/viewAll', function (req, res, next) {
  res.render('chain/viewAll', { data: Chiccocoin.getChainData() })
})

router.get('/chain/new', function (req, res, next) { res.render('chain/new') })

router.post('/chain/create', Chiccocoin.mine)

router.get('/chain/approval', function (req, res, next) {
  res.render('chain/approve', { data:
    Chiccocoin.getChainData()
      .filter(data => data.medicine[0])
      .filter(data => data.medicine[0].Approval == 'false' || data.medicine[0].Approval == false)
  })
})

router.get('/chain/approvalAction/:id/:approval', function (req, res, next) {
  Chiccocoin.updateChain(req.params.id, {Approval: req.params.approval})
  res.redirect('/chain/approval')
})

router.post('/node/register', [
  check('node', 'Node must be a String').exists()
], Chiccocoin.addNode, responseMiddleware)

module.exports = router
