-- creazione database
-- CREATE DATABASE qrApp;

-- creazione delle tabelle
-- SQL server -----------------------------------------------

CREATE TABLE dispositivo(
    id_device varchar(30) primary key
    
);

CREATE TABLE lettura(
    id_device varchar(30),
    orario_entrata DATETIME,
    orario_uscita DATETIME,
    quantita int,
    qrInfo varchar(200),
    foreign key (id_device) references dispositivo(id_device),
    primary key (id_device,orario_entrata)
);


------------------------------------------------------------- 