const express = require('express');
const router = express.Router({mergeParams:true});
const activities = require('../controllers/activities.js');

//Affichage des activites
router.get('/', activities.getActivitiesByTravelId);
router.get('/:id_act',activities.getActivity);

//Modification activite
router.delete('/:id_act', activities.removeActivity);
router.put('/:id_act', activities.modifyActivity);
router.post('/', activities.newActivity);



module.exports = router;