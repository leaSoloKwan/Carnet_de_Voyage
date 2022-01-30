// Backend dans un seul fichier avec authentification simplifiée
const express = require('express')
const bodyParser = require('body-parser')
const sqlite = require('sqlite3').verbose()
const tokenService = require('./services/token')
const session = require('express-session')
// Patches
const {inject, errorHandler} = require('express-custom-error');
inject(); // Patch express in order to use async / await syntax

// Récupère les paramètres présents dans .env et les mets dans process.env
require('mandatoryenv').load(['SECRET', 'DB'])
const DEBUG = process.env.DEBUG || false

if (!DEBUG) { console.debug = () => {} }
// Créer base de données avec un utilisateur défini dans .env
const db = new sqlite.Database(process.env.DB)
const app = express()
app
  .use(require('cookie-parser')())
  .use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: true }))
  // Permet le passage de paramètres en POST
  .use(bodyParser.urlencoded({ extended: true }))
  // Egalement en JSON
  .use(bodyParser.json())
  // Log toutes les requêtes pour aider au debug
  .use((req, res, next) => {
    console.debug(`${req.method} url:${req.url} req.query:${JSON.stringify(req.query)}` +
                ` / req.body:${JSON.stringify(req.body)} req.cookies:${JSON.stringify(req.cookies)}`)
    next()
  })
  // URL Associé au Login, retourne le Token du login si l'utilisateur s'identifie correctement
  .post('/login', (req, res) => {
    // Vérification de la correspondance du login et du mot de passe
    console.debug('Connection sur /login')
    console.debug(`${req.body.login} avec le mot de passe ${req.body.password}`)
    db.get('select email from users where email = ? and password = ?', [req.body.login, req.body.password],
      (error, data) => {
        if (error) {
          console.debug('Erreur', error)
          res.status(500).send('Erreur login'); return
        }
        if (data && data.email === req.body.login) {
          const token = tokenService.getToken(req.body.login, '', 'api')
          console.debug(`Acceptée avec le token ${token}`)
          res.status(202).send({ msg: 'ok', token }); return
        }
        res.status(403).send({ msg: 'ko' })
      }
    )
  })
  // Tous les accès à l'API doivent avoir un Token d'accès valide,
  // On utilise ici un middleware fait sur mesure qui vérifie le token
  // et l'utilisateur présent dans le Token est enregistré pour req.user pour les requêtes /api/xxx
  .use('/', (req, res, next) => {
    try {
      let payload
      if (!req.headers.authorization ||
          !(payload = tokenService.verifyAndGetPayload(req.headers.authorization)) ||
          !(payload = JSON.parse(payload)) || !(payload.scope) ||
          !(payload.scope.includes('api'))
      ) { res.status(403).send('Accès interdit'); return }
      JSON.parse(tokenService.verifyAndGetPayload(req.headers.authorization))
      req.user = payload.sub
      next()
    } catch {
      res.status(403).send('Accès interdit')
    }
  })

// Assign Routes
app.use('/', require('./routes/router.js'));

// Handle errors
app.use(errorHandler());

// Handle not valid route
app.use('*', (req, res) => {
  res
  .status(405)
  .json( {status: false, message: 'Endpoint Not Found'} );
})

module.exports = app
