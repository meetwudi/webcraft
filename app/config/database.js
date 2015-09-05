module.exports = {
  // meta data
  COUNT_OF_TABLES: 1,
  // users table
  USERS_TABLE: 'users',
  USERS_TABLE_COLUMNS: ['id', 'username', 'password'],
  // projects table
  PROJECTS_TABLE: 'projects',
  RROJECTS_TABLE_COLUMNS: ['id', 'name', 'user_id'],
  // docs table (documents)
  DOCS_TABLE: 'docs',
  DOCS_TABLE_COLUMNS: ['id', 'project_id', 'content', 'title']
}
