import CytoscapeComponent from "react-cytoscapejs"

function FSMGraph({transitions}){

  const elements = []

  Object.entries(transitions).forEach(([s,t])=>{
    elements.push({data:{id:s,label:s}})
    elements.push({data:{source:s,target:t}})
  })

  return(

    <div style={{height:"400px"}}>

<CytoscapeComponent
  elements={elements}
  layout={{ name: "circle" }}
  style={{ width: "500px", height: "400px" }}

  stylesheet={[
    {
      selector: "node",
      style: {
        label: "data(label)",
        "background-color": "#00FFD1",
        color: "#000419",
        "font-size": "16px",
        "text-valign": "center",
        "text-halign": "center"
      }
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#94a3b8",
        "target-arrow-color": "#94a3b8",
        "target-arrow-shape": "cricle"
      }
    }
  ]}
/>

    </div>

  )

}

export default FSMGraph