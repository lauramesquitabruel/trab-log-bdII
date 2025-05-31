CREATE DATABASE bd2;
\c bd2;

CREATE UNLOGGED TABLE memoria (id SERIAL PRIMARY KEY, num INT);
CREATE TABLE log (operacao TEXT, id_tabela_memoria INT, num INT, id_transacao INT);

CREATE OR REPLACE FUNCTION atualiza_log()
RETURNS trigger AS $$
DECLARE
    id_transacao_atual int;
BEGIN
    id_transacao_atual := txid_current();

    IF TG_OP = 'INSERT' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num, id_transacao)
        VALUES ('INSERT', NEW.id, NEW.num, id_transacao_atual);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num, id_transacao)
        VALUES ('UPDATE', NEW.id, NEW.num, id_transacao_atual);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO log (operacao, id_tabela_memoria, num, id_transacao)
        VALUES ('DELETE', OLD.id, OLD.num, id_transacao_atual);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualiza_log
AFTER INSERT OR UPDATE OR DELETE ON memoria
FOR EACH ROW
EXECUTE FUNCTION atualiza_log();

