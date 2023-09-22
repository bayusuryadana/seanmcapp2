CREATE TABLE accounts (
    id bigint NOT NULL,
    alias character varying(100) NOT NULL,
    group_type int NOT NULL
);

CREATE TABLE people (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    day integer NOT NULL,
    month integer NOT NULL,
    CONSTRAINT people_day_check CHECK (((day > 0) AND (day <= 31))),
    CONSTRAINT people_month_check CHECK (((month > 0) AND (month <= 12)))
);

CREATE TABLE wallets (
    id SERIAL,
    date integer NOT NULL,
    name character varying(64) NOT NULL,
    category character varying(16) NOT NULL,
    currency character varying(4) NOT NULL,
    amount integer NOT NULL,
    done boolean NOT NULL,
    account varchar(20) NOT NULL
);

CREATE TABLE caches (
    feature character varying(128) NOT NULL PRIMARY KEY,
    account_id character varying(20) NOT NULL PRIMARY KEY,
    value character varying(40000) NOT NULL,
    expiry integer
);

CREATE TABLE stalls (
    id SERIAL,
    name character varying(100) NOT NULL,
    plus_code character varying(1000) NOT NULL,
    city_id integer NOT NULL,
    youtube_url character varying(2048) NOT NULL,
    gmaps_url character varying(2048) NOT NULL,
    latitude float,
    longitude float
);

CREATE TABLE cities (
    id integer primary key,
    name character varying (20) not null,
    latitude float,
    longitude float
);

CREATE TABLE stocks (
    id character varying(4) NOT NULL PRIMARY KEY,
    current_price integer,
    share float NOT NULL,
    liability integer NOT NULL,
    equity integer NOT NULL,
    net_profit_current_year integer NOT NULL,
    net_profit_previous_year integer NOT NULL,
    -----------------------------
    eip_best_buy integer,
    eip_rating character varying(3),
    eip_risks character varying(10)
);

CREATE TABLE stock_portfolios (
    id character varying(4) NOT NULL PRIMARY KEY,
    current_price integer,
    emp_avg_price integer,
    emp_current_lot integer,
    -----------------------------
    my_avg_price integer,
    my_current_lot integer
);

CREATE TABLE configurations (
    key character varying(8) NOT NULL PRIMARY KEY,
    value character varying(128) NOT NULL
);
