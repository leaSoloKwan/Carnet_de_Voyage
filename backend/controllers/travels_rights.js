const status = require('http-status');
const has = require('has-keys');
const sqlite = require('sqlite3').verbose()

const db = new sqlite.Database(process.env.DB)

module.exports = {
    /* Obtention de la liste des voyages partagés à un utilisateur */
    async getSharedTravels(req, res){
        db.all('select t.*, right from travels t, rights r where r.id_travel = id and user_email = ? order by start desc', [req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    console.log(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                res.status(200).json(data)
            }
        )
    },
    /* Obtention d'un voyage partagé par son ID, si l'utilisateur possède les droits pour consulter ces données */
    async getSharedTravelById(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;

        // On renvoie les informations du voyage s'il existe pour l'utilisateur
        db.get('select t.*, right from travels t, rights r where id = ? and r.id_travel = id and user_email = ? order by start desc', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data)
                    res.status(200).json(data)        
                else
                    res.status(status.FORBIDDEN).json({message: 'The travel doesn\'t exist or you haven\'t the rights'})
            }
        )
    },
    /* Obtention de la liste des droits accordés pour ce voyage */
    async getRightsTravel(req, res) {
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;

        // On renvoie les informations sur les droits de partage accordés pour ce voyage s'il existe pour l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                if (data) {
                    db.all('select r.user_email, r.right from rights r where r.id_travel = ? order by r.user_email asc', [id],
                        (error, data) => {
                            if (error) {
                                console.debug(error)
                                res.status(500).send({ msg: 'ko' }); return
                            }
                            console.debug(data)
                            res.status(200).json(data)
                        }
                    )
                } else
                    res.status(status.FORBIDDEN).json({message: 'The travel doesn\'t exist or you haven\'t the rights'})
            }
        )
    },
    /* Partage d'un voyage avec un utilisateur */
    async shareTravel(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;
        if(!has(req.body, ['data']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the data in the body'};
        let data = JSON.parse(req.body['data']);
        if(!has(data, ['user_to_share', 'rights']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the user\'s email of the user with which you want to share this travel and the access\' rights (READER or WRITER)'};
        let { user_to_share, rights } = data;
        // On vérifie que les droits sont valides
        if(!["READER", "WRITER"].includes(rights))
            throw {code: status.BAD_REQUEST, message: 'You must specify valid access\' rights ("READER" or "WRITER")'};
        
        // On vérifie que le voyage appartient à l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data) {
                    // On vérifie que l'utilisateur à qui on va donner l'accès existe
                    db.get('select * from users where email = ?', [user_to_share],
                        (error, data) => {
                            if (error) {
                                console.debug(error)
                                res.status(500).send({ msg: 'ko2' }); return
                            }
                            console.debug(data)
                            if (data) {
                                // On vérifie que l'utilisateur n'a pas déjà des droits pour ce projet
                                db.get('select * from rights where id_travel = ? and user_email = ?', [id, user_to_share],
                                    (error, data) => {
                                        if (error) {
                                            console.debug(error)
                                            res.status(500).send({ msg: 'ko3' }); return
                                        }
                                        console.debug(data)
                                        if (!data) {
                                            // On crée les nouveaux droits d'accès
                                            db.run("INSERT into rights (right, id_travel, user_email) values (?, ?, ?) ", [rights, id, user_to_share],
                                                (error, data) => {
                                                    if (error) {
                                                        res.status(500).send({ erreur: JSON.stringify(error) }); return
                                                    }
                                                    res.status(201).send({ msg: 'ok' })
                                                }
                                            )
                                        } else
                                            res.status(status.FORBIDDEN).json({message: 'You have to modify the existing rights for this user and not create some new rights'})
                                    }
                                )
                            } else
                                res.status(status.NOT_FOUND).json({message: 'The user doesn\'t exist'})
                        }
                    )
                } else
                    res.status(status.FORBIDDEN).json({message: 'This travel doesn\'t exist or you haven\'t the rights to share this travel'})
            }
        )
    },
    /* Modification des droits d'accès d'un utilisateur pour un voyage */
    async modifyRightSharedTravel(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;
        if(!has(req.body, ['data']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the data in the body'};
        let data = JSON.parse(req.body['data']);
        if(!has(data, ['user_to_share', 'rights']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the user\'s email of the user with which you want to share this travel and the access\' rights (READER or WRITER)'};
        let { user_to_share, rights } = data;
        // On vérifie que les droits sont valides
        if(!["READER", "WRITER"].includes(rights))
            throw {code: status.BAD_REQUEST, message: 'You must specify valid access\' rights ("READER" or "WRITER")'};
        
        // On vérifie que le voyage appartient à l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data) {
                    // On vérifie que l'utilisateur a déjà des droits pour ce projet
                    db.get('select * from rights where id_travel = ? and user_email = ?', [id, user_to_share],
                        (error, data) => {
                            if (error) {
                                console.debug(error)
                                res.status(500).send({ msg: 'ko' }); return
                            }
                            console.debug(data)
                            if (data) {
                                // On modifie les droits d'accès existants
                                db.run("UPDATE rights SET right = ? where id_travel = ? and user_email = ?", [rights, id, user_to_share],
                                    (error, data) => {
                                        if (error) {
                                            res.status(500).send({ erreur: JSON.stringify(error) }); return
                                        }
                                        res.status(201).send({ msg: 'ok' })
                                    }
                                )
                            } else
                                res.status(status.FORBIDDEN).json({message: 'You can\'t modify the rights for this user if he haven\'t rights for this travel'})
                        }
                    )
                } else
                    res.status(status.FORBIDDEN).json({message: 'This travel doesn\'t exist or you haven\'t the rights to share this travel'})
            }
        )
    },
    /* Modification d'un voyage */
    async modifySharedTravel(req, res) {
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;

        // On recupere les informations sur le voyage
        if(!has(req.body, ['data']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the data in the body'};
        let data = JSON.parse(req.body['data']);
        if(!has(data, ['title', 'place', 'start', 'end']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the title, the place, the start datetime and the end datetime to create a travel'};
        let { title, place, start, end } = data;
        // On vérifie que les dates sont valides
        if (!(new Date(start).valueOf()) || !(new Date(end).valueOf()))
            throw {code: status.BAD_REQUEST, message: 'You must specify valid date (format YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)'};
        if (new Date(start) > new Date(end))
            throw {code: status.BAD_REQUEST, message: 'The start date need to be before the end date'};

        // On vérifie que l'utilisateur a déjà des droits pour ce projet
        db.get('select * from rights where id_travel = ? and user_email = ? and right = "WRITER"', [id, req.user],
            (error, data) => {
                if (error) {
                    res.status(500).send({ msg: 'ko' }); return
                }
                if (data) {
                    // On modifie le voyage
                    db.run("UPDATE travels SET (title, place, start, end) = (?, ?, ?, ?) where id = ?", [title, place, new Date(start), new Date(end), id],
                        (error, data) => {
                            if (error) {
                                console.debug(error)
                                res.status(500).send({ erreur: JSON.stringify(error) }); return
                            }
                            res.status(201).send({ msg: 'ok' })
                        }
                    )
                } else
                    res.status(status.FORBIDDEN).json({message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'})
            }
        )
    },
    /* Suppression des droits d'accès d'un utilisateur pour un voyage */
    async removeRightSharedTravel(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;
        if(!has(req.query, ['user_to_share']))
            throw {code: status.BAD_REQUEST, message: 'You must specify the user\'s email of the user with which you have share this travel'};
        let { user_to_share } = req.query;

        // On vérifie que le voyage appartient à l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data) {
                    // On supprime le partage
                    db.run("DELETE FROM rights where id_travel = ? and user_email = ?", [id, user_to_share],
                        (error, data) => {
                            if (error) {
                                res.status(500).send({ erreur: JSON.stringify(error) }); return
                            }
                            res.status(201).send({ msg: 'ok' })
                        }
                    )
                } else
                    res.status(status.FORBIDDEN).json({message: 'This travel doesn\'t exist or you haven\'t the rights for this operation'})
            }
        )
    },
}
