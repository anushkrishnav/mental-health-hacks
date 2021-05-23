USE keyspace_xopan20270;

DROP TABLE IF EXISTS JournalEntry;
CREATE TABLE JournalEntry(
    id uuid PRIMARY KEY,
    userId text,
    entry text,
    mood text,
    date date
);

-- enum of [happy, sad, angry, anxious, imposter-syndrom]
-- colors:
-- happy: yellow
-- sad: blue
-- angry: red
-- anxious: purple
-- imposter-syndrom: black
