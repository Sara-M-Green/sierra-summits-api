CREATE TABLE comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    peak_id INTEGER REFERENCES peaks_table(id) ON DELETE CASCADE NOT NULL,
    username TEXT NOT NULL,
    date_commented TIMESTAMPTZ DEFAULT now() NOT NULL,
    comment TEXT NOT NULL
);