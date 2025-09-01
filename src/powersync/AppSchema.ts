import { Platform } from 'react-native';

// Platform-specific PowerSync imports
let column: any, Schema: any, Table: any;
if (Platform.OS === 'web') {
  ({ column, Schema, Table } = require('@powersync/web'));
} else {
  ({ column, Schema, Table } = require('@powersync/react-native'));
}

// // Platform-specific getDevServer import
// let getDevServer = () => { /* no-op */ };
// if (Platform.OS !== 'web') {
//   getDevServer = require("react-native/Libraries/Core/Devtools/getDevServer");
// }

const profiles = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    email: column.text,
    name: column.text,
    nickname: column.text,
    avatar: column.text
  },
  { indexes: {} }
);

const participants = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    group_id: column.text,
    user_id: column.text,
    display_name: column.text
  },
  { indexes: {} }
);

const groups = new Table(
  {
    // id column (text) is automatically included
    created_at: column.text,
    title: column.text,
    icon: column.text,
    currency: column.text
  },
  { indexes: {} }
);

export const AppSchema = new Schema({
  profiles,
  participants,
  groups
});

export type Database = (typeof AppSchema)['types'];
