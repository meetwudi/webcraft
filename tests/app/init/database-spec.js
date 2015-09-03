var database = appRequire('app/init/database')

describe('Database initialization', function () {
  it('should have bookshelf property', function () {
    database.should.have.property('bookshelf')
    database.bookshelf.should.have.property('Model')
  })
})
