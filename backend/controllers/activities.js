const status = require('http-status');
const has = require('has-keys');
const sqlite = require('sqlite3').verbose()

require('mandatoryenv').load(['SECRET', 'DB'])
const db = new sqlite.Database(process.env.DB)

module.exports = {
   // fonction to know if user is the owner of the travel
   isOwner:  async function(req, id_travel){
       return new Promise((resolve, reject)=>{
        db.get('select owner from travels where id = ? and owner = ?',[id_travel, req.user],
             (error,data) => {
                if(error) {
                    reject('Error in isOwner'+error);
                }
                if(data && data.owner == req.user){
                    resolve(true);
                }else{
                    resolve(false);
                }
            }
        )
       })
    },
    // function to know if the travel is share with the user
    isShare:  async function(req, id_travel){
        return new Promise((resolve, reject)=>{
            db.get('select * from rights where user_email = ? and id_travel = ?',[req.user, id_travel],
                (error, data) => {
                    if (error) {
                        reject('Error in isShare'+error);
                    }
                    if (data) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            )
        })
     },
     //faire fonction droit reader / writer
     getRightsForTravel: async function(req, id_travel){
        
        return new Promise((resolve,reject)=>{
            db.get('select right from rights where user_email = ? and id_travel = ?',[req.user, id_travel],
            (error, data) => {
                if (error) {
                    reject('Error in getRightsForTravel'+error);
                }
                if (data && data.right == 'READER') {
                    resolve("READER");
                } else if(data && data.right == 'WRITER'){
                    resolve("WRITER");
                }else{
                    resolve("");
                }
            }
        )
        })
        
     },

    /* Obtention d'une activite par son ID, si l'utilisateur possède les droits pour consulter ces données */
    async getActivitiesByTravelId(req, res){
       // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id'};
        let {id} = req.params;
        
        
        if( ( await module.exports.isOwner(req,id) == true ) || (await module.exports.isShare(req,id) == true )){
            
            db.all('select * from activities where id_travel = ?',[id],
                (error, data) => {
                    if (error) {
                        console.debug(error)
                        res.status(500).send({ msg: 'ko' }); return
                    }
                    console.debug(data.length)
                    res.status(200).json(data)
                }
            
            )
        }else{
            res.status(status.FORBIDDEN).json({message: 'You haven\'t the rights to access at it or the travel doesn\'t exist'})
        }
       
    },
    
     /* récupère les infromations d'une activité précise*/
     async getActivity(req,res){
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travels'};
        if(!has(req.params, 'id_act'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the activities'};
        let {id} = req.params;
        let {id_act} = req.params;

        if( ( await module.exports.isOwner(req,id) == true ) || (await module.exports.isShare(req,id) == true )){
            
            db.get('select * from activities where id_travel = ? and id = ?',[id, id_act],
                (error, data) => {
                    if (error) {
                        console.debug(error)
                        res.status(500).send({ msg: 'ko' }); return
                    }
                    if ( data ) {
                        res.status(200).json(data)
                    }else{
                        res.status(status.NOT_FOUND).json({message: 'The activity or travel doesn\'t exist or the travel doesn\'t have activities'})
                    }
                }
            
            )
        }else{
            res.status(status.FORBIDDEN).json({message: 'You haven\'t the rights to access at it'})
        }
        
     },
     async removeActivity(req,res){
        //recupere id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travels'};
        if(!has(req.params, 'id_act'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the activities'};
        let {id} = req.params;
        let {id_act} = req.params;
        // check si activite existe et la personne qui fait la requête est le owner ou partage en ecriture
        if( (await module.exports.isOwner(req,id) == true) || ( await module.exports.getRightsForTravel(req,id) == "WRITER")){
            // verifie existence de activité
            db.get('select * from activities where id = ? ', [id_act],
                (error, data) => {
                    if (error) {
                        res.status(500).send({ msg: 'ko' }); return
                    }
                    if (data) {
                        // On modifie l'activité
                        db.run("DELETE FROM activities where id = ? ", [id_act],
                            (error, data) => {
                                if (error) {
                                    res.status(500).send({ erreur: JSON.stringify(error) }); return
                                }
                                res.status(201).send({ msg: 'ok' })
                            }
                        ) 
                    } else {
                        res.status(status.NOT_FOUND).json({message: 'The activity doesn\'t exist'})
                    }
                }
            )
            
        }else{
            res.status(status.FORBIDDEN).json({message: 'You haven\'t the rights to delete it'})
        }
     },
     async modifyActivity(req,res){
        // recupere id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travels'};
        let {id} = req.params;
        //recupere id de activite
        if(!has(req.params, 'id_act'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the activities'};
        let {id_act} = req.params;

        // récupere informations de l'activité
        if(!has(req.body, ['data']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the data in the body'};
        let data = JSON.parse(req.body['data']);
        if(!has(data, ['name', 'type', 'place', 'start', 'end']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the name, the type, the place, the start datetime, the end datetime to modify the activity'};
        let { name, type, place, start, end} = data;

        // On vérifie que les dates sont valides
        if (!(new Date(start).valueOf()) || !(new Date(end).valueOf()))
            throw {code: status.BAD_REQUEST, message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'};
        if (new Date(start) > new Date(end))
            throw {code: status.BAD_REQUEST, message: 'The start date need to be before the end date'};
        // check si activite existe et la personne qui fait la requête est le owner ou partage en ecriture
        if( (await module.exports.isOwner(req,id) == true) || ( await module.exports.getRightsForTravel(req,id) == "WRITER")){
            // verifie existence de activité
            db.get('select * from activities where id = ? ', [id_act],
                (error, data) => {
                    if (error) {
                        res.status(500).send({ msg: 'ko' }); return
                    }
                    if (data) {
                        // On modifie l'activité
                        db.run("UPDATE activities SET (name, type, place, start, end) = (?, ?, ?, ?, ?) where id = ?", [name, type, place, new Date(start), new Date(end), id_act],
                            (error, data) => {
                                if (error) {
                                    console.debug(error)
                                    res.status(500).send({ erreur: JSON.stringify(error) }); return
                                }
                                res.status(201).send({ msg: 'ok' })
                            }
                        )
                    } else {
                        res.status(status.NOT_FOUND).json({message: 'The activity doesn\'t exist'})
                    }
                }
            )
            
        }else{
            res.status(status.FORBIDDEN).json({message: 'You haven\'t the rights to modify it'})
        }
     },
     async newActivity(req,res){
         // recupere id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travels'};
        let {id} = req.params;

        // On recupere les informations sur la nouvelle activite
        if(!has(req.body, ['data']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the data in the body'};
        let data = JSON.parse(req.body['data']);
        if(!has(data, ['name', 'type', 'place', 'start', 'end']))
        throw {code: status.BAD_REQUEST, message: 'You must specify the name, the type, the place, the start datetime, the end datetime to create the activity'};
        let { name, type, place, start, end} = data;

        // On vérifie que les dates sont valides
        if (!(new Date(start).valueOf()) || !(new Date(end).valueOf()))
        throw {code: status.BAD_REQUEST, message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'};
        if (new Date(start) > new Date(end))
        throw {code: status.BAD_REQUEST, message: 'The start date need to be before the end date'};

         // check user qui fait la requête est le owner ou a partage en ecriture
        if( (await module.exports.isOwner(req,id) == true) || ( await module.exports.getRightsForTravel(req,id) == "WRITER")){
            db.run("INSERT into activities (name, type, place, start, end, id_travel) values (?, ?, ?, ?, ?, ?) ", [name, type, place, new Date(start), new Date(end), id],
                (error, data) => {
                    if (error) {
                        console.debug(error)
                        res.status(500).send({ erreur: JSON.stringify(error) }); return
                    }
                    res.status(201).send({ msg: 'ok' })
                }
            )
        }else{
            res.status(status.FORBIDDEN).json({message: 'You haven\'t the rights to add an activity at this travel'})
        }
     }

    
     

     
}
