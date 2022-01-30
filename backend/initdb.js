const sqlite = require('sqlite3').verbose()
require('mandatoryenv').load(['SECRET', 'DB'])
const db = new sqlite.Database(process.env.DB)
function dbExec (sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (error) => {
      if (error) { reject(error); return }
      resolve()
    })
  })
}
async function init () {
  // --- CREATION OF THE TABLES ---
  // user
  await dbExec(`create table if not exists users (
    email TEXT PRIMARY KEY,
    password TEXT, 
    firstname TEXT, 
    lastname TEXT, 
    birthdate DATE
    );`)
  // travels, activities and rights
  await dbExec(`create table if not exists travels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    place TEXT,
    start DATETIME,
    end DATETIME,
    owner TEXT,
    CONSTRAINT fk_travels_users FOREIGN KEY (owner) REFERENCES users(email) ON UPDATE CASCADE ON DELETE CASCADE
    );`)
  await dbExec(`create table if not exists rights (
    right TEXT CHECK (right IN('READER','WRITER')),
    id_travel INTEGER,
    user_email TEXT,
    PRIMARY KEY (id_travel, user_email),
    CONSTRAINT fk_rights_users FOREIGN KEY (user_email) REFERENCES users(email) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_rights_travels FOREIGN KEY (id_travel) REFERENCES travels(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`)
  await dbExec(`create table if not exists activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    type TEXT,
    place TEXT,
    start DATETIME,
    end DATETIME,
    id_travel INTEGER, 
    CONSTRAINT fk_activities_travels FOREIGN KEY (id_travel) REFERENCES travels(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`)

  // documents
  await dbExec(`create table if not exists travel_documents (
    path TEXT PRIMARY KEY,
    title TEXT,
    id_travel INTEGER,
    CONSTRAINT fk_documents_travels FOREIGN KEY (id_travel) REFERENCES travels(id) ON UPDATE CASCADE ON DELETE CASCADE
    );`)
  await dbExec(`create table if not exists activity_documents (
    path TEXT PRIMARY KEY,
    title TEXT,
    id_activity INTEGER,
    CONSTRAINT fk_documents_activities FOREIGN KEY (id_activity) REFERENCES activities(id) ON UPDATE CASCADE ON DELETE CASCADE
   );`)

  // --- INIT OF THE CONTENT OF THE TABLES ---
  // users
  await dbExec(`insert or ignore into users (email, password, firstname, lastname, birthdate) 
    values ('leask99@hotmail.fr', '123456', 'Lea', 'SOLO', '${new Date('1999/09/09')}');`)
  await dbExec(`insert or ignore into users (email, password, firstname, lastname, birthdate) 
    values ('houde.elina@orange.fr', '123soleil', 'Elina', 'HOUDE', '${new Date('2000/01/17')}');`)
  await dbExec(`insert or ignore into users (email, password, firstname, lastname, birthdate) 
    values ('user3@etu.fr', '12345678', 'FNuser3', 'LNuser3', '${new Date('1986/01/01')}');`)

  // travel 1 with two activities (shared for writing)
  await dbExec(`insert or ignore into travels (id, title, place, start, end, owner) 
    values ('1', 'Travel in Bresil', 'Rio de Janeiro', '${new Date('2021/06/30')}', '${new Date('2021/07/12')}', 'leask99@hotmail.fr');`)
  await dbExec(`insert or ignore into rights (right, id_travel, user_email) 
    values ('WRITER', '1', 'houde.elina@orange.fr');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('1','See the famous statue', 'Visit', 'Parc national de la Tijuaca', '${new Date('2021/06/31 11:30')}', '${new Date('2021/06/31 12:45')}', '1');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('2', 'Eat some food', 'Meals', 'Restaurante Marius Degustare', '${new Date('2021/07/10 12:30')}', '${new Date('2021/07/10 14:00')}', '1');`)

  // travel 2 with 0 activities
  await dbExec(`insert or ignore into travels (id, title, place, start, end, owner) 
    values ('2', 'Relax at home', 'Limoges', '${new Date('2020/04/29')}', '${new Date('2020/05/01')}', 'leask99@hotmail.fr');`)

  // travel 3 with 3 activities (shared for reading)
  await dbExec(`insert or ignore into travels (id, title, place, start, end, owner) 
    values ('3', 'Paris !!!!', 'Paris', '${new Date('2022/11/30')}', '${new Date('2022/12/12')}', 'houde.elina@orange.fr');`)
  await dbExec(`insert or ignore into rights (right, id_travel, user_email) 
    values ('READER', '3', 'leask99@hotmail.fr');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('3','See "la Joconde"', 'Visit', 'Musee du Louvre', '${new Date('2022/12/03 09:00')}', '${new Date('2022/12/03 12:15')}', '3');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('4','Hiking', 'Sport', 'Forêt de Fontainebleau', '${new Date('2022/12/10 08:30')}', '${new Date('2022/12/11 17:00')}', '3');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('5','Aircraft', 'Transports', 'Aeroport de Paris', '${new Date('2022/12/12 06:12')}', '${new Date('2022/12/12 06:12')}', '3');`)

  // travel 4 with two activities ( no shared)
  await dbExec(`insert or ignore into travels (id, title, place, start, end, owner) 
    values ('4', 'Travel in Mada', 'Faraf', '${new Date('2021/06/30')}', '${new Date('2021/07/12')}', 'leask99@hotmail.fr');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('6','Mamabe', 'Visit', 'Famille', '${new Date('2021/06/31 11:30')}', '${new Date('2021/06/31 12:45')}', '4');`)
  await dbExec(`insert or ignore into activities (id, name, type, place, start, end, id_travel) 
    values ('7', 'Eat some food', 'Meals', 'Restaurante Brousse', '${new Date('2021/07/10 12:30')}', '${new Date('2021/07/10 14:00')}', '4');`)

  // Some documents
  //await dbExec("insert or ignore into documents (title, path, owner) values ('Doc1', '/media/', 'SOLO', '09/09/1999', 'leask99@hotmail.fr');")
}
init()
