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

const group_members = new Table(
  {
    // id column (text) is automatically included
    member_id: column.text,
    group_id: column.text,
    user_id: column.text,
    display_name: column.text,
    status: column.text,
    join_method: column.text,
    invite_token: column.text,
    invite_expires_at: column.text,
    invited_at: column.text,
    joined_at: column.text,
    claimed_at: column.text,
    left_at: column.text,
    avatar_url: column.text,
    note: column.text,
    updated_at: column.text
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
  group_members,
  groups
});

export type Database = (typeof AppSchema)['types'];
