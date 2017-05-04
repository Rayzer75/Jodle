--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;



--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--




CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;

--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: fonctions; Type: TABLE; Schema: public; Owner: reignier
--

CREATE TABLE utilisateur (
    pseudo character varying(30) NOT NULL,
    mdp character varying(30) NOT NULL,
    telephone character varying(15) NOT NULL,
    nom character varying(30) NOT NULL,
    prenom character varying(30) NOT NULL,
    latitude Decimal,
    longitude Decimal
);

CREATE TABLE media(
    idMedia serial primary key,
    typeMedia character varying(10) NOT NULL,
    idEmetteur character varying(15) NOT NULL,
    idDestinataire character varying(15) NOT NULL,
    data text NOT NULL,
    timeout date NOT NULL
);

CREATE TABLE typeMedia (
    typeMedia character varying(10) PRIMARY KEY NOT NULL
);



-- ALTER TABLE fonctions OWNER TO hourliesss;



ALTER TABLE ONLY utilisateur
    ADD CONSTRAINT utilisateur_pk PRIMARY KEY (telephone);

ALTER TABLE ONLY media
      ADD CONSTRAINT emetteur_fk FOREIGN KEY (idEmetteur) REFERENCES utilisateur(telephone);

ALTER TABLE ONLY media
      ADD CONSTRAINT destinataire_fk FOREIGN KEY (idDestinataire) REFERENCES utilisateur(telephone);

ALTER TABLE ONLY media
      ADD CONSTRAINT type_media_fk FOREIGN KEY (typeMedia) REFERENCES typeMedia(typeMedia);

INSERT INTO typemedia VALUES('text');
INSERT INTO typemedia VALUES('audio');
INSERT INTO typemedia VALUES('image');
INSERT INTO typemedia VALUES('video');

--
-- PostgreSQL database dump complete
--


