CREATE DATABASE bd2;
\c bd2;

CREATE UNLOGGED TABLE memoria (id SERIAL PRIMARY KEY, num INT);
CREATE TABLE log (operacao TEXT, id_tabela_memoria INT, num INT);

CREATE OR REPLACE FUNCTION atualiza_log()
RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num)
        VALUES ('INSERT', NEW.id, NEW.num);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num)
        VALUES ('UPDATE', NEW.id, NEW.num);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num)
        VALUES ('DELETE', OLD.id, OLD.num);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualiza_log
AFTER INSERT OR UPDATE OR DELETE ON memoria
FOR EACH ROW
EXECUTE FUNCTION atualiza_log();

BEGIN;
INSERT INTO memoria (num) VALUES (123), (111), (12), (234), (38), (642);
UPDATE memoria SET num = num+62 WHERE num < 100;
END;

INSERT INTO memoria (num) VALUES (321), (76), (879), (15), (21), (999);

DELETE from memoria WHERE num = 111;

BEGIN;
INSERT INTO memoria (num) VALUES (13), (14);
DELETE FROM memoria WHERE num <= 16;

