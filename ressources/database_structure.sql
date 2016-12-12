#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: songs
#------------------------------------------------------------

CREATE TABLE songs(
        id         int (11) Auto_increment  NOT NULL ,
        name       Varchar (255) ,
        path       Varchar (255) ,
        id_albums  Int NOT NULL ,
        id_artists Int NOT NULL ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: albums
#------------------------------------------------------------

CREATE TABLE albums(
        id   int (11) Auto_increment  NOT NULL ,
        name Varchar (255) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: artists
#------------------------------------------------------------

CREATE TABLE artists(
        id   int (11) Auto_increment  NOT NULL ,
        name Varchar (255) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: genres
#------------------------------------------------------------

CREATE TABLE genres(
        id   int (11) Auto_increment  NOT NULL ,
        name Varchar (255) ,
        PRIMARY KEY (id )
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: genreAssociation
#------------------------------------------------------------

CREATE TABLE genreAssociation(
        id       Int NOT NULL ,
        id_songs Int NOT NULL ,
        PRIMARY KEY (id ,id_songs )
)ENGINE=InnoDB;

ALTER TABLE songs ADD CONSTRAINT FK_songs_id_albums FOREIGN KEY (id_albums) REFERENCES albums(id);
ALTER TABLE songs ADD CONSTRAINT FK_songs_id_artists FOREIGN KEY (id_artists) REFERENCES artists(id);
ALTER TABLE genreAssociation ADD CONSTRAINT FK_genreAssociation_id FOREIGN KEY (id) REFERENCES genres(id);
ALTER TABLE genreAssociation ADD CONSTRAINT FK_genreAssociation_id_songs FOREIGN KEY (id_songs) REFERENCES songs(id);

/*ALTER TABLE `songs` ADD CONSTRAINT `songs_id_albums_foreign`FOREIGN KEY (`id_albums`) REFERENCES `albums` (`id`)