var tableDefinitions = appRequire('app/db/table-definitions')
var tableStructures = appRequire('app/db/table-structures')

describe('tableDefinitions', function () {
  it('number of tables definitions exposed should match tableStructures.COUNT_OF_TABLES', function () {
    var numberOfExposedTables = 0
    for (var key in tableDefinitions) {
      if (tableDefinitions.hasOwnProperty(key)) {
        numberOfExposedTables++
      }
    }
    tableStructures.COUNT_OF_TABLES.should.equal(numberOfExposedTables)
  })

  it('should expose right tables', function () {
    for (var key in tableStructures) {
      if (tableStructures.hasOwnProperty(key) && /_TABLE$/.test(key)) {
        tableDefinitions.should.has.property(tableStructures[key])
      }
    }
  })
})
