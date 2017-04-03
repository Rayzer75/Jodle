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
    telephone character varying(15) NOT NULL,
    nom character varying(30) NOT NULL,
    prenom character varying(30) NOT NULL,
    position character
);

CREATE TABLE media(
    idMedia Integer NOT NULL,
    typeMedia character varying(30) NOT NULL,
    idEmetteur Integer NOT NULL,
    idDestinataire Integer NOT NULL, 
    timeout Integer)



ALTER TABLE fonctions OWNER TO hourliesss;



ALTER TABLE ONLY utilisateur
    ADD CONSTRAINT utilisateur_pk PRIMARY KEY (telephone);

ALTER TABLE ONLY media
    ADD CONSTRAINT media_pk PRIMARY KEY(idMedia);




--
-- PostgreSQL database dump complete
--


