from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
import httpx

generate_layout_bp = Blueprint('generate_layout', __name__)
 

@generate_layout_bp.route('/generate-layout', methods=['POST'])
def generate_layout():
    data = request.json
    slab_poly = data.get('slabPoly')
    name_prefix = data.get('namePrefix', 'Zone ')
    userPrompt = data.get('prompt', None)

    client = OpenAI(
        # This is the default and can be omitted
        api_key=os.environ.get("OPENAI_API_KEY"),
        http_client=httpx.Client(verify=False)
    )
    result = client.chat.completions.create (
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that only returns JSON arrays of polygons. You will be given a slab polygon and a name prefix. Return the result as a list of names and polygons like [(name1, [(x1,y1),...]),...]. No extra words."},
            {"role": "user", "content": f"name prefix: {name_prefix}, polygon: {slab_poly}, extra input: {userPrompt}"}
        ])

    print(f"OpenAI response: {result}")
    print(f"Received slabPoly: {slab_poly}")
    print(f"Received namePrefix: {name_prefix}")

    # Here you would implement the logic to generate the layout
    # For demonstration, we return mock data
    response = {
        "zonePositions": [[4, 4], [5, 5], [6, 6]],
        "zonePolygons": [[[4, 4], [5, 5], [6, 6]], [[5, 5], [6, 6], [7, 7]], [[6, 6], [7, 7], [8, 8]]],
        "zoneNames": [f"{name_prefix}1", f"{name_prefix}2", f"{name_prefix}3"]
    }

    return jsonify(response)