import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import SortableTree from "react-sortable-tree"

class IndataTree extends Component {
  constructor (props) {
    super(props)
    this.state = {
      structuredUnitDataSet: this.populateIndataTree(this.props.unitDataSets)
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.unitDataSets !== prevProps.unitDataSets) {
      this.setState({structuredUnitDataSet: this.populateIndataTree(this.props.unitDataSets)})
    }
  }

  populateIndataTree = (dataSets) => {
    let unitDataSets = []
    dataSets.forEach((dataSet) => {
      let logrecs = []
      dataSet.node.unitDataStructure.logicalRecords.edges.forEach((recnode) => {
        let instanceVariables = []
        recnode.node.instanceVariables.edges.forEach(({node}) => instanceVariables.push(
          {title: node.name[0].languageText, subtitle: 'instans variable'}
        ))
        logrecs.push({
          expanded: true,
          title: recnode.node.description[0].languageText,
          children: instanceVariables,
          subtitle: 'logisk record'
        })
      })
      unitDataSets.push({
        expanded: true,
        //title: node.description[0].languageText,
        title: 'test',
        children: logrecs,
        subtitle: 'datasett'
      })
    })
    console.log('unitDataSets:')
    console.log(JSON.stringify(unitDataSets, null, 2))
    return unitDataSets
  }

  render () {
    const {structuredUnitDataSet} = this.state

    return (
      <Segment basic>
        <div style={{height: 1000, width: 2000}}>
          <SortableTree
            treeData={structuredUnitDataSet}
            onChange={treeData => this.setState({structuredUnitDataSet: treeData})}
          />
        </div>
      </Segment>
    )
  }
}

export default IndataTree
