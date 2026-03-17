import { useState } from "react"
import axios from "axios"
import FSMGraph from "./components/FSMGraph"
import Loader from "./components/Loader"
import DigitalBackground from "./components/DigitalBackground"

function App() {

  const [sequence,setSequence] = useState("")
  const [ff,setFF] = useState("JK")
  const [result,setResult] = useState(null)
  const [loading,setLoading] = useState(false)

  const generate = async () => {

    if(sequence.trim()===""){
      alert("Please enter a state sequence")
      return
    }

    try{

      const seq = sequence.trim().split(/\s+/).map(Number)

      setLoading(true)

      const res = await axios.post("http://localhost:5000/generate",{
        sequence: seq,
        ff_type: ff
      })

      setResult(res.data)

    }
    catch(error){

      console.error(error)
      alert("Error generating circuit")

    }
    finally{

      setLoading(false)

    }

  }

    return(

    <div className="min-h-screen bg-[#0A0F1F] text-white p-10">

    <DigitalBackground />

    {/* TITLE */}

    <div className="studio-header">
    <h1>COUNTER DESIGN AUTOMATION TOOL</h1>
    </div>


 {/* COUNTER DESIGN CONSOLE */}

<div className="console-card pcb-card">

   {/* PCB decorative nodes */}
  <div className="pcb-node" style={{top:"20%",left:"10%"}}></div>
  <div className="pcb-node" style={{top:"70%",left:"80%"}}></div>


  <div className="section-header">

    <div className="line"></div>

    <h2>COUNTER DESIGN CONSOLE</h2>

    <div className="line"></div>

  </div>


  <div className="console-grid">

    <div className="input-group">

      <label>State Sequence</label>

      <input
        placeholder="0 1 2 3....."
        value={sequence}
        onChange={(e)=>setSequence(e.target.value)}
      />

    </div>


    <div className="input-group">

      <label>Flip-Flop Type</label>

      <select
        value={ff}
        onChange={(e)=>setFF(e.target.value)}
      >

        <option value="D">D Flip-Flop</option>
        <option value="T">T Flip-Flop</option>
        <option value="JK">JK Flip-Flop</option>
        <option value="SR">SR Flip-Flop</option>

      </select>

    </div>


    <div className="button-wrapper">

      <button
        className="generate-btn"
        onClick={generate}
      >
        GENERATE CIRCUIT
      </button>

    </div>

  </div>

</div>


      {/* LOADING */}

        {loading && <Loader />}


      {/* RESULT SECTION */}

      {result && (

        <>

        {/* FSM + EQUATIONS */}

        <div className="fsm-card">

          <div className="fsm-section">

            <div className="fsm-header">

              <div className="line"></div>

              <h2>State Transition Diagram</h2>

              <div className="line"></div>

            </div>

            <div className="fsm-diagram">

              <FSMGraph transitions={result.transitions} />

            </div>

          </div>


          <div className="fsm-section">

            <div className="fsm-header">

              <div className="line"></div>

              <h2>Flip-Flop Excitation Equations</h2>

              <div className="line"></div>

            </div>

            <div className="equation-grid">

              {Object.entries(result.equations).map(([k,v]) => (

                <div key={k} className="equation-pill">

                  {k} = {v}

                </div>

              ))}

            </div>

          </div>

        </div>



        {/* GATE LEVEL SCHEMATICS */}

        <div className="schematic-card">

          <div className="schematic-header">

            <div className="line"></div>

            <h2>Gate-Level Schematics</h2>

            <div className="line"></div>

          </div>


          {result.diagrams.map(d => (

            <div key={d.name} className="schematic-panel">

              <div className="schematic-title">
                {d.name}
              </div>

              <div className="schematic-body">

                <img
                  src={d.url + "?t=" + new Date().getTime()}
                  alt={d.name}
                />

              </div>

            </div>

          ))}

        </div>



        {/* GENERATED HDL CODE */}

        <div className="hdl-card">

          <div className="hdl-header">

            <div className="line"></div>

            <h2>{"< >"} GENERATED HDL CODE</h2>

            <div className="line"></div>

          </div>


          <div className="hdl-grid">


            {/* VERILOG */}

            <div className="hdl-panel">

              <div className="hdl-panel-header">

                <span>Verilog Module</span>

                <div className="hdl-buttons">

                  <button onClick={() => navigator.clipboard.writeText(result.verilog)}>
                    Copy
                  </button>

                  <a
                    href="http://localhost:5000/output/fsm_auto.v"
                    download
                  >
                    Download
                  </a>

                </div>

              </div>

              <pre className="code-area">
{result.verilog}
              </pre>

            </div>



            {/* TESTBENCH */}

            <div className="hdl-panel">

              <div className="hdl-panel-header">

                <span>Testbench</span>

                <div className="hdl-buttons">

                  <button onClick={() => navigator.clipboard.writeText(result.testbench)}>
                    Copy
                  </button>

                  <a
                    href="http://localhost:5000/output/tb_fsm_auto.v"
                    download
                  >
                    Download
                  </a>

                </div>

              </div>

              <pre className="code-area">
{result.testbench}
              </pre>

            </div>

          </div>

        </div>



        {/* DOWNLOADS */}

        <div className="download-card">

          <div className="download-header">

            <div className="line"></div>

            <h2>⬇ Downloads</h2>

            <div className="line"></div>

          </div>


          <div className="download-buttons">

            <a
              href="http://localhost:5000/output/fsm_auto.v"
              className="download-btn verilog"
              download
            >
              {"</>"} Download Verilog
            </a>


            <a
              href="http://localhost:5000/output/tb_fsm_auto.v"
              className="download-btn testbench"
              download
            >
              ⚗ Download Testbench
            </a>

          </div>


          <div className="download-footer">

            <div className="line"></div>

            <p>⬇ Choose a file to download</p>

            <div className="line"></div>

          </div>

        </div>

        </>

      )}

    </div>

  )

}

export default App