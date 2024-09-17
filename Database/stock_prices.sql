--
-- PostgreSQL database dump
--

-- Dumped from database version 17rc1
-- Dumped by pg_dump version 17rc1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: stock_prices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_prices (
    company_name character varying(50),
    stock_price numeric,
    price_time time without time zone,
    price_date date,
    volume bigint
);


ALTER TABLE public.stock_prices OWNER TO postgres;

--
-- Data for Name: stock_prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_prices (company_name, stock_price, price_time, price_date, volume) FROM stdin;
Tesla	950.30	15:30:00	2024-09-04	1800000
Ford	13.45	16:00:00	2024-09-04	1200000
GM	33.67	16:00:00	2024-09-04	950000
\.


--
-- PostgreSQL database dump complete
--

