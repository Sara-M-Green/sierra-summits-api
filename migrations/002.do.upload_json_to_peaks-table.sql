COPY peaks_table(id, peakName, summit, start, mileage, quadMap, class, gain, loss, section, trailhead, latLong, overview, route, website, image)
FROM 'C:\Users\smg10\projects\sierra-summits-api\summit-sample.csv'
DELIMITER ','
CSV HEADER;