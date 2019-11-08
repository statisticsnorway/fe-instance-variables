export function createColumn (header, accessor, width, showColumns) {
  return {Header: header,
    accessor: accessor,
    width: width,
    show: showColumn(showColumns, accessor)
  }
}

export function showColumn (showColumns, accessorName)  {
  let showCol = showColumns === undefined ? null : showColumns.find(col => col.name === accessorName)
  return showCol ? showCol.show : true
}
