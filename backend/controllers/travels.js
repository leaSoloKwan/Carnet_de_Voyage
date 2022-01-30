const status = require('http-status');
const has = require('has-keys');
const sqlite = require('sqlite3').verbose()

const db = new sqlite.Database(process.env.DB)

module.exports = {
    /* Obtention de la liste des voyages d'un utilisateur */
    async getTravels(req, res){
        db.all('select * from travels where owner = ? order by start desc', [req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                res.status(200).json(data)
            }
        )
    },
    /* Obtention d'un voyage par son ID, si l'utilisateur est le propriétaire du voyage */
    async getTravelById(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;

        // On renvoie les informations du voyage s'il existe
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data)
                    res.status(200).json(data)
                else
                    res.status(status.NOT_FOUND).json({message: 'The travel doesn\'t exist'})
            }
        )
    },
    /* Ajout d'un voyage */
    async newTravel(req, res) {
        // On recupere les informations sur le nouveau voyage
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

        db.run("INSERT into travels (title, place, start, end, owner) values (?, ?, ?, ?, ?) ", [title, place, new Date(start), new Date(end), req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ erreur: JSON.stringify(error) }); return
                }
                res.status(201).send({ msg: 'ok' })
            }
        )
    },
    /* Modification d'un voyage */
    async modifyTravel(req, res) {
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

        // On vérifie que le voyage appartient à l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
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
                    res.status(status.NOT_FOUND).json({message: 'The travel doesn\'t exist'})
            }
        )
    },
    /* Suppression d'un voyage, si l'utilisateur en est le propriétaire */
    async removeTravel(req, res){
        // On recupere l'id du voyage
        if(!has(req.params, 'id'))
            throw {code: status.BAD_REQUEST, message: 'You must specify the id of the travel'};
        let {id} = req.params;
        
        // On vérifie que le voyage appartient à l'utilisateur
        db.get('select * from travels where id = ? and owner = ?', [id, req.user],
            (error, data) => {
                if (error) {
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data) {
                    // On supprime le voyage
                    db.run("DELETE FROM travels where id = ? ", [id],
                        (error, data) => {
                            if (error) {
                                res.status(500).send({ erreur: JSON.stringify(error) }); return
                            }
                            res.status(201).send({ msg: 'ok' })
                        }
                    )              
                } else
                    res.status(status.FORBIDDEN).json({message: 'The travel doesn\'t exist or you haven\'t the rights to delete this travel'})
            }
        )
    },
}
