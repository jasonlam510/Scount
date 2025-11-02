// Platform-specific PowerSync imports
import { Platform } from 'react-native';
let column: any, Schema: any, Table: any;
if (Platform.OS === 'web') {
  ({ column, Schema, Table } = require('@powersync/web'));
} else {
  ({ column, Schema, Table } = require('@powersync/react-native'));
}

const profiles = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    name: column.text,
    avatar: column.text
  },
  { indexes: {} }
);

const participants = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    display_name: column.text,
    group_id: column.text,
    user_id: column.text
  },
  { indexes: {} }
);

const groups = new Table(
  {
    // id column (text) is automatically included
    group_id: column.text,
    created_at: column.text,
    title: column.text,
    icon: column.text,
    currency: column.text,
    is_deleted: column.integer,
    updated_at: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  profiles,
  participants,
  groups
});

export type Database = (typeof AppSchema)['types'];
