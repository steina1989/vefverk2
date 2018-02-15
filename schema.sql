CREATE TABLE vef_v2(
    id             SERIAL PRIMARY KEY,
    date           timestamp with time zone not null default current_timestamp,
    name           VARCHAR(100)  NOT NULL,
    email          VARCHAR(100)  NOT NULL,
    ssn            VARCHAR(50)   NOT NULL,
    count          INT           NOT NULL 
);