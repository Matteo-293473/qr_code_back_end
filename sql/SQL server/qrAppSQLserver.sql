-- creazione database
-- CREATE DATABASE qrApp;

-- creazione delle tabelle


-------------------------------------------------------------

/* CREATE TABLE persona(
    id_persona serial primary key
    
);

CREATE TABLE dispostivo(
    id_device varchar(30) primary key
    
);

CREATE TABLE lettura(
    id_persona int,
    orario_entrata timestamp default now(),
    orario_uscita timestamp default now(),
    quantita int,
    foreign key (id_persona) references persona(id_persona),
    primary key (id_persona,orario_entrata)
); */

------------------------------------------------------------- 
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
    foreign key (id_device) references dispostivo(id_device),
    primary key (id_device,orario_entrata)
);


------------------------------------------------------------- 