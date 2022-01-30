const status = require('http-status');
const has = require('has-keys');
const sqlite = require('sqlite3').verbose()

require('mandatoryenv').load(['SECRET', 'DB'])
const db = new sqlite.Database(process.env.DB)

module.exports = {
    /* Obtention de la liste des utilisateurs */
    async getUsers(req, res){
        db.all('select * from users',
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
    /* Obtention des infos d'utilisateur par son ID  ( pour paramètre du compte donc doit être l'user connecté*/
    async getProfile(req, res) {
        // On renvoie les informations du users s'il existe et si c'est ses infos
        db.get('select * from users where email = ?', [req.user],
            (error, data) => {
                if (error) {
                    console.debug(error)
                    res.status(500).send({ msg: 'ko' }); return
                }
                console.debug(data)
                if (data)
                    res.status(200).json(data)
                else
                    res.status(status.NOT_FOUND).json({message: 'You\'re not allowed to access to the informations of this users OR the users doesn\'t exist.'})
            }
        )
    }   
}
