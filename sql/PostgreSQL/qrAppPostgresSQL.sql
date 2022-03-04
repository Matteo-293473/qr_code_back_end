-- creazione database
-- CREATE DATABASE qrApp;


-- creazione delle tabelle
-- PostgreSQL -----------------------------------------------
CREATE TABLE dispositivo(
    id_device varchar(30) primary key
    
);

CREATE TABLE lettura(
    id_device varchar(30),
    orario_entrata timestamp default now(),
    orario_uscita timestamp default now(),
    quantita int,
    qrInfo varchar(200),
    foreign key (id_device) references dispostivo(id_device),
    primary key (id_device,orario_entrata)
);

-------------------------------------------------------------