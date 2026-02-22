-- Create powersync publication (if missing) and event trigger to add new public tables to it.

DO $$
BEGIN
  CREATE PUBLICATION powersync FOR ALL TABLES;
EXCEPTION
  WHEN duplicate_object THEN
    NULL; -- publication already exists
END
$$;

CREATE OR REPLACE FUNCTION add_table_to_powersync_publication()
RETURNS event_trigger
LANGUAGE plpgsql
AS $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT object_identity
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag = 'CREATE TABLE'
      AND schema_name = 'public'
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION powersync ADD TABLE %s', r.object_identity);
    EXCEPTION
      WHEN duplicate_object THEN
        NULL; -- already in publication
    END;
  END LOOP;
END;
$$;

CREATE EVENT TRIGGER powersync_add_table_on_create
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE')
  EXECUTE FUNCTION add_table_to_powersync_publication();
