from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

from Project_CDA_Tool import derive_equations, draw_boolean, generate_verilog, generate_testbench

app = Flask(__name__)
CORS(app)

# Serve generated diagram images
@app.route("/output/<path:filename>")
def serve_output(filename):
    return send_from_directory("output", filename)


@app.route("/generate", methods=["POST"])
def generate():

    data = request.json

    sequence = data["sequence"]
    ff_type = data["ff_type"]

    out_folder = "output"
    os.makedirs(out_folder, exist_ok=True)

    result = derive_equations(sequence, ff_type)

    equations = result["eqs"]
    transitions = result["trans"]
    num_ff = result["bits"]

    diagrams = []

    for name, expr in equations.items():

        file_path = f"{out_folder}/{name}.png"
        draw_boolean(expr, name, file_path)

        diagrams.append({
            "name": name,
            "url": f"http://localhost:5000/output/{name}.png"
        })

    verilog = generate_verilog(ff_type, list(equations.values()), num_ff, out_folder)
    testbench = generate_testbench(num_ff, out_folder)

    return jsonify({
        "equations": equations,
        "transitions": transitions,
        "diagrams": diagrams,
        "verilog": verilog,
        "testbench": testbench
    })


if __name__ == "__main__":
    app.run(debug=True)