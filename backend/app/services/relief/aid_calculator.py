def calculate_relief_needs(disaster_type, location_context, population):
    aid_blueprint = []
    dtype = disaster_type.lower()
    lcontext = location_context.lower()

    # --- 1. UNIVERSAL ITEMS (Har disaster ke liye zaroori) ---
    # Ration & Water
    aid_blueprint.append({
        "item": "Ration Kit (Rice, Atta, Dal, Oil, Salt, Tea)",
        "quantity": f"{population} Kits",
        "unit_cost": "₹950",
        "total_cost": population * 950,
        "source": "FCI / State Civil Supplies"
    })
    aid_blueprint.append({
        "item": "Drinking Water (2L Sealed Bottles)",
        "quantity": f"{population * 3} Units",
        "unit_cost": "₹20",
        "total_cost": population * 3 * 20,
        "source": "Rail Neer / Local Bottlers"
    })
    # Hygiene & Dignity
    aid_blueprint.append({
        "item": "Dignity Kit (Sanitary Pads, Soap, Toothbrush, Towel)",
        "quantity": f"{population // 2} Kits",
        "unit_cost": "₹450",
        "total_cost": (population // 2) * 450,
        "source": "NGOs (Goonj/Red Cross)"
    })
    # Lighting & Bedding
    aid_blueprint.append({
        "item": "Emergency Solar Lantern & Power Bank",
        "quantity": f"{population // 5} Units",
        "unit_cost": "₹800",
        "total_cost": (population // 5) * 800,
        "source": "EESL / Local Electronic Markets"
    })
    aid_blueprint.append({
        "item": "Bedding (Plastic Mat & Fleece Blanket)",
        "quantity": f"{population * 2} Units",
        "unit_cost": "₹350",
        "total_cost": population * 2 * 350,
        "source": "Handloom Centers / Local Mandi"
    })

    # --- 2. DISASTER SPECIFIC AIDS ---
    if "flood" in dtype:
        aid_blueprint.append({
            "item": "Chlorine Tablets & Water Purifiers",
            "quantity": f"{population * 20} Tablets",
            "unit_cost": "₹2",
            "total_cost": population * 20 * 2,
            "source": "Nearest PHC / Health Dept."
        })
        aid_blueprint.append({
            "item": "Emergency Boats & Life Jackets",
            "quantity": f"{max(1, population // 100)} Units",
            "unit_cost": "₹55,000",
            "total_cost": max(1, population // 100) * 55000,
            "source": "NDRF / SDRF Regional Hubs"
        })

    elif "earthquake" in dtype:
        aid_blueprint.append({
            "item": "Temporary Shelters (Prefab Tents)",
            "quantity": f"{population // 5} Tents",
            "unit_cost": "₹4,500",
            "total_cost": (population // 5) * 450,
            "source": "Govt Infrastructure Dept."
        })
        aid_blueprint.append({
            "item": "First Aid Medical Kits (Trauma Care)",
            "quantity": f"{population // 2} Kits",
            "unit_cost": "₹500",
            "total_cost": (population // 2) * 500,
            "source": "Jan Aushadhi Kendra"
        })

    # --- 3. RURAL ADD-ONS ---
    if "rural" in lcontext:
        aid_blueprint.append({
            "item": "Cattle Fodder & Livestock Support",
            "quantity": "Bulk Supply",
            "unit_cost": "Lumpsum",
            "total_cost": 30000,
            "source": "Animal Husbandry Dept."
        })

    # Total Budget Calculation
    total_budget = sum(item['total_cost'] for item in aid_blueprint if isinstance(item['total_cost'], (int, float)))

    return {
        "disaster": disaster_type.capitalize(),
        "location_type": location_context.capitalize(),
        "estimated_impact": population,
        "aid_items": aid_blueprint,
        "total_budget": f"₹{total_budget:,}",
        "official_helpline": "1070 (National), 1077 (District)",
        "extra_info": "Priority: Children under 5 and Senior Citizens. Ensure safe disposal of dignity kits."
    }