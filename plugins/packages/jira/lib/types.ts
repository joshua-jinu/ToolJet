export type QueryOptions = {
  resource?: string;
  properties?: any;
  account_id?: string;
  issue_key?: string;
  issue_keys?: string;
  project_key?: string;
  operation?: string;
  query?: string;
  start_at?: any;
  max_results?: any;

  expand?: string;

  session_id?: string;
  action_descriptor_id?: any;
  recommend?: boolean;

  delete_subtasks?: boolean;

  started_after?: any;
  started_before?: any;

  worklog_id?: any;
};

export type SourceOptions = {
  url: string;
  // auth_type: string;
  personal_token: string;
  email: string;
};
