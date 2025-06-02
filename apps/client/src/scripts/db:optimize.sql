-- 1. Create a new table with minified field names and only needed columns
CREATE TABLE transfers_new AS
SELECT
    id         AS id,
    pid        AS pid,
    name       AS n,
    country    AS c,
    age        AS a,
    height     AS h,
    weight     AS w,
    season     AS s,
    week       AS wk,
    price      AS p,
    form       AS f,
    stamina    AS st,
    pace       AS pc,
    technique  AS tc,
    passing    AS ps,
    keeper     AS kp,
    defender   AS df,
    playmaker  AS pm,
    striker    AS sr,
    seller_id  AS si,
    buyer_id   AS bi,

    -- Computed / renamed columns
    (pace + technique + passing + keeper + defender + playmaker + striker) AS ss,
    (pace + striker + technique)                                           AS ass,
    (pace + defender)                                                      AS dss,
    (pace + defender + playmaker + technique + passing)                    AS mss,
    (pace + keeper)                                                        AS gss,
    (CAST(STRFTIME('%s', DATETIME(transfer_date || ' ' || transfer_time)) AS INTEGER) * 1000) AS tt

FROM transfers
WHERE buyer_id IS NOT NULL AND price IS NOT NULL AND price != 0;

-- 2. Drop the old table
DROP TABLE transfers;

-- 3. Rename new table
ALTER TABLE transfers_new RENAME TO transfers;

-- 4. Create a small version table with current timestamp in ms
DROP TABLE IF EXISTS version;
CREATE TABLE version (ts INTEGER);
INSERT INTO version (ts) VALUES (CAST(STRFTIME('%s', 'now') AS INTEGER) * 1000);

-- 5. SQLite performance optimizations
PRAGMA cache_size = 10000;
PRAGMA synchronous = NORMAL;
VACUUM;
