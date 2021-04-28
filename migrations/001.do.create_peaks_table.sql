CREATE TABLE peaks_table (
    id INTEGER PRIMARY KEY NOT NULL,
    peakname TEXT NOT NULL,
    summit TEXT,
    start TEXT,
    mileage TEXT NOT NULL,
    quadmap TEXT,
    class TEXT NOT NULL,
    gain TEXT NOT NULL,
    loss TEXT,
    section TEXT,
    trailhead TEXT,
    latLong TEXT,
    overview TEXT,
    route TEXT,
    website TEXT,
    image TEXT
);

COPY peaks_table(id, peakName, summit, start, mileage, quadMap, class, gain, loss, section, trailhead, latLong, overview, route, website, image)
FROM 'C:\Users\smg10\projects\sierra-summits-api\summit-sample.csv'
DELIMITER ','
CSV HEADER; 

