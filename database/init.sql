-- Create a table to store pastes
CREATE TABLE pastes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP
);

-- Create a function to generate a random six-digit alphanumeric string
CREATE OR REPLACE FUNCTION generate_random_string(length INT)
RETURNS TEXT AS $$
DECLARE
    characters TEXT;
    random_string TEXT := '';
    i INT := 1;
BEGIN
    characters := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    WHILE i <= length LOOP
        random_string := random_string || substr(characters, floor(random() * length(characters) + 1)::int, 1);
        i := i + 1;
    END LOOP;
    
    RETURN random_string;
END;
$$ LANGUAGE plpgsql;

-- Set default value for ID column using the generate_random_string function
ALTER TABLE pastes
ALTER COLUMN id SET DEFAULT generate_random_string(6);
