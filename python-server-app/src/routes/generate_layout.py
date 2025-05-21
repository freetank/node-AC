from flask import Blueprint, request, jsonify

generate_layout_bp = Blueprint('generate_layout', __name__)

@generate_layout_bp.route('/generate-layout', methods=['POST'])
def generate_layout():
    data = request.json
    slab_poly = data.get('slabPoly')
    name_prefix = data.get('namePrefix', 'Zone ')

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