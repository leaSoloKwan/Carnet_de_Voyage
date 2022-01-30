const express = require('express');
const router = express.Router();
const travels = require('../controllers/travels.js');
const travels_rights = require('../controllers/travels_rights.js');

// Affichage des voyages
router.get('/', travels.getTravels);
router.get('/shared', travels_rights.getSharedTravels);
router.get('/:id', travels.getTravelById);
router.get('/:id/shared', travels_rights.getSharedTravelById);

// Création, modification et suppression des voyages
router.post('/', travels.newTravel);
router.put('/:id', travels.modifyTravel);
router.put('/:id/shared', travels_rights.modifySharedTravel);
router.delete('/:id', travels.removeTravel);

// Gestion des droits de partage des voyages
router.get('/:id/share', travels_rights.getRightsTravel);
router.post('/:id/share', travels_rights.shareTravel);
router.put('/:id/share', travels_rights.modifyRightSharedTravel);
router.delete('/:id/share', travels_rights.removeRightSharedTravel);

module.exports = router;